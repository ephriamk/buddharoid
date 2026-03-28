import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SMOKE_COUNT = 15;

export default function IncenseSmoke({ position = [0, 0.4, 3], mood = null }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const currentSpeed = useRef(1.0);
  const smokeSpeed = mood?.preset?.smokeSpeed || 1.0;

  const particles = useMemo(() => {
    return Array.from({ length: SMOKE_COUNT }, (_, i) => ({
      offset: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.35,
      drift: (Math.random() - 0.5) * 0.2,
      phase: i / SMOKE_COUNT,
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    currentSpeed.current += (smokeSpeed - currentSpeed.current) * 0.02;
    const sm = currentSpeed.current;

    particles.forEach((p, i) => {
      const life = ((t * p.speed * sm + p.offset) % 2.5) / 2.5;

      dummy.position.set(
        position[0] + Math.sin(t * 0.4 + p.offset) * 0.12 + p.drift * life,
        position[1] + life * 2.5,
        position[2] + Math.cos(t * 0.6 + p.offset) * 0.08
      );

      // Grow then fade
      const scale = life < 0.3
        ? life / 0.3 * 0.12
        : 0.12 + (life - 0.3) * 0.15;

      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, SMOKE_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#bbbbbb"
        transparent
        opacity={0.08}
        depthWrite={false}
        roughness={1}
      />
    </instancedMesh>
  );
}
