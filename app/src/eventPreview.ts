export type RehearsalMetrics = {
  liveSessions: string
  ticketsSold: 'Not a ticketed event'
  checkedInHumans: 'Not recorded'
}

/** A rehearsal preview has live presence, but no event sales or attendance ledger. */
export function rehearsalMetrics(connected: boolean, sessions: number): RehearsalMetrics {
  const count = Math.max(0, Math.floor(Number.isFinite(sessions) ? sessions : 0))
  return {
    liveSessions: connected ? `${count} other connected session${count === 1 ? '' : 's'}` : 'Live status unavailable',
    ticketsSold: 'Not a ticketed event',
    checkedInHumans: 'Not recorded',
  }
}
