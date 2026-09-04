import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Zap, Sparkles } from 'lucide-react';
import { DIFFICULTIES } from '../data/logos';

/**
 * Ultra-Modern Minimalist Monochrome Difficulty Selection Screen
 * Features geometric corner stripes, 4x4 dot grids, and high-contrast styling.
 */
export default function DifficultyScreen({
  onSelectDifficulty,
  onBack,
  soundEnabled = true,
  onToggleSound,
}) {
  return (
    <div className="relative w-full min-h-screen bg-[#FAFAFA] text-black flex flex-col justify-between items-center px-4 py-8 overflow-hidden select-none">
      {/* ================= GEOMETRIC CORNER ACCENTS ================= */}

      {/* Top-Left: Black Corner Triangle with White Diagonal Stripes */}
      <div className="absolute top-0 left-0 pointer-events-none z-0">
        <svg
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="0,0 120,0 0,120" fill="#000000" />
          <line x1="22" y1="0" x2="0" y2="22" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="square" />
          <line x1="44" y1="0" x2="0" y2="44" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="square" />
          <line x1="66" y1="0" x2="0" y2="66" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="square" />
          <line x1="88" y1="0" x2="0" y2="88" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="square" />
        </svg>
      </div>

      {/* Top-Right: 4x4 Dot Grid Pattern */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 pointer-events-none z-0">
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={`tr-diff-dot-${i}`} className="w-1.5 h-1.5 rounded-full bg-black/80" />
          ))}
        </div>
      </div>

      {/* Bottom-Left: 4x4 Dot Grid Pattern */}
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 pointer-events-none z-0">
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={`bl-diff-dot-${i}`} className="w-1.5 h-1.5 rounded-full bg-black/80" />
          ))}
        </div>
      </div>

      {/* Bottom-Right: Black Corner Triangle with White Diagonal Stripes */}
      <div className="absolute bottom-0 right-0 pointer-events-none z-0">
        <svg
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rotate-180"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="0,0 120,0 0,120" fill="#000000" />
          <line x1="22" y1="0" x2="0" y2="22" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="square" />
          <line x1="44" y1="0" x2="0" y2="44" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="square" />
          <line x1="66" y1="0" x2="0" y2="66" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="square" />
          <line x1="88" y1="0" x2="0" y2="88" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="square" />
        </svg>
      </div>

      {/* ================= TOP NAVIGATION BAR ================= */}
      <div className="w-full max-w-2xl flex items-center justify-between relative z-10 mb-4">
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 border-2 border-black text-xs font-black text-black transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        <button
          onClick={onToggleSound}
          type="button"
          className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-black text-black transition-all shadow-xs active:scale-95 cursor-pointer"
          title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
          aria-label={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center my-auto relative z-10 animate-pop">
        {/* Top GUIDE Subtitle */}
        <span className="text-[11px] font-black tracking-[0.3em] text-slate-500 uppercase block text-center">
          CHALLENGE LEVEL
        </span>

        {/* Screen Header */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-black tracking-tight mt-1 mb-2 text-center">
          SELECT DIFFICULTY
        </h1>

        {/* Divider with Tagline */}
        <div className="w-full max-w-sm flex items-center justify-center gap-3 my-4">
          <div className="h-[2px] w-10 sm:w-14 bg-black" />
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-black shrink-0">
            CHOOSE YOUR LEVEL
          </span>
          <div className="h-[2px] w-10 sm:w-14 bg-black" />
        </div>

        {/* 3 Difficulty Option Cards */}
        <div className="w-full flex flex-col gap-3 sm:gap-3.5 mt-2">
          {DIFFICULTIES.map((diff, index) => {
            const stepNum = `0${index + 1}`;

            return (
              <button
                key={diff.id}
                onClick={() => onSelectDifficulty(diff.id)}
                type="button"
                className="group relative w-full p-4 sm:p-5 rounded-2xl bg-white border-2 border-black hover:bg-slate-50 hover:shadow-lg transition-all duration-200 text-left cursor-pointer flex items-center justify-between gap-4 shadow-xs active:scale-[0.99]"
              >
                {/* Left Content */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <span className="text-sm font-black text-slate-400 font-mono shrink-0 w-7 text-center">
                    {stepNum}
                  </span>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg sm:text-xl font-black text-black group-hover:underline">
                        {diff.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black border border-black bg-slate-100 text-black uppercase tracking-wider">
                        {diff.points}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium leading-snug">
                      {diff.description}
                    </p>
                  </div>
                </div>

                {/* Right Action Pill */}
                <div className="shrink-0 flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 border border-black text-xs font-mono font-black text-black">
                    {index + 1}
                  </span>
                  <span className="text-xs font-black text-black tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                    SELECT ➔
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Subtitle Note */}
        <p className="text-[11px] sm:text-xs text-slate-500 font-semibold tracking-wide text-center mt-7">
          ★ Select a difficulty to proceed to game mode selection. ★
        </p>
      </div>

      {/* Bottom Spacer */}
      <div className="h-4" />
    </div>
  );
}
