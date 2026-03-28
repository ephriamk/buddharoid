import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';

function getPhase(t) {
  if (t < 0.2 || t > 0.85) return 'night';
  if (t < 0.3) return 'dawn';
  if (t < 0.7) return 'day';
  return 'dusk';
}

function getSunPosition(t) {
  const angle = (t - 0.25) * Math.PI;
  const height = Math.sin(angle) * 15;
  const x = Math.cos(angle) * 10;
  return [x, Math.max(height, -2), -5];
}

const PHASE_LIGHTING = {
  night: { ambientColor: '#1a1a3a', ambientIntensity: 0.08, sunIntensity: 0.1, sunColor: '#334466', fogColor: '#0a0a1a', rayleigh: 0.1 },
  dawn:  { ambientColor: '#ffccaa', ambientIntensity: 0.2, sunIntensity: 0.8, sunColor: '#ffaa66', fogColor: '#cc9988', rayleigh: 0.6 },
  day:   { ambientColor: '#ffe8cc', ambientIntensity: 0.3, sunIntensity: 1.5, sunColor: '#fff0d0', fogColor: '#c9b8a0', rayleigh: 0.4 },
  dusk:  { ambientColor: '#dd8866', ambientIntensity: 0.18, sunIntensity: 0.7, sunColor: '#ff7744', fogColor: '#aa7766', rayleigh: 0.8 },
};

export default function DayNightSky({ getTimeOfDay }) {
  const sunLightRef = useRef();
  const ambientRef = useRef();
  const fogRef = useRef();
  const skyRef = useRef();
  const sunPosRef = useRef([8, 3, -5]);

  useFrame(() => {
    const t = getTimeOfDay();
    const phase = getPhase(t);
    const config = PHASE_LIGHTING[phase];
    const sunPos = getSunPosition(t);
    sunPosRef.current = sunPos;

    // Lerp ambient light
    if (ambientRef.current) {
      ambientRef.current.color.lerp(new THREE.Color(config.ambientColor), 0.01);
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, config.ambientIntensity, 0.01);
    }

    // Lerp sun light
    if (sunLightRef.current) {
      sunLightRef.current.position.set(...sunPos);
      sunLightRef.current.color.lerp(new THREE.Color(config.sunColor), 0.01);
      sunLightRef.current.intensity = THREE.MathUtils.lerp(sunLightRef.current.intensity, config.sunIntensity, 0.01);
    }

    // Lerp fog
    if (fogRef.current) {
      fogRef.current.color.lerp(new THREE.Color(config.fogColor), 0.01);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.25} color="#ffe8cc" />

      <directionalLight
        ref={sunLightRef}
        position={[8, 12, 5]}
        intensity={1.5}
        color="#fff0d0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />

      <fog ref={fogRef} attach="fog" args={['#c9b8a0', 20, 55]} />

      <Sky
        ref={skyRef}
        distance={450000}
        sunPosition={sunPosRef.current}
        rayleigh={0.4}
        turbidity={8}
      />
    </>
  );
}
