import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const KOI_COUNT = 5;
const POND_CENTER = [7, 0.03, 3];
const POND_RADIUS = 1.8;

export default function KoiFish() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const fish = useMemo(() => {
    return Array.from({ length: KOI_COUNT }, (_, i) => ({
      angle: (i / KOI_COUNT) * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.2,
      radius: 0.6 + Math.random() * (POND_RADIUS - 0.8),
      wobble: Math.random() * Math.PI * 2,
      size: 0.06 + Math.random() * 0.03,
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    fish.forEach((f, i) => {
      const angle = f.angle + t * f.speed;
      const r = f.radius + Math.sin(t * 0.5 + f.wobble) * 0.3;

      const x = POND_CENTER[0] + Math.cos(angle) * r;
      const z = POND_CENTER[2] + Math.sin(angle) * r;

      dummy.position.set(x, POND_CENTER[1], z);
      dummy.rotation.set(0, -angle + Math.PI / 2, 0);
      dummy.scale.set(f.size, f.size * 0.5, f.size * 2.5);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, KOI_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 4]} />
      <meshStandardMaterial color="#ff6622" roughness={0.6} />
    </instancedMesh>
  );
}
