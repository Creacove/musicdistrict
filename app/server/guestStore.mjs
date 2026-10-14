import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const hash = token => createHash('sha256').update(token).digest('hex')
export function createGuestStore(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true })
  const db = new DatabaseSync(path)
  db.exec(`PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS guests (id TEXT PRIMARY KEY, token_hash TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS saved_items (guest_id TEXT NOT NULL REFERENCES guests(id), item_id TEXT NOT NULL, saved_at TEXT NOT NULL, PRIMARY KEY (guest_id, item_id));`)
  const find = db.prepare('SELECT id FROM guests WHERE token_hash = ?')
  const create = db.prepare('INSERT INTO guests (id, token_hash, created_at) VALUES (?, ?, ?)')
  const save = db.prepare('INSERT OR IGNORE INTO saved_items (guest_id, item_id, saved_at) VALUES (?, ?, ?)')
  const list = db.prepare('SELECT item_id FROM saved_items WHERE guest_id = ? ORDER BY saved_at')
  const remove = db.prepare('DELETE FROM saved_items WHERE guest_id = ? AND item_id = ?')
  return {
    resume(token) { return typeof token === 'string' && /^[a-f0-9]{64}$/.test(token) ? find.get(hash(token))?.id ?? null : null },
    create() { const id = randomUUID(), token = randomBytes(32).toString('hex'); create.run(id, hash(token), new Date().toISOString()); return { id, token } },
    saves(id) { return list.all(id).map(row => row.item_id) },
    save(id, item) {
      if (!CATALOGUE.some(c => c.id === item)) return false
      save.run(id, item, new Date().toISOString())
      return true
    },
    removeSave(id, item) {
      remove.run(id, item)
      return true
    },
    close() { db.close() },
  }
}

const CATALOGUE = [
  { id: 'square-sketch', title: 'Square Sketch', artist: 'THE SCENE Originals', genre: 'Afrobeats / Demo', duration: 30, released: true },
  { id: 'lagos-golden-hour', title: 'Golden Hour Jam', artist: 'Victoria Island Collective', genre: 'Afro-fusion', duration: 30, released: true },
]

export function guestApi(store) {
  return (req, res, next) => {
    if (req.url === '/api/catalogue' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      return res.end(JSON.stringify({ tracks: CATALOGUE }))
    }
    if (!req.url?.startsWith('/api/guest') && !req.url?.startsWith('/api/saves')) return next()
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    const reply = (status, body) => { res.statusCode = status; res.end(JSON.stringify(body)) }
    const token = req.headers.authorization?.match(/^Bearer ([a-f0-9]{64})$/)?.[1]
    if (req.url === '/api/guest' && req.method === 'POST') {
      const id = token && store.resume(token)
      if (id) return reply(200, { id, token, saves: store.saves(id) })
      return reply(201, { ...store.create(), saves: [] })
    }
    const id = token && store.resume(token)
    if (!id) return reply(401, { error: 'Guest session required' })
    if (req.url === '/api/saves' && req.method === 'GET') return reply(200, { saves: store.saves(id) })
    const saveMatch = req.url.match(/^\/api\/saves\/([a-z0-9-]+)$/)
    if (saveMatch && req.method === 'PUT') {
      const trackId = saveMatch[1]
      const ok = store.save(id, trackId)
      if (!ok) return reply(404, { error: 'Track not found in catalogue' })
      return reply(200, { saves: store.saves(id) })
    }
    if (saveMatch && req.method === 'DELETE') {
      const trackId = saveMatch[1]
      store.removeSave(id, trackId)
      return reply(200, { saves: store.saves(id) })
    }
    return reply(404, { error: 'Unknown route' })
  }
}
