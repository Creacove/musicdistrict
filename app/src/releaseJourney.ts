import type { Hotspot } from './worldModel.ts'

export type ReleaseStationId = 'intake' | 'artwork' | 'metadata' | 'listening' | 'rights' | 'calendar'

export interface ReleaseStation {
  id: ReleaseStationId
  hotspot: Hotspot
  title: string
  instruction: string
  x: number
  z: number
  radius: number
}

/** Chapter 02 §7.3 order: prepare assets and declarations at their real stations. */
export const RELEASE_JOURNEY: readonly ReleaseStation[] = [
  { id: 'intake', hotspot: 'releaseIntake', title: 'Record Intake', instruction: 'Check the private master saved from City Studio.', x: 0, z: -3.5, radius: 2.1 },
  { id: 'artwork', hotspot: 'releaseArtwork', title: 'Artwork Frame', instruction: 'Choose and export original sleeve artwork.', x: -8, z: -8.5, radius: 2.1 },
  { id: 'metadata', hotspot: 'releaseMetadata', title: 'Title Sleeve', instruction: 'Set the song title, artist and genre.', x: -5.5, z: -1.5, radius: 2.1 },
  { id: 'listening', hotspot: 'releaseListening', title: 'Listening Booth', instruction: 'Audition the actual local master before continuing.', x: 9.5, z: -3.5, radius: 2.1 },
  { id: 'rights', hotspot: 'releaseRights', title: 'Rights Console', instruction: 'Review the original-work rights checklist.', x: 8.3, z: 1.8, radius: 2.1 },
  { id: 'calendar', hotspot: 'releaseCalendar', title: 'Release Calendar', instruction: 'Check local preflight and the read-only Friday window.', x: .8, z: 4.5, radius: 2.1 },
]

export function nextReleaseStation(id: ReleaseStationId): ReleaseStationId | null {
  const index = RELEASE_JOURNEY.findIndex(station => station.id === id)
  return index >= 0 ? RELEASE_JOURNEY[index + 1]?.id ?? null : null
}

export function previousReleaseStation(id: ReleaseStationId): ReleaseStationId | null {
  const index = RELEASE_JOURNEY.findIndex(station => station.id === id)
  return index > 0 ? RELEASE_JOURNEY[index - 1].id : null
}

export function releaseStation(id: ReleaseStationId): ReleaseStation {
  const station = RELEASE_JOURNEY.find(item => item.id === id)
  if (!station) throw new RangeError(`Unknown release station: ${id}`)
  return station
}
