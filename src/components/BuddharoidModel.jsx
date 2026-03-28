import { useRef, useEffect, useState, useMemo } from 'react';
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
  - meditation → Sitting
  - celebrate → Dance
*/

// The robot should be this tall in the scene (world units)
// Lanterns are ~1.7 tall, pagoda tier 1 walls are 2.6 — robot should be shorter than both
const DESIRED_HEIGHT = 1.0;

const FADE_DURATION = 0.4;
const SPEAKING_ANIMS = ['Wave', 'ThumbsUp', 'Yes'];

export default function BuddharoidModel({ isSpeaking = false, mood = null }) {
  const groupRef = useRef();
  const glowRef = useRef();
  const lightRef = useRef();
  const { scene, animations } = useGLTF('/models/robot-expressive.glb');
  const { actions } = useAnimations(animations, groupRef);
  const [currentAnim, setCurrentAnim] = useState('Idle');
  const speakAnimIndex = useRef(0);
  const currentGlowColor = useRef(new THREE.Color('#ffaa00'));
  const currentGlowIntensity = useRef(0.1);

  const preset = mood?.preset || MOOD_PRESETS.serene;
  const isMeditating = mood?.toolActive === 'meditation' || mood?.toolActive === 'breathing';

  // Compute bounding box → scale + ground offset
  const { modelScale, yOffset, headY, chestY } = useMemo(() => {
    // Enable shadows on all meshes, clone materials
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material && !child.material._cloned) {
          child.material = child.material.clone();
          child.material._cloned = true;
          child.material.envMapIntensity = 1.5;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Scale to desired height
    const s = size.y > 0 ? DESIRED_HEIGHT / size.y : 1;

    // Y offset: move model up so feet (box.min.y * s) sit at y=0
    const yOff = -(box.min.y * s);

    // Derived positions for halo and light
    const head = yOff + DESIRED_HEIGHT * 0.9;
    const chest = yOff + DESIRED_HEIGHT * 0.55;

    return { modelScale: s, yOffset: yOff, headY: head, chestY: chest };
  }, [scene]);

  // Start with Idle animation
  useEffect(() => {
    if (actions?.Idle) {
      actions.Idle.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    }
  }, [actions]);

  // Switch animations based on state
  useEffect(() => {
    if (!actions) return;

    let targetAnim = 'Idle';

    if (isSpeaking) {
      targetAnim = SPEAKING_ANIMS[speakAnimIndex.current % SPEAKING_ANIMS.length];
      speakAnimIndex.current++;
    } else if (isMeditating) {
      targetAnim = 'Sitting';
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

    // Very subtle breathing float
    const floatSpeed = isMeditating ? 0.4 : 0.8;
    groupRef.current.position.y = Math.sin(t * floatSpeed) * 0.02;

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
      {/* Model: auto-scaled via bounding box, feet grounded at y=0 */}
      <primitive
        object={scene}
        scale={modelScale}
        position={[0, yOffset, 0]}
      />

      {/* Halo ring — positioned at head height */}
      <mesh ref={glowRef} position={[0, headY, -0.2]}>
        <ringGeometry args={[DESIRED_HEIGHT * 0.3, DESIRED_HEIGHT * 0.5, 64]} />
        <meshBasicMaterial
          color="#ffcc44"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner glow at chest */}
      <pointLight
        ref={lightRef}
        color="#ffaa00"
        intensity={0.6}
        distance={4}
        position={[0, chestY, 0.4]}
      />
    </group>
  );
}

useGLTF.preload('/models/robot-expressive.glb');
