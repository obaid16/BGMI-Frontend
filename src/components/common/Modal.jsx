'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 w-screen h-screen z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Viewport Backdrop */}
      <div 
        className="fixed inset-0 w-full h-full bg-black/85 backdrop-blur-md transition-opacity duration-200 z-[100]" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-bgmi-surface border border-bgmi-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 clip-tactical my-auto z-[101]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-bgmi-border/60 bg-bgmi-card/50">
          <h3 className="text-lg font-bold font-display tracking-wide text-white uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-bgmi-gold shadow-gold-glow"></span>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-bgmi-border/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
