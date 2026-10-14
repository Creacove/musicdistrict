export type StageLook = 'warm' | 'sunset' | 'spotlight'

export type StageTemplate = {
  version: 1
  lightLook: StageLook
  floorLightPreview: boolean
}

export const DEFAULT_STAGE_TEMPLATE: StageTemplate = {
  version: 1,
  lightLook: 'warm',
  floorLightPreview: false,
}

const stageLooks = new Set<StageLook>(['warm', 'sunset', 'spotlight'])

export function parseStageTemplate(serialized: string | null): StageTemplate {
  if (!serialized) return { ...DEFAULT_STAGE_TEMPLATE }
  try {
    const value: unknown = JSON.parse(serialized)
    if (!value || typeof value !== 'object') return { ...DEFAULT_STAGE_TEMPLATE }
    const template = value as Record<string, unknown>
    if (template.version !== 1 || !stageLooks.has(template.lightLook as StageLook) || typeof template.floorLightPreview !== 'boolean') {
      return { ...DEFAULT_STAGE_TEMPLATE }
    }
    return {
      version: 1,
      lightLook: template.lightLook as StageLook,
      floorLightPreview: template.floorLightPreview,
    }
  } catch {
    return { ...DEFAULT_STAGE_TEMPLATE }
  }
}

export function serializeStageTemplate(template: StageTemplate): string {
  if (template.version !== 1 || !stageLooks.has(template.lightLook) || typeof template.floorLightPreview !== 'boolean') {
    throw new TypeError('Invalid stage preview template')
  }
  return JSON.stringify({
    version: 1,
    lightLook: template.lightLook,
    floorLightPreview: template.floorLightPreview,
  })
}
