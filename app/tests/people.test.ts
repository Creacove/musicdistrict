import assert from 'node:assert/strict'
import test from 'node:test'
import { peopleInLocation } from '../src/people.ts'

test('people view only lists live players in the current place', () => {
  const view = peopleInLocation([
    { id: 'one', name: 'Mira', location: 'square', dancing: true },
    { id: 'two', name: 'Tunde', location: 'studio', dancing: false },
  ], 'square', true)

  assert.equal(view.availability, 'online')
  assert.deepEqual(view.people.map(person => person.name), ['Mira'])
})

test('disconnected presence is unavailable, not a false empty room', () => {
  const view = peopleInLocation([], 'square', false)

  assert.equal(view.availability, 'offline')
  assert.deepEqual(view.people, [])
})

test('a connected room with no other players has a real empty state', () => {
  const view = peopleInLocation([], 'square', true)

  assert.equal(view.availability, 'empty')
  assert.deepEqual(view.people, [])
})
