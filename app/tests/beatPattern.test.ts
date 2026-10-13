import assert from 'node:assert/strict'
import test from 'node:test'
import { starterPattern, toggleStep, validPattern } from '../src/beatPattern.ts'

test('beat pad edits only its selected step and rejects malformed saved patterns', () => {
  const before = starterPattern(), after = toggleStep(before, 0, 1)
  assert.equal(before[0][1], false)
  assert.equal(after[0][1], true)
  assert.equal(after[1][1], before[1][1])
  assert.equal(validPattern(after), true)
  assert.equal(validPattern([[true]]), false)
})
