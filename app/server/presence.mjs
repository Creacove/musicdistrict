import { randomUUID } from 'node:crypto'
import { WebSocketServer, WebSocket } from 'ws'
import { createRuntimeRoomDirectory } from './roomInstances.mjs'

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

export function isPublicZoneChatRecipient(sender, recipient, store) {
  return sender.chatOptIn === true && recipient.chatOptIn === true && sender.location === recipient.location && !store?.isBlockedBetween(sender.id, recipient.id)
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
const PARTY_DESTINATION_LOCATIONS = Object.freeze({ studio: 'studio', palmEntrance: 'venue', releaseEntrance: 'release', kiosk: 'square' })

export function attachPresence(httpServer, { store } = {}) {
  const wss = new WebSocketServer({ server: httpServer, path: '/presence', maxPayload: 256 })
  const players = new Map()
  const roomDirectory = createRuntimeRoomDirectory()
  wss.roomDirectory = roomDirectory
  wss.isGuestConnectedAtLocation = (guestId, location) => [...players.values()].some(player => player.id === guestId && player.authenticated && player.location === location)
  const partyTravelAssignments = new Map()
  let closing = false
  const send = (socket, message) => { if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message)) }
  const isBlockedBetween = (a, b) => {
    if (closing) return false
    try { return store?.isBlockedBetween(a, b) ?? false } catch { return false }
  }
  const broadcast = (message, except, source) => {
    for (const [socket, recipient] of players) {
      if (socket === except) continue
      if (source && recipient.instanceId !== source.instanceId) continue
      if (source && isBlockedBetween(source.id, recipient.id)) continue
      send(socket, message)
    }
  }
  const preferredPartyInstances = (guestId, location) => {
    if (!store || typeof guestId !== 'string') return []
    try {
      const memberIds = new Set(store.partyState(guestId)?.party?.members?.map(member => member.guestId) || [])
      if (!memberIds.size) return []
      const assigned = partyTravelAssignments.get(store.partyState(guestId)?.party?.partyId)
      const preferred = assigned?.location === location && assigned.instanceId ? [assigned.instanceId] : []
      return [...new Set([...preferred, ...[...players.values()]
        .filter(other => memberIds.has(other.id) && other.location === location)
        .map(other => other.instanceId)
        .filter(Boolean)])]
    } catch { return [] }
  }
  const updatePartyTravelAssignment = event => {
    if (!store || !event?.partyId) return
    const previous = partyTravelAssignments.get(event.partyId)
    const state = (event.memberIds || []).map(guestId => store.partyState(guestId)).find(result => result.party?.partyId === event.partyId)
    const proposal = state?.party?.travelProposal
    if (!proposal || proposal.status !== 'approved') {
      if (previous?.reserved) roomDirectory.cancelReservation(previous.proposalId)
      partyTravelAssignments.delete(event.partyId)
      return
    }
    if (previous?.proposalId === proposal.proposalId) return
    if (previous?.reserved) roomDirectory.cancelReservation(previous.proposalId)
    const location = PARTY_DESTINATION_LOCATIONS[proposal.destinationId]
    const memberIds = state.party.members.map(member => member.guestId)
    const presentAtTarget = [...players.entries()]
      .filter(([, player]) => memberIds.includes(player.id) && player.location === location)
      .map(([sessionId, player]) => ({ ...player, sessionId }))
    const presentInstances = [...new Set(presentAtTarget.map(player => player.instanceId))]
    if (presentInstances.length > 1) {
      partyTravelAssignments.set(event.partyId, { partyId: event.partyId, proposalId: proposal.proposalId, destinationId: proposal.destinationId, location, groupSize: memberIds.length, expiresAt: proposal.expiresAt, error: 'party_split_in_destination' })
      return
    }
    const alreadyArrivedGuests = presentAtTarget.map(player => ({ guestId: player.id, sessionId: player.sessionId }))
    const preferred = presentInstances.length
      ? presentInstances
      : preferredPartyInstances(memberIds[0], location)
    const reserved = roomDirectory.reserveGroup(proposal.proposalId, location, memberIds, preferred, proposal.expiresAt, alreadyArrivedGuests)
    if (reserved.error) {
      partyTravelAssignments.set(event.partyId, { partyId: event.partyId, proposalId: proposal.proposalId, destinationId: proposal.destinationId, location, groupSize: memberIds.length, expiresAt: proposal.expiresAt, error: reserved.error })
      return
    }
    partyTravelAssignments.set(event.partyId, {
      partyId: event.partyId,
      proposalId: proposal.proposalId,
      destinationId: proposal.destinationId,
      location,
      spaceId: reserved.spaceId,
      instanceId: reserved.instanceId,
      groupSize: reserved.groupSize,
      expiresAt: reserved.expiresAt,
      reserved: true,
    })
  }
  wss.getPartyTravelAssignment = guestId => {
    if (!store) return null
    const party = store.partyState(guestId).party
    const proposal = party?.travelProposal
    const assignment = party && partyTravelAssignments.get(party.partyId)
    if (!proposal || proposal.status !== 'approved' || !assignment || assignment.proposalId !== proposal.proposalId) return null
    const reservation = assignment.reserved ? roomDirectory.reservation(assignment.proposalId) : null
    return {
      proposalId: assignment.proposalId,
      destinationId: assignment.destinationId,
      location: assignment.location,
      spaceId: assignment.spaceId || null,
      instanceId: assignment.instanceId || null,
      groupSize: assignment.groupSize,
      arrivedMembers: reservation?.arrivedMembers || 0,
      remainingMembers: reservation?.remainingMembers || 0,
      reservedSlots: reservation?.reservedSlots || 0,
      expiresAt: assignment.expiresAt,
      error: assignment.error || null,
    }
  }
  const notifyPartyTravelProgress = guestId => {
    if (!store) return
    const party = store.partyState(guestId).party
    const proposal = party?.travelProposal
    const assignment = party && partyTravelAssignments.get(party.partyId)
    if (!proposal || proposal.status !== 'approved' || !assignment?.reserved || assignment.proposalId !== proposal.proposalId) return
    for (const [socket, recipient] of players) {
      if (!party.members.some(member => member.guestId === recipient.id)) continue
      send(socket, { type: 'party-update', kind: 'travel-update', partyId: party.partyId, otherId: guestId })
    }
  }
  const stopBlockListener = store?.onBlock?.(({ blockerId, blockedId }) => {
    for (const [socket, player] of players) {
      if (player.id === blockerId) send(socket, { type: 'leave', id: blockedId })
      else if (player.id === blockedId) send(socket, { type: 'leave', id: blockerId })
    }
  })
  const stopFriendEventListener = store?.onFriendEvent?.(event => {
    for (const [socket, player] of players) {
      if (player.id !== event.actorId && player.id !== event.targetId) continue
      send(socket, {
        type: 'friend-update',
        kind: event.kind,
        otherId: player.id === event.actorId ? event.targetId : event.actorId,
        requestId: event.requestId,
      })
    }
  })
  const stopMessageListener = store?.onMessageEvent?.(({ senderId, recipientId, messageId }) => {
    for (const [socket, player] of players) {
      if (player.id !== senderId && player.id !== recipientId) continue
      send(socket, {
        type: 'direct-message',
        otherId: player.id === senderId ? recipientId : senderId,
        messageId,
      })
    }
  })
  const stopPartyListener = store?.onPartyEvent?.(event => {
    if (event.kind === 'travel-update') updatePartyTravelAssignment(event)
    for (const [socket, player] of players) {
      if (!event.memberIds?.includes(player.id)) continue
      if (event.kind === 'invited' && player.id !== event.targetId) continue
      if (event.actorId && player.id !== event.actorId && isBlockedBetween(event.actorId, player.id)) continue
      send(socket, {
        type: 'party-update',
        kind: event.kind,
        partyId: event.partyId,
        invitationId: event.invitationId,
        otherId: event.actorId === player.id ? player.id : event.actorId,
      })
    }
  })
  const stopPartyMessageListener = store?.onPartyMessageEvent?.(event => {
    for (const [socket, player] of players) {
      if (!event.memberIds?.includes(player.id)) continue
      if (isBlockedBetween(event.message.senderGuestId, player.id)) continue
      send(socket, { type: 'party-message', partyId: event.partyId, message: event.message })
    }
  })
  const stopListeners = () => { closing = true; stopBlockListener?.(); stopFriendEventListener?.(); stopMessageListener?.(); stopPartyListener?.(); stopPartyMessageListener?.() }
  wss.on('close', stopListeners)
  const closeWebSocketServer = wss.close.bind(wss)
  wss.close = callback => { stopListeners(); return closeWebSocketServer(callback) }
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
    const initialRoom = roomDirectory.join(socket, 'square', preferredPartyInstances(id, 'square'))
    Object.assign(player, { spaceId: initialRoom.spaceId, instanceId: initialRoom.instanceId })
    let partyTracked = false
    send(socket, {
      type: 'welcome', id, authenticated, spaceId: player.spaceId,
      instanceId: player.instanceId, capacity: initialRoom.capacity,
      players: [...players.values()].filter(other => other.instanceId === player.instanceId && !isBlockedBetween(id, other.id)),
    })
    players.set(socket, player)
    if (authenticated) { store?.partySessionConnected?.(id); partyTracked = true }
    broadcast({ type: 'join', player }, socket, player)
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
            const temporaryId = id
            const needsPartyTrack = !partyTracked || id !== guestId
            if (partyTracked && id !== guestId) store.partySessionDisconnected?.(id)
            if (temporaryId !== guestId) broadcast({ type: 'leave', id: temporaryId }, socket, player)
            player.id = id = guestId
            player.authenticated = authenticated = true
            if (needsPartyTrack) { store.partySessionConnected?.(guestId); partyTracked = true }
            send(socket, { type: 'auth', success: true, id })
            broadcast({ type: 'move', player }, socket, player)
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
          if (recipient.instanceId === player.instanceId && isPublicZoneChatRecipient(player, recipient, store)) send(recipientSocket, chat)
        }
        return
      }
      if (message?.type === 'emote') {
        const { emote } = message
        if (typeof emote !== 'string' || !['cheer', 'wave', 'heart', 'fire'].includes(emote)) return
        player.emote = emote
        for (const [recipientSocket, recipient] of players) {
          if (recipient.instanceId === player.instanceId && !isBlockedBetween(player.id, recipient.id)) send(recipientSocket, { type: 'emote', id, emote })
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
      if (location !== player.location) {
        const previousRoom = { ...player }
        const party = store?.partyState?.(player.id)?.party
        const proposal = party?.travelProposal
        const assignment = party && partyTravelAssignments.get(party.partyId)
        const travel = proposal?.status === 'approved' && assignment?.proposalId === proposal.proposalId && assignment.location === location && !assignment.error
          ? { reservationId: proposal.proposalId, guestId: player.id }
          : {}
        const nextRoom = roomDirectory.move(socket, location, preferredPartyInstances(player.id, location), travel)
        if (nextRoom.error) return
        Object.assign(player, { x, z, angle, dancing, location, name: sanitizedName, spaceId: nextRoom.room.spaceId, instanceId: nextRoom.room.instanceId })
        lastMove = now
        broadcast({ type: 'leave', id }, socket, previousRoom)
        broadcast({ type: 'join', player }, socket, player)
        send(socket, { type: 'instance', spaceId: player.spaceId, instanceId: player.instanceId })
        notifyPartyTravelProgress(id)
        return
      }
      Object.assign(player, { x, z, angle, dancing, location, name: sanitizedName })
      lastMove = now
      broadcast({ type: 'move', player }, socket, player)
    })
    socket.on('close', () => {
      players.delete(socket)
      roomDirectory.leave(socket)
      if (partyTracked && !closing) store?.partySessionDisconnected?.(id)
      broadcast({ type: 'leave', id }, undefined, player)
    })
  })
  return wss
}
