import React, { useState } from 'react';
import { soundFx } from '../utils/audio';
import {
  ArrowLeft,
  Lock,
  Play,
  CheckCircle2,
  Star,
  Trophy,
  Award,
  RefreshCw,
  User,
  Volume2,
  VolumeX
} from 'lucide-react';
import nebuloidLogo from '../assets/nebuloid-logo.png';
import CertificateModal from './CertificateModal';

// Geometric Corner Accent: Top-Left Diagonal Stripes
const CornerStripesTopLeft = () => (
  <div className="absolute top-0 left-0 w-20 h-20 sm:w-32 sm:h-32 pointer-events-none select-none z-0">
    <svg viewBox="0 0 140 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="level-tl-clip">
          <polygon points="0,0 140,0 0,140" />
        </clipPath>
      </defs>
      <g clipPath="url(#level-tl-clip)">
        <polygon points="0,0 140,0 0,140" fill="#0a0a0a" />
        <line x1="-30" y1="10" x2="70" y2="110" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="-15" y1="25" x2="85" y2="125" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="0" y1="40" x2="100" y2="140" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="15" y1="55" x2="115" y2="155" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="30" y1="70" x2="130" y2="170" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  </div>
);

// Geometric Corner Accent: Bottom-Right Diagonal Stripes
const CornerStripesBottomRight = () => (
  <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-32 sm:h-32 pointer-events-none select-none z-0">
    <svg viewBox="0 0 140 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="level-br-clip">
          <polygon points="140,140 0,140 140,0" />
        </clipPath>
      </defs>
      <g clipPath="url(#level-br-clip)">
        <polygon points="140,140 0,140 140,0" fill="#0a0a0a" />
        <line x1="10" y1="-30" x2="110" y2="70" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="25" y1="-15" x2="125" y2="85" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="40" y1="0" x2="140" y2="100" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="55" y1="15" x2="155" y2="115" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="70" y1="30" x2="170" y2="130" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  </div>
);

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', tag: 'Beginner', desc: 'Simple 2-emoji combinations', icon: '🟢' },
  { id: 'medium', label: 'Medium', tag: 'Intermediate', desc: 'Popular phrases & movies', icon: '🟡' },
  { id: 'hard', label: 'Hard', tag: 'Advanced', desc: 'Idioms & tricky compound words', icon: '🟠' },
  { id: 'expert', label: 'Expert', tag: 'Grandmaster', desc: 'Cryptic 3-emoji brain teasers', icon: '🔴' },
];

