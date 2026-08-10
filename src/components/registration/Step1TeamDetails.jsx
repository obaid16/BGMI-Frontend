'use client';

import React from 'react';
import { Shield, Building, User, Phone, Mail, Image } from 'lucide-react';
import Button from '../common/Button';

export default function Step1TeamDetails({ formData, updateFormData, onNext }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-bgmi-border/60 pb-4 mb-6">
        <h3 className="text-xl font-bold font-display text-white uppercase flex items-center gap-2">
          <Shield className="w-5 h-5 text-bgmi-gold" /> Step 1: Team Details
        </h3>
        <p className="text-xs text-slate-400">Form your team and compete against the best squads in our college.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            Team Name <span className="text-bgmi-gold">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="e.g. Team Alpha"
              value={formData.teamName}
              onChange={(e) => updateFormData({ teamName: e.target.value })}
              className="w-full px-4 py-3 bg-bgmi-dark border border-bgmi-border rounded-xl text-white text-sm focus:outline-none focus:border-bgmi-gold transition-colors"
            />
          </div>
        </div>

        {/* Team Logo URL */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            Team Logo URL
          </label>
          <div className="relative">
            <input
              type="url"
              placeholder="e.g. https://example.com/logo.png"
              value={formData.teamLogo || ''}
              onChange={(e) => updateFormData({ teamLogo: e.target.value })}
              className="w-full px-4 py-3 bg-bgmi-dark border border-bgmi-border rounded-xl text-white text-sm focus:outline-none focus:border-bgmi-gold transition-colors"
            />
          </div>
        </div>

        {/* College Name Info Block (Non-editable) */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            College
          </label>
          <div className="w-full px-4 py-3.5 bg-bgmi-dark/60 border border-bgmi-border/40 rounded-xl text-slate-300 text-sm font-semibold select-none flex items-center justify-between">
            <span>[COLLEGE NAME]</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">EXCLUSIVE IN-HOUSE TOURNAMENT</span>
          </div>
        </div>

        {/* Captain Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            Captain / Manager Name <span className="text-bgmi-gold">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Rohan Sharma"
            value={formData.captainName}
            onChange={(e) => updateFormData({ captainName: e.target.value })}
            className="w-full px-4 py-3 bg-bgmi-dark border border-bgmi-border rounded-xl text-white text-sm focus:outline-none focus:border-bgmi-gold transition-colors"
          />
        </div>

        {/* Contact Phone */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            Contact Number (WhatsApp) <span className="text-bgmi-gold">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={formData.captainPhone}
            onChange={(e) => updateFormData({ captainPhone: e.target.value })}
            className="w-full px-4 py-3 bg-bgmi-dark border border-bgmi-border rounded-xl text-white text-sm focus:outline-none focus:border-bgmi-gold transition-colors"
          />
        </div>

        {/* Contact Email */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            Official Student Email <span className="text-bgmi-gold">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="rohan.sharma@college.ac.in"
            value={formData.captainEmail}
            onChange={(e) => updateFormData({ captainEmail: e.target.value })}
            className="w-full px-4 py-3 bg-bgmi-dark border border-bgmi-border rounded-xl text-white text-sm focus:outline-none focus:border-bgmi-gold transition-colors"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-bgmi-border/60 flex justify-end">
        <Button type="submit" variant="primary" size="md">
          Proceed to Players →
        </Button>
      </div>
    </form>
  );
}
