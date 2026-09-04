import React from 'react';
import { Volume2, VolumeX, Home, Layers, Users, Bot, User, Zap } from 'lucide-react';
import ScoreDisplay from './ScoreDisplay';

/**
 * Ultra-Modern Minimalist Monochrome GameHeader HUD
 */
export default function GameHeader({
  currentQuestion = 1,
  totalQuestions = 10,
  score = 0,
  scoreDelta = 0,
  difficulty = 'easy',
  gameMode = 'self', // 'self' | 'team' | 'robot'
  teamScores = { team1: 0, team2: 0 },
  robotScore = 0,
  userScore = 0,
  soundEnabled = true,
  onToggleSound,
  onQuitToHome,
}) {
  const currentQFormatted = currentQuestion < 10 ? `0${currentQuestion}` : `${currentQuestion}`;
  const totalQFormatted = totalQuestions < 10 ? `0${totalQuestions}` : `${totalQuestions}`;

  return (
    <header className="w-full max-w-4xl mx-auto flex flex-col gap-2.5 px-2 py-2 mb-2 relative z-10">
      {/* Top Main Row */}
      <div className="w-full flex items-center justify-between gap-3">
        {/* Left: Home Button & Question Number */}
        <div className="flex items-center gap-2">
          <button
            onClick={onQuitToHome}
            type="button"
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 text-black border-2 border-black transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Exit to Home"
            aria-label="Exit to Home"
          >
            <Home className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border-2 border-black shadow-xs">
            <Layers className="w-3.5 h-3.5 text-black" />
            <span className="text-xs font-black text-black">
              <span>{currentQFormatted}</span>
              {gameMode === 'self' && (
                <>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="text-slate-400">{totalQFormatted}</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Center: Difficulty & Mode Pill Badges */}
        <div className="flex items-center gap-1.5">
          <span className="px-3 py-1 rounded-2xl bg-black text-white text-[11px] font-black uppercase tracking-wider border-2 border-black">
            {difficulty}
          </span>

          <span className="hidden sm:inline-block px-3 py-1 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-wider border-2 border-black">
            {gameMode === 'self' && 'Self Mode'}
            {gameMode === 'team' && 'Team vs Team'}
            {gameMode === 'robot' && 'vs Robot'}
          </span>
        </div>

        {/* Right: Score / Duel Counter & Sound Toggle */}
        <div className="flex items-center gap-2">
          {gameMode === 'self' && <ScoreDisplay score={score} delta={scoreDelta} />}

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
      </div>

      {/* Mode-Specific Sub-Header Badges */}
      {gameMode === 'team' && (
        <div className="w-full flex items-center justify-between gap-3 p-2 rounded-2xl bg-white border-2 border-black shadow-xs">
          {/* Team 1 Score */}
          <div className="flex-1 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-black">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span className="text-xs font-black">Team 1 (Blue)</span>
            </div>
            <span className="font-mono font-black text-sm text-black">
              {teamScores.team1} <span className="text-xs text-slate-400 font-normal">/ 10</span>
            </span>
          </div>

          <div className="text-[10px] font-black text-black uppercase tracking-widest px-1">
            VS
          </div>

          {/* Team 2 Score */}
          <div className="flex-1 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-black">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span className="text-xs font-black">Team 2 (Red)</span>
            </div>
            <span className="font-mono font-black text-sm text-black">
              {teamScores.team2} <span className="text-xs text-slate-400 font-normal">/ 10</span>
            </span>
          </div>
        </div>
      )}

      {gameMode === 'robot' && (
        <div className="w-full flex items-center justify-between gap-3 p-2 rounded-2xl bg-white border-2 border-black shadow-xs">
          {/* User Score */}
          <div className="flex-1 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-black">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-black" />
              <span className="text-xs font-black">You</span>
            </div>
            <span className="font-mono font-black text-sm text-black">
              {userScore} <span className="text-xs text-slate-400 font-normal">/ 10</span>
            </span>
          </div>

          <div className="text-[10px] font-black text-black uppercase tracking-wider px-2 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-black text-black" />
            Race to 10
          </div>

          {/* Robot Score */}
          <div className="flex-1 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-black">
            <div className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-black" />
              <span className="text-xs font-black">Robot</span>
            </div>
            <span className="font-mono font-black text-sm text-black">
              {robotScore} <span className="text-xs text-slate-400 font-normal">/ 10</span>
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
