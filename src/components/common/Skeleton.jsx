import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-bgmi-surface/60 border border-bgmi-border/60 rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-bgmi-border/50 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-bgmi-border/60 rounded w-2/3"></div>
          <div className="h-3 bg-bgmi-border/40 rounded w-1/3"></div>
        </div>
      </div>
      <div className="h-20 bg-bgmi-border/30 rounded-lg mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-bgmi-border/50 rounded w-20"></div>
        <div className="h-8 bg-bgmi-border/60 rounded w-24"></div>
      </div>
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-bgmi-border/40 animate-pulse">
      <td className="p-4"><div className="w-6 h-4 bg-bgmi-border/60 rounded"></div></td>
      <td className="p-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-bgmi-border/60 rounded-full"></div>
        <div className="w-32 h-4 bg-bgmi-border/60 rounded"></div>
      </td>
      <td className="p-4"><div className="w-12 h-4 bg-bgmi-border/40 rounded"></div></td>
      <td className="p-4"><div className="w-12 h-4 bg-bgmi-border/40 rounded"></div></td>
      <td className="p-4"><div className="w-12 h-4 bg-bgmi-border/40 rounded"></div></td>
      <td className="p-4"><div className="w-16 h-5 bg-bgmi-gold/20 rounded"></div></td>
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
