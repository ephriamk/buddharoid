import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function BuddharoidModel({ isSpeaking = false }) {
  const groupRef = useRef();
  const glowRef = useRef();
  const { scene } = useGLTF('/models/buddharoid.glb');

  // Clone materials so we can modify emissive without affecting original
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

    // Floating / breathing animation
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.15;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;

    // Subtle scale pulse when speaking
    const speakPulse = isSpeaking ? 1 + Math.sin(t * 6) * 0.015 : 1;
    groupRef.current.scale.setScalar(speakPulse);

    // Emissive glow intensifies when speaking
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const intensity = isSpeaking
          ? 0.3 + Math.sin(t * 4) * 0.2
          : 0.05 + Math.sin(t * 1.5) * 0.05;
        child.material.emissive = new THREE.Color('#ffaa00');
        child.material.emissiveIntensity = intensity;
      }
    });

    // Glow ring animation
    if (glowRef.current) {
      glowRef.current.rotation.z = t * 0.5;
      const glowScale = isSpeaking ? 1.2 + Math.sin(t * 3) * 0.1 : 1.0;
      glowRef.current.scale.setScalar(glowScale);
      glowRef.current.material.opacity = isSpeaking ? 0.4 : 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.5} position={[0, -1.5, 0]} />

      {/* Halo / glow ring behind the model */}
      <mesh ref={glowRef} position={[0, 0.5, -0.5]} rotation={[0, 0, 0]}>
        <ringGeometry args={[1.2, 1.8, 64]} />
        <meshBasicMaterial
          color="#ffcc44"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Point light for inner glow */}
      <pointLight
        color="#ffaa00"
        intensity={isSpeaking ? 3 : 0.8}
        distance={5}
        position={[0, 0, 1]}
      />
    </group>
  );
}

useGLTF.preload('/models/buddharoid.glb');
