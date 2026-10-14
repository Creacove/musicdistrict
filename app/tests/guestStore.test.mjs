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
