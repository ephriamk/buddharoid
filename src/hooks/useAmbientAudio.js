import { useState, useRef, useCallback, useEffect } from 'react';

const AUDIO_FILES = {
  wind: { src: '/audio/wind-loop.mp3', loop: true, volume: 0.15 },
  birds: { src: '/audio/birds-loop.mp3', loop: true, volume: 0.12 },
  water: { src: '/audio/water-loop.mp3', loop: true, volume: 0.08 },
  crickets: { src: '/audio/crickets-loop.mp3', loop: true, volume: 0.1 },
};

export function useAmbientAudio() {
  const [audioEnabled, setAudioEnabled] = useState(() => {
    return localStorage.getItem('buddharoid_audio') === 'true';
  });
  const audioRefs = useRef({});
  const initialized = useRef(false);
  const chimeTimerRef = useRef(null);

  const initAudio = useCallback(() => {
    if (initialized.current) return;
    initialized.current = true;

    for (const [key, config] of Object.entries(AUDIO_FILES)) {
      const audio = new Audio(config.src);
      audio.loop = config.loop;
      audio.volume = config.volume;
      audio.preload = 'none';
      audioRefs.current[key] = audio;
    }

    // One-shot sounds
    audioRefs.current.chime = new Audio('/audio/chime.mp3');
    audioRefs.current.chime.volume = 0.2;
    audioRefs.current.bell = new Audio('/audio/bell.mp3');
    audioRefs.current.bell.volume = 0.15;
  }, []);

  const playLoop = useCallback((key) => {
    const audio = audioRefs.current[key];
    if (audio && audio.paused) {
      audio.play().catch(() => {});
    }
  }, []);

  const stopLoop = useCallback((key) => {
    const audio = audioRefs.current[key];
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const playOneShot = useCallback((key) => {
    const audio = audioRefs.current[key];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, []);

  // Update audio based on phase
  const updateForPhase = useCallback((phase) => {
    if (!audioEnabled || !initialized.current) return;

    // Always play wind and water
    playLoop('wind');
    playLoop('water');

    if (phase === 'day' || phase === 'dawn') {
      playLoop('birds');
      stopLoop('crickets');
    } else {
      stopLoop('birds');
      playLoop('crickets');
    }
  }, [audioEnabled, playLoop, stopLoop]);

  // Schedule random chimes
  useEffect(() => {
    if (!audioEnabled) return;

    const scheduleChime = () => {
      const delay = 20000 + Math.random() * 40000; // 20-60s
      chimeTimerRef.current = setTimeout(() => {
        if (audioEnabled && initialized.current) {
          playOneShot('chime');
        }
        scheduleChime();
      }, delay);
    };

    scheduleChime();
    return () => {
      if (chimeTimerRef.current) clearTimeout(chimeTimerRef.current);
    };
  }, [audioEnabled, playOneShot]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => {
      const next = !prev;
      localStorage.setItem('buddharoid_audio', String(next));

      if (next) {
        initAudio();
      } else {
        // Stop all
        for (const audio of Object.values(audioRefs.current)) {
          if (audio && !audio.paused) {
            audio.pause();
            audio.currentTime = 0;
          }
        }
      }
      return next;
    });
  }, [initAudio]);

  // Init on first enable
  useEffect(() => {
    if (audioEnabled) {
      initAudio();
    }
  }, [audioEnabled, initAudio]);

  return {
    audioEnabled,
    toggleAudio,
    updateForPhase,
    playOneShot,
  };
}
