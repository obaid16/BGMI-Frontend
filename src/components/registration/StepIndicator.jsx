'use client';

import React from 'react';
import { Check } from 'lucide-react';

export default function StepIndicator({ currentStep, steps }) {
  return (
    <div className="w-full mb-10 overflow-x-auto pb-2">
      <div className="flex items-center justify-between min-w-[600px] max-w-4xl mx-auto px-4">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <React.Fragment key={step.title}>
              {/* Step item */}
              <div className="flex flex-col items-center gap-2 group">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm transition-all duration-300 clip-tactical ${
                    isCompleted
                      ? 'bg-bgmi-green text-slate-950 shadow-md'
                      : isCurrent
                      ? 'bg-bgmi-gold text-slate-950 shadow-gold-glow border-2 border-white scale-110'
                      : 'bg-bgmi-surface text-slate-500 border border-bgmi-border'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : stepNum}
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isCurrent
                      ? 'text-bgmi-gold'
                      : isCompleted
                      ? 'text-slate-200'
                      : 'text-slate-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connecting Bar */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                    currentStep > stepNum ? 'bg-bgmi-green' : 'bg-bgmi-border'
                  }`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
