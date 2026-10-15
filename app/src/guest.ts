export type CatalogueTrack = { id: string; title: string; artist: string; genre: string; duration: number; released: boolean }
type Guest = { id: string; token: string; saves: string[] }
export type GuestReportReason = 'harassment' | 'spam' | 'inappropriate_name' | 'other'
export type GuestReportReceipt = { id: string; status: 'received'; createdAt: string }
export type GuestFriendState = {
  friends: { guestId: string; createdAt: string; canMessage: boolean }[]
  incoming: { requestId: string; guestId: string; createdAt: string; expiresAt: string }[]
  outgoing: { requestId: string; guestId: string; createdAt: string; expiresAt: string }[]
  allowFriendMessages: boolean
}
export type FriendRequestReceipt = { requestId: string; status: 'pending'; expiresAt: string; duplicate: boolean }
export type GuestDirectMessage = { id: string; senderGuestId: string; recipientGuestId: string; text: string; sentAt: string }
export type GuestPartyMessage = { id: string; senderGuestId: string; text: string; sentAt: string }
export type GuestParty = {
  partyId: string
  leaderId: string
  createdAt: string
  members: { guestId: string; joinedAt: string; leader: boolean }[]
  invitations: { invitationId: string; guestId: string; createdAt: string; expiresAt: string }[]
}
export type GuestPartyState = {
  party: GuestParty | null
  incoming: { invitationId: string; partyId: string; senderId: string; leaderId: string; createdAt: string; expiresAt: string }[]
}
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

export async function fetchGuestFriends(): Promise<GuestFriendState> {
  if (SOLO_PREVIEW) return { friends: [], incoming: [], outgoing: [], allowFriendMessages: true }
  const response = await guestRequest('/api/friends')
  if (!response.ok) throw new Error('Friend list unavailable')
  return response.json() as Promise<GuestFriendState>
}

export async function requestGuestFriend(targetGuestId: string): Promise<FriendRequestReceipt> {
  const response = await guestRequest('/api/friend-requests', { method: 'POST', body: JSON.stringify({ targetGuestId }) })
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { error?: string }
    const messages: Record<string, string> = {
      limit: 'You already have 20 pending friend requests.',
      declined: 'This player has already declined that request.',
      incoming_pending: 'This player has a request waiting for you.',
      already_friends: 'You are already friends.',
    }
    throw new Error(messages[body.error || ''] || 'Could not send friend request')
  }
  return response.json() as Promise<FriendRequestReceipt>
}

async function updateFriendRequest(requestId: string, action: 'accept' | 'decline'): Promise<void> {
  const response = await guestRequest(`/api/friend-requests/${encodeURIComponent(requestId)}/${action}`, { method: 'POST' })
  if (!response.ok) throw new Error(action === 'accept' ? 'Could not accept this friend request' : 'Could not decline this friend request')
}

export async function acceptGuestFriendRequest(requestId: string): Promise<void> { return updateFriendRequest(requestId, 'accept') }
export async function declineGuestFriendRequest(requestId: string): Promise<void> { return updateFriendRequest(requestId, 'decline') }

