import assert from 'node:assert/strict'
import test from 'node:test'
import { renderMasterWav, sectionsDiffer, starterPattern, toggleStep, validPattern } from '../src/beatPattern.ts'

test('beat pad edits only its selected step and rejects malformed saved patterns', () => {
  const before = starterPattern(), after = toggleStep(before, 0, 1)
  assert.equal(before[0][1], false)
  assert.equal(after[0][1], true)
  assert.equal(after[1][1], before[1][1])
  assert.equal(validPattern(after), true)
  assert.equal(validPattern([[true]]), false)
})

test('two changed sections render a 30-second PCM WAV master', () => {
  const a = starterPattern(), b = toggleStep(a, 0, 1)
  assert.equal(sectionsDiffer(a, b), true)
  const wav = renderMasterWav(a, b)
  assert.equal(new TextDecoder().decode(wav.subarray(0, 4)), 'RIFF')
  assert.equal(wav.length, 44 + 22050 * 30 * 2)
})
