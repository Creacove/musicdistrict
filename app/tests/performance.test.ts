import assert from 'node:assert/strict'
import test from 'node:test'
import { summarizeFrames } from '../src/performance.ts'

test('frame summary keeps the median distinct from long frames', () => {
  assert.deepEqual(summarizeFrames([16, 17, 17, 18, 80]), { medianMs: 17, p95Ms: 18, fps: 59 })
  assert.equal(summarizeFrames([]), null)
})
