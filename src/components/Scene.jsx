import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useProgress } from '@react-three/drei';
import BuddharoidModel from './BuddharoidModel';
import ParticleAura from './ParticleAura';

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#ffcc44" wireframe />
    </mesh>
  );
}

function ProgressReporter({ onProgress }) {
  const { progress } = useProgress();
  useEffect(() => {
    if (onProgress) onProgress(progress);
  }, [progress, onProgress]);
  return null;
}

export default function Scene({ isSpeaking = false, mood = null, onProgress, paused = false }) {
  return (
    <Canvas
      camera={{ position: [0, 1, 5], fov: 50 }}
      frameloop={paused ? 'demand' : 'always'}
      gl={{ antialias: true, alpha: false, powerPreference: 'default' }}
      style={{ background: '#0a0a1a' }}
    >
      <ProgressReporter onProgress={onProgress || (() => {})} />

      <ambientLight intensity={0.4} color="#ffe8cc" />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#fff0d0" />
      <directionalLight position={[-3, 4, -4]} intensity={0.3} color="#8899cc" />
      <pointLight position={[0, 2, 2]} intensity={0.8} color="#ffaa00" distance={8} />

      <Suspense fallback={<LoadingFallback />}>
        <BuddharoidModel isSpeaking={isSpeaking} mood={mood} />
        <ParticleAura isSpeaking={isSpeaking} mood={mood} />
        <Environment preset="night" backgroundIntensity={0.05} environmentIntensity={0.3} />
      </Suspense>

      {/* Simple ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#111122" roughness={0.95} />
      </mesh>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 0.5, 0]}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
