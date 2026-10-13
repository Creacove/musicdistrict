import assert from 'node:assert/strict'
import test from 'node:test'
import { findWalkPath, type WalkPoint } from '../src/navigation.ts'
import { isPointBlocked, type Location } from '../src/worldModel.ts'

function assertWalkable(location: Location, from: WalkPoint, to: WalkPoint) {
  const path = findWalkPath(location, from, to)
  assert.ok(path.length > 0, `no route from ${from} to ${to}`)
  assert.deepEqual(path.at(-1), to)
  let previous = from
  for (const point of path) {
    const distance = Math.hypot(point[0] - previous[0], point[1] - previous[1])
    for (let step = 1; step <= Math.ceil(distance / .2); step++) {
      const t = step / Math.ceil(distance / .2)
      assert.equal(isPointBlocked(location, previous[0] + (point[0] - previous[0]) * t, previous[1] + (point[1] - previous[1]) * t, .35), false)
    }
    previous = point
  }
}

test('tap-to-walk routes around square planters to every playable door', () => {
  for (const destination of [[-8, 3.5], [13, -8], [-13, -8], [10, 2]] as WalkPoint[]) {
    assertWalkable('square', [-4, 7], destination)
  }
})

test('tap-to-walk routes around the venue lounge and studio desk', () => {
  assertWalkable('venue', [0, 8], [0, -7])
  assertWalkable('studio', [0, 7], [0, -4.1])
})

test('tap-to-walk refuses a point inside a solid object', () => {
  assert.deepEqual(findWalkPath('square', [-4, 7], [1, 2]), [])
})
