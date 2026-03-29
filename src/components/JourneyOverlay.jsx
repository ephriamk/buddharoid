export default function JourneyOverlay({ narration, journeyName, step, totalSteps }) {
  if (!narration) return null;

  return (
    <div className="journey-overlay">
      <div className="journey-letterbox journey-letterbox-top" />
      <div className="journey-overlay-content">
        <p className="journey-overlay-text">{narration}</p>
        <span className="journey-overlay-meta">{journeyName} — {step + 1}/{totalSteps}</span>
      </div>
      <div className="journey-letterbox journey-letterbox-bottom" />
    </div>
  );
}
