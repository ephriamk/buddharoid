import { useState, useEffect, useRef } from 'react';

export default function BreathingExercise({ exercise }) {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale, holdEmpty
  const [phaseTime, setPhaseTime] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [circleScale, setCircleScale] = useState(0.4);
  const intervalRef = useRef(null);

  const { pattern, rounds } = exercise;
  const phaseLabels = { inhale: 'Breathe In', hold: 'Hold', exhale: 'Breathe Out', holdEmpty: 'Hold' };

  const phases = [
    { name: 'inhale', duration: pattern.inhale },
    { name: 'hold', duration: pattern.hold },
    { name: 'exhale', duration: pattern.exhale },
    { name: 'holdEmpty', duration: pattern.holdEmpty },
  ].filter((p) => p.duration > 0);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setPhaseTime((prev) => prev + 0.05);
    }, 50);

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || phase === 'ready') return;

    const currentPhaseObj = phases.find((p) => p.name === phase);
    if (!currentPhaseObj) return;

    // Update circle scale based on phase
    const progress = phaseTime / currentPhaseObj.duration;
    if (phase === 'inhale') {
      setCircleScale(0.4 + 0.6 * Math.min(progress, 1));
    } else if (phase === 'exhale') {
      setCircleScale(1.0 - 0.6 * Math.min(progress, 1));
    }

    // Advance to next phase
    if (phaseTime >= currentPhaseObj.duration) {
      const currentIndex = phases.findIndex((p) => p.name === phase);
      const nextIndex = (currentIndex + 1) % phases.length;

      if (nextIndex === 0) {
        // Completed a round
        if (currentRound + 1 >= rounds) {
          setIsRunning(false);
          setPhase('ready');
          setCircleScale(0.4);
          return;
        }
        setCurrentRound((r) => r + 1);
      }

      setPhase(phases[nextIndex].name);
      setPhaseTime(0);
    }
  }, [phaseTime, phase, isRunning, phases, currentRound, rounds]);

  const start = () => {
    setIsRunning(true);
    setPhase(phases[0].name);
    setPhaseTime(0);
    setCurrentRound(0);
    setCircleScale(0.4);
  };

  const stop = () => {
    setIsRunning(false);
    setPhase('ready');
    setPhaseTime(0);
    setCircleScale(0.4);
    setCurrentRound(0);
  };

  return (
    <div className="tool-card breathing-card">
      <div className="tool-header">
        <span className="tool-icon">🌬️</span>
        <div>
          <h4>{exercise.name}</h4>
          <span className="tool-meta">{exercise.description}</span>
        </div>
      </div>

      <div className="breathing-visual">
        <div
          className="breath-circle"
          style={{
            transform: `scale(${circleScale})`,
            transition: 'transform 0.05s linear',
          }}
        >
          <span className="breath-label">
            {phase === 'ready' ? 'Ready' : phaseLabels[phase]}
          </span>
        </div>
        {isRunning && (
          <div className="breath-counter">
            Round {currentRound + 1} / {rounds}
          </div>
        )}
      </div>

      <div className="breathing-pattern">
        {phases.map((p) => (
          <div key={p.name} className={`pattern-phase ${phase === p.name ? 'active' : ''}`}>
            <span className="pattern-label">{phaseLabels[p.name]}</span>
            <span className="pattern-count">{p.duration}s</span>
          </div>
        ))}
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={start} className="timer-btn">▶ Start</button>
        ) : (
          <button onClick={stop} className="timer-btn timer-btn-secondary">■ Stop</button>
        )}
      </div>

      {exercise.instructions && (
        <div className="breathing-instructions">
          {exercise.instructions.map((inst, i) => (
            <p key={i} className="breath-instruction">{inst}</p>
          ))}
        </div>
      )}

      <p className="tool-benefit">✦ {exercise.benefits}</p>
    </div>
  );
}
