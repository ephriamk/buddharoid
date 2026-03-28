import { useState, useRef, useCallback } from 'react';

const CYCLE_DURATION = 300000; // 5-minute full cycle in accelerated mode

function getPhase(t) {
  if (t < 0.2 || t > 0.85) return 'night';
  if (t < 0.3) return 'dawn';
  if (t < 0.7) return 'day';
  return 'dusk';
}

function getSunPosition(t) {
  // Sun arc: rises in east, peaks at noon, sets in west
  const angle = (t - 0.25) * Math.PI; // 0.25 = dawn, 0.75 = dusk
  const height = Math.sin(angle) * 15;
  const x = Math.cos(angle) * 10;
  return [x, Math.max(height, -2), -5];
}

export function useDayNightCycle() {
  const [cycleMode, setCycleMode] = useState('accelerated');
  const startTime = useRef(performance.now());

  const getTimeOfDay = useCallback(() => {
    if (cycleMode === 'real') {
      const now = new Date();
      return (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400;
    }
    // Accelerated: 5-minute cycle
    const elapsed = performance.now() - startTime.current;
    return (elapsed % CYCLE_DURATION) / CYCLE_DURATION;
  }, [cycleMode]);

  // Called each frame from a useFrame or computed on render
  const timeOfDay = getTimeOfDay();
  const phase = getPhase(timeOfDay);
  const sunPosition = getSunPosition(timeOfDay);

  return {
    timeOfDay,
    phase,
    sunPosition,
    getTimeOfDay,
    cycleMode,
    setCycleMode,
  };
}
