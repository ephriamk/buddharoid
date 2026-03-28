import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, useProgress } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import BuddharoidModel from './BuddharoidModel';
import ParticleAura from './ParticleAura';
import SpiritualEnvironment from './SpiritualEnvironment';
import CherryBlossoms from './CherryBlossoms';
import IncenseSmoke from './IncenseSmoke';
import { MOOD_PRESETS } from '../config/moodPresets';

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#ffcc44" wireframe />
    </mesh>
  );
}

// Reports loading progress to parent
function ProgressReporter({ onProgress }) {
  const { progress } = useProgress();
  useEffect(() => {
    onProgress(progress);
  }, [progress, onProgress]);
  return null;
}

// Smoothly transitions scene lighting/fog based on mood
function MoodLighting({ mood }) {
  const ambientRef = useRef();
  const fogRef = useRef();
  const preset = MOOD_PRESETS[mood?.mood] || MOOD_PRESETS.serene;

  useFrame(() => {
    if (ambientRef.current) {
      const targetColor = new THREE.Color(preset.ambientColor);
      ambientRef.current.color.lerp(targetColor, 0.02);
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity, preset.ambientIntensity, 0.02
      );
    }
    if (fogRef.current) {
      const targetFogColor = new THREE.Color(preset.fogColor);
      fogRef.current.color.lerp(targetFogColor, 0.02);
      fogRef.current.near = THREE.MathUtils.lerp(fogRef.current.near, preset.fogNear, 0.02);
      fogRef.current.far = THREE.MathUtils.lerp(fogRef.current.far, preset.fogFar, 0.02);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.25} color="#ffe8cc" />
      <fog ref={fogRef} attach="fog" args={['#c9b8a0', 20, 55]} />
    </>
  );
}

export default function Scene({ isSpeaking = false, mood = null, onProgress, paused = false }) {
  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;
  const shadowSize = isDesktop ? 2048 : 1024;

  return (
    <Canvas
      camera={{ position: [5, 3, 8], fov: 45 }}
      shadows
      frameloop={paused ? 'demand' : 'always'}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#b8a880' }}
    >
      <ProgressReporter onProgress={onProgress || (() => {})} />

      {/* Mood-reactive ambient + fog */}
      <MoodLighting mood={mood} />

      {/* Main sun */}
      <directionalLight
        position={[8, 12, 5]}
        intensity={1.5}
        color="#fff0d0"
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />

      {/* Back fill */}
      <directionalLight position={[-5, 4, -6]} intensity={0.35} color="#8899cc" />

      {/* Overhead spot on buddha */}
      <spotLight
        position={[0, 8, 1]}
        intensity={1.2}
        angle={0.4}
        penumbra={0.8}
        color="#ffcc44"
        castShadow
      />

      {/* Lantern glow */}
      <pointLight position={[-3.5, 1.5, 2]} intensity={0.4} color="#ff8844" distance={6} />
      <pointLight position={[3.5, 1.5, 2]} intensity={0.4} color="#ff8844" distance={6} />

      <Sky
        distance={450000}
        sunPosition={[8, 3, -5]}
        inclination={mood?.preset?.skyInclination || 0.48}
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

      {/* Post-processing - desktop only */}
      {isDesktop && (
        <EffectComposer>
          <Bloom intensity={0.25} luminanceThreshold={0.9} luminanceSmoothing={0.4} />
          <Vignette eskil={false} offset={0.1} darkness={0.3} />
        </EffectComposer>
      )}

      <OrbitControls
        enablePan={false}
        enableZoom={isDesktop}
        minDistance={3}
        maxDistance={isDesktop ? 18 : 12}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={Math.PI / 6}
        target={[0, 0.5, 0]}
        autoRotate
        autoRotateSpeed={isDesktop ? 0.15 : 0.25}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
