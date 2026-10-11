import test from 'node:test';
import assert from 'node:assert/strict';
import { SAMPLE_FIELD_CARD, getSamplePlanForInputs } from '../api/_lib/samplePlan.js';

test('SAMPLE_FIELD_CARD: contains all required fields and is explicitly marked as sample', () => {
  assert.strictEqual(SAMPLE_FIELD_CARD.isSample, true);
  assert.match(SAMPLE_FIELD_CARD.model, /Sample Demonstration/i);
  assert.ok(SAMPLE_FIELD_CARD.title);
  assert.ok(SAMPLE_FIELD_CARD.reason);
  assert.ok(SAMPLE_FIELD_CARD.itinerary.length >= 3);
  assert.ok(SAMPLE_FIELD_CARD.checklist.length >= 3);
  assert.ok(SAMPLE_FIELD_CARD.screenFreeChallenge);
  assert.ok(SAMPLE_FIELD_CARD.reflectionQuestion);
  assert.ok(SAMPLE_FIELD_CARD.safetyReminder);

  const sum = SAMPLE_FIELD_CARD.itinerary.reduce((acc, s) => acc + s.durationMinutes, 0);
  assert.strictEqual(sum, SAMPLE_FIELD_CARD.timeMinutes);
});

test('getSamplePlanForInputs: generates dynamic sample plans matching requested durations', () => {
  for (const minutes of [30, 60, 90, 120]) {
    const plan = getSamplePlanForInputs({
      place: 'Sunset Ridge Trail',
      timeMinutes: minutes,
      activity: 'walking',
      pace: 'moderate',
      budget: 'free'
    });

    assert.strictEqual(plan.isSample, true, 'Sample plan must have isSample: true');
    assert.strictEqual(plan.place, 'Sunset Ridge Trail');
    assert.strictEqual(plan.timeMinutes, minutes);

    const sum = plan.itinerary.reduce((acc, s) => acc + s.durationMinutes, 0);
    assert.strictEqual(sum, minutes, `Itinerary for ${minutes} min sample must sum to ${minutes}`);
    assert.ok(plan.screenFreeChallenge.length > 0);
  }
});
