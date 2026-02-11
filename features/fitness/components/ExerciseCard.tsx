/**
 * features/fitness/components/ExerciseCard.tsx
 *
 * iOS-style card for displaying an exercise in the list.
 * Shows name, muscle group, difficulty badge, and a mini preview.
 *
 * Related:
 * - features/fitness/types/index.ts
 * - features/fitness/components/ExerciseList.tsx
 */

'use client';

import type { Exercise } from '../types';
import { muscleGroupLabels } from '../utils/exerciseData';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
  locale: string;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const difficultyLabels: Record<string, Record<string, string>> = {
  beginner: { en: 'Beginner', nl: 'Beginner' },
  intermediate: { en: 'Intermediate', nl: 'Gevorderd' },
  advanced: { en: 'Advanced', nl: 'Expert' },
};

export function ExerciseCard({ exercise, onSelect, locale }: ExerciseCardProps) {
  const lang = locale === 'nl' ? 'nl' : 'en';
  const name = lang === 'nl' ? exercise.nameNl : exercise.name;
  const desc = lang === 'nl' ? exercise.descriptionNl : exercise.description;
  const muscleLabel = muscleGroupLabels[exercise.muscleGroup]?.[lang] ?? exercise.muscleGroup;
  const diffLabel = difficultyLabels[exercise.difficulty]?.[lang] ?? exercise.difficulty;

  return (
    <button
      onClick={() => onSelect(exercise)}
      className="w-full text-left group"
    >
      <div
        className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200
          bg-white/5 backdrop-blur-md border border-white/10
          hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]
          active:scale-[0.98]"
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center text-2xl border border-white/10">
          {exercise.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base truncate group-hover:text-cyan-300 transition-colors">
            {name}
          </h3>
          <p className="text-white/50 text-sm truncate mt-0.5">
            {desc}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-white/40">
              {muscleLabel}
            </span>
            <span className="text-white/20">·</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[exercise.difficulty]}`}
            >
              {diffLabel}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 text-white/30 group-hover:text-white/60 transition-colors">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M7.5 5L12.5 10L7.5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
