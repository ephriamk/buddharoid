# Buddharoid Agent Upgrade Plan

## Project Location
`/Users/ephriamkassa/buddharoid/`

## Current State
- React 18 + Vite frontend with React Three Fiber 3D scene
- Express backend with Claude + OpenAI dual endpoints
- Cyborg soldier GLB model with floating/glow animations
- Stateless chat — no memory, no persistence, no tools

## Goal
Turn the Buddharoid into a **persistent AI agent** with:
1. Cross-session memory (remembers the user's spiritual journey)
2. Agent tools (guided meditations, journaling, wisdom lookup)
3. Session/user identity via localStorage + server-side storage

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│  FRONTEND (React + R3F)                          │
│                                                  │
│  useChat.js ──► useMemory.js (localStorage ID)   │
│       │                                          │
│  ChatPanel ──► ToolResultRenderer (new)          │
│  BuddharoidModel (existing 3D)                   │
└──────────────┬───────────────────────────────────┘
               │ POST /api/chat/:provider
               ▼
┌──────────────────────────────────────────────────┐
│  BACKEND (Express)                               │
│                                                  │
│  server.js                                       │
│   ├── /api/chat/claude   (+ memory context)      │
│   ├── /api/chat/openai   (+ memory context)      │
│   ├── /api/memory/:userId (GET/POST memories)    │
│   └── Agent Tool Router                          │
│        ├── meditation_guide                      │
│        ├── journal_prompt                        │
│        ├── wisdom_lookup                         │
│        ├── breathing_exercise                    │
│        └── spiritual_assessment                  │
│                                                  │
│  Memory Store (JSON file-based, upgradeable)     │
│   └── data/memories/{userId}.json                │
└──────────────────────────────────────────────────┘
```

---

## Implementation Steps

### Step 1: Memory System (Server)
**Files:** `server.js`, new `memory.js` (server-side module)

- Create `data/memories/` directory for persistent storage
- Each user gets a JSON file: `{userId}.json`
- Memory structure:
  ```json
  {
    "userId": "uuid",
    "created": "ISO date",
    "profile": {
      "name": null,
      "spiritualPath": null,
      "experienceLevel": null,
      "interests": [],
      "challenges": []
    },
    "memories": [
      {
        "id": "uuid",
        "type": "insight|preference|milestone|context",
        "content": "User has been meditating for 3 months",
        "timestamp": "ISO date"
      }
    ],
    "journalEntries": [],
    "sessionCount": 0,
    "lastSeen": "ISO date"
  }
  ```
- Add API endpoints:
  - `GET /api/memory/:userId` — fetch user memories
  - `POST /api/memory/:userId` — save new memory
  - `DELETE /api/memory/:userId/memories/:memoryId` — remove a memory

### Step 2: Memory-Aware System Prompt
**Files:** `server.js`

- Before each API call, fetch user's memories
- Inject relevant memories into the system prompt
- Instruct the AI to emit `<memory>` tags when it learns something worth remembering
- Parse `<memory>` tags from AI responses and auto-save them

### Step 3: Agent Tools
**Files:** new `tools/` directory on server

Tool definitions that the AI can invoke:

1. **meditation_guide** — Guided meditation script based on experience level and mood
2. **breathing_exercise** — Breathing exercise with timing (box breathing, 4-7-8, etc.)
3. **journal_prompt** — Reflective journaling prompt, saved to user's journal
4. **wisdom_lookup** — Buddhist teachings, koans, sutras collection
5. **spiritual_assessment** — Self-reflection questionnaire tracking progress over time

Tool invocation: AI uses `<tool>` XML tags → server parses → executes → returns result

### Step 4: Frontend — User Identity + Memory Hook
**Files:** new `src/hooks/useMemory.js`, update `useChat.js`

- Generate/retrieve userId from localStorage
- Track session count
- Send userId with every chat request
- Parse `<memory>` and `<tool>` tags from responses

### Step 5: Frontend — Tool Result Rendering
**Files:** new `src/components/ToolResult.jsx`, update `ChatMessage.jsx`

- Meditation: Timer UI with start/pause
- Breathing: Animated expand/contract circle
- Journal: Text input that saves
- Wisdom: Styled quote card
- Assessment: Interactive questionnaire

### Step 6: Memory Indicator + Enhanced Welcome
**Files:** update `ChatPanel.jsx`, `useChat.js`

- "Welcome back" greeting on return visits
- Memory count badge
- View/clear memories option
- Milestone recognition

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `server.js` | **Modify** | Add memory endpoints, tool router, memory-aware prompts |
| `memory.js` (server) | **Create** | Memory read/write/query logic |
| `tools/index.js` | **Create** | Tool definitions and execution |
| `tools/meditations.js` | **Create** | Meditation guide data/logic |
| `tools/wisdom.js` | **Create** | Buddhist wisdom collection |
| `src/hooks/useChat.js` | **Modify** | Add userId, parse memory/tool tags |
| `src/hooks/useMemory.js` | **Create** | Client-side user identity + memory |
| `src/components/ChatMessage.jsx` | **Modify** | Render tool results inline |
| `src/components/ToolResult.jsx` | **Create** | Tool-specific UI components |
| `src/components/ChatPanel.jsx` | **Modify** | Memory indicator, return greeting |
| `src/components/MeditationTimer.jsx` | **Create** | Meditation timer overlay |
| `src/components/BreathingExercise.jsx` | **Create** | Breathing animation component |
| `data/memories/` | **Create** | Directory for user memory files |

## New Dependencies
None — file-based storage and XML tag parsing keep it simple.

## Order of Implementation
1. Memory system (server) — foundation
2. Memory-aware prompts — makes the AI use memory
3. Frontend useMemory hook + userId — connects client to memory
4. Update useChat to send userId and parse tags
5. Agent tools (server-side)
6. Tool result rendering (frontend)
7. Enhanced welcome flow
8. Polish and test
