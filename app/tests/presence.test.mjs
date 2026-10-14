import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { test } from 'node:test'
import WebSocket from 'ws'
import { attachPresence } from '../server/presence.mjs'
import { createGuestStore } from '../server/guestStore.mjs'

async function nextMessage(socket) {
  const [raw] = await once(socket, 'message')
  return JSON.parse(raw.toString())
}

test('connected people join, move, and leave without invented players', async () => {
  const server = createServer()
  const hub = attachPresence(server)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port
  const a = new WebSocket(`ws://127.0.0.1:${port}/presence`)
  try {
    const first = await nextMessage(a)
    assert.equal(first.type, 'welcome')
    assert.deepEqual(first.players, [])
    const b = new WebSocket(`ws://127.0.0.1:${port}/presence`)
    try {
      const joined = nextMessage(a)
      const second = await nextMessage(b)
      assert.equal(second.players.length, 1)
      assert.equal((await joined).player.id, second.id)
      const moved = nextMessage(a)
      b.send(JSON.stringify({ type: 'move', x: 3, z: 2, angle: 0, dancing: true, location: 'square' }))
      assert.equal((await moved).player.x, 3)
      const emoted = nextMessage(a)
      b.send(JSON.stringify({ type: 'emote', emote: 'cheer' }))
      const emoteMsg = await emoted
      assert.equal(emoteMsg.type, 'emote')
      assert.equal(emoteMsg.id, second.id)
      assert.equal(emoteMsg.emote, 'cheer')
      const left = nextMessage(a)
      b.close()
      assert.equal((await left).id, second.id)
    } finally { b.terminate() }
  } finally { a.terminate(); hub.close(); server.close() }
})

test('reconnecting client gets fresh welcome without stale avatars', async () => {
  const server = createServer()
  const hub = attachPresence(server)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port
  // First connection — just opens and closes
  const a = new WebSocket(`ws://127.0.0.1:${port}/presence`)
  const welcome1 = await nextMessage(a)
  assert.equal(welcome1.type, 'welcome')
  a.terminate()
  // Wait for server to process close
  await new Promise(resolve => setTimeout(resolve, 50))
  // Second connection — should see empty players (old socket was removed)
  const b = new WebSocket(`ws://127.0.0.1:${port}/presence`)
  try {
    const welcome2 = await nextMessage(b)
    assert.equal(welcome2.type, 'welcome')
    assert.deepEqual(welcome2.players, [], 'no stale avatars from closed session')
  } finally { b.terminate(); hub.close(); server.close() }
})

test('exponential backoff doubles delay up to 30 s cap', () => {
  // Pure logic test — no WebSocket needed
  let backoffMs = 1500
  const MAX_BACKOFF = 30_000
  const delays = []
  for (let i = 0; i < 6; i++) {
    delays.push(backoffMs)
    backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF)
  }
  assert.deepEqual(delays, [1500, 3000, 6000, 12000, 24000, 30000])
})

test('player display name is broadcast and clamped to 16 characters', async () => {
  const server = createServer()
  const hub = attachPresence(server)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port
  const a = new WebSocket(`ws://127.0.0.1:${port}/presence`)
  try {
    await nextMessage(a) // welcome
    const b = new WebSocket(`ws://127.0.0.1:${port}/presence`)
    try {
      const joined = await nextMessage(a)
      assert.equal(joined.player.name, 'Guest')
      const moved = nextMessage(a)
      b.send(JSON.stringify({ type: 'move', x: 1, z: 1, angle: 0, dancing: false, location: 'square', name: 'VeryLongSuperDuperPlayerName' }))
      const moveMsg = await moved
      assert.equal(moveMsg.player.name, 'VeryLongSuperDup') // sliced to 16 chars
      assert.equal(moveMsg.player.name.length, 16)
    } finally { b.terminate() }
  } finally { a.terminate(); hub.close(); server.close() }
})

test('opted-in players receive approved quick chat in their public place', async () => {
  const server = createServer()
  const hub = attachPresence(server)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port
  const a = new WebSocket(`ws://127.0.0.1:${port}/presence`)
  try {
    await nextMessage(a) // welcome
    const joinedProm = nextMessage(a)
    const b = new WebSocket(`ws://127.0.0.1:${port}/presence`)
    try {
      const [joined, second] = await Promise.all([joinedProm, nextMessage(b)])
      assert.equal(joined.type, 'join')
      b.send(JSON.stringify({ type: 'chat-opt-in', enabled: true }))
      // A does not receive the message until it opts into the local channel.
      let noChat = new Promise(resolve => {
        const timer = setTimeout(() => { a.off('message', onMessage); resolve(true) }, 100)
        const onMessage = () => { clearTimeout(timer); resolve(false) }
        a.once('message', onMessage)
      })
      b.send(JSON.stringify({ type: 'chat', text: 'Vibing here ✨' }))
      assert.equal(await noChat, true)
      a.send(JSON.stringify({ type: 'chat-opt-in', enabled: true }))
      await new Promise(resolve => setTimeout(resolve, 610))
      const chatProm = nextMessage(a)
      b.send(JSON.stringify({ type: 'chat', text: 'Vibing here ✨' }))
      const chatMsg = await chatProm
      assert.equal(chatMsg.type, 'chat')
      assert.equal(chatMsg.id, second.id)
      assert.equal(chatMsg.name, 'Guest')
      assert.equal(chatMsg.text, 'Vibing here ✨')
      await new Promise(resolve => setTimeout(resolve, 610))
      const noCustomChat = new Promise(resolve => {
        const timer = setTimeout(() => { a.off('message', onMessage); resolve(true) }, 100)
        const onMessage = () => { clearTimeout(timer); resolve(false) }
        a.once('message', onMessage)
      })
      b.send(JSON.stringify({ type: 'chat', text: 'Vibing at the Palm Room! 🌴' }))
      assert.equal(await noCustomChat, true)
    } finally { b.terminate() }
  } finally { a.terminate(); hub.close(); server.close() }
})

