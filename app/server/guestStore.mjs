import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const hash = token => createHash('sha256').update(token).digest('hex')
const REPORT_REASONS = new Set(['harassment', 'spam', 'inappropriate_name', 'other'])
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const REPORT_WINDOW_MS = 60 * 60 * 1000
const REPORT_LIMIT_PER_WINDOW = 5
const DIRECT_MESSAGE_WINDOW_MS = 60 * 1000
const DIRECT_MESSAGE_LIMIT_PER_WINDOW = 20
const DIRECT_MESSAGE_MAX_LENGTH = 500
const PARTY_MESSAGE_WINDOW_MS = 60 * 1000
const PARTY_MESSAGE_LIMIT_PER_WINDOW = 20
const PARTY_MESSAGE_MAX_LENGTH = 280
const PARTY_MAX_MEMBERS = 4
const PARTY_INVITATION_TTL_MS = 10 * 60 * 1000
const PARTY_IDLE_TTL_MS = 30 * 60 * 1000

export function createGuestStore(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true })
  const db = new DatabaseSync(path)
  db.exec(`PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS guests (id TEXT PRIMARY KEY, token_hash TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS saved_items (guest_id TEXT NOT NULL REFERENCES guests(id), item_id TEXT NOT NULL, saved_at TEXT NOT NULL, PRIMARY KEY (guest_id, item_id));
    CREATE TABLE IF NOT EXISTS blocked_guests (
      blocker_guest_id TEXT NOT NULL REFERENCES guests(id),
      blocked_guest_id TEXT NOT NULL REFERENCES guests(id),
      created_at TEXT NOT NULL,
      PRIMARY KEY (blocker_guest_id, blocked_guest_id),
      CHECK (blocker_guest_id <> blocked_guest_id)
    );
    CREATE TABLE IF NOT EXISTS moderation_reports (
      id TEXT PRIMARY KEY,
      reporter_guest_id TEXT NOT NULL REFERENCES guests(id),
      target_guest_id TEXT NOT NULL REFERENCES guests(id),
      reason TEXT NOT NULL,
      details TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status = 'received'),
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS friend_requests (
      id TEXT PRIMARY KEY,
      requester_guest_id TEXT NOT NULL REFERENCES guests(id),
      recipient_guest_id TEXT NOT NULL REFERENCES guests(id),
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled', 'expired', 'blocked')),
      CHECK (requester_guest_id <> recipient_guest_id)
    );
    CREATE UNIQUE INDEX IF NOT EXISTS friend_request_one_pending_pair
      ON friend_requests (requester_guest_id, recipient_guest_id) WHERE status = 'pending';
    CREATE INDEX IF NOT EXISTS friend_request_outgoing_pending
      ON friend_requests (requester_guest_id, status, expires_at);
    CREATE TABLE IF NOT EXISTS friend_edges (
      guest_low_id TEXT NOT NULL REFERENCES guests(id),
      guest_high_id TEXT NOT NULL REFERENCES guests(id),
      created_at TEXT NOT NULL,
      PRIMARY KEY (guest_low_id, guest_high_id),
      CHECK (guest_low_id < guest_high_id)
    );
    CREATE TABLE IF NOT EXISTS guest_message_preferences (
      guest_id TEXT PRIMARY KEY REFERENCES guests(id),
      allow_friend_messages INTEGER NOT NULL CHECK (allow_friend_messages IN (0, 1))
    );
    CREATE TABLE IF NOT EXISTS direct_messages (
      id TEXT PRIMARY KEY,
      sender_guest_id TEXT NOT NULL REFERENCES guests(id),
      recipient_guest_id TEXT NOT NULL REFERENCES guests(id),
      text TEXT NOT NULL CHECK (length(text) BETWEEN 1 AND 500),
      created_at TEXT NOT NULL,
      CHECK (sender_guest_id <> recipient_guest_id)
    );
    CREATE INDEX IF NOT EXISTS direct_messages_pair_order
      ON direct_messages (sender_guest_id, recipient_guest_id, created_at, id);
    CREATE INDEX IF NOT EXISTS direct_messages_sender_recent
      ON direct_messages (sender_guest_id, created_at);
    CREATE TABLE IF NOT EXISTS parties (
      id TEXT PRIMARY KEY,
      leader_guest_id TEXT NOT NULL REFERENCES guests(id),
      created_at TEXT NOT NULL,
      state TEXT NOT NULL CHECK (state IN ('active', 'closed')),
      all_offline_since TEXT
    );
    CREATE TABLE IF NOT EXISTS party_members (
      party_id TEXT NOT NULL REFERENCES parties(id),
      guest_id TEXT NOT NULL REFERENCES guests(id),
      joined_at TEXT NOT NULL,
      left_at TEXT,
      state TEXT NOT NULL CHECK (state IN ('active', 'left')),
      joined_message_seq INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (party_id, guest_id)
    );
    CREATE UNIQUE INDEX IF NOT EXISTS party_one_active_membership
      ON party_members (guest_id) WHERE state = 'active';
    CREATE INDEX IF NOT EXISTS party_members_active
      ON party_members (party_id, state, joined_at);
    CREATE TABLE IF NOT EXISTS party_invitations (
      id TEXT PRIMARY KEY,
      party_id TEXT NOT NULL REFERENCES parties(id),
      sender_guest_id TEXT NOT NULL REFERENCES guests(id),
      recipient_guest_id TEXT NOT NULL REFERENCES guests(id),
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'cancelled', 'blocked')),
      CHECK (sender_guest_id <> recipient_guest_id)
    );
    CREATE UNIQUE INDEX IF NOT EXISTS party_invitation_one_pending_target
      ON party_invitations (party_id, recipient_guest_id) WHERE status = 'pending';
    CREATE INDEX IF NOT EXISTS party_invitation_pending_expiry
      ON party_invitations (recipient_guest_id, status, expires_at);
    CREATE TABLE IF NOT EXISTS party_messages (
      seq INTEGER PRIMARY KEY AUTOINCREMENT,
      id TEXT NOT NULL UNIQUE,
      party_id TEXT NOT NULL REFERENCES parties(id),
      sender_guest_id TEXT NOT NULL REFERENCES guests(id),
      text TEXT NOT NULL CHECK (length(text) BETWEEN 1 AND 280),
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS party_messages_order ON party_messages (party_id, seq);
    CREATE INDEX IF NOT EXISTS party_messages_sender_recent ON party_messages (sender_guest_id, created_at);`)
  const partyMemberColumns = db.prepare('PRAGMA table_info(party_members)').all().map(column => column.name)
  if (!partyMemberColumns.includes('joined_message_seq')) db.exec('ALTER TABLE party_members ADD COLUMN joined_message_seq INTEGER NOT NULL DEFAULT 0')
  const find = db.prepare('SELECT id FROM guests WHERE token_hash = ?')
  const create = db.prepare('INSERT INTO guests (id, token_hash, created_at) VALUES (?, ?, ?)')
  const save = db.prepare('INSERT OR IGNORE INTO saved_items (guest_id, item_id, saved_at) VALUES (?, ?, ?)')
  const list = db.prepare('SELECT item_id FROM saved_items WHERE guest_id = ? ORDER BY saved_at')
  const remove = db.prepare('DELETE FROM saved_items WHERE guest_id = ? AND item_id = ?')
  const hasGuest = db.prepare('SELECT 1 AS found FROM guests WHERE id = ?')
  const listBlocks = db.prepare('SELECT blocked_guest_id FROM blocked_guests WHERE blocker_guest_id = ? ORDER BY created_at, blocked_guest_id')
  const insertBlock = db.prepare('INSERT OR IGNORE INTO blocked_guests (blocker_guest_id, blocked_guest_id, created_at) VALUES (?, ?, ?)')
  const deleteBlock = db.prepare('DELETE FROM blocked_guests WHERE blocker_guest_id = ? AND blocked_guest_id = ?')
  const isBlocked = db.prepare('SELECT 1 AS found FROM blocked_guests WHERE blocker_guest_id = ? AND blocked_guest_id = ?')
  const recentReports = db.prepare('SELECT count(*) AS count FROM moderation_reports WHERE reporter_guest_id = ? AND created_at >= ?')
  const insertReport = db.prepare(`INSERT INTO moderation_reports
    (id, reporter_guest_id, target_guest_id, reason, details, status, created_at)
    VALUES (?, ?, ?, ?, ?, 'received', ?)`)
  const reportById = db.prepare(`SELECT id, reporter_guest_id, target_guest_id, reason, details, status, created_at
    FROM moderation_reports WHERE id = ?`)
  const blockListeners = new Set()
  const friendEventListeners = new Set()
  const expireFriendRequests = db.prepare("UPDATE friend_requests SET status = 'expired' WHERE status = 'pending' AND expires_at <= ?")
  const friendEdgesFor = db.prepare(`SELECT CASE WHEN guest_low_id = ? THEN guest_high_id ELSE guest_low_id END AS guest_id, created_at
    FROM friend_edges WHERE guest_low_id = ? OR guest_high_id = ? ORDER BY created_at, guest_id`)
  const incomingFriendRequests = db.prepare(`SELECT id, requester_guest_id AS guest_id, created_at, expires_at
    FROM friend_requests WHERE recipient_guest_id = ? AND status = 'pending' AND expires_at > ? ORDER BY created_at, id`)
  const outgoingFriendRequests = db.prepare(`SELECT id, recipient_guest_id AS guest_id, created_at, expires_at
    FROM friend_requests WHERE requester_guest_id = ? AND status = 'pending' AND expires_at > ? ORDER BY created_at, id`)
  const existingFriend = db.prepare('SELECT 1 AS found FROM friend_edges WHERE guest_low_id = ? AND guest_high_id = ?')
  const pendingPair = db.prepare("SELECT id, created_at, expires_at FROM friend_requests WHERE requester_guest_id = ? AND recipient_guest_id = ? AND status = 'pending'")
  const reciprocalPending = db.prepare("SELECT id FROM friend_requests WHERE requester_guest_id = ? AND recipient_guest_id = ? AND status = 'pending'")
  const declinedPair = db.prepare("SELECT id FROM friend_requests WHERE requester_guest_id = ? AND recipient_guest_id = ? AND status = 'declined' ORDER BY created_at DESC LIMIT 1")
  const outgoingPendingCount = db.prepare("SELECT count(*) AS count FROM friend_requests WHERE requester_guest_id = ? AND status = 'pending' AND expires_at > ?")
  const insertFriendRequest = db.prepare("INSERT INTO friend_requests (id, requester_guest_id, recipient_guest_id, created_at, expires_at, status) VALUES (?, ?, ?, ?, ?, 'pending')")
  const friendRequestById = db.prepare('SELECT id, requester_guest_id, recipient_guest_id, created_at, expires_at, status FROM friend_requests WHERE id = ?')
  const setFriendRequestStatus = db.prepare('UPDATE friend_requests SET status = ? WHERE id = ?')
  const insertFriendEdge = db.prepare('INSERT OR IGNORE INTO friend_edges (guest_low_id, guest_high_id, created_at) VALUES (?, ?, ?)')
  const removeFriendEdge = db.prepare('DELETE FROM friend_edges WHERE guest_low_id = ? AND guest_high_id = ?')
  const blockPendingRequests = db.prepare("UPDATE friend_requests SET status = 'blocked' WHERE status = 'pending' AND ((requester_guest_id = ? AND recipient_guest_id = ?) OR (requester_guest_id = ? AND recipient_guest_id = ?))")
  const removeFriendRequests = db.prepare('DELETE FROM friend_requests WHERE requester_guest_id = ? AND recipient_guest_id = ?')
  const friendMessagePreference = db.prepare('SELECT allow_friend_messages FROM guest_message_preferences WHERE guest_id = ?')
  const saveFriendMessagePreference = db.prepare(`INSERT INTO guest_message_preferences (guest_id, allow_friend_messages) VALUES (?, ?)
    ON CONFLICT (guest_id) DO UPDATE SET allow_friend_messages = excluded.allow_friend_messages`)
  const activeFriend = db.prepare('SELECT 1 AS found FROM friend_edges WHERE guest_low_id = ? AND guest_high_id = ?')
  const recentDirectMessages = db.prepare('SELECT count(*) AS count FROM direct_messages WHERE sender_guest_id = ? AND created_at >= ?')
  const insertDirectMessage = db.prepare('INSERT INTO direct_messages (id, sender_guest_id, recipient_guest_id, text, created_at) VALUES (?, ?, ?, ?, ?)')
  const conversationMessages = db.prepare(`SELECT id, sender_guest_id, recipient_guest_id, text, created_at
    FROM direct_messages
    WHERE (sender_guest_id = ? AND recipient_guest_id = ?) OR (sender_guest_id = ? AND recipient_guest_id = ?)
    ORDER BY created_at DESC, id DESC LIMIT ?`)
  const messageEventListeners = new Set()
  const partyEventListeners = new Set()
  const partyMessageEventListeners = new Set()
  const partyConnectionCounts = new Map()
  const restartTime = new Date().toISOString()
  db.prepare("UPDATE parties SET all_offline_since = COALESCE(all_offline_since, ?) WHERE state = 'active'").run(restartTime)
  const partyById = db.prepare('SELECT id, leader_guest_id, created_at, state, all_offline_since FROM parties WHERE id = ?')
  const activePartyForMember = db.prepare(`SELECT p.id, p.leader_guest_id, p.created_at, p.state, p.all_offline_since
    FROM party_members m JOIN parties p ON p.id = m.party_id
    WHERE m.guest_id = ? AND m.state = 'active' AND p.state = 'active' LIMIT 1`)
  const activePartyMembership = db.prepare(`SELECT joined_at, joined_message_seq FROM party_members
    WHERE party_id = ? AND guest_id = ? AND state = 'active'`)
  const activePartyMembers = db.prepare(`SELECT guest_id, joined_at FROM party_members
    WHERE party_id = ? AND state = 'active' ORDER BY joined_at, guest_id`)
  const partyIncomingInvitations = db.prepare(`SELECT i.id, i.party_id, i.sender_guest_id, i.created_at, i.expires_at, p.leader_guest_id
    FROM party_invitations i JOIN parties p ON p.id = i.party_id
    WHERE i.recipient_guest_id = ? AND i.status = 'pending' AND i.expires_at > ? AND p.state = 'active'
    ORDER BY i.created_at, i.id`)
  const partyOutgoingInvitations = db.prepare(`SELECT id, recipient_guest_id, created_at, expires_at
    FROM party_invitations WHERE party_id = ? AND status = 'pending' AND expires_at > ? ORDER BY created_at, id`)
  const pendingPartyInvitation = db.prepare("SELECT id, created_at, expires_at FROM party_invitations WHERE party_id = ? AND recipient_guest_id = ? AND status = 'pending'")
  const activePartyInvitationById = db.prepare('SELECT id, party_id, sender_guest_id, recipient_guest_id, created_at, expires_at, status FROM party_invitations WHERE id = ?')
  const updatePartyInvitation = db.prepare('UPDATE party_invitations SET status = ? WHERE id = ?')
  const countPartyCapacity = db.prepare(`SELECT
    (SELECT count(*) FROM party_members WHERE party_id = ? AND state = 'active') +
    (SELECT count(*) FROM party_invitations WHERE party_id = ? AND status = 'pending' AND expires_at > ?) AS count`)
  const activeFriendMembership = db.prepare('SELECT 1 AS found FROM friend_edges WHERE guest_low_id = ? AND guest_high_id = ?')
  const insertParty = db.prepare("INSERT INTO parties (id, leader_guest_id, created_at, state, all_offline_since) VALUES (?, ?, ?, 'active', ?)")
  const insertPartyMember = db.prepare(`INSERT INTO party_members (party_id, guest_id, joined_at, state, joined_message_seq)
    VALUES (?, ?, ?, 'active', COALESCE((SELECT MAX(seq) FROM party_messages WHERE party_id = ?), 0))
    ON CONFLICT (party_id, guest_id) DO UPDATE SET joined_at = excluded.joined_at, state = 'active', left_at = NULL, joined_message_seq = excluded.joined_message_seq`)
  const insertPartyInvitation = db.prepare("INSERT INTO party_invitations (id, party_id, sender_guest_id, recipient_guest_id, created_at, expires_at, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')")
  const setPartyLeader = db.prepare("UPDATE parties SET leader_guest_id = ?, all_offline_since = ? WHERE id = ? AND state = 'active'")
  const leavePartyMember = db.prepare("UPDATE party_members SET state = 'left', left_at = ? WHERE party_id = ? AND guest_id = ? AND state = 'active'")
  const closePartyRow = db.prepare("UPDATE parties SET state = 'closed', all_offline_since = ? WHERE id = ? AND state = 'active'")
  const cancelPartyInvitations = db.prepare("UPDATE party_invitations SET status = 'cancelled' WHERE party_id = ? AND status = 'pending'")
  const blockPartyInvitations = db.prepare("UPDATE party_invitations SET status = 'blocked' WHERE status = 'pending' AND ((sender_guest_id = ? AND recipient_guest_id = ?) OR (sender_guest_id = ? AND recipient_guest_id = ?))")
  const cancelPartyInvitationPair = db.prepare("UPDATE party_invitations SET status = 'cancelled' WHERE status = 'pending' AND ((sender_guest_id = ? AND recipient_guest_id = ?) OR (sender_guest_id = ? AND recipient_guest_id = ?))")
  const expirePartyInvitations = db.prepare("UPDATE party_invitations SET status = 'expired' WHERE status = 'pending' AND expires_at <= ?")
  const friendPairFor = (a, b) => a < b ? [a, b] : [b, a]
  const friendPair = (a, b) => a < b ? [a, b] : [b, a]
  const areBlocked = (a, b) => isBlocked.get(a, b) !== undefined || isBlocked.get(b, a) !== undefined
  const allowFriendMessages = id => friendMessagePreference.get(id)?.allow_friend_messages !== 0
  const directMessageDto = row => ({ id: row.id, senderGuestId: row.sender_guest_id, recipientGuestId: row.recipient_guest_id, text: row.text, sentAt: row.created_at })
  const partyMessageDto = row => ({ id: row.id, senderGuestId: row.sender_guest_id, text: row.text, sentAt: row.created_at })
  const notifyPartyEvent = event => { for (const listener of partyEventListeners) { try { listener(event) } catch { /* notification failures do not undo party state */ } } }
  const notifyPartyMessageEvent = event => { for (const listener of partyMessageEventListeners) { try { listener(event) } catch { /* delivery failures do not undo a stored message */ } } }
  const partyMemberIds = partyId => activePartyMembers.all(partyId).map(row => row.guest_id)
  const updatePartyOfflineState = (partyId, now) => {
    const members = partyMemberIds(partyId)
    const online = members.some(memberId => (partyConnectionCounts.get(memberId) || 0) > 0)
    const timestamp = online ? null : new Date(now).toISOString()
    db.prepare('UPDATE parties SET all_offline_since = ? WHERE id = ? AND state = \'active\'').run(timestamp, partyId)
  }
  const closeParty = (partyId, now, kind = 'closed') => {
    const memberIds = partyMemberIds(partyId)
    const nowIso = new Date(now).toISOString()
    const changed = closePartyRow.run(nowIso, partyId).changes
    if (!changed) return false
    db.prepare("UPDATE party_members SET state = 'left', left_at = ? WHERE party_id = ? AND state = 'active'").run(nowIso, partyId)
    cancelPartyInvitations.run(partyId)
    db.prepare('DELETE FROM party_messages WHERE party_id = ?').run(partyId)
    notifyPartyEvent({ kind, partyId, memberIds, actorId: null })
    return true
  }
  const expireParties = now => {
    const nowIso = new Date(now).toISOString()
    expirePartyInvitations.run(nowIso)
    const cutoff = new Date(now - PARTY_IDLE_TTL_MS).toISOString()
    const idleParties = db.prepare("SELECT id FROM parties WHERE state = 'active' AND all_offline_since IS NOT NULL AND all_offline_since <= ?").all(cutoff)
    for (const party of idleParties) closeParty(party.id, now, 'expired')
  }
  const partySummary = (party, viewerId, now) => {
    const members = activePartyMembers.all(party.id)
      .filter(member => !areBlocked(viewerId, member.guest_id))
      .map(member => ({ guestId: member.guest_id, joinedAt: member.joined_at, leader: member.guest_id === party.leader_guest_id }))
    const invitations = viewerId === party.leader_guest_id
      ? partyOutgoingInvitations.all(party.id, new Date(now).toISOString())
        .filter(invite => !areBlocked(viewerId, invite.recipient_guest_id))
        .map(invite => ({ invitationId: invite.id, guestId: invite.recipient_guest_id, createdAt: invite.created_at, expiresAt: invite.expires_at }))
      : []
    return { partyId: party.id, leaderId: party.leader_guest_id, createdAt: party.created_at, members, invitations }
  }
  const leavePartyInternal = (partyId, guestId, now) => {
    const party = partyById.get(partyId)
    if (!party || party.state !== 'active') return { error: 'party' }
    const members = partyMemberIds(partyId)
    if (!members.includes(guestId)) return { error: 'not_member' }
    const nowIso = new Date(now).toISOString()
    leavePartyMember.run(nowIso, partyId, guestId)
    const remaining = activePartyMembers.all(partyId)
    if (!remaining.length) {
      closePartyRow.run(nowIso, partyId)
      cancelPartyInvitations.run(partyId)
      db.prepare('DELETE FROM party_messages WHERE party_id = ?').run(partyId)
      notifyPartyEvent({ kind: 'closed', partyId, memberIds: members, actorId: guestId })
      return { state: 'closed', newLeaderId: null }
    }
    let newLeaderId = party.leader_guest_id
    if (guestId === party.leader_guest_id) {
      newLeaderId = remaining[0].guest_id
      setPartyLeader.run(newLeaderId, partyConnectionCounts.get(newLeaderId) ? null : nowIso, partyId)
    }
    updatePartyOfflineState(partyId, now)
    notifyPartyEvent({ kind: 'left', partyId, memberIds: members, actorId: guestId, newLeaderId })
    return { state: 'active', newLeaderId }
  }
  const partyState = (guestId, now) => {
    expireParties(now)
    const current = activePartyForMember.get(guestId)
    return {
      party: current ? partySummary(current, guestId, now) : null,
      incoming: partyIncomingInvitations.all(guestId, new Date(now).toISOString())
        .filter(invite => !areBlocked(guestId, invite.sender_guest_id))
        .map(invite => ({ invitationId: invite.id, partyId: invite.party_id, senderId: invite.sender_guest_id, leaderId: invite.leader_guest_id, createdAt: invite.created_at, expiresAt: invite.expires_at })),
    }
  }
  const partyMessages = (viewerId, partyId, now, limit = 100) => {
    expireParties(now)
    const party = partyById.get(partyId)
    if (!party || party.state !== 'active') return { error: 'party' }
    const membership = activePartyMembership.get(partyId, viewerId)
    if (!membership) return { error: 'not_member' }
    const rows = db.prepare(`SELECT id, sender_guest_id, text, created_at FROM party_messages
      WHERE party_id = ? AND seq > ?
        AND NOT EXISTS (SELECT 1 FROM blocked_guests b WHERE
          (b.blocker_guest_id = ? AND b.blocked_guest_id = party_messages.sender_guest_id) OR
          (b.blocker_guest_id = party_messages.sender_guest_id AND b.blocked_guest_id = ?))
      ORDER BY seq DESC LIMIT ?`)
      .all(partyId, membership.joined_message_seq, viewerId, viewerId, Math.max(1, Math.min(100, limit)))
    return { messages: rows.reverse().map(partyMessageDto) }
  }
  const friendState = (id, now) => {
    const nowIso = new Date(now).toISOString()
    expireFriendRequests.run(nowIso)
    return {
      friends: friendEdgesFor.all(id, id, id).map(row => ({ guestId: row.guest_id, createdAt: row.created_at, canMessage: allowFriendMessages(id) && allowFriendMessages(row.guest_id) })),
      incoming: incomingFriendRequests.all(id, nowIso).map(row => ({ requestId: row.id, guestId: row.guest_id, createdAt: row.created_at, expiresAt: row.expires_at })),
      outgoing: outgoingFriendRequests.all(id, nowIso).map(row => ({ requestId: row.id, guestId: row.guest_id, createdAt: row.created_at, expiresAt: row.expires_at })),
      allowFriendMessages: allowFriendMessages(id),
    }
  }
  const notifyFriendEvent = event => { for (const listener of friendEventListeners) { try { listener(event) } catch { /* notification failures do not undo a stored relationship */ } } }
  const notifyMessageEvent = event => { for (const listener of messageEventListeners) { try { listener(event) } catch { /* notification failures do not undo a stored message */ } } }
  return {
    resume(token) { return typeof token === 'string' && /^[a-f0-9]{64}$/.test(token) ? find.get(hash(token))?.id ?? null : null },
    create() { const id = randomUUID(), token = randomBytes(32).toString('hex'); create.run(id, hash(token), new Date().toISOString()); return { id, token } },
    saves(id) { return list.all(id).map(row => row.item_id) },
    save(id, item) {
      if (!CATALOGUE.some(c => c.id === item)) return false
      save.run(id, item, new Date().toISOString())
      return true
    },
    removeSave(id, item) {
      remove.run(id, item)
      return true
    },
    hasGuest(id) { return typeof id === 'string' && hasGuest.get(id) !== undefined },
    blocks(id) { return listBlocks.all(id).map(row => row.blocked_guest_id) },
    block(blockerId, blockedId) {
      if (blockerId === blockedId || !hasGuest.get(blockerId) || !hasGuest.get(blockedId)) return false
      const result = insertBlock.run(blockerId, blockedId, new Date().toISOString())
      if (result.changes) {
        const [low, high] = friendPair(blockerId, blockedId)
        removeFriendEdge.run(low, high)
        blockPendingRequests.run(blockerId, blockedId, blockedId, blockerId)
        blockPartyInvitations.run(blockerId, blockedId, blockedId, blockerId)
        const blockerParty = activePartyForMember.get(blockerId)
        const blockedParty = activePartyForMember.get(blockedId)
        if (blockerParty && blockerParty.id === blockedParty?.id) leavePartyInternal(blockerParty.id, blockedId, Date.now())
        for (const listener of blockListeners) { try { listener({ blockerId, blockedId }) } catch { /* safety state remains stored */ } }
        notifyFriendEvent({ kind: 'blocked', actorId: blockerId, targetId: blockedId })
      }
      return true
    },
    onBlock(listener) { blockListeners.add(listener); return () => blockListeners.delete(listener) },
    onFriendEvent(listener) { friendEventListeners.add(listener); return () => friendEventListeners.delete(listener) },
    onMessageEvent(listener) { messageEventListeners.add(listener); return () => messageEventListeners.delete(listener) },
    onPartyEvent(listener) { partyEventListeners.add(listener); return () => partyEventListeners.delete(listener) },
    onPartyMessageEvent(listener) { partyMessageEventListeners.add(listener); return () => partyMessageEventListeners.delete(listener) },
    partySessionConnected(guestId, now = Date.now()) {
      // A reconnect past the idle deadline must not clear the evidence used to expire the party.
      expireParties(now)
      partyConnectionCounts.set(guestId, (partyConnectionCounts.get(guestId) || 0) + 1)
      const party = activePartyForMember.get(guestId)
      if (party) db.prepare("UPDATE parties SET all_offline_since = NULL WHERE id = ? AND state = 'active'").run(party.id)
    },
    partySessionDisconnected(guestId, now = Date.now()) {
      const count = partyConnectionCounts.get(guestId) || 0
      if (count <= 1) partyConnectionCounts.delete(guestId)
      else partyConnectionCounts.set(guestId, count - 1)
      const party = activePartyForMember.get(guestId)
      if (party) updatePartyOfflineState(party.id, now)
    },
    partyState(guestId, now = Date.now()) { return partyState(guestId, now) },
    partyMessages(guestId, partyId, now = Date.now(), limit = 100) { return partyMessages(guestId, partyId, now, limit) },
    sendPartyMessage(partyId, senderId, text, now = Date.now()) {
      expireParties(now)
      const party = partyById.get(partyId)
      if (!party || party.state !== 'active') return { error: 'party' }
      const memberIds = partyMemberIds(partyId)
      if (!memberIds.includes(senderId)) return { error: 'not_member' }
      if (memberIds.some(memberId => memberId !== senderId && areBlocked(senderId, memberId))) return { error: 'blocked' }
      if (typeof text !== 'string' || !text.trim() || text.trim().length > PARTY_MESSAGE_MAX_LENGTH) return { error: 'invalid' }
      const createdAt = new Date(now).toISOString()
      const cutoff = new Date(now - PARTY_MESSAGE_WINDOW_MS).toISOString()
      const recentCount = db.prepare('SELECT count(*) AS count FROM party_messages WHERE sender_guest_id = ? AND created_at >= ?').get(senderId, cutoff).count
      if (recentCount >= PARTY_MESSAGE_LIMIT_PER_WINDOW) return { error: 'rate_limited' }
      const row = { id: randomUUID(), sender_guest_id: senderId, text: text.trim(), created_at: createdAt }
      db.prepare('INSERT INTO party_messages (id, party_id, sender_guest_id, text, created_at) VALUES (?, ?, ?, ?, ?)')
        .run(row.id, partyId, senderId, row.text, createdAt)
      const message = partyMessageDto(row)
      notifyPartyMessageEvent({ partyId, memberIds, message })
      return { status: 'sent', message }
    },
    createParty(leaderId, now = Date.now()) {
      expireParties(now)
      if (!hasGuest.get(leaderId)) return { error: 'guest' }
      if (activePartyForMember.get(leaderId)) return { error: 'already_in_party' }
      const partyId = randomUUID()
      const nowIso = new Date(now).toISOString()
      insertParty.run(partyId, leaderId, nowIso, partyConnectionCounts.get(leaderId) ? null : nowIso)
      insertPartyMember.run(partyId, leaderId, nowIso, partyId)
      notifyPartyEvent({ kind: 'created', partyId, actorId: leaderId, memberIds: [leaderId] })
      return { partyId, status: 'active', leaderId }
    },
    inviteToParty(partyId, senderId, recipientId, now = Date.now()) {
      expireParties(now)
      if (!hasGuest.get(recipientId)) return { error: 'target' }
      const party = partyById.get(partyId)
      if (!party || party.state !== 'active') return { error: 'party' }
      if (party.leader_guest_id !== senderId) return { error: 'not_leader' }
      const members = partyMemberIds(partyId)
      if (!members.includes(senderId)) return { error: 'not_member' }
      if (members.includes(recipientId)) return { error: 'already_member' }
      if (this.isBlockedBetween(senderId, recipientId) || members.some(memberId => this.isBlockedBetween(memberId, recipientId))) return { error: 'blocked' }
      const [low, high] = friendPairFor(senderId, recipientId)
      if (!activeFriendMembership.get(low, high)) return { error: 'not_friends' }
      if (activePartyForMember.get(recipientId)) return { error: 'already_in_party' }
      const nowIso = new Date(now).toISOString()
      const existing = pendingPartyInvitation.get(partyId, recipientId)
      if (existing) return { invitationId: existing.id, status: 'pending', createdAt: existing.created_at, expiresAt: existing.expires_at, duplicate: true }
      if (countPartyCapacity.get(partyId, partyId, nowIso).count >= PARTY_MAX_MEMBERS) return { error: 'full' }
      const invitationId = randomUUID()
      const expiresAt = new Date(now + PARTY_INVITATION_TTL_MS).toISOString()
      insertPartyInvitation.run(invitationId, partyId, senderId, recipientId, nowIso, expiresAt)
      const memberIds = [...members, recipientId]
      notifyPartyEvent({ kind: 'invited', partyId, invitationId, actorId: senderId, targetId: recipientId, memberIds })
      return { invitationId, status: 'pending', createdAt: nowIso, expiresAt, duplicate: false }
    },
    acceptPartyInvitation(invitationId, recipientId, now = Date.now()) {
      expireParties(now)
      let invitation = activePartyInvitationById.get(invitationId)
      if (!invitation) return { error: 'not_found' }
      if (invitation.recipient_guest_id !== recipientId) return { error: 'not_recipient' }
      if (invitation.status === 'accepted') {
        const existingParty = activePartyForMember.get(recipientId)
        if (existingParty?.id === invitation.party_id) return { status: 'accepted', partyId: invitation.party_id, duplicate: true }
      }
      if (invitation.status === 'expired') return { error: 'expired' }
      if (invitation.status !== 'pending') return { error: invitation.status === 'blocked' ? 'blocked' : 'invalid_state' }
      const party = partyById.get(invitation.party_id)
      if (!party || party.state !== 'active') return { error: 'party' }
      if (new Date(invitation.expires_at).getTime() <= now) {
        updatePartyInvitation.run('expired', invitationId)
        return { error: 'expired' }
      }
      if (activePartyForMember.get(recipientId)) return { error: 'already_in_party' }
      const members = partyMemberIds(invitation.party_id)
      if (members.some(memberId => this.isBlockedBetween(memberId, recipientId))) {
        updatePartyInvitation.run('blocked', invitationId)
        return { error: 'blocked' }
      }
      const [low, high] = friendPairFor(invitation.sender_guest_id, recipientId)
      if (!activeFriendMembership.get(low, high)) return { error: 'not_friends' }
      if (members.length >= PARTY_MAX_MEMBERS) return { error: 'full' }
      const nowIso = new Date(now).toISOString()
      insertPartyMember.run(invitation.party_id, recipientId, nowIso, invitation.party_id)
      updatePartyInvitation.run('accepted', invitationId)
      db.prepare("UPDATE parties SET all_offline_since = NULL WHERE id = ? AND state = 'active'").run(invitation.party_id)
      const memberIds = [...members, recipientId]
      notifyPartyEvent({ kind: 'joined', partyId: invitation.party_id, invitationId, actorId: recipientId, targetId: invitation.sender_guest_id, memberIds })
      return { status: 'accepted', partyId: invitation.party_id, duplicate: false }
    },
    declinePartyInvitation(invitationId, recipientId, now = Date.now()) {
      expireParties(now)
      const invitation = activePartyInvitationById.get(invitationId)
      if (!invitation) return { error: 'not_found' }
      if (invitation.recipient_guest_id !== recipientId) return { error: 'not_recipient' }
      if (invitation.status === 'expired') return { error: 'expired' }
      if (invitation.status === 'declined') return { status: 'declined', duplicate: true }
      if (invitation.status !== 'pending') return { error: invitation.status === 'blocked' ? 'blocked' : 'invalid_state' }
      updatePartyInvitation.run('declined', invitationId)
      const members = partyMemberIds(invitation.party_id)
      notifyPartyEvent({ kind: 'declined', partyId: invitation.party_id, invitationId, actorId: recipientId, targetId: invitation.sender_guest_id, memberIds: [...members, recipientId] })
      return { status: 'declined', duplicate: false }
    },
    leaveParty(partyId, guestId, now = Date.now()) {
      expireParties(now)
      return leavePartyInternal(partyId, guestId, now)
    },
    unblock(blockerId, blockedId) {
      deleteBlock.run(blockerId, blockedId)
      return true
    },
    isBlocked(blockerId, blockedId) {
      return typeof blockerId === 'string' && typeof blockedId === 'string' && isBlocked.get(blockerId, blockedId) !== undefined
    },
    isBlockedBetween(a, b) { return this.isBlocked(a, b) || this.isBlocked(b, a) },
    friendState(id, now = Date.now()) { return friendState(id, now) },
    friendMessagePreference(id) { return { allowFriendMessages: allowFriendMessages(id) } },
    setFriendMessagePreference(id, enabled) {
      if (typeof enabled !== 'boolean') return { error: 'invalid' }
      if (!hasGuest.get(id)) return { error: 'guest' }
      const previous = allowFriendMessages(id)
      saveFriendMessagePreference.run(id, enabled ? 1 : 0)
      if (previous !== enabled) {
        for (const friend of friendEdgesFor.all(id, id, id)) notifyFriendEvent({ kind: 'message-preference', actorId: id, targetId: friend.guest_id })
      }
      return { allowFriendMessages: enabled }
    },
    sendDirectMessage(senderId, recipientId, text, now = Date.now()) {
      if (senderId === recipientId) return { error: 'self' }
      if (!hasGuest.get(recipientId)) return { error: 'target' }
      if (this.isBlockedBetween(senderId, recipientId)) return { error: 'blocked' }
      const [low, high] = friendPair(senderId, recipientId)
      if (!activeFriend.get(low, high)) return { error: 'not_friends' }
      if (!allowFriendMessages(senderId) || !allowFriendMessages(recipientId)) return { error: 'messages_disabled' }
      if (typeof text !== 'string' || !text.trim() || text.trim().length > DIRECT_MESSAGE_MAX_LENGTH) return { error: 'invalid' }
      const createdAt = new Date(now).toISOString()
      const cutoff = new Date(now - DIRECT_MESSAGE_WINDOW_MS).toISOString()
      if (recentDirectMessages.get(senderId, cutoff).count >= DIRECT_MESSAGE_LIMIT_PER_WINDOW) return { error: 'rate_limited' }
      const row = { id: randomUUID(), sender_guest_id: senderId, recipient_guest_id: recipientId, text: text.trim(), created_at: createdAt }
      insertDirectMessage.run(row.id, row.sender_guest_id, row.recipient_guest_id, row.text, row.created_at)
      const message = directMessageDto(row)
      notifyMessageEvent({ senderId, recipientId, messageId: message.id })
      return { status: 'sent', message }
    },
    directMessages(viewerId, otherGuestId, limit = 100) {
      if (viewerId === otherGuestId) return { error: 'self' }
      if (!hasGuest.get(otherGuestId)) return { error: 'target' }
      if (this.isBlockedBetween(viewerId, otherGuestId)) return { error: 'blocked' }
      const [low, high] = friendPair(viewerId, otherGuestId)
      if (!activeFriend.get(low, high)) return { error: 'not_friends' }
      return { messages: conversationMessages.all(viewerId, otherGuestId, otherGuestId, viewerId, Math.max(1, Math.min(100, limit))).reverse().map(directMessageDto) }
    },
    requestFriend(requesterId, recipientId, now = Date.now()) {
      if (requesterId === recipientId) return { error: 'self' }
      if (!hasGuest.get(requesterId) || !hasGuest.get(recipientId)) return { error: 'target' }
      if (this.isBlockedBetween(requesterId, recipientId)) return { error: 'blocked' }
      const [low, high] = friendPair(requesterId, recipientId)
      if (existingFriend.get(low, high)) return { error: 'already_friends' }
      const createdAt = new Date(now).toISOString()
      expireFriendRequests.run(createdAt)
      const existing = pendingPair.get(requesterId, recipientId)
      if (existing) return { requestId: existing.id, status: 'pending', createdAt: existing.created_at, expiresAt: existing.expires_at, duplicate: true }
      if (reciprocalPending.get(recipientId, requesterId)) return { error: 'incoming_pending' }
      if (declinedPair.get(requesterId, recipientId)) return { error: 'declined' }
      if (outgoingPendingCount.get(requesterId, createdAt).count >= 20) return { error: 'limit' }
      const requestId = randomUUID()
      const expiresAt = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString()
      insertFriendRequest.run(requestId, requesterId, recipientId, createdAt, expiresAt)
      notifyFriendEvent({ kind: 'request', actorId: requesterId, targetId: recipientId, requestId })
      return { requestId, status: 'pending', createdAt, expiresAt, duplicate: false }
    },
    acceptFriendRequest(requestId, recipientId, now = Date.now()) {
      let request = friendRequestById.get(requestId)
      if (!request) return { error: 'not_found' }
      if (request.recipient_guest_id !== recipientId) return { error: 'not_recipient' }
      const nowIso = new Date(now).toISOString()
      expireFriendRequests.run(nowIso)
      request = friendRequestById.get(requestId)
      if (request.status === 'accepted') return { status: 'accepted', guestId: request.requester_guest_id, duplicate: true }
      if (request.status === 'expired') return { error: 'expired' }
      if (request.status !== 'pending') return { error: request.status === 'blocked' ? 'blocked' : 'invalid_state' }
      if (this.isBlockedBetween(request.requester_guest_id, request.recipient_guest_id)) {
        setFriendRequestStatus.run('blocked', requestId)
        return { error: 'blocked' }
      }
      const [low, high] = friendPair(request.requester_guest_id, request.recipient_guest_id)
      insertFriendEdge.run(low, high, nowIso)
      setFriendRequestStatus.run('accepted', requestId)
      notifyFriendEvent({ kind: 'accepted', actorId: recipientId, targetId: request.requester_guest_id, requestId })
      return { status: 'accepted', guestId: request.requester_guest_id, duplicate: false }
    },
    declineFriendRequest(requestId, recipientId, now = Date.now()) {
      let request = friendRequestById.get(requestId)
      if (!request) return { error: 'not_found' }
      if (request.recipient_guest_id !== recipientId) return { error: 'not_recipient' }
      const nowIso = new Date(now).toISOString()
      expireFriendRequests.run(nowIso)
      request = friendRequestById.get(requestId)
      if (request.status === 'declined') return { status: 'declined', guestId: request.requester_guest_id, duplicate: true }
      if (request.status === 'expired') return { error: 'expired' }
      if (request.status !== 'pending') return { error: request.status === 'blocked' ? 'blocked' : 'invalid_state' }
      if (this.isBlockedBetween(request.requester_guest_id, request.recipient_guest_id)) {
        setFriendRequestStatus.run('blocked', requestId)
        return { error: 'blocked' }
      }
      setFriendRequestStatus.run('declined', requestId)
      notifyFriendEvent({ kind: 'declined', actorId: recipientId, targetId: request.requester_guest_id, requestId })
      return { status: 'declined', guestId: request.requester_guest_id, duplicate: false }
    },
    cancelFriendRequest(requestId, requesterId) {
      const request = friendRequestById.get(requestId)
      if (!request) return { error: 'not_found' }
      if (request.requester_guest_id !== requesterId) return { error: 'not_requester' }
      if (request.status === 'cancelled') return { status: 'cancelled', guestId: request.recipient_guest_id, duplicate: true }
      if (request.status !== 'pending') return { error: request.status === 'expired' ? 'expired' : 'invalid_state' }
      setFriendRequestStatus.run('cancelled', requestId)
      notifyFriendEvent({ kind: 'cancelled', actorId: requesterId, targetId: request.recipient_guest_id, requestId })
      return { status: 'cancelled', guestId: request.recipient_guest_id, duplicate: false }
    },
    unfriend(guestId, otherGuestId) {
      if (!hasGuest.get(otherGuestId)) return { error: 'target' }
      const [low, high] = friendPair(guestId, otherGuestId)
      const result = removeFriendEdge.run(low, high)
      if (!result.changes) return { error: 'not_friends' }
      removeFriendRequests.run(guestId, otherGuestId)
      removeFriendRequests.run(otherGuestId, guestId)
      const pendingPartyInvites = db.prepare("SELECT id, party_id, sender_guest_id, recipient_guest_id FROM party_invitations WHERE status = 'pending' AND ((sender_guest_id = ? AND recipient_guest_id = ?) OR (sender_guest_id = ? AND recipient_guest_id = ?))").all(guestId, otherGuestId, otherGuestId, guestId)
      cancelPartyInvitationPair.run(guestId, otherGuestId, otherGuestId, guestId)
      for (const invite of pendingPartyInvites) notifyPartyEvent({ kind: 'invitation-cancelled', partyId: invite.party_id, invitationId: invite.id, actorId: guestId, targetId: otherGuestId, memberIds: [...new Set([...partyMemberIds(invite.party_id), invite.sender_guest_id, invite.recipient_guest_id])] })
      notifyFriendEvent({ kind: 'unfriended', actorId: guestId, targetId: otherGuestId })
      return { status: 'unfriended' }
    },
    submitReport(reporterId, input) {
      if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'invalid' }
      const { targetGuestId, reason, details = '' } = input
      if (!UUID.test(targetGuestId || '') || !REPORT_REASONS.has(reason) || typeof details !== 'string' || details.length > 240) return { error: 'invalid' }
      if (targetGuestId === reporterId) return { error: 'self' }
      if (!hasGuest.get(targetGuestId)) return { error: 'target' }
      const cutoff = new Date(Date.now() - REPORT_WINDOW_MS).toISOString()
      if (recentReports.get(reporterId, cutoff).count >= REPORT_LIMIT_PER_WINDOW) return { error: 'rate_limited' }
      const id = randomUUID()
      const createdAt = new Date().toISOString()
      insertReport.run(id, reporterId, targetGuestId, reason, details.trim(), createdAt)
      return { id, status: 'received', createdAt }
    },
    getReport(id) {
      const row = reportById.get(id)
      return row ? {
        id: row.id,
        reporterId: row.reporter_guest_id,
        targetGuestId: row.target_guest_id,
        reason: row.reason,
        details: row.details,
        status: row.status,
        createdAt: row.created_at,
      } : null
    },
    close() { db.close() },
  }
}

