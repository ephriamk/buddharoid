# BUDDHAROID

A 3D AI spiritual guide — a cybernetic buddha chatbot with persistent memory, agent tools, and a comprehensive Buddhist wisdom dataset.

![Buddharoid](https://img.shields.io/badge/AI-Spiritual_Guide-gold?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=flat-square)
![Claude](https://img.shields.io/badge/Claude-API-purple?style=flat-square)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-green?style=flat-square)

## What is Buddharoid?

Buddharoid is a digital bodhisattva — a 3D AI companion that guides seekers on the path to spiritual awakening. It combines:

- **3D Cybernetic Avatar** — A robot-buddha rendered with React Three Fiber, floating in a cosmic environment with particle aura effects
- **Dual AI Backend** — Choose between Claude (Anthropic) or GPT-4o (OpenAI) as the spiritual intelligence
- **Persistent Memory** — Remembers your name, spiritual journey, breakthroughs, and preferences across sessions
- **Agent Tools** — Interactive guided meditations, breathing exercises, journal prompts, wisdom lookups, and spiritual assessments
- **Buddhist Wisdom Dataset** — 50+ curated teachings spanning Theravada, Mahayana, Zen, and Tibetan traditions

---

## Quick Start

### Prerequisites

- Node.js 18+ installed
- API key for at least one provider:
  - [Anthropic API key](https://console.anthropic.com/) (for Claude)
  - [OpenAI API key](https://platform.openai.com/) (for GPT-4o)

### Setup

```bash
# Clone the repository
git clone https://github.com/ephriamk/buddharoid.git
cd buddharoid

# Install dependencies
npm install

# Configure API keys
cp .env.example .env
# Edit .env and add your API keys

# Start development (frontend + backend)
npm run start:dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Create a `.env` file in the project root:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-key-here
PORT=3001
```

You only need one API key — use whichever provider you prefer.

---

## Features Guide

### Chat with the Buddharoid

Type any question about meditation, mindfulness, Buddhist philosophy, suffering, consciousness, or personal struggles. The Buddharoid responds with compassionate, wisdom-infused guidance.

**Example prompts:**
- "I've been struggling with anxiety. How can meditation help?"
- "Explain the concept of non-self (anatta) to me"
- "I feel stuck in my spiritual practice"
- "What is the difference between Zen and Theravada?"

### Quick Action Buttons

Four buttons at the bottom of the chat provide instant access to tools:

| Button | What it does |
|--------|-------------|
| 🧘 **Meditate** | Launches a guided meditation with an interactive timer |
| 🌬️ **Breathe** | Provides a breathing exercise with visual animation |
| 📿 **Wisdom** | Retrieves a teaching from the Buddhist wisdom dataset |
| 📝 **Journal** | Generates a reflective journaling prompt |

### Agent Tools (In Detail)

#### Guided Meditation 🧘
The Buddharoid selects a meditation based on your experience level and needs:
- **Beginner**: Mindful Breathing, Body Scan, Walking Meditation
- **Intermediate**: Loving-Kindness (Metta), Zazen
- **Advanced**: Inner Light Visualization

Each meditation includes:
- An interactive countdown timer
- Step-by-step instructions that advance as you meditate
- Start/pause/reset controls

#### Breathing Exercises 🌬️
Interactive breathing patterns with a visual circle that expands and contracts:
- **Box Breathing** — 4-4-4-4 pattern for calm
- **4-7-8 Relaxation** — For anxiety and sleep
- **Alternate Nostril** — Balances the nervous system
- **Ocean Breath (Ujjayi)** — Warming, meditative breath

#### Wisdom Lookup 📿
Searches the built-in Buddhist dataset covering:
- Core teachings (Four Noble Truths, Eightfold Path, Dependent Origination...)
- Sutras (Heart Sutra, Diamond Sutra, Dhammapada, Metta Sutta...)
- Zen Koans (Mu, One Hand, Original Face, Empty Cup...)
- Tibetan practices (Tonglen, Bardo, Lojong, Nature of Mind...)
- Teacher quotes (Thich Nhat Hanh, Dalai Lama, Pema Chodron, Shunryu Suzuki...)
- Parables (Mustard Seed, The Raft, Poisoned Arrow...)
- Meditation techniques (Vipassana, Samatha, Zazen, Metta detailed instructions)

#### Journal Prompts 📝
Reflective prompts across six themes:
- Gratitude, Self-Inquiry, Impermanence
- Compassion, Awareness, Purpose

Write your reflection directly in the chat — it saves to your spiritual journal.

#### Spiritual Assessment 🔮
A six-question self-reflection covering:
- Mindfulness, Compassion, Equanimity
- Presence, Attachment, Self-Knowledge

Results show your score and a breakdown by category.

### Memory System 🧠

The Buddharoid remembers you across sessions:
- **What it remembers**: Your name, spiritual path, experience level, interests, challenges, breakthroughs, and conversation themes
- **How it works**: The AI automatically detects important information and stores it. On return visits, it uses your history to personalize guidance
- **Memory indicator**: The 🧠 badge in the header shows how many memories are stored
- **Clear memories**: Click the 🧠 badge > "Clear All Memories" to start fresh

### Provider Toggle

Switch between Claude and GPT-4o at any time using the toggle in the header. Both providers share the same spiritual system prompt and memory context.

---

## Project Structure

```
buddharoid/
├── server.js              # Express API (chat endpoints, memory API)
├── memory.js              # Memory system (read/write/query user data)
├── tools/
│   ├── index.js           # Tool router and definitions
│   ├── buddhist-dataset.js # 50+ curated Buddhist teachings
│   ├── meditations.js     # Guided meditation scripts
│   └── wisdom.js          # Wisdom search interface
├── src/
│   ├── App.jsx            # Root component
│   ├── App.css            # All styles
│   ├── hooks/
│   │   ├── useChat.js     # Chat state, API calls, tag parsing
│   │   └── useMemory.js   # User identity, session tracking
│   └── components/
│       ├── Scene.jsx          # R3F Canvas, lighting, environment
│       ├── BuddharoidModel.jsx # 3D model with animations
│       ├── ParticleAura.jsx   # Golden particle effect
│       ├── SpiritualEnvironment.jsx # Stars, fog, controls
│       ├── ChatPanel.jsx      # Chat UI with quick actions
│       ├── ChatMessage.jsx    # Message renderer
│       ├── ToolResult.jsx     # Tool result router
│       ├── MeditationTimer.jsx # Interactive timer
│       ├── BreathingExercise.jsx # Breathing animation
│       ├── JournalPrompt.jsx  # Journal entry component
│       ├── WisdomCard.jsx     # Wisdom quote card
│       └── AssessmentQuiz.jsx # Self-assessment quiz
├── public/models/         # 3D model and textures
├── data/memories/         # User memory storage (gitignored)
└── .env                   # API keys (gitignored)
```

---

## Deployment (Render)

1. Push to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repo
4. Configure:
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `ANTHROPIC_API_KEY` = your key
     - `OPENAI_API_KEY` = your key
     - `NODE_ENV` = `production`

The app builds the React frontend and serves it from Express in production mode.

---

## Buddhist Wisdom Dataset

The dataset in `tools/buddhist-dataset.js` contains 50+ entries across these categories:

| Category | Count | Examples |
|----------|-------|---------|
| Core Teachings | 13 | Four Noble Truths, Eightfold Path, Emptiness, Bodhicitta |
| Sutras | 7 | Heart Sutra, Diamond Sutra, Dhammapada, Metta Sutta |
| Zen Koans | 10 | Mu, One Hand, Original Face, Empty Cup, Kill the Buddha |
| Tibetan | 4 | Tonglen, Bardo, Lojong, Nature of Mind |
| Teacher Quotes | 15 | Thich Nhat Hanh, Suzuki, Pema Chodron, Dalai Lama, Dogen |
| Parables | 6 | Mustard Seed, The Raft, Poisoned Arrow, Blind Men |
| Meditation Techniques | 4 | Vipassana, Samatha, Zazen, Metta (detailed instructions) |

Each entry includes: title, source attribution, Buddhist tradition, full text, teaching explanation, and search keywords.

### Contributing to the Dataset

Add entries to `tools/buddhist-dataset.js` following this format:

```javascript
{
  id: 'unique-id',
  category: 'core-teaching|sutra|koan|practice|teaching|teacher-quote|parable|meditation-technique',
  title: 'Title of the Teaching',
  source: 'Original source or teacher',
  tradition: 'Theravada|Mahayana|Zen|Tibetan|All Buddhist',
  text: 'The full text of the teaching...',
  teaching: 'Brief explanation of the significance...',
  keywords: ['search', 'keywords', 'for', 'matching'],
}
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 6 |
| 3D Rendering | Three.js, React Three Fiber, Drei |
| Backend | Express.js |
| AI Providers | Anthropic Claude, OpenAI GPT-4o |
| Memory | File-based JSON (upgradeable to Supabase) |
| Deployment | Render / Railway |

---

## License

MIT

---

*"The journey of a thousand miles begins with a single question."* — The Buddharoid
