/**
 * features/pulse/components/SourceBadge.tsx
 *
 * Visual badge indicating content source.
 * Distinct colors for each platform (HN, PH, Dev.to, IH).
 *
 * Related:
 * - features/pulse/components/PulseItem.tsx
 */

import type { PulseSource } from '../types'

const SOURCE_CONFIG: Record<PulseSource, { label: string; className: string }> = {
  hn: {
    label: 'HN',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  },
  ph: {
    label: 'PH',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  devto: {
    label: 'DEV',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  ih: {
    label: 'IH',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  twitter: {
    label: 'X',
    className: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  },
  manual: {
    label: 'VCS',
    className: 'bg-primary/10 text-primary',
  },
}

interface SourceBadgeProps {
  source: PulseSource
}

export function SourceBadge({ source }: SourceBadgeProps) {
  const config = SOURCE_CONFIG[source] || SOURCE_CONFIG.manual

  return (
    <span
      className={`inline-flex items-center justify-center w-10 h-6 rounded text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  )
}
