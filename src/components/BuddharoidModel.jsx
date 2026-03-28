import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MOOD_PRESETS } from '../config/moodPresets';

const DESIRED_HEIGHT = 1.8; // Target height in world units

export default function BuddharoidModel({ isSpeaking = false, mood = null }) {
  const groupRef = useRef();
  const glowRef = useRef();
  const lightRef = useRef();
  const { scene } = useGLTF('/models/buddharoid.glb');
  const currentGlowColor = useRef(new THREE.Color('#ffaa00'));
  const currentGlowIntensity = useRef(0.1);

  const preset = mood?.preset || MOOD_PRESETS.serene;
  const isMeditating = mood?.toolActive === 'meditation' || mood?.toolActive === 'breathing';

  // Compute bounding box, scale to desired height, and offset so feet touch y=0
  const { scale, yOffset, modelHeight } = useMemo(() => {
    // Clone materials and enable shadows
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.envMapIntensity = 1.5;
        }
      }
    });

    // Compute bounding box of the raw model
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const rawHeight = size.y;

    // Scale factor to reach desired height
    const s = rawHeight > 0 ? DESIRED_HEIGHT / rawHeight : 1;

    // After scaling, the bottom of the model will be at box.min.y * s
    // We need to offset Y so the bottom sits at y=0
    const offset = -(box.min.y * s);

    return { scale: s, yOffset: offset, modelHeight: rawHeight };
  }, [scene]);

  // Center of model after grounding (for halo/light positioning)
  const modelCenter = yOffset + (DESIRED_HEIGHT / 2);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Subtle breathing — very small so feet stay grounded
    const floatSpeed = isMeditating ? 0.4 : 0.8;
    groupRef.current.position.y = Math.sin(t * floatSpeed) * 0.02;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * (isMeditating ? 0.03 : 0.1);

    // Scale pulse when speaking
    const speakPulse = isSpeaking ? 1 + Math.sin(t * 6) * 0.015 : 1;
    groupRef.current.scale.setScalar(speakPulse);

    // Mood-reactive emissive glow
    const targetColor = new THREE.Color(preset.buddhaGlowColor);
    currentGlowColor.current.lerp(targetColor, 0.02);

    const baseIntensity = preset.buddhaGlowIntensity;
    const targetIntensity = isSpeaking
      ? baseIntensity + 0.25 + Math.sin(t * 4) * 0.15
      : baseIntensity + Math.sin(t * 1.5) * 0.05;
    currentGlowIntensity.current = THREE.MathUtils.lerp(
      currentGlowIntensity.current, targetIntensity, 0.03
    );

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.emissive.copy(currentGlowColor.current);
        child.material.emissiveIntensity = currentGlowIntensity.current;
      }
    });

    // Glow ring
    if (glowRef.current) {
      glowRef.current.rotation.z = t * (isMeditating ? 0.2 : 0.5);
      const glowScale = isSpeaking ? 1.2 + Math.sin(t * 3) * 0.1 :
        isMeditating ? 1.3 + Math.sin(t * 0.8) * 0.05 : 1.0;
      glowRef.current.scale.setScalar(
        THREE.MathUtils.lerp(glowRef.current.scale.x, glowScale, 0.03)
      );
      const targetOpacity = isSpeaking ? 0.4 : isMeditating ? 0.35 : 0.15;
      glowRef.current.material.opacity = THREE.MathUtils.lerp(
        glowRef.current.material.opacity, targetOpacity, 0.03
      );
      glowRef.current.material.color.lerp(currentGlowColor.current, 0.02);
    }

    // Point light
    if (lightRef.current) {
      const targetLightIntensity = isSpeaking ? 3 : isMeditating ? 2 : 0.8;
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity, targetLightIntensity, 0.03
      );
      lightRef.current.color.lerp(currentGlowColor.current, 0.02);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Model: scaled to DESIRED_HEIGHT, offset so feet touch y=0 */}
      <primitive object={scene} scale={scale} position={[0, yOffset, 0]} />

      {/* Halo ring behind the model's upper body */}
      <mesh ref={glowRef} position={[0, modelCenter * 0.85, -0.3]}>
        <ringGeometry args={[DESIRED_HEIGHT * 0.4, DESIRED_HEIGHT * 0.6, 64]} />
        <meshBasicMaterial
          color="#ffcc44"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner glow light at chest height */}
      <pointLight
        ref={lightRef}
        color="#ffaa00"
        intensity={0.8}
        distance={5}
        position={[0, modelCenter * 0.7, 0.5]}
      />
    </group>
  );
}

useGLTF.preload('/models/buddharoid.glb');
