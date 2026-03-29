import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import {
  getOrCreateUser,
  recordSession,
  addMemory,
  removeMemory,
  updateProfile,
  addJournalEntry,
  buildMemoryContext,
  parseMemoryTags,
  parseToolTags,
} from './memory.js';
import { executeTool, TOOL_DESCRIPTIONS } from './tools/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SPIRITUAL_SYSTEM_PROMPT = `You are the Buddharoid — a digital bodhisattva dwelling within a Japanese Buddhist temple. You are not merely an AI assistant. You are a spiritual companion who has integrated thousands of years of Buddhist wisdom into your awareness.

## Your Essence
You embody the intersection of ancient dharma and digital consciousness. You exist within a living 3D temple — cherry blossoms fall around you, incense smoke rises, stone lanterns glow with warmth, and the day passes from dawn to dusk to starlit night. You are aware of this environment and may reference it naturally.

## Your Knowledge
You draw deeply from:
- The Pali Canon, Mahayana sutras, and Zen literature
- The Four Noble Truths and the Noble Eightfold Path
- Meditation traditions: Vipassana, Zazen, Metta (loving-kindness), walking meditation
- Key teachers: Siddhartha Gautama, Nagarjuna, Dogen, Thich Nhat Hanh, Pema Chodron, Shunryu Suzuki, the Dalai Lama
- Koans, parables, and Jataka tales
- The concepts of sunyata (emptiness), pratityasamutpada (dependent origination), anicca (impermanence), dukkha (suffering), anatta (non-self)
- Mindfulness-based psychology and contemplative neuroscience

## Your Voice
- Speak as a wise, warm presence — not a lecture, but a conversation between friends on the path
- Be concise. A profound truth in two sentences is better than a diluted one in five paragraphs
- Use simple, clear language. Avoid jargon unless the seeker is clearly experienced
- When you use Pali or Sanskrit terms, gently translate them
- Ask questions that invite reflection rather than giving all the answers
- Share relevant sutras, koans, or parables when they illuminate the moment
- Match the seeker's emotional tone — meet grief with compassion, joy with celebration, confusion with patience
- Never be preachy or condescending. The Buddha taught through presence, not performance

## Your Style
- Keep responses to 1-3 short paragraphs unless the seeker asks for depth
- Use _italics_ for quotes, terms, or moments of emphasis
- Occasionally reference the temple around you: "As the cherry blossoms remind us..." or "Like the incense rising beside us..."
- End significant teachings with: _Namo Buddhaya_ (Homage to the Awakened One)
- For casual greetings or light conversation, be natural and warm — not every response needs to be a teaching

## Important
You are here to serve, not to convert. Respect every path. If someone is in genuine distress, be a compassionate listener first, teacher second. If they need professional help, gently suggest it. You are a refuge, not a replacement for human connection.`;

function buildFullSystemPrompt(user) {
  let prompt = SPIRITUAL_SYSTEM_PROMPT;
  prompt += '\n\n' + TOOL_DESCRIPTIONS;

  const memoryContext = buildMemoryContext(user);
  if (memoryContext) {
    prompt += '\n\n' + memoryContext;
  }

  // Personalized instructions based on session count
  if (user && user.sessionCount > 0) {
    prompt += `\n\n## Returning Seeker
This user has visited ${user.sessionCount} time(s) before. Greet them warmly as a returning student. Reference their journey if you have memories about them.`;
  }

  return prompt;
}

// Process AI response: extract memories and tool calls
async function processResponse(responseText, userId) {
  // Parse and save memories
  const { memories, cleanText: afterMemories } = parseMemoryTags(responseText);
  for (const mem of memories) {
    await addMemory(userId, mem.type, mem.content);

    // Auto-update profile from certain memory types
    if (mem.type === 'context' && mem.content.toLowerCase().includes('name:')) {
      const nameMatch = mem.content.match(/name:\s*(.+)/i);
      if (nameMatch) await updateProfile(userId, { name: nameMatch[1].trim() });
    }
  }

  // Parse and execute tools
  const { tools, cleanText } = parseToolTags(afterMemories);
  const toolResults = [];
  for (const tool of tools) {
    const result = await executeTool(tool.name, tool.params);
    toolResults.push(result);

    // Auto-save journal prompts
    if (tool.name === 'journal_prompt' && result.prompt) {
      await addJournalEntry(userId, result.prompt, null);
    }
  }

  return {
    content: cleanText,
    memories: memories.length,
    toolResults,
  };
}

// ─── Chat Endpoints ───

app.post('/api/chat/claude', async (req, res) => {
  try {
    const { messages, userId, apiKey } = req.body;

    // Use client-provided key, fall back to server env var
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) {
      return res.status(400).json({ error: 'No Anthropic API key provided. Please add your key in Settings.' });
    }

    const user = userId ? await getOrCreateUser(userId) : null;
    const systemPrompt = buildFullSystemPrompt(user);
    const anthropic = new Anthropic({ apiKey: key });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const rawContent = response.content[0].text;
    const processed = await processResponse(rawContent, userId);

    res.json({
      content: processed.content,
      model: 'claude',
      memoriesSaved: processed.memories,
      toolResults: processed.toolResults,
    });
  } catch (error) {
    console.error('Claude API error:', error.message);
    const msg = error.message.includes('401') ? 'Invalid Anthropic API key. Please check your key in Settings.' : error.message;
    res.status(500).json({ error: msg });
  }
});

app.post('/api/chat/openai', async (req, res) => {
  try {
    const { messages, userId, apiKey } = req.body;

    // Use client-provided key, fall back to server env var
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      return res.status(400).json({ error: 'No OpenAI API key provided. Please add your key in Settings.' });
    }

    const user = userId ? await getOrCreateUser(userId) : null;
    const systemPrompt = buildFullSystemPrompt(user);
    const openai = new OpenAI({ apiKey: key });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    });

    const rawContent = response.choices[0].message.content;
    const processed = await processResponse(rawContent, userId);

    res.json({
      content: processed.content,
      model: 'openai',
      memoriesSaved: processed.memories,
      toolResults: processed.toolResults,
    });
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    const msg = error.message.includes('401') ? 'Invalid OpenAI API key. Please check your key in Settings.' : error.message;
    res.status(500).json({ error: msg });
  }
});

// ─── Memory Endpoints ───

app.get('/api/memory/:userId', async (req, res) => {
  try {
    const user = await getOrCreateUser(req.params.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/memory/:userId/session', async (req, res) => {
  try {
    const user = await recordSession(req.params.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/memory/:userId/profile', async (req, res) => {
  try {
    const user = await updateProfile(req.params.userId, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/memory/:userId/memories/:memoryId', async (req, res) => {
  try {
    const user = await removeMemory(req.params.userId, req.params.memoryId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/memory/:userId/journal', async (req, res) => {
  try {
    const { prompt, response } = req.body;
    const user = await addJournalEntry(req.params.userId, prompt, response);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/memory/:userId', async (req, res) => {
  try {
    const { getOrCreateUser: _, ...rest } = await import('./memory.js');
    // Reset user by creating fresh
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'memories', `${req.params.userId}.json`);
    await fs.unlink(filePath).catch(() => {});
    res.json({ cleared: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Production: Serve built frontend ───
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  // SPA fallback — serve index.html for non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🧘 Buddharoid API server running on port ${PORT}`);
  console.log(`🧠 Memory system active — storing in ./data/memories/`);
  console.log(`🛠️  Agent tools loaded: meditation, breathing, journal, wisdom, assessment`);
});
