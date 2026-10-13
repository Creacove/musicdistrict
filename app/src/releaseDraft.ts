export type ReleaseDraft = { title: string; artist: string; artwork: 'rose' | 'teal' | 'night' }
export const blankReleaseDraft = (): ReleaseDraft => ({ title: '', artist: '', artwork: 'rose' })
export function validReleaseDraft(value: unknown): value is ReleaseDraft {
  if (!value || typeof value !== 'object') return false
  const draft = value as Record<string, unknown>
  return typeof draft.title === 'string' && draft.title.length <= 80 && typeof draft.artist === 'string' && draft.artist.length <= 80 && ['rose', 'teal', 'night'].includes(String(draft.artwork))
}
export function releaseBlockers(draft: ReleaseDraft, hasMaster: boolean): string[] {
  const blockers: string[] = []
  if (!draft.title.trim()) blockers.push('Add a title')
  if (!draft.artist.trim()) blockers.push('Add the artist name')
  if (!hasMaster) blockers.push('Render a 30-second, two-section master')
  blockers.push('Add credits and obtain contributor consent')
  blockers.push('Complete rights review and server submission')
  return blockers
}
