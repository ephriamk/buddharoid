import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import BuddharoidModel from './BuddharoidModel';
import ParticleAura from './ParticleAura';
import SpiritualEnvironment from './SpiritualEnvironment';
import CherryBlossoms from './CherryBlossoms';
import IncenseSmoke from './IncenseSmoke';

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
    onProgress(progress);
  }, [progress, onProgress]);
  return null;
}

export default function Scene({ isSpeaking = false, mood = null, onProgress, paused = false }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a1a', color: '#ffcc44', fontFamily: 'serif', fontSize: '1.2rem', textAlign: 'center', padding: '2rem' }}>
        <div>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>☸️</p>
          <p>The 3D scene could not be loaded.</p>
          <p style={{ fontSize: '0.8rem', color: '#9090b0', marginTop: '0.5rem' }}>Try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [5, 3, 8], fov: 45 }}
      shadows
      frameloop={paused ? 'demand' : 'always'}
      gl={{ antialias: true, alpha: false, powerPreference: 'default' }}
      style={{ background: '#b8a880' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          setHasError(true);
        });
      }}
    >
      <ProgressReporter onProgress={onProgress || (() => {})} />

      <ambientLight intensity={0.3} color="#ffe8cc" />
      <fog attach="fog" args={['#c9b8a0', 20, 55]} />

      <directionalLight
        position={[8, 12, 5]}
        intensity={1.5}
        color="#fff0d0"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 4, -6]} intensity={0.35} color="#8899cc" />

      <Sky
        distance={450000}
        sunPosition={[8, 3, -5]}
        inclination={0.48}
        azimuth={0.25}
        rayleigh={0.4}
        turbidity={8}
      />

      <Suspense fallback={<LoadingFallback />}>
        <BuddharoidModel isSpeaking={isSpeaking} mood={mood} />
        <ParticleAura isSpeaking={isSpeaking} mood={mood} />
        <SpiritualEnvironment />
        <CherryBlossoms mood={mood} />
        <IncenseSmoke mood={mood} />
        <Environment preset="sunset" backgroundIntensity={0} environmentIntensity={0.3} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={Math.PI / 6}
        target={[0, 0.5, 0]}
        autoRotate
        autoRotateSpeed={0.15}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
