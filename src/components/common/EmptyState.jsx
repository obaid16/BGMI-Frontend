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
    <div className="flex flex-col items-center justify-center p-12 text-center bg-premium-surface border border-dashed border-premium-border rounded-2xl my-6">
      <div className="w-16 h-16 rounded-full bg-premium-surface-soft border border-premium-border flex items-center justify-center mb-5 text-premium-text-secondary">
        <Icon className="w-8 h-8 opacity-80" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-premium-text mb-2">{title}</h3>
      <p className="text-premium-text-secondary text-sm max-w-md mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
