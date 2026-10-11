# Draft for DEV.to / Hacktoberfest Submission

**Title**: Fieldcard: Leave The Scroll Behind & Touch Grass with Gemma 4 🌿

**Tags**: `#hacktoberfest`, `#ai`, `#gemma`, `#webdev`

---

## 🍃 Inspiration & The "Touch Grass" Theme

Modern algorithms are optimized to maximize watch time, doomscrolling, and notification anxiety. Even when we recognize that we need fresh air, the cognitive fatigue of planning—*"Where should I walk? What should I do? How long do I have?"*—often leads us back to our screens.

For **Hacktoberfest Week 1 ("Touch Grass")**, I built **Fieldcard**. 

Fieldcard's tagline says it all:  
> **"Make a plan. Step outside. Leave the scroll behind."**

Fieldcard uses AI not to trap you on a screen, but to get you away from it. In under 10 seconds, it crafts a practical, time-bounded outing with an itinerary, a physical packing checklist, a sensory "Touch Grass" challenge, and an ink-friendly printable field card so you can turn off your phone and head out.

---

## ⚡ What It Does

1. **User Inputs Familiar Places**: Enter a local park, neighborhood trail, or community garden you know.
2. **Strict Time Math in JavaScript**: Pick 30, 60, 90, or 120 minutes. JavaScript guarantees that every step duration strictly sums up to your exact available time.
3. **Screen-Free Micro-Challenges**: Each plan includes a creative sensory prompt—such as identifying 5 different tree bark textures or listening for 3 distinct bird calls without looking at a screen.
4. **Resilient Sample Mode**: Visitors can explore the interface and test all features instantly in a clearly labelled Sample Demonstration Mode without consuming API quota.
5. **Print-First Experience**: Pressing "Print Field Card" uses a dedicated `@media print` stylesheet that removes all web controls and produces a clean, one-page A4 card to slip into your pocket.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite, Vanilla CSS design system (forest green, warm cream, terracotta accents).
- **AI Model**: Google's open-weight **Gemma 4** (`gemma-4-26b-a4b-it`).
- **SDK**: Official `@google/genai` JavaScript SDK.
- **Serverless API**: Vercel Serverless Function at `/api/plan`.
- **Local Dev Server**: Vite with built-in `/api/plan` middleware for zero-overhead local development.
- **Testing**: Node.js native test runner (`node --test`) covering 15 unit tests.

---

## 🔒 Security & Honest AI Design

- **Server-Side API Key Protection**: The Gemini API key is strictly accessed via `process.env.GEMINI_API_KEY` on the server and is never exposed to client bundles.
- **Transparency on Inference**: Live inference is hosted via Google AI Studio API. Prompts are transmitted over HTTPS; the app is transparent about hosted inference and does not falsely claim to run local weights on constrained devices.
- **No Hallucinated Data**: Fieldcard instructs Gemma to focus on activity structure and sensory mindfulness rather than hallucinating park hours or weather forecasts.
- **No User Tracking**: Zero cookies, zero logins, zero databases, and zero GPS tracking.

---

## 🎥 Demo & Repository

- **GitHub Repository**: [PAWANBHOWATE04/fieldcard-touch-grass](https://github.com/PAWANBHOWATE04/fieldcard-touch-grass)
- **Demo Video**: Check out `demo/fieldcard-demo.webp` in the repository for a complete walkthrough!

---

*Built with intention for Hacktoberfest 2026.* 🌿
