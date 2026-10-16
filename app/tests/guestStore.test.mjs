import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { test } from 'node:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createGuestStore, guestApi } from '../server/guestStore.mjs'

test('private Palm Room event drafts require a guest and never reserve a venue', async () => {
  const store = createGuestStore(':memory:')
  const api = guestApi(store)
  const server = createServer((req, res) => api(req, res, () => { res.statusCode = 404; res.end() }))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  try {
    const owner = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
    const other = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
    const input = { title: 'Friday Open Mic', format: 'OPEN_MIC', start: '2026-10-23T19:00' }
    assert.equal((await fetch(`${base}/api/event-draft`)).status, 401)
    assert.equal((await fetch(`${base}/api/event-draft`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })).status, 401)
    const auth = { Authorization: `Bearer ${owner.token}`, 'Content-Type': 'application/json' }
    assert.equal((await fetch(`${base}/api/event-draft`, { method: 'PUT', headers: auth, body: JSON.stringify({ ...input, format: 'FESTIVAL' }) })).status, 400)
    const saved = await (await fetch(`${base}/api/event-draft`, { method: 'PUT', headers: auth, body: JSON.stringify(input) })).json()
    assert.deepEqual({ title: saved.draft.title, format: saved.draft.format, start: saved.draft.start, status: saved.draft.status }, { ...input, status: 'DRAFT' })
    assert.equal(saved.draft.venueId, 'palm-room')
    assert.deepEqual((await (await fetch(`${base}/api/event-draft`, { headers: { Authorization: `Bearer ${other.token}` } })).json()).draft, null)
    assert.equal((await (await fetch(`${base}/api/event-draft`, { headers: auth })).json()).draft.title, input.title)
  } finally { server.close(); store.close() }
})

test('private event draft survives SQLite restart for its guest', () => {
  const dir = mkdtempSync(join(tmpdir(), 'scene-draft-'))
  const path = join(dir, 'scene.sqlite')
  try {
    const first = createGuestStore(path)
    const guest = first.create()
    first.saveEventDraft(guest.id, { title: 'Listening Night', format: 'LISTENING_SESSION', start: '2026-11-01T20:00' })
    first.close()
    const reopened = createGuestStore(path)
    assert.equal(reopened.resume(guest.token), guest.id)
    assert.equal(reopened.eventDraft(guest.id).title, 'Listening Night')
    reopened.close()
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test('Palm Room draft performer invitations require explicit guest acceptance', async () => {
  const store = createGuestStore(':memory:')
  const connectedAtVenue = new Set()
  const api = guestApi(store, { isGuestConnectedAtLocation: (id, location) => location === 'venue' && connectedAtVenue.has(id) })
  const server = createServer((req, res) => api(req, res, () => { res.statusCode = 404; res.end() }))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  try {
    const owner = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
    const performer = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
    const stranger = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
    const ownerAuth = { Authorization: `Bearer ${owner.token}`, 'Content-Type': 'application/json' }
    const performerAuth = { Authorization: `Bearer ${performer.token}`, 'Content-Type': 'application/json' }
    const save = await fetch(`${base}/api/event-draft`, { method: 'PUT', headers: ownerAuth, body: JSON.stringify({ title: 'Friday Open Mic', format: 'OPEN_MIC', start: '2026-10-23T19:00' }) })
    assert.equal(save.status, 200)
    const invitations = `${base}/api/event-draft/invitations`
    assert.equal((await fetch(invitations, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetGuestId: performer.id }) })).status, 401)
    assert.equal((await fetch(invitations, { method: 'POST', headers: ownerAuth, body: JSON.stringify({ targetGuestId: owner.id }) })).status, 400)
    const offline = await fetch(invitations, { method: 'POST', headers: ownerAuth, body: JSON.stringify({ targetGuestId: stranger.id }) })
    assert.equal(offline.status, 409, 'an offline guest cannot be invited through the API')
    connectedAtVenue.add(performer.id)
    store.block(performer.id, owner.id)
    assert.equal((await fetch(invitations, { method: 'POST', headers: ownerAuth, body: JSON.stringify({ targetGuestId: performer.id }) })).status, 403, 'a guest who blocked the organiser cannot be invited')
    store.unblock(performer.id, owner.id)
    const invited = await fetch(invitations, { method: 'POST', headers: ownerAuth, body: JSON.stringify({ targetGuestId: performer.id }) })
    assert.equal(invited.status, 201)
    const invitation = await invited.json()
    assert.equal(invitation.invitation.status, 'invited')
    assert.equal((await fetch(invitations, { method: 'POST', headers: ownerAuth, body: JSON.stringify({ targetGuestId: performer.id }) })).status, 409)
    const incoming = await (await fetch(`${base}/api/event-planning`, { headers: performerAuth })).json()
    assert.equal(incoming.planning.invitations[0].title, 'Friday Open Mic')
    assert.equal(incoming.planning.invitations[0].status, 'invited')
    assert.deepEqual((await (await fetch(`${base}/api/event-planning`, { headers: { Authorization: `Bearer ${stranger.token}` } })).json()).planning.invitations, [])
    store.block(owner.id, performer.id)
    assert.equal((await fetch(`${invitations}/${invitation.invitation.invitationId}/response`, { method: 'POST', headers: performerAuth, body: JSON.stringify({ decision: 'accept' }) })).status, 403, 'a blocked invitation cannot be accepted')
    store.unblock(owner.id, performer.id)
    const response = await fetch(`${invitations}/${invitation.invitation.invitationId}/response`, { method: 'POST', headers: performerAuth, body: JSON.stringify({ decision: 'accept' }) })
    assert.equal(response.status, 200)
    assert.equal((await response.json()).invitation.status, 'accepted')
    const ownerView = await (await fetch(`${base}/api/event-planning`, { headers: { Authorization: `Bearer ${owner.token}` } })).json()
    assert.equal(ownerView.planning.performers[0].status, 'accepted')
    assert.equal((await fetch(`${invitations}/${invitation.invitation.invitationId}/response`, { method: 'POST', headers: performerAuth, body: JSON.stringify({ decision: 'decline' }) })).status, 409)
  } finally { server.close(); store.close() }
})

