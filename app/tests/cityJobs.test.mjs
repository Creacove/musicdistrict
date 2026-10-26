import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { test } from 'node:test'
import { createGuestStore, guestApi } from '../server/guestStore.mjs'

test('venue assistant job pays once after an on-site three-step setup and three minutes', async () => {
  const store = createGuestStore(':memory:')
  const connected = new Set()
  let now = Date.parse('2026-10-19T10:00:00.000Z')
  const api = guestApi(store, {
    clock: () => now,
    isGuestConnectedAtLocation: (id, location) => location === 'venue' && connected.has(id),
  })
  const server = createServer((req, res) => api(req, res, () => { res.statusCode = 404; res.end() }))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  try {
    const guest = await (await fetch(`${base}/api/guest`, { method: 'POST' })).json()
    const auth = { Authorization: `Bearer ${guest.token}`, 'Content-Type': 'application/json' }
    assert.equal((await fetch(`${base}/api/city-jobs`)).status, 401)
    const initial = await (await fetch(`${base}/api/city-jobs`, { headers: auth })).json()
    assert.equal(initial.balanceMinor, 0, 'new guests begin at ₦0')

    const jobs = `${base}/api/city-jobs`
    assert.equal((await fetch(`${jobs}/start`, { method: 'POST', headers: auth, body: JSON.stringify({ jobType: 'venue-assistant' }) })).status, 409, 'starting away from Palm Room is rejected')
    connected.add(guest.id)
    assert.equal((await fetch(`${jobs}/start`, { method: 'POST', headers: auth, body: JSON.stringify({ jobType: 'cash-grant' }) })).status, 400, 'clients cannot choose an issuance type')
    const startedResponse = await fetch(`${jobs}/start`, { method: 'POST', headers: auth, body: JSON.stringify({ jobType: 'venue-assistant' }) })
    assert.equal(startedResponse.status, 201)
    const { job } = await startedResponse.json()

    const completeUrl = `${jobs}/${job.id}/complete`
    assert.equal((await fetch(completeUrl, { method: 'POST', headers: auth })).status, 409, 'an incomplete setup cannot be paid')
    for (const stepId of ['light', 'monitors', 'backdrop']) {
      const stepResponse = await fetch(`${jobs}/${job.id}/steps`, { method: 'POST', headers: auth, body: JSON.stringify({ stepId }) })
      assert.equal(stepResponse.status, 200)
    }
    assert.equal((await fetch(`${jobs}/${job.id}/steps`, { method: 'POST', headers: auth, body: JSON.stringify({ stepId: 'mint-money' }) })).status, 400)
    now += 179_999
    const early = await fetch(completeUrl, { method: 'POST', headers: auth })
    assert.equal(early.status, 409, 'a fast scripted checklist cannot skip the three-minute job')
    assert.equal((await early.json()).error, 'too_early')

    now += 1
    const paidResponse = await fetch(completeUrl, { method: 'POST', headers: auth })
    assert.equal(paidResponse.status, 200)
    const paid = await paidResponse.json()
    assert.equal(paid.payoutMinor, 100_000)
    assert.equal(paid.balanceMinor, 100_000)
    assert.equal(paid.duplicate, false)
    const retry = await (await fetch(completeUrl, { method: 'POST', headers: auth })).json()
    assert.equal(retry.duplicate, true)
    assert.equal(retry.balanceMinor, 100_000, 'a retry never issues a second payout')

    for (let index = 0; index < 2; index += 1) {
      const next = await (await fetch(`${jobs}/start`, { method: 'POST', headers: auth, body: JSON.stringify({ jobType: 'venue-assistant' }) })).json()
      for (const stepId of ['light', 'monitors', 'backdrop']) await fetch(`${jobs}/${next.job.id}/steps`, { method: 'POST', headers: auth, body: JSON.stringify({ stepId }) })
      now += 180_000
      assert.equal((await fetch(`${jobs}/${next.job.id}/complete`, { method: 'POST', headers: auth })).status, 200)
    }
    const capped = await fetch(`${jobs}/start`, { method: 'POST', headers: auth, body: JSON.stringify({ jobType: 'venue-assistant' }) })
    assert.equal(capped.status, 409, 'the documented three-job rolling daily cap is enforced')
    const finalState = await (await fetch(jobs, { headers: auth })).json()
    assert.equal(finalState.balanceMinor, 300_000)
    assert.equal(finalState.dailyJobsCompleted, 3)
  } finally { server.close(); store.close() }
})
