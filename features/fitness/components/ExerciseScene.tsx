/**
 * features/fitness/components/ExerciseScene.tsx
 *
 * Three.js Canvas wrapper with lighting, camera, and the 3D mannequin.
 * Provides the complete 3D scene for exercise visualization.
 *
 * Related:
 * - features/fitness/components/Mannequin3D.tsx
 */

'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

import { Mannequin3D } from './Mannequin3D';

import type { BodyPose } from '../types';

interface ExerciseSceneProps {
  poses: BodyPose[];
  animationSpeed: number;
  paused?: boolean;
}

function SceneContent({ poses, animationSpeed, paused }: ExerciseSceneProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} color="#a29bfe" />
      <pointLight position={[0, 3, 3]} intensity={0.3} color="#00cec9" />

      <Mannequin3D poses={poses} animationSpeed={animationSpeed} paused={paused} />

      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.4}
        scale={4}
        blur={2.5}
        far={4}
      />

      {/* Grid floor */}
      <gridHelper args={[6, 12, '#2d3436', '#636e72']} position={[0, -0.5, 0]} />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={6}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
        target={[0, 0.8, 0]}
      />

      <Environment preset="city" />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh position={[0, 1, 0]}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#6c5ce7" wireframe />
    </mesh>
  );
}

export function ExerciseScene({ poses, animationSpeed, paused }: ExerciseSceneProps) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden" style={{ minHeight: '300px' }}>
      <Canvas
        camera={{ position: [0, 1.5, 3.5], fov: 45 }}
        style={{
          background: 'linear-gradient(180deg, #0c0c1d 0%, #1a1a2e 50%, #16213e 100%)',
          borderRadius: '1rem',
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<LoadingFallback />}>
          <SceneContent poses={poses} animationSpeed={animationSpeed} paused={paused} />
        </Suspense>
      </Canvas>
    </div>
  );
}
