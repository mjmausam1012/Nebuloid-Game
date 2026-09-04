import React from 'react';

/**
 * Minimalist Monochrome Timer Component
 */
export default function Timer({ timeRemaining = 15, maxTime = 15, isWarning = false }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, timeRemaining / maxTime));
  const strokeDashoffset = circumference - progress * circumference;

  let ringColor = 'stroke-black';
  let textColor = 'text-black';

  if (timeRemaining <= 5) {
    ringColor = 'stroke-rose-600';
    textColor = 'text-rose-600 animate-pulse';
  } else if (timeRemaining <= 8) {
    ringColor = 'stroke-amber-500';
    textColor = 'text-amber-600';
  }

  return (
    <div className={`relative flex items-center justify-center p-1 rounded-2xl bg-white border-2 border-black shadow-xs ${isWarning ? 'animate-shake' : ''}`}>
      <svg className="w-12 h-12 transform -rotate-90">
        {/* Background Track */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          className="stroke-slate-100"
          strokeWidth="3.5"
          fill="none"
        />
        {/* Animated Progress Ring */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          className={`${ringColor} transition-all duration-300 ease-linear`}
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Center Number */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-sm font-black font-mono leading-none ${textColor}`}>
          {timeRemaining}
        </span>
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">SEC</span>
      </div>
    </div>
  );
}
