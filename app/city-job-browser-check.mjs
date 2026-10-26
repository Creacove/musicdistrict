import assert from 'node:assert/strict'
import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { chromium } from 'playwright'

const executable = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync)
assert.ok(executable, 'an installed Chrome or Edge browser is required')

const target = process.env.SCENE_CHECK_URL || 'http://127.0.0.1:4173/'
const output = resolve('..', 'docs', 'evidence', 'local-venue-assistant-job-mobile.png')
const walletOutput = resolve('..', 'docs', 'evidence', 'local-simulation-wallet-hud-mobile.png')
mkdirSync(resolve(output, '..'), { recursive: true })
const browser = await chromium.launch({ headless: false, executablePath: executable })
let keepOpen = process.env.SCENE_KEEP_BROWSER === '1'
if (keepOpen) process.once('SIGINT', () => { void browser.close().finally(() => process.exit(0)) })
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })

  await page.goto(target, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => !!localStorage.getItem('scene-guest-token'), { timeout: 15_000 })
  await page.waitForFunction(() => document.getElementById('wallet-balance')?.textContent === '₦0', { timeout: 10_000 })
  await page.screenshot({ path: walletOutput })
  await page.locator('#map-button').click()
  await page.locator('#map-places [data-map-target="palmEntrance"]').click()
  await page.waitForFunction(() => document.getElementById('route-distance')?.textContent?.startsWith('In reach'), { timeout: 25_000 })
  await page.locator('#interact').click()
  await page.waitForFunction(() => document.getElementById('action-title')?.textContent === 'Palm Room', { timeout: 5_000 })
  await page.locator('#action-primary').click()
  await page.locator('#venue-card').waitFor({ state: 'visible', timeout: 10_000 })
  await page.locator('#view-setup').click()
  await page.locator('#context').waitFor({ state: 'visible', timeout: 20_000 })
  await page.locator('#interact').click()
  await page.locator('#show-draft-form').waitFor({ state: 'visible' })
  await page.waitForFunction(() => document.getElementById('presence-status')?.textContent?.includes('connected sessions here'), { timeout: 10_000 })

  const balance = await page.locator('#city-job-balance').textContent()
  assert.match(balance || '', /₦0/, 'a new player should start at zero simulation balance')
  await page.locator('#city-job-start').waitFor({ state: 'visible' })
  await page.waitForFunction(() => !document.getElementById('city-job-start')?.disabled, { timeout: 10_000 })
  await page.locator('#city-job-start').click()
  await page.waitForFunction(() => document.getElementById('city-job-status')?.textContent?.includes('0/3 setup actions checked'), { timeout: 10_000 })
  for (const step of ['light', 'monitors', 'backdrop']) {
    await page.locator(`[data-stage-setup="${step}"]`).click()
    const completed = step === 'light' ? 1 : step === 'monitors' ? 2 : 3
    await page.waitForFunction(count => document.getElementById('city-job-status')?.textContent?.includes(`${count}/3 setup actions checked`), completed, { timeout: 10_000 })
  }

  const state = await page.evaluate(async () => {
    const token = localStorage.getItem('scene-guest-token')
    const response = await fetch('/api/city-jobs', { headers: { Authorization: `Bearer ${token}` } })
    return { status: response.status, body: await response.json() }
  })
  assert.equal(state.status, 200)
  assert.equal(state.body.balanceMinor, 0)
  assert.deepEqual(state.body.activeJob.completedSteps, ['light', 'monitors', 'backdrop'])
  assert.deepEqual(errors, [], 'the live 3D job flow should not produce browser errors')
  await page.screenshot({ path: output })
  console.log(JSON.stringify({ target, screenshots: [walletOutput, output], viewport: '390x844', room: 'Palm Room', job: 'venue-assistant', steps: state.body.activeJob.completedSteps, payoutReadyInSeconds: state.body.activeJob.remainingSeconds, balanceMinor: state.body.balanceMinor, errors }))

  if (keepOpen) await new Promise(() => {})
} catch (error) {
  keepOpen = false
  throw error
} finally {
  if (!keepOpen) await browser.close()
}
