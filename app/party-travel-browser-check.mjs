import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { chromium } from 'playwright'

const executable = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync)
assert.ok(executable, 'an installed Chrome or Edge browser is required')

const target = process.env.SCENE_CHECK_URL || 'http://127.0.0.1:4173/'
const browser = await chromium.launch({ headless: false, executablePath: executable })
try {
  const leaderContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
  const memberContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
  const leader = await leaderContext.newPage()
  const member = await memberContext.newPage()
  const errors = []
  const travelResponses = []
  leader.on('pageerror', error => errors.push(`leader: ${error.message}`))
  member.on('pageerror', error => errors.push(`member: ${error.message}`))
  leader.on('response', response => { if (response.url().includes('/travel-proposals')) travelResponses.push(response.status()) })

  await Promise.all([leader.goto(target, { waitUntil: 'domcontentloaded' }), member.goto(target, { waitUntil: 'domcontentloaded' })])
  await Promise.all([
    leader.waitForFunction(() => !!localStorage.getItem('scene-guest-token'), { timeout: 15000 }),
    member.waitForFunction(() => !!localStorage.getItem('scene-guest-token'), { timeout: 15000 }),
  ])
  await Promise.all([leader.locator('#nav-people').click(), member.locator('#nav-people').click()])
  await Promise.all([
    leader.waitForFunction(() => document.getElementById('presence-status')?.textContent?.includes('other connected'), { timeout: 15000 }),
    member.waitForFunction(() => document.getElementById('presence-status')?.textContent?.includes('other connected'), { timeout: 15000 }),
  ])

  const request = (page, path, method = 'GET', body) => page.evaluate(async ({ path, method, body }) => {
    const headers = { Authorization: `Bearer ${localStorage.getItem('scene-guest-token')}` }
    if (body !== undefined) headers['Content-Type'] = 'application/json'
    const response = await fetch(path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
    return { status: response.status, data: await response.json() }
  }, { path, method, body })
  const [leaderGuest, memberGuest] = await Promise.all([
    request(leader, '/api/guest', 'POST'), request(member, '/api/guest', 'POST'),
  ])
  const leaderId = leaderGuest.data.id, memberId = memberGuest.data.id
  assert.notEqual(leaderId, memberId)

  const friendRequest = await request(leader, '/api/friend-requests', 'POST', { targetGuestId: memberId })
  assert.equal(friendRequest.status, 201)
  assert.equal((await request(member, `/api/friend-requests/${friendRequest.data.requestId}/accept`, 'POST')).status, 200)
  const party = await request(leader, '/api/parties', 'POST')
  assert.equal(party.status, 201)
  const invitation = await request(leader, `/api/parties/${party.data.partyId}/invitations`, 'POST', { targetGuestId: memberId })
  assert.equal(invitation.status, 201)
  assert.equal((await request(member, `/api/party-invitations/${invitation.data.invitationId}/accept`, 'POST')).status, 200)

  await Promise.all([leader.reload(), member.reload()])
  await Promise.all([leader.locator('#nav-people').click(), member.locator('#nav-people').click()])
  await Promise.all([
    leader.waitForFunction(() => document.getElementById('presence-status')?.textContent?.includes('other connected'), { timeout: 15000 }),
    member.waitForFunction(() => document.getElementById('presence-status')?.textContent?.includes('other connected'), { timeout: 15000 }),
  ])
  await Promise.all([
    leader.locator('[data-party-travel-form]').waitFor({ state: 'visible', timeout: 10000 }),
    member.waitForFunction(() => document.getElementById('party-overview')?.textContent?.includes('2/4 guests'), { timeout: 10000 }),
  ])

  await leader.locator('[data-party-destination]').selectOption('studio')
  await leader.locator('[data-party-travel-form] button[type="submit"]').click()
  await leader.getByText('Walk together · City Studio').waitFor({ timeout: 20000 })
  await member.getByText('Walk together · City Studio').waitFor({ timeout: 20000 })
  await member.locator('[data-party-travel-vote="approve"]').click()
  await leader.locator('[data-party-travel-vote="approve"]').click()
  const reservedText = 'Shared room reserved · 0/2 guests there · 2 places held.'
  await Promise.all([
    leader.getByText(reservedText).waitFor({ timeout: 10000 }),
    member.getByText(reservedText).waitFor({ timeout: 10000 }),
  ])
  await leader.screenshot({ path: '../docs/evidence/local-party-travel-reserved-mobile.png', fullPage: true })

  const enterStudio = async page => {
    await page.locator('[data-party-travel-route="studio"]').click()
    await page.waitForFunction(() => document.getElementById('route')?.hidden === false, { timeout: 10000 })
    await page.waitForFunction(() => document.getElementById('route-distance')?.textContent?.startsWith('In reach'), { timeout: 30000 })
    await page.locator('#interact').click()
    await page.waitForFunction(() => document.getElementById('action-title')?.textContent === 'City Studio', { timeout: 5000 })
    await page.locator('#action-primary').click()
    await page.waitForFunction(() => document.getElementById('game')?.dataset.location === 'studio', { timeout: 10000 })
  }
  await enterStudio(leader)
  await expectArrivals(leader, 1)
  await Promise.all([
    waitForPartyStatus(leader, '1/2 guests there · 1 place held'),
    waitForPartyStatus(member, '1/2 guests there · 1 place held'),
  ])
  await enterStudio(member)
  await expectArrivals(leader, 2)
  await Promise.all([
    waitForPartyStatus(leader, '2/2 guests there · group together'),
    waitForPartyStatus(member, '2/2 guests there · group together'),
  ])
  await leader.waitForFunction(() => document.getElementById('scene-name')?.textContent === 'CITY STUDIO', { timeout: 10000 })
  await leader.waitForTimeout(800)
  await leader.screenshot({ path: '../docs/evidence/local-party-travel-shared-studio-mobile.png', fullPage: true })

  assert.deepEqual(errors, [], 'both mobile players should complete the trip without browser errors')
  assert.deepEqual(travelResponses, [201, 200], 'the browser flow should create one route and record the final approval')
  const finalState = await request(leader, '/api/parties/me')
  assert.equal(finalState.data.party.travelAssignment.arrivedMembers, 2)
  console.log(JSON.stringify({ leaderId, memberId, destination: 'City Studio', arrivedMembers: 2, errors, travelResponses }))

  async function expectArrivals(page, count) {
    await page.waitForFunction(async count => {
      const response = await fetch('/api/parties/me', { headers: { Authorization: `Bearer ${localStorage.getItem('scene-guest-token')}` } })
      if (!response.ok) return false
      const data = await response.json()
      return data.party?.travelAssignment?.arrivedMembers === count
    }, count, { timeout: 10000 })
  }
  async function waitForPartyStatus(page, text) {
    await page.waitForFunction(text => document.getElementById('party-overview')?.textContent?.includes(text), text, { timeout: 10000 })
  }
} finally {
  await browser.close()
}
