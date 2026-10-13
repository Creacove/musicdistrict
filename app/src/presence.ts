export type PresencePlayer = { id: string; x: number; z: number; angle: number; dancing: boolean; location: 'square' | 'venue' | 'studio' | 'release' }
type Message = { type: 'welcome'; id: string; players: PresencePlayer[] } | { type: 'join' | 'move'; player: PresencePlayer } | { type: 'leave'; id: string }

export function connectPresence(onPlayers: (players: PresencePlayer[], connected: boolean) => void) {
  const players = new Map<string, PresencePlayer>()
  let socket: WebSocket | null = null
  let ownId = ''
  let closed = false
  let retry: number | undefined
  const notify = () => onPlayers([...players.values()], socket?.readyState === WebSocket.OPEN)
  function connect() {
    if (closed) return
    socket = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/presence`)
    socket.onmessage = event => {
      let message: Message
      try { message = JSON.parse(event.data) } catch { return }
      if (message.type === 'welcome') { ownId = message.id; players.clear(); for (const player of message.players) players.set(player.id, player) }
      if (message.type === 'join' || message.type === 'move') { if (message.player.id !== ownId) players.set(message.player.id, message.player) }
      if (message.type === 'leave') players.delete(message.id)
      notify()
    }
    socket.onopen = notify
    socket.onclose = () => { players.clear(); notify(); if (!closed) retry = window.setTimeout(connect, 1500) }
    socket.onerror = () => socket?.close()
  }
  connect()
  return {
    send(player: Omit<PresencePlayer, 'id'>) { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'move', ...player })) },
    close() { closed = true; window.clearTimeout(retry); socket?.close() },
  }
}
