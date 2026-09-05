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
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Viewport Backdrop covering entire screen */}
      <div 
        className="fixed inset-0 w-full h-full bg-black/80 dark:bg-black/85 backdrop-blur-md transition-opacity duration-200 z-[9999]" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-[#FAF8F5] dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto z-[10000]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E3DA] dark:border-[#1E2638] bg-white dark:bg-[#181E2C]">
          <h3 className="text-base sm:text-lg font-bold font-display tracking-wide text-slate-900 dark:text-white uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-bgmi-gold shadow-gold-glow"></span>
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto text-slate-800 dark:text-slate-200">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
