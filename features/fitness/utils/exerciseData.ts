/**
 * features/fitness/utils/exerciseData.ts
 *
 * Exercise definitions with 3D animation keyframe poses.
 * Each exercise has poses that define body positions for the 3D mannequin.
 *
 * Related:
 * - features/fitness/types/index.ts
 * - features/fitness/components/Mannequin3D.tsx
 */

import type { Exercise, MuscleGroup } from '../types';

const PI = Math.PI;

export const exercises: Exercise[] = [
  {
    id: 'push-ups',
    name: 'Push-Ups',
    nameNl: 'Opdrukken',
    description: 'Classic upper body exercise targeting chest, shoulders, and triceps.',
    descriptionNl: 'Klassieke bovenlichaamsoefening voor borst, schouders en triceps.',
    muscleGroup: 'chest',
    category: 'strength',
    difficulty: 'beginner',
    defaultReps: 12,
    defaultSets: 3,
    icon: '💪',
    animationSpeed: 0.8,
    tips: [
      'Keep your body in a straight line',
      'Lower until elbows are at 90 degrees',
      'Breathe in on the way down',
    ],
    tipsNl: [
      'Houd je lichaam in een rechte lijn',
      'Zak tot je ellebogen op 90 graden staan',
      'Adem in op de weg naar beneden',
    ],
    poses: [
      {
        // Up position (plank)
        head: [0, 0, 0],
        torsoRotation: [PI * 0.45, 0, 0],
        torsoPosition: [0, -0.3, 0],
        leftUpperArm: [0, 0, PI * 0.4],
        leftLowerArm: [0, 0, PI * 0.1],
        rightUpperArm: [0, 0, -PI * 0.4],
        rightLowerArm: [0, 0, -PI * 0.1],
        leftUpperLeg: [-PI * 0.05, 0, 0],
        leftLowerLeg: [0, 0, 0],
        rightUpperLeg: [-PI * 0.05, 0, 0],
        rightLowerLeg: [0, 0, 0],
      },
      {
        // Down position
        head: [0.1, 0, 0],
        torsoRotation: [PI * 0.35, 0, 0],
        torsoPosition: [0, -0.6, 0.2],
        leftUpperArm: [0, 0, PI * 0.6],
        leftLowerArm: [0, 0, PI * 0.7],
        rightUpperArm: [0, 0, -PI * 0.6],
        rightLowerArm: [0, 0, -PI * 0.7],
        leftUpperLeg: [-PI * 0.05, 0, 0],
        leftLowerLeg: [0, 0, 0],
        rightUpperLeg: [-PI * 0.05, 0, 0],
        rightLowerLeg: [0, 0, 0],
      },
    ],
  },
  {
    id: 'squats',
    name: 'Squats',
    nameNl: 'Squats',
    description: 'Fundamental lower body exercise for quads, glutes, and hamstrings.',
    descriptionNl: 'Fundamentele onderlichaamsoefening voor quadriceps, billen en hamstrings.',
    muscleGroup: 'legs',
    category: 'strength',
    difficulty: 'beginner',
    defaultReps: 15,
    defaultSets: 3,
    icon: '🦵',
    animationSpeed: 0.7,
    tips: [
      'Keep knees over toes',
      'Push hips back like sitting in a chair',
      'Keep chest up and back straight',
    ],
    tipsNl: [
      'Houd je knieen boven je tenen',
      'Duw je heupen naar achteren alsof je op een stoel gaat zitten',
      'Houd je borst omhoog en rug recht',
    ],
    poses: [
      {
        // Standing
        head: [0, 0, 0],
        torsoRotation: [0, 0, 0],
        torsoPosition: [0, 0, 0],
        leftUpperArm: [PI * 0.4, 0, PI * 0.1],
        leftLowerArm: [-PI * 0.3, 0, 0],
        rightUpperArm: [PI * 0.4, 0, -PI * 0.1],
        rightLowerArm: [-PI * 0.3, 0, 0],
        leftUpperLeg: [0, 0, 0.1],
        leftLowerLeg: [0, 0, 0],
        rightUpperLeg: [0, 0, -0.1],
        rightLowerLeg: [0, 0, 0],
      },
      {
        // Squat down
        head: [0.1, 0, 0],
        torsoRotation: [0.3, 0, 0],
        torsoPosition: [0, -0.5, 0],
        leftUpperArm: [PI * 0.5, 0, PI * 0.1],
        leftLowerArm: [-PI * 0.1, 0, 0],
        rightUpperArm: [PI * 0.5, 0, -PI * 0.1],
        rightLowerArm: [-PI * 0.1, 0, 0],
        leftUpperLeg: [-PI * 0.45, 0, 0.15],
        leftLowerLeg: [PI * 0.9, 0, 0],
        rightUpperLeg: [-PI * 0.45, 0, -0.15],
        rightLowerLeg: [PI * 0.9, 0, 0],
      },
    ],
  },
  {
    id: 'lunges',
    name: 'Lunges',
    nameNl: 'Uitvalspassen',
    description: 'Unilateral leg exercise improving balance and leg strength.',
    descriptionNl: 'Eenzijdige beenovefening die balans en beenkracht verbetert.',
    muscleGroup: 'legs',
    category: 'strength',
    difficulty: 'beginner',
    defaultReps: 10,
    defaultSets: 3,
    icon: '🏃',
    animationSpeed: 0.6,
    tips: [
      'Step forward with a long stride',
      'Lower back knee toward the floor',
      'Keep front knee at 90 degrees',
    ],
    tipsNl: [
      'Stap vooruit met een lange pas',
      'Laat je achterknie richting de grond zakken',
      'Houd je voorste knie op 90 graden',
    ],
    poses: [
      {
        // Standing
        head: [0, 0, 0],
        torsoRotation: [0, 0, 0],
        torsoPosition: [0, 0, 0],
        leftUpperArm: [0, 0, PI * 0.05],
        leftLowerArm: [0, 0, 0],
        rightUpperArm: [0, 0, -PI * 0.05],
        rightLowerArm: [0, 0, 0],
        leftUpperLeg: [0, 0, 0.05],
        leftLowerLeg: [0, 0, 0],
        rightUpperLeg: [0, 0, -0.05],
        rightLowerLeg: [0, 0, 0],
      },
      {
        // Lunge down
        head: [0, 0, 0],
        torsoRotation: [0.05, 0, 0],
        torsoPosition: [0, -0.35, 0],
        leftUpperArm: [0.3, 0, PI * 0.05],
        leftLowerArm: [-0.3, 0, 0],
        rightUpperArm: [-0.3, 0, -PI * 0.05],
        rightLowerArm: [-0.3, 0, 0],
        leftUpperLeg: [-PI * 0.4, 0, 0.05],
        leftLowerLeg: [PI * 0.8, 0, 0],
        rightUpperLeg: [PI * 0.3, 0, -0.05],
        rightLowerLeg: [PI * 0.4, 0, 0],
      },
    ],
  },
  {
    id: 'plank',
    name: 'Plank',
    nameNl: 'Plank',
    description: 'Isometric core exercise that builds stability and endurance.',
    descriptionNl: 'Isometrische core-oefening die stabiliteit en uithoudingsvermogen opbouwt.',
    muscleGroup: 'core',
    category: 'strength',
    difficulty: 'beginner',
    defaultReps: 1,
    defaultSets: 3,
    defaultDurationSeconds: 30,
    icon: '🧘',
    animationSpeed: 0.3,
    tips: [
      'Keep your body in a straight line from head to heels',
      'Engage your core muscles',
      'Don\'t let your hips sag or pike up',
    ],
    tipsNl: [
      'Houd je lichaam in een rechte lijn van hoofd tot hielen',
      'Span je buikspieren aan',
      'Laat je heupen niet doorzakken of omhoog komen',
    ],
    poses: [
      {
        // Plank hold position
        head: [-0.1, 0, 0],
        torsoRotation: [PI * 0.45, 0, 0],
        torsoPosition: [0, -0.3, 0],
        leftUpperArm: [0, 0, PI * 0.35],
        leftLowerArm: [0, PI * 0.1, PI * 0.5],
        rightUpperArm: [0, 0, -PI * 0.35],
        rightLowerArm: [0, -PI * 0.1, -PI * 0.5],
        leftUpperLeg: [-PI * 0.05, 0, 0],
        leftLowerLeg: [0, 0, 0],
        rightUpperLeg: [-PI * 0.05, 0, 0],
        rightLowerLeg: [0, 0, 0],
      },
      {
        // Slight breathing movement
        head: [-0.1, 0, 0],
        torsoRotation: [PI * 0.44, 0, 0],
        torsoPosition: [0, -0.28, 0],
        leftUpperArm: [0, 0, PI * 0.35],
        leftLowerArm: [0, PI * 0.1, PI * 0.5],
        rightUpperArm: [0, 0, -PI * 0.35],
        rightLowerArm: [0, -PI * 0.1, -PI * 0.5],
        leftUpperLeg: [-PI * 0.05, 0, 0],
        leftLowerLeg: [0, 0, 0],
        rightUpperLeg: [-PI * 0.05, 0, 0],
        rightLowerLeg: [0, 0, 0],
      },
    ],
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    nameNl: 'Jumping Jacks',
    description: 'Full body cardio exercise that raises heart rate quickly.',
    descriptionNl: 'Cardio-oefening voor het hele lichaam die snel de hartslag verhoogt.',
    muscleGroup: 'fullBody',
    category: 'cardio',
    difficulty: 'beginner',
    defaultReps: 20,
    defaultSets: 3,
    icon: '⭐',
    animationSpeed: 1.5,
    tips: [
      'Land softly on the balls of your feet',
      'Keep arms fully extended',
      'Maintain a steady rhythm',
    ],
    tipsNl: [
      'Land zacht op je voorvoeten',
      'Houd je armen volledig gestrekt',
      'Houd een constant ritme aan',
    ],
    poses: [
      {
        // Closed position
        head: [0, 0, 0],
        torsoRotation: [0, 0, 0],
        torsoPosition: [0, 0, 0],
        leftUpperArm: [0, 0, PI * 0.05],
        leftLowerArm: [0, 0, 0],
        rightUpperArm: [0, 0, -PI * 0.05],
        rightLowerArm: [0, 0, 0],
        leftUpperLeg: [0, 0, 0.05],
        leftLowerLeg: [0, 0, 0],
        rightUpperLeg: [0, 0, -0.05],
        rightLowerLeg: [0, 0, 0],
      },
      {
        // Open position (arms up, legs apart)
        head: [0, 0, 0],
        torsoRotation: [0, 0, 0],
        torsoPosition: [0, 0.1, 0],
        leftUpperArm: [0, 0, PI * 0.75],
        leftLowerArm: [0, 0, 0],
        rightUpperArm: [0, 0, -PI * 0.75],
        rightLowerArm: [0, 0, 0],
        leftUpperLeg: [0, 0, PI * 0.2],
        leftLowerLeg: [0, 0, 0],
        rightUpperLeg: [0, 0, -PI * 0.2],
        rightLowerLeg: [0, 0, 0],
      },
    ],
  },
  {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    nameNl: 'Bicep Curls',
    description: 'Isolation exercise for building bicep strength and size.',
    descriptionNl: 'Isolatie-oefening voor het opbouwen van bicepskracht.',
    muscleGroup: 'arms',
    category: 'strength',
    difficulty: 'beginner',
    defaultReps: 12,
    defaultSets: 3,
    icon: '💪',
    animationSpeed: 0.6,
    tips: [
      'Keep elbows close to your body',
      'Control the movement on the way down',
      'Don\'t swing your body for momentum',
    ],
    tipsNl: [
      'Houd je ellebogen dicht bij je lichaam',
      'Controleer de beweging op de weg naar beneden',
      'Gebruik geen lichaamsswing voor momentum',
    ],
    poses: [
      {
        // Arms down
        head: [0, 0, 0],
        torsoRotation: [0, 0, 0],
        torsoPosition: [0, 0, 0],
        leftUpperArm: [0, 0, PI * 0.08],
        leftLowerArm: [0, 0, 0.05],
        rightUpperArm: [0, 0, -PI * 0.08],
        rightLowerArm: [0, 0, -0.05],
        leftUpperLeg: [0, 0, 0.05],
        leftLowerLeg: [0, 0, 0],
        rightUpperLeg: [0, 0, -0.05],
        rightLowerLeg: [0, 0, 0],
      },
      {
        // Arms curled up
        head: [0, 0, 0],
        torsoRotation: [0, 0, 0],
        torsoPosition: [0, 0, 0],
        leftUpperArm: [0, 0, PI * 0.08],
        leftLowerArm: [-PI * 0.75, 0, 0],
        rightUpperArm: [0, 0, -PI * 0.08],
        rightLowerArm: [-PI * 0.75, 0, 0],
        leftUpperLeg: [0, 0, 0.05],
        leftLowerLeg: [0, 0, 0],
        rightUpperLeg: [0, 0, -0.05],
        rightLowerLeg: [0, 0, 0],
      },
    ],
  },
  {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    nameNl: 'Schouder Press',
    description: 'Overhead pressing movement targeting deltoids and triceps.',
    descriptionNl: 'Boven-het-hoofd duwbeweging voor deltaspieren en triceps.',
    muscleGroup: 'shoulders',
    category: 'strength',
    difficulty: 'intermediate',
    defaultReps: 10,
    defaultSets: 3,
    icon: '🏋️',
    animationSpeed: 0.6,
    tips: [
      'Press directly overhead',
      'Keep core tight throughout',
      'Lower with control to shoulder height',
    ],
    tipsNl: [
      'Druk recht boven je hoofd',
      'Houd je core gespannen',
      'Laat gecontroleerd zakken tot schouderhoogte',
    ],
    poses: [
      {
        // Arms at shoulder height
        head: [0, 0, 0],
        torsoRotation: [0, 0, 0],
        torsoPosition: [0, 0, 0],
        leftUpperArm: [0, 0, PI * 0.45],
        leftLowerArm: [-PI * 0.5, 0, PI * 0.1],
        rightUpperArm: [0, 0, -PI * 0.45],
        rightLowerArm: [-PI * 0.5, 0, -PI * 0.1],
        leftUpperLeg: [0, 0, 0.05],
        leftLowerLeg: [0, 0, 0],
        rightUpperLeg: [0, 0, -0.05],
        rightLowerLeg: [0, 0, 0],
      },
      {
        // Arms fully extended overhead
        head: [0, 0, 0],
        torsoRotation: [0, 0, 0],
        torsoPosition: [0, 0, 0],
        leftUpperArm: [0, 0, PI * 0.85],
        leftLowerArm: [0, 0, PI * 0.05],
        rightUpperArm: [0, 0, -PI * 0.85],
        rightLowerArm: [0, 0, -PI * 0.05],
        leftUpperLeg: [0, 0, 0.05],
        leftLowerLeg: [0, 0, 0],
        rightUpperLeg: [0, 0, -0.05],
        rightLowerLeg: [0, 0, 0],
      },
    ],
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    nameNl: 'Mountain Climbers',
    description: 'Dynamic cardio exercise combining plank position with knee drives.',
    descriptionNl: 'Dynamische cardio-oefening die plankpositie combineert met knieheffen.',
    muscleGroup: 'fullBody',
    category: 'cardio',
    difficulty: 'intermediate',
    defaultReps: 20,
    defaultSets: 3,
    icon: '🏔️',
    animationSpeed: 1.2,
    tips: [
      'Keep hips level and stable',
      'Drive knees toward chest quickly',
      'Maintain plank form throughout',
    ],
    tipsNl: [
      'Houd je heupen recht en stabiel',
      'Breng je knieen snel naar je borst',
      'Behoud je plankhouding',
    ],
    poses: [
      {
        // Left knee forward
        head: [-0.1, 0, 0],
        torsoRotation: [PI * 0.4, 0, 0],
        torsoPosition: [0, -0.3, 0],
        leftUpperArm: [0, 0, PI * 0.35],
        leftLowerArm: [0, 0, PI * 0.1],
        rightUpperArm: [0, 0, -PI * 0.35],
        rightLowerArm: [0, 0, -PI * 0.1],
        leftUpperLeg: [-PI * 0.5, 0, 0],
        leftLowerLeg: [PI * 0.6, 0, 0],
        rightUpperLeg: [-PI * 0.05, 0, 0],
        rightLowerLeg: [0, 0, 0],
      },
      {
        // Right knee forward
        head: [-0.1, 0, 0],
        torsoRotation: [PI * 0.4, 0, 0],
        torsoPosition: [0, -0.3, 0],
        leftUpperArm: [0, 0, PI * 0.35],
        leftLowerArm: [0, 0, PI * 0.1],
        rightUpperArm: [0, 0, -PI * 0.35],
        rightLowerArm: [0, 0, -PI * 0.1],
        leftUpperLeg: [-PI * 0.05, 0, 0],
        leftLowerLeg: [0, 0, 0],
        rightUpperLeg: [-PI * 0.5, 0, 0],
        rightLowerLeg: [PI * 0.6, 0, 0],
      },
    ],
  },
];

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function getExercisesByMuscleGroup(group: MuscleGroup): Exercise[] {
  return exercises.filter((e) => e.muscleGroup === group);
}

export function getExercisesByCategory(category: string): Exercise[] {
  return exercises.filter((e) => e.category === category);
}

export const muscleGroupLabels: Record<string, { en: string; nl: string; icon: string }> = {
  chest: { en: 'Chest', nl: 'Borst', icon: '🫁' },
  back: { en: 'Back', nl: 'Rug', icon: '🔙' },
  shoulders: { en: 'Shoulders', nl: 'Schouders', icon: '🏋️' },
  arms: { en: 'Arms', nl: 'Armen', icon: '💪' },
  core: { en: 'Core', nl: 'Core', icon: '🧘' },
  legs: { en: 'Legs', nl: 'Benen', icon: '🦵' },
  fullBody: { en: 'Full Body', nl: 'Heel Lichaam', icon: '⭐' },
};

export const categoryLabels: Record<string, { en: string; nl: string; icon: string }> = {
  strength: { en: 'Strength', nl: 'Kracht', icon: '🏋️' },
  cardio: { en: 'Cardio', nl: 'Cardio', icon: '❤️' },
  flexibility: { en: 'Flexibility', nl: 'Flexibiliteit', icon: '🤸' },
  balance: { en: 'Balance', nl: 'Balans', icon: '⚖️' },
};

