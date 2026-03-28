import { useState } from 'react';

export default function SettingsModal({
  isSetup,
  settings,
  onSave,
  onClose,
  onClearKeys,
}) {
  const [anthropicKey, setAnthropicKey] = useState(settings.anthropicKey || '');
  const [openaiKey, setOpenaiKey] = useState(settings.openaiKey || '');
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [error, setError] = useState('');

  const handleSkip = () => {
    onSave('', '');
  };

  const handleSave = () => {
    if (anthropicKey.trim() && !anthropicKey.startsWith('sk-ant-')) {
      setError('Anthropic API keys start with "sk-ant-". Please check your key.');
      return;
    }
    if (openaiKey.trim() && !openaiKey.startsWith('sk-')) {
      setError('OpenAI API keys start with "sk-". Please check your key.');
      return;
    }
    setError('');
    onSave(anthropicKey.trim(), openaiKey.trim());
  };

  const maskKey = (key) => {
    if (!key || key.length < 12) return key;
    return key.slice(0, 7) + '...' + key.slice(-4);
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        {/* Header */}
        <div className="settings-header">
          <div className="settings-logo">☸️</div>
          <h2>{isSetup ? 'Welcome to Buddharoid' : 'API Key Settings'}</h2>
          {isSetup ? (
            <p className="settings-subtitle">
              Enter your API key to begin your spiritual journey.
              Your keys are stored locally in your browser — never sent to our server.
            </p>
          ) : (
            <p className="settings-subtitle">
              Manage your API keys. Keys are stored only in your browser.
            </p>
          )}
        </div>

        {/* Security Notice */}
        <div className="settings-security">
          <span className="security-icon">🔒</span>
          <span>Keys are stored in localStorage and sent directly to the AI provider. They never touch our server's disk.</span>
        </div>

        {/* API Key Inputs */}
        <div className="settings-fields">
          <div className="key-field">
            <label>
              <span className="key-provider">Claude</span>
              <span className="key-label">Anthropic API Key</span>
            </label>
            <div className="key-input-wrapper">
              <input
                type={showAnthropicKey ? 'text' : 'password'}
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                spellCheck={false}
                autoComplete="off"
              />
              <button
                className="key-toggle"
                onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                type="button"
              >
                {showAnthropicKey ? '🙈' : '👁'}
              </button>
            </div>
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="key-help-link"
            >
              Get an Anthropic API key →
            </a>
          </div>

          <div className="key-divider">
            <span>or</span>
          </div>

          <div className="key-field">
            <label>
              <span className="key-provider">GPT-4o</span>
              <span className="key-label">OpenAI API Key</span>
            </label>
            <div className="key-input-wrapper">
              <input
                type={showOpenaiKey ? 'text' : 'password'}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-proj-..."
                spellCheck={false}
                autoComplete="off"
              />
              <button
                className="key-toggle"
                onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                type="button"
              >
                {showOpenaiKey ? '🙈' : '👁'}
              </button>
            </div>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="key-help-link"
            >
              Get an OpenAI API key →
            </a>
          </div>
        </div>

        {error && <div className="settings-error">{error}</div>}

        {/* Actions */}
        <div className="settings-actions">
          <button className="settings-save-btn" onClick={handleSave}>
            {isSetup ? 'Begin Journey' : 'Save Keys'}
          </button>
          {isSetup ? (
            <button className="settings-cancel-btn" onClick={handleSkip}>
              Skip — Explore Temple
            </button>
          ) : (
            <>
              <button className="settings-cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button className="settings-clear-btn" onClick={onClearKeys}>
                Clear All Keys
              </button>
            </>
          )}
        </div>

        {isSetup && (
          <p className="settings-footer">
            API keys enable AI chat. You can explore the temple, journeys, and ambient features without one.
          </p>
        )}
      </div>
    </div>
  );
}
