import assert from 'node:assert/strict'
import test from 'node:test'
import { blankReleaseDraft, releaseBlockers, validReleaseDraft } from '../src/releaseDraft.ts'

test('release draft remains blocked even with metadata and a beat pattern', () => {
  const draft = { ...blankReleaseDraft(), title: 'First idea', artist: 'Player' }
  assert.equal(validReleaseDraft(draft), true)
  assert.equal(releaseBlockers(draft, true).some(item => item.includes('server submission')), true)
  assert.equal(releaseBlockers(blankReleaseDraft(), false).includes('Add a title'), true)
  assert.equal(validReleaseDraft({ title: 3, artist: '', artwork: 'rose' }), false)
})
