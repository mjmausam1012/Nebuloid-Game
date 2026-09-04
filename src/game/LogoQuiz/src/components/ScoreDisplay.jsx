import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';

/**
 * Minimalist Animated Score Display component (Monochrome Theme)
 */
export default function ScoreDisplay({ score = 0, delta = 0 }) {
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    let start = displayScore;
    const end = score;
    if (start === end) return;

    const diff = end - start;
    const step = Math.ceil(diff / 12) || 1;

    const interval = setInterval(() => {
      start += step;
      if ((diff > 0 && start >= end) || (diff < 0 && start <= end)) {
        setDisplayScore(end);
        clearInterval(interval);
      } else {
        setDisplayScore(start);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [score]);

  return (
    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white border-2 border-black shadow-xs">
      <Award className="w-4 h-4 text-black" />
      <div className="flex flex-col">
        <span className="text-[9px] uppercase font-black tracking-widest text-slate-500">SCORE</span>
        <span className="text-sm sm:text-base font-black text-black font-mono tracking-tight leading-none">
          {displayScore.toLocaleString()}
        </span>
      </div>
      {delta > 0 && (
        <span className="text-xs font-black text-emerald-600 animate-pop">
          +{delta}
        </span>
      )}
    </div>
  );
}
