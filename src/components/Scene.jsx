import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import BuddharoidModel from './BuddharoidModel';
import ParticleAura from './ParticleAura';
import SpiritualEnvironment from './SpiritualEnvironment';

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#ffcc44" wireframe />
    </mesh>
  );
}

export default function Scene({ isSpeaking = false }) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 4.5], fov: 50 }}
      shadows
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#0a0a1a' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#4444ff" />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        color="#ffffff"
      />
      <directionalLight
        position={[-3, 3, -3]}
        intensity={0.5}
        color="#6644ff"
      />
      <spotLight
        position={[0, 8, 0]}
        intensity={0.8}
        angle={0.5}
        penumbra={1}
        color="#ffcc44"
      />

      <Suspense fallback={<LoadingFallback />}>
        <BuddharoidModel isSpeaking={isSpeaking} />
        <ParticleAura isSpeaking={isSpeaking} />
        <SpiritualEnvironment />
        <Environment preset="night" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2.5}
        maxDistance={8}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 4}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
}
