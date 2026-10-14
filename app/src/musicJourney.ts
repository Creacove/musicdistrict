import type { Hotspot, Location } from './worldModel.ts'

export type MusicJourneyProgress = {
  beatSaved: boolean
  masterRendered: boolean
  releaseDraftSaved: boolean
  releaseAuditionPlayed: boolean
  stagePreviewPlayed: boolean
}

export type MusicJourneyStep = {
  id: 'make-beat' | 'render-master' | 'save-release-draft' | 'audition-private-master' | 'preview-on-stage'
  title: string
  instruction: string
  destination: 'studio' | 'release' | 'venue'
  hotspot: Hotspot
  route: Hotspot
}

const STEPS = [
  { id: 'make-beat', title: 'Shape your first beat', instruction: 'Arrange a two-section groove in City Studio and save it on this device.', destination: 'studio', hotspot: 'studioDesk' },
  { id: 'render-master', title: 'Render a private master', instruction: 'Create a local 30-second WAV preview. Nothing leaves this device.', destination: 'studio', hotspot: 'studioDesk' },
  { id: 'save-release-draft', title: 'Prepare a release draft', instruction: 'Save a private sleeve in Release House. It is not submitted or scheduled.', destination: 'release', hotspot: 'releaseMetadata' },
  { id: 'audition-private-master', title: 'Audition your private master', instruction: 'Play your local master at the Listening Booth. This is not a public listen or release.', destination: 'release', hotspot: 'releaseListening' },
  { id: 'preview-on-stage', title: 'Preview your music on stage', instruction: 'Play your local master at Palm Room. No tickets or attendance are recorded.', destination: 'venue', hotspot: 'stage' },
] as const

function routeTo(location: Location, destination: MusicJourneyStep['destination'], destinationHotspot: Hotspot): Hotspot {
  if (location === destination) {
    return destinationHotspot
  }
  if (location === 'studio') return 'studioExit'
  if (location === 'release') return 'releaseExit'
  if (location === 'venue') return 'venueExit'
  if (destination === 'studio') return 'studio'
  if (destination === 'release') return 'releaseEntrance'
  return 'palmEntrance'
}

export function nextMusicJourneyStep(progress: MusicJourneyProgress, location: Location) {
  const done = [
    progress.beatSaved || progress.masterRendered,
    progress.masterRendered,
    progress.releaseDraftSaved,
    progress.releaseAuditionPlayed,
    progress.stagePreviewPlayed,
  ]
  const index = done.findIndex(value => !value)
  const complete = index < 0
  const current = complete ? null : { ...STEPS[index], route: routeTo(location, STEPS[index].destination, STEPS[index].hotspot) } as MusicJourneyStep
  return { completed: complete ? STEPS.length : index, total: STEPS.length, current }
}
