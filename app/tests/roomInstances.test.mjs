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

test('ticketed events cannot be resolved through the public room directory', () => {
  const rooms = createRuntimeRoomDirectory()
  assert.equal(rooms.resolve({ eventId: 'show-1', ticketId: 'ticket-1' }).error, 'unsupported_destination')
  assert.equal(rooms.resolve('unknown-event-session').error, 'unsupported_destination')
})
