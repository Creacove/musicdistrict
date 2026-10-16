import assert from 'node:assert/strict'
import test from 'node:test'
import { AMBIENT_ACTOR_TRUTH, MUSIC_SQUARE_AMBIENT_WALKERS, sampleAmbientWalker } from '../src/ambientNpcMotion.ts'
import { getNearby, isPointBlocked } from '../src/worldModel.ts'

test('Music Square ambient pedestrians stay on clear paths outside interaction hotspots', () => {
  assert.equal(MUSIC_SQUARE_AMBIENT_WALKERS.length, 4)
  for (const route of MUSIC_SQUARE_AMBIENT_WALKERS) {
    for (let step = 0; step < 120; step++) {
      const pose = sampleAmbientWalker(route, step * 0.5)
      assert.equal(isPointBlocked('square', pose.x, pose.z, 0.42), false)
      assert.equal(getNearby('square', pose.x, pose.z), null)
    }
  }
})

test('Music Square pedestrians are staged on separate sightlines', () => {
  const [first, second] = MUSIC_SQUARE_AMBIENT_WALKERS
  assert.ok(Math.abs(first.centerX - second.centerX) >= 5)
})

test('ambient pedestrians are labeled scenery with no human, economic, or analytics effect', () => {
  assert.equal(AMBIENT_ACTOR_TRUTH.actorType, 'NPC')
  assert.equal(AMBIENT_ACTOR_TRUTH.countsAsHuman, false)
  assert.equal(AMBIENT_ACTOR_TRUTH.financialEffect, 'none')
  assert.equal(AMBIENT_ACTOR_TRUTH.analyticsEligible, false)
  assert.equal(AMBIENT_ACTOR_TRUTH.interactive, false)
  assert.equal(AMBIENT_ACTOR_TRUTH.nonBlocking, true)
})

test('ambient pedestrians complete a smooth repeating loop with a facing direction', () => {
  for (const route of MUSIC_SQUARE_AMBIENT_WALKERS) {
    const start = sampleAmbientWalker(route, 0)
    const later = sampleAmbientWalker(route, 2)
    const repeat = sampleAmbientWalker(route, route.lapSeconds)
    assert.ok(Math.hypot(later.x - start.x, later.z - start.z) > 0.1)
    assert.ok(Math.hypot(repeat.x - start.x, repeat.z - start.z) < 1e-6)
    assert.ok(Number.isFinite(start.heading))
  }
})
