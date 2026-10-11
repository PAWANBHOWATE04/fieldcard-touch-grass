import React from 'react';

export default function SampleNotice({ errorMessage, onLoadSample, isSampleActive }) {
  if (isSampleActive) {
    return (
      <div className="alert-box alert-sample no-print" role="status">
        <div className="alert-header">
          <span>🏷️</span>
          <span>Sample Plan Mode Active</span>
        </div>
        <p>
          You are viewing an explicitly labelled sample field card. This demonstrates the exact structure and mindful pacing of Fieldcard without consuming Google AI Studio API quota.
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="alert-box alert-danger no-print" role="alert">
        <div className="alert-header">
          <span>⚠️</span>
          <span>Live Gemma 4 AI Unavailable</span>
        </div>
        <p>{errorMessage}</p>
        <p style={{ fontSize: '0.86rem' }}>
          Your form inputs have been preserved. You can view an instant sample plan tailored to your inputs below without needing an active API key.
        </p>
        <div>
          <button
            type="button"
            className="btn-secondary"
            onClick={onLoadSample}
            id="btn-use-sample-fallback"
            style={{ fontSize: '0.88rem', padding: '6px 14px', backgroundColor: '#ffffff' }}
          >
            🌿 View Labelled Sample Plan Instead
          </button>
        </div>
      </div>
    );
  }

  return null;
}
