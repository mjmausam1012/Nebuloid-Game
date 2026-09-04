import React, { useState } from 'react';
import nebuloidLogo from '../assets/nebuloid-logo-cropped.png';
import { DIFFICULTY_CONFIG } from '../data/colors';

export default function StartScreen({
  onStartGame,
  onOpenLevels,
  bestScore = 0,
  bestStreak = 0,
  selectedDifficulty = 'EASY',
  onChangeDifficulty,
  isMuted = false,
  onToggleMute,
  onExitGame,
}) {
  const [activeModal, setActiveModal] = useState(null); // 'certificates' | 'howToPlay' | 'exit' | null

  const handleStart = () => {
    if (onOpenLevels) {
      onOpenLevels();
    } else if (onStartGame) {
      onStartGame();
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#f8f8f8] text-black flex flex-col items-center justify-between px-4 py-8 sm:py-10 select-none overflow-hidden font-sans">
      {/* ================= CORNER DECORATIONS ================= */}

      {/* Top-Left Corner: Diagonal Black Corner with 4 White Stripes */}
      <div className="absolute top-0 left-0 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 pointer-events-none select-none z-0">
        <svg viewBox="0 0 120 120" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <clipPath id="corner-clip-tl">
              <polygon points="0,0 120,0 0,120" />
            </clipPath>
          </defs>
          <g clipPath="url(#corner-clip-tl)">
            <polygon points="0,0 120,0 0,120" fill="#0a0a0a" />
            {/* 4 Diagonal white stripes */}
            <line x1="-10" y1="30" x2="30" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="-10" y1="55" x2="55" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="-10" y1="80" x2="80" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="-10" y1="105" x2="105" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
          </g>
        </svg>
      </div>

      {/* Top-Right Corner: Dot Matrix Grid (4 columns x 5 rows) */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 md:top-10 md:right-10 grid grid-cols-4 gap-2 sm:gap-2.5 pointer-events-none select-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`dot-tr-${i}`} className="w-1.5 h-1.5 rounded-full bg-black/85" />
        ))}
      </div>

      {/* Bottom-Left Corner: Dot Matrix Grid (4 columns x 5 rows) */}
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 md:bottom-10 md:left-10 grid grid-cols-4 gap-2 sm:gap-2.5 pointer-events-none select-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`dot-bl-${i}`} className="w-1.5 h-1.5 rounded-full bg-black/85" />
        ))}
      </div>

      {/* Bottom-Right Corner: Diagonal Black Corner with 4 White Stripes */}
      <div className="absolute bottom-0 right-0 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 pointer-events-none select-none z-0">
        <svg viewBox="0 0 120 120" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <clipPath id="corner-clip-br">
              <polygon points="120,120 0,120 120,0" />
            </clipPath>
          </defs>
          <g clipPath="url(#corner-clip-br)">
            <polygon points="120,120 0,120 120,0" fill="#0a0a0a" />
            {/* 4 Diagonal white stripes */}
            <line x1="15" y1="130" x2="130" y2="15" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="40" y1="130" x2="130" y2="40" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="65" y1="130" x2="130" y2="65" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="90" y1="130" x2="130" y2="90" stroke="#f8f8f8" strokeWidth="4.5" />
          </g>
        </svg>
      </div>

      {/* Subtle Sound Toggle (Top Corner) */}
      {onToggleMute && (
        <button
          onClick={onToggleMute}
          className="absolute top-4 right-20 sm:right-28 z-10 px-2.5 py-1 rounded-full border border-black/20 bg-white/70 hover:bg-white text-black text-xs font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          title={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          <span>{isMuted ? '🔇' : '🔊'}</span>
          <span className="hidden sm:inline text-[11px] uppercase">{isMuted ? 'Muted' : 'Sound'}</span>
        </button>
      )}

      {/* ================= MAIN CONTENT CENTER ================= */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center text-center z-10 my-auto py-4">
        {/* Nebuloid Tech Logo & Sub-banner */}
        <div className="mb-2 sm:mb-3 flex flex-col items-center">
          <img
            src={nebuloidLogo}
            alt="Nebuloid Tech"
            className="w-48 sm:w-56 md:w-64 h-auto object-contain pointer-events-none"
          />
        </div>

        {/* Big Bold Main Game Title */}
        <div className="flex flex-col items-center justify-center my-1 sm:my-2">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black tracking-tight leading-none">
            COLOR
          </h1>
          <div className="text-xl sm:text-xl md:text-2xl font-black tracking-[0.55em] sm:tracking-[0.7em] text-black pl-[0.55em] sm:pl-[0.7em] mt-1 sm:mt-2 uppercase">
            CLASH
          </div>

          {/* Slogan Divider Bar: — REACH • RACE • ACHIEVE — */}
          <div className="flex items-center justify-center gap-3 w-full max-w-[260px] sm:max-w-xs mt-3 sm:mt-4 text-[10px] sm:text-[11px] font-extrabold text-black tracking-widest uppercase">
            <div className="h-[1.5px] bg-black/80 flex-1"></div>
            <span>REACH • RACE • ACHIEVE</span>
            <div className="h-[1.5px] bg-black/80 flex-1"></div>
          </div>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="w-full max-w-xs sm:max-w-sm flex flex-col gap-3 sm:gap-3.5 mt-8 sm:mt-10">
          {/* Button 1: START RACE */}
          <button
            onClick={handleStart}
            className="w-full relative flex items-center justify-center py-3.5 sm:py-4 px-6 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-150 shadow-md hover:shadow-xl active:scale-[0.99] cursor-pointer group border-2 border-black"
            aria-label="Start Race"
          >
            <svg
              className="absolute left-5 sm:left-6 w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-white transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
            >
              <polygon points="6,4 20,12 6,20" />
            </svg>
            <span className="text-center font-black">START RACE</span>
          </button>

          {/* Button 2: CERTIFICATES */}
          <button
            onClick={() => setActiveModal('certificates')}
            className="w-full relative flex items-center justify-center py-3 sm:py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-100 text-black font-extrabold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-150 shadow-sm hover:shadow active:scale-[0.99] cursor-pointer border-2 border-black/85 hover:border-black group"
          >
            <svg
              className="absolute left-5 sm:left-6 w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-black fill-none shrink-0"
              viewBox="0 0 24 24"
              strokeWidth="2.4"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <rect x="8" y="8" width="8" height="8" fill="black" />
            </svg>
            <span className="text-center font-black">CERTIFICATES</span>
          </button>

          {/* Button 3: HOW TO PLAY */}
          <button
            onClick={() => setActiveModal('howToPlay')}
            className="w-full relative flex items-center justify-center py-3 sm:py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-100 text-black font-extrabold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-150 shadow-sm hover:shadow active:scale-[0.99] cursor-pointer border-2 border-black/85 hover:border-black group"
          >
            <svg
              className="absolute left-5 sm:left-6 w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-black fill-none shrink-0"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="11" strokeLinecap="round" strokeWidth="2.5" />
              <circle cx="12" cy="7.5" r="1.2" fill="black" stroke="none" />
            </svg>
            <span className="text-center font-black">HOW TO PLAY</span>
          </button>

          {/* Button 4: EXIT */}
          <button
            onClick={() => setActiveModal('exit')}
            className="w-full relative flex items-center justify-center py-3 sm:py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-100 text-black font-extrabold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-150 shadow-sm hover:shadow active:scale-[0.99] cursor-pointer border-2 border-black/85 hover:border-black group"
          >
            <svg
              className="absolute left-5 sm:left-6 w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-black fill-none shrink-0"
              viewBox="0 0 24 24"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 10 4 15 9 20" />
              <path d="M20 4v7a4 4 0 0 1-4 4H4" />
            </svg>
            <span className="text-center font-black">EXIT</span>
          </button>
        </div>
      </div>

      {/* ================= FOOTER SUBTEXT ================= */}
      <div className="w-full text-center z-10 pt-4 pb-1">
        <p className="text-[10px] sm:text-xs text-black/75 font-semibold tracking-wide flex items-center justify-center gap-2 select-none">
          <span className="text-[8px] text-black">▲</span>
          <span>Every genuine target unlocks a personalized certificate.</span>
          <span className="text-[8px] text-black">▲</span>
        </p>
      </div>

      {/* ================= MODAL: CERTIFICATES & TARGETS ================= */}
      {activeModal === 'certificates' && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-2xl text-left relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-5">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🏆</span>
                <h3 className="text-lg sm:text-xl font-black text-black tracking-wider uppercase">
                  CERTIFICATES & TARGETS
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-black text-white hover:bg-neutral-800 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Current Stats Summary */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 bg-neutral-50 rounded-xl border border-black/20 text-center">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Best Score
                </span>
                <span className="text-2xl font-black text-black">{bestScore} <span className="text-xs font-semibold">PTS</span></span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-black/20 text-center">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Best Streak
                </span>
                <span className="text-2xl font-black text-black">🔥 {bestStreak}</span>
              </div>
            </div>

            {/* Milestone Certificates */}
            <h4 className="text-xs font-extrabold tracking-widest text-neutral-600 uppercase mb-3">
              Unlockable Certificates
            </h4>
            <div className="space-y-2.5 mb-6">
              {[
                { title: 'Bronze Speedster', target: 50, desc: 'Score 50+ points in a single race' },
                { title: 'Silver Mastermind', target: 150, desc: 'Score 150+ points in a single race' },
                { title: 'Gold Champion', target: 300, desc: 'Score 300+ points in a single race' },
                { title: 'Diamond Legend', target: 500, desc: 'Score 500+ points with 95%+ accuracy' },
              ].map((cert) => {
                const isUnlocked = bestScore >= cert.target;
                return (
                  <div
                    key={cert.title}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                      isUnlocked
                        ? 'border-black bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs sm:text-sm tracking-wide">
                          {cert.title}
                        </span>
                        {isUnlocked && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-black font-black uppercase">
                            UNLOCKED ✓
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] mt-0.5 ${isUnlocked ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {cert.desc}
                      </p>
                    </div>
                    <span className={`text-xs font-black shrink-0 ${isUnlocked ? 'text-emerald-400' : 'text-neutral-600'}`}>
                      {cert.target} PTS
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Difficulty Selector in Modal */}
            {onChangeDifficulty && (
              <div className="mb-6 pt-4 border-t border-neutral-200">
                <span className="text-xs font-extrabold tracking-widest text-neutral-600 uppercase block mb-2.5">
                  Select Difficulty
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(DIFFICULTY_CONFIG).map((diffKey) => {
                    const config = DIFFICULTY_CONFIG[diffKey];
                    const isSelected = selectedDifficulty === diffKey;
                    return (
                      <button
                        key={diffKey}
                        onClick={() => onChangeDifficulty(diffKey)}
                        className={`py-2 px-1 rounded-xl border-2 text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-black bg-black text-white shadow-md'
                            : 'border-neutral-300 bg-white text-neutral-700 hover:border-black'
                        }`}
                      >
                        <span className="text-xs font-black block tracking-wider">{config.label}</span>
                        <span className="text-[10px] opacity-80">{config.optionsCount} Choices</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveModal(null);
                  handleStart();
                }}
                className="w-full py-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs tracking-widest uppercase transition-all cursor-pointer"
              >
                Select Stage & Race ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: HOW TO PLAY ================= */}
      {activeModal === 'howToPlay' && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-2xl text-left relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-5">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📖</span>
                <h3 className="text-lg sm:text-xl font-black text-black tracking-wider uppercase">
                  HOW TO PLAY
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-black text-white hover:bg-neutral-800 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Demo Box */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-black/20 mb-5 text-center">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                Stroop Effect Example
              </span>
              <div className="text-3xl font-black text-blue-600 my-1">
                RED
              </div>
              <div className="text-xs text-neutral-600 mt-1">
                Word says <b>RED</b>, but color is <b className="text-blue-600">BLUE</b> → Click <b>BLUE</b>!
              </div>
            </div>

            <ol className="space-y-3.5 text-xs sm:text-sm text-neutral-800 font-semibold mb-6">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <b>Look at the ink color</b> of the word, ignore what the text actually spells.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <b>Pick the matching color button</b> or use keyboard numbers <kbd className="px-1.5 py-0.5 bg-neutral-200 rounded font-mono text-[11px]">1</kbd> - <kbd className="px-1.5 py-0.5 bg-neutral-200 rounded font-mono text-[11px]">6</kbd>.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <b>Maintain speed & accuracy</b> to unlock high scores and race certificates!
                </span>
              </li>
            </ol>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs tracking-widest uppercase transition-all cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: EXIT ================= */}
      {activeModal === 'exit' && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm bg-white border-2 border-black rounded-2xl p-6 shadow-2xl text-center relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-neutral-100 border border-black/20 flex items-center justify-center text-xl mx-auto mb-3">
              ↪
            </div>
            <h3 className="text-lg font-black text-black tracking-wider uppercase mb-1">
              EXIT GAME
            </h3>
            <p className="text-xs text-neutral-600 mb-5">
              Ready to take a break or reset session? You can close this tab or restart anytime!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-black/80 text-black hover:bg-neutral-100 font-extrabold text-xs tracking-wider uppercase cursor-pointer"
              >
                Stay Here
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  if (onExitGame) {
                    onExitGame();
                  } else {
                    window.location.reload();
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs tracking-wider uppercase cursor-pointer"
              >
                {onExitGame ? "Back to Games" : "Refresh"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