export async function cancelGuestFriendRequest(requestId: string): Promise<void> {
  const response = await guestRequest(`/api/friend-requests/${encodeURIComponent(requestId)}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Could not cancel this friend request')
}

export async function unfriendGuest(targetGuestId: string): Promise<void> {
  const response = await guestRequest(`/api/friends/${encodeURIComponent(targetGuestId)}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Could not remove this friendship')
}

export async function fetchGuestMessages(otherGuestId: string): Promise<GuestDirectMessage[]> {
  const response = await guestRequest(`/api/messages/${encodeURIComponent(otherGuestId)}`)
  if (!response.ok) throw new Error('This conversation is unavailable')
  const data = await response.json() as { messages?: GuestDirectMessage[] }
  return Array.isArray(data.messages) ? data.messages : []
}

export async function sendGuestMessage(recipientGuestId: string, text: string): Promise<GuestDirectMessage> {
  const response = await guestRequest('/api/messages', { method: 'POST', body: JSON.stringify({ recipientGuestId, text }) })
  if (!response.ok) {
    if (response.status === 429) throw new Error('Please wait a moment before sending another message')
    if (response.status === 403) throw new Error('Messages are unavailable because of a friendship, block, or privacy setting')
    throw new Error('Could not send this message')
  }
  const data = await response.json() as { message: GuestDirectMessage }
  return data.message
}

export async function setGuestMessagePreference(allowFriendMessages: boolean): Promise<void> {
  const response = await guestRequest('/api/messages/preferences', { method: 'PUT', body: JSON.stringify({ allowFriendMessages }) })
  if (!response.ok) throw new Error('Could not update your message privacy setting')
}

export async function fetchGuestParty(): Promise<GuestPartyState> {
  if (SOLO_PREVIEW) return { party: null, incoming: [] }
  const response = await guestRequest('/api/parties/me')
  if (!response.ok) throw new Error('Party state unavailable')
  return response.json() as Promise<GuestPartyState>
}

export async function fetchGuestPartyMessages(partyId: string): Promise<GuestPartyMessage[]> {
  const response = await guestRequest(`/api/parties/${encodeURIComponent(partyId)}/messages`)
  if (!response.ok) throw new Error('Party chat is only available to current members')
  const data = await response.json() as { messages?: GuestPartyMessage[] }
  return Array.isArray(data.messages) ? data.messages : []
}

export async function sendGuestPartyMessage(partyId: string, text: string): Promise<GuestPartyMessage> {
  const response = await guestRequest(`/api/parties/${encodeURIComponent(partyId)}/messages`, { method: 'POST', body: JSON.stringify({ text }) })
  if (!response.ok) {
    if (response.status === 429) throw new Error('Please wait a moment before sending another message')
    if (response.status === 403) throw new Error('Party chat is only available to current members')
    if (response.status === 400) throw new Error('Keep party messages between 1 and 280 characters')
    throw new Error('Could not send this party message')
  }
  const data = await response.json() as { message: GuestPartyMessage }
  return data.message
}

export async function createGuestParty(): Promise<{ partyId: string }> {
  const response = await guestRequest('/api/parties', { method: 'POST' })
  if (!response.ok) throw new Error(response.status === 409 ? 'You are already in a party' : 'Could not start a party')
  return response.json() as Promise<{ partyId: string }>
}

export async function inviteGuestToParty(partyId: string, targetGuestId: string): Promise<void> {
  const response = await guestRequest(`/api/parties/${encodeURIComponent(partyId)}/invitations`, { method: 'POST', body: JSON.stringify({ targetGuestId }) })
  if (!response.ok) {
    if (response.status === 403) throw new Error('Only the leader can invite unblocked friends')
    if (response.status === 409) throw new Error('Party is full or this friend is already in a party')
    throw new Error('Could not invite this friend')
  }
}

export async function acceptGuestPartyInvitation(invitationId: string): Promise<void> {
  const response = await guestRequest(`/api/party-invitations/${encodeURIComponent(invitationId)}/accept`, { method: 'POST' })
  if (!response.ok) {
    if (response.status === 410) throw new Error('This party invitation expired')
    if (response.status === 409) throw new Error('Party is full or you are already in another party')
    throw new Error('Could not join this party')
  }
}

export async function declineGuestPartyInvitation(invitationId: string): Promise<void> {
  const response = await guestRequest(`/api/party-invitations/${encodeURIComponent(invitationId)}/decline`, { method: 'POST' })
  if (!response.ok) throw new Error('Could not decline this party invitation')
}

export async function leaveGuestParty(partyId: string): Promise<{ newLeaderId: string | null }> {
  const response = await guestRequest(`/api/parties/${encodeURIComponent(partyId)}/leave`, { method: 'POST' })
  if (!response.ok) throw new Error('Could not leave this party')
  return response.json() as Promise<{ newLeaderId: string | null }>
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
