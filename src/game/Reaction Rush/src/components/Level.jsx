import React, { useState, useEffect } from "react";
import { initialLevels } from "../data/levelData";

const Level = ({
  levelData: externalLevelData,
  initialTab = "easy",
  onBack,
  onSelectStage,
  onResetProgress,
  onLeaderboard,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [levelData, setLevelData] = useState(() => {
    if (externalLevelData) return externalLevelData;
    const saved = localStorage.getItem("reaction_rush_levels");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((lvl) => ({
          ...lvl,
          stages: lvl.stages.map((st) => ({ ...st, locked: false })),
        }));
      } catch {
        // fallback
      }
    }
    return initialLevels.map((lvl) => ({
      ...lvl,
      stages: lvl.stages.map((st) => ({ ...st, locked: false })),
    }));
  });
  const [activeModal, setActiveModal] = useState(null);
  const [lockedAlert, setLockedAlert] = useState(null);

  // Sync with externalLevelData if updated outside
  useEffect(() => {
    if (externalLevelData) {
      setLevelData(externalLevelData);
    }
  }, [externalLevelData]);

  // Sync initial tab when returning from game
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Ensure all stages are unlocked in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("reaction_rush_levels");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const allUnlocked = parsed.map((lvl) => ({
          ...lvl,
          stages: lvl.stages.map((st) => ({ ...st, locked: false })),
        }));
        localStorage.setItem(
          "reaction_rush_levels",
          JSON.stringify(allUnlocked),
        );
        setLevelData(allUnlocked);
      } catch {
        localStorage.setItem(
          "reaction_rush_levels",
          JSON.stringify(initialLevels),
        );
        setLevelData(initialLevels);
      }
    } else {
      localStorage.setItem(
        "reaction_rush_levels",
        JSON.stringify(initialLevels),
      );
      setLevelData(initialLevels);
    }
  }, []);

  // Save to localStorage whenever levelData changes
  useEffect(() => {
    localStorage.setItem("reaction_rush_levels", JSON.stringify(levelData));
  }, [levelData]);

  const effectiveLevels = externalLevelData || levelData;
  const currentLevel =
    effectiveLevels.find((l) => l.id === activeTab) || effectiveLevels[0];

  const handlePlayStage = (stage) => {
    if (onSelectStage) {
      onSelectStage({ level: currentLevel.id, stage: stage.id });
    } else {
      console.log(`Starting ${currentLevel.name} - ${stage.name}`);
    }
  };

  const handleReset = () => {
    setActiveModal("reset");
  };

  const confirmReset = () => {
    const resetData = initialLevels.map((lvl) => ({
      ...lvl,
      cleared: 0,
      stages: lvl.stages.map((st) => ({
        ...st,
        locked: false,
        best: "00.00s",
        stars: 0,
      })),
    }));
    setLevelData(resetData);
    localStorage.setItem("reaction_rush_levels", JSON.stringify(resetData));
    if (onResetProgress) {
      onResetProgress(resetData);
    }
    setActiveModal(null);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#f3f4f7] flex flex-col justify-between items-center overflow-hidden select-none py-5 px-3 sm:px-6 font-sans">
      {/* Self-contained CSS for high-tech racing typography & styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&family=Outfit:wght@500;600;700;800;900&display=swap');
        
        .font-racing {
          font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .font-branding {
          font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        }

        @keyframes tabGlow {
          0%, 100% {
            box-shadow: 0 0 18px rgba(229, 27, 36, 0.35), 0 0 35px rgba(229, 27, 36, 0.15);
          }
          50% {
            box-shadow: 0 0 25px rgba(229, 27, 36, 0.55), 0 0 45px rgba(229, 27, 36, 0.25);
          }
        }

        .active-tab-glow {
          animation: tabGlow 2.5s infinite ease-in-out;
        }
      `}</style>

      {/* =========================================================================
          BACKGROUND DECORATIONS (High-Tech Accents matching reference UI)
         ========================================================================= */}

      {/* Top-Left Corner Racing Stripes */}
      <div className="absolute top-0 left-0 w-36 h-36 sm:w-48 sm:h-48 pointer-events-none z-0">
        <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
          <line
            x1="-15"
            y1="80"
            x2="80"
            y2="-15"
            stroke="#e51b24"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="-5"
            y1="60"
            x2="60"
            y2="-5"
            stroke="#0a0a0d"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <line
            x1="5"
            y1="38"
            x2="38"
            y2="5"
            stroke="#e51b24"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="20"
            x2="20"
            y2="12"
            stroke="#0a0a0d"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom-Right Corner Racing Wedge & Red Target Watermark */}
      <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 220 220"
          className="w-full h-full absolute bottom-0 right-0"
          fill="none"
        >
          {/* Black corner wedge */}
          <polygon points="220,20 60,220 220,220" fill="#08080a" />
          {/* Red and white diagonal stripes */}
          <line
            x1="130"
            y1="0"
            x2="220"
            y2="90"
            stroke="#e51b24"
            strokeWidth="5"
          />
          <line
            x1="150"
            y1="0"
            x2="220"
            y2="70"
            stroke="#ffffff"
            strokeWidth="3.5"
          />
          <line
            x1="170"
            y1="0"
            x2="220"
            y2="50"
            stroke="#ffffff"
            strokeWidth="3.5"
          />
          <line
            x1="90"
            y1="180"
            x2="130"
            y2="220"
            stroke="#e51b24"
            strokeWidth="4"
          />
        </svg>
      </div>

      {/* Bottom-Right Concentric Red Target Watermark */}
      <div className="absolute bottom-3 right-5 sm:bottom-6 sm:right-8 pointer-events-none z-0">
        <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
          <circle
            cx="55"
            cy="55"
            r="48"
            stroke="#e51b24"
            strokeWidth="5"
            opacity="0.85"
          />
          <circle
            cx="55"
            cy="55"
            r="32"
            stroke="#e51b24"
            strokeWidth="4"
            opacity="0.9"
          />
          <circle cx="55" cy="55" r="16" fill="#e51b24" />
        </svg>
      </div>

      {/* Far Left Watermark: Big Concentric Target & Red Ring */}
      <div className="absolute left-[-80px] sm:left-[-40px] top-1/3 -translate-y-1/2 pointer-events-none z-0">
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          fill="none"
          className="opacity-70"
        >
          <circle
            cx="160"
            cy="160"
            r="145"
            stroke="#d5dae2"
            strokeWidth="1.2"
          />
          <circle
            cx="160"
            cy="160"
            r="105"
            stroke="#cbd1dc"
            strokeWidth="1.5"
          />
          <circle cx="160" cy="160" r="68" stroke="#d5dae2" strokeWidth="1.2" />
          {/* Bold Red Target Ring on left */}
          <circle
            cx="160"
            cy="160"
            r="34"
            stroke="#e51b24"
            strokeWidth="8"
            fill="none"
          />
        </svg>
      </div>

      {/* Dotted Grid Matrices */}
      <div className="absolute top-16 right-6 sm:right-10 grid grid-cols-3 gap-2 pointer-events-none z-0 opacity-60">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
        ))}
      </div>
      <div className="absolute bottom-16 left-6 sm:left-10 grid grid-cols-3 gap-2 pointer-events-none z-0 opacity-60">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
        ))}
      </div>

      {/* Tiny Red Crosses scattered */}
      <span className="absolute top-1/4 left-10 text-[#e51b24] font-bold text-sm pointer-events-none opacity-80">
        ✕
      </span>
      <span className="absolute top-2/3 right-10 text-[#e51b24] font-bold text-sm pointer-events-none opacity-80">
        ✕
      </span>
      <span className="absolute top-1/2 left-8 text-[#e51b24] font-bold text-xs pointer-events-none opacity-80">
        +
      </span>
      <span className="absolute bottom-28 right-16 text-[#e51b24] font-bold text-xs pointer-events-none opacity-80">
        +
      </span>

      {/* =========================================================================
          TOP HEADER SECTION: BACK BUTTON | REACTION RUSH TITLE | BEST SCORE
         ========================================================================= */}
      <div className="w-full max-w-6xl flex items-center justify-between relative z-10 mb-2 sm:mb-4">
        {/* Left: Back Button */}
        <button
          type="button"
          onClick={() => (onBack ? onBack() : console.log("Back clicked"))}
          className="h-10 sm:h-11 px-4 sm:px-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm hover:bg-neutral-50 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-150 flex items-center gap-2 cursor-pointer group"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-neutral-900 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="font-branding font-black text-xs sm:text-sm text-neutral-900 tracking-wider uppercase">
            BACK
          </span>
        </button>

        {/* Center: REACTION RUSH Branding */}
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            {/* "REACTION" with Target 'O' */}
            <div className="flex items-center font-racing font-black italic tracking-tight text-[22px] sm:text-[30px] md:text-[34px] leading-none text-[#0e1015]">
              <span>REACTI</span>
              {/* Target 'O' */}
              <div className="relative inline-flex items-center justify-center mx-[1px] sm:mx-[2px] -skew-x-[12deg] w-[22px] h-[22px] sm:w-[28px] sm:h-[28px]">
                <svg viewBox="0 0 76 76" className="w-full h-full" fill="none">
                  <circle
                    cx="38"
                    cy="38"
                    r="32"
                    stroke="#0e1015"
                    strokeWidth="7"
                  />
                  <circle
                    cx="38"
                    cy="38"
                    r="19"
                    stroke="#0e1015"
                    strokeWidth="3.5"
                  />
                  <line
                    x1="38"
                    y1="3"
                    x2="38"
                    y2="73"
                    stroke="#e51b24"
                    strokeWidth="2.5"
                  />
                  <line
                    x1="3"
                    y1="38"
                    x2="73"
                    y2="38"
                    stroke="#e51b24"
                    strokeWidth="2.5"
                  />
                  <circle cx="38" cy="38" r="7" fill="#e51b24" />
                </svg>
              </div>
              <span>N</span>
            </div>

            {/* "RUSH" with Speed Streaks */}
            <div className="flex items-center ml-1.5 sm:ml-2">
              <div className="flex flex-col items-end gap-[2.5px] mr-1 sm:mr-1.5 -skew-x-[12deg]">
                <div className="w-2.5 sm:w-3.5 h-[2px] bg-[#e51b24] rounded-full" />
                <div className="w-4 sm:w-6 h-[2.2px] bg-[#e51b24] rounded-full" />
                <div className="w-3 sm:w-4.5 h-[2px] bg-[#e51b24] rounded-full" />
              </div>
              <span className="font-racing font-black italic tracking-tight text-[24px] sm:text-[32px] md:text-[36px] leading-none text-[#e51b24]">
                RUSH
              </span>
            </div>
          </div>

          {/* Sub-tagline */}
          <span className="font-branding text-[8.5px] sm:text-[10px] font-black tracking-[0.22em] text-neutral-800 uppercase mt-0.5">
            TEST YOUR SPEED. BEAT YOUR BEST.
          </span>
        </div>

        {/* Right: Best Score Badge */}
        <div className="h-10 sm:h-11 px-3 sm:px-4 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex items-center gap-2.5 sm:gap-3">
          {/* Red Star Icon */}
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 sm:w-5 sm:h-5 fill-[#e51b24] text-[#e51b24]"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      </div>

      {/* =========================================================================
          MAIN CHALLENGE & DIFFICULTY SECTION
         ========================================================================= */}
      <div className="w-full max-w-6xl flex flex-col items-center relative z-10 my-auto">
        {/* Title: CHOOSE YOUR CHALLENGE / SELECT LEVEL */}
        <div className="flex flex-col items-center mb-5 sm:mb-6">
          {/* Subtitle with dashes: ─── CHOOSE YOUR CHALLENGE ─── */}
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 sm:w-8 h-[1.5px] bg-[#e51b24]" />
            <span className="font-branding font-black text-[10px] sm:text-[11.5px] tracking-[0.25em] text-[#e51b24] uppercase">
              CHOOSE YOUR CHALLENGE
            </span>
            <span className="w-4 sm:w-8 h-[1.5px] bg-[#e51b24]" />
          </div>

          {/* Main Title: SELECT LEVEL */}
          <h1 className="font-racing font-black text-3xl sm:text-4xl md:text-[46px] tracking-tight leading-none uppercase">
            <span className="text-[#0a0a0d]">SELECT </span>
            <span className="text-[#e51b24]">LEVEL</span>
          </h1>

          {/* Delicate Divider with miniature target */}
          <div className="flex items-center gap-2 mt-2 opacity-70">
            <div className="w-12 sm:w-20 h-[1px] bg-neutral-400" />
            <div className="w-2.5 h-2.5 rounded-full border border-[#e51b24] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#e51b24]" />
            </div>
            <div className="w-12 sm:w-20 h-[1px] bg-neutral-400" />
          </div>
        </div>

        {/* 4 Difficulty Mode Tabs (EASY, MEDIUM, HARD, EXPERT) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full mb-4 sm:mb-5">
          {effectiveLevels.map((lvl) => {
            const isActive = activeTab === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setActiveTab(lvl.id)}
                className={`relative h-[68px] sm:h-[76px] rounded-2xl transition-all duration-200 cursor-pointer flex items-center px-4 sm:px-5 gap-3.5 text-left ${
                  isActive
                    ? "bg-[#0b0c10] text-white active-tab-glow border border-neutral-800 scale-[1.015]"
                    : "bg-white text-neutral-900 border border-neutral-200/90 shadow-sm hover:shadow-md hover:scale-[1.01]"
                }`}
              >
                {/* Mode Icon: Concentric rings matching mode color */}
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 36 36"
                    className="w-full h-full"
                    fill="none"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      stroke={lvl.color}
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="7"
                      stroke={lvl.color}
                      strokeWidth="2.5"
                    />
                    <circle cx="18" cy="18" r="3" fill={lvl.color} />
                  </svg>
                </div>

                {/* Mode Text & Cleared count */}
                <div className="flex flex-col leading-tight">
                  <span
                    className={`font-branding font-black text-sm sm:text-base tracking-wider uppercase ${
                      isActive ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {lvl.name}
                  </span>
                  <span
                    className="font-branding text-[11px] sm:text-xs font-black tracking-wide mt-0.5"
                    style={{ color: lvl.color }}
                  >
                    {lvl.cleared} / {lvl.total} Cleared
                  </span>
                </div>

                {/* Downward notch arrow on active tab */}
                {isActive && (
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[8px] z-20"
                    style={{ borderTopColor: "#0b0c10" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mode Information Card (Dynamically reflects selected level) */}
        <div className="w-full rounded-2xl bg-white border border-neutral-200/90 shadow-sm p-3.5 sm:p-4 mb-4 sm:mb-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
            {/* Mode Name & Description */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 bg-neutral-50 border border-neutral-200/80">
                <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    stroke={currentLevel.color}
                    strokeWidth="2.8"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="7"
                    stroke={currentLevel.color}
                    strokeWidth="2.2"
                  />
                  <line
                    x1="18"
                    y1="2"
                    x2="18"
                    y2="8"
                    stroke={currentLevel.color}
                    strokeWidth="2.5"
                  />
                  <line
                    x1="18"
                    y1="28"
                    x2="18"
                    y2="34"
                    stroke={currentLevel.color}
                    strokeWidth="2.5"
                  />
                  <line
                    x1="2"
                    y1="18"
                    x2="8"
                    y2="18"
                    stroke={currentLevel.color}
                    strokeWidth="2.5"
                  />
                  <line
                    x1="28"
                    y1="18"
                    x2="34"
                    y2="18"
                    stroke={currentLevel.color}
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-branding font-black text-xs sm:text-sm tracking-wide text-neutral-900 uppercase">
                  {currentLevel.modeTitle}
                </span>
                <span className="font-branding text-[11px] sm:text-xs text-neutral-500 font-medium leading-snug">
                  {currentLevel.modeDesc}
                </span>
              </div>
            </div>

            {/* Quick Specs (Pace, Targets, Games per Level) */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
              {/* Pace */}
              <div className="flex items-center gap-2 text-left">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-neutral-800"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <div className="flex flex-col leading-tight">
                  <span className="font-branding font-black text-[11px] sm:text-xs text-neutral-900">
                    {currentLevel.pace}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {currentLevel.paceDesc}
                  </span>
                </div>
              </div>

              {/* Targets */}
              <div className="flex items-center gap-2 text-left">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-neutral-800"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="9" />
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                </svg>
                <div className="flex flex-col leading-tight">
                  <span className="font-branding font-black text-[11px] sm:text-xs text-neutral-900">
                    {currentLevel.targets}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {currentLevel.targetsDesc}
                  </span>
                </div>
              </div>

              {/* Games / Level */}
              <div className="flex items-center gap-1.5">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill={currentLevel.color}
                >
                  <path d="M19 4h-2V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v2a4 4 0 0 0 4 4h.6A6 6 0 0 0 11 16.9V19H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.1A6 6 0 0 0 17.4 13H18a4 4 0 0 0 4-4V7a3 3 0 0 0-3-3zM4 9V7a1 1 0 0 1 1-1h2v4.8A4 4 0 0 1 4 9zm16 0a4 4 0 0 1-3 1.8V6h2a1 1 0 0 1 1 1z" />
                </svg>
                <span
                  className="font-branding font-black text-[11px] sm:text-xs tracking-wider uppercase"
                  style={{ color: currentLevel.color }}
                >
                  {currentLevel.gamesPerLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Locked Stage Warning Alert Banner */}
        {lockedAlert && (
          <div className="w-full mb-3 py-2 px-4 rounded-xl bg-red-50 border border-red-200 text-[#e51b24] font-branding font-bold text-xs flex items-center justify-center gap-2 animate-bounce">
            <span>🔒</span>
            <span>{lockedAlert}</span>
          </div>
        )}

        {/* 5 Stages Cards Grid (L-1, L-2, L-3, L-4, L-5) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
          {currentLevel.stages.map((stage) => {
            const isUnlocked = !stage.locked;
            return (
              <div
                key={stage.id}
                className={`relative rounded-2xl flex flex-col justify-between p-3.5 sm:p-4 transition-all duration-200 min-h-[200px] sm:min-h-[220px] ${
                  isUnlocked
                    ? "bg-white border-[2px] border-emerald-500 shadow-md scale-[1.01]"
                    : "bg-white/90 border border-neutral-200/90 shadow-xs hover:border-neutral-300"
                }`}
              >
                {/* Card Top: Stage Index & Status Icon */}
                <div className="flex items-center justify-between w-full">
                  <span className="font-racing font-black text-xs text-neutral-400">
                    #{stage.id}
                  </span>
                  {isUnlocked ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                </div>

                {/* Center Content: Stage Name (L-1), Stars, Timer or Locked Label */}
                <div className="flex flex-col items-center text-center my-auto">
                  {/* Stage Title: L-1, L-2, etc. */}
                  <span
                    className={`font-racing font-black text-2xl sm:text-3xl tracking-tight leading-none mb-1 ${
                      isUnlocked ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {stage.name}
                  </span>

                  {/* 3 Stars */}
                  <div className="flex items-center gap-1 my-1">
                    {[1, 2, 3].map((star) => (
                      <svg
                        key={star}
                        viewBox="0 0 24 24"
                        className={`w-4 h-4 ${
                          star <= stage.stars
                            ? "fill-amber-400 text-amber-400"
                            : "fill-none text-neutral-300 stroke-neutral-300 stroke-2"
                        }`}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>

                  {/* Best Time or Locked status */}
                  {isUnlocked ? (
                    <div className="flex items-center gap-1.5 mt-1 text-neutral-600">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-3.5 h-3.5 text-neutral-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span className="font-branding text-[11px] font-bold text-neutral-600">
                        Best: {stage.best}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-1 text-neutral-600">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-3.5 h-3.5 text-neutral-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span className="font-branding text-[11px] font-black tracking-wider uppercase text-neutral-700">
                        LOCKED
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Action: PLAY button for unlocked, '2 GAMES' pill for locked */}
                <div className="w-full mt-2">
                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => handlePlayStage(stage)}
                      className="w-full h-9 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/25 hover:brightness-105 active:scale-95 transition-all cursor-pointer font-branding font-black text-xs tracking-wider uppercase"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-3.5 h-3.5 fill-white"
                      >
                        <polygon points="6 3 20 12 6 21" />
                      </svg>
                      <span>PLAY</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePlayStage(stage)}
                      className="w-full h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 text-neutral-600 flex items-center justify-center text-[11px] font-branding font-bold tracking-wide transition-colors cursor-pointer"
                    >
                      {stage.games}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          BOTTOM ROW: RESET PROGRESS | MOTTO SLOGAN BADGE | LEADERBOARD
         ========================================================================= */}
      <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-3 relative z-10 mt-5 mb-1">
        {/* Left: RESET PROGRESS button */}
        <button
          type="button"
          onClick={handleReset}
          className="h-10 px-4 sm:px-5 rounded-full bg-white border border-neutral-300 shadow-sm hover:bg-neutral-50 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-150 flex items-center gap-2 cursor-pointer"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-[#e51b24]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span className="font-branding font-black text-[11px] text-neutral-800 tracking-wider uppercase">
            RESET PROGRESS
          </span>
        </button>

        {/* Center: MOTTO SLOGAN BADGE */}
        <div className="order-last sm:order-none mx-auto sm:mx-0 inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-neutral-300 bg-white/80 backdrop-blur-sm shadow-xs">
          {/* Red Lightning Bolt */}
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 fill-[#e51b24] text-[#e51b24]"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>

          {/* Slogan Text */}
          <span className="font-branding font-black text-[9.5px] sm:text-[10.5px] tracking-[0.2em] text-neutral-800 uppercase">
            EVERY CLICK COUNTS. EVERY LEVEL MATTERS.
          </span>

          {/* Red Target Icon */}
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 text-[#e51b24]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" fill="#e51b24" stroke="none" />
            <line x1="12" y1="1" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="1" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="23" y2="12" />
          </svg>
        </div>

        {/* Right: LEADERBOARD button */}
        <button
          type="button"
          onClick={() =>
            onLeaderboard ? onLeaderboard() : setActiveModal("leaderboard")
          }
          className="h-10 px-4 sm:px-5 rounded-full bg-white border border-neutral-300 shadow-sm hover:bg-neutral-50 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-150 flex items-center gap-2 cursor-pointer"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-neutral-900"
            fill="currentColor"
          >
            <path d="M19 4h-2V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v2a4 4 0 0 0 4 4h.6A6 6 0 0 0 11 16.9V19H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.1A6 6 0 0 0 17.4 13H18a4 4 0 0 0 4-4V7a3 3 0 0 0-3-3zM4 9V7a1 1 0 0 1 1-1h2v4.8A4 4 0 0 1 4 9zm16 0a4 4 0 0 1-3 1.8V6h2a1 1 0 0 1 1 1z" />
          </svg>
          <span className="font-branding font-black text-[11px] text-neutral-800 tracking-wider uppercase">
            LEADERBOARD
          </span>
        </button>
      </div>

      {/* =========================================================================
          MODALS / POPUPS (Reset Progress & Leaderboard)
         ========================================================================= */}
      {activeModal === "reset" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-neutral-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-neutral-900 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-3">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-[#e51b24]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </div>
            <h3 className="font-branding text-lg font-extrabold uppercase mb-2 tracking-wider">
              Reset Progress?
            </h3>
            <p className="text-neutral-600 text-xs mb-5">
              This will reset all unlocked stages and best reaction times for
              every difficulty level.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-300 font-bold text-xs uppercase hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="flex-1 py-2.5 rounded-xl bg-[#e51b24] text-white font-bold text-xs uppercase hover:bg-red-700"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "leaderboard" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-neutral-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-neutral-900">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 cursor-pointer font-bold"
            >
              ✕
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-3">
                <span className="text-xl">🏆</span>
              </div>
              <h3 className="font-branding text-xl font-extrabold tracking-wider uppercase mb-1">
                Leaderboard
              </h3>
              <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-4">
                Top Reaction Racers
              </span>

              <div className="w-full space-y-2 mb-5">
                {[].map((player) => (
                  <div
                    key={player.rank}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-bold"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">
                        {player.rank}
                      </span>
                      <span>{player.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#e51b24] font-black">
                        {player.time}
                      </span>
                      <span className="text-neutral-400 font-medium">
                        {player.score} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-bold tracking-wider text-xs uppercase hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Level;
