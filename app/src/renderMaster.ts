import type { BeatPattern, SoundKit } from './beatPattern.ts'

// Original, deterministic synthesized audio; 30-second master with kit timbre and tempo.
export function renderMasterWav(a: BeatPattern, b: BeatPattern, kit: SoundKit = 'afrobeats', bpm = 96): Uint8Array {
  const rate = 22050, seconds = 30, samples = rate * seconds
  const pcm = new Float32Array(samples)
  const clampedBpm = Math.max(80, Math.min(140, Math.round(bpm)))
  const stepDuration = 30 / clampedBpm
  const stepSamples = Math.floor(rate * stepDuration)
  const totalBars = Math.floor(seconds / (stepDuration * 8))

  for (let bar = 0; bar < totalBars; bar++) for (let step = 0; step < 8; step++) {
    const pattern = bar % 2 ? b : a, start = (bar * 8 + step) * stepSamples
    if (start >= samples) break
    for (let lane = 0; lane < 4; lane++) {
      if (!pattern[lane][step]) continue
      const length = Math.min(lane === 3 ? (kit === 'amapiano' ? .34 : .26) : .16, seconds - start / rate)
      for (let i = 0; i < length * rate; i++) {
        const t = i / rate
        const fade = Math.exp(-t * (lane === 3 ? (kit === 'amapiano' ? 7 : 12) : lane === 2 ? 35 : 22))
        let wave = 0
        if (lane === 0) {
          // Kick: afrobeats punchy sweep, amapiano sub-heavy, highlife organic tone
          const f0 = kit === 'amapiano' ? 45 : kit === 'highlife' ? 70 : 60
          const sweep = kit === 'amapiano' ? 85 : 70
          wave = Math.sin(2 * Math.PI * (f0 + sweep * Math.exp(-t * 32)) * t)
        } else if (lane === 1) {
          // Snare / Rim: snap or clap
          wave = kit === 'amapiano'
            ? Math.sin(2 * Math.PI * 320 * t) * .35 + (Math.sin(i * 31.4) * .65)
            : Math.sin(2 * Math.PI * 190 * t) * .4 + (Math.sin(i * 17.23) * .6)
        } else if (lane === 2) {
          // Shaker / Hat: metallic hiss / shaker texture
          wave = Math.sin(i * (kit === 'highlife' ? 88.19 : 71.31)) * .6 + Math.sin(i * 43.17) * .4
        } else {
          // Bass / Log: warm bass or log drum slide
          const bassFreq = kit === 'amapiano' ? (82 - 24 * Math.exp(-t * 8)) : kit === 'highlife' ? 130 : 110
          wave = Math.sin(2 * Math.PI * bassFreq * t) + (kit === 'amapiano' ? Math.sin(4 * Math.PI * bassFreq * t) * .2 : 0)
        }
        pcm[start + i] += wave * fade * [0.32, 0.14, 0.07, 0.20][lane]
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
