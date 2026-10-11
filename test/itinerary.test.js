import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeItineraryDurations } from '../api/_lib/planSchema.js';

test('normalizeItineraryDurations: calculates exact sum matching targetMinutes', () => {
  const rawSteps = [
    { durationMinutes: 10, activity: 'Step 1', detail: 'Arrival' },
    { durationMinutes: 20, activity: 'Step 2', detail: 'Walking' },
    { durationMinutes: 15, activity: 'Step 3', detail: 'Observation' }
  ]; // Sum is 45, but user requested 60!

  const normalized = normalizeItineraryDurations(rawSteps, 60);
  const total = normalized.reduce((sum, s) => sum + s.durationMinutes, 0);

  assert.strictEqual(total, 60, 'Total duration must strictly equal requested 60 minutes');
  assert.strictEqual(normalized.length, 3);
  assert.strictEqual(normalized[0].timeWindow, '00:00 - 00:15');
});

test('normalizeItineraryDurations: handles model drift for 30, 90, and 120 minutes', () => {
  const testCases = [
    { target: 30, input: [{ durationMinutes: 12 }, { durationMinutes: 25 }] },
    { target: 90, input: [{ durationMinutes: 15 }, { durationMinutes: 30 }, { durationMinutes: 55 }] },
    { target: 120, input: [{ durationMinutes: 20 }, { durationMinutes: 40 }, { durationMinutes: 30 }, { durationMinutes: 10 }] }
  ];

  for (const tc of testCases) {
    const normalized = normalizeItineraryDurations(tc.input, tc.target);
    const sum = normalized.reduce((acc, s) => acc + s.durationMinutes, 0);
    assert.strictEqual(sum, tc.target, `Duration sum must equal ${tc.target} minutes`);
    
    // Check sequential time windows
    assert.strictEqual(normalized[0].timeWindow.startsWith('00:00'), true);
  }
});

test('normalizeItineraryDurations: gracefully handles empty or invalid steps', () => {
  const empty = normalizeItineraryDurations([], 60);
  assert.deepStrictEqual(empty, []);

  const nullDurations = [
    { durationMinutes: null, activity: 'Walk' },
    { durationMinutes: undefined, activity: 'Rest' }
  ];
  const fixed = normalizeItineraryDurations(nullDurations, 60);
  const sum = fixed.reduce((acc, s) => acc + s.durationMinutes, 0);
  assert.strictEqual(sum, 60);
});
