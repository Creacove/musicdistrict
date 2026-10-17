export type CatalogueTrack = { id: string; title: string; artist: string; genre: string; duration: number; released: boolean }
export type GuestPlaylist = { id: string; name: string; visibility: 'private'; position: number; createdAt: string; updatedAt: string; tracks: CatalogueTrack[] }
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
export type GuestPartyTravelVote = { guestId: string; decision: 'approve' | 'decline' | null }
export type GuestPartyTravelAssignment = { proposalId: string; destinationId: string; location: string; spaceId: string | null; instanceId: string | null; groupSize: number; arrivedMembers: number; remainingMembers: number; reservedSlots: number; expiresAt: string; error: string | null }
export type GuestPartyTravelProposal = {
  proposalId: string
  destinationId: string
  proposerId: string
  createdAt: string
  expiresAt: string
  status: 'pending' | 'approved'
  votes: GuestPartyTravelVote[]
}
export type GuestParty = {
  partyId: string
  leaderId: string
  createdAt: string
  members: { guestId: string; joinedAt: string; leader: boolean }[]
  invitations: { invitationId: string; guestId: string; createdAt: string; expiresAt: string }[]
  travelProposal: GuestPartyTravelProposal | null
  travelAssignment: GuestPartyTravelAssignment | null
}
export type GuestPartyState = {
  party: GuestParty | null
  incoming: { invitationId: string; partyId: string; senderId: string; leaderId: string; createdAt: string; expiresAt: string }[]
}
export type GuestEventDraft = { venueId: 'palm-room'; title: string; format: 'OPEN_MIC' | 'LISTENING_SESSION'; start: string; status: 'DRAFT'; updatedAt: string }
export type GuestEventPerformer = { invitationId: string; guestId: string; status: 'invited' | 'accepted' | 'declined'; createdAt: string; respondedAt: string | null }
export type GuestEventInvitation = { invitationId: string; organiserGuestId: string; title: string; format: 'OPEN_MIC' | 'LISTENING_SESSION'; start: string; status: 'invited' | 'accepted' | 'declined'; createdAt: string; respondedAt: string | null }
export type GuestEventPlanning = { draft: GuestEventDraft | null; performers: GuestEventPerformer[]; invitations: GuestEventInvitation[] }
let token = ''
const SOLO_PREVIEW = import.meta.env?.VITE_SCENE_DEMO_MODE === 'true'
const PREVIEW_CATALOGUE: CatalogueTrack[] = [
  { id: 'square-sketch', title: 'Square Sketch', artist: 'THE SCENE Originals', genre: 'Afrobeats / Demo', duration: 30, released: true },
  { id: 'lagos-golden-hour', title: 'Golden Hour Jam', artist: 'Victoria Island Collective', genre: 'Afro-fusion', duration: 30, released: true },
]
const LOCAL_PLAYLIST_KEY = 'scene-private-playlists'
const PLAYLIST_NAME_LIMIT = 40
const PLAYLIST_LIMIT = 20
const PLAYLIST_TRACK_LIMIT = 100

function localPlaylists(): GuestPlaylist[] {
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_PLAYLIST_KEY) || '[]')
    if (!Array.isArray(saved)) return []
    return saved.filter(item => item && typeof item.id === 'string' && typeof item.name === 'string').slice(0, PLAYLIST_LIMIT).map((item, position) => ({
      id: item.id,
      name: item.name.trim().slice(0, PLAYLIST_NAME_LIMIT) || 'My playlist',
      visibility: 'private',
      position,
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date().toISOString(),
      tracks: (Array.isArray(item.tracks) ? item.tracks : []).slice(0, PLAYLIST_TRACK_LIMIT).map((track: CatalogueTrack) => PREVIEW_CATALOGUE.find(available => available.id === track?.id && available.released)).filter((track: CatalogueTrack | undefined): track is CatalogueTrack => !!track),
    }))
  } catch { return [] }
}

function saveLocalPlaylists(playlists: GuestPlaylist[]) {
  try { localStorage.setItem(LOCAL_PLAYLIST_KEY, JSON.stringify(playlists)) } catch { throw new Error('Could not save this private collection on the device') }
}

function requirePlaylistName(value: string) {
  const name = value.trim()
  if (!name || name.length > PLAYLIST_NAME_LIMIT) throw new Error('Playlist name must contain 1–40 characters')
  return name
}

