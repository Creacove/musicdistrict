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
