import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/plan.js';

// Mock request and response helpers
function createMockReqRes({ method = 'GET', url = '/api/plan', body = null } = {}) {
  const req = {
    method,
    url,
    headers: { host: 'localhost:5173' },
    body
  };

  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, val) {
      this.headers[key] = val;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    end(data) {
      this.body = data;
      return this;
    }
  };

  return { req, res };
}

test('api handler: GET /api/plan?mode=sample returns 200 with sample plan', async () => {
  const { req, res } = createMockReqRes({ method: 'GET', url: '/api/plan?mode=sample' });
  await handler(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.plan.isSample, true);
});

test('api handler: POST rejects invalid inputs with 400', async () => {
  const { req, res } = createMockReqRes({
    method: 'POST',
    body: { place: '', timeMinutes: 999 } // invalid
  });
  await handler(req, res);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.error, 'Form validation failed. Please review your selections.');
  assert.ok(res.body.errors.place);
  assert.ok(res.body.errors.timeMinutes);
});

test('api handler: POST with sample: true returns tailored sample with 200', async () => {
  const { req, res } = createMockReqRes({
    method: 'POST',
    body: {
      sample: true,
      place: 'Redwood State Park',
      timeMinutes: 90,
      activity: 'nature observation',
      pace: 'relaxed',
      budget: 'free'
    }
  });
  await handler(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.plan.isSample, true);
  assert.strictEqual(res.body.plan.place, 'Redwood State Park');
  assert.strictEqual(res.body.plan.timeMinutes, 90);
});

test('api handler: POST without GEMINI_API_KEY gracefully returns 503 and canUseSample', async () => {
  const origKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  try {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        place: 'Emerald Lake Park',
        timeMinutes: 60,
        activity: 'walking',
        pace: 'relaxed',
        budget: 'free'
      }
    });

    await handler(req, res);

    assert.strictEqual(res.statusCode, 503);
    assert.strictEqual(res.body.canUseSample, true);
    assert.match(res.body.error, /GEMINI_API_KEY is not configured/);
  } finally {
    if (origKey !== undefined) {
      process.env.GEMINI_API_KEY = origKey;
    }
  }
});
