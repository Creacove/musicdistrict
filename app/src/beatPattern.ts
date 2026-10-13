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

export function sectionsDiffer(a: BeatPattern, b: BeatPattern): boolean {
  return a.some((row, lane) => row.some((on, step) => on !== b[lane][step]))
}

// Original, deterministic synthesized audio; 12 alternating bars at 96 BPM = 30 seconds.
export function renderMasterWav(a: BeatPattern, b: BeatPattern): Uint8Array {
  const rate = 22050, seconds = 30, samples = rate * seconds
  const pcm = new Float32Array(samples)
  const stepSamples = Math.floor(rate * .3125)
  for (let bar = 0; bar < 12; bar++) for (let step = 0; step < 8; step++) {
    const pattern = bar % 2 ? b : a, start = (bar * 8 + step) * stepSamples
    for (let lane = 0; lane < 4; lane++) {
      if (!pattern[lane][step]) continue
      const length = Math.min(lane === 3 ? .28 : .17, seconds - start / rate)
      for (let i = 0; i < length * rate; i++) {
        const t = i / rate, fade = Math.exp(-t * (lane === 3 ? 10 : 24))
        const wave = lane === 0 ? Math.sin(2 * Math.PI * (58 + 75 * Math.exp(-t * 30)) * t)
          : lane === 1 ? Math.sin(2 * Math.PI * 185 * t) * .45 + Math.sin(i * 17.23) * .55
          : lane === 2 ? Math.sin(i * 71.31) * .6 + Math.sin(i * 43.17) * .4
          : Math.sin(2 * Math.PI * 110 * t)
        pcm[start + i] += wave * fade * [0.32, 0.13, 0.06, 0.18][lane]
      }
    }
  }
  const bytes = new Uint8Array(44 + samples * 2), view = new DataView(bytes.buffer)
  const word = (at: number, value: number) => view.setUint32(at, value, true)
  const short = (at: number, value: number) => view.setUint16(at, value, true)
  for (const [at, chars] of [[0, 'RIFF'], [8, 'WAVE'], [12, 'fmt '], [36, 'data']] as const) for (let i = 0; i < 4; i++) bytes[at + i] = chars.charCodeAt(i)
  word(4, bytes.length - 8); word(16, 16); short(20, 1); short(22, 1); word(24, rate); word(28, rate * 2); short(32, 2); short(34, 16); word(40, samples * 2)
  for (let i = 0; i < samples; i++) view.setInt16(44 + i * 2, Math.max(-32767, Math.min(32767, Math.round(pcm[i] * 32767))), true)
  return bytes
}
