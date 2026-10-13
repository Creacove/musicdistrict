export type Location = 'square' | 'venue' | 'studio' | 'release'
export type Hotspot = 'kiosk' | 'studio' | 'palmEntrance' | 'stage' | 'venueExit' | 'studioDesk' | 'studioExit' | 'releaseEntrance' | 'releaseIntake' | 'releaseExit'

const hotspots: Record<Location, { id: Hotspot; x: number; z: number; radius: number }[]> = {
  square: [
    { id: 'kiosk', x: -8, z: 2, radius: 3.2 },
    { id: 'studio', x: 13, z: -8, radius: 3.2 },
    { id: 'releaseEntrance', x: -13, z: -8, radius: 3.3 },
    { id: 'palmEntrance', x: 10, z: 2, radius: 3.3 },
  ],
  venue: [
    { id: 'stage', x: 0, z: -7, radius: 3.6 },
    { id: 'venueExit', x: -10, z: 9, radius: 2.8 },
  ],
  studio: [
    { id: 'studioDesk', x: 0, z: -5.5, radius: 3.4 },
    { id: 'studioExit', x: 0, z: 9, radius: 3 },
  ],
  release: [
    { id: 'releaseIntake', x: 0, z: -5.5, radius: 3.5 },
    { id: 'releaseExit', x: 0, z: 9, radius: 3 },
  ],
}

export function getNearby(location: Location, x: number, z: number): Hotspot | null {
  const point = hotspots[location].find(h => Math.hypot(x - h.x, z - h.z) <= h.radius)
  return point?.id ?? null
}
