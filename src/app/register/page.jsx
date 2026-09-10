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
      { name: '', ign: '', bgmiId: '', substituteId: '', role: 'IGL', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
      { name: '', ign: '', bgmiId: '', substituteId: '', role: 'Assaulter', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
      { name: '', ign: '', bgmiId: '', substituteId: '', role: 'Entry Fragger', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
      { name: '', ign: '', bgmiId: '', substituteId: '', role: 'Support', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
      { name: '', ign: '', bgmiId: '', substituteId: '', role: 'Substitute', photo: '', studentProof: '', isSub: true, verificationStatus: 'Pending Verification' },
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
      const res = await registerTeam(formData);
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
      collegeName: 'NIT',
      captainName: '',
      captainPhone: '',
      captainEmail: '',
      players: [
        { name: '', ign: '', bgmiId: '', role: 'IGL', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
        { name: '', ign: '', bgmiId: '', role: 'Assaulter', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
        { name: '', ign: '', bgmiId: '', role: 'Entry Fragger', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
        { name: '', ign: '', bgmiId: '', role: 'Support', photo: '', studentProof: '', isSub: false, verificationStatus: 'Pending Verification' },
        { name: '', ign: '', bgmiId: '', role: 'Substitute', photo: '', studentProof: '', isSub: true, verificationStatus: 'Pending Verification' },
      ],
    });
    setSubmittedRegId('');
    setCurrentStep(1);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16 space-y-12">
      
      {/* HEADER */}
      <div className="border-b border-premium-border pb-10 text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 mx-auto">
          <ShieldCheck className="w-4 h-4" /> Official Squad Registration
        </div>
        <h1 className="font-bold text-5xl sm:text-6xl text-premium-text tracking-tight">
          Join the Championship
        </h1>
        <p className="text-base text-premium-text-secondary max-w-2xl mx-auto font-medium">
          Register your college BGMI squad for Championship 2026. Complete the steps to receive your official Registration Pass.
        </p>
      </div>

      {/* STEP PROGRESS INDICATOR */}
      <div className="mb-8">
        <StepIndicator currentStep={currentStep} steps={steps} />
      </div>

      {/* 2-COLUMN SPLIT CONTROL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN (4 COLS): LIVE SQUAD PASS PREVIEW CARD */}
        <div className="lg:col-span-4 bg-premium-surface border border-premium-border rounded-[28px] p-8 shadow-sm space-y-8 sticky top-32">
          <div className="flex items-center justify-between border-b border-premium-border pb-4">
            <span className="text-[10px] font-semibold text-premium-text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" /> Pass Preview
            </span>
            <span className="text-[10px] font-semibold text-premium-text-secondary bg-premium-background px-2.5 py-1 rounded-md border border-premium-border uppercase tracking-widest">
              Step {currentStep}/4
            </span>
          </div>

          <div className="space-y-6">
            <div className="w-24 h-24 bg-premium-background rounded-3xl border border-premium-border p-1.5 mx-auto flex items-center justify-center shadow-sm">
              {formData.teamLogo ? (
                <img src={formData.teamLogo} alt="Squad Logo" className="w-full h-full object-cover rounded-[18px]" />
              ) : (
                <span className="font-bold text-4xl text-premium-text-secondary">
                  {formData.teamName ? formData.teamName.charAt(0).toUpperCase() : 'S'}
                </span>
              )}
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-bold text-2xl text-premium-text tracking-tight">
                {formData.teamName || 'Your Squad Name'}
              </h3>
              <p className="text-sm text-premium-text-secondary font-medium">Captain: {formData.captainName || 'Not Set'}</p>
            </div>

            <div className="p-5 bg-premium-background rounded-[20px] border border-premium-border text-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-premium-text-secondary font-medium text-xs">Roster Count</span>
                <span className="font-bold text-premium-text">4 Starters</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-premium-text-secondary font-medium text-xs">Contact</span>
                <span className="font-semibold text-premium-sage">{formData.captainPhone || 'Pending'}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-premium-border text-center">
            <span className="text-[9px] font-bold uppercase tracking-widest text-premium-text-secondary flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Live Synchronized
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN (8 COLS): INTERACTIVE WIZARD STEP FORMS */}
        <div className="lg:col-span-8 bg-premium-surface border border-premium-border rounded-[28px] p-8 sm:p-12 shadow-sm min-h-[600px]">
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