function reorderIds<T extends { id: string }>(items: T[], ids: string[]): T[] {
  if (!Array.isArray(ids) || ids.length !== items.length || new Set(ids).size !== items.length || items.some(item => !ids.includes(item.id))) throw new Error('Order must include every item once')
  return ids.map(id => items.find(item => item.id === id)!)
}

async function playlistRequest(path: string, init: RequestInit = {}): Promise<any> {
  const response = await guestRequest(path, init)
  const data = await response.json().catch(() => ({})) as { error?: string }
  if (!response.ok) throw new Error(data.error || 'Playlist action unavailable')
  return data
}

export async function fetchGuestPlaylists(): Promise<GuestPlaylist[]> {
  if (SOLO_PREVIEW) return localPlaylists()
  const data = await playlistRequest('/api/playlists') as { playlists: GuestPlaylist[] }
  return data.playlists || []
}

export async function createGuestPlaylist(value: string): Promise<GuestPlaylist[]> {
  const name = requirePlaylistName(value)
  if (SOLO_PREVIEW) {
    const playlists = localPlaylists()
    if (playlists.length >= PLAYLIST_LIMIT) throw new Error('You can create up to 20 playlists')
    const now = new Date().toISOString()
    playlists.push({ id: crypto.randomUUID(), name, visibility: 'private', position: playlists.length, createdAt: now, updatedAt: now, tracks: [] })
    saveLocalPlaylists(playlists)
    return playlists
  }
  await playlistRequest('/api/playlists', { method: 'POST', body: JSON.stringify({ name }) })
  return fetchGuestPlaylists()
}

