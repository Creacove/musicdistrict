import { defineConfig } from 'vite'
import { attachPresence } from './server/presence.mjs'
import { createGuestStore, guestApi } from './server/guestStore.mjs'
import { resolve } from 'node:path'

const store = createGuestStore(resolve(process.cwd(), 'data', 'scene-dev.sqlite'))
const attach = (server: { httpServer: import('node:http').Server | null; middlewares: { use: (middleware: ReturnType<typeof guestApi>) => void } }) => {
  server.middlewares.use(guestApi(store))
  if (server.httpServer) attachPresence(server.httpServer)
}

export default defineConfig({
  plugins: [{
    name: 'local-presence',
    configureServer: attach,
    configurePreviewServer: attach,
  }],
})
