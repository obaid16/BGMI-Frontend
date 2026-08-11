'use client';

import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Shield, Check, X, Users, Mail, Phone } from 'lucide-react';

export default function RegistrationModal({ team, isOpen, onClose, onApprove, onReject }) {
  if (!team) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Registration Details - ${team.name}`} maxWidth="max-w-3xl">
      <div className="space-y-6">
        
        {/* Header Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-bgmi-dark/80 rounded-xl border border-bgmi-border">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Registration ID</span>
            <p className="font-display font-black text-xl text-bgmi-gold">{team.registrationId}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
            <div className="mt-1">
              <Badge variant={team.status === 'Approved' ? 'green' : team.status === 'Rejected' ? 'rejected' : 'pending'}>
                {team.status}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Applied Date</span>
            <p className="text-xs font-bold text-white mt-1">{team.registrationDate}</p>
          </div>
        </div>

        {/* Team & Captain Details */}
        <div className="space-y-2">
          <h4 className="font-display font-bold text-sm text-bgmi-cyan uppercase">Team & Captain</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3 bg-bgmi-dark/50 rounded-lg text-xs">
            <p><span className="text-slate-400">Captain Name:</span> <strong className="text-white">{team.captain?.name}</strong></p>
            <p><span className="text-slate-400">Phone:</span> <strong className="text-white">{team.captain?.phone}</strong></p>
            <p><span className="text-slate-400">Email:</span> <strong className="text-white">{team.captain?.email}</strong></p>
          </div>
        </div>

        {/* Player Roster Table */}
        <div className="space-y-2">
          <h4 className="font-display font-bold text-sm text-bgmi-gold uppercase">Submitted Player Roster</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-bgmi-border rounded-lg">
              <thead className="bg-bgmi-dark text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-2.5">Player IGN / Name</th>
                  <th className="p-2.5">Role</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bgmi-border/40">
                {team.players?.map((p, idx) => (
                  <tr key={idx} className="hover:bg-bgmi-dark/40">
                    <td className="p-2.5">
                      <p className="font-bold text-white">{p.ign}</p>
                      <p className="text-slate-400 text-[10px]">{p.name}</p>
                    </td>
                    <td className="p-2.5"><Badge variant="default" size="sm">{p.role}</Badge></td>
                    <td className="p-2.5 text-center">
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
        <div className="pt-4 border-t border-bgmi-border/60 flex items-center justify-end gap-3">
          <Button variant="danger" size="md" icon={X} onClick={() => onReject(team.id)}>
            Reject Application
          </Button>
          <Button variant="primary" size="md" icon={Check} onClick={() => onApprove(team.id)}>
            Approve Team
          </Button>
        </div>

      </div>
    </Modal>
  );
}
