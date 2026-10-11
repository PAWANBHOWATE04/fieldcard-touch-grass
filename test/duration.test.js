import test from 'node:test';
import assert from 'node:assert/strict';
import { validateInputs, ALLOWED_TIMES } from '../api/_lib/planSchema.js';

test('validateInputs: rejects missing place', () => {
  const result = validateInputs({
    place: '',
    timeMinutes: 60,
    activity: 'walking',
    pace: 'relaxed',
    budget: 'free'
  });

  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.place);
});

test('validateInputs: enforces allowed duration options', () => {
  for (const time of ALLOWED_TIMES) {
    const valid = validateInputs({
      place: 'Central Park',
      timeMinutes: time,
      activity: 'walking',
      pace: 'relaxed',
      budget: 'free'
    });
    assert.strictEqual(valid.isValid, true, `Expected ${time} minutes to be valid`);
  }

  const invalid = validateInputs({
    place: 'Central Park',
    timeMinutes: 45, // not in allowed [30, 60, 90, 120]
    activity: 'walking',
    pace: 'relaxed',
    budget: 'free'
  });
  assert.strictEqual(invalid.isValid, false);
  assert.ok(invalid.errors.timeMinutes);
});

test('validateInputs: sanitizes input text length and trims whitespace', () => {
  const result = validateInputs({
    place: '   Meadowland Woods   ',
    timeMinutes: 60,
    activity: 'nature observation',
    pace: 'moderate',
    budget: 'free',
    preferences: '  lots of shade  '
  });

  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.sanitized.place, 'Meadowland Woods');
  assert.strictEqual(result.sanitized.preferences, 'lots of shade');
});