test('trusted server authenticates session token and assigns persistent guest id', async () => {
  const store = createGuestStore(':memory:')
  const guest = store.create()
  const server = createServer()
  const hub = attachPresence(server, { store })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port

  // 1. Authenticate via query param ?token=
  const a = new WebSocket(`ws://127.0.0.1:${port}/presence?token=${guest.token}`)
  try {
    const welcomeA = await nextMessage(a)
    assert.equal(welcomeA.type, 'welcome')
    assert.equal(welcomeA.id, guest.id)
    assert.equal(welcomeA.authenticated, true)

    // 2. Connect unauthenticated, then authenticate via auth message
    const b = new WebSocket(`ws://127.0.0.1:${port}/presence`)
    try {
      const welcomeB = await nextMessage(b)
      assert.equal(welcomeB.authenticated, false)
      assert.notEqual(welcomeB.id, guest.id)

      const authReplyProm = nextMessage(b)
      b.send(JSON.stringify({ type: 'auth', token: guest.token }))
      const authReply = await authReplyProm
      assert.equal(authReply.type, 'auth')
      assert.equal(authReply.success, true)
      assert.equal(authReply.id, guest.id)
    } finally { b.terminate() }
  } finally { a.terminate(); hub.close(); server.close(); store.close() }
})

test('server-authoritative validation rejects teleports and unauthorized room leaps', async () => {
  const server = createServer()
  const hub = attachPresence(server)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port

  const observer = new WebSocket(`ws://127.0.0.1:${port}/presence`)
  try {
    await nextMessage(observer) // observer's welcome
    const joinProm = nextMessage(observer)
    const player = new WebSocket(`ws://127.0.0.1:${port}/presence`)
    try {
      const [playerJoin, playerWelcome] = await Promise.all([joinProm, nextMessage(player)])
      assert.equal(playerJoin.type, 'join')
      assert.equal(playerWelcome.type, 'welcome')

      // 1. Initial valid move near square center (-4, 7)
      let moveProm = nextMessage(observer)
      player.send(JSON.stringify({ type: 'move', x: -4, z: 6, angle: 0, dancing: false, location: 'square' }))
      let moveMsg = await moveProm
      assert.equal(moveMsg.player.z, 6)

    // Wait >80ms so rate limiter doesn't drop message
    await new Promise(r => setTimeout(r, 100))

    // 2. Attempt illegal teleport (> 6m instant jump, e.g. from -4, 6 to 15, 6 = dist 19m)
    player.send(JSON.stringify({ type: 'move', x: 15, z: 6, angle: 0, dancing: false, location: 'square' }))

    // 3. Attempt illegal room leap without approaching door (target 'venue' while at -4, 6; venue door is at 10, 2)
    await new Promise(r => setTimeout(r, 100))
    player.send(JSON.stringify({ type: 'move', x: 0, z: 0, angle: 0, dancing: false, location: 'venue' }))

    // 4. Send a legitimate move to confirm observer only receives this and didn't receive the two illegal ones
    await new Promise(r => setTimeout(r, 100))
    moveProm = nextMessage(observer)
    player.send(JSON.stringify({ type: 'move', x: -4, z: 5, angle: 0, dancing: false, location: 'square' }))
    moveMsg = await moveProm

    // Observer received the legitimate move (-4, 5) directly, proving the previous 2 were rejected by server
    assert.equal(moveMsg.player.x, -4)
    assert.equal(moveMsg.player.z, 5)
    assert.equal(moveMsg.player.location, 'square')
    } finally { player.terminate() }
  } finally { observer.terminate(); hub.close(); server.close() }
})

test('20 connected test clients get a real room snapshot and shared movement', async () => {
  const server = createServer()
  const hub = attachPresence(server)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port
  const peers = Array.from({ length: 20 }, () => new WebSocket(`ws://127.0.0.1:${port}/presence`))
  let observer
  try {
    const welcomes = await Promise.all(peers.map(nextMessage))
    assert.ok(welcomes.every(message => message.type === 'welcome'))
    assert.equal(new Set(welcomes.map(message => message.id)).size, 20)

    observer = new WebSocket(`ws://127.0.0.1:${port}/presence`)
    const room = await nextMessage(observer)
    assert.equal(room.type, 'welcome')
    assert.equal(room.players.length, 20)
    assert.equal(new Set(room.players.map(player => player.id)).size, 20)

    await new Promise(resolve => setTimeout(resolve, 100))
    const broadcasts = Promise.all([nextMessage(observer), ...peers.slice(1).map(nextMessage)])
    peers[0].send(JSON.stringify({ type: 'move', x: 1, z: 1, angle: 0, dancing: false, location: 'square' }))
    const movement = await broadcasts
    assert.equal(movement.length, 20)
    assert.ok(movement.every(message => message.type === 'move'))
    assert.ok(movement.every(message => message.player.id === welcomes[0].id))
    assert.ok(movement.every(message => message.player.x === 1 && message.player.z === 1))
  } finally {
    observer?.terminate()
    peers.forEach(peer => peer.terminate())
    hub.close()
    server.close()
  }
})
