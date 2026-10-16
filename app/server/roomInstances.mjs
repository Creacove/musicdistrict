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
  const reservations = new Map()
  const sessionReservations = new Map()
  const sessionGuestIds = new Map()

  const reservedSlotsFor = instanceId => [...reservations.values()]
    .filter(reservation => reservation.instanceId === instanceId)
    .reduce((total, reservation) => total + reservation.remainingGuestIds.size, 0)

  const snapshot = room => {
    const reservedSlots = reservedSlotsFor(room.instanceId)
    return {
      spaceId: room.spaceId,
      location: room.location,
      instanceId: room.instanceId,
      capacity: room.capacity,
      activeHumans: room.sessions.size,
      reservedSlots,
      availableSlots: room.capacity - room.sessions.size - reservedSlots,
      state: room.sessions.size ? 'active' : 'quiet',
      createdAt: room.createdAt,
    }
  }

  function cancelReservation(reservationId) {
    const reservation = reservations.get(reservationId)
    if (!reservation) return false
    reservations.delete(reservationId)
    for (const [sessionId, id] of sessionReservations) {
      if (id === reservationId) sessionReservations.delete(sessionId)
    }
    const room = rooms.get(reservation.instanceId)
    if (room) removeIfUnusedShard(room)
    return true
  }

  function cleanExpiredReservations() {
    const currentTime = now()
    for (const [reservationId, reservation] of reservations) {
      if (Date.parse(reservation.expiresAt) <= currentTime) cancelReservation(reservationId)
    }
  }

  const removeIfUnusedShard = room => {
    if (room.sessions.size || reservedSlotsFor(room.instanceId) > 0) return
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
    cleanExpiredReservations()
    if (typeof location !== 'string' || !SPACE_BY_LOCATION[location]) return []
    return (roomsByLocation.get(location) || []).map(id => rooms.get(id)).filter(Boolean).map(snapshot)
  }

  function resolve(location, groupSize = 1, preferredInstanceIds = []) {
    cleanExpiredReservations()
    if (typeof location !== 'string' || !SPACE_BY_LOCATION[location]) return { error: 'unsupported_destination' }
    if (!Number.isSafeInteger(groupSize) || groupSize < 1) return { error: 'invalid_group_size' }
    if (groupSize > maxCapacity) return { error: 'group_too_large' }

    const preferred = new Map((Array.isArray(preferredInstanceIds) ? preferredInstanceIds : [])
      .filter(id => typeof id === 'string')
      .map((id, index) => [id, index]))
    const compatible = (roomsByLocation.get(location) || [])
      .map(id => rooms.get(id))
      .filter(room => room && room.capacity - room.sessions.size - reservedSlotsFor(room.instanceId) >= groupSize)
      .sort((a, b) => {
        const preference = (preferred.get(a.instanceId) ?? Number.MAX_SAFE_INTEGER) - (preferred.get(b.instanceId) ?? Number.MAX_SAFE_INTEGER)
        return preference || b.sessions.size - a.sessions.size || a.createdAt - b.createdAt
      })
    return snapshot(compatible[0] || createRoom(location))
  }

  function reservationSnapshot(reservation) {
    const room = rooms.get(reservation.instanceId)
    return room ? {
      ...snapshot(room),
      reservationId: reservation.reservationId,
      groupSize: reservation.guestIds.size,
      arrivedMembers: reservation.arrivedGuestIds.size,
      remainingMembers: reservation.remainingGuestIds.size,
      expiresAt: reservation.expiresAt,
    } : null
  }

  function reserveGroup(reservationId, location, guestIds, preferredInstanceIds = [], expiresAt = new Date(now() + 5 * 60_000).toISOString(), alreadyArrivedGuests = []) {
    cleanExpiredReservations()
    if (typeof reservationId !== 'string' || !reservationId || typeof location !== 'string' || !SPACE_BY_LOCATION[location]) return { error: 'unsupported_destination' }
    if (!Array.isArray(guestIds) || guestIds.length < 1 || guestIds.some(id => typeof id !== 'string' || !id) || new Set(guestIds).size !== guestIds.length) return { error: 'invalid_members' }
    if (guestIds.length > maxCapacity) return { error: 'group_too_large' }
    if (typeof expiresAt !== 'string' || !Number.isFinite(Date.parse(expiresAt)) || Date.parse(expiresAt) <= now()) return { error: 'invalid_expiry' }
    const existing = reservations.get(reservationId)
    if (existing) {
      const sameMembers = existing.location === location && existing.guestIds.size === guestIds.length && guestIds.every(id => existing.guestIds.has(id))
      return sameMembers ? reservationSnapshot(existing) : { error: 'reservation_conflict' }
    }
    const memberSet = new Set(guestIds)
    const arrivalCandidates = Array.isArray(alreadyArrivedGuests)
      ? alreadyArrivedGuests.filter(item => item && memberSet.has(item.guestId) && item.sessionId !== undefined && item.sessionId !== null)
      : []
    const preferred = new Map((Array.isArray(preferredInstanceIds) ? preferredInstanceIds : [])
      .filter(id => typeof id === 'string')
      .map((id, index) => [id, index]))
    const compatible = (roomsByLocation.get(location) || [])
      .map(id => rooms.get(id))
      .map(room => {
        const arrivedGuests = []
        const arrivedIds = new Set()
        for (const candidate of arrivalCandidates) {
          if (arrivedIds.has(candidate.guestId) || sessionRooms.get(candidate.sessionId) !== room.instanceId) continue
          arrivedIds.add(candidate.guestId)
          arrivedGuests.push(candidate)
        }
        return { room, arrivedGuests, slotsNeeded: memberSet.size - arrivedIds.size }
      })
      .filter(({ room, slotsNeeded }) => room && room.capacity - room.sessions.size - reservedSlotsFor(room.instanceId) >= slotsNeeded)
      .sort((a, b) => {
        const preference = (preferred.get(a.room.instanceId) ?? Number.MAX_SAFE_INTEGER) - (preferred.get(b.room.instanceId) ?? Number.MAX_SAFE_INTEGER)
        return preference || b.room.sessions.size - a.room.sessions.size || a.room.createdAt - b.room.createdAt
      })
    const selected = compatible[0]
    const room = selected?.room || createRoom(location)
    const arrivedGuests = selected?.arrivedGuests || []
    const arrived = new Set(arrivedGuests.map(item => item.guestId))
    const reservation = {
      reservationId,
      location,
      instanceId: room.instanceId,
      guestIds: memberSet,
      arrivedGuestIds: arrived,
      remainingGuestIds: new Set([...memberSet].filter(id => !arrived.has(id))),
      expiresAt,
    }
    reservations.set(reservationId, reservation)
    for (const { guestId, sessionId } of arrivedGuests) {
      sessionReservations.set(sessionId, reservationId)
      sessionGuestIds.set(sessionId, guestId)
    }
    return reservationSnapshot(reservation)
  }

  function reservation(reservationId) {
    cleanExpiredReservations()
    const current = reservations.get(reservationId)
    return current ? reservationSnapshot(current) : null
  }

  function releaseSessionReservation(sessionId) {
    const reservationId = sessionReservations.get(sessionId)
    if (!reservationId) return
    sessionReservations.delete(sessionId)
    const current = reservations.get(reservationId)
    const guestId = sessionGuestIds.get(sessionId)
    const anotherSessionForGuest = [...sessionReservations].some(([otherSession, otherReservation]) =>
      otherReservation === reservationId && sessionGuestIds.get(otherSession) === guestId)
    if (current && guestId && !anotherSessionForGuest && current.remainingGuestIds.size > 0 && current.arrivedGuestIds.delete(guestId)) {
      current.remainingGuestIds.add(guestId)
    }
  }

  function join(sessionId, location, preferredInstanceIds = [], travel = {}) {
    cleanExpiredReservations()
    if (sessionId === undefined || sessionId === null) return { error: 'invalid_session' }
    const currentId = sessionRooms.get(sessionId)
    const current = currentId ? rooms.get(currentId) : null
    const reservationId = travel?.reservationId
    const groupReservation = reservationId ? reservations.get(reservationId) : null
    if (reservationId && (!groupReservation || groupReservation.location !== location)) return { error: 'reservation_unavailable' }
    if (current?.location === location && (!groupReservation || current.instanceId === groupReservation.instanceId)) return snapshot(current)

    let next
    if (groupReservation) {
      const guestId = travel?.guestId
      if (!groupReservation.guestIds.has(guestId)) return { error: 'reservation_member' }
      next = rooms.get(groupReservation.instanceId)
      if (!next) return { error: 'reservation_unavailable' }
      if (next.sessions.size >= next.capacity) return { error: 'full' }
      if (!groupReservation.remainingGuestIds.has(guestId) && !groupReservation.arrivedGuestIds.has(guestId)) return { error: 'reservation_member' }
    } else {
      const destination = resolve(location, 1, preferredInstanceIds)
      if (destination.error) return destination
      next = rooms.get(destination.instanceId)
    }
    const previous = current ? snapshot(current) : null
    releaseSessionReservation(sessionId)
    next.sessions.add(sessionId)
    sessionRooms.set(sessionId, next.instanceId)
    if (groupReservation) {
      const guestId = travel.guestId
      groupReservation.remainingGuestIds.delete(guestId)
      groupReservation.arrivedGuestIds.add(guestId)
      sessionReservations.set(sessionId, reservationId)
      sessionGuestIds.set(sessionId, guestId)
    } else {
      sessionReservations.delete(sessionId)
      sessionGuestIds.delete(sessionId)
    }
    if (current) {
      current.sessions.delete(sessionId)
      removeIfUnusedShard(current)
    }
    return { ...snapshot(next), previous }
  }

  function move(sessionId, location, preferredInstanceIds = [], travel = {}) {
    const currentId = sessionRooms.get(sessionId)
    const current = currentId ? rooms.get(currentId) : null
    if (current?.location === location && !travel?.reservationId) return { room: snapshot(current), previous: null }
    const assigned = join(sessionId, location, preferredInstanceIds, travel)
    if (assigned.error) return assigned
    return { room: snapshot(rooms.get(assigned.instanceId)), previous: assigned.previous }
  }

  function leave(sessionId) {
    cleanExpiredReservations()
    const instanceId = sessionRooms.get(sessionId)
    const room = instanceId ? rooms.get(instanceId) : null
    releaseSessionReservation(sessionId)
    sessionRooms.delete(sessionId)
    sessionGuestIds.delete(sessionId)
    if (!room) return null
    room.sessions.delete(sessionId)
    const result = snapshot(room)
    removeIfUnusedShard(room)
    return result
  }

  function instanceFor(sessionId) {
    cleanExpiredReservations()
    const instanceId = sessionRooms.get(sessionId)
    const room = instanceId ? rooms.get(instanceId) : null
    return room ? snapshot(room) : null
  }

  return { capacity: maxCapacity, join, move, leave, resolve, reserveGroup, reservation, cancelReservation, list, instanceFor }
}
