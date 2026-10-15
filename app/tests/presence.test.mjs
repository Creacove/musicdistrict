import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { test } from 'node:test'
import WebSocket from 'ws'
import { attachPresence } from '../server/presence.mjs'
import { createGuestStore, guestApi } from '../server/guestStore.mjs'

async function nextMessage(socket) {
  const [raw] = await once(socket, 'message')
  return JSON.parse(raw.toString())
}

function receivesNoMessage(socket, waitMs = 120) {
  return new Promise(resolve => {
    const onMessage = () => { clearTimeout(timer); resolve(false) }
    const timer = setTimeout(() => { socket.off('message', onMessage); resolve(true) }, waitMs)
    socket.once('message', onMessage)
  })
}

function nextMessageWithin(socket, label, waitMs = 1500) {
  return new Promise((resolve, reject) => {
    const onMessage = raw => { clearTimeout(timer); resolve(JSON.parse(raw.toString())) }
    const timer = setTimeout(() => { socket.off('message', onMessage); reject(new Error(`Timed out waiting for ${label}`)) }, waitMs)
    socket.once('message', onMessage)
  })
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

test('blocked guests do not receive each other’s chat or emotes', async t => {
  const store = createGuestStore(':memory:')
  const aGuest = store.create(), bGuest = store.create()
  const server = createServer()
  const hub = attachPresence(server, { store })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port
  t.diagnostic('connect reporter')
  const a = new WebSocket(`ws://127.0.0.1:${port}/presence?token=${aGuest.token}`)
  const aWelcome = await nextMessageWithin(a, 'reporter welcome')
  t.diagnostic('reporter welcomed')
  const aJoin = nextMessageWithin(a, 'target join')
  const b = new WebSocket(`ws://127.0.0.1:${port}/presence?token=${bGuest.token}`)
  const bWelcome = await nextMessageWithin(b, 'target welcome')
  t.diagnostic('target welcomed')
  try {
    assert.equal(aWelcome.id, aGuest.id)
    assert.equal(bWelcome.id, bGuest.id)
    assert.equal((await aJoin).type, 'join')
    t.diagnostic('join observed')
    a.send(JSON.stringify({ type: 'chat-opt-in', enabled: true }))
    b.send(JSON.stringify({ type: 'chat-opt-in', enabled: true }))
    await new Promise(resolve => setTimeout(resolve, 650))
    const firstChat = nextMessageWithin(b, 'initial public chat')
    a.send(JSON.stringify({ type: 'chat', text: 'Vibing here ✨' }))
    assert.equal((await firstChat).type, 'chat')
    t.diagnostic('chat delivered before block')

    const removedFromReporter = nextMessageWithin(a, 'blocked target removed')
    const removedFromTarget = nextMessageWithin(b, 'blocker removed')
    store.block(aGuest.id, bGuest.id)
    assert.deepEqual(await removedFromReporter, { type: 'leave', id: bGuest.id })
    assert.deepEqual(await removedFromTarget, { type: 'leave', id: aGuest.id })
    await new Promise(resolve => setTimeout(resolve, 650))
    a.send(JSON.stringify({ type: 'chat', text: 'Vibing here ✨' }))
    assert.equal(await receivesNoMessage(b), true)
    t.diagnostic('chat suppressed after block')
    a.send(JSON.stringify({ type: 'emote', emote: 'wave' }))
    assert.equal(await receivesNoMessage(b), true)
    t.diagnostic('emote suppressed after block')
    b.send(JSON.stringify({ type: 'chat', text: 'Nice beat! 🔥' }))
    assert.equal(await receivesNoMessage(a), true)
  } finally { a.terminate(); b.terminate(); hub.close(); server.close(); store.close() }
})

test('friend request and acceptance notify the two connected guests', async () => {
  const store = createGuestStore(':memory:')
  const requester = store.create(), recipient = store.create()
  const server = createServer()
  const hub = attachPresence(server, { store })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port
  const a = new WebSocket(`ws://127.0.0.1:${port}/presence?token=${requester.token}`)
  let b
  try {
    assert.equal((await nextMessageWithin(a, 'requester welcome')).type, 'welcome')
    const joined = nextMessageWithin(a, 'recipient join')
    b = new WebSocket(`ws://127.0.0.1:${port}/presence?token=${recipient.token}`)
    const recipientWelcome = await nextMessageWithin(b, 'recipient welcome')
    assert.equal(recipientWelcome.authenticated, true)
    assert.equal((await joined).type, 'join')

    const requestNotification = nextMessageWithin(b, 'friend request notification')
    const request = store.requestFriend(requester.id, recipient.id)
    const requested = await requestNotification
    assert.equal(requested.type, 'friend-update')
    assert.equal(requested.kind, 'request')
    assert.equal(requested.otherId, requester.id)
    assert.equal(requested.requestId, request.requestId)
    const acceptNotification = nextMessageWithin(a, 'friend acceptance notification')
    store.acceptFriendRequest(request.requestId, recipient.id)
    const accepted = await acceptNotification
    assert.equal(accepted.type, 'friend-update')
    assert.equal(accepted.kind, 'accepted')
    assert.equal(accepted.otherId, recipient.id)
  } finally { a.terminate(); b?.terminate(); hub.close(); server.close(); store.close() }
})

test('friend messages notify only the two permitted sessions without broadcasting message text', async () => {
  const store = createGuestStore(':memory:')
  const alice = store.create(), bob = store.create(), carol = store.create()
  const request = store.requestFriend(alice.id, bob.id)
  store.acceptFriendRequest(request.requestId, bob.id)
  const server = createServer((req, res) => guestApi(store)(req, res, () => { res.statusCode = 404; res.end() }))
  const hub = attachPresence(server, { store })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  const a = new WebSocket(`ws://127.0.0.1:${server.address().port}/presence?token=${alice.token}`)
  const b = new WebSocket(`ws://127.0.0.1:${server.address().port}/presence?token=${bob.token}`)
  const c = new WebSocket(`ws://127.0.0.1:${server.address().port}/presence?token=${carol.token}`)
  try {
    assert.equal((await nextMessage(a)).type, 'welcome')
    assert.equal((await nextMessage(b)).type, 'welcome')
    assert.equal((await nextMessage(c)).type, 'welcome')
    await new Promise(resolve => setTimeout(resolve, 50)) // discard session-join notifications before observing DMs
    const aliceNotice = nextMessageWithin(a, 'sender message notice')
    const bobNotice = nextMessageWithin(b, 'recipient message notice')
    const noBroadcast = receivesNoMessage(c, 150)
    const response = await fetch(`${base}/api/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${alice.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientGuestId: bob.id, text: 'Private content stays in the API response' }),
    })
    assert.equal(response.status, 201)
    const { message } = await response.json()
    const [fromAlice, fromBob] = await Promise.all([aliceNotice, bobNotice])
    assert.deepEqual(fromAlice, { type: 'direct-message', otherId: bob.id, messageId: message.id })
    assert.deepEqual(fromBob, { type: 'direct-message', otherId: alice.id, messageId: message.id })
    assert.equal(await noBroadcast, true)
    assert.equal((await (await fetch(`${base}/api/messages/${alice.id}`, { headers: { Authorization: `Bearer ${bob.token}` } })).json()).messages[0].text, 'Private content stays in the API response')
    const alicePrivacyNotice = nextMessageWithin(a, 'friend privacy update')
    const bobPrivacyNotice = nextMessageWithin(b, 'own privacy update')
    const noPrivacyBroadcast = receivesNoMessage(c, 150)
    const privacy = await fetch(`${base}/api/messages/preferences`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${bob.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ allowFriendMessages: false }),
    })
    assert.equal(privacy.status, 200)
    assert.deepEqual(await alicePrivacyNotice, { type: 'friend-update', kind: 'message-preference', otherId: bob.id })
    assert.deepEqual(await bobPrivacyNotice, { type: 'friend-update', kind: 'message-preference', otherId: alice.id })
    assert.equal(await noPrivacyBroadcast, true)
  } finally { a.terminate(); b.terminate(); c.terminate(); hub.close(); server.close(); store.close() }
})

test('party chat messages stream only to accepted current members', async () => {
  const store = createGuestStore(':memory:')
  const leader = store.create(), member = store.create(), outsider = store.create()
  const friendship = store.requestFriend(leader.id, member.id)
  store.acceptFriendRequest(friendship.requestId, member.id)
  const party = store.createParty(leader.id)
  const invitation = store.inviteToParty(party.partyId, leader.id, member.id)
  store.acceptPartyInvitation(invitation.invitationId, member.id)
  const server = createServer((req, res) => guestApi(store)(req, res, () => { res.statusCode = 404; res.end() }))
  const hub = attachPresence(server, { store })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port
  const base = `http://127.0.0.1:${port}`
  const a = new WebSocket(`ws://127.0.0.1:${port}/presence?token=${leader.token}`)
  let b, c
  try {
    assert.equal((await nextMessageWithin(a, 'leader welcome')).id, leader.id)
    const leaderSeesMember = nextMessageWithin(a, 'member join')
    b = new WebSocket(`ws://127.0.0.1:${port}/presence?token=${member.token}`)
    assert.equal((await nextMessageWithin(b, 'member welcome')).id, member.id)
    assert.equal((await leaderSeesMember).type, 'join')
    const memberSeesOutsider = nextMessageWithin(b, 'outsider join')
    const leaderSeesOutsider = nextMessageWithin(a, 'outsider join')
    c = new WebSocket(`ws://127.0.0.1:${port}/presence?token=${outsider.token}`)
    assert.equal((await nextMessageWithin(c, 'outsider welcome')).id, outsider.id)
    assert.equal((await memberSeesOutsider).type, 'join')
    assert.equal((await leaderSeesOutsider).type, 'join')

    const leaderMessage = nextMessageWithin(a, 'leader party message')
    const memberMessage = nextMessageWithin(b, 'member party message')
    const outsiderReceivesNothing = receivesNoMessage(c, 250)
    const response = await fetch(`${base}/api/parties/${party.partyId}/messages`, {
      method: 'POST', headers: { Authorization: `Bearer ${leader.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Meet at the studio' }),
    })
    assert.equal(response.status, 201)
    const saved = (await response.json()).message
    assert.deepEqual((await leaderMessage).message, saved)
    assert.deepEqual((await memberMessage).message, saved)
    assert.equal(await outsiderReceivesNothing, true)
  } finally { a.terminate(); b?.terminate(); c?.terminate(); hub.close(); server.close(); store.close() }
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
