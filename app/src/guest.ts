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
export async function saveGuestPreview(): Promise<void> {
  if (!token) throw new Error('Guest service unavailable')
  const response = await fetch('/api/saves/square-sketch', { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) throw new Error('Save unavailable')
}
