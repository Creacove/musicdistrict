import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createRuntimeRoomDirectory } from '../server/roomInstances.mjs'

test('public room instances route up to the tested 20-player capacity', () => {
  let nextId = 0
  const rooms = createRuntimeRoomDirectory({ capacity: 20, createId: () => `instance-${++nextId}` })
  const assigned = Array.from({ length: 21 }, (_, index) => rooms.join(`session-${index}`, 'square'))

  assert.equal(new Set(assigned.slice(0, 20).map(room => room.instanceId)).size, 1)
  assert.notEqual(assigned[20].instanceId, assigned[0].instanceId)
  assert.deepEqual(rooms.list('square').map(room => room.activeHumans).sort((a, b) => b - a), [20, 1])
})

test('compatible public instance with the most real occupants is preferred', () => {
  let nextId = 0
  const rooms = createRuntimeRoomDirectory({ capacity: 4, createId: () => `instance-${++nextId}` })
  const first = rooms.join('a', 'studio')
  rooms.join('b', 'studio')
  const second = rooms.join('c', 'studio')
  const chosen = rooms.resolve('studio', 1)

  assert.equal(second.instanceId, first.instanceId)
  assert.equal(chosen.instanceId, first.instanceId)
  assert.equal(chosen.activeHumans, 3)
})

test('room handoff assigns before releasing the old instance and cleans up empty shards', () => {
  let nextId = 0
  const rooms = createRuntimeRoomDirectory({ capacity: 1, createId: () => `instance-${++nextId}` })
  const first = rooms.join('a', 'square')
  const second = rooms.join('b', 'square')
  const moved = rooms.move('b', 'studio')

  assert.equal(first.instanceId, rooms.instanceFor('a').instanceId)
  assert.notEqual(first.instanceId, second.instanceId)
  assert.equal(moved.previous.instanceId, second.instanceId)
  assert.equal(moved.room.spaceId, 'city-studio')
  assert.equal(rooms.list('square').length, 1)
  assert.equal(rooms.instanceFor('b').location, 'studio')
})

test('approved party travel reserves one public instance for every member', () => {
  let nextId = 0
  const rooms = createRuntimeRoomDirectory({ capacity: 4, createId: () => `instance-${++nextId}` })
  const crowded = rooms.join('crowd-a', 'studio')
  rooms.join('crowd-b', 'studio')
  rooms.join('crowd-c', 'studio')
  const expiresAt = new Date(Date.now() + 60_000).toISOString()
  const reserved = rooms.reserveGroup('travel-1', 'studio', ['guest-a', 'guest-b'], [], expiresAt)

  assert.notEqual(reserved.instanceId, crowded.instanceId, 'a room with only one free place cannot accept a two-player group')
  assert.equal(reserved.reservedSlots, 2)
  assert.equal(reserved.availableSlots, 2)
  assert.equal(rooms.join('random-player', 'studio').instanceId, crowded.instanceId, 'walk-ins should use the partial room instead')

  const first = rooms.move('session-a', 'studio', [], { reservationId: 'travel-1', guestId: 'guest-a' })
  const second = rooms.move('session-b', 'studio', [], { reservationId: 'travel-1', guestId: 'guest-b' })
  assert.equal(first.room.instanceId, reserved.instanceId)
  assert.equal(second.room.instanceId, reserved.instanceId)
  assert.equal(second.room.activeHumans, 2)
  assert.equal(second.room.reservedSlots, 0)
  assert.equal(rooms.reservation('travel-1').arrivedMembers, 2)
})

test('party reservations reject outsiders and release capacity at expiry', () => {
  let nextId = 0
  let now = 1_000
  const rooms = createRuntimeRoomDirectory({ capacity: 4, createId: () => `instance-${++nextId}`, now: () => now })
  const expiresAt = new Date(now + 1_000).toISOString()
  const reservation = rooms.reserveGroup('travel-2', 'venue', ['guest-a', 'guest-b'], [], expiresAt)
  assert.equal(rooms.move('outsider-session', 'venue', [], { reservationId: 'travel-2', guestId: 'outsider' }).error, 'reservation_member')
  assert.equal(reservation.reservedSlots, 2)
  now += 1_001
  assert.equal(rooms.reservation('travel-2'), null)
  assert.equal(rooms.resolve('venue', 4).instanceId, reservation.instanceId)
})

test('guests already in the reserved room consume their held place and regain it when they leave', () => {
  const rooms = createRuntimeRoomDirectory({ capacity: 4, createId: () => 'instance-1' })
  const current = rooms.join('session-a', 'studio')
  const expiresAt = new Date(Date.now() + 60_000).toISOString()
  const reservation = rooms.reserveGroup('travel-arrived', 'studio', ['guest-a', 'guest-b'], [], expiresAt, [
    { guestId: 'guest-a', sessionId: 'session-a' },
  ])

  assert.equal(reservation.instanceId, current.instanceId)
  assert.equal(reservation.arrivedMembers, 1)
  assert.equal(reservation.reservedSlots, 1, 'the player already in the room must not reserve a second slot')
  assert.equal(rooms.leave('session-a').activeHumans, 0)
  assert.equal(rooms.reservation('travel-arrived').reservedSlots, 2, 'leaving must return that player to the group hold')
})

test('ticketed events cannot be resolved through the public room directory', () => {
  const rooms = createRuntimeRoomDirectory()
  assert.equal(rooms.resolve({ eventId: 'show-1', ticketId: 'ticket-1' }).error, 'unsupported_destination')
  assert.equal(rooms.resolve('unknown-event-session').error, 'unsupported_destination')
})
