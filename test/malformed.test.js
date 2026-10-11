import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAndNormalizePlan } from '../api/_lib/planSchema.js';

test('validateAndNormalizePlan: rejects non-object raw responses', () => {
  assert.throws(() => {
    validateAndNormalizePlan(null, { timeMinutes: 60, place: 'Test' });
  }, /Malformed AI response/);

  assert.throws(() => {
    validateAndNormalizePlan('not-json', { timeMinutes: 60, place: 'Test' });
  }, /Malformed AI response/);
});

test('validateAndNormalizePlan: supplies sensible fallbacks for omitted fields', () => {
  const minimalRawPlan = {
    title: 'Autumn Garden Stroll'
    // reason, itinerary, checklist, screenFreeChallenge, reflectionQuestion, safetyReminder are omitted!
  };

  const plan = validateAndNormalizePlan(minimalRawPlan, {
    place: 'Maple Grove',
    timeMinutes: 60,
    activity: 'gardening',
    pace: 'relaxed',
    budget: 'free'
  });

  assert.strictEqual(plan.title, 'Autumn Garden Stroll');
  assert.ok(plan.reason.length > 0);
  assert.ok(Array.isArray(plan.itinerary) && plan.itinerary.length >= 2);
  assert.ok(Array.isArray(plan.checklist) && plan.checklist.length > 0);
  assert.ok(plan.screenFreeChallenge.length > 0);
  assert.ok(plan.reflectionQuestion.length > 0);
  assert.ok(plan.safetyReminder.length > 0);

  const sum = plan.itinerary.reduce((acc, s) => acc + s.durationMinutes, 0);
  assert.strictEqual(sum, 60);
});

test('validateAndNormalizePlan: sets model metadata and isSample flag accurately', () => {
  const plan = validateAndNormalizePlan(
    { title: 'Test Plan' },
    { place: 'Lakeview', timeMinutes: 30, activity: 'walking' }
  );

  assert.strictEqual(plan.isSample, false);
  assert.strictEqual(plan.model, 'gemma-4-26b-a4b-it');
  assert.ok(plan.createdAt);
});
