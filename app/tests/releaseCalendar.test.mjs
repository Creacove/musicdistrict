import assert from 'node:assert/strict'
import test from 'node:test'
import { getReleaseWindow } from '../server/releaseCalendar.mjs'

test('keeps the coming Friday while Wednesday submission is still open', () => {
  const release = getReleaseWindow(new Date('2026-10-14T16:59:00.000Z'))

  assert.equal(release.timezone, 'Africa/Lagos')
  assert.equal(release.nextEligibleFriday, '2026-10-16T18:00:00.000Z')
  assert.equal(release.submissionDeadline, '2026-10-14T17:00:00.000Z')
  assert.equal(release.moderationCheckpoint, '2026-10-15T17:00:00.000Z')
  assert.equal(release.premiereAt, '2026-10-16T18:00:00.000Z')
})

test('moves to the following Friday when the Wednesday cutoff has passed', () => {
  for (const now of [
    '2026-10-14T17:00:00.000Z', // Wednesday 18:00 WAT
    '2026-10-15T16:00:00.000Z', // Thursday 17:00 WAT
    '2026-10-16T18:30:00.000Z', // Friday 19:30 WAT
    '2026-10-18T12:00:00.000Z', // Sunday afternoon WAT
  ]) {
    const release = getReleaseWindow(new Date(now))
    assert.equal(release.nextEligibleFriday, '2026-10-23T18:00:00.000Z', now)
    assert.equal(release.submissionDeadline, '2026-10-21T17:00:00.000Z', now)
    assert.equal(release.moderationCheckpoint, '2026-10-22T17:00:00.000Z', now)
    assert.equal(release.premiereAt, '2026-10-23T18:00:00.000Z', now)
  }
})

test('uses server time supplied by caller and rejects invalid dates', () => {
  assert.throws(() => getReleaseWindow(new Date(Number.NaN)), /valid date/i)
})
