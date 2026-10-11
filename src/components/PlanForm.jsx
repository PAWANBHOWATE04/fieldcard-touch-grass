import React from 'react';

const TIME_OPTIONS = [
  { value: 30, label: '30 min', hint: 'Quick break' },
  { value: 60, label: '60 min', hint: 'Balanced walk' },
  { value: 90, label: '90 min', hint: 'Deeper pause' },
  { value: 120, label: '120 min', hint: 'Half-day trek' }
];

const ACTIVITY_OPTIONS = [
  { value: 'walking', label: 'Walking', icon: '🥾' },
  { value: 'nature observation', label: 'Nature Observation', icon: '🌿' },
  { value: 'gardening', label: 'Gardening / Community Plot', icon: '🌱' },
  { value: 'photography', label: 'Nature Photography', icon: '📷' },
  { value: 'quiet outdoor break', label: 'Quiet Outdoor Break', icon: '🪑' }
];

const PACE_OPTIONS = [
  { value: 'relaxed', label: 'Relaxed', desc: 'Slow & mindful' },
  { value: 'moderate', label: 'Moderate', desc: 'Steady stride' },
  { value: 'energetic', label: 'Energetic', desc: 'Heart rate up' }
];

const BUDGET_OPTIONS = [
  { value: 'free', label: 'Free ($0)', desc: 'Zero spending' },
  { value: 'low-cost', label: 'Low-cost', desc: 'Small fee/transit OK' }
];

export default function PlanForm({
  formData,
  onChange,
  onSubmit,
  onLoadSample,
  isLoading,
  validationErrors
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <section className="card-box no-print" aria-labelledby="form-heading">
      <h2 id="form-heading" style={{ marginBottom: '20px' }}>
        Plan Your Outing
      </h2>

      <form onSubmit={handleSubmit} className="form-grid" noValidate>
        {/* Place / Park */}
        <div className="form-group">
          <label htmlFor="input-place" className="form-label">
            <span>Where are you heading? *</span>
            <span className="form-label-hint">Park, trail, garden, or quiet square</span>
          </label>
          <input
            id="input-place"
            type="text"
            className="text-input"
            placeholder="e.g., Riverside Green Park, Oak Ridge Trailhead..."
            value={formData.place}
            onChange={(e) => onChange('place', e.target.value)}
            disabled={isLoading}
            maxLength={100}
            required
          />
          {validationErrors?.place && (
            <p style={{ color: 'var(--color-danger-text)', fontSize: '0.84rem' }}>
              {validationErrors.place}
            </p>
          )}
        </div>

        {/* Available Time */}
        <div className="form-group">
          <label className="form-label">
            <span>Available Time *</span>
            <span className="form-label-hint">Step durations will sum to this exactly</span>
          </label>
          <div className="pill-grid" role="radiogroup" aria-label="Available Time">
            {TIME_OPTIONS.map((opt) => {
              const active = formData.timeMinutes === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  id={`time-${opt.value}`}
                  className={`pill-option ${active ? 'active' : ''}`}
                  onClick={() => onChange('timeMinutes', opt.value)}
                  disabled={isLoading}
                  role="radio"
                  aria-checked={active}
                >
                  <div>
                    <strong>{opt.label}</strong>
                    <div style={{ fontSize: '0.74rem', opacity: active ? 0.9 : 0.7 }}>
                      {opt.hint}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {validationErrors?.timeMinutes && (
            <p style={{ color: 'var(--color-danger-text)', fontSize: '0.84rem' }}>
              {validationErrors.timeMinutes}
            </p>
          )}
        </div>

        {/* Activity Preference */}
        <div className="form-group">
          <label className="form-label">
            <span>Preferred Activity *</span>
            <span className="form-label-hint">Choose your focus outdoors</span>
          </label>
          <div className="activity-grid">
            {ACTIVITY_OPTIONS.map((act) => {
              const active = formData.activity === act.value;
              return (
                <button
                  type="button"
                  key={act.value}
                  id={`activity-${act.value.replace(/\s+/g, '-')}`}
                  className={`activity-card ${active ? 'active' : ''}`}
                  onClick={() => onChange('activity', act.value)}
                  disabled={isLoading}
                >
                  <span className="activity-icon" aria-hidden="true">
                    {act.icon}
                  </span>
                  <span className="activity-name">{act.label}</span>
                </button>
              );
            })}
          </div>
          {validationErrors?.activity && (
            <p style={{ color: 'var(--color-danger-text)', fontSize: '0.84rem' }}>
              {validationErrors.activity}
            </p>
          )}
        </div>

        {/* Pace & Budget */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {/* Pace */}
          <div className="form-group">
            <label className="form-label">
              <span>Pace *</span>
            </label>
            <div className="pill-grid">
              {PACE_OPTIONS.map((p) => {
                const active = formData.pace === p.value;
                return (
                  <button
                    type="button"
                    key={p.value}
                    id={`pace-${p.value}`}
                    className={`pill-option ${active ? 'active' : ''}`}
                    onClick={() => onChange('pace', p.value)}
                    disabled={isLoading}
                  >
                    <div>
                      <div>{p.label}</div>
                      <div style={{ fontSize: '0.72rem', opacity: active ? 0.9 : 0.7 }}>
                        {p.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {validationErrors?.pace && (
              <p style={{ color: 'var(--color-danger-text)', fontSize: '0.84rem' }}>
                {validationErrors.pace}
              </p>
            )}
          </div>

          {/* Budget */}
          <div className="form-group">
            <label className="form-label">
              <span>Budget *</span>
            </label>
            <div className="pill-grid">
              {BUDGET_OPTIONS.map((b) => {
                const active = formData.budget === b.value;
                return (
                  <button
                    type="button"
                    key={b.value}
                    id={`budget-${b.value}`}
                    className={`pill-option ${active ? 'active' : ''}`}
                    onClick={() => onChange('budget', b.value)}
                    disabled={isLoading}
                  >
                    <div>
                      <div>{b.label}</div>
                      <div style={{ fontSize: '0.72rem', opacity: active ? 0.9 : 0.7 }}>
                        {b.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {validationErrors?.budget && (
              <p style={{ color: 'var(--color-danger-text)', fontSize: '0.84rem' }}>
                {validationErrors.budget}
              </p>
            )}
          </div>
        </div>

        {/* Optional Preferences / Accessibility */}
        <div className="form-group">
          <label htmlFor="input-preferences" className="form-label">
            <span>Special Preferences or Accessibility Needs (Optional)</span>
            <span className="form-label-hint">Flat path, benches, shade, quiet area</span>
          </label>
          <textarea
            id="input-preferences"
            className="text-area"
            rows="2"
            placeholder="e.g., Paved paths only, quiet spot to sit, stroller friendly, dog friendly..."
            value={formData.preferences}
            onChange={(e) => onChange('preferences', e.target.value)}
            disabled={isLoading}
            maxLength={300}
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            id="btn-generate"
            disabled={isLoading}
          >
            {isLoading ? 'Crafting your outing...' : '🌿 Generate My Field Card'}
          </button>

          <div className="sample-mode-trigger">
            <button
              type="button"
              className="btn-text"
              id="btn-sample-fallback"
              onClick={onLoadSample}
              disabled={isLoading}
            >
              Or load an instant sample plan (zero API quota used) →
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
