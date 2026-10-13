import assert from 'node:assert/strict'
import test from 'node:test'
import { getNearby, type Location } from '../src/worldModel.ts'

test('a player reaches an entrance by walking to its physical hotspot', () => {
  const location: Location = 'square'
  assert.equal(getNearby(location, -4, 6), null)
  assert.equal(getNearby(location, 10, 2), 'palmEntrance')
  assert.equal(getNearby(location, 17, 2), null)
})

test('venue interactions belong to the venue interior', () => {
  assert.equal(getNearby('square', 0, -7), null)
  assert.equal(getNearby('venue', 0, -7), 'stage')
  assert.equal(getNearby('venue', 0, 9), null)
  assert.equal(getNearby('venue', -10, 9), 'venueExit')
})

test('studio desk and exit require a physical position inside the studio', () => {
  assert.equal(getNearby('studio', 0, -5), 'studioDesk')
  assert.equal(getNearby('studio', 0, 9), 'studioExit')
  assert.equal(getNearby('square', 0, -5), null)
})
