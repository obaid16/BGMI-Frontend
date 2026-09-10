import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-premium-surface border border-premium-border rounded-2xl p-6 animate-pulse shadow-sm">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 bg-premium-surface-soft rounded-xl"></div>
        <div className="flex-1 space-y-2.5">
          <div className="h-4 bg-premium-border rounded-md w-2/3"></div>
          <div className="h-3 bg-premium-border/50 rounded-md w-1/3"></div>
        </div>
      </div>
      <div className="h-24 bg-premium-surface-soft rounded-xl mb-5"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-premium-border rounded-md w-20"></div>
        <div className="h-10 bg-premium-surface-soft rounded-full w-28"></div>
      </div>
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-premium-border animate-pulse">
      <td className="p-4"><div className="w-6 h-4 bg-premium-border rounded"></div></td>
      <td className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-premium-surface-soft rounded-full border border-premium-border"></div>
        <div className="w-32 h-4 bg-premium-border rounded"></div>
      </td>
      <td className="p-4"><div className="w-12 h-4 bg-premium-border/70 rounded"></div></td>
      <td className="p-4"><div className="w-12 h-4 bg-premium-border/70 rounded"></div></td>
      <td className="p-4"><div className="w-12 h-4 bg-premium-border/70 rounded"></div></td>
      <td className="p-4"><div className="w-16 h-5 bg-premium-sage-soft rounded-full"></div></td>
    </tr>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
