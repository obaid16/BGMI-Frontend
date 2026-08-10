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
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-bgmi-border/60 pb-4 mb-6">
        <h3 className="text-xl font-bold font-display text-white uppercase flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-400" /> Step 3: Student Verification Proof
        </h3>
        <p className="text-xs text-slate-400">
          Provide a valid student ID card or portal verification link for every squad member.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400 text-xs font-semibold">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {formData.players.map((player, idx) => (
          <div 
            key={idx}
            className="p-5 bg-bgmi-surface/70 border border-bgmi-border/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 clip-tactical"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-bgmi-dark border border-bgmi-border overflow-hidden flex-shrink-0">
                {player.photo ? (
                  <img src={player.photo} alt={player.ign} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="font-display font-black text-xs text-bgmi-gold flex items-center justify-center h-full">P0{idx + 1}</span>
                )}
              </div>
              <div>
                <p className="font-display font-bold text-xs text-white uppercase">
                  {player.ign || `Player 0${idx + 1}`}
                </p>
                <p className="text-[10px] text-slate-400">
                  {player.name || 'Unnamed Player'} &bull; {player.role}
                </p>
              </div>
            </div>

            <div className="flex-1 max-w-md space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-bgmi-cyan" /> Student ID / Proof Link <span className="text-bgmi-gold">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="e.g. https://college.edu/portal/verify/student.jpg"
                value={player.studentProof || ''}
                onChange={(e) => handlePlayerChange(idx, 'studentProof', e.target.value)}
                className="w-full px-3 py-2 bg-bgmi-dark border border-bgmi-border rounded-lg text-white text-xs focus:outline-none focus:border-bgmi-gold transition-colors"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-bgmi-border/60 flex items-center justify-between">
        <Button type="button" variant="secondary" size="md" onClick={onPrev}>
          ← Back
        </Button>
        <Button type="submit" variant="primary" size="md">
          Review Roster Details →
        </Button>
      </div>
    </form>
  );
}
