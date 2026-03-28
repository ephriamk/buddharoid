export default function VoiceButton({ isListening, onToggle, disabled }) {
  return (
    <button
      type="button"
      className={`voice-btn ${isListening ? 'voice-btn-active' : ''}`}
      onClick={onToggle}
      disabled={disabled}
      title={isListening ? 'Stop listening' : 'Speak to Buddharoid'}
    >
      {isListening ? (
        <>
          <span className="voice-pulse-ring" />
          <span className="voice-icon">&#9724;</span>
        </>
      ) : (
        <span className="voice-icon">&#127908;</span>
      )}
    </button>
  );
}
