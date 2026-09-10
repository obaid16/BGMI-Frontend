'use client';

import React from 'react';
import { Check } from 'lucide-react';

export default function StepIndicator({ currentStep, steps }) {
  return (
    <div className="w-full overflow-x-auto pb-2 sm:pb-4 hide-scrollbar">
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-1 sm:px-2">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <React.Fragment key={step.title}>
              {/* Step item */}
              <div className="flex flex-col items-center gap-1.5 sm:gap-3 group flex-shrink-0 w-16 sm:w-24">
                <div
                  className={`w-8 h-8 sm:w-12 sm:h-12 rounded-[10px] sm:rounded-[16px] flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-black text-white shadow-premium-soft scale-105'
                      : 'bg-premium-surface text-premium-text-secondary border border-premium-border'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 sm:w-6 sm:h-6 stroke-[3]" /> : stepNum}
                </div>
                <span
                  className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest text-center transition-colors truncate max-w-full ${
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
                <div className="flex-1 px-1 sm:px-3 relative -top-2 sm:-top-3 min-w-[12px]">
                  <div
                    className={`h-[2px] sm:h-[3px] rounded-full transition-colors duration-500 ${
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
