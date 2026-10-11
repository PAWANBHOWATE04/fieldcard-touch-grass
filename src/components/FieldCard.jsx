import React, { useState } from 'react';

export default function FieldCard({ plan, onReset, onPrint }) {
  const [copied, setCopied] = useState(false);

  if (!plan) return null;

  const totalDuration = plan.itinerary?.reduce((acc, s) => acc + (s.durationMinutes || 0), 0) || plan.timeMinutes;

  const handleCopy = () => {
    const textLines = [
      `FIELDCARD: ${plan.title}`,
      `Destination: ${plan.place} | Duration: ${totalDuration} min | Activity: ${plan.activity}`,
      `Why go: "${plan.reason}"`,
      '',
      '--- ITINERARY ---',
      ...plan.itinerary.map(
        (s) => `[${s.timeWindow}] (${s.durationMinutes}m) ${s.activity}: ${s.detail}`
      ),
      '',
      '--- PACKING CHECKLIST ---',
      ...plan.checklist.map((c) => `[ ] ${c}`),
      '',
      `--- SCREEN-FREE CHALLENGE ---`,
      plan.screenFreeChallenge,
      '',
      `--- REFLECTION QUESTION ---`,
      plan.reflectionQuestion,
      '',
      `--- SAFETY REMINDER ---`,
      plan.safetyReminder,
      '',
      'Generated with Fieldcard · Hacktoberfest Week 1: Touch Grass'
    ];

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <article className="field-card-container" id="field-card-result" aria-label="Generated Field Card">
      {/* Card Header */}
      <header className="field-card-header">
        <div className="badge-row">
          <div className="badge-group" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {plan.isSample ? (
              <span className="mode-badge sample" id="badge-sample-plan">
                🏷️ Sample Plan · Offline Demo
              </span>
            ) : (
              <span className="mode-badge live" id="badge-live-plan">
                ⚡ Gemma 4 AI Plan (gemma-4-26b-a4b-it)
              </span>
            )}
            <span style={{ fontSize: '0.8rem', color: '#c5d8cb' }}>
              ⏱️ {totalDuration} min total
            </span>
          </div>

          <div className="no-print" style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCopy}
              id="btn-copy-card"
              style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#ffffff', borderColor: '#4a7c59' }}
            >
              {copied ? '✓ Copied!' : '📋 Copy Summary'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onPrint}
              id="btn-print-card"
              style={{ padding: '6px 14px', fontSize: '0.85rem', color: '#ffffff', borderColor: '#ffffff', backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              🖨️ Print Card
            </button>
          </div>
        </div>

        <h2 className="field-card-title">{plan.title}</h2>

        <div className="field-card-meta">
          <span className="field-card-meta-item">
            📍 <strong>{plan.place}</strong>
          </span>
          <span className="field-card-meta-item">
            🏃 {plan.pace} pace
          </span>
          <span className="field-card-meta-item">
            🏷️ {plan.budget} budget
          </span>
          {plan.preferences && (
            <span className="field-card-meta-item" style={{ fontStyle: 'italic' }}>
              🎯 {plan.preferences}
            </span>
          )}
        </div>
      </header>

      {/* Card Body */}
      <div className="field-card-body">
        {/* Why Go Outside Callout */}
        <div className="reason-box">
          &ldquo;{plan.reason}&rdquo;
        </div>

        {/* Itinerary */}
        <section aria-labelledby="itinerary-heading">
          <h3 id="itinerary-heading" className="section-title">
            <span>🗺️</span> Step-by-Step Outing Itinerary ({totalDuration} mins)
          </h3>
          <div className="timeline-list">
            {plan.itinerary.map((step) => (
              <div key={step.step} className="timeline-step">
                <div>
                  <span className="step-time-badge">{step.timeWindow}</span>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', marginTop: '4px' }}>
                    {step.durationMinutes} minutes
                  </div>
                </div>
                <div className="step-content">
                  <div className="step-title">{step.activity}</div>
                  <p className="step-detail">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Packing & Screen-free Challenge side-by-side */}
        <section className="two-col-grid" aria-label="Checklist and Screen-free Challenge">
          {/* Packing checklist */}
          <div className="info-card">
            <h3 className="section-title">
              <span>🎒</span> What to Bring
            </h3>
            <ul className="checklist-items">
              {plan.checklist.map((item, idx) => (
                <li key={idx} className="checklist-item">
                  <span className="check-square" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Screen-free challenge */}
          <div className="info-card challenge-card">
            <h3 className="section-title">
              <span>📵</span> Touch Grass Challenge
            </h3>
            <p style={{ fontSize: '0.94rem', color: '#5a3517', lineHeight: '1.55' }}>
              {plan.screenFreeChallenge}
            </p>
          </div>
        </section>

        {/* Reflection & Safety */}
        <section className="reflection-box" aria-labelledby="reflection-heading">
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-forest-medium)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🧭 Closing Reflection
          </div>
          <p id="reflection-heading" className="reflection-prompt">
            &ldquo;{plan.reflectionQuestion}&rdquo;
          </p>
          <div className="safety-note">
            <span>⚠️</span>
            <span>
              <strong>Safety Reminder:</strong> {plan.safetyReminder}
            </span>
          </div>
        </section>

        {/* Print-only footer */}
        <footer className="print-only">
          <p>
            Fieldcard · Touch Grass Challenge (Hacktoberfest Week 1) · Model: {plan.model}
          </p>
          <p style={{ marginTop: '2px', fontSize: '8pt' }}>
            Note: Fieldcard creates mindful plans for public outdoor spaces. Please verify local park hours, trail conditions, and weather forecasts before setting out.
          </p>
        </footer>

        {/* Card Actions Footer for Screen */}
        <div className="card-actions-bar no-print">
          <button
            type="button"
            className="btn-secondary"
            onClick={onReset}
            id="btn-new-plan"
          >
            ← Modify Inputs or Create Another Plan
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={onPrint}
            style={{ width: 'auto' }}
          >
            🖨️ Print Field Card
          </button>
        </div>
      </div>
    </article>
  );
}
