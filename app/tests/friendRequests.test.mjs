import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { test } from 'node:test'
import { createGuestStore, guestApi } from '../server/guestStore.mjs'

test('friend requests require both guests to consent and are overridden by blocks', async () => {
  const store = createGuestStore(':memory:')
  const api = guestApi(store)
  const server = createServer((req, res) => api(req, res, () => { res.statusCode = 404; res.end() }))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  try {
    const alice = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
    const bob = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
    const aliceAuth = { Authorization: `Bearer ${alice.token}` }
    const bobAuth = { Authorization: `Bearer ${bob.token}` }
    const json = { 'Content-Type': 'application/json' }
    assert.equal((await fetch(`${base}/api/friends`)).status, 401)
    assert.equal((await fetch(`${base}/api/friend-requests`, { method: 'POST', headers: json, body: JSON.stringify({ targetGuestId: bob.id }) })).status, 401)

    const first = await fetch(`${base}/api/friend-requests`, { method: 'POST', headers: { ...aliceAuth, ...json }, body: JSON.stringify({ targetGuestId: bob.id }) })
    assert.equal(first.status, 201)
    const pending = await first.json()
    assert.equal(pending.status, 'pending')
    assert.equal(typeof pending.expiresAt, 'string')
    const duplicate = await fetch(`${base}/api/friend-requests`, { method: 'POST', headers: { ...aliceAuth, ...json }, body: JSON.stringify({ targetGuestId: bob.id }) })
    assert.equal(duplicate.status, 200)
    assert.equal((await duplicate.json()).requestId, pending.requestId)
    assert.equal((await (await fetch(`${base}/api/friends`, { headers: aliceAuth })).json()).outgoing[0].guestId, bob.id)
    assert.equal((await (await fetch(`${base}/api/friends`, { headers: bobAuth })).json()).incoming[0].guestId, alice.id)
    assert.equal((await fetch(`${base}/api/friend-requests/${pending.requestId}/accept`, { method: 'POST', headers: aliceAuth })).status, 403)

    const accepted = await fetch(`${base}/api/friend-requests/${pending.requestId}/accept`, { method: 'POST', headers: bobAuth })
    assert.equal(accepted.status, 200)
    assert.equal((await accepted.json()).status, 'accepted')
    assert.equal((await (await fetch(`${base}/api/friend-requests/${pending.requestId}/accept`, { method: 'POST', headers: bobAuth })).json()).status, 'accepted')
    assert.deepEqual((await (await fetch(`${base}/api/friends`, { headers: aliceAuth })).json()).friends.map(friend => friend.guestId), [bob.id])

    assert.equal((await fetch(`${base}/api/friends/${bob.id}`, { method: 'DELETE', headers: aliceAuth })).status, 200)
    const second = await (await fetch(`${base}/api/friend-requests`, { method: 'POST', headers: { ...aliceAuth, ...json }, body: JSON.stringify({ targetGuestId: bob.id }) })).json()
    assert.equal((await fetch(`${base}/api/friend-requests/${second.requestId}/decline`, { method: 'POST', headers: bobAuth })).status, 200)
    assert.equal((await fetch(`${base}/api/friend-requests`, { method: 'POST', headers: { ...aliceAuth, ...json }, body: JSON.stringify({ targetGuestId: bob.id }) })).status, 409)

    const reverse = await (await fetch(`${base}/api/friend-requests`, { method: 'POST', headers: { ...bobAuth, ...json }, body: JSON.stringify({ targetGuestId: alice.id }) })).json()
    assert.equal((await fetch(`${base}/api/friend-requests/${reverse.requestId}/accept`, { method: 'POST', headers: aliceAuth })).status, 200)
    assert.equal((await fetch(`${base}/api/blocks`, { method: 'PUT', headers: { ...aliceAuth, ...json }, body: JSON.stringify({ targetGuestId: bob.id }) })).status, 200)
    assert.deepEqual((await (await fetch(`${base}/api/friends`, { headers: aliceAuth })).json()).friends, [])
    await fetch(`${base}/api/blocks/${bob.id}`, { method: 'DELETE', headers: aliceAuth })
    assert.deepEqual((await (await fetch(`${base}/api/friends`, { headers: aliceAuth })).json()).friends, [], 'unblocking never recreates the removed friendship')
  } finally { server.close(); store.close() }
})

test('outgoing friend requests cap at 20 and pending requests expire after seven days', () => {
  const store = createGuestStore(':memory:')
  try {
    const sender = store.create()
    const recipients = Array.from({ length: 21 }, () => store.create())
    const now = Date.parse('2026-10-14T00:00:00.000Z')
    for (const recipient of recipients.slice(0, 20)) assert.equal(store.requestFriend(sender.id, recipient.id, now).status, 'pending')
    assert.equal(store.requestFriend(sender.id, recipients[20].id, now).error, 'limit')
    assert.equal(store.friendState(sender.id, now).outgoing.length, 20)
    const expiredState = store.friendState(sender.id, now + 7 * 24 * 60 * 60 * 1000 + 1)
    assert.equal(expiredState.outgoing.length, 0)
    assert.equal(store.requestFriend(sender.id, recipients[20].id, now + 7 * 24 * 60 * 60 * 1000 + 2).status, 'pending')
  } finally { store.close() }
})
