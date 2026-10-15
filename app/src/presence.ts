export type EmoteType = 'cheer' | 'wave' | 'heart' | 'fire'
export type FriendUpdateKind = 'request' | 'accepted' | 'declined' | 'cancelled' | 'unfriended' | 'blocked' | 'message-preference'
export type PartyUpdateKind = 'created' | 'invited' | 'joined' | 'declined' | 'left' | 'closed' | 'expired' | 'invitation-cancelled'
export type PresencePlayer = { id: string; name?: string; authenticated?: boolean; x: number; z: number; angle: number; dancing: boolean; emote?: EmoteType | null; location: 'square' | 'venue' | 'studio' | 'release' }
type Message =
  | { type: 'welcome'; id: string; players: PresencePlayer[] }
  | { type: 'join' | 'move'; player: PresencePlayer }
  | { type: 'leave'; id: string }
  | { type: 'emote'; id: string; emote: EmoteType }
  | { type: 'chat'; id: string; name: string; text: string }
  | { type: 'auth'; success: boolean; id?: string }
  | { type: 'friend-update'; kind: FriendUpdateKind; otherId: string; requestId?: string }
  | { type: 'direct-message'; otherId: string; messageId: string }
  | { type: 'party-update'; kind: PartyUpdateKind; partyId: string; invitationId?: string; otherId?: string }

const SOLO_PREVIEW = import.meta.env?.VITE_SCENE_DEMO_MODE === 'true'

export function connectPresence(
  onPlayers: (players: PresencePlayer[], connected: boolean, reconnectAttempts: number) => void,
  onEmote?: (id: string, emote: EmoteType) => void,
  onChat?: (id: string, name: string, text: string) => void,
  onFriendUpdate?: (kind: FriendUpdateKind, otherId: string) => void,
  onDirectMessage?: (otherId: string, messageId: string) => void,
  onPartyUpdate?: (kind: PartyUpdateKind, partyId: string, otherId?: string) => void,
  token?: string,
) {
  const players = new Map<string, PresencePlayer>()
  if (SOLO_PREVIEW) {
    onPlayers([], false, 0)
    return {
      send(_player: Omit<PresencePlayer, 'id'>) {},
      sendEmote(_emote: EmoteType) {},
      setChatOptIn(_enabled: boolean) {},
      sendChat(_text: string) {},
      auth(_authToken: string) {},
      getOwnId() { return '' },
      close() {},
    }
  }
  let socket: WebSocket | null = null
  let ownId = ''
  let closed = false
  let retry: number | undefined
  let reconnectAttempts = 0
  let backoffMs = 1500
  let chatOptIn = false
  let pendingAuth = false
  let authToken = token || (typeof localStorage !== 'undefined' ? localStorage.getItem('scene-guest-token') || '' : '')
  const MAX_BACKOFF = 30_000
  const notify = () => onPlayers([...players.values()], socket?.readyState === WebSocket.OPEN, reconnectAttempts)
  function connect() {
    if (closed) return
    const url = new URL(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/presence`)
    if (authToken) url.searchParams.set('token', authToken)
    socket = new WebSocket(url.toString())
    socket.onmessage = event => {
      let message: Message
      try { message = JSON.parse(event.data) } catch { return }
      if (message.type === 'welcome') { ownId = message.id; players.clear(); for (const player of message.players) players.set(player.id, player) }
      if (message.type === 'auth' && message.success && message.id) ownId = message.id
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
      if (message.type === 'friend-update') onFriendUpdate?.(message.kind, message.otherId)
      if (message.type === 'direct-message') onDirectMessage?.(message.otherId, message.messageId)
      if (message.type === 'party-update') onPartyUpdate?.(message.kind, message.partyId, message.otherId)
      notify()
    }
    socket.onopen = () => {
      reconnectAttempts = 0; backoffMs = 1500
      socket?.send(JSON.stringify({ type: 'chat-opt-in', enabled: chatOptIn }))
      if (pendingAuth && authToken) { socket?.send(JSON.stringify({ type: 'auth', token: authToken })); pendingAuth = false }
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
    auth(nextToken: string) {
      authToken = nextToken
      if (!authToken) return
      if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'auth', token: authToken }))
      else pendingAuth = true
    },
    getOwnId() { return ownId },
    close() { closed = true; window.clearTimeout(retry); socket?.close() },
  }
}
