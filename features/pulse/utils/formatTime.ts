/**
 * features/pulse/utils/formatTime.ts
 *
 * Utility for formatting relative time (time ago).
 * Used in pulse items to show when content was published.
 *
 * Related:
 * - features/pulse/components/PulseItem.tsx
 */

interface TimeAgoDictionary {
  now: string
  minutes: string
  hours: string
  days: string
}

/**
 * Format a date as relative time (e.g., "5m geleden", "2u geleden").
 */
export function formatTimeAgo(dateString: string, dict: TimeAgoDictionary): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  const minutes = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (minutes < 1) {
    return dict.now
  }

  if (minutes < 60) {
    return dict.minutes.replace('{n}', String(minutes))
  }

  if (hours < 24) {
    return dict.hours.replace('{n}', String(hours))
  }

  return dict.days.replace('{n}', String(days))
}
