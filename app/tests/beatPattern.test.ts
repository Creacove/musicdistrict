import assert from 'node:assert/strict'
import test from 'node:test'
import {
  SOUND_KITS,
  bpmToStepMs,
  clampBpm,
  clearPattern,
  sectionsDiffer,
  starterPattern,
  toggleStep,
  validPattern,
} from '../src/beatPattern.ts'
import { renderMasterWav } from '../src/renderMaster.ts'

test('beat pad edits only its selected step and rejects malformed saved patterns', () => {
  const before = starterPattern(), after = toggleStep(before, 0, 1)
  assert.equal(before[0][1], false)
  assert.equal(after[0][1], true)
  assert.equal(after[1][1], before[1][1])
  assert.equal(validPattern(after), true)
  assert.equal(validPattern([[true]]), false)
})

test('clearPattern resets all 32 steps in 4 lanes to false', () => {
  const cleared = clearPattern()
  assert.equal(cleared.length, 4)
  assert.ok(cleared.every(row => row.length === 8 && row.every(step => step === false)))
  assert.equal(validPattern(cleared), true)
})

test('tempo clamping and step duration conversion adhere to 80-140 BPM bounds', () => {
  assert.equal(clampBpm(104), 104)
  assert.equal(clampBpm(40), 80)
  assert.equal(clampBpm(200), 140)
  assert.equal(clampBpm(NaN), 104)

  // At 120 BPM: step duration is 30000 / 120 = 250ms
  assert.equal(bpmToStepMs(120), 250)
  // At 96 BPM: 30000 / 96 = 312.5ms
  assert.equal(bpmToStepMs(96), 312.5)
})

test('sound kits define distinct authored names and non-empty voice labels', () => {
  const kits = Object.keys(SOUND_KITS)
  assert.deepEqual(kits, ['afrobeats', 'amapiano', 'highlife'])
  for (const key of kits) {
    const kit = SOUND_KITS[key as keyof typeof SOUND_KITS]
    assert.ok(kit.name.length > 0)
    assert.ok(kit.labels.length === 4)
    assert.ok(kit.defaultBpm >= 80 && kit.defaultBpm <= 140)
  }
})

test('two changed sections render a 30-second PCM WAV master with kit and tempo', () => {
  const a = starterPattern(), b = toggleStep(a, 0, 1)
  assert.equal(sectionsDiffer(a, b), true)
  const wav = renderMasterWav(a, b, 'amapiano', 112)
  assert.equal(new TextDecoder().decode(wav.subarray(0, 4)), 'RIFF')
  assert.equal(new TextDecoder().decode(wav.subarray(8, 12)), 'WAVE')
  assert.equal(wav.length, 44 + 22050 * 30 * 2)
})
