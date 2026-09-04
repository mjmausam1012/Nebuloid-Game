import React, { useState } from 'react';
import nebuloidLogo from '../assets/nebuloid-logo.png';
import { STAGE_CONFIG, STAGES_PER_LEVEL } from '../data/stageConfig';

export default function LevelScreen({
  progression,
  selectedDifficulty = 'EASY',
  onSelectDifficulty,
  onSelectStage,
  onBackToMenu
}) {
  const [activeTab, setActiveTab] = useState(selectedDifficulty || 'EASY');

  const diffProgression = progression[activeTab] || {
    unlockedStage: 1,
    completedStages: {},
    highScores: {}
  };

  const stages = STAGE_CONFIG[activeTab] || STAGE_CONFIG.EASY;

  const handleTabChange = (diffKey) => {
    setActiveTab(diffKey);
    if (onSelectDifficulty) {
      onSelectDifficulty(diffKey);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#f8f8f8] text-black flex flex-col items-center justify-between px-4 py-6 sm:py-8 select-none overflow-hidden font-sans">
      {/* ================= CORNER DECORATIONS ================= */}

      {/* Top-Left Corner: Diagonal Black Corner with 4 White Stripes */}
      <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 pointer-events-none select-none z-0">
        <svg viewBox="0 0 120 120" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <clipPath id="corner-clip-lvl-tl">
              <polygon points="0,0 120,0 0,120" />
            </clipPath>
          </defs>
          <g clipPath="url(#corner-clip-lvl-tl)">
            <polygon points="0,0 120,0 0,120" fill="#0a0a0a" />
            <line x1="-10" y1="30" x2="30" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="-10" y1="55" x2="55" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="-10" y1="80" x2="80" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="-10" y1="105" x2="105" y2="-10" stroke="#f8f8f8" strokeWidth="4.5" />
          </g>
        </svg>
      </div>

      {/* Top-Right Corner: Dot Matrix Grid (4 columns x 5 rows) */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 grid grid-cols-4 gap-2 sm:gap-2.5 pointer-events-none select-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`dot-tr-${i}`} className="w-1.5 h-1.5 rounded-full bg-black/85" />
        ))}
      </div>

      {/* Bottom-Left Corner: Dot Matrix Grid (4 columns x 5 rows) */}
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 grid grid-cols-4 gap-2 sm:gap-2.5 pointer-events-none select-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`dot-bl-${i}`} className="w-1.5 h-1.5 rounded-full bg-black/85" />
        ))}
      </div>

      {/* Bottom-Right Corner: Diagonal Black Corner with 4 White Stripes */}
      <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 pointer-events-none select-none z-0">
        <svg viewBox="0 0 120 120" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <clipPath id="corner-clip-lvl-br">
              <polygon points="120,120 0,120 120,0" />
            </clipPath>
          </defs>
          <g clipPath="url(#corner-clip-lvl-br)">
            <polygon points="120,120 0,120 120,0" fill="#0a0a0a" />
            <line x1="15" y1="130" x2="130" y2="15" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="40" y1="130" x2="130" y2="40" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="65" y1="130" x2="130" y2="65" stroke="#f8f8f8" strokeWidth="4.5" />
            <line x1="90" y1="130" x2="130" y2="90" stroke="#f8f8f8" strokeWidth="4.5" />
          </g>
        </svg>
      </div>

      {/* ================= TOP HEADER BRANDING ================= */}
      <div className="w-full max-w-2xl flex flex-col items-center z-10 pt-2">
        <img
          src={nebuloidLogo}
          alt="Nebuloid Tech"
          className="w-22 sm:w-22 h-auto object-contain pointer-events-none mb-1"
        />
        <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase mt-1">
          SELECT LEVEL & STAGE
        </h2>
        <div className="flex items-center justify-center gap-3 w-full max-w-[240px] sm:max-w-xs mt-1 text-[9px] sm:text-[10px] font-extrabold text-black tracking-widest uppercase">
          <div className="h-[1.5px] bg-black/80 flex-1"></div>
          <span>5 STAGES PER LEVEL</span>
          <div className="h-[1.5px] bg-black/80 flex-1"></div>
        </div>
      </div>

      {/* ================= LEVEL TABS (EASY, MEDIUM, HARD) ================= */}
      <div className="w-full max-w-xl z-10 my-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 bg-neutral-200/70 border-2 border-black rounded-2xl">
          {[
            { id: 'EASY', label: 'EASY', choices: '4 Choices' },
            { id: 'MEDIUM', label: 'MEDIUM', choices: '5 Choices' },
            { id: 'HARD', label: 'HARD', choices: '6 Choices' }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-2.5 sm:py-3 px-2 rounded-xl text-center transition-all duration-150 cursor-pointer flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-black text-white shadow-md font-black scale-[1.02]'
                    : 'bg-white/80 hover:bg-white text-black font-extrabold border border-black/20'
                }`}
              >
                <span className="text-xs sm:text-sm tracking-widest uppercase">{tab.label}</span>
                <span className={`text-[10px] tracking-wide mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {tab.choices}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= STAGE CARDS GRID (S-1 to S-5) ================= */}
      <div className="w-full max-w-xl z-10 flex flex-col gap-2.5 sm:gap-3 my-auto">
        {stages.map((stageObj) => {
          const isUnlocked = stageObj.stage <= diffProgression.unlockedStage;
          const starsEarned = diffProgression.completedStages[stageObj.stage] || 0;
          const isCompleted = starsEarned > 0;
          const highScore = diffProgression.highScores[stageObj.stage] || 0;

          return (
            <div
              key={stageObj.id}
              onClick={() => {
                if (isUnlocked) {
                  onSelectStage(activeTab, stageObj.stage);
                }
              }}
              className={`w-full relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-150 ${
                isUnlocked
                  ? isCompleted
                    ? 'bg-neutral-900 hover:bg-neutral-800 text-white border-black shadow-md cursor-pointer group hover:scale-[1.01]'
                    : 'bg-white hover:bg-neutral-50 text-black border-black shadow-sm cursor-pointer group hover:scale-[1.01]'
                  : 'bg-neutral-100 text-neutral-400 border-neutral-300 cursor-not-allowed opacity-75'
              }`}
            >
              {/* Left: Stage ID & Info */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Stage Badge */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm sm:text-base border-2 shrink-0 ${
                    isUnlocked
                      ? isCompleted
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-white border-black'
                      : 'bg-neutral-200 text-neutral-400 border-neutral-300'
                  }`}
                >
                  {stageObj.id}
                </div>

                {/* Stage Description */}
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm sm:text-base tracking-wider uppercase">
                      {stageObj.title}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500 text-black font-black uppercase">
                        CLEARED ✓
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] sm:text-xs mt-0.5 font-semibold ${isUnlocked && !isCompleted ? 'text-neutral-600' : isCompleted ? 'text-neutral-300' : 'text-neutral-400'}`}>
                    Target: {stageObj.targetQuestions} Questions • {stageObj.timeLimit}s Time
                  </span>
                </div>
              </div>

              {/* Right: Action or Locked Indicator */}
              <div className="flex items-center gap-2">
                {isUnlocked ? (
                  <div className="flex items-center gap-2">
                    {highScore > 0 && (
                      <span className={`text-xs font-bold hidden sm:inline ${isCompleted ? 'text-amber-300' : 'text-neutral-600'}`}>
                        High: {highScore} pts
                      </span>
                    )}
                    <button
                      className={`py-1.5 px-4 rounded-lg font-black text-xs tracking-wider uppercase flex items-center gap-1.5 transition-all ${
                        isCompleted
                          ? 'bg-white text-black hover:bg-neutral-200'
                          : 'bg-black text-white hover:bg-neutral-800'
                      }`}
                    >
                      <span>▶</span>
                      <span>{isCompleted ? 'REPLAY' : 'PLAY'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 px-3 py-1 rounded-lg bg-neutral-200 border border-neutral-300">
                    <span>🔒</span>
                    <span>LOCKED</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= BOTTOM NAVIGATION ================= */}
      <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center z-10 pt-4 pb-1">
        <button
          onClick={onBackToMenu}
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
          <span className="text-center font-black">BACK TO MENU</span>
        </button>
      </div>
    </div>
  );
}
