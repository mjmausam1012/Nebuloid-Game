import React, { useState, useEffect } from "react";
import nebuloidLogo from "../assets/nebuloid-logo.png";
import { soundFx } from "../utils/audio";
import { getCertificatesHistory } from "../utils/storage";
import CertificateHistoryModal from "./CertificateHistoryModal";
import CertificateModal from "./CertificateModal";
import {
  Play,
  Award,
  Info,
  CornerDownLeft,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

// Geometric Corner Accent: Top-Left Diagonal Stripes
const CornerStripesTopLeft = () => (
  <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 pointer-events-none select-none z-10">
    <svg
      viewBox="0 0 140 140"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="corner-tl-clip">
          <polygon points="0,0 140,0 0,140" />
        </clipPath>
      </defs>
      <g clipPath="url(#corner-tl-clip)">
        <polygon points="0,0 140,0 0,140" fill="#0a0a0a" />
        <line
          x1="-30"
          y1="10"
          x2="70"
          y2="110"
          stroke="#f8f9fa"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="-15"
          y1="25"
          x2="85"
          y2="125"
          stroke="#f8f9fa"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="40"
          x2="100"
          y2="140"
          stroke="#f8f9fa"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="15"
          y1="55"
          x2="115"
          y2="155"
          stroke="#f8f9fa"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="30"
          y1="70"
          x2="130"
          y2="170"
          stroke="#f8f9fa"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  </div>
);

// Geometric Corner Accent: Bottom-Right Diagonal Stripes
const CornerStripesBottomRight = () => (
  <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 pointer-events-none select-none z-10">
    <svg
      viewBox="0 0 140 140"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="corner-br-clip">
          <polygon points="140,140 0,140 140,0" />
        </clipPath>
      </defs>
      <g clipPath="url(#corner-br-clip)">
        <polygon points="140,140 0,140 140,0" fill="#0a0a0a" />
        <line
          x1="10"
          y1="-30"
          x2="110"
          y2="70"
          stroke="#f8f9fa"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="-15"
          x2="125"
          y2="85"
          stroke="#f8f9fa"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="40"
          y1="0"
          x2="140"
          y2="100"
          stroke="#f8f9fa"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="55"
          y1="15"
          x2="155"
          y2="115"
          stroke="#f8f9fa"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="70"
          y1="30"
          x2="170"
          y2="130"
          stroke="#f8f9fa"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  </div>
);

// Geometric Corner Accent: Dot Matrix Pattern
const DotGrid = ({ className = "" }) => {
  const rows = 6;
  const cols = 4;
  return (
    <div
      className={`grid grid-cols-4 gap-2 sm:gap-2.5 pointer-events-none select-none z-10 ${className}`}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-800/85" />
      ))}
    </div>
  );
};

