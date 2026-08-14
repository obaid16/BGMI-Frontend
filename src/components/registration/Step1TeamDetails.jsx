'use client';

import React, { useState } from 'react';
import { Shield, Mail, Phone, User, Building } from 'lucide-react';
import Button from '../common/Button';

export default function Step1TeamDetails({ formData, updateFormData, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.teamName?.trim()) newErrors.teamName = 'Squad name is required';
    if (!formData.captainName?.trim()) newErrors.captainName = 'Captain full name is required';
    if (!formData.captainPhone?.trim()) newErrors.captainPhone = 'WhatsApp phone number is required';
    if (!formData.captainEmail?.trim()) newErrors.captainEmail = 'Student email address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleProceed} className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 dark:border-bgmi-border/60 pb-4 mb-6">
        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase flex items-center gap-2">
          <Shield className="w-5 h-5 text-bgmi-red" /> Step 1: Squad & Captain Overview
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Enter your team identity and captain contact details.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* TEAM NAME */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Squad / Team Name <span className="text-bgmi-red">*</span>
          </label>
          <div className="relative">
            <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="e.g. GODLIKE ESPORTS"
              value={formData.teamName}
              onChange={(e) => updateFormData({ teamName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-bgmi-dark border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none transition-colors ${
                errors.teamName ? 'border-bgmi-red' : 'border-slate-300 dark:border-bgmi-border focus:border-bgmi-red'
              }`}
            />
          </div>
          {errors.teamName && <p className="text-[11px] text-bgmi-red font-bold">{errors.teamName}</p>}
        </div>

        {/* COLLEGE NAME */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            College / Campus Name
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={formData.collegeName || 'NIT'}
              onChange={(e) => updateFormData({ collegeName: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-bgmi-red transition-colors"
            />
          </div>
        </div>

        {/* SQUAD / TEAM LOGO */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Squad / Team Logo (URL or Upload)
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Paste Logo Image URL or Upload File"
              value={formData.teamLogo || ''}
              onChange={(e) => updateFormData({ teamLogo: e.target.value })}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-bgmi-red transition-colors"
            />
          </div>
        </div>

        {/* CAPTAIN NAME */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Captain Full Name <span className="text-bgmi-red">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.captainName}
              onChange={(e) => updateFormData({ captainName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-bgmi-dark border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none transition-colors ${
                errors.captainName ? 'border-bgmi-red' : 'border-slate-300 dark:border-bgmi-border focus:border-bgmi-red'
              }`}
            />
          </div>
          {errors.captainName && <p className="text-[11px] text-bgmi-red font-bold">{errors.captainName}</p>}
        </div>

        {/* CAPTAIN PHONE */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            WhatsApp Phone Number <span className="text-bgmi-red">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={formData.captainPhone}
              onChange={(e) => updateFormData({ captainPhone: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-bgmi-dark border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none transition-colors ${
                errors.captainPhone ? 'border-bgmi-red' : 'border-slate-300 dark:border-bgmi-border focus:border-bgmi-red'
              }`}
            />
          </div>
          {errors.captainPhone && <p className="text-[11px] text-bgmi-red font-bold">{errors.captainPhone}</p>}
        </div>

        {/* CAPTAIN EMAIL */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Student Email Address <span className="text-bgmi-red">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              placeholder="captain@student.nit.ac.in"
              value={formData.captainEmail}
              onChange={(e) => updateFormData({ captainEmail: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-bgmi-dark border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none transition-colors ${
                errors.captainEmail ? 'border-bgmi-red' : 'border-slate-300 dark:border-bgmi-border focus:border-bgmi-red'
              }`}
            />
          </div>
          {errors.captainEmail && <p className="text-[11px] text-bgmi-red font-bold">{errors.captainEmail}</p>}
        </div>

      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-bgmi-border/60 flex justify-end">
        <Button type="submit" variant="primary" size="lg">
          PROCEED TO ROSTER SETUP →
        </Button>
      </div>
    </form>
  );
}
