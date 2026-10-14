import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const hash = token => createHash('sha256').update(token).digest('hex')
const REPORT_REASONS = new Set(['harassment', 'spam', 'inappropriate_name', 'other'])
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const REPORT_WINDOW_MS = 60 * 60 * 1000
const REPORT_LIMIT_PER_WINDOW = 5

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
    );`)
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
  const friendPair = (a, b) => a < b ? [a, b] : [b, a]
  const friendState = (id, now) => {
    const nowIso = new Date(now).toISOString()
    expireFriendRequests.run(nowIso)
    return {
      friends: friendEdgesFor.all(id, id, id).map(row => ({ guestId: row.guest_id, createdAt: row.created_at })),
      incoming: incomingFriendRequests.all(id, nowIso).map(row => ({ requestId: row.id, guestId: row.guest_id, createdAt: row.created_at, expiresAt: row.expires_at })),
      outgoing: outgoingFriendRequests.all(id, nowIso).map(row => ({ requestId: row.id, guestId: row.guest_id, createdAt: row.created_at, expiresAt: row.expires_at })),
    }
  }
  const notifyFriendEvent = event => { for (const listener of friendEventListeners) { try { listener(event) } catch { /* notification failures do not undo a stored relationship */ } } }
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
        for (const listener of blockListeners) { try { listener({ blockerId, blockedId }) } catch { /* safety state remains stored */ } }
        notifyFriendEvent({ kind: 'blocked', actorId: blockerId, targetId: blockedId })
      }
      return true
    },
    onBlock(listener) { blockListeners.add(listener); return () => blockListeners.delete(listener) },
    onFriendEvent(listener) { friendEventListeners.add(listener); return () => friendEventListeners.delete(listener) },
    unblock(blockerId, blockedId) {
      deleteBlock.run(blockerId, blockedId)
      return true
    },
    isBlocked(blockerId, blockedId) {
      return typeof blockerId === 'string' && typeof blockedId === 'string' && isBlocked.get(blockerId, blockedId) !== undefined
    },
    isBlockedBetween(a, b) { return this.isBlocked(a, b) || this.isBlocked(b, a) },
    friendState(id, now = Date.now()) { return friendState(id, now) },
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
    if (!['/api/guest', '/api/saves', '/api/reports', '/api/blocks', '/api/friends', '/api/friend-requests'].some(route => pathname === route || pathname.startsWith(`${route}/`))) return next()
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
