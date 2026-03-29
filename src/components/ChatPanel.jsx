import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import VoiceButton from './VoiceButton';
import JourneyPanel from './JourneyPanel';

export default function ChatPanel({
  messages,
  isLoading,
  provider,
  setProvider,
  sendMessage,
  clearChat,
  memoryCount,
  sessionCount,
  userName,
  onClearMemories,
  onJournalSave,
  onOpenSettings,
  availableProviders,
  hasAnyKey,
  // Voice props
  voiceSupported,
  isListening,
  transcript,
  voiceEnabled,
  onToggleVoice,
  onToggleVoiceEnabled,
  // Journey props
  journey,
  onStartJourney,
  // Audio props
  audioEnabled,
  onToggleAudio,
}) {
  const [input, setInput] = useState('');
  const [showMemoryMenu, setShowMemoryMenu] = useState(false);
  const [showJourneys, setShowJourneys] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (availableProviders && !availableProviders.includes(provider) && availableProviders.length > 0) {
      setProvider(availableProviders[0]);
    }
  }, [availableProviders, provider, setProvider]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && hasAnyKey) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isProviderAvailable = (p) => availableProviders && availableProviders.includes(p);

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-title">
          <span className="chat-title-icon">&#x2638;&#xFE0F;</span>
          <h2>Buddharoid</h2>
          <span className="chat-subtitle">
            {userName ? `Guide for ${userName}` : 'Digital Bodhisattva'}
          </span>
        </div>
        <div className="chat-controls">
          <div className="provider-toggle">
            <button
              className={`provider-btn ${provider === 'claude' ? 'active' : ''} ${!isProviderAvailable('claude') ? 'disabled' : ''}`}
              onClick={() => isProviderAvailable('claude') && setProvider('claude')}
              title={isProviderAvailable('claude') ? 'Claude (Anthropic)' : 'Add Anthropic API key in Settings'}
            >
              Claude
            </button>
            <button
              className={`provider-btn ${provider === 'openai' ? 'active' : ''} ${!isProviderAvailable('openai') ? 'disabled' : ''}`}
              onClick={() => isProviderAvailable('openai') && setProvider('openai')}
              title={isProviderAvailable('openai') ? 'OpenAI' : 'Add OpenAI API key in Settings'}
            >
              OpenAI
            </button>
          </div>

          <button className="settings-btn" onClick={onOpenSettings} title="Settings">&#x2699;</button>

          {/* Audio toggle */}
          <button
            className={`settings-btn ${audioEnabled ? 'audio-active' : ''}`}
            onClick={onToggleAudio}
            title={audioEnabled ? 'Mute ambient sounds' : 'Enable ambient sounds'}
          >
            {audioEnabled ? '\u{1F50A}' : '\u{1F507}'}
          </button>

          {/* Voice toggle */}
          {voiceSupported && (
            <button
              className={`settings-btn ${voiceEnabled ? 'voice-enabled' : ''}`}
              onClick={onToggleVoiceEnabled}
              title={voiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}
            >
              {voiceEnabled ? '\u{1F508}' : '\u{1F568}'}
            </button>
          )}

          <div className="memory-indicator">
            <button
              className="memory-btn"
              onClick={() => setShowMemoryMenu(!showMemoryMenu)}
              title={`${memoryCount} memories`}
            >
              &#x1F9E0; {memoryCount}
            </button>
            {showMemoryMenu && (
              <div className="memory-menu">
                <div className="memory-menu-header">Memory</div>
                <div className="memory-menu-stat">Memories: {memoryCount}</div>
                <div className="memory-menu-stat">Sessions: {sessionCount}</div>
                {userName && <div className="memory-menu-stat">Name: {userName}</div>}
                <button className="memory-menu-clear" onClick={() => { onClearMemories(); setShowMemoryMenu(false); }}>
                  Clear All Memories
                </button>
              </div>
            )}
          </div>

          <button className="clear-btn" onClick={clearChat} title="Clear chat">&#x2715;</button>
        </div>
      </div>

      {!hasAnyKey && (
        <div className="no-key-banner" onClick={onOpenSettings}>
          <span>&#x2699; Add your API key in Settings to chat — or explore the temple freely below</span>
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} onJournalSave={onJournalSave} />
        ))}
        {isLoading && (
          <div className="chat-message assistant">
            <div className="message-avatar">&#x1F916;</div>
            <div className="message-content">
              <div className="message-role">Buddharoid</div>
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Journey panel or quick actions */}
      {showJourneys || journey?.activeJourney ? (
        <JourneyPanel
          activeJourney={journey?.activeJourney}
          currentStep={journey?.currentStep}
          totalSteps={journey?.totalSteps}
          narration={journey?.narration}
          isPlaying={journey?.isPlaying}
          onStart={onStartJourney}
          onNext={journey?.nextStep}
          onPrevious={journey?.previousStep}
          onSkip={journey?.skipJourney}
          onPause={journey?.pauseJourney}
          onResume={journey?.resumeJourney}
          onClose={() => setShowJourneys(false)}
        />
      ) : (
        <div className="quick-actions">
          <button onClick={() => setShowJourneys(true)}>&#x1F3EF; Journey</button>
          <button onClick={() => sendMessage('Guide me through a meditation')} disabled={isLoading || !hasAnyKey}>&#x1F9D8; Meditate</button>
          <button onClick={() => sendMessage('Give me a breathing exercise')} disabled={isLoading || !hasAnyKey}>&#x1F32C;&#xFE0F; Breathe</button>
          <button onClick={() => sendMessage('Share some Buddhist wisdom with me')} disabled={isLoading || !hasAnyKey}>&#x1F4FF; Wisdom</button>
          <button onClick={() => sendMessage('Give me a journal prompt for reflection')} disabled={isLoading || !hasAnyKey}>&#x1F4DD; Journal</button>
        </div>
      )}

      {/* Voice transcript overlay */}
      {isListening && transcript && (
        <div className="voice-transcript">
          <span className="voice-transcript-dot" />
          {transcript}
        </div>
      )}

      {/* Input */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={hasAnyKey ? 'Ask the Buddharoid for guidance...' : 'Add an API key to chat, or explore journeys...'}
          rows={1}
          disabled={isLoading || !hasAnyKey}
        />
        {voiceSupported && hasAnyKey && (
          <VoiceButton
            isListening={isListening}
            onToggle={onToggleVoice}
            disabled={isLoading}
          />
        )}
        <button
          type="submit"
          disabled={isLoading || !input.trim() || !hasAnyKey}
          className="send-btn"
        >
          {isLoading ? '\u25CE' : '\u27A4'}
        </button>
      </form>
    </div>
  );
}
