/**
 * features/fitness/components/Mannequin3D.tsx
 *
 * 3D animated mannequin built from Three.js primitives.
 * Renders a stylized human figure and animates between exercise keyframe poses.
 *
 * Related:
 * - features/fitness/types/index.ts
 * - features/fitness/utils/exerciseData.ts
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import type { BodyPose } from '../types';

interface Mannequin3DProps {
  poses: BodyPose[];
  animationSpeed: number;
  paused?: boolean;
}

const BODY_COLOR = '#6C5CE7';
const JOINT_COLOR = '#A29BFE';
const ACCENT_COLOR = '#00CEC9';

function lerpPoses(a: BodyPose, b: BodyPose, t: number): BodyPose {
  const smoothT = t * t * (3 - 2 * t); // smoothstep
  const lerp3 = (
    from: [number, number, number],
    to: [number, number, number],
  ): [number, number, number] => [
    from[0] + (to[0] - from[0]) * smoothT,
    from[1] + (to[1] - from[1]) * smoothT,
    from[2] + (to[2] - from[2]) * smoothT,
  ];

  return {
    head: lerp3(a.head, b.head),
    torsoRotation: lerp3(a.torsoRotation, b.torsoRotation),
    torsoPosition: lerp3(a.torsoPosition, b.torsoPosition),
    leftUpperArm: lerp3(a.leftUpperArm, b.leftUpperArm),
    leftLowerArm: lerp3(a.leftLowerArm, b.leftLowerArm),
    rightUpperArm: lerp3(a.rightUpperArm, b.rightUpperArm),
    rightLowerArm: lerp3(a.rightLowerArm, b.rightLowerArm),
    leftUpperLeg: lerp3(a.leftUpperLeg, b.leftUpperLeg),
    leftLowerLeg: lerp3(a.leftLowerLeg, b.leftLowerLeg),
    rightUpperLeg: lerp3(a.rightUpperLeg, b.rightUpperLeg),
    rightLowerLeg: lerp3(a.rightLowerLeg, b.rightLowerLeg),
  };
}

export function Mannequin3D({ poses, animationSpeed, paused = false }: Mannequin3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // Refs for body parts
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftUpperArmRef = useRef<THREE.Group>(null);
  const leftLowerArmRef = useRef<THREE.Group>(null);
  const rightUpperArmRef = useRef<THREE.Group>(null);
  const rightLowerArmRef = useRef<THREE.Group>(null);
  const leftUpperLegRef = useRef<THREE.Group>(null);
  const leftLowerLegRef = useRef<THREE.Group>(null);
  const rightUpperLegRef = useRef<THREE.Group>(null);
  const rightLowerLegRef = useRef<THREE.Group>(null);

  const bodyMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: BODY_COLOR, roughness: 0.3, metalness: 0.1 }),
    [],
  );
  const jointMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: JOINT_COLOR, roughness: 0.2, metalness: 0.2 }),
    [],
  );
  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: ACCENT_COLOR,
        roughness: 0.2,
        metalness: 0.3,
        emissive: ACCENT_COLOR,
        emissiveIntensity: 0.15,
      }),
    [],
  );

  useFrame((_, delta) => {
    if (paused || poses.length < 2) return;

    timeRef.current += delta * animationSpeed;
    const totalTime = poses.length;
    const normalizedTime = timeRef.current % totalTime;
    const poseIndex = Math.floor(normalizedTime) % poses.length;
    const nextPoseIndex = (poseIndex + 1) % poses.length;
    const t = normalizedTime - Math.floor(normalizedTime);

    const currentPose = lerpPoses(poses[poseIndex], poses[nextPoseIndex], t);

    // Apply pose to body parts
    if (torsoRef.current) {
      torsoRef.current.rotation.set(...currentPose.torsoRotation);
      torsoRef.current.position.set(
        currentPose.torsoPosition[0],
        currentPose.torsoPosition[1] + 1.0,
        currentPose.torsoPosition[2],
      );
    }
    if (headRef.current) {
      headRef.current.rotation.set(...currentPose.head);
    }
    if (leftUpperArmRef.current) {
      leftUpperArmRef.current.rotation.set(...currentPose.leftUpperArm);
    }
    if (leftLowerArmRef.current) {
      leftLowerArmRef.current.rotation.set(...currentPose.leftLowerArm);
    }
    if (rightUpperArmRef.current) {
      rightUpperArmRef.current.rotation.set(...currentPose.rightUpperArm);
    }
    if (rightLowerArmRef.current) {
      rightLowerArmRef.current.rotation.set(...currentPose.rightLowerArm);
    }
    if (leftUpperLegRef.current) {
      leftUpperLegRef.current.rotation.set(...currentPose.leftUpperLeg);
    }
    if (leftLowerLegRef.current) {
      leftLowerLegRef.current.rotation.set(...currentPose.leftLowerLeg);
    }
    if (rightUpperLegRef.current) {
      rightUpperLegRef.current.rotation.set(...currentPose.rightUpperLeg);
    }
    if (rightLowerLegRef.current) {
      rightLowerLegRef.current.rotation.set(...currentPose.rightLowerLeg);
    }
  });

  const limbRadius = 0.06;
  const upperLimbLength = 0.35;
  const lowerLimbLength = 0.3;
  const legUpperLength = 0.4;
  const legLowerLength = 0.38;

  return (
    <group ref={groupRef}>
      {/* Torso group - everything attaches to this */}
      <group ref={torsoRef} position={[0, 1.0, 0]}>
        {/* Torso body */}
        <mesh material={bodyMaterial}>
          <capsuleGeometry args={[0.16, 0.4, 8, 16]} />
        </mesh>

        {/* Hip accent ring */}
        <mesh position={[0, -0.25, 0]} material={accentMaterial}>
          <torusGeometry args={[0.14, 0.02, 8, 24]} />
        </mesh>

        {/* Chest accent */}
        <mesh position={[0, 0.1, 0.12]} material={accentMaterial}>
          <sphereGeometry args={[0.04, 8, 8]} />
        </mesh>

        {/* Head */}
        <group position={[0, 0.42, 0]}>
          {/* Neck */}
          <mesh material={bodyMaterial} position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.05, 0.06, 0.1, 12]} />
          </mesh>
          <mesh ref={headRef} material={jointMaterial}>
            <sphereGeometry args={[0.14, 16, 16]} />
          </mesh>
          {/* Face visor accent */}
          <mesh position={[0, 0.02, 0.1]} material={accentMaterial}>
            <boxGeometry args={[0.18, 0.04, 0.06]} />
          </mesh>
        </group>

        {/* === LEFT ARM === */}
        <group position={[0.22, 0.18, 0]}>
          {/* Shoulder joint */}
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>
          <group ref={leftUpperArmRef}>
            {/* Upper arm */}
            <mesh material={bodyMaterial} position={[0, -upperLimbLength / 2, 0]}>
              <capsuleGeometry args={[limbRadius, upperLimbLength, 6, 12]} />
            </mesh>
            {/* Elbow joint */}
            <group position={[0, -upperLimbLength, 0]}>
              <mesh material={jointMaterial}>
                <sphereGeometry args={[0.05, 10, 10]} />
              </mesh>
              <group ref={leftLowerArmRef}>
                {/* Lower arm */}
                <mesh material={bodyMaterial} position={[0, -lowerLimbLength / 2, 0]}>
                  <capsuleGeometry args={[limbRadius * 0.85, lowerLimbLength, 6, 12]} />
                </mesh>
                {/* Hand */}
                <mesh material={accentMaterial} position={[0, -lowerLimbLength, 0]}>
                  <sphereGeometry args={[0.05, 10, 10]} />
                </mesh>
              </group>
            </group>
          </group>
        </group>

        {/* === RIGHT ARM === */}
        <group position={[-0.22, 0.18, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>
          <group ref={rightUpperArmRef}>
            <mesh material={bodyMaterial} position={[0, -upperLimbLength / 2, 0]}>
              <capsuleGeometry args={[limbRadius, upperLimbLength, 6, 12]} />
            </mesh>
            <group position={[0, -upperLimbLength, 0]}>
              <mesh material={jointMaterial}>
                <sphereGeometry args={[0.05, 10, 10]} />
              </mesh>
              <group ref={rightLowerArmRef}>
                <mesh material={bodyMaterial} position={[0, -lowerLimbLength / 2, 0]}>
                  <capsuleGeometry args={[limbRadius * 0.85, lowerLimbLength, 6, 12]} />
                </mesh>
                <mesh material={accentMaterial} position={[0, -lowerLimbLength, 0]}>
                  <sphereGeometry args={[0.05, 10, 10]} />
                </mesh>
              </group>
            </group>
          </group>
        </group>

        {/* === LEFT LEG === */}
        <group position={[0.1, -0.32, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.065, 12, 12]} />
          </mesh>
          <group ref={leftUpperLegRef}>
            <mesh material={bodyMaterial} position={[0, -legUpperLength / 2, 0]}>
              <capsuleGeometry args={[limbRadius * 1.15, legUpperLength, 6, 12]} />
            </mesh>
            <group position={[0, -legUpperLength, 0]}>
              <mesh material={jointMaterial}>
                <sphereGeometry args={[0.055, 10, 10]} />
              </mesh>
              <group ref={leftLowerLegRef}>
                <mesh material={bodyMaterial} position={[0, -legLowerLength / 2, 0]}>
                  <capsuleGeometry args={[limbRadius, legLowerLength, 6, 12]} />
                </mesh>
                {/* Foot */}
                <mesh material={accentMaterial} position={[0, -legLowerLength, 0.04]}>
                  <boxGeometry args={[0.08, 0.04, 0.14]} />
                </mesh>
              </group>
            </group>
          </group>
        </group>

        {/* === RIGHT LEG === */}
        <group position={[-0.1, -0.32, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.065, 12, 12]} />
          </mesh>
          <group ref={rightUpperLegRef}>
            <mesh material={bodyMaterial} position={[0, -legUpperLength / 2, 0]}>
              <capsuleGeometry args={[limbRadius * 1.15, legUpperLength, 6, 12]} />
            </mesh>
            <group position={[0, -legUpperLength, 0]}>
              <mesh material={jointMaterial}>
                <sphereGeometry args={[0.055, 10, 10]} />
              </mesh>
              <group ref={rightLowerLegRef}>
                <mesh material={bodyMaterial} position={[0, -legLowerLength / 2, 0]}>
                  <capsuleGeometry args={[limbRadius, legLowerLength, 6, 12]} />
                </mesh>
                <mesh material={accentMaterial} position={[0, -legLowerLength, 0.04]}>
                  <boxGeometry args={[0.08, 0.04, 0.14]} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
