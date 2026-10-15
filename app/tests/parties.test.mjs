import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { test } from 'node:test'
import { createGuestStore, guestApi } from '../server/guestStore.mjs'

async function makeApi() {
  const store = createGuestStore(':memory:')
  const server = createServer((req, res) => guestApi(store)(req, res, () => { res.statusCode = 404; res.end() }))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  const guests = await Promise.all(Array.from({ length: 6 }, async () => (await fetch(`${base}/api/guest`, { method: 'POST' })).json()))
  const auth = guest => ({ Authorization: `Bearer ${guest.token}` })
  const json = { 'Content-Type': 'application/json' }
  const makeFriends = async (a, b) => {
    const request = await store.requestFriend(a.id, b.id)
    return store.acceptFriendRequest(request.requestId, b.id)
  }
  const invite = async (partyId, sender, recipient) => fetch(`${base}/api/parties/${partyId}/invitations`, {
    method: 'POST', headers: { ...auth(sender), ...json }, body: JSON.stringify({ targetGuestId: recipient.id }),
  })
  const close = () => { store.close(); server.close() }
  return { store, server, base, guests, auth, json, makeFriends, invite, close }
}

test('parties require authenticated friend invitations, consent, and the four-person limit', async () => {
  const app = await makeApi()
  const [leader, friend, stranger, fourth, fifth] = app.guests
  const { base, auth, json, makeFriends, invite } = app
  try {
    assert.equal((await fetch(`${base}/api/parties/me`)).status, 401)
    const created = await fetch(`${base}/api/parties`, { method: 'POST', headers: auth(leader) })
    assert.equal(created.status, 201)
    const { partyId } = await created.json()
    assert.equal((await invite(partyId, leader, stranger)).status, 403)
    assert.equal((await makeFriends(leader, friend)).status, 'accepted')
    const invitation = await invite(partyId, leader, friend)
    assert.equal(invitation.status, 201)
    const pending = await invitation.json()
    assert.equal(pending.expiresInSeconds, 600)
    const duplicate = await invite(partyId, leader, friend)
    assert.equal(duplicate.status, 200)
    assert.equal((await duplicate.json()).invitationId, pending.invitationId)
    assert.equal((await fetch(`${base}/api/party-invitations/${pending.invitationId}/accept`, { method: 'POST', headers: auth(leader) })).status, 403)
    assert.equal((await fetch(`${base}/api/party-invitations/${pending.invitationId}/accept`, { method: 'POST', headers: auth(friend) })).status, 200)

    for (const guest of [stranger, fourth, fifth]) await makeFriends(leader, guest)
    const third = await invite(partyId, leader, stranger)
    assert.equal(third.status, 201)
    const thirdInvite = await third.json()
    assert.equal((await fetch(`${base}/api/party-invitations/${thirdInvite.invitationId}/accept`, { method: 'POST', headers: auth(stranger) })).status, 200)
    const fourthInvite = await invite(partyId, leader, fourth)
    assert.equal(fourthInvite.status, 201)
    assert.equal((await fetch(`${base}/api/party-invitations/${(await fourthInvite.json()).invitationId}/accept`, { method: 'POST', headers: auth(fourth) })).status, 200)
    assert.equal((await invite(partyId, leader, fifth)).status, 409)
    const snapshot = await (await fetch(`${base}/api/parties/me`, { headers: auth(leader) })).json()
    assert.equal(snapshot.party.members.length, 4)
    assert.equal(snapshot.party.leaderId, leader.id)
  } finally { app.close() }
})

test('party invitations expire after ten minutes and cannot be accepted afterward', () => {
  const store = createGuestStore(':memory:')
  try {
    const leader = store.create(), invitee = store.create()
    const friendship = store.requestFriend(leader.id, invitee.id, Date.parse('2026-10-15T00:00:00.000Z'))
    store.acceptFriendRequest(friendship.requestId, invitee.id, Date.parse('2026-10-15T00:00:01.000Z'))
    const start = Date.parse('2026-10-15T00:01:00.000Z')
    const party = store.createParty(leader.id, start)
    const invitation = store.inviteToParty(party.partyId, leader.id, invitee.id, start)
    assert.equal(invitation.status, 'pending')
    assert.equal(invitation.expiresAt, new Date(start + 10 * 60 * 1000).toISOString())
    assert.equal(store.acceptPartyInvitation(invitation.invitationId, invitee.id, start + 10 * 60 * 1000 + 1).error, 'expired')
    assert.deepEqual(store.partyState(invitee.id, start + 10 * 60 * 1000 + 1).incoming, [])
  } finally { store.close() }
})

