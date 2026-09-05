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
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#121620] border border-dashed border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl my-6 shadow-editorial-sm">
      <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center mb-4 text-bgmi-gold shadow-editorial-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2 uppercase">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