const Level = ({
  userName = 'Player',
  progress = {},
  selectedDifficulty = 'easy',
  onSelectDifficulty,
  onSelectLevel,
  onBackToHome,
  onResetProgress,
  onOpenCertificates,
  isMuted = false,
  onToggleMute,
}) => {
  const [activeTab, setActiveTab] = useState(selectedDifficulty);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  const currentDiffProgress = progress[activeTab] || {
    unlockedLevels: 1,
    completedLevels: {},
  };

  const handleTabChange = (diffId) => {
    soundFx.playClick();
    setActiveTab(diffId);
    if (onSelectDifficulty) {
      onSelectDifficulty(diffId);
    }
  };

  const handleLevelClick = (levelNum) => {
    const isUnlocked = levelNum <= currentDiffProgress.unlockedLevels;
    if (isUnlocked) {
      soundFx.playClick();
      onSelectLevel(activeTab, levelNum);
    } else {
      soundFx.playWrong();
    }
  };

  const totalScore = progress.totalScore || 0;

  return (
    <div className="relative min-h-screen w-full bg-[#f8f9fa] flex flex-col justify-between items-center px-4 py-5 font-['Outfit',sans-serif] select-none overflow-x-hidden">
      <CornerStripesTopLeft />
      <CornerStripesBottomRight />

      {/* Top Header */}
      <header className="w-full max-w-4xl flex justify-between items-center z-20 border-b border-neutral-200/80 pb-3">
        {/* Back Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onBackToHome();
          }}
          className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-neutral-900 bg-white border-2 border-neutral-900 px-3.5 py-1.5 rounded-xl hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        {/* Center Logo */}
        <div className="flex items-center gap-2">
          <img src={nebuloidLogo} alt="Logo" className="h-8 w-auto object-contain" />
          <span className="hidden sm:inline text-xs font-black tracking-[0.25em] text-black uppercase">
            NEBULOID TECH
          </span>
        </div>

        {/* User Info & Score */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white border-2 border-neutral-900 px-3 py-1 rounded-xl shadow-xs">
            <User className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-xs font-extrabold text-neutral-900 uppercase max-w-[90px] sm:max-w-none truncate">
              {userName}
            </span>
          </div>

          <div className="bg-black text-white px-3 py-1.5 rounded-xl text-xs font-extrabold tracking-wider flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalScore}</span>
          </div>

          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-200 cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Level Selection Content */}
      <main className="w-full max-w-4xl flex flex-col items-center my-auto z-10 py-4">
        
        {/* Title */}
        <div className="text-center mb-6">
          <div className="text-[10px] sm:text-xs font-black tracking-[0.28em] text-neutral-500 uppercase">
            CHOOSE YOUR CHALLENGE
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight uppercase mt-0.5">
            SELECT LEVEL
          </h1>
        </div>

        {/* Difficulty Tabs (Easy, Medium, Hard, Expert) */}
        <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {DIFFICULTIES.map((diff) => {
            const isSelected = activeTab === diff.id;
            const diffProg = progress[diff.id] || { unlockedLevels: 1, completedLevels: {} };
            const completedCount = Object.keys(diffProg.completedLevels || {}).length;

            return (
              <button
                key={diff.id}
                onClick={() => handleTabChange(diff.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-md scale-[1.02]'
                    : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-1 text-xs font-bold mb-1">
                  <span>{diff.icon}</span>
                  <span className="font-extrabold uppercase tracking-wider">{diff.label}</span>
                </div>
                <div className={`text-[10px] font-semibold tracking-wider ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {completedCount} / 5 Cleared
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Difficulty Description Box */}
        <div className="w-full max-w-2xl bg-white border border-neutral-300 rounded-xl p-3 mb-6 flex justify-between items-center shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-base">{DIFFICULTIES.find(d => d.id === activeTab)?.icon}</span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-black mr-2">
                {activeTab.toUpperCase()} MODE:
              </span>
              <span className="text-xs text-neutral-600 font-medium">
                {DIFFICULTIES.find(d => d.id === activeTab)?.desc}
              </span>
            </div>
          </div>
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            2 Games / Level
          </div>
        </div>

        {/* 5 Levels Grid */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-5 gap-3.5 mb-6">
          {[1, 2, 3, 4, 5].map((levelNum) => {
            const isUnlocked = levelNum <= currentDiffProgress.unlockedLevels;
            const completedData = currentDiffProgress.completedLevels[levelNum];
            const isCompleted = !!completedData;
            const stars = completedData?.stars || 0;

            return (
              <div
                key={levelNum}
                onClick={() => handleLevelClick(levelNum)}
                className={`relative rounded-2xl border-2 p-4 flex flex-col items-center justify-between min-h-[140px] transition-all cursor-pointer ${
                  !isUnlocked
                    ? 'bg-neutral-100/90 border-neutral-300 text-neutral-400 cursor-not-allowed opacity-75'
                    : isCompleted
                    ? 'bg-white border-black text-black hover:shadow-lg hover:-translate-y-1 hover:border-black'
                    : 'bg-white border-neutral-900 text-black hover:shadow-lg hover:-translate-y-1 ring-2 ring-neutral-900/10'
                }`}
              >
                {/* Top Status Icon */}
                <div className="w-full flex justify-between items-center text-xs">
                  <span className="text-[10px] font-black tracking-widest text-neutral-400">
                    #{levelNum}
                  </span>
                  {!isUnlocked ? (
                    <Lock className="w-4 h-4 text-neutral-400" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                  )}
                </div>

                {/* Main Level Number */}
                <div className="text-center my-2">
                  <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                    L - {levelNum}
                  </div>
                  <div className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500 mt-1">
                    2 Puzzles
                  </div>
                </div>

                {/* Bottom Stars or Play Prompt */}
                <div className="w-full text-center">
                  {!isUnlocked ? (
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Locked
                    </div>
                  ) : isCompleted ? (
                    <div className="flex justify-center items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <Star className={`w-3.5 h-3.5 ${stars >= 3 ? 'fill-amber-400 text-amber-500' : 'text-neutral-300'}`} />
                    </div>
                  ) : (
                    <div className="w-full bg-black text-white text-[10px] font-extrabold tracking-widest uppercase py-1 rounded-lg flex items-center justify-center gap-1">
                      <Play className="w-3 h-3 fill-white" />
                      <span>PLAY</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Controls: Certificates & Reset */}
        <div className="w-full max-w-2xl flex flex-wrap justify-between items-center gap-3 pt-2">
          {/* <button
            onClick={() => {
              soundFx.playClick();
              setShowCertModal(true);
            }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-800 bg-white border-2 border-neutral-900 px-4 py-2 rounded-xl hover:bg-neutral-100 transition-all cursor-pointer shadow-xs"
          >
            <Award className="w-4 h-4 text-neutral-900" />
            <span>View Certificates</span>
          </button> */}

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] tracking-widest text-neutral-500 uppercase font-semibold mt-4">
        Every level contains 2 stages • Reach target score to unlock verified certificates
      </footer>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-black rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl">
            <h4 className="text-base font-black uppercase tracking-wider text-black mb-1">
              Reset All Progress?
            </h4>
            <p className="text-xs text-neutral-600 mb-5">
              This will clear all unlocked levels, stars, and accumulated score.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowResetConfirm(false);
                  if (onResetProgress) onResetProgress();
                }}
                className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:bg-rose-700 cursor-pointer"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowResetConfirm(false);
                }}
                className="flex-1 border-2 border-neutral-300 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verified Certificate Modal */}
      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        userName={userName}
        difficulty={activeTab}
        levelNumber={currentDiffProgress.unlockedLevels}
        score={totalScore}
        stars={3}
      />
    </div>
  );
};

export default Level;