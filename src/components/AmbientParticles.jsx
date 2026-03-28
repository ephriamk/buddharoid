import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FIREFLY_COUNT = 25;
const BUTTERFLY_COUNT = 10;

function Fireflies() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: FIREFLY_COUNT }, () => ({
      x: (Math.random() - 0.5) * 20,
      y: 0.5 + Math.random() * 3,
      z: (Math.random() - 0.5) * 20,
      speed: 0.3 + Math.random() * 0.5,
      blinkOffset: Math.random() * Math.PI * 2,
      blinkSpeed: 1.5 + Math.random() * 2,
      driftX: (Math.random() - 0.5) * 0.5,
      driftZ: (Math.random() - 0.5) * 0.5,
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.blinkOffset) * p.driftX * 2,
        p.y + Math.sin(t * p.speed * 0.7) * 0.5,
        p.z + Math.cos(t * p.speed * 0.8 + p.blinkOffset) * p.driftZ * 2
      );

      // Blink: scale to 0 when "off"
      const blink = Math.sin(t * p.blinkSpeed + p.blinkOffset);
      const scale = blink > 0.3 ? 0.04 : 0.0;
      dummy.scale.setScalar(scale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, FIREFLY_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color="#aaff44"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

function Butterflies() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: BUTTERFLY_COUNT }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: 1 + Math.random() * 3,
      z: (Math.random() - 0.5) * 16,
      speed: 0.4 + Math.random() * 0.6,
      wingSpeed: 4 + Math.random() * 4,
      offset: Math.random() * Math.PI * 2,
      radius: 1 + Math.random() * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      const angle = t * p.speed + p.offset;
      dummy.position.set(
        p.x + Math.cos(angle) * p.radius,
        p.y + Math.sin(t * p.speed * 0.5) * 0.3,
        p.z + Math.sin(angle) * p.radius
      );

      // Wing flap via X rotation
      dummy.rotation.set(
        Math.sin(t * p.wingSpeed) * 0.4,
        angle,
        0
      );
      dummy.scale.setScalar(0.04);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, BUTTERFLY_COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 0.8]} />
      <meshStandardMaterial
        color="#eedd88"
        side={THREE.DoubleSide}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  );
}

export default function AmbientParticles({ phase }) {
  const isNight = phase === 'night' || phase === 'dusk';
  const isDay = phase === 'day' || phase === 'dawn';

  return (
    <>
      {isNight && <Fireflies />}
      {isDay && <Butterflies />}
    </>
  );
}
