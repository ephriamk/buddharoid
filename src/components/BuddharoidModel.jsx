import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { MOOD_PRESETS } from '../config/moodPresets';

const DESIRED_HEIGHT = 0.9;
const FADE_DURATION = 0.35;

const EMOTION_TO_ANIM = {
  greeting: 'Wave',
  agreement: 'Yes',
  disagreement: 'No',
  celebration: 'Dance',
  compassion: 'ThumbsUp',
};

const MOOD_SPEAK_ANIMS = {
  serene: ['Wave', 'ThumbsUp'],
  joyful: ['Dance', 'ThumbsUp', 'Yes'],
  solemn: ['Wave', 'Yes'],
  contemplative: ['ThumbsUp', 'Wave'],
  energized: ['Jump', 'ThumbsUp', 'Yes'],
};

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

const IDLE_VARIETY_ANIMS = ['Standing', 'Wave', 'ThumbsUp'];
const IDLE_VARIETY_INTERVAL = [15000, 30000]; // 15-30 seconds

const CLICK_GREETINGS = [
  'The present moment is the only moment available to us.',
  'Peace in oneself, peace in the world.',
  'What you are looking for is already within you.',
  'The obstacle is the path.',
  'Be where you are, not where you think you should be.',
  'Letting go gives us freedom.',
  'The mind is everything. What you think, you become.',
  'In the end, only three things matter: how much you loved, how gently you lived, and how gracefully you let go.',
];

