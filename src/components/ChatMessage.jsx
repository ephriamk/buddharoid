import ToolResult from './ToolResult';

function formatText(text) {
  return text.split('\n').map((line, i, arr) => {
    const parts = [];
    let remaining = line;
    let key = 0;

    while (remaining.includes('_')) {
      const start = remaining.indexOf('_');
      const end = remaining.indexOf('_', start + 1);
      if (end === -1) break;

      if (start > 0) parts.push(<span key={key++}>{remaining.slice(0, start)}</span>);
      parts.push(<em key={key++}>{remaining.slice(start + 1, end)}</em>);
      remaining = remaining.slice(end + 1);
    }
    if (remaining) parts.push(<span key={key++}>{remaining}</span>);

    return (
      <span key={i}>
        {parts.length > 0 ? parts : line}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

export default function ChatMessage({ message, onJournalSave }) {
  const isUser = message.role === 'user';

  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
      <div className={`message-avatar ${isUser ? 'avatar-seeker' : 'avatar-guide'}`}>
        {isUser ? '\u2740' : '\u2638'}
      </div>
      <div className="message-content">
        <div className="message-role">
          {isUser ? 'Seeker' : 'Guide'}
          {!isUser && message.memoriesSaved > 0 && (
            <span className="memory-badge" title={`${message.memoriesSaved} memory saved`}>
              \u2727 {message.memoriesSaved}
            </span>
          )}
        </div>
        <div className="message-text">{formatText(message.content)}</div>

        {message.toolResults && message.toolResults.length > 0 && (
          <div className="tool-results">
            {message.toolResults.map((result, i) => (
              <ToolResult key={i} result={result} onJournalSave={onJournalSave} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
