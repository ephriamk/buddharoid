import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { MOOD_PRESETS } from '../config/moodPresets';

/*
  RobotExpressive.glb animations:
  Dance, Death, Idle, Jump, No, Punch, Running, Sitting,
  Standing, ThumbsUp, Walking, WalkJump, Wave, Yes

  Chat state mapping:
  - idle → Idle (gentle loop)
  - speaking → Wave/ThumbsUp (gesturing while talking)
  - thinking → Idle (waiting for AI)
  - greeting → Wave
  - meditation → Sitting
  - agree → Yes (nodding)
  - disagree → No (shaking head)
  - celebrate → Dance
*/

const FADE_DURATION = 0.4;

const SPEAKING_ANIMS = ['Wave', 'ThumbsUp', 'Yes'];

export default function BuddharoidModel({ isSpeaking = false, mood = null }) {
  const groupRef = useRef();
  const glowRef = useRef();
  const lightRef = useRef();
  const { scene, animations } = useGLTF('/models/robot-expressive.glb');
  const { actions, mixer } = useAnimations(animations, groupRef);
  const [currentAnim, setCurrentAnim] = useState('Idle');
  const speakAnimIndex = useRef(0);
  const currentGlowColor = useRef(new THREE.Color('#ffaa00'));
  const currentGlowIntensity = useRef(0.1);

  const preset = mood?.preset || MOOD_PRESETS.serene;
  const isMeditating = mood?.toolActive === 'meditation' || mood?.toolActive === 'breathing';

  // Start with Idle
  useEffect(() => {
    if (actions?.Idle) {
      actions.Idle.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    }
  }, [actions]);

  // React to state changes
  useEffect(() => {
    if (!actions) return;

    let targetAnim = 'Idle';

    if (isSpeaking) {
      targetAnim = SPEAKING_ANIMS[speakAnimIndex.current % SPEAKING_ANIMS.length];
      speakAnimIndex.current++;
    } else if (isMeditating) {
      targetAnim = 'Sitting';
    } else {
      targetAnim = 'Idle';
    }

    if (targetAnim === currentAnim) return;

    const current = actions[currentAnim];
    const next = actions[targetAnim];

    if (next) {
      next.reset();
      next.setEffectiveTimeScale(1);
      next.setEffectiveWeight(1);
      next.setLoop(THREE.LoopRepeat, Infinity);

      if (current) {
        current.crossFadeTo(next, FADE_DURATION, true);
      }
      next.play();
      setCurrentAnim(targetAnim);
    }
  }, [isSpeaking, isMeditating, actions, currentAnim]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Subtle breathing motion — keep feet grounded
    const floatSpeed = isMeditating ? 0.4 : 0.8;
    groupRef.current.position.y = 0.05 + Math.sin(t * floatSpeed) * 0.015;

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
        if (!child.material._cloned) {
          child.material = child.material.clone();
          child.material._cloned = true;
        }
        child.material.emissive.copy(currentGlowColor.current);
        child.material.emissiveIntensity = currentGlowIntensity.current;
      }
    });

    // Glow ring
    if (glowRef.current) {
      glowRef.current.rotation.z = t * (isMeditating ? 0.2 : 0.5);
      const glowScale = isSpeaking ? 1.15 + Math.sin(t * 3) * 0.08 :
        isMeditating ? 1.2 + Math.sin(t * 0.8) * 0.05 : 1.0;
      glowRef.current.scale.setScalar(
        THREE.MathUtils.lerp(glowRef.current.scale.x, glowScale, 0.03)
      );
      const targetOpacity = isSpeaking ? 0.35 : isMeditating ? 0.3 : 0.12;
      glowRef.current.material.opacity = THREE.MathUtils.lerp(
        glowRef.current.material.opacity, targetOpacity, 0.03
      );
      glowRef.current.material.color.lerp(currentGlowColor.current, 0.02);
    }

    // Point light
    if (lightRef.current) {
      const targetLightIntensity = isSpeaking ? 2.5 : isMeditating ? 1.5 : 0.6;
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity, targetLightIntensity, 0.03
      );
      lightRef.current.color.lerp(currentGlowColor.current, 0.02);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={0.7} position={[0, 0.05, 0]} />

      {/* Halo ring behind head */}
      <mesh ref={glowRef} position={[0, 1.2, -0.2]}>
        <ringGeometry args={[0.25, 0.4, 64]} />
        <meshBasicMaterial
          color="#ffcc44"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner glow */}
      <pointLight
        ref={lightRef}
        color="#ffaa00"
        intensity={0.6}
        distance={3}
        position={[0, 0.7, 0.3]}
      />
    </group>
  );
}

useGLTF.preload('/models/robot-expressive.glb');
