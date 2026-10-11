/**
 * Fieldcard - Vercel Serverless Function: /api/plan
 * Handles POST requests to generate outdoor outing plans with Gemma 4 or sample mode.
 */

import { validateInputs } from './_lib/planSchema.js';
import { generatePlanWithGemma } from './_lib/gemmaClient.js';
import { getSamplePlanForInputs, SAMPLE_FIELD_CARD } from './_lib/samplePlan.js';

export default async function handler(req, res) {
  // CORS & headers
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Allow GET to fetch default sample card or health check
  if (req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const mode = url.searchParams.get('mode');
    if (mode === 'sample') {
      return res.status(200).json({
        success: true,
        plan: SAMPLE_FIELD_CARD,
        isSample: true
      });
    }

    return res.status(200).json({
      status: 'ok',
      service: 'Fieldcard API',
      model: 'gemma-4-26b-a4b-it',
      docs: 'POST to /api/plan with place, timeMinutes, activity, pace, budget'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Parse body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON request payload.' });
    }
  }

  body = body || {};

  // Check if explicitly requesting sample mode
  if (body.sample === true) {
    const samplePlan = getSamplePlanForInputs(body);
    return res.status(200).json({
      success: true,
      plan: samplePlan,
      isSample: true
    });
  }

  // Validate inputs
  const validation = validateInputs(body);
  if (!validation.isValid) {
    return res.status(400).json({
      error: 'Form validation failed. Please review your selections.',
      errors: validation.errors
    });
  }

  // Attempt live inference with Gemma 4
  try {
    const plan = await generatePlanWithGemma(validation.sanitized);
    return res.status(200).json({
      success: true,
      plan,
      isSample: false
    });
  } catch (err) {
    // Graceful error reporting without exposing secrets
    const statusCode = err.code === 'MISSING_API_KEY' ? 503 : 502;
    return res.status(statusCode).json({
      error: err.message,
      code: err.code || 'API_ERROR',
      canUseSample: true
    });
  }
}
