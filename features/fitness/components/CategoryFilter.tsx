/**
 * features/fitness/components/CategoryFilter.tsx
 *
 * iOS-style horizontal scrolling filter chips for exercise categories.
 * Allows filtering by muscle group or exercise category.
 *
 * Related:
 * - features/fitness/utils/exerciseData.ts
 * - features/fitness/components/FitnessApp.tsx
 */

'use client';

interface FilterOption {
  id: string;
  label: string;
  icon: string;
}

interface CategoryFilterProps {
  options: FilterOption[];
  selected: string;
  onSelect: (id: string) => void;
}

export function CategoryFilter({ options, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
      {options.map((option) => {
        const isActive = selected === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
              ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-transparent shadow-lg shadow-purple-500/25'
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white/80'
              }`}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