export async function renameGuestPlaylist(id: string, value: string): Promise<GuestPlaylist[]> {
  const name = requirePlaylistName(value)
  if (SOLO_PREVIEW) {
    const playlists = localPlaylists()
    const playlist = playlists.find(item => item.id === id)
    if (!playlist) throw new Error('Playlist not found')
    playlist.name = name; playlist.updatedAt = new Date().toISOString(); saveLocalPlaylists(playlists)
    return playlists
  }
  await playlistRequest(`/api/playlists/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ name }) })
  return fetchGuestPlaylists()
}

export async function deleteGuestPlaylist(id: string): Promise<GuestPlaylist[]> {
  if (SOLO_PREVIEW) {
    const playlists = localPlaylists().filter(item => item.id !== id)
    saveLocalPlaylists(playlists)
    return playlists
  }
  await playlistRequest(`/api/playlists/${encodeURIComponent(id)}`, { method: 'DELETE' })
  return fetchGuestPlaylists()
}

export async function reorderGuestPlaylists(ids: string[]): Promise<GuestPlaylist[]> {
  if (SOLO_PREVIEW) {
    const playlists = reorderIds(localPlaylists(), ids).map((item, position) => ({ ...item, position }))
    saveLocalPlaylists(playlists)
    return playlists
  }
  await playlistRequest('/api/playlists/order', { method: 'PUT', body: JSON.stringify({ playlistIds: ids }) })
  return fetchGuestPlaylists()
}

export async function addGuestPlaylistTrack(id: string, trackId: string): Promise<GuestPlaylist[]> {
  if (SOLO_PREVIEW) {
    const playlists = localPlaylists()
    const playlist = playlists.find(item => item.id === id)
    const track = PREVIEW_CATALOGUE.find(item => item.id === trackId && item.released)
    if (!playlist) throw new Error('Playlist not found')
    if (!track) throw new Error('Released song not found')
    if (!playlist.tracks.some(item => item.id === trackId)) {
      if (playlist.tracks.length >= PLAYLIST_TRACK_LIMIT) throw new Error('Playlist is full')
      playlist.tracks.push(track)
      playlist.updatedAt = new Date().toISOString()
    }
    saveLocalPlaylists(playlists)
    return playlists
  }
  await playlistRequest(`/api/playlists/${encodeURIComponent(id)}/tracks`, { method: 'POST', body: JSON.stringify({ trackId }) })
  return fetchGuestPlaylists()
}

export async function removeGuestPlaylistTrack(id: string, trackId: string): Promise<GuestPlaylist[]> {
  if (SOLO_PREVIEW) {
    const playlists = localPlaylists()
    const playlist = playlists.find(item => item.id === id)
    if (!playlist) throw new Error('Playlist not found')
    playlist.tracks = playlist.tracks.filter(item => item.id !== trackId)
    playlist.updatedAt = new Date().toISOString()
    saveLocalPlaylists(playlists)
    return playlists
  }
  await playlistRequest(`/api/playlists/${encodeURIComponent(id)}/tracks/${encodeURIComponent(trackId)}`, { method: 'DELETE' })
  return fetchGuestPlaylists()
}

export async function reorderGuestPlaylistTracks(id: string, trackIds: string[]): Promise<GuestPlaylist[]> {
  if (SOLO_PREVIEW) {
    const playlists = localPlaylists()
    const playlist = playlists.find(item => item.id === id)
    if (!playlist) throw new Error('Playlist not found')
    playlist.tracks = reorderIds(playlist.tracks, trackIds)
    playlist.updatedAt = new Date().toISOString()
    saveLocalPlaylists(playlists)
    return playlists
  }
  await playlistRequest(`/api/playlists/${encodeURIComponent(id)}/tracks/order`, { method: 'PUT', body: JSON.stringify({ trackIds }) })
  return fetchGuestPlaylists()
}

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

export async function fetchGuestEventDraft(): Promise<GuestEventDraft | null> {
  const response = await guestRequest('/api/event-draft')
  if (!response.ok) throw new Error('Show draft unavailable')
  const data = await response.json() as { draft: GuestEventDraft | null }
  return data.draft
}

export async function fetchGuestEventPlanning(): Promise<GuestEventPlanning> {
  const response = await guestRequest('/api/event-planning')
  if (!response.ok) throw new Error('Show plans unavailable')
  const data = await response.json() as { planning: GuestEventPlanning }
  return data.planning
}

export async function inviteGuestEventPerformer(targetGuestId: string): Promise<GuestEventPerformer> {
  const response = await guestRequest('/api/event-draft/invitations', { method: 'POST', body: JSON.stringify({ targetGuestId }) })
  if (!response.ok) {
    const data = await response.json().catch(() => ({})) as { error?: string }
    const messages: Record<string, string> = { draft: 'Save your show plan before inviting a performer.', target: 'That player is no longer available.', offline: 'That guest has left Palm Room.', blocked: 'This guest is unavailable.', already_invited: 'This player already has an invitation.', full: 'This draft has reached its five invited performer limit.' }
    throw new Error(messages[data.error || ''] || 'Could not invite this performer')
  }
  return (await response.json() as { invitation: GuestEventPerformer }).invitation
}

export async function respondGuestEventInvitation(invitationId: string, decision: 'accept' | 'decline'): Promise<void> {
  const response = await guestRequest(`/api/event-draft/invitations/${encodeURIComponent(invitationId)}/response`, { method: 'POST', body: JSON.stringify({ decision }) })
  if (!response.ok) throw new Error('This performer invitation is no longer available')
}

export async function saveGuestEventDraft(draft: Pick<GuestEventDraft, 'title' | 'format' | 'start'>): Promise<GuestEventDraft> {
  const response = await guestRequest('/api/event-draft', { method: 'PUT', body: JSON.stringify(draft) })
  if (!response.ok) throw new Error('Could not sync show draft')
  const data = await response.json() as { draft: GuestEventDraft }
  return data.draft
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

export async function proposeGuestPartyTravel(partyId: string, destinationId: string): Promise<GuestPartyTravelProposal> {
  const response = await guestRequest(`/api/parties/${encodeURIComponent(partyId)}/travel-proposals`, {
    method: 'POST', body: JSON.stringify({ destinationId }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({})) as { error?: string }
    throw new Error(data.error || 'Could not propose this route')
  }
  const data = await response.json() as { travelProposal: GuestPartyTravelProposal }
  return data.travelProposal
}

export async function voteGuestPartyTravel(partyId: string, proposalId: string, decision: 'approve' | 'decline'): Promise<'pending' | 'approved' | 'declined'> {
  const response = await guestRequest(`/api/parties/${encodeURIComponent(partyId)}/travel-proposals/${encodeURIComponent(proposalId)}/votes`, {
    method: 'POST', body: JSON.stringify({ decision }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({})) as { error?: string }
    throw new Error(data.error || 'Could not record your travel decision')
  }
  const data = await response.json() as { status: 'pending' | 'approved' | 'declined' }
  return data.status
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
