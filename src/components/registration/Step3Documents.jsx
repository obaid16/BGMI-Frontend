'use client';

import React, { useState } from 'react';
import { FileCheck, Link as LinkIcon, ShieldAlert } from 'lucide-react';
import Button from '../common/Button';

export default function Step3Documents({ formData, updateFormData, onNext, onPrev }) {
  const [error, setError] = useState('');

  const handlePlayerChange = (index, field, value) => {
    const updated = [...formData.players];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData({ players: updated });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that all players have studentProof URL
    const missingProofIdx = formData.players.findIndex(p => !p.studentProof || !p.studentProof.trim());
    if (missingProofIdx !== -1) {
      const playerNum = missingProofIdx + 1;
      const isSub = formData.players[missingProofIdx].isSub;
      setError(`Please provide a Student ID/Proof URL for Player ${playerNum} (${isSub ? 'Substitute' : 'Starter'}).`);
      return;
    }
    
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-premium-border pb-6">
        <h3 className="text-2xl font-bold text-premium-text tracking-tight flex items-center gap-3">
          <FileCheck className="w-6 h-6 text-premium-text-secondary" /> Step 3: Student Verification Proof
        </h3>
        <p className="text-sm text-premium-text-secondary font-medium mt-2">
          Provide a valid student ID card or portal verification link for every squad member.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm font-semibold shadow-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {formData.players.map((player, idx) => (
          <div 
            key={idx}
            className="p-5 bg-premium-surface border border-premium-border rounded-[20px] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-premium-background border border-premium-border overflow-hidden flex-shrink-0 flex items-center justify-center">
                {player.photo ? (
                  <img src={player.photo} alt={player.ign} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-sm text-premium-text-secondary">P0{idx + 1}</span>
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-premium-text uppercase">
                  {player.ign || `Player 0${idx + 1}`}
                </p>
                <p className="text-[11px] font-medium text-premium-text-secondary mt-0.5">
                  {player.name || 'Unnamed Player'} &bull; {player.role}
                </p>
              </div>
            </div>

            <div className="flex-1 max-w-md space-y-1.5 w-full">
              <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-premium-text-secondary" /> Student ID / Proof Link <span className="text-amber-600">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="e.g. https://college.edu/portal/verify/student.jpg"
                value={player.studentProof || ''}
                onChange={(e) => handlePlayerChange(idx, 'studentProof', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm focus:outline-none focus:border-premium-text transition-colors shadow-sm"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-premium-border flex items-center justify-between">
        <Button type="button" variant="outline" size="md" onClick={onPrev}>
          Back
        </Button>
        <Button type="submit" variant="primary" size="md">
          Review Roster Details
        </Button>
      </div>
    </form>
  );
}
