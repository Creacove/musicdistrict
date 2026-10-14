import assert from 'node:assert/strict'
import { test } from 'node:test'
import { LIGHTING_PRESETS, getNextLightingMode, type LightingMode } from '../src/lighting.ts'

test('lighting presets cover M1 daylight and evening authored variants with distinct atmospheres', () => {
  const modes: LightingMode[] = ['day', 'golden', 'night']
  for (const mode of modes) {
    const preset = LIGHTING_PRESETS[mode]
    assert.ok(preset, `Preset exists for ${mode}`)
    assert.ok(preset.label.length > 0, 'Preset has non-empty label')
    assert.ok(preset.icon.length > 0, 'Preset has icon')
    assert.ok(preset.ambientIntensity > 0, 'Ambient intensity is positive')
    assert.ok(preset.sunIntensity > 0, 'Sun intensity is positive')
    assert.equal(preset.sunPos.length, 3, 'Sun position has x, y, z')
  }

  // Verify daylight, golden hour, and night palettes are distinct
  assert.notEqual(LIGHTING_PRESETS.day.background, LIGHTING_PRESETS.golden.background)
  assert.notEqual(LIGHTING_PRESETS.golden.background, LIGHTING_PRESETS.night.background)
  assert.notEqual(LIGHTING_PRESETS.day.sunPos[1], LIGHTING_PRESETS.golden.sunPos[1], 'Sun height differs between midday and sunset')
})

test('getNextLightingMode cycles cleanly through day, golden, and night', () => {
  assert.equal(getNextLightingMode('day'), 'golden')
  assert.equal(getNextLightingMode('golden'), 'night')
  assert.equal(getNextLightingMode('night'), 'day')
})
