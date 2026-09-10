'use client';

import React from 'react';
import { Check } from 'lucide-react';

export default function StepIndicator({ currentStep, steps }) {
  return (
    <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
      <div className="flex items-center justify-between min-w-[400px] max-w-4xl mx-auto px-2">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <React.Fragment key={step.title}>
              {/* Step item */}
              <div className="flex flex-col items-center gap-3 group flex-shrink-0 w-24">
                <div
                  className={`w-12 h-12 rounded-[16px] flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-black text-white shadow-premium-soft scale-105'
                      : 'bg-premium-surface text-premium-text-secondary border border-premium-border'
                  }`}
                >
                  {isCompleted ? <Check className="w-6 h-6 stroke-[3]" /> : stepNum}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest text-center transition-colors ${
                    isCurrent
                      ? 'text-black'
                      : isCompleted
                      ? 'text-premium-text'
                      : 'text-premium-text-secondary'
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connecting Line */}
              {idx < steps.length - 1 && (
                <div className="flex-1 px-4 relative -top-3">
                  <div
                    className={`h-[3px] rounded-full transition-colors duration-500 ${
                      currentStep > stepNum ? 'bg-emerald-500' : 'bg-premium-border'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
