import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MOOD_PRESETS } from '../config/moodPresets';

export default function BuddharoidModel({ isSpeaking = false, mood = null }) {
  const groupRef = useRef();
  const glowRef = useRef();
  const lightRef = useRef();
  const { scene } = useGLTF('/models/buddharoid.glb');
  const currentGlowColor = useRef(new THREE.Color('#ffaa00'));
  const currentGlowIntensity = useRef(0.1);

  const preset = mood?.preset || MOOD_PRESETS.serene;
  const isMeditating = mood?.toolActive === 'meditation' || mood?.toolActive === 'breathing';

  useMemo(() => {
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
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Float speed: slower during meditation
    const floatSpeed = isMeditating ? 0.4 : 0.8;
    const floatAmount = isMeditating ? 0.08 : 0.15;
    groupRef.current.position.y = Math.sin(t * floatSpeed) * floatAmount;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * (isMeditating ? 0.03 : 0.1);

    // Scale pulse
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
      <primitive object={scene} scale={1.5} position={[0, -1.5, 0]} />

      <mesh ref={glowRef} position={[0, 0.5, -0.5]}>
        <ringGeometry args={[1.2, 1.8, 64]} />
        <meshBasicMaterial
          color="#ffcc44"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        color="#ffaa00"
        intensity={0.8}
        distance={5}
        position={[0, 0, 1]}
      />
    </group>
  );
}

useGLTF.preload('/models/buddharoid.glb');
