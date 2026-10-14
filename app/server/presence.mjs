import { randomUUID } from 'node:crypto'
import { WebSocketServer, WebSocket } from 'ws'

const QUICK_CHAT_PHRASES = Object.freeze([
  'Yo! 👋',
  'Nice beat! 🔥',
  'Heading to Studio 🎧',
  'Meet at Palm Room 🌴',
  'Vibing here ✨',
  'Check out the sound! 🎶',
])

export function isAllowedQuickChatPhrase(text) {
  return typeof text === 'string' && QUICK_CHAT_PHRASES.includes(text)
}

export function isPublicZoneChatRecipient(sender, recipient) {
  return sender.chatOptIn === true && recipient.chatOptIn === true && sender.location === recipient.location
}

const DOORWAYS = {
  square: [
    { target: 'studio', x: 13, z: -8 },
    { target: 'venue', x: 10, z: 2 },
    { target: 'release', x: -13, z: -8 },
  ],
  venue: [{ target: 'square', x: -10, z: 9 }],
  studio: [{ target: 'square', x: -10, z: 9 }],
  release: [{ target: 'square', x: -10, z: 9 }],
}

export function attachPresence(httpServer, { store } = {}) {
  const wss = new WebSocketServer({ server: httpServer, path: '/presence', maxPayload: 256 })
  const players = new Map()
  const send = (socket, message) => { if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message)) }
  const broadcast = (message, except) => { for (const socket of players.keys()) if (socket !== except) send(socket, message) }
  wss.on('connection', (socket, req) => {
    let id = randomUUID()
    let authenticated = false
    try {
      const url = new URL(req?.url || '/', 'http://localhost')
      const token = url.searchParams.get('token')
      if (store && token) {
        const guestId = store.resume(token)
        if (guestId) { id = guestId; authenticated = true }
      }
    } catch { /* ignore URL parse error */ }

    const player = { id, name: 'Guest', x: -4, z: 7, angle: 0, dancing: false, emote: null, location: 'square', chatOptIn: false, authenticated }
    send(socket, { type: 'welcome', id, authenticated, players: [...players.values()] })
    players.set(socket, player)
    broadcast({ type: 'join', player }, socket)
    let lastMove = 0
    let lastChat = 0
    socket.on('message', raw => {
      let message
      try { message = JSON.parse(raw.toString()) } catch { return }
      if (message?.type === 'auth') {
        const { token } = message
        if (store && typeof token === 'string') {
          const guestId = store.resume(token)
          if (guestId) {
            player.id = id = guestId
            player.authenticated = authenticated = true
            send(socket, { type: 'auth', success: true, id })
            broadcast({ type: 'move', player }, socket)
          } else {
            send(socket, { type: 'auth', success: false })
          }
        }
        return
      }
      if (message?.type === 'chat-opt-in') {
        if (typeof message.enabled === 'boolean') player.chatOptIn = message.enabled
        return
      }
      if (message?.type === 'chat') {
        if (Date.now() - lastChat < 600) return
        lastChat = Date.now()
        const { text } = message
        if (!isAllowedQuickChatPhrase(text)) return
        const trimmed = text.trim()
        if (!player.chatOptIn || !trimmed || trimmed.length > 40) return
        const chat = { type: 'chat', id, name: player.name || 'Guest', text: trimmed }
        for (const [recipientSocket, recipient] of players) {
          if (isPublicZoneChatRecipient(player, recipient)) send(recipientSocket, chat)
        }
        return
      }
      if (message?.type === 'emote') {
        const { emote } = message
        if (typeof emote !== 'string' || !['cheer', 'wave', 'heart', 'fire'].includes(emote)) return
        player.emote = emote
        for (const [recipientSocket, recipient] of players) {
          if (recipient.location === player.location) send(recipientSocket, { type: 'emote', id, emote })
        }
        return
      }
      if (message?.type !== 'move' || Date.now() - lastMove < 80) return
      const { x, z, angle, dancing, location, name } = message
      if (![x, z, angle].every(Number.isFinite) || typeof dancing !== 'boolean' || !['square', 'venue', 'studio', 'release'].includes(location)) return
      const bounds = location === 'square' ? { x: 19, z: 16 } : { x: 12, z: 12 }
      if (Math.abs(x) > bounds.x || Math.abs(z) > bounds.z || Math.abs(angle) > Math.PI * 4) return

      // Authoritative position & speed validation
      const now = Date.now()
      if (lastMove > 0 && location === player.location) {
        const dt = (now - lastMove) / 1000
        const dist = Math.hypot(x - player.x, z - player.z)
        const maxDist = Math.max(10.0 * dt, 6.0)
        if (dist > maxDist) return // reject speedhack / teleport across map
      }

      // Authoritative room transition validation
      if (location !== player.location) {
        const doors = DOORWAYS[player.location] || []
        const validDoor = doors.some(d => d.target === location && Math.hypot(player.x - d.x, player.z - d.z) <= 5.5)
        if (!validDoor) return // reject impossible room leap without reaching doorway
      }

      const sanitizedName = typeof name === 'string' && name.trim() ? name.trim().slice(0, 16) : player.name
      Object.assign(player, { x, z, angle, dancing, location, name: sanitizedName })
      lastMove = now
      broadcast({ type: 'move', player }, socket)
    })
    socket.on('close', () => { players.delete(socket); broadcast({ type: 'leave', id }) })
  })
  return wss
}
