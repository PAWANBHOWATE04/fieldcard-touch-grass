/**
 * Fieldcard - Plan Schema & Validation Utilities
 * Enforces duration math, sanitizes model outputs, and prevents hallucinations.
 */

export const ALLOWED_TIMES = [30, 60, 90, 120];
export const ALLOWED_ACTIVITIES = [
  'walking',
  'nature observation',
  'gardening',
  'photography',
  'quiet outdoor break'
];
export const ALLOWED_PACES = ['relaxed', 'moderate', 'energetic'];
export const ALLOWED_BUDGETS = ['free', 'low-cost'];

/**
 * Validates user form inputs before hitting the AI model or sample generator
 */
export function validateInputs(inputs = {}) {
  const errors = {};

  const place = typeof inputs.place === 'string' ? inputs.place.trim() : '';
  if (!place) {
    errors.place = 'Please provide a place or park name.';
  } else if (place.length > 100) {
    errors.place = 'Place name must be under 100 characters.';
  }

  const timeMinutes = Number(inputs.timeMinutes);
  if (!timeMinutes || !ALLOWED_TIMES.includes(timeMinutes)) {
    errors.timeMinutes = 'Please select a valid duration (30, 60, 90, or 120 minutes).';
  }

  const activity = inputs.activity;
  if (!activity || !ALLOWED_ACTIVITIES.includes(activity)) {
    errors.activity = 'Please choose a recognized outdoor activity.';
  }

  const pace = inputs.pace;
  if (!pace || !ALLOWED_PACES.includes(pace)) {
    errors.pace = 'Please choose a pace (relaxed, moderate, or energetic).';
  }

  const budget = inputs.budget;
  if (!budget || !ALLOWED_BUDGETS.includes(budget)) {
    errors.budget = 'Please select a budget (free or low-cost).';
  }

  const preferences = typeof inputs.preferences === 'string' ? inputs.preferences.trim().slice(0, 300) : '';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      place,
      timeMinutes,
      activity,
      pace,
      budget,
      preferences
    }
  };
}

/**
 * Normalizes itinerary step durations so they strictly sum to targetMinutes.
 * Gemma or any LLM might generate durations that drift by a few minutes.
 * This guarantees the user's requested time is strictly honored in JavaScript.
 */
