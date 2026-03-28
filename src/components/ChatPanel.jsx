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
}) {
  const [input, setInput] = useState('');
  const [showMemoryMenu, setShowMemoryMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
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
              className={`provider-btn ${provider === 'claude' ? 'active' : ''}`}
              onClick={() => setProvider('claude')}
            >
              Claude
            </button>
            <button
              className={`provider-btn ${provider === 'openai' ? 'active' : ''}`}
              onClick={() => setProvider('openai')}
            >
              GPT-4
            </button>
          </div>

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
        <button onClick={() => sendMessage('Guide me through a meditation')} disabled={isLoading}>🧘 Meditate</button>
        <button onClick={() => sendMessage('Give me a breathing exercise')} disabled={isLoading}>🌬️ Breathe</button>
        <button onClick={() => sendMessage('Share some Buddhist wisdom with me')} disabled={isLoading}>📿 Wisdom</button>
        <button onClick={() => sendMessage('Give me a journal prompt for reflection')} disabled={isLoading}>📝 Journal</button>
      </div>

      {/* Input */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask the Buddharoid for guidance..."
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="send-btn"
        >
          {isLoading ? '◎' : '➤'}
        </button>
      </form>
    </div>
  );
}
