import React, { useState } from "react";
import nebuloid_game from "../assets/nebuloid-logo-cropped-Photoroom.png";

const StartScreen = ({
  onStartRace,
  onCertificates,
  onHowToPlay,
  onExit,
  onToggleSound,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const handleSoundToggle = () => {
    setIsMuted((prev) => !prev);
    if (onToggleSound) onToggleSound(!isMuted);
  };

  const handleStartRace = () => {
    if (onStartRace) {
      onStartRace();
    } else {
      console.log("Start Race clicked");
    }
  };

  const handleCertificates = () => {
    if (onCertificates) {
      onCertificates();
    } else {
      setActiveModal("certificates");
    }
  };

  const handleHowToPlay = () => {
    if (onHowToPlay) {
      onHowToPlay();
    } else {
      setActiveModal("howToPlay");
    }
  };

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      setActiveModal("exit");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#f3f4f7] flex flex-col justify-between items-center overflow-hidden select-none py-6 px-4 font-sans">
      {/* Self-contained CSS for fonts, animations & high-tech styling */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&family=Outfit:wght@500;600;700;800;900&display=swap');
        
        .font-racing {
          font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .font-branding {
          font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 24px rgba(229, 27, 36, 0.42), 0 0 50px rgba(229, 27, 36, 0.18);
          }
          50% {
            box-shadow: 0 0 34px rgba(229, 27, 36, 0.65), 0 0 65px rgba(229, 27, 36, 0.28);
          }
        }

        .race-glow-btn {
          animation: pulseGlow 2.4s infinite ease-in-out;
        }
      `}</style>

      {/* =========================================================================
          BACKGROUND DECORATIVE LAYER (Exact elements matching the reference image)
         ========================================================================= */}

      {/* Top-Left Corner Racing Stripes */}
      <div className="absolute top-0 left-0 w-44 h-44 sm:w-56 sm:h-56 pointer-events-none z-0">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Red outer diagonal line */}
          <line
            x1="-20"
            y1="100"
            x2="100"
            y2="-20"
            stroke="#e51b24"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Main thick black diagonal bar */}
          <line
            x1="-10"
            y1="75"
            x2="75"
            y2="-10"
            stroke="#0a0a0d"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Bright red diagonal bar */}
          <line
            x1="2"
            y1="48"
            x2="48"
            y2="2"
            stroke="#e51b24"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Secondary black diagonal bar */}
          <line
            x1="12"
            y1="25"
            x2="25"
            y2="12"
            stroke="#0a0a0d"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom-Right Corner Racing Wedge with diagonal stripes */}
      <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 220 220"
          className="w-full h-full absolute bottom-0 right-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Solid black wedge in corner */}
          <polygon points="220,0 40,220 220,220" fill="#08080a" />

          {/* White and red racing stripes cutting diagonally across the wedge */}
          <line
            x1="120"
            y1="0"
            x2="220"
            y2="100"
            stroke="#e51b24"
            strokeWidth="5.5"
          />
          <line
            x1="140"
            y1="0"
            x2="220"
            y2="80"
            stroke="#ffffff"
            strokeWidth="4"
          />
          <line
            x1="162"
            y1="0"
            x2="220"
            y2="58"
            stroke="#ffffff"
            strokeWidth="4"
          />
          <line
            x1="70"
            y1="190"
            x2="100"
            y2="220"
            stroke="#e51b24"
            strokeWidth="4.5"
          />
          <line
            x1="90"
            y1="185"
            x2="125"
            y2="220"
            stroke="#ffffff"
            strokeWidth="3.5"
          />
        </svg>
      </div>

      {/* Bottom-Left 3x4 Dot Matrix */}
      <div className="absolute bottom-10 left-6 sm:bottom-12 sm:left-10 grid grid-cols-3 gap-2 pointer-events-none z-0 opacity-70">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
        ))}
      </div>

      {/* Top-Right 3x3 Dot Matrix */}
      <div className="absolute top-8 right-24 sm:top-10 sm:right-28 grid grid-cols-3 gap-2 pointer-events-none z-0 opacity-70">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
        ))}
      </div>

      {/* Left Concentric Target Watermark with Red Bullseye */}
      <div className="absolute left-[-110px] sm:left-[-70px] lg:left-[-30px] top-1/2 -translate-y-1/2 pointer-events-none z-0 flex items-center justify-center">
        <svg
          width="420"
          height="420"
          viewBox="0 0 420 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-80"
        >
          {/* Subtle Outer Circles */}
          <circle
            cx="210"
            cy="210"
            r="195"
            stroke="#d8dce3"
            strokeWidth="1.2"
          />
          <circle
            cx="210"
            cy="210"
            r="150"
            stroke="#d1d6df"
            strokeWidth="1.5"
          />
          <circle
            cx="210"
            cy="210"
            r="105"
            stroke="#d8dce3"
            strokeWidth="1.2"
          />
          <circle cx="210" cy="210" r="65" stroke="#c8ced8" strokeWidth="1.5" />

          {/* Crosshair Faint Lines */}
          <line
            x1="210"
            y1="30"
            x2="210"
            y2="390"
            stroke="#c5cbd6"
            strokeWidth="1"
          />
          <line
            x1="30"
            y1="210"
            x2="390"
            y2="210"
            stroke="#c5cbd6"
            strokeWidth="1"
          />

          {/* Delicate Red Crosshairs in Center */}
          <line
            x1="210"
            y1="165"
            x2="210"
            y2="255"
            stroke="#e51b24"
            strokeWidth="1.5"
          />
          <line
            x1="165"
            y1="210"
            x2="255"
            y2="210"
            stroke="#e51b24"
            strokeWidth="1.5"
          />

          {/* Solid Red Bullseye Center */}
          <circle cx="210" cy="210" r="20" fill="#e51b24" />

          {/* Tiny Red Cross Ticks */}
          <text
            x="320"
            y="180"
            fill="#e51b24"
            fontSize="14"
            fontWeight="bold"
            className="select-none"
          >
            ✕
          </text>
          <text
            x="350"
            y="300"
            fill="#e51b24"
            fontSize="12"
            fontWeight="bold"
            className="select-none"
          >
            ✕
          </text>
          <text
            x="300"
            y="90"
            fill="#e51b24"
            fontSize="11"
            fontWeight="bold"
            className="select-none"
          >
            ✕
          </text>
        </svg>
      </div>

      {/* Right Stopwatch Watermark with Red Hand */}
      <div className="absolute right-[-100px] sm:right-[-60px] lg:right-[-20px] top-1/2 -translate-y-1/2 pointer-events-none z-0 flex items-center justify-center">
        <svg
          width="420"
          height="420"
          viewBox="0 0 420 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-75"
        >
          {/* Outer dashed compass/orbit arc */}
          <circle
            cx="210"
            cy="210"
            r="190"
            stroke="#d8dce3"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <circle
            cx="210"
            cy="210"
            r="165"
            stroke="#ced4dd"
            strokeWidth="1.5"
          />

          {/* Stopwatch Crown & Top Plunger (12 o'clock) */}
          <rect
            x="198"
            y="18"
            width="24"
            height="18"
            rx="4"
            stroke="#bcc3ce"
            strokeWidth="2.5"
            fill="#f3f4f7"
          />
          <path
            d="M 190 28 A 20 20 0 0 1 230 28"
            stroke="#bcc3ce"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Angled Pushers (10 & 2 o'clock) */}
          <rect
            x="108"
            y="64"
            width="14"
            height="10"
            rx="2"
            transform="rotate(-40 108 64)"
            stroke="#bcc3ce"
            strokeWidth="2"
            fill="#f3f4f7"
          />
          <rect
            x="298"
            y="55"
            width="14"
            height="10"
            rx="2"
            transform="rotate(40 298 55)"
            stroke="#bcc3ce"
            strokeWidth="2"
            fill="#f3f4f7"
          />

          {/* Dial Face ticks */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const r1 = 145;
            const r2 = i % 3 === 0 ? 128 : 136;
            const x1 = 210 + r1 * Math.sin(angle);
            const y1 = 210 - r1 * Math.cos(angle);
            const x2 = 210 + r2 * Math.sin(angle);
            const y2 = 210 - r2 * Math.cos(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i % 3 === 0 ? "#8b94a0" : "#b0b8c4"}
                strokeWidth={i % 3 === 0 ? "3" : "1.8"}
                strokeLinecap="round"
              />
            );
          })}

          {/* Stopwatch Hand: pointing to ~11 o'clock (~50s mark) */}
          <line
            x1="210"
            y1="210"
            x2="152"
            y2="108"
            stroke="#e51b24"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          {/* Red Pivot Cap */}
          <circle cx="210" cy="210" r="7" fill="#e51b24" />
          <circle cx="210" cy="210" r="3" fill="#ffffff" />

          {/* Small Red Accent marks */}
          <text
            x="110"
            y="280"
            fill="#e51b24"
            fontSize="14"
            fontWeight="bold"
            className="select-none"
          >
            ✕
          </text>
          <text
            x="210"
            y="390"
            fill="#e51b24"
            fontSize="12"
            fontWeight="bold"
            className="select-none"
          >
            ✕
          </text>
        </svg>
      </div>

      {/* =========================================================================
          TOP HEADER SECTION: Sound Button & Nebuloid Tech Logo
         ========================================================================= */}
      <div className="w-full max-w-5xl flex flex-col items-center relative z-10">
        {/* Sound Toggle Button (Top-Right) */}
        <div className="w-full flex justify-end mb-2">
          <button
            type="button"
            onClick={handleSoundToggle}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-neutral-300 bg-white/90 shadow-sm flex items-center justify-center hover:bg-neutral-100 hover:border-neutral-400 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer group"
          >
            {isMuted ? (
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-800 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon
                  points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                  fill="currentColor"
                />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-800 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon
                  points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                  fill="currentColor"
                />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>
        </div>

        {/* Nebuloid Tech Logo Brand Mark */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={nebuloid_game}
            alt="Nebuloid Logo"
            className="h-[150px] w-auto"
          />
        </div>
      </div>

      {/* =========================================================================
          MAIN CENTER TITLE & MENU BUTTONS
         ========================================================================= */}
      <div className="w-full max-w-xl flex flex-col items-center text-center relative z-10 my-auto">
        {/* Title: REACTION RUSH */}
        <div className="relative flex flex-col items-center">
          {/* Top Line: REACTION (with target O and decorative ticks) */}
          <div className="flex items-center justify-center relative">
            {/* Left subtle red dash */}
            <span className="hidden sm:inline-block absolute -left-8 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-[#e51b24]" />

            <div className="flex items-center font-racing font-black italic tracking-tight text-[44px] sm:text-[62px] md:text-[76px] leading-none text-[#0e1015]">
              <span>REACTI</span>

              {/* Target / Crosshair 'O' Replacement */}
              <div className="relative inline-flex items-center justify-center mx-[2px] sm:mx-1 -skew-x-[12deg] w-[42px] h-[42px] sm:w-[58px] sm:h-[58px] md:w-[70px] md:h-[70px]">
                <svg
                  viewBox="0 0 76 76"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Heavy outer black target circle */}
                  <circle
                    cx="38"
                    cy="38"
                    r="32"
                    stroke="#0e1015"
                    strokeWidth="7"
                  />
                  {/* Inner black ring */}
                  <circle
                    cx="38"
                    cy="38"
                    r="19"
                    stroke="#0e1015"
                    strokeWidth="3.5"
                  />

                  {/* Red Crosshair Lines extending beyond circle */}
                  <line
                    x1="38"
                    y1="3"
                    x2="38"
                    y2="73"
                    stroke="#e51b24"
                    strokeWidth="2.2"
                  />
                  <line
                    x1="3"
                    y1="38"
                    x2="73"
                    y2="38"
                    stroke="#e51b24"
                    strokeWidth="2.2"
                  />

                  {/* Center Solid Red Dot */}
                  <circle cx="38" cy="38" r="7" fill="#e51b24" />

                  {/* Tiny Red Crosshair Ticks */}
                  <line
                    x1="58"
                    y1="18"
                    x2="63"
                    y2="18"
                    stroke="#e51b24"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="58"
                    y1="18"
                    x2="58"
                    y2="13"
                    stroke="#e51b24"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              <span>N</span>
            </div>

            {/* Right subtle red dash */}
            <span className="hidden sm:inline-block absolute -right-8 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-[#e51b24]" />
          </div>

          {/* Bottom Line: RUSH with Left Speed Motion Lines */}
          <div className="flex items-center justify-center -mt-1 sm:-mt-2">
            {/* Speed streaks / wind lines in crimson red */}
            <div className="flex flex-col items-end gap-[4px] sm:gap-[5px] mr-2 sm:mr-3.5 -skew-x-[12deg]">
              <div className="w-4 sm:w-6 h-[2.5px] sm:h-[3.5px] bg-[#e51b24] rounded-full" />
              <div className="w-8 sm:w-12 h-[2.8px] sm:h-[4px] bg-[#e51b24] rounded-full" />
              <div className="w-6 sm:w-9 h-[2.5px] sm:h-[3.5px] bg-[#e51b24] rounded-full" />
              <div className="w-3 sm:w-5 h-[2px] sm:h-[3px] bg-[#e51b24] rounded-full" />
            </div>

            {/* "RUSH" text in crimson italic */}
            <span className="font-racing font-black italic tracking-tight text-[48px] sm:text-[68px] md:text-[84px] leading-none text-[#e51b24]">
              RUSH
            </span>
          </div>

          {/* Tagline: • TEST YOUR SPEED. TRUST YOUR INSTINCTS. • */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 w-full">
            <div className="flex items-center gap-1">
              <span className="w-4 sm:w-8 h-[1.5px] bg-neutral-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#e51b24]" />
            </div>

            <span className="font-branding text-[9px] sm:text-[11px] md:text-[12px] font-black tracking-[0.24em] text-neutral-900 uppercase">
              TEST YOUR SPEED. TRUST YOUR INSTINCTS.
            </span>

            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e51b24]" />
              <span className="w-4 sm:w-8 h-[1.5px] bg-neutral-400" />
            </div>
          </div>
        </div>

        {/* Action Buttons Stack */}
        <div className="flex flex-col items-center gap-3.5 w-full max-w-[400px] sm:max-w-[420px] px-2 sm:px-0 mt-6 sm:mt-8">
          {/* Button 1: START RACE (Dark theme with red ambient glow) */}
          <button
            type="button"
            onClick={handleStartRace}
            className="race-glow-btn group relative w-full h-[52px] sm:h-[56px] rounded-xl bg-[#0c0d12] border border-neutral-800 text-white flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] shadow-lg"
          >
            {/* Red Play Triangle Icon */}
            <div className="absolute left-6 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-[#e51b24] text-[#e51b24] transition-transform duration-200 group-hover:scale-110"
              >
                <polygon points="6 3 20 12 6 21" />
              </svg>
            </div>

            {/* Label */}
            <span className="font-branding font-black tracking-[0.22em] text-[14px] sm:text-[15px] uppercase">
              START RACE
            </span>
          </button>

          {/* Button 2: CERTIFICATES */}
          <button
            type="button"
            onClick={handleCertificates}
            className="group relative w-full h-[50px] sm:h-[54px] rounded-xl bg-white border-[1.8px] border-neutral-900 text-[#0c0d12] flex items-center justify-center cursor-pointer shadow-sm hover:bg-neutral-50 hover:shadow-md hover:scale-[1.012] active:scale-[0.985] transition-all duration-200"
          >
            {/* Certificate with Red Medal Icon */}
            <div className="absolute left-6 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Parchment / Document outline */}
                <rect
                  x="4"
                  y="2"
                  width="16"
                  height="20"
                  rx="2.5"
                  stroke="#0c0d12"
                  strokeWidth="1.8"
                />
                {/* Horizontal text lines */}
                <line
                  x1="8"
                  y1="6"
                  x2="16"
                  y2="6"
                  stroke="#0c0d12"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="8"
                  y1="10"
                  x2="16"
                  y2="10"
                  stroke="#0c0d12"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Red Ribbon Seal Badge */}
                <circle cx="12" cy="15" r="2.8" fill="#e51b24" />
                <path
                  d="M10.8 17 L10 20 L12 18.5 L14 20 L13.2 17 Z"
                  fill="#e51b24"
                />
              </svg>
            </div>

            {/* Label */}
            <span className="font-branding font-black tracking-[0.22em] text-[13px] sm:text-[14px] uppercase text-[#0c0d12]">
              CERTIFICATES
            </span>
          </button>

          {/* Button 3: HOW TO PLAY */}
          <button
            type="button"
            onClick={handleHowToPlay}
            className="group relative w-full h-[50px] sm:h-[54px] rounded-xl bg-white border-[1.8px] border-neutral-900 text-[#0c0d12] flex items-center justify-center cursor-pointer shadow-sm hover:bg-neutral-50 hover:shadow-md hover:scale-[1.012] active:scale-[0.985] transition-all duration-200"
          >
            {/* Info Circle (i) Icon */}
            <div className="absolute left-6 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#0c0d12]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <line x1="12" y1="8" x2="12" y2="8.5" strokeWidth="2.5" />
                <line x1="12" y1="11.5" x2="12" y2="16" strokeWidth="2" />
              </svg>
            </div>

            {/* Label */}
            <span className="font-branding font-black tracking-[0.22em] text-[13px] sm:text-[14px] uppercase text-[#0c0d12]">
              HOW TO PLAY
            </span>
          </button>

          {/* Button 4: EXIT */}
          <button
            type="button"
            onClick={handleExit}
            className="group relative w-full h-[50px] sm:h-[54px] rounded-xl bg-white border-[1.8px] border-neutral-900 text-[#0c0d12] flex items-center justify-center cursor-pointer shadow-sm hover:bg-neutral-50 hover:shadow-md hover:scale-[1.012] active:scale-[0.985] transition-all duration-200"
          >
            {/* Exit Door Frame with Red Arrow */}
            <div className="absolute left-6 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Bracket / Door frame in dark black */}
                <path
                  d="M9 4 L5 4 A 1 1 0 0 0 4 5 L4 19 A 1 1 0 0 0 5 20 L9 20"
                  stroke="#0c0d12"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Red Arrow pointing outward */}
                <path
                  d="M10 12 L20 12"
                  stroke="#e51b24"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M16 8 L20 12 L16 16"
                  stroke="#e51b24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Label */}
            <span className="font-branding font-black tracking-[0.22em] text-[13px] sm:text-[14px] uppercase text-[#0c0d12]">
              EXIT
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM SLOGAN BADGE
         ========================================================================= */}
      <div className="w-full flex justify-center relative z-10 mt-6 mb-1">
        <div className="inline-flex items-center gap-2.5 sm:gap-3 px-5 py-2 rounded-full border border-neutral-300 bg-white/80 backdrop-blur-sm shadow-xs">
          {/* Red Lightning Bolt */}
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 fill-[#e51b24] text-[#e51b24]"
            fill="currentColor"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>

          {/* Motto Text */}
          <span className="font-branding font-black text-[9.5px] sm:text-[10.5px] tracking-[0.2em] text-neutral-800 uppercase">
            EVERY QUICK CLICK. EVERY STEP AHEAD.
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
      </div>

      {/* =========================================================================
          MODALS / POPUPS (Interactive convenience if buttons are clicked)
         ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border-2 border-neutral-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-neutral-900">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 cursor-pointer font-bold"
            >
              ✕
            </button>

            {activeModal === "certificates" && (
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-3">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#e51b24]">
                    <circle cx="12" cy="12" r="6" />
                  </svg>
                </div>
                <h3 className="font-branding text-xl font-extrabold tracking-wider uppercase mb-2">
                  Certificates
                </h3>
                <p className="text-neutral-600 text-sm mb-5">
                  Complete reaction speed challenges to earn official Nebuloid
                  Tech reaction badges and rankings!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-bold tracking-wider text-xs uppercase hover:bg-neutral-800"
                >
                  Close
                </button>
              </div>
            )}

            {activeModal === "howToPlay" && (
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-3">
                  <span className="font-black text-xl text-[#e51b24]">i</span>
                </div>
                <h3 className="font-branding text-xl font-extrabold tracking-wider uppercase mb-2">
                  How To Play
                </h3>
                <ul className="text-left text-neutral-700 text-sm space-y-2 mb-5 list-disc pl-5">
                  <li>Watch the targets appear on screen carefully.</li>
                  <li>Click or tap as rapidly and precisely as possible.</li>
                  <li>
                    Avoid false triggers to maintain high accuracy and combo
                    streaks.
                  </li>
                  <li>Compete to set your personal reaction best!</li>
                </ul>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-bold tracking-wider text-xs uppercase hover:bg-neutral-800"
                >
                  Got It!
                </button>
              </div>
            )}

            {activeModal === "exit" && (
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-3">
                  <span className="text-xl">🚪</span>
                </div>
                <h3 className="font-branding text-xl font-extrabold tracking-wider uppercase mb-2">
                  Exit Game?
                </h3>
                <p className="text-neutral-600 text-sm mb-5">
                  Are you sure you want to exit Reaction Rush?
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-2.5 rounded-xl border border-neutral-300 font-bold tracking-wider text-xs uppercase hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-2.5 rounded-xl bg-[#e51b24] text-white font-bold tracking-wider text-xs uppercase hover:bg-red-700"
                  >
                    Confirm Exit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StartScreen;
