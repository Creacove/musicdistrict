export type LightingMode = 'day' | 'golden' | 'night'

export interface LightingPreset {
  label: string
  icon: string
  background: string
  fog: string
  skyColor: string
  groundColor: string
  ambientIntensity: number
  sunColor: string
  sunIntensity: number
  sunPos: [number, number, number]
  exposure: number
}

export const LIGHTING_PRESETS: Record<LightingMode, LightingPreset> = {
  day: {
    label: 'DAYLIGHT',
    icon: '☀',
    background: '#5a7e9e',
    fog: '#5a7e9e',
    skyColor: '#f0f5fc',
    groundColor: '#8a7460',
    ambientIntensity: 2.1,
    sunColor: '#fff5df',
    sunIntensity: 2.3,
    sunPos: [-4, 22, 6],
    exposure: 1.12,
  },
  golden: {
    label: 'GOLDEN HOUR',
    icon: '🌅',
    background: '#998b9b',
    fog: '#827584',
    skyColor: '#f3d8d6',
    groundColor: '#82634e',
    ambientIntensity: 2.15,
    sunColor: '#ffd3a2',
    sunIntensity: 2.4,
    sunPos: [-8, 16, 9],
    exposure: 1.12,
  },
  night: {
    label: 'NIGHT VIBE',
    icon: '🌙',
    background: '#161320',
    fog: '#161320',
    skyColor: '#3a2d55',
    groundColor: '#1a1422',
    ambientIntensity: 1.2,
    sunColor: '#7b8cb8',
    sunIntensity: 0.9,
    sunPos: [10, 14, -8],
    exposure: 1.25,
  },
}

export function getNextLightingMode(current: LightingMode): LightingMode {
  if (current === 'day') return 'golden'
  if (current === 'golden') return 'night'
  return 'day'
}
