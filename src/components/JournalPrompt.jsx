import { useState } from 'react';

export default function JournalPrompt({ prompt, onSave }) {
  const [entry, setEntry] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!entry.trim()) return;
    if (onSave) {
      onSave(prompt.prompt, entry.trim());
    }
    setSaved(true);
  };

  return (
    <div className="tool-card journal-card">
      <div className="tool-header">
        <span className="tool-icon">📝</span>
        <div>
          <h4>Journal Reflection</h4>
          <span className="tool-meta">Theme: {prompt.theme}</span>
        </div>
      </div>

      <div className="journal-prompt-text">
        <p>"{prompt.prompt}"</p>
      </div>

      {!saved ? (
        <div className="journal-entry">
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Take a moment to reflect and write your thoughts here..."
            rows={5}
            className="journal-textarea"
          />
          <button onClick={handleSave} disabled={!entry.trim()} className="timer-btn">
            Save Reflection
          </button>
        </div>
      ) : (
        <div className="journal-saved">
          <span className="saved-icon">✓</span>
          <p>Your reflection has been saved to your spiritual journal.</p>
        </div>
      )}
    </div>
  );
}
