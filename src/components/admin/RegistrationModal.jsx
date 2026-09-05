'use client';

import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Shield, Check, X, Users, Mail, Phone, Trash2 } from 'lucide-react';

export default function RegistrationModal({ team, isOpen, onClose, onApprove, onReject, onDelete }) {
  if (!team) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Registration Dossier — ${team.name || team.teamName}`} maxWidth="max-w-3xl">
      <div className="space-y-6">
        
        {/* Header Summary Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-white/10">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-500 dark:text-slate-400">Registration ID</span>
            <p className="font-broadcast font-bold text-xl text-amber-600 dark:text-bgmi-gold">{team.registrationId || team.regId}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-500 dark:text-slate-400">Status</span>
            <div className="mt-1">
              <Badge variant={team.status === 'Approved' ? 'green' : team.status === 'Rejected' ? 'rejected' : 'pending'}>
                {team.status || 'Pending'}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-500 dark:text-slate-400">Applied Date</span>
            <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-1">{team.registrationDate || '2026-08-01'}</p>
          </div>
        </div>

        {/* Team & Captain Details */}
        <div className="space-y-2">
          <h4 className="font-broadcast font-bold text-xs text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Squad & Captain Contact
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-mono">
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block uppercase font-bold">Captain Name</span>
              <strong className="text-slate-900 dark:text-white font-bold">{team.captain?.name || team.captainName || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block uppercase font-bold">Phone</span>
              <strong className="text-slate-900 dark:text-white font-bold">{team.captain?.phone || team.captainPhone || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block uppercase font-bold">Email</span>
              <strong className="text-slate-900 dark:text-white font-bold break-all">{team.captain?.email || team.captainEmail || 'N/A'}</strong>
            </div>
          </div>
        </div>

        {/* Player Roster Table */}
        <div className="space-y-2">
          <h4 className="font-broadcast font-bold text-xs text-amber-600 dark:text-bgmi-gold uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Submitted Player Roster
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/30">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 uppercase font-broadcast font-bold text-[10px] border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-3">Player IGN / Name</th>
                  <th className="p-3">BGMI Character ID</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-mono">
                {team.players?.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <p className="font-broadcast font-bold text-slate-900 dark:text-white text-xs">{p.ign || p.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[10px] font-sans">{p.name}</p>
                    </td>
                    <td className="p-3 font-bold text-sky-600 dark:text-sky-400">
                      {p.bgmiId || 'N/A'}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                        {p.role || 'Player'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant={p.verificationStatus === 'Verified' || p.verified ? 'green' : p.verificationStatus === 'Rejected' ? 'rejected' : 'pending'} size="sm">
                        {p.verificationStatus || (p.verified ? 'Verified' : 'Pending Verification')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
          {team.status === 'Pending' ? (
            <>
              <Button variant="danger" size="md" icon={X} onClick={() => onReject(team.id || team._id)}>
                Reject Application
              </Button>
              <Button variant="primary" size="md" icon={Check} onClick={() => onApprove(team.id || team._id)}>
                Approve Team & Dispatch Email
              </Button>
            </>
          ) : (
            <Button variant="danger" size="md" icon={Trash2} onClick={() => onDelete && onDelete(team.id || team._id)}>
              Delete Team Roster
            </Button>
          )}
        </div>

      </div>
    </Modal>
  );
}
