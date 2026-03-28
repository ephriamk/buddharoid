import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

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
}) {
  const [input, setInput] = useState('');
  const [showMemoryMenu, setShowMemoryMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-switch to available provider if current one has no key
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
          <span className="chat-title-icon">☸️</span>
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
              title={isProviderAvailable('openai') ? 'GPT-4o (OpenAI)' : 'Add OpenAI API key in Settings'}
            >
              GPT-4
            </button>
          </div>

          {/* Settings button */}
          <button
            className="settings-btn"
            onClick={onOpenSettings}
            title="API Key Settings"
          >
            ⚙
          </button>

          {/* Memory indicator */}
          <div className="memory-indicator">
            <button
              className="memory-btn"
              onClick={() => setShowMemoryMenu(!showMemoryMenu)}
              title={`${memoryCount} memories · Session ${sessionCount}`}
            >
              🧠 {memoryCount}
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

          <button className="clear-btn" onClick={clearChat} title="Clear chat">
            ✕
          </button>
        </div>
      </div>

      {/* No API key banner */}
      {!hasAnyKey && (
        <div className="no-key-banner" onClick={onOpenSettings}>
          <span>⚙ Add your API key in Settings to start chatting</span>
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} onJournalSave={onJournalSave} />
        ))}
        {isLoading && (
          <div className="chat-message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="message-role">Buddharoid</div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button onClick={() => sendMessage('Guide me through a meditation')} disabled={isLoading || !hasAnyKey}>🧘 Meditate</button>
        <button onClick={() => sendMessage('Give me a breathing exercise')} disabled={isLoading || !hasAnyKey}>🌬️ Breathe</button>
        <button onClick={() => sendMessage('Share some Buddhist wisdom with me')} disabled={isLoading || !hasAnyKey}>📿 Wisdom</button>
        <button onClick={() => sendMessage('Give me a journal prompt for reflection')} disabled={isLoading || !hasAnyKey}>📝 Journal</button>
      </div>

      {/* Input */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={hasAnyKey ? 'Ask the Buddharoid for guidance...' : 'Add an API key in Settings to begin...'}
          rows={1}
          disabled={isLoading || !hasAnyKey}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || !hasAnyKey}
          className="send-btn"
        >
          {isLoading ? '◎' : '➤'}
        </button>
      </form>
    </div>
  );
}
