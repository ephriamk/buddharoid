import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function FloatingLotus({ position, speed = 1 }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.3;
    ref.current.rotation.y = t * 0.5;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.1;
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.15, 0.05, 8, 16]} />
      <meshStandardMaterial
        color="#ffcc44"
        emissive="#ff8800"
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function CosmicDust() {
  const dustRef = useRef();
  const count = 100;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!dustRef.current) return;
    dustRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={dustRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#8866ff"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function SpiritualEnvironment() {
  return (
    <>
      <Stars
        radius={50}
        depth={50}
        count={3000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.5}
      />
      <CosmicDust />

      {/* Floating decorative elements */}
      <FloatingLotus position={[-3, 1, -2]} speed={0.8} />
      <FloatingLotus position={[3.5, -0.5, -3]} speed={1.2} />
      <FloatingLotus position={[-2, 2.5, -4]} speed={0.6} />
      <FloatingLotus position={[2, -1.5, -2.5]} speed={1.0} />

      {/* Ambient fog for depth */}
      <fog attach="fog" args={['#0a0a1a', 8, 30]} />
    </>
  );
}
