import React from 'react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="modal-title" style={{ fontSize: '1.4rem' }}>
            About Fieldcard &amp; Gemma 4
          </h2>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.94rem' }}>
          <div>
            <h4 style={{ color: 'var(--color-forest)', marginBottom: '4px' }}>🌱 Hacktoberfest Challenge: Touch Grass</h4>
            <p>
              Fieldcard is an intentional antidote to endless digital scrolling. It helps you quickly structure a screen-free outing so you can step outdoors, engage your senses, and return refreshed.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--color-forest)', marginBottom: '4px' }}>🤖 Open-Weight AI Architecture</h4>
            <p>
              Outings are planned using <strong>Gemma 4</strong> (<code>gemma-4-26b-a4b-it</code>), Google&apos;s state-of-the-art open-weight model family. When live inference is active, requests are securely processed through the official <code>@google/genai</code> SDK on the server.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--color-forest)', marginBottom: '4px' }}>🔒 Transparency &amp; Privacy</h4>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>Zero User Accounts &amp; Zero Tracking:</strong> We store no user logs, passwords, or personal data.</li>
              <li><strong>No GPS or Location Tracking:</strong> You manually type the place you know; your device coordinates are never accessed.</li>
              <li><strong>Hosted Inference:</strong> When live AI mode is used, your chosen place and time inputs are sent to the model provider (Google AI Studio) to generate the field card. They are not stored in any local or cloud database.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--color-forest)', marginBottom: '4px' }}>⚠️ Model &amp; Practical Limitations</h4>
            <p>
              Gemma produces grounding, structured activity itineraries. However, it does <em>not</em> have access to live weather sensors, real-time park closures, municipal opening hours, or official trail difficulty ratings. Always check current local conditions and respect outdoor safety guidelines.
            </p>
          </div>

          <div style={{ marginTop: '8px', textAlign: 'right' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
