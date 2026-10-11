import React from 'react';

export default function Header({ onOpenAbout }) {
  return (
    <header className="header-hero">
      <div className="brand-badge">
        <span>🌱</span> Hacktoberfest Week 1 · Touch Grass
      </div>
      <h1 className="brand-title">
        <span>Fieldcard</span>
      </h1>
      <p className="brand-tagline">
        Make a plan. Step outside. Leave the scroll behind.
      </p>
      <p className="brand-description">
        Turn screen time into grounding outdoor outings. Powered by open-weight <strong>Gemma 4</strong>, Fieldcard crafts a practical, time-bounded itinerary so you can step outdoors with intention.
      </p>
      <div style={{ marginTop: '4px' }}>
        <button
          type="button"
          onClick={onOpenAbout}
          className="btn-text"
          id="btn-about"
          aria-label="Learn about Gemma 4 AI and privacy"
        >
          Model &amp; Privacy Details ℹ️
        </button>
      </div>
    </header>
  );
}
