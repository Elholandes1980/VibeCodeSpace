/**
 * features/fitness/components/WorkoutTimer.tsx
 *
 * iOS-style workout timer and rep counter with circular progress indicator.
 * Handles set/rep tracking and rest periods between sets.
 *
 * Related:
 * - features/fitness/types/index.ts
 * - features/fitness/components/ExerciseDetail.tsx
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface WorkoutTimerProps {
  totalSets: number;
  totalReps: number;
  durationSeconds?: number;
  onComplete: () => void;
  locale: string;
}

export function WorkoutTimer({
  totalSets,
  totalReps,
  durationSeconds,
  onComplete,
  locale,
}: WorkoutTimerProps) {
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isNl = locale === 'nl';
  const isTimedExercise = !!durationSeconds;
  const REST_DURATION = 30;

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  useEffect(() => {
    if (isActive && isResting) {
      cleanup();
      intervalRef.current = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            setCurrentRep(0);
            setElapsedTime(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isActive && isTimedExercise) {
      cleanup();
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev >= (durationSeconds ?? 30)) {
            handleSetComplete();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      cleanup();
    }
    return cleanup;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isResting, isTimedExercise]);

  function handleSetComplete() {
    if (currentSet >= totalSets) {
      setIsActive(false);
      cleanup();
      onComplete();
      return;
    }
    setIsResting(true);
    setRestTime(REST_DURATION);
    setCurrentSet((prev) => prev + 1);
  }

  function handleRepTap() {
    if (!isActive || isResting || isTimedExercise) return;
    const nextRep = currentRep + 1;
    setCurrentRep(nextRep);
    if (nextRep >= totalReps) {
      handleSetComplete();
    }
  }

  function toggleActive() {
    setIsActive((prev) => !prev);
  }

  function handleReset() {
    cleanup();
    setCurrentSet(1);
    setCurrentRep(0);
    setIsActive(false);
    setIsResting(false);
    setRestTime(0);
    setElapsedTime(0);
  }

  // Calculate progress for circular indicator
  const progress = isResting
    ? restTime / REST_DURATION
    : isTimedExercise
      ? elapsedTime / (durationSeconds ?? 30)
      : currentRep / totalReps;

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Circular Progress */}
      <div
        className="relative w-40 h-40 cursor-pointer"
        onClick={!isResting && !isTimedExercise && isActive ? handleRepTap : undefined}
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={isResting ? '#fdcb6e' : 'url(#progressGradient)'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6c5ce7" />
              <stop offset="100%" stopColor="#00cec9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isResting ? (
            <>
              <span className="text-3xl font-bold text-yellow-400">{restTime}s</span>
              <span className="text-xs text-white/50 mt-1">
                {isNl ? 'Rust' : 'Rest'}
              </span>
            </>
          ) : isTimedExercise ? (
            <>
              <span className="text-3xl font-bold text-white">
                {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
              </span>
              <span className="text-xs text-white/50 mt-1">
                / {Math.floor((durationSeconds ?? 30) / 60)}:
                {String((durationSeconds ?? 30) % 60).padStart(2, '0')}
              </span>
            </>
          ) : (
            <>
              <span className="text-4xl font-bold text-white">{currentRep}</span>
              <span className="text-xs text-white/50 mt-1">
                / {totalReps} reps
              </span>
              {isActive && (
                <span className="text-[10px] text-cyan-400 mt-1">
                  {isNl ? 'Tik om te tellen' : 'Tap to count'}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Set indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSets }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i < currentSet - 1
                ? 'bg-cyan-400'
                : i === currentSet - 1
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 scale-125'
                  : 'bg-white/20'
            }`}
          />
        ))}
        <span className="text-xs text-white/40 ml-2">
          Set {currentSet}/{totalSets}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          className="px-5 py-2.5 rounded-full text-sm font-medium bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
        >
          Reset
        </button>
        <button
          onClick={toggleActive}
          className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 ${
            isActive
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
          }`}
        >
          {isActive
            ? isNl ? 'Pauzeer' : 'Pause'
            : isNl ? 'Start' : 'Start'}
        </button>
      </div>
    </div>
  );
}
