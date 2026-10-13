import { BOUNDARIES, isPointBlocked, type Location } from './worldModel.ts'

export type WalkPoint = [number, number]

const CELL = 0.8
const CLEARANCE = 0.43

function clearSegment(location: Location, from: WalkPoint, to: WalkPoint): boolean {
  const distance = Math.hypot(to[0] - from[0], to[1] - from[1])
  const steps = Math.max(1, Math.ceil(distance / 0.25))
  for (let step = 1; step <= steps; step++) {
    const t = step / steps
    if (isPointBlocked(location, from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t, CLEARANCE)) return false
  }
  return true
}

export function findWalkPath(location: Location, from: WalkPoint, to: WalkPoint): WalkPoint[] {
  if (isPointBlocked(location, to[0], to[1], CLEARANCE)) return []
  if (clearSegment(location, from, to)) return [to]

  const bounds = BOUNDARIES[location]
  const width = Math.floor((bounds.maxX - bounds.minX) / CELL) + 1
  const height = Math.floor((bounds.maxZ - bounds.minZ) / CELL) + 1
  const points: WalkPoint[] = []
  const passable: boolean[] = []
  for (let z = 0; z < height; z++) for (let x = 0; x < width; x++) {
    const point: WalkPoint = [bounds.minX + x * CELL, bounds.minZ + z * CELL]
    points.push(point)
    passable.push(!isPointBlocked(location, point[0], point[1], CLEARANCE))
  }

  function nearestConnected(point: WalkPoint): number {
    const candidates = points.map((p, index) => ({ index, distance: Math.hypot(p[0] - point[0], p[1] - point[1]) }))
      .filter(item => passable[item.index]).sort((a, b) => a.distance - b.distance)
    for (const candidate of candidates) if (clearSegment(location, point, points[candidate.index])) return candidate.index
    return -1
  }

  const start = nearestConnected(from)
  const goal = nearestConnected(to)
  if (start < 0 || goal < 0) return []

  const score = new Float64Array(points.length).fill(Infinity)
  const previous = new Int32Array(points.length).fill(-1)
  const open = new Set<number>([start])
  const closed = new Set<number>()
  score[start] = 0
  const offsets = [-1, 0, 1]

  while (open.size) {
    let current = -1, best = Infinity
    for (const index of open) {
      const estimate = score[index] + Math.hypot(points[index][0] - points[goal][0], points[index][1] - points[goal][1])
      if (estimate < best) { best = estimate; current = index }
    }
    if (current === goal) break
    open.delete(current); closed.add(current)
    const x = current % width, z = Math.floor(current / width)
    for (const dz of offsets) for (const dx of offsets) {
      if (!dx && !dz) continue
      const nx = x + dx, nz = z + dz
      if (nx < 0 || nx >= width || nz < 0 || nz >= height) continue
      const next = nz * width + nx
      if (!passable[next] || closed.has(next) || !clearSegment(location, points[current], points[next])) continue
      const cost = score[current] + Math.hypot(dx, dz) * CELL
      if (cost < score[next]) { score[next] = cost; previous[next] = current; open.add(next) }
    }
  }
  if (start !== goal && previous[goal] < 0) return []

  const raw: WalkPoint[] = [to]
  for (let cursor = goal; cursor !== start; cursor = previous[cursor]) raw.unshift(points[cursor])
  raw.unshift(points[start])
  const path: WalkPoint[] = []
  let anchor = from, index = 0
  while (index < raw.length) {
    let next = index
    for (let candidate = raw.length - 1; candidate > index; candidate--) {
      if (clearSegment(location, anchor, raw[candidate])) { next = candidate; break }
    }
    path.push(raw[next])
    anchor = raw[next]
    index = next + 1
  }
  return path
}
