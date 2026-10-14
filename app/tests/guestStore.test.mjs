import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { test } from 'node:test'
import { createGuestStore, guestApi } from '../server/guestStore.mjs'

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
