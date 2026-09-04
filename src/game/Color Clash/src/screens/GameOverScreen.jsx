import React from 'react';
import nebuloidLogo from '../assets/nebuloid-logo-cropped.png';
import { calculateAccuracy } from '../utils/gameUtils';

export default function GameOverScreen({
  isVictory = false,
  stageNumber = 1,
  difficulty = 'EASY',
  targetQuestions = 5,
  score = 0,
  correctAnswers = 0,
  wrongAnswers = 0,
  bestStreak = 0,
  isNewBestScore = false,
  bestScore = 0,
  nextStageAvailable = false,
  onPlayNextStage,
  onPlayAgain,
  onBackToLevels,
  onBackToHome
}) {
  const accuracy = calculateAccuracy(correctAnswers, wrongAnswers);

  return (
    <div className="relative w-full min-h-screen bg-[#f8f8f8] text-black flex flex-col items-center justify-between px-4 py-8 sm:py-10 select-none overflow-hidden font-sans">
      {/* ================= CORNER DECORATIONS ================= */}

      {/* Top-Left Corner: Diagonal Black Corner with 4 White Stripes */}
      <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 pointer-events-none select-none z-0">
        <svg viewBox="0 0 120 120" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <clipPath id="corner-clip-gov-tl">
              <polygon points="0,0 120,0 0,120" />
            </clipPath>
          </defs>
          <g clipPath="url(#corner-clip-gov-tl)">
            <polygon points="0,0 120,0 0,120" fill="#0a0a0a" />
            <line x1="-10" y1="30" x2="30" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="-10" y1="55" x2="55" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="-10" y1="80" x2="80" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="-10" y1="105" x2="105" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
          </g>
        </svg>
      </div>

      {/* Top-Right Corner: Dot Matrix Grid (4 columns x 5 rows) */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 grid grid-cols-4 gap-2 pointer-events-none select-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`dot-gov-tr-${i}`} className="w-1.5 h-1.5 rounded-full bg-black/85" />
        ))}
      </div>

      {/* Bottom-Left Corner: Dot Matrix Grid */}
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 grid grid-cols-4 gap-2 pointer-events-none select-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`dot-gov-bl-${i}`} className="w-1.5 h-1.5 rounded-full bg-black/85" />
        ))}
      </div>

      {/* Bottom-Right Corner: Diagonal Black Corner with 4 White Stripes */}
      <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 pointer-events-none select-none z-0">
        <svg viewBox="0 0 120 120" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <clipPath id="corner-clip-gov-br">
              <polygon points="120,120 0,120 120,0" />
            </clipPath>
          </defs>
          <g clipPath="url(#corner-clip-gov-br)">
            <polygon points="120,120 0,120 120,0" fill="#0a0a0a" />
            <line x1="15" y1="130" x2="130" y2="15" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="40" y1="130" x2="130" y2="40" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="65" y1="130" x2="130" y2="65" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="90" y1="130" x2="130" y2="90" stroke="#f8f8f8" strokeWidth="4.5" />
          </g>
        </svg>
      </div>

      {/* ================= TOP BRANDING ================= */}
      <div className="w-full max-w-lg flex flex-col items-center z-10 pt-2">
        <img
          src={nebuloidLogo}
          alt="Nebuloid Tech"
          className="w-36 sm:w-44 h-auto object-contain pointer-events-none mb-1"
        />
      </div>

      {/* ================= MAIN RESULT CARD ================= */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center text-center z-10 my-auto py-2">
        {/* Status Badge */}
        {isVictory ? (
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black text-white text-xs sm:text-sm font-black tracking-widest uppercase mb-3 shadow-md animate-bounce">
            <span>🏆</span>
            <span>STAGE 0{stageNumber} COMPLETED!</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-600 text-white text-xs font-black tracking-widest uppercase mb-3 shadow-md">
            <span>✕</span>
            <span>STAGE 0{stageNumber} FAILED</span>
          </div>
        )}

        {/* Score Callout */}
        <h2 className="text-5xl sm:text-6xl font-black text-black tracking-tight mb-1">
          {score}
          <span className="text-base sm:text-lg text-neutral-500 font-extrabold ml-1.5">PTS</span>
        </h2>
        <p className="text-xs text-neutral-600 font-bold uppercase tracking-wider mb-5">
          {isVictory ? (
            nextStageAvailable ? (
              <span className="text-emerald-700 font-black">
                🎉 Next stage unlocked: Stage 0{stageNumber + 1}!
              </span>
            ) : (
              <span className="text-black font-black">
                👑 All stages cleared in {difficulty} level!
              </span>
            )
          ) : (
            <span>Target was {targetQuestions} questions • Try again!</span>
          )}
        </p>

        {/* Stats Grid */}
        <div className="w-full bg-white border-2 border-black rounded-2xl p-4 sm:p-5 mb-6 shadow-md">
          <div className="grid grid-cols-2 gap-3">
            {/* Correct Answers */}
            <div className="flex flex-col items-center p-2.5 bg-neutral-50 rounded-xl border border-black/20">
              <span className="text-[10px] text-neutral-500 font-black uppercase tracking-wider">
                Correct
              </span>
              <span className="text-xl font-black text-emerald-600 mt-0.5">
                ✓ {correctAnswers}
              </span>
            </div>

            {/* Mistakes */}
            <div className="flex flex-col items-center p-2.5 bg-neutral-50 rounded-xl border border-black/20">
              <span className="text-[10px] text-neutral-500 font-black uppercase tracking-wider">
                Mistakes
              </span>
              <span className="text-xl font-black text-rose-600 mt-0.5">
                ✕ {wrongAnswers}
              </span>
            </div>

            {/* Best Streak */}
            <div className="flex flex-col items-center p-2.5 bg-neutral-50 rounded-xl border border-black/20">
              <span className="text-[10px] text-neutral-500 font-black uppercase tracking-wider">
                Best Streak
              </span>
              <span className="text-xl font-black text-amber-600 mt-0.5">
                🔥 {bestStreak}
              </span>
            </div>

            {/* Accuracy */}
            <div className="flex flex-col items-center p-2.5 bg-neutral-50 rounded-xl border border-black/20">
              <span className="text-[10px] text-neutral-500 font-black uppercase tracking-wider">
                Accuracy
              </span>
              <span className="text-xl font-black text-black mt-0.5">
                {accuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 sm:gap-3">
          {/* Next Stage Button (if cleared & available) */}
          {isVictory && nextStageAvailable && (
            <button
              onClick={onPlayNextStage}
              className="w-full relative flex items-center justify-center py-3.5 px-6 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-150 shadow-md hover:shadow-xl active:scale-[0.99] cursor-pointer group border-2 border-black"
            >
              <span>NEXT STAGE (S-{stageNumber + 1}) ▶</span>
            </button>
          )}

          {/* Replay Button */}
          <button
            onClick={onPlayAgain}
            className={`w-full relative flex items-center justify-center py-3 sm:py-3.5 px-6 rounded-xl font-extrabold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-150 cursor-pointer ${
              !isVictory || !nextStageAvailable
                ? 'bg-black hover:bg-neutral-800 text-white border-2 border-black shadow-md'
                : 'bg-white hover:bg-neutral-100 text-black border-2 border-black/80 shadow-sm'
            }`}
          >
            <span>🔄 REPLAY STAGE</span>
          </button>

          {/* Level Select Button */}
          <button
            onClick={onBackToLevels}
            className="w-full relative flex items-center justify-center py-3 px-6 rounded-xl bg-white hover:bg-neutral-100 text-black font-extrabold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-150 border-2 border-black/80 shadow-sm cursor-pointer"
          >
            <span>☰ LEVEL SELECT</span>
          </button>

          {/* Home Button */}
          <button
            onClick={onBackToHome}
            className="w-full relative flex items-center justify-center py-2.5 px-6 rounded-xl bg-transparent hover:bg-neutral-200/50 text-neutral-600 hover:text-black font-extrabold text-xs tracking-wider uppercase transition-all cursor-pointer"
          >
            <span>Main Menu</span>
          </button>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="w-full text-center z-10 pt-2 pb-1">
        <p className="text-[10px] text-neutral-500 font-semibold select-none">
          Nebuloid Tech • Color Clash Stroop Challenge
        </p>
      </div>
    </div>
  );
}
