import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { test } from 'node:test'
import { createGuestStore, guestApi } from '../server/guestStore.mjs'

async function startApi() {
  const store = createGuestStore(':memory:')
  const server = createServer((req, res) => guestApi(store)(req, res, () => { res.statusCode = 404; res.end() }))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  const alice = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
  const bob = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
  const carol = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
  const auth = guest => ({ Authorization: `Bearer ${guest.token}` })
  const json = { 'Content-Type': 'application/json' }
  const makeFriends = async () => {
    const request = await fetch(`${base}/api/friend-requests`, { method: 'POST', headers: { ...auth(alice), ...json }, body: JSON.stringify({ targetGuestId: bob.id }) })
    const { requestId } = await request.json()
    return fetch(`${base}/api/friend-requests/${requestId}/accept`, { method: 'POST', headers: auth(bob) })
  }
  return { store, server, base, alice, bob, carol, auth, json, makeFriends, close: () => { store.close(); server.close() } }
}

test('friend messages require an active mutual friendship and stay private to its pair', async () => {
  const app = await startApi()
  const { base, alice, bob, carol, auth, json, makeFriends } = app
  try {
    assert.equal((await fetch(`${base}/api/messages/${bob.id}`)).status, 401)
    const payload = JSON.stringify({ recipientGuestId: bob.id, text: 'Nice groove 👋' })
    assert.equal((await fetch(`${base}/api/messages`, { method: 'POST', headers: { ...auth(alice), ...json }, body: payload })).status, 403)
    assert.equal((await makeFriends()).status, 200)
    assert.equal((await (await fetch(`${base}/api/friends`, { headers: auth(alice) })).json()).friends[0].canMessage, true)

    const send = await fetch(`${base}/api/messages`, { method: 'POST', headers: { ...auth(alice), ...json }, body: payload })
    assert.equal(send.status, 201)
    const { message } = await send.json()
    assert.equal(message.senderGuestId, alice.id)
    assert.equal(message.recipientGuestId, bob.id)
    assert.equal(message.text, 'Nice groove 👋')
    assert.equal(typeof message.sentAt, 'string')

    for (const viewer of [alice, bob]) {
      const history = await fetch(`${base}/api/messages/${viewer === alice ? bob.id : alice.id}`, { headers: auth(viewer) })
      assert.equal(history.status, 200)
      assert.deepEqual((await history.json()).messages.map(item => item.id), [message.id])
    }
    assert.equal((await fetch(`${base}/api/messages/${bob.id}`, { headers: auth(carol) })).status, 403)
    assert.equal((await fetch(`${base}/api/friends/${bob.id}`, { method: 'DELETE', headers: auth(alice) })).status, 200)
    assert.equal((await fetch(`${base}/api/messages/${bob.id}`, { headers: auth(alice) })).status, 403)
  } finally { app.close() }
})

test('message privacy settings, blocks, and input limits are enforced by the server', async () => {
  const app = await startApi()
  const { base, alice, bob, auth, json, makeFriends } = app
  try {
    await makeFriends()
    const initial = await fetch(`${base}/api/messages/preferences`, { headers: auth(bob) })
    assert.deepEqual(await initial.json(), { allowFriendMessages: true })

    const disabled = await fetch(`${base}/api/messages/preferences`, { method: 'PUT', headers: { ...auth(bob), ...json }, body: JSON.stringify({ allowFriendMessages: false }) })
    assert.equal(disabled.status, 200)
    assert.deepEqual(await disabled.json(), { allowFriendMessages: false })
    assert.equal((await (await fetch(`${base}/api/friends`, { headers: auth(alice) })).json()).friends[0].canMessage, false)
    const payload = text => JSON.stringify({ recipientGuestId: bob.id, text })
    assert.equal((await fetch(`${base}/api/messages`, { method: 'POST', headers: { ...auth(alice), ...json }, body: payload('Hello') })).status, 403)
    assert.equal((await fetch(`${base}/api/messages`, { method: 'POST', headers: { ...auth(bob), ...json }, body: payload('   ') })).status, 400)
    assert.equal((await fetch(`${base}/api/messages`, { method: 'POST', headers: { ...auth(bob), ...json }, body: payload('x'.repeat(501)) })).status, 400)

    await fetch(`${base}/api/blocks`, { method: 'PUT', headers: { ...auth(alice), ...json }, body: JSON.stringify({ targetGuestId: bob.id }) })
    assert.equal((await fetch(`${base}/api/messages`, { method: 'POST', headers: { ...auth(alice), ...json }, body: payload('After block') })).status, 403)
    assert.equal((await fetch(`${base}/api/messages/${bob.id}`, { headers: auth(alice) })).status, 403)
  } finally { app.close() }
})

test('direct messages enforce a per-sender rate limit and expire that limit after one minute', () => {
  const store = createGuestStore(':memory:')
  try {
    const alice = store.create(), bob = store.create()
    const request = store.requestFriend(alice.id, bob.id)
    assert.equal(store.acceptFriendRequest(request.requestId, bob.id).status, 'accepted')
    const start = Date.parse('2026-10-14T00:00:00.000Z')
    for (let i = 0; i < 20; i++) assert.equal(store.sendDirectMessage(alice.id, bob.id, `Beat ${i}`, start + i * 1000).status, 'sent')
    assert.equal(store.sendDirectMessage(alice.id, bob.id, 'Too fast', start + 30_000).error, 'rate_limited')
    assert.equal(store.sendDirectMessage(alice.id, bob.id, 'Back again', start + 60_001).status, 'sent')
  } finally { store.close() }
})
