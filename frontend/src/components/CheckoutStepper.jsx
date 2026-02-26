import React from 'react';
import './CheckoutStepper.css';

const CheckoutStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Shipping' },
    { id: 2, label: 'Payment' },
    { id: 3, label: 'Review' },
    { id: 4, label: 'Confirmation' }
  ];

  const getStepClass = (stepId) => {
    if (stepId < currentStep) return 'step-completed';
    if (stepId === currentStep) return 'step-active';
    return 'step-pending';
  };

  return (
    <div className="checkout-stepper">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className={`step ${getStepClass(step.id)}`}>
            <div className="step-number">{step.id}</div>
            <div className="step-label">{step.label}</div>
          </div>
          {index < steps.length - 1 && (
            <div className={`step-connector ${step.id < currentStep ? 'connector-completed' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutStepper;
