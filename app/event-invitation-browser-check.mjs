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
  const ownerContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const performerContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const owner = await ownerContext.newPage()
  const performer = await performerContext.newPage()
  const errors = []
  owner.on('pageerror', error => errors.push(`organiser: ${error.message}`))
  performer.on('pageerror', error => errors.push(`performer: ${error.message}`))

  await Promise.all([
    owner.goto(target, { waitUntil: 'domcontentloaded' }),
    performer.goto(target, { waitUntil: 'domcontentloaded' }),
  ])
  await Promise.all([
    owner.waitForFunction(() => !!localStorage.getItem('scene-guest-token'), { timeout: 15000 }),
    performer.waitForFunction(() => !!localStorage.getItem('scene-guest-token'), { timeout: 15000 }),
  ])
  const guestId = page => page.evaluate(async () => {
    const token = localStorage.getItem('scene-guest-token')
    const response = await fetch('/api/guest', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    return (await response.json()).id
  })
  const [ownerId, performerId] = await Promise.all([guestId(owner), guestId(performer)])
  assert.notEqual(ownerId, performerId)

  const enterPalmRoom = async page => {
    await page.locator('#map-button').click()
    await page.locator('#map-places [data-map-target="palmEntrance"]').click()
    await page.waitForFunction(() => document.getElementById('route-distance')?.textContent?.startsWith('In reach'), { timeout: 25000 })
    await page.locator('#interact').click()
    await page.waitForFunction(() => document.getElementById('action-title')?.textContent === 'Palm Room', { timeout: 5000 })
    await page.locator('#action-primary').click()
    await page.locator('#venue-card').waitFor({ state: 'visible', timeout: 10000 })
  }
  await Promise.all([enterPalmRoom(owner), enterPalmRoom(performer)])

  await owner.locator('#view-setup').click()
  await owner.locator('#context').waitFor({ state: 'visible', timeout: 20000 })
  await owner.locator('#interact').click()
  await owner.locator('#show-draft-form').waitFor({ state: 'visible' })
  await owner.locator('#show-draft-form [name="title"]').fill('Friday Community Open Mic')
  await owner.locator('#show-draft-form [name="format"]').selectOption('OPEN_MIC')
  const futureStart = new Date(Date.now() + 48 * 60 * 60 * 1000)
  const localStart = new Date(futureStart.getTime() - futureStart.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
  await owner.locator('#show-draft-form [name="start"]').fill(localStart)
  await owner.locator('#show-draft-form button[type="submit"]').click()
  await owner.getByText(/Saved privately to your guest session/).waitFor({ timeout: 10000 })
  await owner.locator('#show-invite-form [name="target"]').selectOption(performerId)
  await owner.locator('#show-invite-form button[type="submit"]').click()
  await owner.getByText('Waiting for reply').waitFor({ timeout: 10000 })

  await performer.locator('#desk-trigger').click()
  await performer.locator('.desk-tabs [data-tab="plans"]').click()
  const accept = performer.locator('[data-event-response="accept"]')
  await accept.waitFor({ state: 'visible', timeout: 10000 })
  await accept.click()
  await performer.getByText('You accepted · draft lineup').waitFor({ timeout: 10000 })
  await owner.getByText('Accepted · draft lineup').waitFor({ timeout: 12000 })

  assert.deepEqual(errors, [], 'both players should complete the flow without browser errors')
  await owner.screenshot({ path: '../docs/evidence/local-palm-room-performer-invite-mobile.png', fullPage: true })
  await performer.screenshot({ path: '../docs/evidence/local-open-mic-performer-plan-mobile.png', fullPage: true })
  console.log(JSON.stringify({ ownerId, performerId, title: 'Friday Community Open Mic', performerStatus: 'accepted', errors }))
} finally {
  await browser.close()
}
