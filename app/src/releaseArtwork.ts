import { ARTWORK_PALETTES, RELEASE_GENRES, type ReleaseDraft } from './releaseDraft.ts'

const ink: Record<ReleaseDraft['artwork'], [string, string, string]> = {
  rose: ['#171526', '#762b56', '#f1a1b8'],
  teal: ['#131b2d', '#1c6772', '#9ae2cf'],
  night: ['#15172b', '#403b74', '#e6cb8d'],
  amber: ['#201528', '#7c3710', '#ffc071'],
  'lagos-violet': ['#17132b', '#491069', '#d49bff'],
}

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

function titleLines(title: string): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of (title.trim() || 'UNTITLED').split(/\s+/)) {
    if (line && `${line} ${word}`.length > 18 && lines.length < 2) { lines.push(line); line = word }
    else line = line ? `${line} ${word}` : word
  }
  lines.push(line)
  return lines.slice(0, 3).map((part, index, all) => index === 2 && all.length === 3 && part.length > 18 ? `${part.slice(0, 17)}…` : part)
}

/** Portable, original SVG sleeve art. All user text is escaped before it enters markup. */
export function createReleaseSleeveSvg(draft: ReleaseDraft): string {
  const [base, mid, light] = ink[draft.artwork]
  const title = titleLines(draft.title).map((line, i) => `<text x="90" y="${660 + i * 94}" font-size="82" font-weight="800">${escapeXml(line)}</text>`).join('')
  const city = Array.from({ length: 18 }, (_, i) => {
    const x = i * 68 - 10, h = 90 + ((i * 53 + 61) % 210)
    return `<rect x="${x}" y="${680 - h}" width="58" height="${h}" fill="${i % 3 === 0 ? light : mid}" opacity=".7"/><path d="M${x + 13} ${700 - h}v${h - 28}m20 -${h - 28}v${h - 28}" stroke="${base}" stroke-width="7" opacity=".55"/>`
  }).join('')
  const artist = escapeXml(draft.artist.trim() || 'ARTIST NAME')
  const genre = escapeXml(RELEASE_GENRES[draft.genre] || 'Afrobeats')
  const label = escapeXml(ARTWORK_PALETTES[draft.artwork].name.toUpperCase())
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200"><defs><linearGradient id="bg" x2=".9" y2="1"><stop stop-color="${light}"/><stop offset=".42" stop-color="${mid}"/><stop offset="1" stop-color="${base}"/></linearGradient><radialGradient id="glow"><stop stop-color="${light}" stop-opacity=".72"/><stop offset="1" stop-color="${light}" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="1200" fill="url(#bg)"/><circle cx="915" cy="310" r="390" fill="url(#glow)"/><g fill="none" stroke="${light}" opacity=".22"><circle cx="930" cy="330" r="250" stroke-width="2"/><circle cx="930" cy="330" r="190" stroke-width="2"/><circle cx="930" cy="330" r="130" stroke-width="2"/></g><path d="M760 245v225a80 80 0 1 1-42-70V195l250-55v265a80 80 0 1 1-42-70V196z" fill="${light}" opacity=".92"/><rect y="670" width="1200" height="260" fill="${base}" opacity=".25"/>${city}<rect y="700" width="1200" height="500" fill="url(#bg)" opacity=".48"/><text x="90" y="112" fill="#fff" font-family="Arial,sans-serif" font-size="34" font-weight="700" letter-spacing="8">THE SCENE  /  LAGOS</text><text x="90" y="570" fill="#fff" font-family="Arial,sans-serif">${title}</text><text x="94" y="${Math.min(1030, 710 + titleLines(draft.title).length * 94)}" fill="#fff" font-family="Arial,sans-serif" font-size="34" font-weight="600" letter-spacing="4">${artist}</text><rect x="90" y="1080" width="310" height="58" rx="29" fill="${light}"/><text x="245" y="1118" text-anchor="middle" fill="${base}" font-family="Arial,sans-serif" font-size="22" font-weight="800" letter-spacing="3">${genre.toUpperCase()}</text><text x="1110" y="1120" text-anchor="end" fill="#fff" opacity=".76" font-family="Arial,sans-serif" font-size="17" letter-spacing="4">${label}</text></svg>`
}
