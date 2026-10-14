import assert from 'node:assert/strict'
import test from 'node:test'
import { blankReleaseDraft } from '../src/releaseDraft.ts'
import { createReleaseSleeveSvg } from '../src/releaseArtwork.ts'

test('release sleeve export is self-contained SVG and safely escapes player text', () => {
  const draft = { ...blankReleaseDraft(), title: '<Night & Day>', artist: 'A"B', artwork: 'lagos-violet' as const }
  const svg = createReleaseSleeveSvg(draft)
  assert.match(svg, /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="1200"/)
  assert.match(svg, /&lt;Night &amp; Day&gt;/)
  assert.match(svg, /A&quot;B/)
  assert.match(svg, /#491069/)
  assert.doesNotMatch(svg, /<Night & Day>/)
})
