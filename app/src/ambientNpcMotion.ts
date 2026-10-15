export interface AmbientWalkerRoute {
  readonly centerX: number
  readonly centerZ: number
  readonly radiusX: number
  readonly radiusZ: number
  readonly lapSeconds: number
  readonly direction: 1 | -1
  readonly variant: 0 | 1
}

export const AMBIENT_ACTOR_TRUTH = {
  actorType: 'NPC',
  cosmeticOnly: true,
  countsAsHuman: false,
  financialEffect: 'none',
  analyticsEligible: false,
  interactive: false,
  nonBlocking: true,
} as const

function makeRoute(centerX: number, centerZ: number, radiusX: number, radiusZ: number, lapSeconds: number, direction: 1 | -1, variant: 0 | 1): AmbientWalkerRoute {
  return { centerX, centerZ, radiusX, radiusZ, lapSeconds, direction, variant }
}

export const MUSIC_SQUARE_AMBIENT_WALKERS: readonly AmbientWalkerRoute[] = [
  makeRoute(-.85, 9.45, .3, .15, 12, 1, 0),
  makeRoute(1.05, 10.5, .18, .12, 14, -1, 1),
]

export function sampleAmbientWalker(route: AmbientWalkerRoute, time: number) {
  const turn = (((time % route.lapSeconds) + route.lapSeconds) % route.lapSeconds) / route.lapSeconds
  const angle = route.direction * Math.PI * 2 * turn
  const tangentX = -route.radiusX * Math.sin(angle) * route.direction
  const tangentZ = route.radiusZ * Math.cos(angle) * route.direction
  return {
    x: route.centerX + route.radiusX * Math.cos(angle),
    z: route.centerZ + route.radiusZ * Math.sin(angle),
    heading: Math.atan2(tangentX, tangentZ),
  }
}
