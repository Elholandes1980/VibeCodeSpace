/**
 * features/fitness/components/FitnessApp.tsx
 *
 * Main fitness app component with iOS-style navigation.
 * Orchestrates category filtering, exercise list, and exercise detail views.
 *
 * Related:
 * - features/fitness/components/CategoryFilter.tsx
 * - features/fitness/components/ExerciseCard.tsx
 * - features/fitness/components/ExerciseDetail.tsx
 */

'use client';

import { useState, useMemo } from 'react';

import { CategoryFilter } from './CategoryFilter';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseDetail } from './ExerciseDetail';
import { exercises, muscleGroupLabels, categoryLabels } from '../utils/exerciseData';

import type { Exercise } from '../types';

interface FitnessAppProps {
  locale: string;
}

type FilterType = 'muscle' | 'category';

export function FitnessApp({ locale }: FitnessAppProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('muscle');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const isNl = locale === 'nl';

  const muscleOptions = useMemo(
    () => [
      { id: 'all', label: isNl ? 'Alles' : 'All', icon: '🔥' },
      ...Object.entries(muscleGroupLabels).map(([id, label]) => ({
        id,
        label: isNl ? label.nl : label.en,
        icon: label.icon,
      })),
    ],
    [isNl],
  );

  const categoryOptions = useMemo(
    () => [
      { id: 'all', label: isNl ? 'Alles' : 'All', icon: '🔥' },
      ...Object.entries(categoryLabels).map(([id, label]) => ({
        id,
        label: isNl ? label.nl : label.en,
        icon: label.icon,
      })),
    ],
    [isNl],
  );

  const filteredExercises = useMemo(() => {
    if (selectedFilter === 'all') return exercises;
    if (filterType === 'muscle') {
      return exercises.filter((e) => e.muscleGroup === selectedFilter);
    }
    return exercises.filter((e) => e.category === selectedFilter);
  }, [selectedFilter, filterType]);

  if (selectedExercise) {
    return (
      <div className="h-full">
        <ExerciseDetail
          exercise={selectedExercise}
          onBack={() => setSelectedExercise(null)}
          locale={locale}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* iOS-style Header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
              {isNl ? 'Jouw Training' : 'Your Workout'}
            </p>
            <h1 className="text-white font-bold text-2xl mt-0.5">
              FitVibe 3D
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <span className="text-sm">🏋️</span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-2xl font-bold text-white">{exercises.length}</p>
            <p className="text-xs text-white/40">{isNl ? 'Oefeningen' : 'Exercises'}</p>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-2xl font-bold text-white">3D</p>
            <p className="text-xs text-white/40">{isNl ? 'Animaties' : 'Animations'}</p>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-2xl font-bold text-white">
              {new Set(exercises.map((e) => e.muscleGroup)).size}
            </p>
            <p className="text-xs text-white/40">{isNl ? 'Spiergroepen' : 'Muscle Groups'}</p>
          </div>
        </div>
      </div>

      {/* Filter type toggle */}
      <div className="px-5 py-2">
        <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
          <button
            onClick={() => { setFilterType('muscle'); setSelectedFilter('all'); }}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
              filterType === 'muscle'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {isNl ? 'Spiergroep' : 'Muscle Group'}
          </button>
          <button
            onClick={() => { setFilterType('category'); setSelectedFilter('all'); }}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
              filterType === 'category'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {isNl ? 'Type' : 'Category'}
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="px-5 py-2">
        <CategoryFilter
          options={filterType === 'muscle' ? muscleOptions : categoryOptions}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <div className="space-y-2 mt-2">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onSelect={setSelectedExercise}
              locale={locale}
            />
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-white/40 text-sm">
              {isNl
                ? 'Geen oefeningen gevonden in deze categorie'
                : 'No exercises found in this category'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
