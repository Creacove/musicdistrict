import { defineConfig } from 'vite'
import { attachPresence } from './server/presence.mjs'

export default defineConfig({
  plugins: [{
    name: 'local-presence',
    configureServer(server) { if (server.httpServer) attachPresence(server.httpServer) },
    configurePreviewServer(server) { if (server.httpServer) attachPresence(server.httpServer) },
  }],
})