const HomeScreen = ({ onStartGame, onExit, isMuted = false, onToggleMute }) => {
  const [activeModal, setActiveModal] = useState(null); // 'certificates' | 'howToPlay' | 'exit' | null
  const [certificatesHistory, setCertificatesHistory] = useState([]);
  const [selectedPreviewCert, setSelectedPreviewCert] = useState(null);
  const [testDemoAnswer, setTestDemoAnswer] = useState("");
  const [testDemoSuccess, setTestDemoSuccess] = useState(null);

  // Load certificate history on modal open or mount
  useEffect(() => {
    setCertificatesHistory(getCertificatesHistory());
  }, [activeModal]);

  // When user clicks START PUZZLE -> directly open level select
  const handleStartPuzzleClick = () => {
    soundFx.playClick();
    onStartGame();
  };

  const handleButtonClick = (modalType) => {
    soundFx.playClick();
    if (modalType === "certificates") {
      setCertificatesHistory(getCertificatesHistory());
    }
    setActiveModal(modalType);
  };

  const handleDemoCheck = (e) => {
    e.preventDefault();
    if (testDemoAnswer.trim().toLowerCase() === "popcorn") {
      setTestDemoSuccess(true);
      soundFx.playCorrect();
    } else {
      setTestDemoSuccess(false);
      soundFx.playWrong();
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-[#f8f9fa] flex flex-col justify-between items-center px-4 py-6 sm:py-8 overflow-hidden select-none font-['Outfit',sans-serif]">
      {/* Decorative Geometric Corner Elements */}
      <CornerStripesTopLeft />
      <CornerStripesBottomRight />

      {/* Dot Grid Top Right */}
      <DotGrid className="absolute top-6 right-6 sm:top-8 sm:right-10 md:top-12 md:right-14" />

      {/* Dot Grid Bottom Left */}
      <DotGrid className="absolute bottom-6 left-6 sm:bottom-8 sm:left-10 md:bottom-12 md:left-14" />

      {/* Floating subtle background ambient emoji particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <span className="absolute top-24 left-1/4 text-2xl animate-bounce delay-700">
          🧩
        </span>
        <span className="absolute top-40 right-1/4 text-xl animate-pulse delay-300">
          💡
        </span>
        <span className="absolute bottom-32 left-1/3 text-2xl animate-bounce delay-1000">
          🎯
        </span>
        <span className="absolute bottom-28 right-1/3 text-xl animate-pulse delay-500">
          🏆
        </span>
      </div>

      {/* Top Header Controls (Sound Toggle) */}
      <header className="w-full max-w-4xl flex justify-between items-center z-20 px-2 sm:px-6">
        <div className="w-10"></div>

        {/* Sound toggle */}
        <button
          onClick={() => {
            soundFx.playClick();
            if (onToggleMute) onToggleMute();
          }}
          className="p-2.5 rounded-full text-neutral-700 hover:text-black hover:bg-neutral-200/70 active:scale-95 transition-all cursor-pointer"
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
          aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-neutral-400" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      </header>

      {/* Main Center Content Container */}
      <div className="w-full max-w-md flex flex-col items-center justify-center my-auto z-20">
        {/* 1. NEBULOID TECH Branding */}
        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8 group">
          <div className="relative">
            <img
              src={nebuloidLogo}
              alt="Nebuloid Tech Logo"
              className="h-16 sm:h-20 md:h-22 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
            />
          </div>

          <h2 className="text-xs sm:text-sm font-extrabold tracking-[0.28em] text-black mt-2.5 uppercase text-center font-['Plus_Jakarta_Sans',sans-serif]">
            NEBULOID TECH
          </h2>

          {/* Underline with Centered Diamond */}
          <div className="flex items-center justify-center gap-2.5 w-44 sm:w-52 mt-1.5 opacity-85">
            <div className="h-[1px] bg-neutral-400 flex-1" />
            <div className="w-2 h-2 rotate-45 border border-neutral-700 bg-transparent" />
            <div className="h-[1px] bg-neutral-400 flex-1" />
          </div>
        </div>

        {/* 2. Main Game Title (2-Tier High-Impact Typography) */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-black leading-none uppercase drop-shadow-sm">
            EMOJI
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[0.38em] text-black mt-1 uppercase text-center pl-2">
            PUZZLE
          </p>

          {/* Tagline flanked by clean horizontal lines */}
          <div className="flex items-center justify-center gap-3 text-[10px] sm:text-xs font-bold tracking-[0.25em] text-neutral-800 uppercase mt-4">
            <span className="h-[1.5px] w-6 sm:w-8 bg-neutral-800 inline-block" />
            <span>GUESS • SOLVE • ACHIEVE</span>
            <span className="h-[1.5px] w-6 sm:w-8 bg-neutral-800 inline-block" />
          </div>
        </div>

        {/* 3. Action Menu Buttons Stack */}
        <div className="w-full flex flex-col gap-3 sm:gap-3.5 px-3 sm:px-0">
          {/* Button 1: START PUZZLE (Primary Solid Black) */}
          <button
            onClick={handleStartPuzzleClick}
            onMouseEnter={() => soundFx.playHover()}
            className="group relative w-full bg-black text-white py-3.5 sm:py-4 px-6 rounded-xl font-extrabold text-sm sm:text-base tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all duration-200 hover:bg-neutral-900 active:scale-[0.98] shadow-md hover:shadow-xl cursor-pointer border-2 border-black"
          >
            <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white transition-transform group-hover:scale-110" />
            <span>START PUZZLE</span>
          </button>

          {/* Button 2: CERTIFICATES (Outlined - Opens Certificate History) */}
          <button
            onClick={() => handleButtonClick("certificates")}
            onMouseEnter={() => soundFx.playHover()}
            className="group w-full bg-white text-black py-3.5 sm:py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-[0.18em] uppercase flex items-center justify-center gap-3 transition-all duration-200 border-2 border-neutral-900 hover:bg-neutral-100 hover:border-black active:scale-[0.98] shadow-xs hover:shadow-md cursor-pointer"
          >
            <Award className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-neutral-900 transition-transform group-hover:scale-110" />
            <span>CERTIFICATES ({certificatesHistory.length})</span>
          </button>

          {/* Button 3: HOW TO PLAY (Outlined) */}
          <button
            onClick={() => handleButtonClick("howToPlay")}
            onMouseEnter={() => soundFx.playHover()}
            className="group w-full bg-white text-black py-3.5 sm:py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-[0.18em] uppercase flex items-center justify-center gap-3 transition-all duration-200 border-2 border-neutral-900 hover:bg-neutral-100 hover:border-black active:scale-[0.98] shadow-xs hover:shadow-md cursor-pointer"
          >
            <Info className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-neutral-900 transition-transform group-hover:scale-110" />
            <span>HOW TO PLAY</span>
          </button>

          {/* Button 4: EXIT (Outlined) */}
          {onExit && (
            <button
              onClick={() => handleButtonClick("exit")}
              onMouseEnter={() => soundFx.playHover()}
              className="group w-full bg-white text-black py-3.5 sm:py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-[0.18em] uppercase flex items-center justify-center gap-3 transition-all duration-200 border-2 border-neutral-900 hover:bg-neutral-100 hover:border-black active:scale-[0.98] shadow-xs hover:shadow-md cursor-pointer"
            >
              <CornerDownLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-neutral-900 transition-transform group-hover:scale-110" />
              <span>EXIT GAME</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Footer Note */}
      <footer className="w-full text-center z-20 mt-6 sm:mt-8">
        <p className="text-[10px] sm:text-xs tracking-wider text-neutral-700 font-medium flex items-center justify-center gap-1.5">
          <span className="text-[9px] text-neutral-900">▲</span>
          <span>Every genuine target unlocks a personalized certificate.</span>
          <span className="text-[9px] text-neutral-900">▲</span>
        </p>
      </footer>

      {/* ========================================================== */}
      {/* MODAL 1: CERTIFICATES HISTORY SHOWCASE */}
      {/* ========================================================== */}
      <CertificateHistoryModal
        isOpen={activeModal === "certificates"}
        onClose={() => setActiveModal(null)}
        certificates={certificatesHistory}
        onOpenCertificatePreview={(cert) => {
          setSelectedPreviewCert(cert);
        }}
      />

      {/* Single Certificate Preview from History */}
      {selectedPreviewCert && (
        <CertificateModal
          isOpen={!!selectedPreviewCert}
          onClose={() => setSelectedPreviewCert(null)}
          userName={selectedPreviewCert.userName}
          difficulty={selectedPreviewCert.difficulty}
          levelNumber={selectedPreviewCert.levelNumber}
          score={selectedPreviewCert.score}
          stars={selectedPreviewCert.stars}
          date={selectedPreviewCert.date}
          certificateId={selectedPreviewCert.certificateId}
        />
      )}

      {/* ========================================================== */}
      {/* MODAL 2: HOW TO PLAY */}
      {/* ========================================================== */}
      {activeModal === "howToPlay" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-neutral-900 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-neutral-200 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-neutral-900" />
                <h3 className="font-extrabold text-base tracking-wider uppercase text-neutral-900">
                  How To Play
                </h3>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveModal(null);
                }}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction Steps */}
            <div className="space-y-2.5 mb-4">
              <div className="flex items-start gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <h5 className="font-bold text-xs text-neutral-900 uppercase">
                    Select Difficulty & Level
                  </h5>
                  <p className="text-[11px] text-neutral-600">
                    Choose from Easy, Medium, Hard, or Expert. Each difficulty
                    has 5 levels.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-xs text-neutral-900 uppercase">
                    Solve 2 Puzzles Per Level
                  </h5>
                  <p className="text-[11px] text-neutral-600">
                    Every level contains 2 stages. Complete both stages to
                    unlock the next level!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-xs text-neutral-900 uppercase">
                    Enter Name & Generate Certificate
                  </h5>
                  <p className="text-[11px] text-neutral-600">
                    After clearing both stages, enter your name to generate your
                    verified certificate with PDF download!
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Interactive Mini-Demo */}
            <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-300">
              <div className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase mb-1 text-center">
                TRY A QUICK EXAMPLE:
              </div>
              <div className="flex items-center justify-center gap-2 text-xl my-1 font-bold">
                <span>🍿</span>
                <span>+</span>
                <span>🌽</span>
                <span>=</span>
                <span className="text-sm font-black text-neutral-900">?</span>
              </div>
              <form onSubmit={handleDemoCheck} className="flex gap-2 mt-1.5">
                <input
                  type="text"
                  value={testDemoAnswer}
                  onChange={(e) => setTestDemoAnswer(e.target.value)}
                  placeholder="Type answer (e.g. popcorn)..."
                  className="flex-1 px-3 py-1 text-xs rounded-lg border border-neutral-300 bg-white outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-3 py-1 rounded-lg text-xs font-bold uppercase hover:bg-neutral-800 cursor-pointer"
                >
                  Test
                </button>
              </form>
              {testDemoSuccess === true && (
                <div className="text-[11px] font-bold text-emerald-600 mt-1 text-center flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Correct! You are
                  ready to play.
                </div>
              )}
              {testDemoSuccess === false && (
                <div className="text-[11px] font-bold text-rose-600 mt-1 text-center">
                  Try typing "popcorn"!
                </div>
              )}
            </div>

            <div className="mt-3">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveModal(null);
                }}
                className="w-full bg-black text-white py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-neutral-800 cursor-pointer"
              >
                Got It, Let's Play!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 3: EXIT CONFIRMATION */}
      {/* ========================================================== */}
      {activeModal === "exit" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-neutral-900 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-900">
              <CornerDownLeft className="w-6 h-6" />
            </div>

            <h4 className="text-base font-extrabold uppercase tracking-wide text-neutral-900 mb-1">
              Exit Emoji Puzzle?
            </h4>
            <p className="text-xs text-neutral-600 mb-5">
              Are you sure you want to exit the game session?
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveModal(null);
                  if (onExit) onExit();
                }}
                className="flex-1 bg-black text-white py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-neutral-800 cursor-pointer"
              >
                Yes, Exit
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveModal(null);
                }}
                className="flex-1 border-2 border-neutral-300 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-neutral-100 text-neutral-700 cursor-pointer"
              >
                Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default HomeScreen;
