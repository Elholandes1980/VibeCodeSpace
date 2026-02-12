/**
 * features/fitness/components/ExerciseDetail.tsx
 *
 * Full exercise detail view with 3D visualization, timer, and tips.
 * Shown when user selects an exercise from the list.
 *
 * Related:
 * - features/fitness/components/ExerciseScene.tsx
 * - features/fitness/components/WorkoutTimer.tsx
 */

'use client';

import { useState } from 'react';

import { ExerciseScene } from './ExerciseScene';
import { WorkoutTimer } from './WorkoutTimer';

import type { Exercise } from '../types';

interface ExerciseDetailProps {
  exercise: Exercise;
  onBack: () => void;
  locale: string;
}

export function ExerciseDetail({ exercise, onBack, locale }: ExerciseDetailProps) {
  const [completed, setCompleted] = useState(false);
  const [paused, setPaused] = useState(false);

  const isNl = locale === 'nl';
  const name = isNl ? exercise.nameNl : exercise.name;
  const tips = isNl ? exercise.tipsNl : exercise.tips;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-2 pb-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="text-white font-bold text-lg">{name}</h2>
          <p className="text-white/40 text-xs">
            {exercise.defaultSets} sets × {exercise.defaultReps} reps
          </p>
        </div>
        <span className="text-3xl">{exercise.icon}</span>
      </div>

      {/* 3D Scene */}
      <div className="px-4 h-[300px] flex-shrink-0">
        <ExerciseScene
          poses={exercise.poses}
          animationSpeed={exercise.animationSpeed}
          paused={paused}
        />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8 space-y-6">
        {/* Completed banner */}
        {completed && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 text-center">
            <p className="text-green-400 font-bold text-lg">
              {isNl ? 'Goed gedaan!' : 'Well done!'}
            </p>
            <p className="text-white/50 text-sm mt-1">
              {isNl ? 'Oefening voltooid' : 'Exercise completed'}
            </p>
          </div>
        )}

        {/* Timer/Counter */}
        {!completed && (
          <WorkoutTimer
            totalSets={exercise.defaultSets}
            totalReps={exercise.defaultReps}
            durationSeconds={exercise.defaultDurationSeconds}
            onComplete={() => setCompleted(true)}
            locale={locale}
          />
        )}

        {/* 3D Controls */}
        <div className="flex justify-center">
          <button
            onClick={() => setPaused(!paused)}
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 transition-all"
          >
            {paused
              ? isNl ? '▶ 3D Animatie hervatten' : '▶ Resume 3D Animation'
              : isNl ? '⏸ 3D Animatie pauzeren' : '⏸ Pause 3D Animation'}
          </button>
        </div>

        {/* Tips */}
        <div className="space-y-2">
          <h3 className="text-white/70 font-semibold text-sm uppercase tracking-wider">
            {isNl ? 'Tips' : 'Tips'}
          </h3>
          <div className="space-y-2">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/40 to-cyan-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">{i + 1}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
