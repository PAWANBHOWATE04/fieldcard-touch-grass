import React from 'react';

const NATURE_QUOTES = [
  '“In every walk with nature, one receives far more than he seeks.” — John Muir',
  '“Look deep into nature, and then you will understand everything better.” — Albert Einstein',
  '“Adopt the pace of nature: her secret is patience.” — Ralph Waldo Emerson',
  '“The clearest way into the Universe is through a forest wilderness.” — John Muir'
];

export default function LoadingState({ place }) {
  const quote = NATURE_QUOTES[Math.floor(Math.random() * NATURE_QUOTES.length)];

  return (
    <div className="card-box loading-box no-print" role="status" aria-live="polite">
      <div className="loading-spinner" />
      <h3 style={{ color: 'var(--color-forest-dark)', fontSize: '1.35rem' }}>
        Preparing Your Field Card for {place || 'Your Outing'}...
      </h3>
      <p className="loading-quote">{quote}</p>
      <p className="loading-subtext">
        Consulting Gemma 4 to structure your screen-free itinerary, sensory challenge, and checklist.
      </p>
    </div>
  );
}
