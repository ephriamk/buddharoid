import { useState, useRef, useCallback } from 'react';
import { JOURNEYS } from '../config/journeys';

export function useJourney() {
  const [activeJourney, setActiveJourney] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const scheduleNext = useCallback((journey, stepIndex) => {
    clearTimer();
    const step = journey.steps[stepIndex];
    if (!step) return;

    timerRef.current = setTimeout(() => {
      const nextIndex = stepIndex + 1;
      if (nextIndex < journey.steps.length) {
        setCurrentStep(nextIndex);
        scheduleNext(journey, nextIndex);
      } else {
        // Journey complete
        setIsPlaying(false);
        setActiveJourney(null);
        setCurrentStep(0);
      }
    }, step.duration);
  }, []);

  const startJourney = useCallback((journeyId) => {
    const journey = JOURNEYS.find(j => j.id === journeyId);
    if (!journey) return;
    setActiveJourney(journey);
    setCurrentStep(0);
    setIsPlaying(true);
    scheduleNext(journey, 0);
  }, [scheduleNext]);

  const nextStep = useCallback(() => {
    if (!activeJourney) return;
    clearTimer();
    const next = currentStep + 1;
    if (next < activeJourney.steps.length) {
      setCurrentStep(next);
      scheduleNext(activeJourney, next);
    } else {
      setIsPlaying(false);
      setActiveJourney(null);
      setCurrentStep(0);
    }
  }, [activeJourney, currentStep, scheduleNext]);

  const previousStep = useCallback(() => {
    if (!activeJourney || currentStep === 0) return;
    clearTimer();
    const prev = currentStep - 1;
    setCurrentStep(prev);
    scheduleNext(activeJourney, prev);
  }, [activeJourney, currentStep, scheduleNext]);

  const skipJourney = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
    setActiveJourney(null);
    setCurrentStep(0);
  }, []);

  const pauseJourney = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
  }, []);

  const resumeJourney = useCallback(() => {
    if (!activeJourney) return;
    setIsPlaying(true);
    scheduleNext(activeJourney, currentStep);
  }, [activeJourney, currentStep, scheduleNext]);

  const step = activeJourney?.steps[currentStep] || null;

  return {
    activeJourney,
    currentStep,
    isPlaying,
    step,
    totalSteps: activeJourney?.steps.length || 0,
    cameraTarget: step?.camera || null,
    moodOverride: step?.moodOverride || null,
    narration: step?.narration || '',
    startJourney,
    nextStep,
    previousStep,
    skipJourney,
    pauseJourney,
    resumeJourney,
    journeys: JOURNEYS,
  };
}