test('party leader departure transfers to the longest-present member and final departure dissolves it', () => {
  const store = createGuestStore(':memory:')
  try {
    const [leader, first, second] = Array.from({ length: 3 }, () => store.create())
    let now = Date.parse('2026-10-15T00:00:00.000Z')
    for (const member of [first, second]) {
      const friendship = store.requestFriend(leader.id, member.id, now++)
      store.acceptFriendRequest(friendship.requestId, member.id, now++)
    }
    const party = store.createParty(leader.id, now++)
    for (const member of [first, second]) {
      const invite = store.inviteToParty(party.partyId, leader.id, member.id, now++)
      assert.equal(store.acceptPartyInvitation(invite.invitationId, member.id, now++).status, 'accepted')
    }
    assert.equal(store.leaveParty(party.partyId, leader.id, now++).newLeaderId, first.id)
    assert.equal(store.partyState(first.id, now++).party.leaderId, first.id)
    assert.equal(store.leaveParty(party.partyId, first.id, now++).newLeaderId, second.id)
    assert.equal(store.leaveParty(party.partyId, second.id, now++).state, 'closed')
    assert.equal(store.partyState(second.id, now++).party, null)
  } finally { store.close() }
})

test('a party expires after 30 minutes offline and cannot be revived by reconnecting late', () => {
  const store = createGuestStore(':memory:')
  try {
    const leader = store.create()
    const events = []
    store.onPartyEvent(event => events.push(event))
    const started = Date.parse('2026-10-15T00:00:00.000Z')
    store.partySessionConnected(leader.id, started)
    const party = store.createParty(leader.id, started)
    store.partySessionDisconnected(leader.id, started + 1000)
    const lateReconnect = started + 30 * 60 * 1000 + 1001
    store.partySessionConnected(leader.id, lateReconnect)
    assert.equal(store.partyState(leader.id, lateReconnect).party, null)
    assert.equal(events.at(-1).kind, 'expired')
  } finally { store.close() }
})

test('a guest can accept a fresh invitation after leaving the same party', () => {
  const store = createGuestStore(':memory:')
  try {
    const leader = store.create(), member = store.create()
    const now = Date.parse('2026-10-15T00:00:00.000Z')
    const friendship = store.requestFriend(leader.id, member.id, now)
    store.acceptFriendRequest(friendship.requestId, member.id, now + 1)
    const party = store.createParty(leader.id, now + 2)
    const firstInvite = store.inviteToParty(party.partyId, leader.id, member.id, now + 3)
    store.acceptPartyInvitation(firstInvite.invitationId, member.id, now + 4)
    assert.equal(store.leaveParty(party.partyId, member.id, now + 5).state, 'active')
    const secondInvite = store.inviteToParty(party.partyId, leader.id, member.id, now + 6)
    assert.equal(store.acceptPartyInvitation(secondInvite.invitationId, member.id, now + 7).status, 'accepted')
    assert.equal(store.partyState(leader.id, now + 8).party.members.length, 2)
  } finally { store.close() }
})

test('a pending invite survives leadership transfer when friendship with its sender remains active', () => {
  const store = createGuestStore(':memory:')
  try {
    const leader = store.create(), member = store.create(), invitee = store.create()
    const now = Date.parse('2026-10-15T00:00:00.000Z')
    for (const friend of [member, invitee]) {
      const friendship = store.requestFriend(leader.id, friend.id, now)
      store.acceptFriendRequest(friendship.requestId, friend.id, now + 1)
    }
    const party = store.createParty(leader.id, now + 2)
    const pending = store.inviteToParty(party.partyId, leader.id, invitee.id, now + 3)
    const memberInvite = store.inviteToParty(party.partyId, leader.id, member.id, now + 4)
    store.acceptPartyInvitation(memberInvite.invitationId, member.id, now + 5)
    assert.equal(store.leaveParty(party.partyId, leader.id, now + 6).newLeaderId, member.id)
    assert.equal(store.acceptPartyInvitation(pending.invitationId, invitee.id, now + 7).status, 'accepted')
    assert.equal(store.partyState(member.id, now + 8).party.members.length, 2)
  } finally { store.close() }
})
