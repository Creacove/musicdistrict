import { randomUUID } from 'node:crypto'
import { WebSocketServer, WebSocket } from 'ws'

export function attachPresence(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: '/presence', maxPayload: 256 })
  const players = new Map()
  const send = (socket, message) => { if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message)) }
  const broadcast = (message, except) => { for (const socket of players.keys()) if (socket !== except) send(socket, message) }
  wss.on('connection', socket => {
    const id = randomUUID()
    const player = { id, x: -4, z: 7, angle: 0, dancing: false, location: 'square' }
    send(socket, { type: 'welcome', id, players: [...players.values()] })
    players.set(socket, player)
    broadcast({ type: 'join', player }, socket)
    let lastMove = 0
    socket.on('message', raw => {
      let message
      try { message = JSON.parse(raw.toString()) } catch { return }
      if (message?.type !== 'move' || Date.now() - lastMove < 80) return
      const { x, z, angle, dancing, location } = message
      if (![x, z, angle].every(Number.isFinite) || typeof dancing !== 'boolean' || !['square', 'venue', 'studio', 'release'].includes(location)) return
      const bounds = location === 'square' ? { x: 19, z: 16 } : { x: 12, z: 12 }
      if (Math.abs(x) > bounds.x || Math.abs(z) > bounds.z || Math.abs(angle) > Math.PI * 4) return
      Object.assign(player, { x, z, angle, dancing, location })
      lastMove = Date.now()
      broadcast({ type: 'move', player }, socket)
    })
    socket.on('close', () => { players.delete(socket); broadcast({ type: 'leave', id }) })
  })
  return wss
}
