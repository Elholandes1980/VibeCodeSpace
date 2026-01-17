/**
 * features/pulse/components/PulseList.tsx
 *
 * List of pulse items in feed style.
 * Maps PulseItem components for each item.
 *
 * Related:
 * - features/pulse/PulseFeed.tsx
 * - features/pulse/components/PulseItem.tsx
 */

import { PulseItem } from './PulseItem'
import type { PulseItem as PulseItemType, PulseDictionary, Locale } from '../types'

interface PulseListProps {
  items: PulseItemType[]
  dictionary: PulseDictionary
  locale: Locale
}

export function PulseList({ items, dictionary }: PulseListProps) {
  return (
    <div className="divide-y-0">
      {items.map((item) => (
        <PulseItem key={item.id} item={item} dictionary={dictionary} />
      ))}
    </div>
  )
}
