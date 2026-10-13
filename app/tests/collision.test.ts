import assert from 'node:assert/strict'
import test from 'node:test'
import { isPointBlocked, resolveCollision } from '../src/worldModel.ts'

test('avatar cannot walk into square kiosk and slides along it', () => {
  // Square kiosk box is [-9.5, -6.5, 1.1, 2.9]
  // Walking directly toward kiosk center (-8, 2) from (-8, 4)
  const resolved = resolveCollision('square', -8, 4, -8, 2, 0.35)
  // Avatar should be stopped outside kiosk (z >= 2.9 + 0.35 = 3.25)
  assert.ok(resolved.z >= 3.24, `Expected z >= 3.24, got ${resolved.z}`)
  assert.equal(resolved.x, -8)

  // Verify that point inside kiosk is blocked
  assert.equal(isPointBlocked('square', -8, 2, 0.35), true)
  // Verify that point in open plaza is not blocked
  assert.equal(isPointBlocked('square', -4, 7, 0.35), false)
})

test('avatar slides along city studio producer desk', () => {
  // Studio desk is [-4.2, 4.2, -7.7, -4.7]
  // Moving diagonally into desk from (0, -4.0) towards (1.0, -5.5)
  const resolved = resolveCollision('studio', 0, -4.0, 1.0, -5.5, 0.35)
  // X movement should proceed, Z movement should be stopped at edge (z >= -4.7 + 0.35 = -4.35)
  assert.ok(Math.abs(resolved.x - 1.0) < 0.05, `Expected x ~ 1.0, got ${resolved.x}`)
  assert.ok(resolved.z >= -4.4, `Expected z >= -4.4, got ${resolved.z}`)
})

test('avatar cannot walk through release intake counter', () => {
  // Release intake is [-4.4, 4.4, -7.5, -4.5]
  const resolved = resolveCollision('release', 0, -3.5, 0, -6.0, 0.35)
  assert.ok(resolved.z >= -4.2, `Expected z >= -4.2, got ${resolved.z}`)
  assert.equal(isPointBlocked('release', 0, -6.0, 0.35), true)
})

test('avatar stays within room boundaries', () => {
  // Studio boundary is [-11.5, 11.5, -10.5, 10.5]
  const resolved = resolveCollision('studio', 0, 0, 25, -25, 0.35)
  assert.ok(resolved.x <= 11.5 - 0.35)
  assert.ok(resolved.z >= -10.5 + 0.35)
})
