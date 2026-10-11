# Fieldcard 🌿

> **"Make a plan. Step outside. Leave the scroll behind."**

Fieldcard is an AI-powered outdoor outing planner built for the **Hacktoberfest Open-Source AI Challenge (Week 1 Theme: "Touch Grass")**. 

It turns screen time and digital overwhelm into grounding, purposeful outdoor adventures. Simply enter a local park or outdoor spot you know, your available time, activity style, and pace. Fieldcard uses Google's open-weight **Gemma 4** (`gemma-4-26b-a4b-it`) to structure a realistic, time-bounded itinerary, packing checklist, sensory screen-free challenge, and closing reflection.

![Fieldcard Preview](demo/fieldcard-preview.png)

---

## 🎯 The Problem

Modern devices and algorithmic feeds are designed to capture and hold our attention. Endless scrolling leads to mental fatigue, eye strain, and disconnection from the physical environment. Even when people want to take an outdoor break, the friction of deciding what to do, how long to spend, and where to walk often sends them straight back to their phones.

## 💡 The Solution

Fieldcard removes planning friction and gives you an intentional, structured reason to step outside:

1. **Time-Bounded Itineraries**: You choose 30, 60, 90, or 120 minutes. Fieldcard enforces the math in JavaScript so that every step strictly sums up to your exact available time.
2. **Screen-Free Challenges**: A curated sensory micro-challenge encouraging you to stow your smartphone away and connect with your surroundings (e.g., tactile bark exploration, audio cataloging).
3. **What to Bring Checklist**: Minimal, practical essentials tailored to your chosen activity and budget.
4. **Closing Reflection**: A mindful question to reflect upon before heading back to your routine.
5. **Print-First Design**: A dedicated, ink-saving print stylesheet lets you print a one-page A4 field card or save it as a PDF so your phone can stay completely powered off or at home.

---

## ✨ Features

- **Intuitive Outing Planner**:
  - Place or park name (user-supplied familiar destination).
  - Duration picker: 30, 60, 90, or 120 minutes.
  - Outdoor activities: Walking, Nature Observation, Gardening / Community Plot, Nature Photography, or Quiet Outdoor Break.
  - Pace: Relaxed, Moderate, or Energetic.
  - Budget: Free ($0) or Low-cost.
  - Optional accessibility and preferences notes (e.g., paved paths, shaded benches, birdwatching focus).
- **Gemma 4 Hosted Inference**:
  - Leverages Google's open-weight `gemma-4-26b-a4b-it` model via the official `@google/genai` JavaScript SDK.
  - Single concise structured JSON generation call.
- **JavaScript Duration Enforcement**:
  - JavaScript validates and normalizes all step durations so the sum strictly equals the user's requested time.
- **Resilient Offline / Sample Mode**:
  - Clearly labelled **Sample Demonstration Mode** (`isSample: true`) for testing without an API key or when API quota is exhausted.
  - Automatically preserves user form values on any API error.
  - **Never misrepresents** sample plans as live AI output.
- **One-Page A4 Print Stylesheet**:
  - Clean `@media print` styles hide navigation, form controls, and web UI.
  - Generates an ink-friendly, high-contrast, physical field card to take on the trail.
- **Zero Account & Privacy-First**:
  - No user accounts, passwords, or databases.
  - No GPS or device location tracking.
  - Server-side API key protection; secrets are never leaked to the client.

---

## 🏗️ Architecture & Technology Stack

```
fieldcard-touch-grass/
├── api/
│   ├── plan.js               # Vercel serverless function (/api/plan)
│   └── _lib/
│       ├── gemmaClient.js    # Server-side Gemma 4 calls via @google/genai
│       ├── planSchema.js     # Input validation & duration normalization
│       └── samplePlan.js     # Labelled sample plan fallback
├── demo/
│   ├── fieldcard-demo.webp   # Recorded application demo video
│   └── fieldcard-preview.png # Application UI screenshot
├── src/
│   ├── main.jsx              # React 18 application entry
│   ├── App.jsx               # App container, form state, and API coordination
│   ├── index.css             # Nature-inspired design system + @media print styles
│   ├── components/
│   │   ├── Header.jsx        # Landing hero and tagline
│   │   ├── PlanForm.jsx      # Activity, time, pace, and preference form
│   │   ├── FieldCard.jsx     # Generated result card (itinerary, checklist, challenge)
│   │   ├── SampleNotice.jsx  # Clear status banner for sample mode and errors
│   │   ├── LoadingState.jsx  # Nature quote & progress indicator
│   │   └── AboutModal.jsx    # Model transparency and privacy dialog
│   └── utils/
│       └── api.js            # Frontend HTTP client (no automatic retry loops)
├── test/
│   ├── duration.test.js      # Duration validation tests
│   ├── itinerary.test.js     # Duration normalization & sum enforcement tests
│   ├── malformed.test.js     # Malformed model response resilience tests
│   ├── sample.test.js        # Sample plan fallback integrity tests
│   └── api-handler.test.js   # Serverless handler unit tests
├── index.html
├── vite.config.js            # Vite config with local dev /api/plan middleware
├── vercel.json               # Vercel deployment configuration
└── package.json
```

