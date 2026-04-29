import { useEffect, useRef } from 'react';
import './TutorialOverlay.css';

export function TutorialOverlay({ step, totalSteps, title, message, highlightSelector, onNext, onSkip, onComplete }) {
  const highlightRef = useRef(null);

  useEffect(() => {
    // Apply highlight for the provided selector whenever highlightSelector or step changes
    if (highlightRef.current) {
      // remove previous highlight
      highlightRef.current.classList.remove('tutorial-highlight');
      highlightRef.current = null;
    }

    if (highlightSelector) {
      const element = document.querySelector(highlightSelector);
      if (element) {
        element.classList.add('tutorial-highlight');
        highlightRef.current = element;
      }
    }

    return () => {
      if (highlightRef.current) {
        highlightRef.current.classList.remove('tutorial-highlight');
        highlightRef.current = null;
      }
    };
  }, [highlightSelector, step]);

  const isLastStep = step === totalSteps - 1;
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-progress-bar">
        <div className="tutorial-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="tutorial-tooltip">
        <div className="tutorial-step-indicator">
          Step {step + 1} of {totalSteps}
        </div>
        <h3 className="tutorial-title">{title}</h3>
        <p className="tutorial-message">{message}</p>
        <div className="tutorial-buttons">
          <button className="tutorial-skip-btn" onClick={onSkip}>
            Skip Tutorial
          </button>
          <button className="tutorial-next-btn" onClick={isLastStep ? onComplete : onNext}>
            {isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
