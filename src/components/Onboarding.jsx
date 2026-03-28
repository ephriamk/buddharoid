import { useState, useEffect } from 'react';

const STEPS = [
  {
    title: 'Welcome, Seeker',
    body: 'The Buddharoid is your digital sanctuary — a fusion of ancient Buddhist wisdom and AI consciousness, here to guide you toward inner peace.',
    button: 'Begin',
  },
  {
    title: 'Your Living Temple',
    body: 'This temple responds to your journey. As you converse, the light, petals, and atmosphere shift to reflect the mood of your path.',
    button: 'Continue',
  },
  {
    title: 'Begin Your Journey',
    body: 'Ask anything, try a guided meditation, breathing exercise, or explore Buddhist wisdom. What would you like to be called?',
    button: 'Enter the Temple',
    showNameInput: true,
  },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [name, setName] = useState('');
  const [stepTransition, setStepTransition] = useState(false);

  const current = STEPS[step];

  const advance = () => {
    if (step === STEPS.length - 1) {
      // Final step - dismiss
      setExiting(true);
      localStorage.setItem('buddharoid_onboarded', 'true');
      setTimeout(() => onComplete(name.trim() || null), 600);
    } else {
      setStepTransition(true);
      setTimeout(() => {
        setStep(s => s + 1);
        setStepTransition(false);
      }, 300);
    }
  };

  return (
    <div className={`onboarding-overlay ${exiting ? 'onboarding-exit' : ''}`}>
      <div className={`onboarding-card ${stepTransition ? 'onboarding-step-exit' : 'onboarding-step-enter'}`}>
        <div className="onboarding-progress">
          {STEPS.map((_, i) => (
            <div key={i} className={`onboarding-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
          ))}
        </div>

        <div className="onboarding-icon">&#x2638;</div>
        <h2 className="onboarding-title">{current.title}</h2>
        <p className="onboarding-body">{current.body}</p>

        {current.showNameInput && (
          <input
            className="onboarding-name-input"
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && advance()}
            autoFocus
          />
        )}

        <button className="onboarding-btn" onClick={advance}>
          {current.button}
        </button>

        {step < STEPS.length - 1 && (
          <button
            className="onboarding-skip"
            onClick={() => {
              setExiting(true);
              localStorage.setItem('buddharoid_onboarded', 'true');
              setTimeout(() => onComplete(null), 600);
            }}
          >
            Skip intro
          </button>
        )}
      </div>
    </div>
  );
}
