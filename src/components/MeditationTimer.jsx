import { useState, useEffect, useRef } from 'react';

export default function MeditationTimer({ meditation }) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(meditation.duration * 60);
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef(null);

  const totalSeconds = meditation.duration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      setIsRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  // Auto-advance steps
  useEffect(() => {
    if (!isRunning) return;
    const stepInterval = totalSeconds / meditation.steps.length;
    const elapsed = totalSeconds - timeLeft;
    const newStep = Math.min(Math.floor(elapsed / stepInterval), meditation.steps.length - 1);
    setCurrentStep(newStep);
  }, [timeLeft, isRunning, totalSeconds, meditation.steps.length]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(totalSeconds);
    setCurrentStep(0);
  };

  return (
    <div className="tool-card meditation-card">
      <div className="tool-header">
        <span className="tool-icon">🧘</span>
        <div>
          <h4>{meditation.name}</h4>
          <span className="tool-meta">{meditation.level} · {meditation.duration} min · {meditation.technique}</span>
        </div>
      </div>

      <div className="meditation-timer">
        <div className="timer-circle">
          <svg viewBox="0 0 100 100" className="timer-svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,170,0,0.15)" strokeWidth="3" />
            <circle
              cx="50" cy="50" r="45"
              fill="none" stroke="#ffaa00" strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <span className="timer-text">{formatTime(timeLeft)}</span>
        </div>

        <div className="timer-controls">
          <button onClick={() => setIsRunning(!isRunning)} className="timer-btn">
            {isRunning ? '⏸ Pause' : timeLeft < totalSeconds ? '▶ Resume' : '▶ Begin'}
          </button>
          <button onClick={reset} className="timer-btn timer-btn-secondary">↺ Reset</button>
        </div>
      </div>

      <div className="meditation-steps">
        {meditation.steps.map((step, i) => (
          <div key={i} className={`meditation-step ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}>
            <span className="step-number">{i + 1}</span>
            <p>{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