export function normalizeItineraryDurations(itinerary, targetMinutes) {
  if (!Array.isArray(itinerary) || itinerary.length === 0) {
    return [];
  }

  // Ensure every step has a positive numeric duration
  const rawSteps = itinerary.map((step, idx) => ({
    step: idx + 1,
    activity: String(step.activity || `Step ${idx + 1}`).trim(),
    detail: String(step.detail || '').trim(),
    durationMinutes: Math.max(1, Math.round(Number(step.durationMinutes) || 10))
  }));

  const rawSum = rawSteps.reduce((acc, s) => acc + s.durationMinutes, 0);

  // If already matches, keep as is
  let adjustedSteps = rawSteps;
  if (rawSum !== targetMinutes && rawSum > 0) {
    let accumulated = 0;
    adjustedSteps = rawSteps.map((step, idx) => {
      if (idx === rawSteps.length - 1) {
        // Last step takes the exact remainder
        const remainder = Math.max(1, targetMinutes - accumulated);
        return { ...step, durationMinutes: remainder };
      }
      // Proportional allocation rounded to nearest 5 minutes if target is >= 30
      const proportion = step.durationMinutes / rawSum;
      let allocated = Math.round((proportion * targetMinutes) / 5) * 5;
      if (allocated < 5) allocated = 5;
      accumulated += allocated;
      return { ...step, durationMinutes: allocated };
    });

    // Final sanity check on sum
    const newSum = adjustedSteps.reduce((acc, s) => acc + s.durationMinutes, 0);
    const diff = targetMinutes - newSum;
    if (diff !== 0) {
      // Apply diff to the longest step
      let longestIdx = 0;
      for (let i = 1; i < adjustedSteps.length; i++) {
        if (adjustedSteps[i].durationMinutes > adjustedSteps[longestIdx].durationMinutes) {
          longestIdx = i;
        }
      }
      adjustedSteps[longestIdx].durationMinutes = Math.max(5, adjustedSteps[longestIdx].durationMinutes + diff);
    }
  }

  // Calculate clean timeWindow strings (e.g., 00:00 - 00:15)
  let currentMinute = 0;
  return adjustedSteps.map((step, index) => {
    const startMin = currentMinute;
    const endMin = currentMinute + step.durationMinutes;
    currentMinute = endMin;

    const formatTime = (min) => {
      const h = Math.floor(min / 60);
      const m = min % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    return {
      step: index + 1,
      timeWindow: `${formatTime(startMin)} - ${formatTime(endMin)}`,
      durationMinutes: step.durationMinutes,
      activity: step.activity,
      detail: step.detail
    };
  });
}

/**
 * Validates, repairs, and sanitizes model output JSON.
 */
export function validateAndNormalizePlan(rawPlan, requestedInputs) {
  if (!rawPlan || typeof rawPlan !== 'object') {
    throw new Error('Malformed AI response: expected JSON object.');
  }

  const targetMinutes = Number(requestedInputs.timeMinutes) || 60;
  const place = requestedInputs.place || 'Your Selected Park';

  const title = typeof rawPlan.title === 'string' && rawPlan.title.trim().length > 0
    ? rawPlan.title.trim()
    : `Outdoor Field Card: ${place}`;

  const reason = typeof rawPlan.reason === 'string' && rawPlan.reason.trim().length > 0
    ? rawPlan.reason.trim()
    : `Take a purposeful screen-free break in nature at ${place}.`;

  const rawItinerary = Array.isArray(rawPlan.itinerary) && rawPlan.itinerary.length >= 2
    ? rawPlan.itinerary
    : [
        { activity: 'Arrival & Mindful Breathing', detail: 'Silence your phone and take in the natural surroundings.', durationMinutes: 10 },
        { activity: 'Main Exploration', detail: 'Move through the outdoor space at an unhurried pace.', durationMinutes: targetMinutes - 20 },
        { activity: 'Closing Stillness', detail: 'Pause on a bench or tree shade before departing.', durationMinutes: 10 }
      ];

  const itinerary = normalizeItineraryDurations(rawItinerary, targetMinutes);

  const checklist = Array.isArray(rawPlan.checklist) && rawPlan.checklist.length > 0
    ? rawPlan.checklist.map((item) => String(item).trim()).filter(Boolean).slice(0, 6)
    : [
        'Reusable water bottle',
        'Comfortable walking shoes',
        'Light weather-appropriate jacket',
        'Keys and minimal essentials'
      ];

  const screenFreeChallenge = typeof rawPlan.screenFreeChallenge === 'string' && rawPlan.screenFreeChallenge.trim().length > 0
    ? rawPlan.screenFreeChallenge.trim()
    : 'Keep your smartphone stowed away in a bag or zippered pocket for the entire outing. Notice 3 subtle sounds you normally tune out.';

  const reflectionQuestion = typeof rawPlan.reflectionQuestion === 'string' && rawPlan.reflectionQuestion.trim().length > 0
    ? rawPlan.reflectionQuestion.trim()
    : 'How did your mental focus change between the moment you arrived and the moment you finished?';

  const safetyReminder = typeof rawPlan.safetyReminder === 'string' && rawPlan.safetyReminder.trim().length > 0
    ? rawPlan.safetyReminder.trim()
    : 'Stay on established trails, hydrate regularly, and verify daylight hours and park guidelines before heading out.';

  return {
    id: `gemma-${Date.now()}`,
    isSample: false,
    model: 'gemma-4-26b-a4b-it',
    place,
    timeMinutes: targetMinutes,
    activity: requestedInputs.activity,
    pace: requestedInputs.pace,
    budget: requestedInputs.budget,
    preferences: requestedInputs.preferences || '',
    title,
    reason,
    itinerary,
    checklist,
    screenFreeChallenge,
    reflectionQuestion,
    safetyReminder,
    createdAt: new Date().toISOString()
  };
}
