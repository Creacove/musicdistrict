import assert from 'node:assert/strict'
import test from 'node:test'
import { rehearsalMetrics } from '../src/eventPreview.ts'

test('rehearsal presence never becomes ticket sales or event attendance', () => {
  assert.deepEqual(rehearsalMetrics(true, 2), {
    liveSessions: '2 other connected sessions',
    ticketsSold: 'Not a ticketed event',
    checkedInHumans: 'Not recorded',
  })
  assert.deepEqual(rehearsalMetrics(false, 20), {
    liveSessions: 'Live status unavailable',
    ticketsSold: 'Not a ticketed event',
    checkedInHumans: 'Not recorded',
  })
})
