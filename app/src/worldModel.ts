export type Location = 'square' | 'venue' | 'studio' | 'release'
export type Hotspot =
  | 'kiosk'
  | 'cityConcierge'
  | 'studio'
  | 'palmEntrance'
  | 'stage'
  | 'venueExit'
  | 'studioDesk'
  | 'studioExit'
  | 'releaseEntrance'
  | 'releaseIntake'
  | 'releaseArtwork'
  | 'releaseMetadata'
  | 'releaseListening'
  | 'releaseRights'
  | 'releaseCalendar'
  | 'releaseExit'

import { RELEASE_JOURNEY } from './releaseJourney.ts'

export interface ObstacleBox {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export interface ObstacleCircle {
  x: number
  z: number
  radius: number
}

export const BOUNDARIES: Record<Location, { minX: number; maxX: number; minZ: number; maxZ: number }> = {
  square: { minX: -18, maxX: 19, minZ: -12, maxZ: 16 },
  venue: { minX: -12, maxX: 12, minZ: -10.5, maxZ: 11.5 },
  studio: { minX: -11.5, maxX: 11.5, minZ: -10.5, maxZ: 10.5 },
  release: { minX: -11.5, maxX: 11.5, minZ: -10.5, maxZ: 10.5 },
}

export const OBSTACLES: Record<Location, { boxes: ObstacleBox[]; circles: ObstacleCircle[] }> = {
  square: {
    boxes: [
      // Kiosk structure
      { minX: -9.5, maxX: -6.5, minZ: 1.1, maxZ: 2.9 },
      // Covered arcade stage platform and backdrop
      { minX: -12.0, maxX: 1.0, minZ: -12.0, maxZ: -8.1 },
      // Palm Room building front
      { minX: 6.25, maxX: 15.75, minZ: -3.8, maxZ: 0.2 },
      // City Studio building front
      { minX: 9.5, maxX: 18.5, minZ: -14.0, maxZ: -10.0 },
      // Release House building front
      { minX: -18.25, maxX: -9.75, minZ: -14.0, maxZ: -10.0 },
      // Center planter
      { minX: -0.7, maxX: 3.7, minZ: 1.6, maxZ: 3.0 },
      // Left planter
      { minX: -17.7, maxX: -14.3, minZ: 9.3, maxZ: 10.7 },
      // Bench
      { minX: 1.1, maxX: 4.9, minZ: 8.4, maxZ: 9.6 },
    ],
    circles: [
      // District signpost
      { x: 4, z: 1.4, radius: 0.35 },
    ],
  },
  venue: {
    boxes: [
      // Stage wings and backstage
      { minX: -7.2, maxX: -3.2, minZ: -11.8, maxZ: -6.7 },
      { minX: 3.2, maxX: 7.2, minZ: -11.8, maxZ: -6.7 },
      { minX: -7.2, maxX: 7.2, minZ: -12.5, maxZ: -10.8 },
      // Bar counter
      { minX: -12.65, maxX: -6.15, minZ: -3.7, maxZ: -2.3 },
      // Mixing workstation
      { minX: 6.7, maxX: 10.9, minZ: 6.5, maxZ: 8.3 },
    ],
    circles: [
      // Lounge tables
      { x: -9, z: 4, radius: 0.8 },
      { x: -5.5, z: 6, radius: 0.8 },
      { x: 5, z: 4, radius: 0.8 },
      { x: 8.8, z: 1.3, radius: 0.8 },
    ],
  },
  studio: {
    boxes: [
      // Producer desk
      { minX: -4.2, maxX: 4.2, minZ: -7.7, maxZ: -4.7 },
      // Vocal booth structure
      { minX: 7.1, maxX: 12.5, minZ: -11.1, maxZ: -3.8 },
    ],
    circles: [],
  },
  release: {
    boxes: [
      // Record intake counter
      { minX: -4.4, maxX: 4.4, minZ: -7.5, maxZ: -4.5 },
      // Listening booth
      { minX: 8.1, maxX: 10.9, minZ: -6.5, maxZ: -5.1 },
      // Sleeve writing desk, rights console and calendar machine
      { minX: -7.3, maxX: -3.7, minZ: -4.4, maxZ: -3.1 },
      { minX: 9.9, maxX: 12, minZ: .7, maxZ: 3.1 },
      { minX: -.45, maxX: 2.05, minZ: 5.2, maxZ: 6.3 },
    ],
    circles: [],
  },
}

const hotspots: Record<Location, { id: Hotspot; x: number; z: number; radius: number }[]> = {
  square: [
    { id: 'kiosk', x: -8, z: 2, radius: 3.2 },
    { id: 'cityConcierge', x: 3.8, z: 6.3, radius: 2.5 },
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
    { id: 'studioExit', x: -10, z: 9, radius: 3 },
  ],
  release: [
    ...RELEASE_JOURNEY.map(({ hotspot: id, x, z, radius }) => ({ id, x, z, radius })),
    { id: 'releaseExit', x: -10, z: 9, radius: 3 },
  ],
}

export function getNearby(location: Location, x: number, z: number): Hotspot | null {
  const point = hotspots[location].find(h => Math.hypot(x - h.x, z - h.z) <= h.radius)
  return point?.id ?? null
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

function checkCircleBoxCollision(x: number, z: number, r: number, box: ObstacleBox): boolean {
  const closestX = clamp(x, box.minX, box.maxX)
  const closestZ = clamp(z, box.minZ, box.maxZ)
  const dx = x - closestX
  const dz = z - closestZ
  return dx * dx + dz * dz < r * r
}

function checkCircleCollision(x: number, z: number, r: number, circle: ObstacleCircle): boolean {
  const dx = x - circle.x
  const dz = z - circle.z
  const minDistance = circle.radius + r
  return dx * dx + dz * dz < minDistance * minDistance
}

export function isPointBlocked(location: Location, x: number, z: number, radius = 0.35): boolean {
  const bounds = BOUNDARIES[location]
  if (x < bounds.minX + radius || x > bounds.maxX - radius || z < bounds.minZ + radius || z > bounds.maxZ - radius) {
    return true
  }
  const obstacles = OBSTACLES[location]
  for (const box of obstacles.boxes) {
    if (checkCircleBoxCollision(x, z, radius, box)) return true
  }
  for (const circ of obstacles.circles) {
    if (checkCircleCollision(x, z, radius, circ)) return true
  }
  return false
}

export function resolveCollision(
  location: Location,
  currX: number,
  currZ: number,
  targetX: number,
  targetZ: number,
  radius = 0.35
): { x: number; z: number } {
  const bounds = BOUNDARIES[location]
  const obstacles = OBSTACLES[location]

  // Step 1: Resolve X movement
  let stepX = clamp(targetX, bounds.minX + radius, bounds.maxX - radius)
  let stepZ = currZ

  for (const box of obstacles.boxes) {
    // Only collide if within Z span of the box
    if (stepZ >= box.minZ - radius && stepZ <= box.maxZ + radius) {
      if (currX >= box.maxX + radius && stepX < box.maxX + radius) {
        stepX = box.maxX + radius
      } else if (currX <= box.minX - radius && stepX > box.minX - radius) {
        stepX = box.minX - radius
      } else if (checkCircleBoxCollision(stepX, stepZ, radius, box)) {
        // Fallback if already intersecting
        stepX = currX >= (box.minX + box.maxX) / 2 ? box.maxX + radius : box.minX - radius
      }
    }
  }

  for (const circ of obstacles.circles) {
    const minDistance = circ.radius + radius
    const dz = stepZ - circ.z
    if (Math.abs(dz) < minDistance) {
      const allowedDx = Math.sqrt(Math.max(0, minDistance * minDistance - dz * dz))
      if (currX >= circ.x + allowedDx && stepX < circ.x + allowedDx) {
        stepX = circ.x + allowedDx
      } else if (currX <= circ.x - allowedDx && stepX > circ.x - allowedDx) {
        stepX = circ.x - allowedDx
      }
    }
  }

  // Step 2: Resolve Z movement
  stepZ = clamp(targetZ, bounds.minZ + radius, bounds.maxZ - radius)

  for (const box of obstacles.boxes) {
    // Only collide if within X span of the box
    if (stepX >= box.minX - radius && stepX <= box.maxX + radius) {
      if (currZ >= box.maxZ + radius && stepZ < box.maxZ + radius) {
        stepZ = box.maxZ + radius
      } else if (currZ <= box.minZ - radius && stepZ > box.minZ - radius) {
        stepZ = box.minZ - radius
      } else if (checkCircleBoxCollision(stepX, stepZ, radius, box)) {
        // Fallback if already intersecting
        stepZ = currZ >= (box.minZ + box.maxZ) / 2 ? box.maxZ + radius : box.minZ - radius
      }
    }
  }

  for (const circ of obstacles.circles) {
    const minDistance = circ.radius + radius
    const dx = stepX - circ.x
    if (Math.abs(dx) < minDistance) {
      const allowedDz = Math.sqrt(Math.max(0, minDistance * minDistance - dx * dx))
      if (currZ >= circ.z + allowedDz && stepZ < circ.z + allowedDz) {
        stepZ = circ.z + allowedDz
      } else if (currZ <= circ.z - allowedDz && stepZ > circ.z - allowedDz) {
        stepZ = circ.z - allowedDz
      }
    }
  }

  return {
    x: clamp(stepX, bounds.minX + radius, bounds.maxX - radius),
    z: clamp(stepZ, bounds.minZ + radius, bounds.maxZ - radius),
  }
}
