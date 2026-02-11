/**
 * features/fitness/types/index.ts
 *
 * Type definitions for the fitness feature including exercises,
 * body parts, categories, and workout sessions.
 *
 * Related:
 * - features/fitness/utils/exerciseData.ts
 */

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'legs'
  | 'fullBody';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseCategory = 'strength' | 'cardio' | 'flexibility' | 'balance';

export interface BodyPose {
  /** Head position [x, y, z] */
  head: [number, number, number];
  /** Torso rotation [x, y, z] in radians */
  torsoRotation: [number, number, number];
  /** Torso position offset [x, y, z] */
  torsoPosition: [number, number, number];
  /** Left upper arm rotation [x, y, z] */
  leftUpperArm: [number, number, number];
  /** Left lower arm rotation [x, y, z] */
  leftLowerArm: [number, number, number];
  /** Right upper arm rotation [x, y, z] */
  rightUpperArm: [number, number, number];
  /** Right lower arm rotation [x, y, z] */
  rightLowerArm: [number, number, number];
  /** Left upper leg rotation [x, y, z] */
  leftUpperLeg: [number, number, number];
  /** Left lower leg rotation [x, y, z] */
  leftLowerLeg: [number, number, number];
  /** Right upper leg rotation [x, y, z] */
  rightUpperLeg: [number, number, number];
  /** Right lower leg rotation [x, y, z] */
  rightLowerLeg: [number, number, number];
}

export interface Exercise {
  id: string;
  name: string;
  nameNl: string;
  description: string;
  descriptionNl: string;
  muscleGroup: MuscleGroup;
  category: ExerciseCategory;
  difficulty: Difficulty;
  defaultReps: number;
  defaultSets: number;
  defaultDurationSeconds?: number;
  icon: string;
  /** Keyframe poses for the 3D animation */
  poses: BodyPose[];
  /** Animation speed multiplier */
  animationSpeed: number;
  tips: string[];
  tipsNl: string[];
}

export interface WorkoutSession {
  exerciseId: string;
  currentSet: number;
  currentRep: number;
  isActive: boolean;
  isResting: boolean;
  restTimeRemaining: number;
}
