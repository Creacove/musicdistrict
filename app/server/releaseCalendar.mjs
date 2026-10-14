const TIMEZONE = 'Africa/Lagos'
const WEEKDAY_INDEX = new Map(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => [day, index]))

const formatLocalParts = new Intl.DateTimeFormat('en-US', {
  timeZone: TIMEZONE,
  weekday: 'short',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function partsFor(date) {
  return Object.fromEntries(formatLocalParts.formatToParts(date).map(part => [part.type, part.value]))
}

function localDateTimeToUtc(year, month, day, hour, minute) {
  // Resolve the Lagos wall time through Intl rather than assuming the host timezone.
  const targetWallTime = Date.UTC(year, month - 1, day, hour, minute)
  let instant = targetWallTime
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const local = partsFor(new Date(instant))
    const representedWallTime = Date.UTC(
      Number(local.year), Number(local.month) - 1, Number(local.day), Number(local.hour), Number(local.minute),
    )
    const correction = targetWallTime - representedWallTime
    instant += correction
    if (correction === 0) break
  }
  return new Date(instant)
}

export function getReleaseWindow(now = new Date()) {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new TypeError('A valid date is required')

  const local = partsFor(now)
  const weekday = WEEKDAY_INDEX.get(local.weekday)
  const day = Number(local.day)
  const hour = Number(local.hour)
  if (weekday === undefined || !Number.isInteger(day) || !Number.isInteger(hour)) throw new RangeError('Could not read Lagos server time')

  // Submissions before Wednesday 18:00 WAT remain eligible for that Friday.
  // Once the deadline passes, this preview points at the following Friday.
  const deadlineStillOpen = weekday < 3 || (weekday === 3 && hour < 18)
  const daysUntilFriday = deadlineStillOpen ? 5 - weekday : 12 - weekday
  const friday = new Date(Date.UTC(Number(local.year), Number(local.month) - 1, day + daysUntilFriday))
  const year = friday.getUTCFullYear()
  const month = friday.getUTCMonth() + 1
  const fridayDay = friday.getUTCDate()
  const submissionDeadline = localDateTimeToUtc(year, month, fridayDay - 2, 18, 0)
  const moderationCheckpoint = localDateTimeToUtc(year, month, fridayDay - 1, 18, 0)
  const premiereAt = localDateTimeToUtc(year, month, fridayDay, 19, 0)

  return {
    serverTime: now.toISOString(),
    timezone: TIMEZONE,
    nextEligibleFriday: premiereAt.toISOString(),
    submissionDeadline: submissionDeadline.toISOString(),
    moderationCheckpoint: moderationCheckpoint.toISOString(),
    premiereAt: premiereAt.toISOString(),
  }
}

export function releaseWindowApi(req, res, next) {
  let pathname
  try { pathname = new URL(req.url || '/', 'http://localhost').pathname } catch {
    res.statusCode = 400
    return res.end()
  }
  if (pathname !== '/api/release-window') return next()
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Vary', 'Accept')
  if (req.method === 'HEAD') { res.statusCode = 200; return res.end() }
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, HEAD')
    res.statusCode = 405
    return res.end(JSON.stringify({ error: 'Method not allowed' }))
  }
  try {
    res.statusCode = 200
    return res.end(JSON.stringify(getReleaseWindow(new Date())))
  } catch {
    res.statusCode = 503
    return res.end(JSON.stringify({ error: 'Release calendar unavailable' }))
  }
}
