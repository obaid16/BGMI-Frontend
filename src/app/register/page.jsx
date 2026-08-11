'use client';

import React, { useState } from 'react';
import StepIndicator from '@/components/registration/StepIndicator';
import Step1TeamDetails from '@/components/registration/Step1TeamDetails';
import Step2PlayerDetails from '@/components/registration/Step2PlayerDetails';
import Step3Documents from '@/components/registration/Step3Documents';
import Step4Review from '@/components/registration/Step4Review';
import Step5Success from '@/components/registration/Step5Success';
import { registerTeam } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Trophy } from 'lucide-react';

export default function RegisterPage() {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedRegId, setSubmittedRegId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
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
    ],
  });

  const steps = [
    { title: 'Team Details' },
    { title: 'Players' },
    { title: 'Review' },
    { title: 'Submitted' },
  ];

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleFinalSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await registerTeam(formData);
      if (res.success) {
        setSubmittedRegId(res.registrationId);
        setCurrentStep(4);
        showToast('Team Registered Successfully!', 'success');
      } else {
        showToast(res.message || 'Registration failed.', 'error');
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
      ],
    });
    setSubmittedRegId('');
    setCurrentStep(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-bgmi-border/60 pb-6 text-center space-y-2">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-wide flex items-center justify-center gap-3">
          <Trophy className="w-10 h-10 text-bgmi-gold" /> Official Squad Registration
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Register your college BGMI squad for Championship 2026. Complete the steps to receive your official Registration ID.
        </p>
      </div>

      {/* STEP PROGRESS INDICATOR */}
      <StepIndicator currentStep={currentStep} steps={steps} />

      {/* STEP FORMS CONTAINER */}
      <div className="bg-bgmi-surface border border-bgmi-border rounded-2xl p-6 sm:p-10 clip-tactical shadow-2xl">
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
  );
}
