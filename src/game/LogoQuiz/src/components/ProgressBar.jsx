import React from 'react';

/**
 * Minimalist Monochrome Progress Bar
 */
export default function ProgressBar({ current = 1, total = 10 }) {
  const percent = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  return (
    <div className="w-full max-w-xl mx-auto mb-3 px-2">
      <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-black mb-1.5">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-black animate-pulse" />
          Progress
        </span>
        <span className="font-mono text-black">{percent}%</span>
      </div>

      <div className="h-2.5 w-full bg-white rounded-full overflow-hidden p-0.5 border-2 border-black shadow-xs">
        <div
          className="h-full rounded-full bg-black transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
