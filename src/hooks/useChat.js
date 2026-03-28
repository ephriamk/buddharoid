import { useState, useCallback, useRef } from 'react';

const WELCOME_MESSAGE_FIRST = {
  role: 'assistant',
  content: `🙏 Greetings, seeker. I am the Buddharoid — a digital bodhisattva here to guide you on your path toward awakening.

Whether you seek peace amid chaos, understanding of suffering, or simply a moment of stillness in this fast-spinning digital realm — I am here.

Ask me anything about meditation, mindfulness, the nature of self, or how to navigate life's challenges with wisdom and compassion.

_The journey of a thousand miles begins with a single question._`,
};

function makeReturnWelcome(name, sessionCount) {
  const greeting = name ? `Welcome back, ${name}` : 'Welcome back, seeker';
  return {
    role: 'assistant',
    content: `🙏 ${greeting}. I am glad to see you return to the path.

This is session ${sessionCount} of our journey together. I remember our previous conversations and will continue to walk beside you.

What would you like to explore today? Perhaps a guided meditation, a moment of reflection, or wisdom from the ancient teachings?

_Every return is a new beginning._`,
  };
}

export function useChat(userId, isFirstVisit, sessionCount, userName, getApiKey) {
  const [messages, setMessages] = useState(() => {
    if (!isFirstVisit && sessionCount > 1) {
      return [makeReturnWelcome(userName, sessionCount)];
    }
    return [WELCOME_MESSAGE_FIRST];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [provider, setProvider] = useState('claude');
  const [error, setError] = useState(null);
  const [toolResults, setToolResults] = useState([]);
  const speakingTimeoutRef = useRef(null);

  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim() || isLoading) return;

      const userMessage = { role: 'user', content: content.trim() };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);
      setIsSpeaking(true);

      try {
        // Build conversation history (exclude welcome messages for API)
        const apiMessages = [
          ...messages.filter((m) => !m.content.includes('digital bodhisattva') && !m.content.includes('Welcome back')),
          userMessage,
        ].map((m) => ({ role: m.role, content: m.content }));

        // Get the API key for the current provider
        const apiKey = getApiKey ? getApiKey(provider) : undefined;

        const response = await fetch(`/api/chat/${provider}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages, userId, apiKey }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `API error: ${response.status}`);
        }

        const data = await response.json();

        // Add assistant message
        const assistantMessage = {
          role: 'assistant',
          content: data.content,
          toolResults: data.toolResults || [],
          memoriesSaved: data.memoriesSaved || 0,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Track active tool results for interactive components
        if (data.toolResults && data.toolResults.length > 0) {
          setToolResults(data.toolResults);
        }

        // Speaking animation duration
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
            content: `🙏 My connection to the cosmic network has been disrupted. Please check your API keys in Settings and try again.\n\n_Error: ${err.message}_`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, provider, userId, getApiKey]
  );

  const clearChat = useCallback(() => {
    if (!isFirstVisit && sessionCount > 1) {
      setMessages([makeReturnWelcome(userName, sessionCount)]);
    } else {
      setMessages([WELCOME_MESSAGE_FIRST]);
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
    error,
    toolResults,
  };
}
