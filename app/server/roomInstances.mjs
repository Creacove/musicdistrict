import { randomUUID } from 'node:crypto'

export const TESTED_PUBLIC_ROOM_CAPACITY = 20

const SPACE_BY_LOCATION = Object.freeze({
  // Only public walk-in spaces belong here. Chapter 06 event sessions retain
  // one global ticket roster and capacity in the authoritative EventService.
  square: 'music-square',
  studio: 'city-studio',
  release: 'release-house',
  venue: 'palm-room-preview',
})

export function createRuntimeRoomDirectory({
  capacity = TESTED_PUBLIC_ROOM_CAPACITY,
  createId = randomUUID,
  now = () => Date.now(),
} = {}) {
  const maxCapacity = Number.isSafeInteger(capacity) && capacity > 0 ? capacity : TESTED_PUBLIC_ROOM_CAPACITY
  const rooms = new Map()
  const roomsByLocation = new Map(Object.keys(SPACE_BY_LOCATION).map(location => [location, []]))
  const sessionRooms = new Map()

  const snapshot = room => ({
    spaceId: room.spaceId,
    location: room.location,
    instanceId: room.instanceId,
    capacity: room.capacity,
    activeHumans: room.sessions.size,
    availableSlots: room.capacity - room.sessions.size,
    state: room.sessions.size ? 'active' : 'quiet',
    createdAt: room.createdAt,
  })

  const removeIfUnusedShard = room => {
    if (room.sessions.size) return
    const siblings = roomsByLocation.get(room.location) || []
    if (siblings.length <= 1) return
    const oldest = siblings.map(id => rooms.get(id)).filter(Boolean).sort((a, b) => a.createdAt - b.createdAt)[0]
    if (oldest?.instanceId === room.instanceId) return
    rooms.delete(room.instanceId)
    roomsByLocation.set(room.location, siblings.filter(id => id !== room.instanceId))
  }

  const createRoom = location => {
    const spaceId = SPACE_BY_LOCATION[location]
    const instanceId = `runtime-${spaceId}-${createId()}`
    const room = { spaceId, location, instanceId, capacity: maxCapacity, sessions: new Set(), createdAt: now() }
    rooms.set(instanceId, room)
    roomsByLocation.get(location)?.push(instanceId)
    return room
  }

  function list(location) {
    if (typeof location !== 'string' || !SPACE_BY_LOCATION[location]) return []
    return (roomsByLocation.get(location) || []).map(id => rooms.get(id)).filter(Boolean).map(snapshot)
  }

  function resolve(location, groupSize = 1, preferredInstanceIds = []) {
    if (typeof location !== 'string' || !SPACE_BY_LOCATION[location]) return { error: 'unsupported_destination' }
    if (!Number.isSafeInteger(groupSize) || groupSize < 1) return { error: 'invalid_group_size' }
    if (groupSize > maxCapacity) return { error: 'group_too_large' }

    const preferred = new Map((Array.isArray(preferredInstanceIds) ? preferredInstanceIds : [])
      .filter(id => typeof id === 'string')
      .map((id, index) => [id, index]))
    const compatible = (roomsByLocation.get(location) || [])
      .map(id => rooms.get(id))
      .filter(room => room && room.capacity - room.sessions.size >= groupSize)
      .sort((a, b) => {
        const preference = (preferred.get(a.instanceId) ?? Number.MAX_SAFE_INTEGER) - (preferred.get(b.instanceId) ?? Number.MAX_SAFE_INTEGER)
        return preference || b.sessions.size - a.sessions.size || a.createdAt - b.createdAt
      })
    return snapshot(compatible[0] || createRoom(location))
  }

  function join(sessionId, location, preferredInstanceIds = []) {
    if (sessionId === undefined || sessionId === null) return { error: 'invalid_session' }
    const currentId = sessionRooms.get(sessionId)
    const current = currentId ? rooms.get(currentId) : null
    if (current?.location === location) return snapshot(current)

    const destination = resolve(location, 1, preferredInstanceIds)
    if (destination.error) return destination
    const next = rooms.get(destination.instanceId)
    const previous = current ? snapshot(current) : null
    next.sessions.add(sessionId)
    sessionRooms.set(sessionId, next.instanceId)
    if (current) {
      current.sessions.delete(sessionId)
      removeIfUnusedShard(current)
    }
    return { ...snapshot(next), previous }
  }

  function move(sessionId, location, preferredInstanceIds = []) {
    const currentId = sessionRooms.get(sessionId)
    const current = currentId ? rooms.get(currentId) : null
    if (current?.location === location) return { room: snapshot(current), previous: null }
    const assigned = join(sessionId, location, preferredInstanceIds)
    if (assigned.error) return assigned
    return { room: snapshot(rooms.get(assigned.instanceId)), previous: assigned.previous }
  }

  function leave(sessionId) {
    const instanceId = sessionRooms.get(sessionId)
    const room = instanceId ? rooms.get(instanceId) : null
    sessionRooms.delete(sessionId)
    if (!room) return null
    room.sessions.delete(sessionId)
    const result = snapshot(room)
    removeIfUnusedShard(room)
    return result
  }

  function instanceFor(sessionId) {
    const instanceId = sessionRooms.get(sessionId)
    const room = instanceId ? rooms.get(instanceId) : null
    return room ? snapshot(room) : null
  }

  return { capacity: maxCapacity, join, move, leave, resolve, list, instanceFor }
}
