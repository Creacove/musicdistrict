import { defineConfig } from 'vite'
import { attachPresence } from './server/presence.mjs'
import { createGuestStore, guestApi } from './server/guestStore.mjs'
import { releaseWindowApi } from './server/releaseCalendar.mjs'
import { resolve } from 'node:path'

const store = createGuestStore(resolve(process.cwd(), 'data', 'scene-dev.sqlite'))
let presence: ReturnType<typeof attachPresence> | undefined
const api = guestApi(store, { isGuestConnectedAtLocation: (guestId, location) => presence?.isGuestConnectedAtLocation(guestId, location) ?? false })
const attach = (server: { httpServer: import('node:http').Server | null; middlewares: { use: (middleware: ReturnType<typeof guestApi>) => void } }) => {
  server.middlewares.use(releaseWindowApi)
  server.middlewares.use(api)
  if (server.httpServer) presence = attachPresence(server.httpServer, { store })
}

export default defineConfig({
  plugins: [{
    name: 'local-presence',
    configureServer: attach,
    configurePreviewServer: attach,
  }],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three'
          }
        },
      },
    },
  },
})
