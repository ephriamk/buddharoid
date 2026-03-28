import { JOURNEYS } from '../config/journeys';

export default function JourneyPanel({
  activeJourney,
  currentStep,
  totalSteps,
  narration,
  isPlaying,
  onStart,
  onNext,
  onPrevious,
  onSkip,
  onPause,
  onResume,
  onClose,
}) {
  // Selector mode
  if (!activeJourney) {
    return (
      <div className="journey-selector">
        <div className="journey-selector-header">
          <h3>Guided Journeys</h3>
          <button className="journey-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="journey-list">
          {JOURNEYS.map((j) => (
            <button key={j.id} className="journey-item" onClick={() => onStart(j.id)}>
              <span className="journey-item-icon">{j.icon}</span>
              <div>
                <div className="journey-item-name">{j.name}</div>
                <div className="journey-item-desc">{j.description}</div>
                <div className="journey-item-steps">{j.steps.length} steps</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Progress mode
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="journey-progress">
      <div className="journey-progress-header">
        <span className="journey-progress-icon">{activeJourney.icon}</span>
        <span className="journey-progress-name">{activeJourney.name}</span>
        <span className="journey-progress-count">{currentStep + 1}/{totalSteps}</span>
      </div>

      <div className="journey-progress-bar">
        <div className="journey-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="journey-narration">{narration}</p>

      <div className="journey-controls">
        <button
          className="journey-ctrl-btn"
          onClick={onPrevious}
          disabled={currentStep === 0}
        >
          &#9664;
        </button>
        <button className="journey-ctrl-btn" onClick={isPlaying ? onPause : onResume}>
          {isPlaying ? '&#10074;&#10074;' : '&#9654;'}
        </button>
        <button className="journey-ctrl-btn" onClick={onNext}>
          &#9654;&#9654;
        </button>
        <button className="journey-ctrl-btn journey-skip" onClick={onSkip}>
          Exit
        </button>
      </div>
    </div>
  );
}
