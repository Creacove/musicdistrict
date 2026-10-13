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
    assert.equal((await fetch(`${base}/api/saves`)).status, 401)
    assert.equal((await fetch(`${base}/api/saves/square-sketch`, { method: 'PUT', headers: auth })).status, 200)
    assert.equal((await fetch(`${base}/api/saves/square-sketch`, { method: 'PUT', headers: auth })).status, 200)
    const resumed = await (await fetch(`${base}/api/guest`, { method: 'POST', headers: auth })).json()
    assert.equal(resumed.id, guest.id)
    assert.deepEqual(resumed.saves, ['square-sketch'])
  } finally { server.close(); store.close() }
})
