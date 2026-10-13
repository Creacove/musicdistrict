export type FrameSummary = { medianMs: number; p95Ms: number; fps: number }

export function summarizeFrames(samples: readonly number[]): FrameSummary | null {
  if (!samples.length) return null
  const sorted = [...samples].sort((a, b) => a - b)
  const medianMs = sorted[Math.floor((sorted.length - 1) * .5)]
  const p95Ms = sorted[Math.floor((sorted.length - 1) * .95)]
  return { medianMs, p95Ms, fps: Math.round(1000 / medianMs) }
}

export function reportedTransferBytes(): number {
  const entries = performance.getEntriesByType('navigation').concat(performance.getEntriesByType('resource'))
  return entries.reduce((total, entry) => total + ((entry as PerformanceResourceTiming).transferSize || 0), 0)
}
