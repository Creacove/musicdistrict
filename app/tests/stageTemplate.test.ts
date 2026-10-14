import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_STAGE_TEMPLATE, parseStageTemplate, serializeStageTemplate } from '../src/stageTemplate.ts'

test('new and malformed stage preview drafts start from the safe default', () => {
  assert.deepEqual(parseStageTemplate(null), DEFAULT_STAGE_TEMPLATE)
  assert.deepEqual(parseStageTemplate('not json'), DEFAULT_STAGE_TEMPLATE)
  assert.deepEqual(parseStageTemplate('{"version":2,"lightLook":"laser","floorLightPreview":true}'), DEFAULT_STAGE_TEMPLATE)
})

test('valid local stage preview choices round-trip with only supported fields', () => {
  const draft = { version: 1 as const, lightLook: 'sunset' as const, floorLightPreview: true }
  const loaded = parseStageTemplate(serializeStageTemplate(draft))
  assert.deepEqual(loaded, draft)
})

test('serializer rejects unsupported stage looks and preview state types', () => {
  assert.throws(() => serializeStageTemplate({ version: 1, lightLook: 'laser' as never, floorLightPreview: true }), TypeError)
  assert.throws(() => serializeStageTemplate({ version: 1, lightLook: 'warm', floorLightPreview: 'yes' as never }), TypeError)
})
