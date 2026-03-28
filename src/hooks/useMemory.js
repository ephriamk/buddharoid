import { useState, useEffect, useCallback } from 'react';

function generateUserId() {
  return 'user_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function useMemory() {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // Initialize userId from localStorage
  useEffect(() => {
    let storedId = localStorage.getItem('buddharoid_userId');
    if (!storedId) {
      storedId = generateUserId();
      localStorage.setItem('buddharoid_userId', storedId);
      setIsFirstVisit(true);
    } else {
      setIsFirstVisit(false);
    }
    setUserId(storedId);

    // Record session and fetch user data
    fetch(`/api/memory/${storedId}/session`, { method: 'POST' })
      .then((r) => r.json())
      .then((data) => setUserData(data))
      .catch(console.error);
  }, []);

  const refreshUserData = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/memory/${userId}`);
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  }, [userId]);

  const clearMemories = useCallback(async () => {
    if (!userId) return;
    try {
      await fetch(`/api/memory/${userId}`, { method: 'DELETE' });
      // Generate new user ID
      const newId = generateUserId();
      localStorage.setItem('buddharoid_userId', newId);
      setUserId(newId);
      setUserData(null);
      setIsFirstVisit(true);
      // Record new session
      const res = await fetch(`/api/memory/${newId}/session`, { method: 'POST' });
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error('Failed to clear memories:', err);
    }
  }, [userId]);

  const saveJournalEntry = useCallback(
    async (prompt, response) => {
      if (!userId) return;
      try {
        await fetch(`/api/memory/${userId}/journal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, response }),
        });
        await refreshUserData();
      } catch (err) {
        console.error('Failed to save journal entry:', err);
      }
    },
    [userId, refreshUserData]
  );

  return {
    userId,
    userData,
    isFirstVisit,
    refreshUserData,
    clearMemories,
    saveJournalEntry,
    memoryCount: userData?.memories?.length || 0,
    sessionCount: userData?.sessionCount || 0,
    userName: userData?.profile?.name || null,
  };
}
