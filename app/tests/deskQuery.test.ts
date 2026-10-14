import assert from 'node:assert/strict'
import test from 'node:test'

async function resolveQuestion(query: string, location: 'square' | 'studio' | 'release' | 'venue') {
  const module = await import('../src/deskQuery.ts').catch(() => null)
  assert.ok(module, 'Desk question matcher should be available')
  return module.resolveDeskQuestion(query, location)
}

test('Desk matches beat questions to the free studio and workstation', async () => {
  assert.deepEqual(await resolveQuestion('Where can I make a beat?', 'square'), {
    kind: 'action',
    title: 'Make a beat',
    route: 'studio',
    label: 'Go to City Studio',
    message: 'Use the free producer desk. Your beat stays on this device.',
    suggestions: [],
  })
  assert.equal((await resolveQuestion('make a beat', 'studio')).route, 'studioDesk')
})

test('Desk respects physical exits when a requested activity is in another room', async () => {
  assert.equal((await resolveQuestion('How do I release a song?', 'studio')).route, 'studioExit')
  assert.equal((await resolveQuestion('Take me to the stage', 'release')).route, 'releaseExit')
  assert.equal((await resolveQuestion('listen to music', 'venue')).route, 'venueExit')
})

test('Desk keeps publishing and public listening claims accurate', async () => {
  const release = await resolveQuestion('publish my release', 'square')
  const listening = await resolveQuestion('listen to music', 'square')
  assert.match(release.message, /private|unavailable/i)
  assert.match(listening.message, /approved|preview/i)
})

test('unknown Desk questions get an honest fallback with no invented route', async () => {
  const answer = await resolveQuestion('will I become famous tomorrow?', 'square')
  assert.equal(answer.kind, 'fallback')
  assert.equal(answer.route, null)
  assert.ok(answer.suggestions.length > 0 && answer.suggestions.length <= 3)
})
