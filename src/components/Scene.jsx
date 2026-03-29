import { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useProgress } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import BuddharoidModel from './BuddharoidModel';
import ParticleAura from './ParticleAura';
import SpiritualEnvironment from './SpiritualEnvironment';
import CherryBlossoms from './CherryBlossoms';
import IncenseSmoke from './IncenseSmoke';
import DayNightSky from './DayNightSky';
import AmbientParticles from './AmbientParticles';
import KoiFish from './KoiFish';
import JourneyCamera from './JourneyCamera';

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

export default function Scene({
  isSpeaking = false,
  mood = null,
  onProgress,
  paused = false,
  getTimeOfDay,
  phase = 'day',
  journeyCameraTarget = null,
  journeyActive = false,
  onRobotClick,
}) {
  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;
  const controlsRef = useRef();

  return (
    <Canvas
      camera={{ position: [8, 5, 12], fov: 42 }}
      shadows
      frameloop={paused ? 'demand' : 'always'}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#b8a880' }}
    >
      <ProgressReporter onProgress={onProgress || (() => {})} />

      {/* Day/Night cycle: sky, sun, ambient, fog */}
      <DayNightSky getTimeOfDay={getTimeOfDay || (() => 0.45)} />

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

      {/* Journey camera controller */}
      <JourneyCamera target={journeyCameraTarget} controlsRef={controlsRef} />

      <Suspense fallback={<LoadingFallback />}>
        <BuddharoidModel isSpeaking={isSpeaking} mood={mood} onClickGreeting={onRobotClick} />
        <ParticleAura isSpeaking={isSpeaking} mood={mood} />
        <SpiritualEnvironment />
        <CherryBlossoms mood={mood} />
        <IncenseSmoke mood={mood} />
        <AmbientParticles phase={phase} />
        <KoiFish />
        <Environment preset="sunset" backgroundIntensity={0} environmentIntensity={0.3} />
      </Suspense>

      {isDesktop && (
        <EffectComposer>
          <Bloom intensity={0.25} luminanceThreshold={0.9} luminanceSmoothing={0.4} />
          <Vignette eskil={false} offset={0.1} darkness={0.3} />
        </EffectComposer>
      )}

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={isDesktop}
        enabled={!journeyActive}
        minDistance={3}
        maxDistance={isDesktop ? 18 : 12}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={Math.PI / 6}
        target={[0, 0.5, 0]}
        autoRotate={!journeyActive}
        autoRotateSpeed={isDesktop ? 0.15 : 0.25}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
