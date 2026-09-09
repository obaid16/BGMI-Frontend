'use client';

import React, { useState } from 'react';
import StepIndicator from '@/components/registration/StepIndicator';
import Step1TeamDetails from '@/components/registration/Step1TeamDetails';
import Step2PlayerDetails from '@/components/registration/Step2PlayerDetails';
import Step4Review from '@/components/registration/Step4Review';
import Step5Success from '@/components/registration/Step5Success';
import { registerTeam } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { ShieldCheck, Trophy, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedRegId, setSubmittedRegId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    teamName: '',
    collegeName: 'Nexcore Institute of Technology',
    captainName: '',
    captainPhone: '',
    captainEmail: '',
    players: [
      { name: '', ign: '', bgmiId: '', role: 'IGL', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
      { name: '', ign: '', bgmiId: '', role: 'Assaulter', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
      { name: '', ign: '', bgmiId: '', role: 'Entry Fragger', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
      { name: '', ign: '', bgmiId: '', role: 'Support', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
    ],
  });

  const steps = [
    { title: 'Squad Info' },
    { title: 'Roster Members' },
    { title: 'Review Roster' },
    { title: 'Confirmed' },
  ];

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleFinalSubmit = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        players: (formData.players || []).slice(0, 4)
      };
      const res = await registerTeam(payload);
      if (res && (res.success || res.registrationId)) {
        const passId = res.registrationId || res.data?.registrationId || 'BGMI-2026-PASS';
        setSubmittedRegId(passId);
        setCurrentStep(4);
        showToast('Squad Registered Successfully!', 'success');
      } else {
        showToast(res?.message || 'Registration failed. Please check if team name is taken.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Registration failed. Please check fields.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      teamName: '',
      collegeName: 'Nexcore Institute of Technology',
      captainName: '',
      captainPhone: '',
      captainEmail: '',
      players: [
        { name: '', ign: '', bgmiId: '', role: 'IGL', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
        { name: '', ign: '', bgmiId: '', role: 'Assaulter', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
        { name: '', ign: '', bgmiId: '', role: 'Entry Fragger', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
        { name: '', ign: '', bgmiId: '', role: 'Support', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
      ],
    });
    setSubmittedRegId('');
    setCurrentStep(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      
      {/* HEADER */}
      <div className="border-b border-[#E7E3DA] dark:border-[#1E2638] pb-6 text-center space-y-2">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-tight flex items-center justify-center gap-3">
          <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-bgmi-red" /> Official Squad Registration
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-normal">
          Register your college BGMI squad for Championship 2026. Complete the steps to receive your official Registration Pass.
        </p>
      </div>

      {/* STEP PROGRESS INDICATOR */}
      <StepIndicator currentStep={currentStep} steps={steps} />

      {/* 2-COLUMN SPLIT CONTROL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (4 COLS): LIVE SQUAD PASS PREVIEW CARD */}
        <div className="lg:col-span-4 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-6 shadow-editorial-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E7E3DA] dark:border-[#1E2638] pb-3">
            <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> SQUAD PASS PREVIEW
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-[#FAF8F5] dark:bg-[#0B0E14] px-2.5 py-0.5 rounded-full border border-[#E7E3DA] dark:border-[#1E2638]">
              STEP 0{currentStep}/04
            </span>
          </div>

          <div className="space-y-4">
            <div className="w-20 h-20 bg-[#FAF8F5] dark:bg-[#0B0E14] rounded-2xl border border-[#E7E3DA] dark:border-[#1E2638] p-1 mx-auto flex items-center justify-center shadow-editorial-sm">
              {formData.teamLogo ? (
                <img src={formData.teamLogo} alt="Squad Logo" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="font-display font-black text-3xl text-bgmi-red">
                  {formData.teamName ? formData.teamName.charAt(0).toUpperCase() : 'S'}
                </span>
              )}
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase line-clamp-1">
                {formData.teamName || 'Your Squad Name'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Captain: {formData.captainName || 'Pending'}</p>
            </div>

            <div className="p-3.5 bg-[#FAF8F5] dark:bg-[#0B0E14] rounded-2xl border border-[#E7E3DA] dark:border-[#1E2638] text-xs space-y-2 font-mono">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Roster Count:</span>
                <span className="font-bold text-slate-900 dark:text-white">4 Starters</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">WhatsApp:</span>
                <span className="text-slate-900 dark:text-white font-bold">{formData.captainPhone || 'Pending'}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E7E3DA] dark:border-[#1E2638] text-center">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Form Synchronized
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN (8 COLS): WIZARD STEP FORMS */}
        <div className="lg:col-span-8 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-6 sm:p-10 shadow-editorial">
          {currentStep === 1 && (
            <Step1TeamDetails
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <Step2PlayerDetails
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => setCurrentStep(3)}
              onPrev={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <Step4Review
              formData={formData}
              onSubmit={handleFinalSubmit}
              onPrev={() => setCurrentStep(2)}
              goToStep={(stepNum) => setCurrentStep(stepNum)}
              submitting={submitting}
            />
          )}

          {currentStep === 4 && (
            <Step5Success registrationId={submittedRegId} onReset={handleReset} />
          )}
        </div>

      </div>

    </div>
  );
}
