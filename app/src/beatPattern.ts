export type BeatPattern = boolean[][]

export type SoundKit = 'afrobeats' | 'amapiano' | 'highlife'

export interface BeatArrangement {
  a: BeatPattern
  b: BeatPattern
  kit: SoundKit
  bpm: number
}

export const SOUND_KITS: Record<SoundKit, { name: string; tag: string; defaultBpm: number; labels: [string, string, string, string] }> = {
  afrobeats: { name: 'Afrobeats Core', tag: 'Lagos bounce', defaultBpm: 104, labels: ['Kick', 'Snare', 'Shaker', 'Log / Bass'] },
  amapiano: { name: 'Piano Groove', tag: 'Log drum roll', defaultBpm: 112, labels: ['Heavy Kick', 'Rim / Clap', 'Shaker Hat', 'Warm Bass'] },
  highlife: { name: 'Highlife Vibe', tag: 'Palmwine pulse', defaultBpm: 96, labels: ['Talking Kick', 'Woodblock', 'Hi-Hat', 'Bassline'] },
}

export const starterPattern = (): BeatPattern => [
  [true, false, false, false, true, false, false, false],
  [false, false, true, false, false, false, true, false],
  [true, true, true, true, true, true, true, true],
  [true, false, false, true, false, false, true, false],
]

export function clampBpm(bpm: number): number {
  if (!Number.isFinite(bpm)) return 104
  return Math.max(80, Math.min(140, Math.round(bpm)))
}

export function bpmToStepMs(bpm: number): number {
  const clamped = clampBpm(bpm)
  // 1 beat = 60 / bpm seconds. Each beat has 2 8th-note steps.
  // Step duration = (60 / bpm) / 2 = 30 / bpm seconds = 30000 / bpm ms
  return 30000 / clamped
}

export function toggleStep(pattern: BeatPattern, lane: number, step: number): BeatPattern {
  if (lane < 0 || lane >= 4 || step < 0 || step >= 8) return pattern
  return pattern.map((row, rowIndex) => row.map((on, stepIndex) => rowIndex === lane && stepIndex === step ? !on : on))
}

export function clearPattern(): BeatPattern {
  return [
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
  ]
}

export function validPattern(value: unknown): value is BeatPattern {
  return Array.isArray(value) && value.length === 4 && value.every(row => Array.isArray(row) && row.length === 8 && row.every(step => typeof step === 'boolean'))
}

export function sectionsDiffer(a: BeatPattern, b: BeatPattern): boolean {
  return a.some((row, lane) => row.some((on, step) => on !== b[lane][step]))
}
