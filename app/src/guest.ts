export type CatalogueTrack = { id: string; title: string; artist: string; genre: string; duration: number; released: boolean }
type Guest = { id: string; token: string; saves: string[] }
export type GuestReportReason = 'harassment' | 'spam' | 'inappropriate_name' | 'other'
export type GuestReportReceipt = { id: string; status: 'received'; createdAt: string }
let token = ''
const SOLO_PREVIEW = import.meta.env?.VITE_SCENE_DEMO_MODE === 'true'
const PREVIEW_CATALOGUE: CatalogueTrack[] = [
  { id: 'square-sketch', title: 'Square Sketch', artist: 'THE SCENE Originals', genre: 'Afrobeats / Demo', duration: 30, released: true },
  { id: 'lagos-golden-hour', title: 'Golden Hour Jam', artist: 'Victoria Island Collective', genre: 'Afro-fusion', duration: 30, released: true },
]

function localSaves() {
  try {
    const saved = JSON.parse(localStorage.getItem('scene-saved-tracks') || '[]')
    const legacy = localStorage.getItem('scene-saved-square-sketch') === '1' ? ['square-sketch'] : []
    return [...new Set([...(Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : []), ...legacy])]
  } catch {
    return []
  }
}

export async function openGuest(): Promise<Guest> {
  if (SOLO_PREVIEW) {
    token = 'local-device-preview'
    return { id: 'local-device', token, saves: localSaves() }
  }
  try { token = localStorage.getItem('scene-guest-token') || '' } catch { /* private storage can be unavailable */ }
  const response = await fetch('/api/guest', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {} })
  if (!response.ok) throw new Error('Guest service unavailable')
  const guest = await response.json() as Guest
  token = guest.token
  try { localStorage.setItem('scene-guest-token', token) } catch { /* session still works until reload */ }
  return guest
}

export async function fetchCatalogue(): Promise<CatalogueTrack[]> {
  if (SOLO_PREVIEW) return [...PREVIEW_CATALOGUE]
  try {
    const res = await fetch('/api/catalogue')
    if (!res.ok) return []
    const data = await res.json() as { tracks: CatalogueTrack[] }
    return data.tracks || []
  } catch {
    return []
  }
}

export async function saveGuestPreview(trackId = 'square-sketch'): Promise<void> {
  if (SOLO_PREVIEW) return
  if (!token) throw new Error('Guest service unavailable')
  const response = await fetch(`/api/saves/${trackId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) throw new Error('Save unavailable')
}

export async function removeGuestSave(trackId: string): Promise<void> {
  if (SOLO_PREVIEW) return
  if (!token) throw new Error('Guest service unavailable')
  const response = await fetch(`/api/saves/${trackId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) throw new Error('Remove save unavailable')
}

async function guestRequest(path: string, init: RequestInit = {}): Promise<Response> {
  if (SOLO_PREVIEW || !token) throw new Error('Social safety service unavailable in solo preview')
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)
  if (init.body) headers.set('Content-Type', 'application/json')
  return fetch(path, { ...init, headers })
}

export async function fetchGuestBlocks(): Promise<string[]> {
  if (SOLO_PREVIEW) return []
  const response = await guestRequest('/api/blocks')
  if (!response.ok) throw new Error('Blocked sessions unavailable')
  const data = await response.json() as { blockedIds?: unknown }
  return Array.isArray(data.blockedIds) ? data.blockedIds.filter((id): id is string => typeof id === 'string') : []
}

export async function blockGuest(targetGuestId: string): Promise<void> {
  const response = await guestRequest('/api/blocks', { method: 'PUT', body: JSON.stringify({ targetGuestId }) })
  if (!response.ok) throw new Error('Could not block this session')
}

export async function unblockGuest(targetGuestId: string): Promise<void> {
  const response = await guestRequest(`/api/blocks/${encodeURIComponent(targetGuestId)}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Could not unblock this session')
}

export async function submitGuestReport(input: { targetGuestId: string; reason: GuestReportReason; details: string }): Promise<GuestReportReceipt> {
  const response = await guestRequest('/api/reports', { method: 'POST', body: JSON.stringify(input) })
  if (!response.ok) throw new Error(response.status === 429 ? 'Report limit reached for this hour' : 'Could not send this report')
  return response.json() as Promise<GuestReportReceipt>
}
