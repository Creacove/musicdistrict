export type CatalogueTrack = { id: string; title: string; artist: string; genre: string; duration: number; released: boolean }
type Guest = { id: string; token: string; saves: string[] }
let token = ''

export async function openGuest(): Promise<Guest> {
  try { token = localStorage.getItem('scene-guest-token') || '' } catch { /* private storage can be unavailable */ }
  const response = await fetch('/api/guest', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {} })
  if (!response.ok) throw new Error('Guest service unavailable')
  const guest = await response.json() as Guest
  token = guest.token
  try { localStorage.setItem('scene-guest-token', token) } catch { /* session still works until reload */ }
  return guest
}

export async function fetchCatalogue(): Promise<CatalogueTrack[]> {
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
  if (!token) throw new Error('Guest service unavailable')
  const response = await fetch(`/api/saves/${trackId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) throw new Error('Save unavailable')
}

export async function removeGuestSave(trackId: string): Promise<void> {
  if (!token) throw new Error('Guest service unavailable')
  const response = await fetch(`/api/saves/${trackId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) throw new Error('Remove save unavailable')
}
