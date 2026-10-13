import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { test } from 'node:test'
import WebSocket from 'ws'
import { attachPresence } from '../server/presence.mjs'

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
      const left = nextMessage(a)
      b.close()
      assert.equal((await left).id, second.id)
    } finally { b.terminate() }
  } finally { a.terminate(); hub.close(); server.close() }
})
