import React from 'react';
import { Lightbulb } from 'lucide-react';

/**
 * Minimalist Monochrome Hint Button Component
 */
export default function HintButton({ onClick, used = false, disabled = false, remainingHints = 3 }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || used || remainingHints <= 0}
      type="button"
      className={`relative group flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs border-2 ${
        used
          ? 'bg-amber-100 text-black border-black cursor-default'
          : disabled || remainingHints <= 0
          ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed opacity-50'
          : 'bg-white hover:bg-slate-50 text-black border-black shadow-xs hover:shadow-md active:scale-95'
      }`}
      aria-label="Use Hint"
    >
      <Lightbulb className={`w-4 h-4 ${used ? 'text-black fill-black animate-pulse' : 'text-black'}`} />
      <span>{used ? 'HINT ACTIVE' : 'USE HINT'}</span>
      
      {!used && remainingHints > 0 && (
        <span className="ml-1 px-1.5 py-0.5 rounded-md bg-black text-white text-[10px] font-mono font-black">
          {remainingHints}
        </span>
      )}

      {/* Keyboard Shortcut badge */}
      <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 bg-slate-100 rounded border border-black text-black font-mono font-black">
        H
      </span>
    </button>
  );
}
