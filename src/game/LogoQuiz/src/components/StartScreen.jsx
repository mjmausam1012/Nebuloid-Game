import React, { useState } from 'react';
import { Play, Award, HelpCircle, ArrowLeft, Volume2, VolumeX, Trophy, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import nebuloidLogo from "../assets/nebuloid-logo-cropped.png"

/**
 * Ultra-Modern Minimalist Monochrome Start Screen
 * Exactly matching the high-contrast graphic style with geometric corner stripes and dot grids.
 */
export default function StartScreen({
  onProceedToDifficulty,
  bestScore = 0,
  gamesPlayed = 0,
  soundEnabled = true,
  onToggleSound,
  onExitGame,
}) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);

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
            <div key={`tr-dot-${i}`} className="w-1.5 h-1.5 rounded-full bg-black/80" />
          ))}
        </div>
      </div>

      {/* Bottom-Left: 4x4 Dot Grid Pattern */}
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 pointer-events-none z-0">
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={`bl-dot-${i}`} className="w-1.5 h-1.5 rounded-full bg-black/80" />
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

      {/* ================= MAIN CONTENT ================= */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center my-auto relative z-10 animate-pop">
        
        {/* Giant Main Title */}
        <div className="text-center mb-1">
          <img src={nebuloidLogo} alt="Nebuloid Logo" className="nebuloid-logo h-40 w-auto mx-auto mb-2" />
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-black tracking-tight leading-none">
            LOGO
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-[0.45em] sm:tracking-[0.55em] mt-2 uppercase">
            QUIZ
          </h2>
        </div>

        {/* Divider with Tagline */}
        <div className="w-full max-w-sm flex items-center justify-center gap-3 my-5 sm:my-6">
          <div className="h-[2px] w-12 sm:w-16 bg-black" />
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-black shrink-0">
            RECOGNIZE • GUESS • WIN
          </span>
          <div className="h-[2px] w-12 sm:w-16 bg-black" />
        </div>

        {/* ================= MENU BUTTONS STACK ================= */}
        <div className="w-full max-w-sm flex flex-col gap-3 sm:gap-3.5 mt-2">
          
          {/* Button 1: START RACE / START QUIZ (Solid Black Hero Button) */}
          <button
            onClick={onProceedToDifficulty}
            type="button"
            className="group w-full py-4 px-6 rounded-2xl bg-black hover:bg-slate-900 text-white border-2 border-black transition-all duration-200 flex items-center justify-between shadow-md hover:shadow-xl active:scale-[0.98] cursor-pointer"
          >
            {/* Left Play Icon inside Blue Square */}
            <div className="w-6 h-6 rounded-md bg-[#2563EB] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
              <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
            </div>

            {/* Center Label */}
            <span className="font-black text-sm sm:text-base tracking-[0.18em] uppercase text-white text-center flex-1">
              START QUIZ
            </span>

            {/* Right Balancer */}
            <div className="w-6 shrink-0" />
          </button>

          {/* Button 2: CERTIFICATES / HIGH SCORES */}
          <button
            onClick={() => setShowCertificates(true)}
            type="button"
            className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-black border-2 border-black transition-all duration-200 flex items-center justify-between shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            {/* Left Square / Award Icon */}
            <div className="w-6 h-6 rounded-md border border-black/80 flex items-center justify-center shrink-0 text-black">
              <div className="w-2.5 h-2.5 rounded-xs bg-black" />
            </div>

            {/* Center Label */}
            <span className="font-black text-xs sm:text-sm tracking-[0.18em] uppercase text-black text-center flex-1">
              CERTIFICATES
            </span>

            {/* Right Balancer */}
            <div className="w-6 shrink-0" />
          </button>

          {/* Button 3: HOW TO PLAY */}
          <button
            onClick={() => setShowHowToPlay(true)}
            type="button"
            className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-black border-2 border-black transition-all duration-200 flex items-center justify-between shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            {/* Left Info (i) Icon */}
            <div className="w-6 h-6 rounded-full border border-black/80 flex items-center justify-center shrink-0 text-black font-serif font-black text-xs">
              i
            </div>

            {/* Center Label */}
            <span className="font-black text-xs sm:text-sm tracking-[0.18em] uppercase text-black text-center flex-1">
              HOW TO PLAY
            </span>

            {/* Right Balancer */}
            <div className="w-6 shrink-0" />
          </button>

          {/* Button 4: SOUND / BACK OPTIONS */}
          <button
            onClick={onToggleSound}
            type="button"
            className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-black border-2 border-black transition-all duration-200 flex items-center justify-between shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            {/* Left Icon */}
            <div className="w-6 h-6 flex items-center justify-center shrink-0 text-black">
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </div>

            {/* Center Label */}
            <span className="font-black text-xs sm:text-sm tracking-[0.18em] uppercase text-black text-center flex-1">
              {soundEnabled ? 'SOUND: ON' : 'SOUND: MUTED'}
            </span>

            {/* Right Balancer */}
            <div className="w-6 shrink-0" />
          </button>

          {/* Button 5: BACK TO GAMES */}
          {onExitGame && (
            <button
              onClick={onExitGame}
              type="button"
              className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-black border-2 border-black transition-all duration-200 flex items-center justify-between shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer"
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0 text-black">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-black text-xs sm:text-sm tracking-[0.18em] uppercase text-black text-center flex-1">
                BACK TO GAMES
              </span>
              <div className="w-6 shrink-0" />
            </button>
          )}
        </div>

        {/* Footer Subtitle Note */}
        <p className="text-[11px] sm:text-xs text-slate-500 font-semibold tracking-wide text-center mt-7">
          ★ Every genuine target unlocks a personalized certificate. ★
        </p>
      </div>

      {/* ================= MODAL 1: HOW TO PLAY (REFERENCE DESIGN MATCH) ================= */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white border-2 border-black rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            {/* Top GUIDE Subtitle */}
            <span className="text-[11px] font-black tracking-[0.3em] text-slate-500 uppercase block">
              GUIDE
            </span>

            {/* Header Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight mt-1 mb-6">
              HOW TO PLAY
            </h2>

            {/* 4 Step Cards */}
            <div className="space-y-3">
              {/* Card 01 */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center gap-4 sm:gap-6 shadow-xs">
                <span className="text-sm font-black text-slate-400 font-mono shrink-0 w-7 text-center">
                  01
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-black">
                    Choose your game mode
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    Play Solo in Self Mode, duel in Team vs Team (2 Windows), or battle Robot AI.
                  </p>
                </div>
              </div>

              {/* Card 02 */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center gap-4 sm:gap-6 shadow-xs">
                <span className="text-sm font-black text-slate-400 font-mono shrink-0 w-7 text-center">
                  02
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-black">
                    Select a difficulty
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    Choose from Easy (10 pts), Medium (20 pts), or Hard (30 pts) distortion challenges.
                  </p>
                </div>
              </div>

              {/* Card 03 */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center gap-4 sm:gap-6 shadow-xs">
                <span className="text-sm font-black text-slate-400 font-mono shrink-0 w-7 text-center">
                  03
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-black">
                    Identify the logo
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    Recognize blurred, pixelated, or masked brands using keyboard (1-4 / A-D) or click.
                  </p>
                </div>
              </div>

              {/* Card 04 */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center gap-4 sm:gap-6 shadow-xs">
                <span className="text-sm font-black text-slate-400 font-mono shrink-0 w-7 text-center">
                  04
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-black">
                    Reach it fast
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    Be the first to achieve 10 points to win the match and unlock your certificate.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom MAIN MENU Button */}
            <button
              onClick={() => setShowHowToPlay(false)}
              type="button"
              className="w-full mt-6 py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-black border-2 border-black transition-all flex items-center justify-between shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-black shrink-0" />
              <span className="font-black text-xs sm:text-sm tracking-[0.2em] uppercase text-black text-center flex-1">
                MAIN MENU
              </span>
              <div className="w-4 shrink-0" />
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CERTIFICATES & RECORDS (MATCHING REFERENCE DESIGN) ================= */}
      {showCertificates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white border-2 border-black rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            {/* Top ACHIEVEMENTS Subtitle */}
            <span className="text-[11px] font-black tracking-[0.3em] text-slate-500 uppercase block">
              ACHIEVEMENTS
            </span>

            {/* Header Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight mt-1 mb-6">
              CERTIFICATES
            </h2>

            {/* Certificate Card */}
            <div className="p-5 sm:p-6 rounded-2xl border-2 border-black bg-white relative overflow-hidden shadow-xs">
              {/* Inner Decorative Corner Badges */}
              <div className="flex flex-col items-center text-center">
                <img
                  src={nebuloidLogo}
                  alt="Nebuloid Logo"
                  className="h-16 w-auto mx-auto mb-2 object-contain"
                />

                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                  OFFICIAL CERTIFICATE OF MASTERY
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-black mt-0.5 tracking-tight">
                  LOGO QUIZ CHAMPION
                </h3>

                <p className="text-xs text-slate-500 font-medium max-w-md mx-auto mt-1">
                  Awarded for demonstrating visual acuity and rapid brand logo recognition across all difficulty tiers.
                </p>

                {/* 3 Metric Cards inside Certificate */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-slate-200">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Best Score
                    </span>
                    <span className="text-lg sm:text-xl font-black text-black font-mono mt-0.5 block">
                      {bestScore.toLocaleString()} pts
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Rounds Played
                    </span>
                    <span className="text-lg sm:text-xl font-black text-black font-mono mt-0.5 block">
                      {gamesPlayed}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Rank Status
                    </span>
                    <span className="text-sm font-black text-black mt-1 block">
                      {bestScore >= 200 ? '⭐ Logo Master' : bestScore >= 100 ? '🎯 Brand Pro' : '💡 Contender'}
                    </span>
                  </div>
                </div>

                <div className="w-full flex items-center justify-center gap-2 mt-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  <span>★ VERIFIED BY NEBULOID STUDIOS ★</span>
                </div>
              </div>
            </div>

            {/* Bottom MAIN MENU Button */}
            <button
              onClick={() => setShowCertificates(false)}
              type="button"
              className="w-full mt-6 py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-black border-2 border-black transition-all flex items-center justify-between shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-black shrink-0" />
              <span className="font-black text-xs sm:text-sm tracking-[0.2em] uppercase text-black text-center flex-1">
                MAIN MENU
              </span>
              <div className="w-4 shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
