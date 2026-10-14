export type ArtworkVariant = 'rose' | 'teal' | 'night' | 'amber' | 'lagos-violet'

export type ReleaseGenre = 'afrobeats' | 'amapiano' | 'highlife' | 'afro-fusion' | 'street-pop'

export interface RightsDeclarations {
  masterOwnership: boolean
  originalComposition: boolean
  sampleClearance: boolean
  contributorConsent: boolean
}

export interface ReleaseDraft {
  title: string
  artist: string
  genre: ReleaseGenre
  artwork: ArtworkVariant
  rights: RightsDeclarations
  status: 'DRAFT' | 'PREFLIGHT_READY'
}

export const blankRightsDeclarations = (): RightsDeclarations => ({
  masterOwnership: false,
  originalComposition: false,
  sampleClearance: false,
  contributorConsent: false,
})

export const blankReleaseDraft = (): ReleaseDraft => ({
  title: '',
  artist: '',
  genre: 'afrobeats',
  artwork: 'rose',
  rights: blankRightsDeclarations(),
  status: 'DRAFT',
})

export const ARTWORK_PALETTES: Record<ArtworkVariant, { name: string; gradient: string; accent: string }> = {
  rose: { name: 'Eko Rose', gradient: 'radial-gradient(circle at 80% 12%,#ea7fa7,#702455 49%,#1b2033)', accent: '#ea7fa7' },
  teal: { name: 'Marina Teal', gradient: 'radial-gradient(circle at 80% 12%,#87e1c6,#216e77 49%,#181d37)', accent: '#87e1c6' },
  night: { name: 'Broad St Night', gradient: 'radial-gradient(circle at 80% 12%,#d9b878,#403b74 49%,#121729)', accent: '#d9b878' },
  amber: { name: 'Lekki Amber', gradient: 'radial-gradient(circle at 80% 12%,#f3a152,#7c3710 49%,#22162b)', accent: '#f3a152' },
  'lagos-violet': { name: 'Lagos Neon', gradient: 'radial-gradient(circle at 80% 12%,#c084fc,#491069 49%,#16132b)', accent: '#c084fc' },
}

export const RELEASE_GENRES: Record<ReleaseGenre, string> = {
  afrobeats: 'Afrobeats',
  amapiano: 'Amapiano',
  highlife: 'Highlife',
  'afro-fusion': 'Afro-fusion',
  'street-pop': 'Street-pop',
}

export function validReleaseDraft(value: unknown): value is ReleaseDraft {
  if (!value || typeof value !== 'object') return false
  const draft = value as Record<string, unknown>
  const validArtwork = Object.keys(ARTWORK_PALETTES).includes(String(draft.artwork))
  const validGenre = Object.keys(RELEASE_GENRES).includes(String(draft.genre))
  const rights = draft.rights as Record<string, unknown> | undefined
  const validRights = typeof rights === 'object' && rights !== null &&
    typeof rights.masterOwnership === 'boolean' &&
    typeof rights.originalComposition === 'boolean' &&
    typeof rights.sampleClearance === 'boolean' &&
    typeof rights.contributorConsent === 'boolean'

  return typeof draft.title === 'string' && draft.title.length <= 80 &&
    typeof draft.artist === 'string' && draft.artist.length <= 80 &&
    validArtwork && validGenre && validRights
}

export function getMissingRights(rights: RightsDeclarations): string[] {
  const missing: string[] = []
  if (!rights.masterOwnership) missing.push('Affirm sound recording/master ownership')
  if (!rights.originalComposition) missing.push('Affirm original lyrics/melody composition')
  if (!rights.sampleClearance) missing.push('Affirm licensed loop/sample clearance')
  if (!rights.contributorConsent) missing.push('Obtain all contributor & performer consents')
  return missing
}

export function releaseBlockers(draft: ReleaseDraft, hasMaster: boolean): string[] {
  const blockers: string[] = []
  if (!draft.title.trim()) blockers.push('Add a title')
  if (!draft.artist.trim()) blockers.push('Add the artist name')
  if (!hasMaster) blockers.push('Render a 30-second City Studio master')

  const missingRights = getMissingRights(draft.rights)
  blockers.push(...missingRights)

  // Authoritative server gate reminder
  blockers.push('Authoritative server submission and Friday scheduling service pending')
  return blockers
}

export function canPreflight(draft: ReleaseDraft, hasMaster: boolean): boolean {
  return draft.title.trim().length > 0 &&
    draft.artist.trim().length > 0 &&
    hasMaster &&
    draft.rights.masterOwnership &&
    draft.rights.originalComposition &&
    draft.rights.sampleClearance &&
    draft.rights.contributorConsent
}