const CATALOGUE = [
  { id: 'square-sketch', title: 'Square Sketch', artist: 'THE SCENE Originals', genre: 'Afrobeats / Demo', duration: 30, released: true },
  { id: 'lagos-golden-hour', title: 'Golden Hour Jam', artist: 'Victoria Island Collective', genre: 'Afro-fusion', duration: 30, released: true },
]

export function guestApi(store) {
  return async (req, res, next) => {
    let pathname
    try { pathname = new URL(req.url || '/', 'http://localhost').pathname } catch { res.statusCode = 400; return res.end() }
    if (pathname === '/api/catalogue' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      return res.end(JSON.stringify({ tracks: CATALOGUE }))
    }
    if (!['/api/guest', '/api/saves', '/api/reports', '/api/blocks', '/api/friends', '/api/friend-requests', '/api/messages', '/api/parties', '/api/party-invitations'].some(route => pathname === route || pathname.startsWith(`${route}/`))) return next()
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    const reply = (status, body) => { res.statusCode = status; res.end(JSON.stringify(body)) }
    const token = req.headers.authorization?.match(/^Bearer ([a-f0-9]{64})$/)?.[1]
    if (pathname === '/api/guest' && req.method === 'POST') {
      const id = token && store.resume(token)
      if (id) return reply(200, { id, token, saves: store.saves(id) })
      return reply(201, { ...store.create(), saves: [] })
    }
    const id = token && store.resume(token)
    if (!id) return reply(401, { error: 'Guest session required' })
    if (pathname === '/api/saves' && req.method === 'GET') return reply(200, { saves: store.saves(id) })
    const saveMatch = pathname.match(/^\/api\/saves\/([a-z0-9-]+)$/)
    if (saveMatch && req.method === 'PUT') {
      const trackId = saveMatch[1]
      const ok = store.save(id, trackId)
      if (!ok) return reply(404, { error: 'Track not found in catalogue' })
      return reply(200, { saves: store.saves(id) })
    }
    if (saveMatch && req.method === 'DELETE') {
      const trackId = saveMatch[1]
      store.removeSave(id, trackId)
      return reply(200, { saves: store.saves(id) })
    }

    if (pathname === '/api/blocks' && req.method === 'GET') return reply(200, { blockedIds: store.blocks(id) })
    if (pathname === '/api/blocks' && req.method === 'PUT') {
      const parsed = await readJsonBody(req)
      if (parsed.error) return reply(parsed.error === 'too_large' ? 413 : 400, { error: 'Invalid block request' })
      const targetId = parsed.value?.targetGuestId
      if (!UUID.test(targetId || '') || targetId === id) return reply(400, { error: 'Invalid block target' })
      if (!store.hasGuest(targetId)) return reply(404, { error: 'Guest not found' })
      store.block(id, targetId)
      return reply(200, { blockedIds: store.blocks(id) })
    }
    const unblockMatch = pathname.match(/^\/api\/blocks\/([0-9a-f-]{36})$/i)
    if (unblockMatch && req.method === 'DELETE') {
      store.unblock(id, unblockMatch[1])
      return reply(200, { blockedIds: store.blocks(id) })
    }

    if (pathname === '/api/friends' && req.method === 'GET') return reply(200, store.friendState(id))
    if (pathname === '/api/friends' && req.method === 'POST') return reply(405, { error: 'Use a friend request' })
    const unfriendMatch = pathname.match(/^\/api\/friends\/([0-9a-f-]{36})$/i)
    if (unfriendMatch && req.method === 'DELETE') {
      const result = store.unfriend(id, unfriendMatch[1])
      if (result.error === 'target') return reply(404, { error: 'Guest not found' })
      if (result.error) return reply(404, { error: 'Friend not found' })
      return reply(200, result)
    }

    if (pathname === '/api/friend-requests' && req.method === 'POST') {
      const parsed = await readJsonBody(req)
      if (parsed.error) return reply(parsed.error === 'too_large' ? 413 : 400, { error: 'Invalid friend request' })
      const targetId = parsed.value?.targetGuestId
      if (!UUID.test(targetId || '') || targetId === id) return reply(400, { error: 'Invalid friend request target' })
      const result = store.requestFriend(id, targetId)
      if (result.error === 'target') return reply(404, { error: 'Guest not found' })
      if (result.error === 'blocked') return reply(403, { error: 'Friend request unavailable' })
      if (result.error === 'limit') return reply(429, { error: 'Pending request limit reached' })
      if (result.error === 'self') return reply(400, { error: 'Invalid friend request target' })
      if (result.error) return reply(409, { error: result.error })
      return reply(result.duplicate ? 200 : 201, result)
    }
    const friendRequestAction = pathname.match(/^\/api\/friend-requests\/([0-9a-f-]{36})\/(accept|decline)$/i)
    if (friendRequestAction && req.method === 'POST') {
      const result = friendRequestAction[2].toLowerCase() === 'accept'
        ? store.acceptFriendRequest(friendRequestAction[1], id)
        : store.declineFriendRequest(friendRequestAction[1], id)
      if (result.error === 'not_found') return reply(404, { error: 'Friend request not found' })
      if (result.error === 'not_recipient' || result.error === 'blocked') return reply(403, { error: 'Friend request unavailable' })
      if (result.error === 'expired') return reply(410, { error: 'Friend request expired' })
      if (result.error) return reply(409, { error: 'Friend request is no longer pending' })
      return reply(200, result)
    }
    const cancelFriendRequest = pathname.match(/^\/api\/friend-requests\/([0-9a-f-]{36})$/i)
    if (cancelFriendRequest && req.method === 'DELETE') {
      const result = store.cancelFriendRequest(cancelFriendRequest[1], id)
      if (result.error === 'not_found') return reply(404, { error: 'Friend request not found' })
      if (result.error === 'not_requester') return reply(403, { error: 'Friend request unavailable' })
      if (result.error === 'expired') return reply(410, { error: 'Friend request expired' })
      if (result.error) return reply(409, { error: 'Friend request is no longer pending' })
      return reply(200, result)
    }

    if (pathname === '/api/messages/preferences' && req.method === 'GET') return reply(200, store.friendMessagePreference(id))
    if (pathname === '/api/messages/preferences' && req.method === 'PUT') {
      const parsed = await readJsonBody(req)
      if (parsed.error || typeof parsed.value?.allowFriendMessages !== 'boolean') return reply(parsed.error === 'too_large' ? 413 : 400, { error: 'Invalid message preference' })
      return reply(200, store.setFriendMessagePreference(id, parsed.value.allowFriendMessages))
    }
    if (pathname === '/api/messages' && req.method === 'POST') {
      const parsed = await readJsonBody(req)
      if (parsed.error) return reply(parsed.error === 'too_large' ? 413 : 400, { error: 'Invalid message' })
      const { recipientGuestId, text } = parsed.value || {}
      if (!UUID.test(recipientGuestId || '') || typeof text !== 'string') return reply(400, { error: 'Invalid message' })
      const result = store.sendDirectMessage(id, recipientGuestId, text)
      if (result.error === 'target') return reply(404, { error: 'Friend not found' })
      if (result.error === 'rate_limited') return reply(429, { error: 'Message rate limit reached' })
      if (result.error === 'invalid' || result.error === 'self') return reply(400, { error: 'Invalid message' })
      if (result.error) return reply(403, { error: 'Direct message unavailable' })
      return reply(201, { message: result.message })
    }
    const conversationMatch = pathname.match(/^\/api\/messages\/([0-9a-f-]{36})$/i)
    if (conversationMatch && req.method === 'GET') {
      const result = store.directMessages(id, conversationMatch[1])
      if (result.error === 'target') return reply(404, { error: 'Friend not found' })
      if (result.error) return reply(403, { error: 'Conversation unavailable' })
      return reply(200, result)
    }

    if (pathname === '/api/parties/me' && req.method === 'GET') return reply(200, store.partyState(id))
    const partyMessagesPath = pathname.match(/^\/api\/parties\/([0-9a-f-]{36})\/messages$/i)
    if (partyMessagesPath && req.method === 'GET') {
      const result = store.partyMessages(id, partyMessagesPath[1])
      if (result.error === 'party') return reply(404, { error: 'Party chat is no longer available' })
      if (result.error) return reply(403, { error: 'Party chat is only for current members' })
      return reply(200, result)
    }
    if (partyMessagesPath && req.method === 'POST') {
      const parsed = await readJsonBody(req)
      if (parsed.error) return reply(parsed.error === 'too_large' ? 413 : 400, { error: 'Invalid party message' })
      const result = store.sendPartyMessage(partyMessagesPath[1], id, parsed.value?.text)
      if (result.error === 'party') return reply(404, { error: 'Party chat is no longer available' })
      if (result.error === 'not_member' || result.error === 'blocked') return reply(403, { error: 'Party chat is only for current members' })
      if (result.error === 'rate_limited') return reply(429, { error: 'Please slow down before sending another party message' })
      if (result.error) return reply(400, { error: 'Message must be 1 to 280 characters' })
      return reply(201, { message: result.message })
    }
    if (pathname === '/api/parties' && req.method === 'POST') {
      const result = store.createParty(id)
      if (result.error === 'already_in_party') return reply(409, { error: 'Already in a party' })
      if (result.error) return reply(404, { error: 'Guest not found' })
      return reply(201, result)
    }
    const partyInvitationPath = pathname.match(/^\/api\/parties\/([0-9a-f-]{36})\/invitations$/i)
    if (partyInvitationPath && req.method === 'POST') {
      const parsed = await readJsonBody(req)
      if (parsed.error) return reply(parsed.error === 'too_large' ? 413 : 400, { error: 'Invalid party invitation' })
      const targetId = parsed.value?.targetGuestId
      if (!UUID.test(targetId || '') || targetId === id) return reply(400, { error: 'Invalid party invitation target' })
      const result = store.inviteToParty(partyInvitationPath[1], id, targetId)
      if (result.error === 'target' || result.error === 'party') return reply(404, { error: 'Party or friend not found' })
      if (result.error === 'blocked') return reply(403, { error: 'Party invitation unavailable' })
      if (result.error === 'not_leader' || result.error === 'not_member') return reply(403, { error: 'Only the party leader can invite friends' })
      if (result.error === 'not_friends') return reply(403, { error: 'Only an unblocked friend can be invited' })
      if (result.error === 'already_in_party') return reply(409, { error: 'Friend is already in a party' })
      if (result.error === 'full' || result.error === 'already_member') return reply(409, { error: 'Party is full or friend is already a member' })
      return reply(result.duplicate ? 200 : 201, { ...result, expiresInSeconds: Math.max(0, Math.ceil((new Date(result.expiresAt).getTime() - Date.now()) / 1000)) })
    }
    const partyInviteAction = pathname.match(/^\/api\/party-invitations\/([0-9a-f-]{36})\/(accept|decline)$/i)
    if (partyInviteAction && req.method === 'POST') {
      const result = partyInviteAction[2].toLowerCase() === 'accept'
        ? store.acceptPartyInvitation(partyInviteAction[1], id)
        : store.declinePartyInvitation(partyInviteAction[1], id)
      if (result.error === 'not_found' || result.error === 'party') return reply(404, { error: 'Party invitation is no longer available' })
      if (result.error === 'not_recipient' || result.error === 'blocked') return reply(403, { error: 'Party invitation unavailable' })
      if (result.error === 'expired') return reply(410, { error: 'Party invitation expired' })
      if (result.error === 'full') return reply(409, { error: 'Party is full' })
      if (result.error === 'already_in_party') return reply(409, { error: 'Leave your current party before joining another' })
      if (result.error === 'not_friends') return reply(409, { error: 'Friendship changed; this invitation is no longer available' })
      if (result.error) return reply(409, { error: 'Party invitation is no longer pending' })
      return reply(200, result)
    }
    const leavePartyPath = pathname.match(/^\/api\/parties\/([0-9a-f-]{36})\/leave$/i)
    if (leavePartyPath && req.method === 'POST') {
      const result = store.leaveParty(leavePartyPath[1], id)
      if (result.error === 'party') return reply(404, { error: 'Party not found' })
      if (result.error) return reply(403, { error: 'You are not in this party' })
      return reply(200, result)
    }

    if (pathname === '/api/reports' && req.method === 'POST') {
      const parsed = await readJsonBody(req)
      if (parsed.error) return reply(parsed.error === 'too_large' ? 413 : 400, { error: 'Invalid report' })
      const report = store.submitReport(id, parsed.value)
      if (report.error === 'rate_limited') return reply(429, { error: 'Report limit reached' })
      if (report.error === 'target') return reply(404, { error: 'Guest not found' })
      if (report.error) return reply(400, { error: 'Invalid report' })
      return reply(201, report)
    }
    return reply(404, { error: 'Unknown route' })
  }
}

async function readJsonBody(req, maxBytes = 4096) {
  if (!req.headers['content-type']?.toLowerCase().includes('application/json')) return { error: 'invalid' }
  const chunks = []
  let length = 0
  for await (const chunk of req) {
    length += chunk.length
    if (length > maxBytes) return { error: 'too_large' }
    chunks.push(chunk)
  }
  try { return { value: JSON.parse(Buffer.concat(chunks).toString('utf8')) } } catch { return { error: 'invalid' } }
}
