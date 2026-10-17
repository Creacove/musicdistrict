import assert from 'node:assert/strict'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { chromium } from 'playwright'

const executable = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync)
assert.ok(executable, 'an installed Chrome or Edge browser is required')

const target = process.env.SCENE_CHECK_URL || 'https://musicdistrict.netlify.app/'
const evidence = resolve('../docs/evidence/netlify-my-music-playlist-mobile.png')
const browser = await chromium.launch({ headless: false, executablePath: executable })
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(target, { waitUntil: 'domcontentloaded' })
  await page.locator('#nav-phone').waitFor()
  await page.evaluate(() => localStorage.setItem('scene-saved-tracks', JSON.stringify(['square-sketch'])))
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.locator('#nav-phone').click()
  await page.getByRole('heading', { name: 'My Music' }).waitFor()
  await page.locator('.music-saved-row').getByText('Square Sketch').waitFor()
  await page.locator('#playlist-name').fill('Weekend Warm Up')
  await page.locator('#playlist-create-form button[type="submit"]').click()
  const card = page.locator('.music-playlist-card').filter({ has: page.getByRole('heading', { name: 'Weekend Warm Up' }) })
  await card.waitFor()
  const playlistId = await page.locator('.music-playlist-card').first().locator('[data-playlist-id]').first().getAttribute('data-playlist-id')
  assert.ok(playlistId)
  const picker = page.locator(`#playlist-add-${playlistId}`)
  await picker.selectOption('square-sketch')
  await card.getByRole('button', { name: 'Add song' }).click()
  await card.getByText('Square Sketch').waitFor()
  await picker.selectOption('lagos-golden-hour')
  await card.getByRole('button', { name: 'Add song' }).click()
  await card.getByText('Golden Hour Jam').waitFor()
  await card.getByRole('button', { name: 'Move Golden Hour Jam up' }).click()
  await page.waitForFunction(id => {
    const article = [...document.querySelectorAll('.music-playlist-card')].find(item => item.querySelector(`[data-playlist-id="${id}"]`))
    return article?.querySelector('.playlist-track-row .music-track-copy b')?.textContent === 'Golden Hour Jam'
  }, playlistId)
  await card.getByRole('button', { name: 'Rename' }).click()
  await page.locator('.playlist-rename-form input').fill('Lagos Weekend')
  await page.locator('.playlist-rename-form button[type="submit"]').click()
  await page.getByRole('heading', { name: 'Lagos Weekend' }).waitFor()
  mkdirSync(dirname(evidence), { recursive: true })
  await page.screenshot({ path: evidence, fullPage: false })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.locator('#nav-phone').click()
  await page.getByRole('heading', { name: 'Lagos Weekend' }).waitFor()
  assert.deepEqual(await page.locator('.music-playlist-card .playlist-track-row .music-track-copy b').allTextContents(), ['Golden Hour Jam', 'Square Sketch'])
  await page.locator('#music-device-settings').click()
  await page.locator('#display-sheet').waitFor({ state: 'visible' })
  assert.deepEqual(errors, [])
  console.log(JSON.stringify({ url: target, viewport: '390x844', playlist: 'Lagos Weekend', tracks: ['Golden Hour Jam', 'Square Sketch'], storage: 'private to this browser device', persistedAfterReload: true, errors, evidence }))
  await context.close()
} finally { await browser.close() }
