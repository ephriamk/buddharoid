import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const MEMORIES_DIR = path.join(process.cwd(), 'data', 'memories');

async function ensureDir() {
  await fs.mkdir(MEMORIES_DIR, { recursive: true });
}

function filePath(userId) {
  // Sanitize userId to prevent path traversal
  const safe = userId.replace(/[^a-zA-Z0-9_-]/g, '');
  return path.join(MEMORIES_DIR, `${safe}.json`);
}

function createEmptyUser(userId) {
  return {
    userId,
    created: new Date().toISOString(),
    profile: {
      name: null,
      spiritualPath: null,
      experienceLevel: null,
      interests: [],
      challenges: [],
    },
    memories: [],
    journalEntries: [],
    sessionCount: 0,
    lastSeen: new Date().toISOString(),
  };
}

export async function getUser(userId) {
  await ensureDir();
  try {
    const data = await fs.readFile(filePath(userId), 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function getOrCreateUser(userId) {
  let user = await getUser(userId);
  if (!user) {
    user = createEmptyUser(userId);
    await saveUser(user);
  }
  return user;
}

export async function saveUser(user) {
  await ensureDir();
  await fs.writeFile(filePath(user.userId), JSON.stringify(user, null, 2));
  return user;
}

export async function recordSession(userId) {
  const user = await getOrCreateUser(userId);
  user.sessionCount += 1;
  user.lastSeen = new Date().toISOString();
  await saveUser(user);
  return user;
}

export async function addMemory(userId, type, content) {
  const user = await getOrCreateUser(userId);
  const memory = {
    id: crypto.randomUUID(),
    type, // insight, preference, milestone, context
    content,
    timestamp: new Date().toISOString(),
  };
  user.memories.push(memory);
  // Keep last 50 memories to avoid unbounded growth
  if (user.memories.length > 50) {
    user.memories = user.memories.slice(-50);
  }
  await saveUser(user);
  return memory;
}

export async function removeMemory(userId, memoryId) {
  const user = await getOrCreateUser(userId);
  user.memories = user.memories.filter((m) => m.id !== memoryId);
  await saveUser(user);
  return user;
}

export async function updateProfile(userId, updates) {
  const user = await getOrCreateUser(userId);
  Object.assign(user.profile, updates);
  await saveUser(user);
  return user;
}

export async function addJournalEntry(userId, prompt, response) {
  const user = await getOrCreateUser(userId);
  user.journalEntries.push({
    id: crypto.randomUUID(),
    prompt,
    response,
    timestamp: new Date().toISOString(),
  });
  // Keep last 30 journal entries
  if (user.journalEntries.length > 30) {
    user.journalEntries = user.journalEntries.slice(-30);
  }
  await saveUser(user);
  return user;
}

// Build a context string from user memories for injection into system prompt
export function buildMemoryContext(user) {
  if (!user) return '';

  const parts = ['## User Context (from memory)'];

  if (user.profile.name) parts.push(`- Name: ${user.profile.name}`);
  if (user.profile.spiritualPath) parts.push(`- Spiritual path: ${user.profile.spiritualPath}`);
  if (user.profile.experienceLevel) parts.push(`- Experience level: ${user.profile.experienceLevel}`);
  if (user.profile.interests.length > 0) parts.push(`- Interests: ${user.profile.interests.join(', ')}`);
  if (user.profile.challenges.length > 0) parts.push(`- Challenges: ${user.profile.challenges.join(', ')}`);

  parts.push(`- Session count: ${user.sessionCount}`);
  if (user.lastSeen) {
    const daysSince = Math.floor((Date.now() - new Date(user.lastSeen).getTime()) / 86400000);
    if (daysSince > 0) parts.push(`- Last seen: ${daysSince} day(s) ago`);
  }

  // Add recent memories (last 10)
  const recentMemories = user.memories.slice(-10);
  if (recentMemories.length > 0) {
    parts.push('\n### Remembered about this seeker:');
    recentMemories.forEach((m) => {
      parts.push(`- [${m.type}] ${m.content}`);
    });
  }

  // Add recent journal themes
  const recentJournal = user.journalEntries.slice(-3);
  if (recentJournal.length > 0) {
    parts.push('\n### Recent journal reflections:');
    recentJournal.forEach((j) => {
      parts.push(`- Prompt: "${j.prompt}" (${new Date(j.timestamp).toLocaleDateString()})`);
    });
  }

  return parts.join('\n');
}

// Parse <memory> tags from AI response
export function parseMemoryTags(text) {
  const memoryRegex = /<memory\s+type="([^"]+)">([\s\S]*?)<\/memory>/g;
  const memories = [];
  let match;
  while ((match = memoryRegex.exec(text)) !== null) {
    memories.push({ type: match[1], content: match[2].trim() });
  }
  // Strip memory tags from displayed text
  const cleanText = text.replace(/<memory\s+type="[^"]*">[\s\S]*?<\/memory>/g, '').trim();
  return { memories, cleanText };
}

// Parse <tool> tags from AI response
export function parseToolTags(text) {
  const toolRegex = /<tool\s+name="([^"]+)">([\s\S]*?)<\/tool>/g;
  const tools = [];
  let match;
  while ((match = toolRegex.exec(text)) !== null) {
    try {
      tools.push({ name: match[1], params: JSON.parse(match[2].trim()) });
    } catch {
      tools.push({ name: match[1], params: { raw: match[2].trim() } });
    }
  }
  const cleanText = text.replace(/<tool\s+name="[^"]*">[\s\S]*?<\/tool>/g, '').trim();
  return { tools, cleanText };
}
