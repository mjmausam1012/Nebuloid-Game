import React from 'react';
import nebuloidLogo from '../assets/nebuloid-logo.png';
import ColorWord from '../components/ColorWord';
import AnswerOptions from '../components/AnswerOptions';
import Feedback from '../components/Feedback';
import Timer from '../components/Timer';
import Streak from '../components/Streak';

export default function GameScreen({
  score = 0,
  round = 1,
  difficulty = 'EASY',
  stageNumber = 1,
  targetQuestions = 5,
  correctAnswers = 0,
  timeLeft,
  maxTime = 59,
  streak = 0,
  question,
  onSelectAnswer,
  feedback,
  isLocked = false,
  onQuitToLevels
}) {
  const progressPercent = Math.min(100, Math.round((correctAnswers / targetQuestions) * 100));

  return (
    <div className="relative w-full min-h-screen bg-[#f8f8f8] text-black flex flex-col items-center justify-between px-4 py-4 sm:py-6 select-none overflow-hidden font-sans">
      {/* Visual Instant Feedback Alert */}
      <Feedback feedback={feedback} />

      {/* ================= CORNER DECORATIONS ================= */}

      {/* Top-Left Corner: Diagonal Black Corner with 4 White Stripes */}
      <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none select-none z-0">
        <svg viewBox="0 0 120 120" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <clipPath id="corner-clip-game-tl">
              <polygon points="0,0 120,0 0,120" />
            </clipPath>
          </defs>
          <g clipPath="url(#corner-clip-game-tl)">
            <polygon points="0,0 120,0 0,120" fill="#0a0a0a" />
            <line x1="-10" y1="30" x2="30" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="-10" y1="55" x2="55" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="-10" y1="80" x2="80" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="-10" y1="105" x2="105" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
          </g>
        </svg>
      </div>

      {/* Top-Right Corner: Dot Matrix Grid (4 columns x 5 rows) */}
      <div className="absolute top-5 right-5 sm:top-6 sm:right-6 grid grid-cols-4 gap-2 pointer-events-none select-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`dot-game-tr-${i}`} className="w-1.5 h-1.5 rounded-full bg-black/85" />
        ))}
      </div>

      {/* Bottom-Left Corner: Dot Matrix Grid */}
      <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 grid grid-cols-4 gap-2 pointer-events-none select-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`dot-game-bl-${i}`} className="w-1.5 h-1.5 rounded-full bg-black/85" />
        ))}
      </div>

      {/* Bottom-Right Corner: Diagonal Black Corner with 4 White Stripes */}
      <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none select-none z-0">
        <svg viewBox="0 0 120 120" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <clipPath id="corner-clip-game-br">
              <polygon points="120,120 0,120 120,0" />
            </clipPath>
          </defs>
          <g clipPath="url(#corner-clip-game-br)">
            <polygon points="120,120 0,120 120,0" fill="#0a0a0a" />
            <line x1="15" y1="130" x2="130" y2="15" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="40" y1="130" x2="130" y2="40" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="65" y1="130" x2="130" y2="65" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="90" y1="130" x2="130" y2="90" stroke="#f8f8f8" strokeWidth="4.5" />
          </g>
        </svg>
      </div>

      {/* ================= TOP HEADER & STAGE BANNER ================= */}
      <div className="w-full max-w-xl z-10 flex flex-col items-center">
        <div className="w-full flex items-center justify-between pb-2 border-b-2 border-black/80">
          {/* Logo & Level Tag */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase">
              <span className="px-2 py-0.5 rounded bg-black text-white">{difficulty}</span>
              <span className="text-black font-extrabold">S-{stageNumber}</span>
            </div>
          </div>

          {/* Quit / Back button */}
          <button
            onClick={onQuitToLevels}
            className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-black bg-white hover:bg-neutral-100 border-2 border-black rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
            title="Return to level select"
          >
            <span>↩</span>
            <span className="hidden sm:inline">Levels</span>
          </button>
        </div>

        {/* Stage Progress Bar */}
        <div className="w-full mt-2.5 px-1">
          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-neutral-600 mb-1">
            <span>Target Progress</span>
            <span className="text-black">
              {correctAnswers} / {targetQuestions} Questions
            </span>
          </div>
          <div className="w-full h-2.5 bg-neutral-200 border-2 border-black rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= TOP HUD: STREAK (LEFT) | TIMER (CENTER) | SCORE (RIGHT) ================= */}
      <div className="w-full max-w-xl z-10 grid grid-cols-3 items-center gap-2 my-2">
        {/* Left: Streak */}
        <div className="flex justify-start">
          <Streak streak={streak} />
        </div>

        {/* Middle / Center: Prominent Timer */}
        <div className="flex justify-center">
          <Timer timeLeft={timeLeft} maxTime={maxTime} />
        </div>

        {/* Right: Score */}
        <div className="flex justify-end">
          <div className="flex flex-col text-right bg-white border-2 border-black px-3 py-1.5 rounded-xl shadow-sm">
            <span className="text-[9px] uppercase font-black tracking-wider text-neutral-500">Score</span>
            <span className="text-sm sm:text-base font-black text-black">{score} <span className="text-[10px] font-bold">PTS</span></span>
          </div>
        </div>
      </div>

      {/* ================= MAIN QUESTION AREA ================= */}
      <div className="w-full max-w-xl z-10 flex flex-col items-center justify-center my-auto">
        <ColorWord question={question} />

        <div className="w-full mt-1">
          <AnswerOptions
            options={question?.options || []}
            onSelectOption={onSelectAnswer}
            disabled={isLocked}
          />
        </div>
      </div>

      {/* ================= FOOTER HINT ================= */}
      <div className="w-full max-w-xl z-10 text-center pt-2 pb-1">
        <p className="text-[10px] sm:text-xs text-neutral-500 font-bold tracking-wide select-none">
          Answer {targetQuestions} questions correctly before timer ends to unlock Stage 0{stageNumber < 5 ? stageNumber + 1 : stageNumber}!
        </p>
      </div>
    </div>
  );
}