test('guest save is authenticated, idempotent and resumes from SQLite', async () => {
  const store = createGuestStore(':memory:')
  const api = guestApi(store)
  const server = createServer((req, res) => api(req, res, () => { res.statusCode = 404; res.end() }))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  try {
    const createdResponse = await fetch(`${base}/api/guest`, { method: 'POST' })
    assert.equal(createdResponse.status, 201)
    const guest = await createdResponse.json()
    const auth = { Authorization: `Bearer ${guest.token}` }
    const catalogueRes = await fetch(`${base}/api/catalogue`)
    assert.equal(catalogueRes.status, 200)
    const { tracks } = await catalogueRes.json()
    assert.equal(tracks.length >= 2, true)
    assert.equal(tracks[0].id, 'square-sketch')

    assert.equal((await fetch(`${base}/api/saves`)).status, 401)
    assert.equal((await fetch(`${base}/api/saves/square-sketch`, { method: 'PUT', headers: auth })).status, 200)
    assert.equal((await fetch(`${base}/api/saves/square-sketch`, { method: 'PUT', headers: auth })).status, 200)
    assert.equal((await fetch(`${base}/api/saves/non-existent`, { method: 'PUT', headers: auth })).status, 404)
    const resumed = await (await fetch(`${base}/api/guest`, { method: 'POST', headers: auth })).json()
    assert.equal(resumed.id, guest.id)
    assert.deepEqual(resumed.saves, ['square-sketch'])

    // Remove save test
    const deleteRes = await fetch(`${base}/api/saves/square-sketch`, { method: 'DELETE', headers: auth })
    assert.equal(deleteRes.status, 200)
    assert.deepEqual((await deleteRes.json()).saves, [])
  } finally { server.close(); store.close() }
})

test('reports require a guest, stay private, and are rate limited', async () => {
  const store = createGuestStore(':memory:')
  const api = guestApi(store)
  const server = createServer((req, res) => api(req, res, () => { res.statusCode = 404; res.end() }))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  try {
    const reporter = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
    const target = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
    const body = { targetGuestId: target.id, reason: 'harassment', details: 'Repeated unwanted messages.' }
    const json = { 'Content-Type': 'application/json' }
    assert.equal((await fetch(`${base}/api/reports`, { method: 'POST', headers: json, body: JSON.stringify(body) })).status, 401)
    const auth = { ...json, Authorization: `Bearer ${reporter.token}` }
    assert.equal((await fetch(`${base}/api/reports`, { method: 'POST', headers: auth, body: JSON.stringify({ ...body, reason: 'invented' }) })).status, 400)

    const first = await fetch(`${base}/api/reports`, { method: 'POST', headers: auth, body: JSON.stringify(body) })
    assert.equal(first.status, 201)
    const accepted = await first.json()
    assert.equal(accepted.status, 'received')
    assert.equal('targetGuestId' in accepted, false)
    const stored = store.getReport(accepted.id)
    assert.equal(stored.reporterId, reporter.id)
    assert.equal(stored.targetGuestId, target.id)
    assert.equal(stored.reason, body.reason)
    assert.equal(stored.details, body.details)
    assert.equal((await fetch(`${base}/api/reports/${accepted.id}`, { headers: { Authorization: `Bearer ${reporter.token}` } })).status, 404)

    for (let i = 0; i < 4; i++) assert.equal((await fetch(`${base}/api/reports`, { method: 'POST', headers: auth, body: JSON.stringify(body) })).status, 201)
    assert.equal((await fetch(`${base}/api/reports`, { method: 'POST', headers: auth, body: JSON.stringify(body) })).status, 429)
  } finally { server.close(); store.close() }
})

test('guest blocks are authenticated, directional, self-safe, and reversible', async () => {
  const store = createGuestStore(':memory:')
  const api = guestApi(store)
  const server = createServer((req, res) => api(req, res, () => { res.statusCode = 404; res.end() }))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  try {
    const reporter = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
    const target = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
    const auth = { Authorization: `Bearer ${reporter.token}`, 'Content-Type': 'application/json' }
    const body = JSON.stringify({ targetGuestId: target.id })
    assert.equal((await fetch(`${base}/api/blocks`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body })).status, 401)
    assert.equal((await fetch(`${base}/api/blocks`, { method: 'PUT', headers: auth, body: JSON.stringify({ targetGuestId: reporter.id }) })).status, 400)
    assert.equal((await fetch(`${base}/api/blocks`, { method: 'PUT', headers: auth, body })).status, 200)
    assert.equal(store.isBlocked(reporter.id, target.id), true)
    assert.equal(store.isBlocked(target.id, reporter.id), false)
    assert.deepEqual((await (await fetch(`${base}/api/blocks`, { headers: { Authorization: `Bearer ${reporter.token}` } })).json()).blockedIds, [target.id])
    assert.equal((await fetch(`${base}/api/blocks/${target.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${reporter.token}` } })).status, 200)
    assert.equal(store.isBlocked(reporter.id, target.id), false)
  } finally { server.close(); store.close() }
})
