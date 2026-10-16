import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const target = process.env.SCENE_CHECK_URL || 'http://127.0.0.1:4173/'
const browser = await chromium.launch({ headless: false, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
try {
  const a = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const b = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const first = await a.newPage()
  const second = await b.newPage()
  const errors = []
  first.on('pageerror', error => errors.push(error.message))
  second.on('pageerror', error => errors.push(error.message))
  await Promise.all([first.goto(target, { waitUntil: 'domcontentloaded' }), second.goto(target, { waitUntil: 'domcontentloaded' })])
  await Promise.all([first.locator('#nav-people').click(), second.locator('#nav-people').click()])
  const ownId = page => page.evaluate(async () => {
    const token = localStorage.getItem('scene-guest-token')
    const response = await fetch('/api/guest', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    return (await response.json()).id
  })
  const [firstId, secondId] = await Promise.all([ownId(first), ownId(second)])
  assert.notEqual(firstId, secondId)
  await Promise.all([
    first.locator(`#people-list [data-player-id="${secondId}"]`).waitFor({ state: 'visible', timeout: 25000 }),
    second.locator(`#people-list [data-player-id="${firstId}"]`).waitFor({ state: 'visible', timeout: 25000 }),
  ])
  assert.equal(await first.locator('#people-list [role="listitem"]').count(), 1, 'first guest sees exactly the other authenticated guest')
  assert.equal(await second.locator('#people-list [role="listitem"]').count(), 1, 'second guest sees exactly the other authenticated guest')
  assert.deepEqual(errors, [])
  await first.screenshot({ path: '../docs/evidence/local-shared-music-square-mobile.png', fullPage: true })
  console.log('Two distinct guests see each other in Music Square')
} finally { await browser.close() }
