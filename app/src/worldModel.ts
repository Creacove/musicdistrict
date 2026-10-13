export type Location = 'square' | 'venue'
export type Hotspot = 'kiosk' | 'studio' | 'palmEntrance' | 'stage' | 'venueExit'

const hotspots: Record<Location, { id: Hotspot; x: number; z: number; radius: number }[]> = {
  square: [
    { id: 'kiosk', x: -8, z: 2, radius: 3.2 },
    { id: 'studio', x: 13, z: -8, radius: 3.2 },
    { id: 'palmEntrance', x: 10, z: 2, radius: 3.3 },
  ],
  venue: [
    { id: 'stage', x: 0, z: -7, radius: 3.6 },
    { id: 'venueExit', x: -10, z: 9, radius: 2.8 },
  ],
}

export function getNearby(location: Location, x: number, z: number): Hotspot | null {
  const point = hotspots[location].find(h => Math.hypot(x - h.x, z - h.z) <= h.radius)
  return point?.id ?? null
}
