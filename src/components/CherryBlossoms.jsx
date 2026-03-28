import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PETAL_COUNT = 25;

function FallingPetals({ center, area = 5, height = 6, speedMultiplier = 1.0 }) {
  const meshRef = useRef();
  const currentSpeed = useRef(1.0);

  const particles = useMemo(() => {
    return Array.from({ length: PETAL_COUNT }, () => ({
      x: (Math.random() - 0.5) * area,
      y: Math.random() * height,
      z: (Math.random() - 0.5) * area,
      speed: 0.15 + Math.random() * 0.25,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.8 + Math.random() * 1.5,
    }));
  }, [area, height]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    currentSpeed.current += (speedMultiplier - currentSpeed.current) * 0.02;
    const sm = currentSpeed.current;

    particles.forEach((p, i) => {
      let y = p.y - (t * p.speed * sm) % height;
      if (y < 0) y += height;

      dummy.position.set(
        center[0] + p.x + Math.sin(t * p.wobbleSpeed * sm + p.wobble) * 0.4,
        y,
        center[2] + p.z + Math.cos(t * p.wobbleSpeed * sm * 0.6 + p.wobble) * 0.3
      );
      dummy.rotation.set(
        t * p.wobbleSpeed * sm,
        t * p.wobbleSpeed * sm * 0.4,
        t * p.wobbleSpeed * sm * 0.3
      );
      dummy.scale.setScalar(0.035);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, PETAL_COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 0.7]} />
      <meshStandardMaterial
        color="#ffb7c5"
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
        roughness={0.9}
      />
    </instancedMesh>
  );
}

function CherryTree({ position }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh castShadow position={[0, 1.5, 0]} rotation={[0, 0, 0.04]}>
        <cylinderGeometry args={[0.12, 0.22, 3, 7]} />
        <meshStandardMaterial color="#5a3a20" roughness={0.9} />
      </mesh>

      {/* Branches */}
      {[
        { p: [0.3, 2.4, 0], r: [0, 0, 0.7], l: 1.3 },
        { p: [-0.3, 2.7, 0.2], r: [0.3, 0, -0.6], l: 1.1 },
        { p: [0.1, 2.2, -0.2], r: [-0.2, 0, 0.5], l: 1 },
        { p: [-0.15, 2.9, -0.1], r: [-0.1, 0, -0.35], l: 0.8 },
      ].map(({ p, r, l }, i) => (
        <mesh key={i} castShadow position={p} rotation={r}>
          <cylinderGeometry args={[0.03, 0.06, l, 5]} />
          <meshStandardMaterial color="#5a3a20" roughness={0.9} />
        </mesh>
      ))}

      {/* Blossom clouds */}
      {[
        [0.9, 3.1, 0.2, 0.55],
        [-1, 3.4, 0.4, 0.5],
        [0.4, 3.6, -0.4, 0.45],
        [-0.4, 3.8, 0, 0.5],
        [0.6, 3.3, 0.6, 0.4],
        [-0.6, 3.1, -0.2, 0.45],
      ].map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[s, 7, 7]} />
          <meshStandardMaterial
            color="#ffb7c5"
            roughness={0.85}
            transparent
            opacity={0.88}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function CherryBlossoms({ mood = null }) {
  const petalSpeed = mood?.preset?.petalSpeed || 1.0;
  const treePositions = [
    [-7, 0, -1],
    [7, 0, -1],
    [-9, 0, 7],
    [9, 0, 7],
    [-5, 0, -10],
    [5, 0, -10],
  ];

  return (
    <group>
      {treePositions.map((pos, i) => (
        <CherryTree key={i} position={pos} />
      ))}

      {/* Falling petals over the whole scene */}
      <FallingPetals center={[0, 4, 0]} area={18} height={7} speedMultiplier={petalSpeed} />
    </group>
  );
}