export default function BuddharoidModel({ isSpeaking = false, mood = null, onClickGreeting }) {
  const groupRef = useRef();
  const glowRef = useRef();
  const lightRef = useRef();
  const { scene, animations } = useGLTF('/models/robot-expressive.glb');
  const { actions } = useAnimations(animations, groupRef);
  const [currentAnim, setCurrentAnim] = useState('Idle');
  const speakAnimIndex = useRef(0);
  const currentGlowColor = useRef(new THREE.Color('#ffaa00'));
  const currentGlowIntensity = useRef(0.1);
  const idleTimerRef = useRef(null);
  const isIdleVariety = useRef(false);

  const preset = mood?.preset || MOOD_PRESETS.serene;
  const moodName = mood?.mood || 'serene';
  const emotion = mood?.emotion || null;
  const toolActive = mood?.toolActive || null;
  const aiAnimation = mood?.aiAnimation || null;
  const isMeditating = toolActive === 'meditation' || toolActive === 'breathing';

  // Build set of valid animation names from the loaded model
  const validAnims = useMemo(() => {
    if (!actions) return new Set();
    return new Set(Object.keys(actions));
  }, [actions]);

  // Resolve animation: validate exists, fallback to Idle
  const resolveAnim = useCallback((name) => {
    if (name && validAnims.has(name)) return name;
    if (validAnims.has('Idle')) return 'Idle';
    return Array.from(validAnims)[0] || 'Idle';
  }, [validAnims]);

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

    return {
      modelScale: s,
      yOffset: yOff,
      headY: yOff + DESIRED_HEIGHT * 0.9,
      chestY: yOff + DESIRED_HEIGHT * 0.55,
    };
  }, [scene]);

  // Start Idle
  useEffect(() => {
    const idle = resolveAnim('Idle');
    if (actions?.[idle]) {
      actions[idle].reset().setLoop(THREE.LoopRepeat, Infinity).play();
    }
  }, [actions, resolveAnim]);

  // Idle variety: randomly play a short animation every 15-30s when truly idle
  useEffect(() => {
    if (isSpeaking || isMeditating || toolActive || aiAnimation) {
      // Not idle — clear timer
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      isIdleVariety.current = false;
      return;
    }

    const scheduleVariety = () => {
      const delay = IDLE_VARIETY_INTERVAL[0] + Math.random() * (IDLE_VARIETY_INTERVAL[1] - IDLE_VARIETY_INTERVAL[0]);
      idleTimerRef.current = setTimeout(() => {
        if (!isSpeaking && !isMeditating && actions) {
          const anim = IDLE_VARIETY_ANIMS[Math.floor(Math.random() * IDLE_VARIETY_ANIMS.length)];
          const resolved = resolveAnim(anim);
          const current = actions[currentAnim];
          const next = actions[resolved];

          if (next && resolved !== currentAnim) {
            isIdleVariety.current = true;
            next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1);
            next.setLoop(THREE.LoopOnce, 1);
            next.clampWhenFinished = true;
            if (current) current.crossFadeTo(next, FADE_DURATION, true);
            next.play();
            setCurrentAnim(resolved);

            // Return to Idle after animation plays
            setTimeout(() => {
              const idle = resolveAnim('Idle');
              const idleAction = actions[idle];
              if (idleAction) {
                idleAction.reset().setLoop(THREE.LoopRepeat, Infinity);
                const curr = actions[resolved];
                if (curr) curr.crossFadeTo(idleAction, FADE_DURATION, true);
                idleAction.play();
                setCurrentAnim(idle);
              }
              isIdleVariety.current = false;
              scheduleVariety();
            }, 3000);
          } else {
            scheduleVariety();
          }
        }
      }, delay);
    };

    scheduleVariety();
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [isSpeaking, isMeditating, toolActive, aiAnimation, actions, currentAnim, resolveAnim]);

  // Main animation selection: AI → emotion → tool → mood → speaking
  useEffect(() => {
    if (!actions || isIdleVariety.current) return;

    let targetAnim = 'Idle';

    if (isSpeaking) {
      if (aiAnimation && validAnims.has(aiAnimation)) {
        targetAnim = aiAnimation;
      } else if (emotion && EMOTION_TO_ANIM[emotion]) {
        targetAnim = resolveAnim(EMOTION_TO_ANIM[emotion]);
      } else if (toolActive && TOOL_ANIMS[toolActive]) {
        targetAnim = resolveAnim(TOOL_ANIMS[toolActive]);
      } else {
        const anims = MOOD_SPEAK_ANIMS[moodName] || MOOD_SPEAK_ANIMS.serene;
        targetAnim = resolveAnim(anims[speakAnimIndex.current % anims.length]);
        speakAnimIndex.current++;
      }
    } else if (aiAnimation && validAnims.has(aiAnimation)) {
      targetAnim = aiAnimation;
    } else if (toolActive && TOOL_ANIMS[toolActive]) {
      targetAnim = resolveAnim(TOOL_ANIMS[toolActive]);
    } else {
      targetAnim = resolveAnim(MOOD_IDLE_ANIMS[moodName] || 'Idle');
    }

    if (targetAnim === currentAnim) return;

    const current = actions[currentAnim];
    const next = actions[targetAnim];

    if (next) {
      next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1);
      next.setLoop(THREE.LoopRepeat, Infinity);
      if (current) current.crossFadeTo(next, FADE_DURATION, true);
      next.play();
      setCurrentAnim(targetAnim);
    }
  }, [isSpeaking, aiAnimation, emotion, toolActive, moodName, actions, currentAnim, validAnims, resolveAnim]);

  // Click handler
  const handleClick = useCallback(() => {
    // Play Wave animation briefly
    if (actions) {
      const wave = resolveAnim('Wave');
      const waveAction = actions[wave];
      const current = actions[currentAnim];
      if (waveAction) {
        waveAction.reset().setLoop(THREE.LoopOnce, 1).clampWhenFinished = true;
        if (current) current.crossFadeTo(waveAction, 0.2, true);
        waveAction.play();
        setCurrentAnim(wave);

        setTimeout(() => {
          const idle = resolveAnim('Idle');
          const idleAction = actions[idle];
          if (idleAction) {
            idleAction.reset().setLoop(THREE.LoopRepeat, Infinity);
            waveAction.crossFadeTo(idleAction, FADE_DURATION, true);
            idleAction.play();
            setCurrentAnim(idle);
          }
        }, 2000);
      }
    }

    // Send greeting to parent
    if (onClickGreeting) {
      const greeting = CLICK_GREETINGS[Math.floor(Math.random() * CLICK_GREETINGS.length)];
      onClickGreeting(greeting);
    }
  }, [actions, currentAnim, resolveAnim, onClickGreeting]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    const floatSpeed = isMeditating ? 0.4 : 0.8;
    groupRef.current.position.y = Math.sin(t * floatSpeed) * 0.02;

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
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    >
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
