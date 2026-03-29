import { useState, useCallback, useRef, useEffect } from 'react';

const HISTORY_KEY = 'buddharoid_chat_history';
const MAX_CONVERSATIONS = 5;
const MAX_API_MESSAGES = 8;

const WELCOME_MESSAGE_FIRST = {
  role: 'assistant',
  content: `\u{1F64F} Greetings, seeker. I am the Buddharoid \u2014 a digital bodhisattva here to guide you on your path toward awakening.

Whether you seek peace amid chaos, understanding of suffering, or simply a moment of stillness in this fast-spinning digital realm \u2014 I am here.

Ask me anything about meditation, mindfulness, the nature of self, or how to navigate life's challenges with wisdom and compassion.

_The journey of a thousand miles begins with a single question._`,
  timestamp: Date.now(),
};

function makeReturnWelcome(name, sessionCount) {
  const greeting = name ? `Welcome back, ${name}` : 'Welcome back, seeker';
  return {
    role: 'assistant',
    content: `\u{1F64F} ${greeting}. I am glad to see you return to the path.

This is session ${sessionCount} of our journey together. I remember our previous conversations and will continue to walk beside you.

What would you like to explore today? Perhaps a guided meditation, a moment of reflection, or wisdom from the ancient teachings?

_Every return is a new beginning._`,
    timestamp: Date.now(),
  };
}

// Load conversation history from localStorage
function loadHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveHistory(history) {
  try {
    // Keep only last N conversations, trim message count per conversation
    const trimmed = history.slice(-MAX_CONVERSATIONS).map(conv => ({
      ...conv,
      messages: conv.messages.slice(-50), // Keep last 50 messages per conversation
    }));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {}
}

// Truncate messages for API: keep last N, summarize earlier ones
function truncateForApi(messages) {
  const filtered = messages.filter(
    (m) => !m.content.includes('digital bodhisattva') && !m.content.includes('Welcome back')
  );

  if (filtered.length <= MAX_API_MESSAGES) {
    return filtered.map((m) => ({ role: m.role, content: m.content }));
  }

  // Summarize older messages into context
  const older = filtered.slice(0, -MAX_API_MESSAGES);
  const recent = filtered.slice(-MAX_API_MESSAGES);

  const summary = older
    .map((m) => `${m.role === 'user' ? 'Seeker' : 'Guide'}: ${m.content.slice(0, 100)}`)
    .join('\n');

  return [
    { role: 'user', content: `[Earlier in our conversation:\n${summary}]\n\nPlease continue our discussion.` },
    ...recent.map((m) => ({ role: m.role, content: m.content })),
  ];
}

export function useChat(userId, isFirstVisit, sessionCount, userName, getApiKey) {
  // Try to load last conversation from history
  const [messages, setMessages] = useState(() => {
    const history = loadHistory();
    if (history.length > 0) {
      const lastConv = history[history.length - 1];
      if (lastConv.messages.length > 0) return lastConv.messages;
    }
    if (!isFirstVisit && sessionCount > 1) {
      return [makeReturnWelcome(userName, sessionCount)];
    }
    return [WELCOME_MESSAGE_FIRST];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [provider, setProvider] = useState(() => {
    if (getApiKey) {
      if (getApiKey('claude')) return 'claude';
      if (getApiKey('openai')) return 'openai';
    }
    return 'claude';
  });
  const [error, setError] = useState(null);
  const [toolResults, setToolResults] = useState([]);
  const [conversationHistory, setConversationHistory] = useState(() => loadHistory());
  const speakingTimeoutRef = useRef(null);

  // Cleanup speaking timeout on unmount
  useEffect(() => {
    return () => {
      if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
    };
  }, []);

  // Auto-save conversation to history when messages change
  useEffect(() => {
    if (messages.length <= 1) return; // Don't save just the welcome message
    const history = loadHistory();
    const currentId = history.length > 0 ? history[history.length - 1].id : null;

    // Update current conversation or create new one
    if (currentId && history[history.length - 1].messages.length > 0) {
      history[history.length - 1].messages = messages;
      history[history.length - 1].updatedAt = Date.now();
    } else {
      history.push({
        id: Date.now().toString(),
        messages,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    saveHistory(history);
    setConversationHistory(history);
  }, [messages]);

  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim() || isLoading) return;

      const userMessage = { role: 'user', content: content.trim(), timestamp: Date.now() };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);
      setIsSpeaking(true);

      try {
        let activeProvider = provider;
        if (getApiKey) {
          if (!getApiKey(activeProvider)) {
            if (getApiKey('claude')) { activeProvider = 'claude'; setProvider('claude'); }
            else if (getApiKey('openai')) { activeProvider = 'openai'; setProvider('openai'); }
          }
        }

        // Truncate messages for API (keep last 8, summarize rest)
        const allMessages = [...messages, userMessage];
        const apiMessages = truncateForApi(allMessages);

        const apiKey = getApiKey ? getApiKey(activeProvider) : undefined;

        const response = await fetch(`/api/chat/${activeProvider}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages, userId, apiKey }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `API error: ${response.status}`);
        }

        const data = await response.json();

        const assistantMessage = {
          role: 'assistant',
          content: data.content,
          toolResults: data.toolResults || [],
          memoriesSaved: data.memoriesSaved || 0,
          animation: data.animation || null,
          provider: activeProvider,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (data.toolResults && data.toolResults.length > 0) {
          setToolResults(data.toolResults);
        }

        const speakDuration = Math.min(data.content.length * 20, 8000);
        if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
        speakingTimeoutRef.current = setTimeout(() => {
          setIsSpeaking(false);
        }, speakDuration);
      } catch (err) {
        console.error('Chat error:', err);
        setError(err.message);
        setIsSpeaking(false);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `\u{1F64F} My connection to the cosmic network has been disrupted. Please check your API keys in Settings and try again.\n\n_Error: ${err.message}_`,
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, provider, userId, getApiKey]
  );

  // Start a new conversation
  const newConversation = useCallback(() => {
    const welcome = (!isFirstVisit && sessionCount > 1)
      ? makeReturnWelcome(userName, sessionCount)
      : WELCOME_MESSAGE_FIRST;

    // Save current conversation before starting new one
    const history = loadHistory();
    history.push({
      id: Date.now().toString(),
      messages: [welcome],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    saveHistory(history);
    setConversationHistory(history);

    setMessages([welcome]);
    setError(null);
    setIsSpeaking(false);
    setToolResults([]);
  }, [isFirstVisit, sessionCount, userName]);

  // Load a past conversation
  const loadConversation = useCallback((convId) => {
    const history = loadHistory();
    const conv = history.find(c => c.id === convId);
    if (conv) {
      setMessages(conv.messages);
      setError(null);
      setIsSpeaking(false);
      setToolResults([]);
    }
  }, []);

  const clearChat = useCallback(() => {
    if (!isFirstVisit && sessionCount > 1) {
      setMessages([makeReturnWelcome(userName, sessionCount)]);
    } else {
      setMessages([{ ...WELCOME_MESSAGE_FIRST, timestamp: Date.now() }]);
    }
    setError(null);
    setIsSpeaking(false);
    setToolResults([]);
  }, [isFirstVisit, sessionCount, userName]);

  return {
    messages,
    isLoading,
    isSpeaking,
    provider,
    setProvider,
    sendMessage,
    clearChat,
    newConversation,
    loadConversation,
    conversationHistory,
    error,
    toolResults,
  };
}
