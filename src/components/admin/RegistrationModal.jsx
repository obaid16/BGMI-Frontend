'use client';

import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Shield, Check, X, Users, Mail, Phone, Trash2 } from 'lucide-react';

export default function RegistrationModal({ team, isOpen, onClose, onApprove, onReject, onDelete }) {
  if (!team) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Registration: ${team.name}`} maxWidth="max-w-4xl">
      <div className="space-y-8">
        
        {/* Header Summary */}
        <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-premium-surface-soft rounded-[20px] border border-premium-border shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-premium-text-secondary tracking-widest">Registration ID</span>
            <p className="font-bold text-2xl text-premium-text mt-1">{team.registrationId}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-premium-text-secondary tracking-widest">Status</span>
            <div className="mt-2">
              <Badge variant={team.status === 'Approved' ? 'green' : team.status === 'Rejected' ? 'rejected' : 'pending'}>
                {team.status}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-premium-text-secondary tracking-widest">Applied Date</span>
            <p className="text-sm font-bold text-premium-text mt-2">{team.registrationDate}</p>
          </div>
        </div>

        {/* Team & Captain Details */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold text-premium-text-secondary uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4" /> Team & Captain Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 bg-premium-background rounded-[16px] border border-premium-border text-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Captain Name</span>
              <strong className="text-premium-text">{team.captain?.name}</strong>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Phone</span>
              <strong className="text-premium-text">{team.captain?.phone}</strong>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Email</span>
              <strong className="text-premium-text truncate block">{team.captain?.email}</strong>
            </div>
          </div>
        </div>

        {/* Player Roster Table */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold text-premium-text-secondary uppercase tracking-widest flex items-center gap-2">
            <Shield className="w-4 h-4" /> Player Roster
          </h4>
          <div className="overflow-x-auto rounded-[16px] border border-premium-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-premium-background text-premium-text-secondary uppercase font-bold text-[10px] tracking-widest border-b border-premium-border">
                <tr>
                  <th className="px-5 py-3.5">Player IGN / Name</th>
                  <th className="px-5 py-3.5">Character ID</th>
                  <th className="px-5 py-3.5">Sub ID</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-premium-border bg-white">
                {team.players?.map((p, idx) => (
                  <tr key={idx} className="hover:bg-premium-surface-soft transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-premium-text">{p.ign || p.name}</p>
                      <p className="text-premium-text-secondary text-xs mt-0.5 font-medium">{p.name}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-premium-text">
                      {p.bgmiId || 'N/A'}
                    </td>
                    <td className="px-5 py-4 font-semibold text-premium-text-secondary">
                      {p.substituteId || p.subId || 'N/A'}
                    </td>
                    <td className="px-5 py-4"><Badge variant="default" size="sm">{p.role}</Badge></td>
                    <td className="px-5 py-4 text-right">
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
        <div className="pt-6 border-t border-premium-border flex items-center justify-end gap-4">
          {team.status === 'Pending' ? (
            <>
              <Button variant="danger" size="md" icon={X} onClick={() => onReject(team.id || team._id)}>
                Reject Application
              </Button>
              <Button variant="primary" size="md" icon={Check} onClick={() => onApprove(team.id || team._id)}>
                Approve Team
              </Button>
            </>
          ) : (
            <Button variant="danger" size="md" icon={Trash2} onClick={() => onDelete && onDelete(team.id || team._id)}>
              Delete Team
            </Button>
          )}
        </div>

      </div>
    </Modal>
  );
}
