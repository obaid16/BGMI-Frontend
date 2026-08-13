'use client';

import React from 'react';
import { Check } from 'lucide-react';

export default function StepIndicator({ currentStep, steps }) {
  return (
    <div className="w-full mb-8 overflow-x-auto pb-2">
      <div className="flex items-center justify-between min-w-[300px] max-w-3xl mx-auto px-4">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <React.Fragment key={step.title}>
              {/* Step item */}
              <div className="flex flex-col items-center gap-2 group flex-shrink-0">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-display font-black text-xs sm:text-sm transition-all duration-300 clip-tactical ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                      : isCurrent
                      ? 'bg-bgmi-red text-white shadow-red-glow border-2 border-rose-400 scale-105'
                      : 'bg-white dark:bg-bgmi-surface text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-bgmi-border'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : stepNum}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                    isCurrent
                      ? 'text-bgmi-red'
                      : isCompleted
                      ? 'text-slate-900 dark:text-slate-200'
                      : 'text-slate-600 dark:text-slate-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connecting Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors duration-300 ${
                    currentStep > stepNum ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-bgmi-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
