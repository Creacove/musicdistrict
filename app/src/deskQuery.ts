import type { Hotspot, Location } from './worldModel.ts'

export type DeskQueryResult = {
  kind: 'action' | 'fallback'
  title: string
  message: string
  label: string
  route: Hotspot | null
  suggestions: string[]
}

type Activity = {
  terms: string[]
  title: string
  message: string
  label: string
  location: Location
  hotspot: Hotspot
  entrance: Hotspot
}

const ACTIVITIES: Activity[] = [
  {
    terms: ['make a beat', 'beat', 'producer desk', 'make music', 'create music', 'studio'],
    title: 'Make a beat',
    message: 'Use the free producer desk. Your beat stays on this device.',
    label: 'Go to City Studio',
    location: 'studio',
    hotspot: 'studioDesk',
    entrance: 'studio',
  },
  {
    terms: ['release', 'publish', 'upload', 'sleeve', 'cover art'],
    title: 'Prepare a release draft',
    message: 'Release House can prepare a private sleeve and local master audition. Upload, rights review, and publication are unavailable here.',
    label: 'Go to Release House',
    location: 'release',
    hotspot: 'releaseIntake',
    entrance: 'releaseEntrance',
  },
  {
    terms: ['listen to music', 'listening station', 'new music', 'hear music', 'song', 'kiosk'],
    title: 'Listen to music',
    message: 'Play an original discovery preview at the listening station. Playback starts only when you choose it.',
    label: 'Go to the listening station',
    location: 'square',
    hotspot: 'kiosk',
    entrance: 'kiosk',
  },
  {
    terms: ['palm room', 'venue', 'stage', 'concert', 'perform', 'live show'],
    title: 'Explore Palm Room',
    message: 'Walk into the free venue and inspect its rehearsal stage. A preview does not sell tickets or record attendance.',
    label: 'Go to Palm Room',
    location: 'venue',
    hotspot: 'stage',
    entrance: 'palmEntrance',
  },
]

const FALLBACK: DeskQueryResult = {
  kind: 'fallback',
  title: 'I could not match that yet',
  message: 'Choose a known activity below. Desk guidance is local and does not make decisions for you.',
  label: '',
  route: null,
  suggestions: ['Make a beat', 'Listen to music', 'Visit Palm Room'],
}

function routeTo(location: Location, activity: Activity): Hotspot {
  if (location === activity.location) return activity.hotspot
  if (location === 'studio') return 'studioExit'
  if (location === 'release') return 'releaseExit'
  if (location === 'venue') return 'venueExit'
  return activity.entrance
}

export function resolveDeskQuestion(query: string, location: Location): DeskQueryResult {
  const normalized = query.trim().toLocaleLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ')
  if (!normalized) return { ...FALLBACK, suggestions: [...FALLBACK.suggestions] }
  const activity = ACTIVITIES.find(candidate => candidate.terms.some(term => normalized.includes(term)))
  if (!activity) return { ...FALLBACK, suggestions: [...FALLBACK.suggestions] }
  return {
    kind: 'action',
    title: activity.title,
    message: activity.message,
    label: activity.label,
    route: routeTo(location, activity),
    suggestions: [],
  }
}
