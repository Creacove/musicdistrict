import assert from 'node:assert/strict'
import test from 'node:test'
import { nextMusicJourneyStep, type MusicJourneyProgress } from '../src/musicJourney.ts'

const empty: MusicJourneyProgress = {
  beatSaved: false,
  masterRendered: false,
  releaseDraftSaved: false,
  releaseAuditionPlayed: false,
  stagePreviewPlayed: false,
}

test('first-track path starts at the free City Studio without locking a career', () => {
  const state = nextMusicJourneyStep(empty, 'square')
  assert.equal(state.completed, 0)
  assert.equal(state.total, 5)
  assert.equal(state.current?.id, 'make-beat')
  assert.equal(state.current?.route, 'studio')
})

test('saved beat advances to a local master render, even inside the studio', () => {
  const state = nextMusicJourneyStep({ ...empty, beatSaved: true }, 'studio')
  assert.equal(state.completed, 1)
  assert.equal(state.current?.id, 'render-master')
  assert.equal(state.current?.route, 'studioDesk')
})

test('private master audition routes to the real listening booth before the stage', () => {
  const progress = { ...empty, beatSaved: true, masterRendered: true }
  assert.equal(nextMusicJourneyStep(progress, 'square').current?.route, 'releaseEntrance')
  assert.equal(nextMusicJourneyStep(progress, 'studio').current?.route, 'studioExit')
  const audition = nextMusicJourneyStep({ ...progress, releaseDraftSaved: true }, 'release')
  assert.equal(audition.current?.id, 'audition-private-master')
  assert.equal(audition.current?.route, 'releaseListening')
  assert.equal(nextMusicJourneyStep({ ...progress, releaseDraftSaved: true }, 'square').current?.route, 'releaseEntrance')
  assert.equal(nextMusicJourneyStep({ ...progress, releaseDraftSaved: true }, 'venue').current?.route, 'venueExit')
  assert.equal(nextMusicJourneyStep({ ...progress, releaseDraftSaved: true, releaseAuditionPlayed: true }, 'square').current?.route, 'palmEntrance')
  assert.equal(nextMusicJourneyStep({ ...progress, releaseDraftSaved: true, releaseAuditionPlayed: true }, 'venue').current?.route, 'stage')
})

test('journey stays complete without inventing a reward or another action', () => {
  const state = nextMusicJourneyStep({ ...empty, beatSaved: true, masterRendered: true, releaseDraftSaved: true, releaseAuditionPlayed: true, stagePreviewPlayed: true }, 'venue')
  assert.equal(state.completed, 5)
  assert.equal(state.current, null)
})
