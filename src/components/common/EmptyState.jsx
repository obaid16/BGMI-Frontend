import React from 'react';
import { ShieldAlert } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No Data Found',
  message = 'There are currently no items matching your criteria.',
  icon: Icon = ShieldAlert,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-bgmi-surface/40 border border-dashed border-bgmi-border/80 rounded-2xl my-6">
      <div className="w-16 h-16 rounded-full bg-bgmi-surface border border-bgmi-border flex items-center justify-center mb-4 text-bgmi-gold shadow-gold-glow">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold font-display text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-md mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
