import assert from 'node:assert/strict'
import test from 'node:test'
import { RELEASE_JOURNEY, nextReleaseStation, previousReleaseStation } from '../src/releaseJourney.ts'

test('release journey follows the documented physical station order', () => {
  assert.deepEqual(RELEASE_JOURNEY.map(station => station.id), [
    'intake', 'artwork', 'metadata', 'listening', 'rights', 'calendar',
  ])
  assert.equal(RELEASE_JOURNEY[1].hotspot, 'releaseArtwork')
  assert.equal(RELEASE_JOURNEY[2].hotspot, 'releaseMetadata')
  assert.equal(RELEASE_JOURNEY[3].hotspot, 'releaseListening')
  assert.equal(RELEASE_JOURNEY[4].hotspot, 'releaseRights')
  assert.equal(RELEASE_JOURNEY[5].hotspot, 'releaseCalendar')
})

test('station navigation advances one documented step at a time', () => {
  assert.equal(nextReleaseStation('intake'), 'artwork')
  assert.equal(nextReleaseStation('rights'), 'calendar')
  assert.equal(nextReleaseStation('calendar'), null)
  assert.equal(previousReleaseStation('artwork'), 'intake')
  assert.equal(previousReleaseStation('intake'), null)
})
