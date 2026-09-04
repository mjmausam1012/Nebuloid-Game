import React, { useEffect, useState } from 'react';

export default function ColorWord({ question }) {
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    if (question) {
      setAnimateKey((prev) => prev + 1);
    }
  }, [question?.timestamp, question?.word, question?.displayColor]);

  if (!question) return null;

  const { word, displayColor } = question;

  return (
    <div className="w-full flex flex-col items-center justify-center my-2 sm:my-4 relative z-10">
      {/* Top Warning / Instruction Banner */}
      <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-black text-white text-[10px] sm:text-xs font-black tracking-widest uppercase mb-3 shadow-sm select-none">
        <span className="text-emerald-400">MATCH:</span>
        <span>INK COLOR</span>
        <span className="text-neutral-500">|</span>
        <span className="text-rose-400">IGNORE WORD</span>
      </div>

      {/* Main Stroop Display Card */}
      <div
        key={animateKey}
        className="w-full max-w-md py-8 sm:py-12 px-6 rounded-2xl bg-white border-2 border-black shadow-md flex flex-col items-center justify-center relative overflow-hidden transition-all duration-150 pop-in"
      >
        {/* Ambient subtle tint */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundColor: displayColor.value }}
        />

        {/* Hero Stroop Word */}
        <span
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-wider uppercase select-none transition-all duration-150 z-10"
          style={{
            color: displayColor.value,
            textShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          {word}
        </span>

        {/* Mini subtitled guide */}
        <span className="mt-3 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-neutral-500 z-10 select-none">
          What color is this text rendered in?
        </span>
      </div>
    </div>
  );
}

