import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { attachPresence } from './presence.mjs'
import { createGuestStore, guestApi } from './guestStore.mjs'
import { releaseWindowApi } from './releaseCalendar.mjs'

const appRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const distRoot = resolve(appRoot, 'dist')
const dataPath = process.env.SCENE_DB_PATH || resolve(appRoot, 'data', 'scene.sqlite')
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2' }

export function createSceneServer({ databasePath = dataPath, staticRoot = distRoot } = {}) {
  const root = resolve(staticRoot)
  if (!existsSync(resolve(root, 'index.html'))) throw new Error(`Built game missing at ${root}. Run npm run build first.`)
  const store = createGuestStore(databasePath)
  let presence
  const api = guestApi(store, {
    isGuestConnectedAtLocation: (guestId, location) => presence?.isGuestConnectedAtLocation(guestId, location) ?? false,
    getPartyTravelAssignment: guestId => presence?.getPartyTravelAssignment(guestId) ?? null,
  })
  const server = createServer((req, res) => {
    releaseWindowApi(req, res, () => api(req, res, () => {
      if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405).end(); return }
      let pathname
      try { pathname = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname) } catch { res.writeHead(400).end(); return }
      if (pathname.includes('\u0000') || pathname.includes('\\')) { res.writeHead(400).end(); return }
      const requested = resolve(root, `.${pathname}`)
      if (requested !== root && !requested.startsWith(root + sep)) { res.writeHead(403).end(); return }
      let file = requested
      if (!existsSync(file) || !statSync(file).isFile()) {
        if (extname(pathname)) { res.writeHead(404).end(); return }
        file = resolve(root, 'index.html')
      }
      res.setHeader('Content-Type', `${mime[extname(file)] || 'application/octet-stream'}; charset=utf-8`)
      res.setHeader('Cache-Control', file.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000, immutable')
      if (req.method === 'HEAD') { res.writeHead(200).end(); return }
      createReadStream(file).on('error', () => { if (!res.headersSent) res.writeHead(500); res.end() }).pipe(res)
    }))
  })
  presence = attachPresence(server, { store })
  return { server, close: () => new Promise((resolveClose, reject) => {
    for (const client of presence.clients) client.terminate()
    presence.close(() => server.close(error => {
      store.close()
      if (error) reject(error)
      else resolveClose()
    }))
  }) }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173)
  const host = process.env.HOST || '127.0.0.1'
  createSceneServer().server.listen(port, host, () => console.log(`THE SCENE at http://${host}:${port}/`))
}
