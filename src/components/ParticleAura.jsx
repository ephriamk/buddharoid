import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 300;

export default function ParticleAura({ isSpeaking = false, mood = null }) {
  const pointsRef = useRef();
  const speedMultiplier = useRef(1.0);

  const targetSpeed = mood?.preset?.particleSpeed || 1.0;

  const { positions, speeds, offsets, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const offsets = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 2.5;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 0.5;
      positions[i * 3 + 2] = r * Math.cos(phi);

      speeds[i] = 0.3 + Math.random() * 0.7;
      offsets[i] = Math.random() * Math.PI * 2;

      const t = Math.random();
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.7 + t * 0.3;
      colors[i * 3 + 2] = 0.2 + t * 0.6;
    }

    return { positions, speeds, offsets, colors };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const posArray = pointsRef.current.geometry.attributes.position.array;

    // Smoothly transition speed
    speedMultiplier.current = THREE.MathUtils.lerp(speedMultiplier.current, targetSpeed, 0.02);
    const sm = speedMultiplier.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const speed = speeds[i] * sm;
      const offset = offsets[i];

      const angle = time * speed * 0.5 + offset;
      const baseX = positions[i3];
      const baseY = positions[i3 + 1];
      const baseZ = positions[i3 + 2];

      const speakMult = isSpeaking ? 1.5 : 1.0;
      const drift = Math.sin(time * speed + offset) * 0.3 * speakMult;

      posArray[i3] = baseX * Math.cos(angle * 0.2) - baseZ * Math.sin(angle * 0.2) + drift * 0.5;
      posArray[i3 + 1] = baseY + Math.sin(time * speed * 0.8 + offset) * 0.5 * speakMult;
      posArray[i3 + 2] = baseX * Math.sin(angle * 0.2) + baseZ * Math.cos(angle * 0.2);
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    const size = isSpeaking ? 0.06 + Math.sin(time * 4) * 0.02 : 0.04;
    pointsRef.current.material.size = size;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions.slice()}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
