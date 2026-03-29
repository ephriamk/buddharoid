import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { MOOD_PRESETS } from '../config/moodPresets';

/*
  RobotExpressive.glb animations:
  Dance, Death, Idle, Jump, No, Punch, Running, Sitting,
  Standing, ThumbsUp, Walking, WalkJump, Wave, Yes

  Emotion → Animation mapping:
  - greeting    → Wave
  - agreement   → Yes (nodding)
  - disagreement→ No (shaking head)
  - celebration → Dance
  - compassion  → ThumbsUp (supportive gesture)

  Mood → Animation mapping:
  - serene      → Idle (calm)
  - joyful      → Dance
  - solemn      → Sitting (quiet presence)
  - contemplative → Standing (thoughtful)
  - energized   → Jump

  Tool → Animation mapping:
  - meditation  → Sitting
  - breathing   → Sitting
  - journal     → Standing
  - wisdom      → ThumbsUp
*/

const DESIRED_HEIGHT = 0.9;
const FADE_DURATION = 0.35;

// Emotion takes highest priority for animation
const EMOTION_TO_ANIM = {
  greeting: 'Wave',
  agreement: 'Yes',
  disagreement: 'No',
  celebration: 'Dance',
  compassion: 'ThumbsUp',
};

// Mood-based animations when speaking (no specific emotion detected)
const MOOD_SPEAK_ANIMS = {
  serene: ['Wave', 'ThumbsUp'],
  joyful: ['Dance', 'ThumbsUp', 'Yes'],
  solemn: ['Wave', 'Yes'],
  contemplative: ['ThumbsUp', 'Wave'],
  energized: ['Jump', 'ThumbsUp', 'Yes'],
};

// Mood-based idle animations
const MOOD_IDLE_ANIMS = {
  serene: 'Idle',
  joyful: 'Idle',
  solemn: 'Sitting',
  contemplative: 'Standing',
  energized: 'Idle',
};

const TOOL_ANIMS = {
  meditation: 'Sitting',
  breathing: 'Sitting',
  journal: 'Standing',
  wisdom: 'ThumbsUp',
  assessment: 'Standing',
};

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
  const moodName = mood?.mood || 'serene';
  const emotion = mood?.emotion || null;
  const toolActive = mood?.toolActive || null;
  const isMeditating = toolActive === 'meditation' || toolActive === 'breathing';

  // Bounding box scaling
  const { modelScale, yOffset, headY, chestY } = useMemo(() => {
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
    box.getSize(size);

    const s = size.y > 0 ? DESIRED_HEIGHT / size.y : 1;
    const yOff = -(box.min.y * s);
    const head = yOff + DESIRED_HEIGHT * 0.9;
    const chest = yOff + DESIRED_HEIGHT * 0.55;

    return { modelScale: s, yOffset: yOff, headY: head, chestY: chest };
  }, [scene]);

  // Start Idle
  useEffect(() => {
    if (actions?.Idle) {
      actions.Idle.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    }
  }, [actions]);

  // Choose animation based on emotion → tool → mood → speaking
  useEffect(() => {
    if (!actions) return;

    let targetAnim = 'Idle';

    if (isSpeaking) {
      // Priority 1: Specific emotion detected in conversation
      if (emotion && EMOTION_TO_ANIM[emotion]) {
        targetAnim = EMOTION_TO_ANIM[emotion];
      }
      // Priority 2: Tool-specific animation
      else if (toolActive && TOOL_ANIMS[toolActive]) {
        targetAnim = TOOL_ANIMS[toolActive];
      }
      // Priority 3: Mood-based speaking animation (cycle through)
      else {
        const anims = MOOD_SPEAK_ANIMS[moodName] || MOOD_SPEAK_ANIMS.serene;
        targetAnim = anims[speakAnimIndex.current % anims.length];
        speakAnimIndex.current++;
      }
    } else if (toolActive && TOOL_ANIMS[toolActive]) {
      targetAnim = TOOL_ANIMS[toolActive];
    } else {
      // Idle state based on mood
      targetAnim = MOOD_IDLE_ANIMS[moodName] || 'Idle';
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
  }, [isSpeaking, emotion, toolActive, moodName, actions, currentAnim]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Breathing float
    const floatSpeed = isMeditating ? 0.4 : 0.8;
    groupRef.current.position.y = Math.sin(t * floatSpeed) * 0.02;

    // Mood-reactive glow
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
      <primitive object={scene} scale={modelScale} position={[0, yOffset, 0]} />

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
