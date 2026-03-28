import { useState, useEffect } from 'react';

const QUOTES = [
  'The mind is everything. What you think, you become.',
  'Peace comes from within. Do not seek it without.',
  'In the stillness, the world resets.',
  'Every moment is a fresh beginning.',
  'The temple awaits your presence.',
];

export default function LoadingScreen({ progress, onFadeComplete }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [quoteIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));

  // Auto-complete if progress hits 100 OR stays stuck for 3s (cached assets)
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setFadeOut(true), 400);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!fadeOut) setFadeOut(true);
    }, 3000);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(() => onFadeComplete(), 700);
      return () => clearTimeout(timer);
    }
  }, [fadeOut, onFadeComplete]);

  return (
    <div className={`loading-screen ${fadeOut ? 'loading-fade-out' : ''}`}>
      {/* Animated mandala rings */}
      <div className="loading-mandala">
        <div className="mandala-ring mandala-ring-1" />
        <div className="mandala-ring mandala-ring-2" />
        <div className="mandala-ring mandala-ring-3" />
        <div className="mandala-lotus">&#x2638;</div>
      </div>

      <h1 className="loading-title">BUDDHAROID</h1>
      <p className="loading-subtitle">Preparing your sanctuary</p>

      <div className="loading-bar-container">
        <div
          className="loading-bar-fill"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="loading-percent">{Math.round(progress)}%</p>

      <p className="loading-quote">{QUOTES[quoteIndex]}</p>
    </div>
  );
}
