/**
 * Fieldcard - Frontend API Client
 * Calls the local or Vercel serverless /api/plan endpoint.
 * Protects user quota: strictly NO automatic repeated retries.
 */

export async function requestPlan(formData) {
  const response = await fetch('/api/plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'Failed to generate plan.');
    error.status = response.status;
    error.code = data.code || 'UNKNOWN_ERROR';
    error.canUseSample = Boolean(data.canUseSample);
    error.errors = data.errors || null;
    throw error;
  }

  return data.plan;
}

export async function requestSamplePlan(formData = {}) {
  const response = await fetch('/api/plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...formData, sample: true })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to load sample plan.');
  }

  return data.plan;
}
