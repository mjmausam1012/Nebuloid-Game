import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

/**
 * Multiple Choice Option Button (Monochrome & High-Contrast Theme)
 */
export default function AnswerButton({
  letter,
  label,
  onClick,
  status = 'idle', // 'idle' | 'selected' | 'correct' | 'wrong' | 'eliminated'
  disabled = false,
  index = 0,
}) {
  let buttonStyle =
    'bg-white hover:bg-slate-50 text-black border-2 border-black hover:shadow-md';
  let badgeStyle = 'bg-slate-100 text-black border-2 border-black';

  if (status === 'correct') {
    buttonStyle =
      'bg-emerald-600 border-2 border-black text-white shadow-md ring-4 ring-emerald-500/20 animate-pop';
    badgeStyle = 'bg-black text-white border-2 border-white font-black';
  } else if (status === 'wrong') {
    buttonStyle =
      'bg-rose-600 border-2 border-black text-white shadow-md ring-4 ring-rose-500/20 animate-shake';
    badgeStyle = 'bg-black text-white border-2 border-white font-black';
  } else if (status === 'eliminated') {
    buttonStyle = 'bg-slate-100 border-2 border-slate-300 text-slate-400 line-through opacity-40 cursor-not-allowed';
    badgeStyle = 'bg-slate-200 text-slate-400 border border-slate-300';
  } else if (status === 'selected') {
    buttonStyle = 'bg-black text-white border-2 border-black shadow-sm';
    badgeStyle = 'bg-white text-black border-2 border-white';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || status === 'eliminated'}
      type="button"
      className={`group relative flex items-center justify-between w-full p-4 rounded-2xl transition-all duration-200 text-left cursor-pointer active:scale-[0.98] ${buttonStyle} ${
        disabled && status === 'idle' ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      aria-label={`Option ${letter}: ${label}`}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Letter Badge */}
        <span
          className={`flex items-center justify-center w-8 h-8 rounded-xl text-xs font-black transition-colors shrink-0 ${badgeStyle}`}
        >
          {letter}
        </span>

        {/* Brand Option Name */}
        <span className="text-base sm:text-lg font-black tracking-tight truncate">
          {label}
        </span>
      </div>

      {/* Status Icon */}
      <div className="shrink-0 ml-2">
        {status === 'correct' && <CheckCircle2 className="w-6 h-6 text-white" />}
        {status === 'wrong' && <XCircle className="w-6 h-6 text-white" />}
        {status === 'idle' && (
          <span className="hidden group-hover:inline-block text-[11px] font-mono text-black bg-slate-100 px-1.5 py-0.5 rounded border border-black">
            {index + 1}
          </span>
        )}
      </div>
    </button>
  );
}
