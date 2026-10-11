import React, { useState } from 'react';
import Header from './components/Header.jsx';
import PlanForm from './components/PlanForm.jsx';
import FieldCard from './components/FieldCard.jsx';
import LoadingState from './components/LoadingState.jsx';
import SampleNotice from './components/SampleNotice.jsx';
import AboutModal from './components/AboutModal.jsx';
import { requestPlan, requestSamplePlan } from './utils/api.js';

const INITIAL_FORM_STATE = {
  place: '',
  timeMinutes: 60,
  activity: 'nature observation',
  pace: 'relaxed',
  budget: 'free',
  preferences: ''
};

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors?.[field]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleGeneratePlan = async () => {
    // Quick local validation
    if (!formData.place.trim()) {
      setValidationErrors({ place: 'Please enter a place or park name before generating.' });
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setValidationErrors(null);

    try {
      const generatedPlan = await requestPlan(formData);
      setPlan(generatedPlan);
      setTimeout(() => {
        const el = document.getElementById('field-card-result');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      if (err.errors) {
        setValidationErrors(err.errors);
      } else {
        setErrorMessage(
          err.message || 'Could not reach Gemma AI. You can test Fieldcard using the sample plan below.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const samplePlan = await requestSamplePlan(formData);
      setPlan(samplePlan);
      setTimeout(() => {
        const el = document.getElementById('field-card-result');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load sample plan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setPlan(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Header onOpenAbout={() => setIsAboutOpen(true)} />

      {/* Notice & Error Banner */}
      <SampleNotice
        errorMessage={errorMessage}
        onLoadSample={handleLoadSample}
        isSampleActive={Boolean(plan?.isSample)}
      />

      {/* Planner Form */}
      <PlanForm
        formData={formData}
        onChange={handleFieldChange}
        onSubmit={handleGeneratePlan}
        onLoadSample={handleLoadSample}
        isLoading={isLoading}
        validationErrors={validationErrors}
      />

      {/* Loading state indicator */}
      {isLoading && <LoadingState place={formData.place} />}

      {/* Resulting Field Card */}
      {!isLoading && plan && (
        <FieldCard
          plan={plan}
          onReset={handleReset}
          onPrint={handlePrint}
        />
      )}

      {/* Footer */}
      <footer className="app-footer no-print">
        <p>
          Fieldcard · Built for the Hacktoberfest Open-Source AI Challenge (Week 1: Touch Grass).
        </p>
        <div className="footer-links">
          <span>Powered by <strong>Gemma 4</strong> (<code>gemma-4-26b-a4b-it</code>)</span>
          <span>•</span>
          <button
            type="button"
            className="btn-text"
            onClick={() => setIsAboutOpen(true)}
            style={{ fontSize: '0.86rem' }}
          >
            Privacy &amp; Disclaimers
          </button>
          <span>•</span>
          <a
            href="https://github.com/PAWANBHOWATE04/fieldcard-touch-grass"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            GitHub Repository
          </a>
        </div>
      </footer>

      {/* About & Transparency Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
