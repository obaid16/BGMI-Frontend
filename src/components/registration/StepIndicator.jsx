'use client';

import React from 'react';
import { Check } from 'lucide-react';

export default function StepIndicator({ currentStep, steps }) {
  return (
    <div className="w-full mb-8 overflow-x-auto pb-2 font-sans">
      <div className="flex items-center justify-between min-w-[300px] max-w-3xl mx-auto px-4">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <React.Fragment key={step.title}>
              {/* Step item */}
              <div className="flex flex-col items-center gap-2 group shrink-0">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-display font-black text-xs sm:text-sm transition-all duration-200 ${
                    isCompleted
                      ? 'bg-amber-500 text-slate-950 shadow-editorial-sm font-bold'
                      : isCurrent
                      ? 'bg-slate-950 dark:bg-bgmi-red text-white shadow-editorial scale-105'
                      : 'bg-white dark:bg-[#121620] text-slate-500 dark:text-slate-400 border border-[#E7E3DA] dark:border-[#1E2638]'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNum}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider ${
                    isCurrent
                      ? 'text-slate-950 dark:text-white'
                      : isCompleted
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connecting Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 sm:mx-4 rounded-full transition-colors duration-200 ${
                    currentStep > stepNum ? 'bg-amber-500' : 'bg-[#E7E3DA] dark:bg-[#1E2638]'
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
