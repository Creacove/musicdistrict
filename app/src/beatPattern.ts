export type BeatPattern = boolean[][]
export const starterPattern = (): BeatPattern => [
  [true, false, false, false, true, false, false, false],
  [false, false, true, false, false, false, true, false],
  [true, true, true, true, true, true, true, true],
  [true, false, false, true, false, false, true, false],
]
export function toggleStep(pattern: BeatPattern, lane: number, step: number): BeatPattern {
  if (lane < 0 || lane >= 4 || step < 0 || step >= 8) return pattern
  return pattern.map((row, rowIndex) => row.map((on, stepIndex) => rowIndex === lane && stepIndex === step ? !on : on))
}
export function validPattern(value: unknown): value is BeatPattern {
  return Array.isArray(value) && value.length === 4 && value.every(row => Array.isArray(row) && row.length === 8 && row.every(step => typeof step === 'boolean'))
}
