import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MOOD_PRESETS } from '../config/moodPresets';

const DESIRED_HEIGHT = 1.8;

export default function BuddharoidModel({ isSpeaking = false, mood = null }) {
  const groupRef = useRef();
  const glowRef = useRef();
  const lightRef = useRef();
  const { scene } = useGLTF('/models/buddharoid.glb');
  const currentGlowColor = useRef(new THREE.Color('#ffaa00'));
  const currentGlowIntensity = useRef(0.1);

  const preset = mood?.preset || MOOD_PRESETS.serene;
  const isMeditating = mood?.toolActive === 'meditation' || mood?.toolActive === 'breathing';

  // Compute bounding box → derive scale, center offset, and ground offset
  const { modelScale, offset } = useMemo(() => {
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

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Scale to desired height
    const s = size.y > 0 ? DESIRED_HEIGHT / size.y : 1;

    // Offset: center X/Z horizontally, ground Y (feet at y=0)
    const off = new THREE.Vector3(
      -center.x * s,        // center horizontally
      -box.min.y * s,       // ground the feet
      -center.z * s         // center depth
    );

    console.log(`[Buddharoid] raw size: ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}, scale: ${s.toFixed(4)}, offset: ${off.x.toFixed(2)}, ${off.y.toFixed(2)}, ${off.z.toFixed(2)}`);

    return { modelScale: s, offset: off };
  }, [scene]);

  // Derived positions for halo and light based on computed model geometry
  const headY = offset.y + DESIRED_HEIGHT * 0.85;
  const chestY = offset.y + DESIRED_HEIGHT * 0.6;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Very subtle breathing motion — keeps feet near ground
    const floatSpeed = isMeditating ? 0.4 : 0.8;
    groupRef.current.position.y = Math.sin(t * floatSpeed) * 0.02;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * (isMeditating ? 0.03 : 0.08);

    // Scale pulse when speaking
    const speakPulse = isSpeaking ? 1 + Math.sin(t * 6) * 0.012 : 1;
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
      {/* Model: auto-scaled and positioned via bounding box math */}
      <primitive
        object={scene}
        scale={modelScale}
        position={[offset.x, offset.y, offset.z]}
      />

      {/* Halo ring — positioned at head height, behind model */}
      <mesh ref={glowRef} position={[0, headY, -0.25]}>
        <ringGeometry args={[DESIRED_HEIGHT * 0.35, DESIRED_HEIGHT * 0.55, 64]} />
        <meshBasicMaterial
          color="#ffcc44"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner glow at chest height */}
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

useGLTF.preload('/models/buddharoid.glb');
