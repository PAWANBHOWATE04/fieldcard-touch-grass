/**
 * Fieldcard - Gemma 4 Client
 * Performs server-side outdoor plan generation using the official @google/genai SDK
 * and the open-weight Gemma model (gemma-4-26b-a4b-it).
 * 
 * CRITICAL SECURITY:
 * The API key is read strictly from process.env.GEMINI_API_KEY on the server.
 * It is never exposed in browser code, VITE_ vars, or network payloads.
 */

import { GoogleGenAI } from '@google/genai';
import { validateAndNormalizePlan } from './planSchema.js';

const GEMMA_MODEL = 'gemma-4-26b-a4b-it';

/**
 * Builds the focused, prompt instructing Gemma 4 to plan a screen-free outing.
 */
function buildPrompt(inputs) {
  return `You are Fieldcard, an outdoor mindfulness and nature activity guide designed for the "Touch Grass" challenge.
Your mission is to inspire people to leave screens and doomscrolling behind and reconnect with the real world.

User Request:
- Destination/Park: "${inputs.place}"
- Available Time: ${inputs.timeMinutes} minutes
- Activity: "${inputs.activity}"
- Pace: "${inputs.pace}"
- Budget: "${inputs.budget}"
- User Notes/Preferences: "${inputs.preferences || 'None provided'}"

Strict Constraints:
1. You MUST generate a realistic, grounding outdoor plan whose step durations sum up to EXACTLY ${inputs.timeMinutes} minutes.
2. Provide 3 to 5 clear, sequential itinerary steps with positive durationMinutes.
3. Do NOT invent opening hours, verified trail conditions, entrance fees, or live weather. Keep the guidance practical and adaptable to the user's specific park or outdoor space.
4. Do NOT provide medical advice or encourage hazardous outdoor conduct.
5. Emphasize a sensory, screen-free mindset.

Respond ONLY with a valid JSON object matching this exact schema:
{
  "title": "A poetic, inviting title for the outing (max 60 characters)",
  "reason": "One compelling sentence inspiring the user to step outside and disconnect from screens right now",
  "itinerary": [
    {
      "durationMinutes": 10,
      "activity": "Brief step title",
      "detail": "1-2 practical sentences describing what to do and observe without checking your phone"
    }
  ],
  "checklist": [
    "3-5 minimal, practical items to bring (e.g. water, walking shoes)"
  ],
  "screenFreeChallenge": "A specific micro-challenge to keep the phone stowed away and engage the senses (e.g. touch, hearing, noticing colors)",
  "reflectionQuestion": "One thoughtful question for the user to ponder at the end before returning home",
  "safetyReminder": "One concise, sensible outdoor safety reminder"
}`;
}

/**
 * Strips markdown code blocks if present and parses JSON safely.
 */
function extractAndParseJson(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty response received from Gemma model.');
  }

  // Remove potential ```json and ``` wrapping
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }

  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }

  cleaned = cleaned.trim();

  // If there's leading or trailing text outside JSON brackets
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse Gemma output as JSON: ${err.message}. Raw text: ${text.slice(0, 200)}...`);
  }
}

/**
 * Generates an outdoor outing plan with Gemma 4 using @google/genai SDK.
 */
export async function generatePlanWithGemma(inputs) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_api_key_here') {
    const error = new Error(
      'GEMINI_API_KEY is not configured on the server. Please add your Google AI Studio API key to .env.local (or Vercel project environment variables).'
    );
    error.code = 'MISSING_API_KEY';
    throw error;
  }

  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const prompt = buildPrompt(inputs);

  let response;
  try {
    response = await ai.models.generateContent({
      model: GEMMA_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });
  } catch (err) {
    const error = new Error(`Gemma inference call failed: ${err.message || 'Unknown network error'}`);
    error.code = 'MODEL_INFERENCE_ERROR';
    error.original = err;
    throw error;
  }

  const outputText = response?.text;
  if (!outputText) {
    const error = new Error('Gemma returned an empty content response.');
    error.code = 'EMPTY_MODEL_RESPONSE';
    throw error;
  }

  const rawJson = extractAndParseJson(outputText);
  const normalizedPlan = validateAndNormalizePlan(rawJson, inputs);

  return normalizedPlan;
}
