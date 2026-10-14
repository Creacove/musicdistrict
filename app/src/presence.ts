export type EmoteType = 'cheer' | 'wave' | 'heart' | 'fire'
export type PresencePlayer = { id: string; name?: string; x: number; z: number; angle: number; dancing: boolean; emote?: EmoteType | null; location: 'square' | 'venue' | 'studio' | 'release' }
type Message =
  | { type: 'welcome'; id: string; players: PresencePlayer[] }
  | { type: 'join' | 'move'; player: PresencePlayer }
  | { type: 'leave'; id: string }
  | { type: 'emote'; id: string; emote: EmoteType }
  | { type: 'chat'; id: string; name: string; text: string }

export function connectPresence(
  onPlayers: (players: PresencePlayer[], connected: boolean, reconnectAttempts: number) => void,
  onEmote?: (id: string, emote: EmoteType) => void,
  onChat?: (id: string, name: string, text: string) => void,
  token?: string,
) {
  const players = new Map<string, PresencePlayer>()
  let socket: WebSocket | null = null
  let ownId = ''
  let closed = false
  let retry: number | undefined
  let reconnectAttempts = 0
  let backoffMs = 1500
  let chatOptIn = false
  const MAX_BACKOFF = 30_000
  const notify = () => onPlayers([...players.values()], socket?.readyState === WebSocket.OPEN, reconnectAttempts)
  function connect() {
    if (closed) return
    const url = new URL(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/presence`)
    const authToken = token || (typeof localStorage !== 'undefined' ? localStorage.getItem('scene-guest-token') : null)
    if (authToken) url.searchParams.set('token', authToken)
    socket = new WebSocket(url.toString())
    socket.onmessage = event => {
      let message: Message
      try { message = JSON.parse(event.data) } catch { return }
      if (message.type === 'welcome') { ownId = message.id; players.clear(); for (const player of message.players) players.set(player.id, player) }
      if (message.type === 'join' || message.type === 'move') { if (message.player.id !== ownId) players.set(message.player.id, message.player) }
      if (message.type === 'leave') players.delete(message.id)
      if (message.type === 'emote') {
        const p = players.get(message.id)
        if (p) p.emote = message.emote
        onEmote?.(message.id, message.emote)
      }
      if (message.type === 'chat') {
        onChat?.(message.id, message.name, message.text)
      }
      notify()
    }
    socket.onopen = () => {
      reconnectAttempts = 0; backoffMs = 1500
      socket?.send(JSON.stringify({ type: 'chat-opt-in', enabled: chatOptIn }))
      notify()
    }
    socket.onclose = () => {
      players.clear()
      if (!closed) {
        reconnectAttempts++
        notify()
        retry = window.setTimeout(() => { backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF); connect() }, backoffMs)
      } else {
        notify()
      }
    }
    socket.onerror = () => socket?.close()
  }
  connect()
  return {
    send(player: Omit<PresencePlayer, 'id'>) { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'move', ...player })) },
    sendEmote(emote: EmoteType) { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'emote', emote })) },
    setChatOptIn(enabled: boolean) {
      chatOptIn = enabled
      if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'chat-opt-in', enabled }))
    },
    sendChat(text: string) { if (chatOptIn && socket?.readyState === WebSocket.OPEN && text.trim()) socket.send(JSON.stringify({ type: 'chat', text: text.trim().slice(0, 40) })) },
    auth(authToken: string) { if (socket?.readyState === WebSocket.OPEN && authToken) socket.send(JSON.stringify({ type: 'auth', token: authToken })) },
    getOwnId() { return ownId },
    close() { closed = true; window.clearTimeout(retry); socket?.close() },
  }
}
