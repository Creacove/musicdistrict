import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { chromium } from 'playwright'

const installedBrowser = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Users/USER/AppData/Local/Google/Chrome/Application/chrome.exe',
  'C:/Users/USER/AppData/Local/Microsoft/Edge/Application/msedge.exe',
].find(existsSync)

assert.ok(installedBrowser, 'an installed Chrome or Edge browser is required for this live check')
const browser = await chromium.launch({ headless: false, executablePath: installedBrowser })
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const pageErrors = []
  page.on('pageerror', error => pageErrors.push(error.message))
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle', timeout: 30000 })
  const canvasCount = await page.locator('canvas').count()
  assert.ok(canvasCount > 0, 'the 3D game canvas should render')
  assert.deepEqual(pageErrors, [], 'the browser should not report page errors')
  await page.screenshot({ path: '../docs/evidence/music-square-camera-stage-mobile.png', fullPage: true })
  console.log(JSON.stringify({ url: page.url(), title: await page.title(), canvasCount, pageErrors }))
} finally {
  await browser.close()
}
