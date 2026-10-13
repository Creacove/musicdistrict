import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { once } from 'node:events'
import WebSocket from 'ws'
import { createSceneServer } from '../server/start.mjs'

test('built game serves its page, guest save API, and live presence', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'scene-server-'))
  const staticRoot = join(directory, 'dist')
  mkdirSync(staticRoot)
  writeFileSync(join(staticRoot, 'index.html'), '<title>THE SCENE</title>')
  const app = createSceneServer({ databasePath: join(directory, 'guest.sqlite'), staticRoot })
  try {
    app.server.listen(0, '127.0.0.1')
    await once(app.server, 'listening')
    const base = `http://127.0.0.1:${app.server.address().port}`
    const page = await fetch(base)
    assert.equal(page.status, 200)
    assert.match(await page.text(), /THE SCENE/)
    assert.equal((await fetch(base + '/assets/missing.js')).status, 404)
    const guest = await fetch(base + '/api/guest', { method: 'POST' })
    assert.equal(guest.status, 201)
    const { token } = await guest.json()
    const save = await fetch(base + '/api/saves/square-sketch', { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
    assert.deepEqual((await save.json()).saves, ['square-sketch'])
    const socket = new WebSocket(base.replace('http', 'ws') + '/presence')
    const [message] = await once(socket, 'message')
    assert.equal(JSON.parse(message.toString()).type, 'welcome')
    socket.close()
  } finally {
    await app.close()
    rmSync(directory, { recursive: true, force: true })
  }
})