- **Frontend**: React 18 + Vite (Vanilla CSS design system, no Tailwind bloat).
- **Backend API**: Vercel Serverless Function at `/api/plan`.
- **Local Dev Server**: Vite with custom middleware simulating `/api/plan` directly, running smoothly with minimal memory footprint (~50 MB RAM).
- **AI SDK**: Official `@google/genai` JavaScript SDK.
- **Model**: `gemma-4-26b-a4b-it` (open-weight Gemma model).

---

## 🔒 Security & Privacy

### API Key Security
- **Server-Side Only**: The Gemini API key is accessed exclusively on the server via `process.env.GEMINI_API_KEY`.
- **Zero Frontend Leakage**: The key is never prefixed with `VITE_`, never bundled into browser code, and never returned in API payloads.
- **Git Protection**: `.gitignore` strictly ignores `.env`, `.env.local`, `.env.*.local`, and `.vercel/`. Only `.env.example` with a placeholder is committed.

### Hosted Inference & Data Handling
- **Transparency**: AI inference is hosted via Google AI Studio's API infrastructure. It does not run locally on your device.
- **Prompt Transmission**: When generating a live plan, the place name, time, and preferences you enter are transmitted securely over HTTPS to the Google GenAI API endpoint.
- **No Persistence**: Fieldcard does not save your queries, IP addresses, or generated plans to any local or cloud database.
- **No GPS Tracking**: Fieldcard never requests browser geolocation permissions. You specify the park or destination name manually.

---

## ⚠️ Limitations & Disclaimers

- **No Real-Time Park Data**: The model generates creative and practical activity structures for the place you enter. It does **not** check real-time park opening hours, entrance fees, construction closures, weather forecasts, or municipal bylaws.
- **Safety**: Fieldcard is for wellness and mindful outdoor recreation. It does not provide medical advice or survival training. Always verify local trail conditions and weather before heading out.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ (Node.js 24 recommended)
- **npm**: v9+
- **Google AI Studio Account**: Get a free API key at [aistudio.google.com](https://aistudio.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/PAWANBHOWATE04/fieldcard-touch-grass.git
cd fieldcard-touch-grass
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Your API Key (Optional for Sample Mode)

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your real Google AI Studio key:

```env
GEMINI_API_KEY=your_api_key_here
```

> **Note**: If you don't configure an API key, Fieldcard will run smoothly in **Sample Demonstration Mode** without errors.

### 4. Run Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser. The Vite dev server includes integrated local middleware for `/api/plan`, so the API works immediately without needing extra servers or Vercel CLI.

### 5. Run the Test Suite

```bash
npm test
```

Runs 15 automated unit tests verifying duration math, schema sanitization, malformed output recovery, and API handlers using Node's native test runner.

### 6. Production Build

```bash
npm run build
```

---

## ☁️ Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. In your Vercel Project Settings under **Environment Variables**, add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Google AI Studio API key
4. Deploy! Vercel automatically detects Vite and executes `/api/plan.js` as a serverless function.

---

## 🎥 Demo Video & Walkthrough

A recorded walkthrough video of the application is available in the repository at:
- **Video**: [`demo/fieldcard-demo.webp`](demo/fieldcard-demo.webp)
- **Format**: WebP animated recording
- **Size**: ~11 KB

To record your own MP4 video:
1. Start the app: `npm run dev`
2. Open `http://localhost:5173` in your browser.
3. Use your OS screen recorder (Windows `Win + Alt + R` or OBS Studio) to record the form interaction, sample mode, and printable card.
4. Save the recording to `demo/fieldcard-demo.mp4`.

---

## 🌍 Why Open Innovation Matters

The Hacktoberfest Open-Source AI Challenge highlights why open-weight models like **Gemma 4** are transformative:

1. **Accessibility**: Independent creators and students can build production-ready, intelligent applications without enterprise budgets or proprietary lock-in.
2. **Transparency**: Open-weight architectures empower developers to inspect model behaviors, understand reasoning patterns, and guarantee ethical guidelines.
3. **Agency**: Technology should serve human wellbeing. Fieldcard uses AI not to prolong screen time, but to intentionally encourage stepping away from the screen and reconnecting with nature.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
Copyright (c) 2026 PAWAN BHOWATE.
