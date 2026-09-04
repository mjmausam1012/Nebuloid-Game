import React, { useState, useEffect, useRef, useCallback } from "react";
import playSoundEffect from "../utils/sound";

const Game = ({
  level = "easy",
  stage = 1,
  onBack,
  onNextStage,
  onStageComplete,
  onGenerateCertificate,
}) => {
  // Difficulty & Stage Parameter Scaling
  const getLevelConfig = (lvl, stg) => {
    const baseConfigs = {
      easy: {
        name: "EASY",
        color: "#22c55e",
        targetSize: 76 - stg * 3, // 73px down to 61px
        duration: 1600 - stg * 70, // 1530ms down to 1250ms
        minHitsToPass: 8 + stg * 2, // 10 hits in 30s for L-1, up to 18 for L-5
        hazardChance: 0, // no hazards in easy
        bonusChance: 0.12,
        speedBonus: 1.0,
      },
      medium: {
        name: "MEDIUM",
        color: "#eab308",
        targetSize: 62 - stg * 2.5,
        duration: 1250 - stg * 60,
        minHitsToPass: 12 + stg * 2,
        hazardChance: stg >= 3 ? 0.15 : 0.08,
        bonusChance: 0.15,
        speedBonus: 1.25,
      },
      hard: {
        name: "HARD",
        color: "#f97316",
        targetSize: 52 - stg * 2,
        duration: 950 - stg * 45,
        minHitsToPass: 16 + stg * 2,
        hazardChance: 0.22,
        bonusChance: 0.18,
        speedBonus: 1.5,
      },
      expert: {
        name: "EXPERT",
        color: "#9333ea",
        targetSize: 42 - stg * 1.5,
        duration: 720 - stg * 30,
        minHitsToPass: 20 + stg * 2,
        hazardChance: 0.28,
        bonusChance: 0.2,
        speedBonus: 2.0,
      },
    };
    return baseConfigs[lvl] || baseConfigs.easy;
  };

  const config = getLevelConfig(level, stage);

  // Game States: 'countdown' | 'playing' | 'paused' | 'gameover'
  const [gameState, setGameState] = useState("countdown");
  const [countdown, setCountdown] = useState(3);
  const [isMuted, setIsMuted] = useState(false);

  // 30 Seconds Timer State (30.0 down to 0.0)
  const TOTAL_TIME = 30.0;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  // Target Information
  const [target, setTarget] = useState({
    id: 1,
    type: "standard", // 'standard' | 'bonus' | 'hazard'
    x: 50,
    y: 50,
    spawnTime: 0,
    duration: config.duration,
  });

  // Reaction & Scoring Metrics
  const [reactionTimes, setReactionTimes] = useState([]);
  const [lastReactionTime, setLastReactionTime] = useState(null);
  const [lastRating, setLastRating] = useState(null); // 'PERFECT!' | 'FAST!' | 'GOOD' | 'HAZARD!'
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  // Visual Effects
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [clickRipples, setClickRipples] = useState([]);
  const arenaRef = useRef(null);
  const targetTimeoutRef = useRef(null);

  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState(false);
  const [certPlayerName, setCertPlayerName] = useState("");

  const handleCertificateSubmit = (e) => {
    e.preventDefault();
    if (!certPlayerName.trim()) return;

    if (onGenerateCertificate) {
      onGenerateCertificate({
        playerName: certPlayerName.trim(),
        level: config.name,
        stage,
        score,
        avgReactionTime,
        accuracy,
        stars: starsEarned,
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        certId: "RR-" + Math.floor(100000 + Math.random() * 900000) + "-NT",
      });
    }
  };

  const sound = useCallback(
    (type) => {
      playSoundEffect(type, isMuted);
    },
    [isMuted],
  );

  // 1. Initial Countdown (3... 2... 1... RUSH!)
  useEffect(() => {
    if (gameState === "countdown") {
      sound("countdown");
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            sound("rush");
            setGameState("playing");
            return 0;
          }
          sound("countdown");
          return prev - 1;
        });
      }, 850);
      return () => clearInterval(interval);
    }
  }, [gameState, sound]);

  // 2. 30-Second Countdown Clock
  useEffect(() => {
    let timerInterval = null;
    if (gameState === "playing") {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            clearInterval(timerInterval);
            handleGameOver();
            return 0;
          }

          // Audio warning in the last 5 seconds
          if (prev <= 5.1 && Math.floor(prev) !== Math.floor(prev - 0.1)) {
            sound("tickWarning");
          }

          return parseFloat((prev - 0.1).toFixed(1));
        });
      }, 100);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [gameState, sound]);

  // Spawn New Target
  const spawnTarget = useCallback(() => {
    if (targetTimeoutRef.current) clearTimeout(targetTimeoutRef.current);

    // Keep targets within safe 15% to 85% arena margins
    const randomX = Math.floor(Math.random() * 70) + 15;
    const randomY = Math.floor(Math.random() * 70) + 15;

    // Determine target type (hazard, bonus, or standard)
    const roll = Math.random();
    let type = "standard";
    if (roll < config.hazardChance) {
      type = "hazard";
    } else if (roll < config.hazardChance + config.bonusChance) {
      type = "bonus";
    }

    const newTarget = {
      id: Date.now(),
      type,
      x: randomX,
      y: randomY,
      spawnTime: Date.now(),
      duration: type === "bonus" ? config.duration * 0.85 : config.duration,
    };

    setTarget(newTarget);

    // Auto-timeout if unclicked
    targetTimeoutRef.current = setTimeout(() => {
      handleTargetTimeout(newTarget);
    }, newTarget.duration);
  }, [config.duration, config.hazardChance, config.bonusChance]);

  // Start spawning once in 'playing' mode
  useEffect(() => {
    if (gameState === "playing" && !target.spawnTime) {
      spawnTarget();
    }
  }, [gameState, target.spawnTime, spawnTarget]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (targetTimeoutRef.current) clearTimeout(targetTimeoutRef.current);
    };
  }, []);

  // Handle Target Timeout (Missed standard/bonus target, or avoided hazard)
  const handleTargetTimeout = (currentT) => {
    if (currentT.type !== "hazard") {
      // Standard or bonus expired = Miss!
      sound("miss");
      setMisses((prev) => prev + 1);
      setStreak(0);
      setLastRating("MISSED");
      setLastReactionTime(null);
    }
    // Spawn next target immediately
    spawnTarget();
  };

  // Trigger floating feedback text at target position
  const triggerFloatingFeedback = (text, color, x, y) => {
    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id, text, color, x, y }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 750);
  };

  // Handle Target Click
  const handleTargetClick = (e) => {
    e.stopPropagation();
    if (gameState !== "playing") return;

    if (targetTimeoutRef.current) clearTimeout(targetTimeoutRef.current);

    setTotalClicks((prev) => prev + 1);

    // If Hazard Target was clicked: PENALTY!
    if (target.type === "hazard") {
      sound("hazard");
      setScore((prev) => Math.max(0, prev - 400));
      setStreak(0);
      setLastRating("HAZARD! -400");
      triggerFloatingFeedback("-400 HAZARD!", "#e51b24", target.x, target.y);
      spawnTarget();
      return;
    }

    // Reaction Time Calculation (in ms)
    const reactionMs = Math.round(Date.now() - target.spawnTime);
    setReactionTimes((prev) => [...prev, reactionMs]);
    setLastReactionTime(reactionMs);
    setHits((prev) => prev + 1);

    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak > maxStreak) setMaxStreak(newStreak);

    // Rating & Score Multiplier
    let rating = "GOOD";
    let basePts = 200;
    if (reactionMs < 250) {
      rating = "PERFECT!";
      basePts = 500;
    } else if (reactionMs < 380) {
      rating = "FAST!";
      basePts = 350;
    }

    if (target.type === "bonus") {
      basePts += 500;
      rating = "BONUS HIT! ⭐";
      sound("bonus");
    } else if (newStreak >= 3) {
      sound("streak");
    } else {
      sound("hit");
    }

    setLastRating(rating);

    // Multiplier based on streak
    const streakBonus = 1 + (newStreak - 1) * 0.25;
    const addedPoints = Math.round(basePts * streakBonus * config.speedBonus);
    setScore((prev) => prev + addedPoints);

    triggerFloatingFeedback(
      `+${addedPoints} ${newStreak >= 3 ? `(x${newStreak})` : ""}`,
      target.type === "bonus" ? "#eab308" : "#22c55e",
      target.x,
      target.y,
    );

    // Spawn next target
    spawnTarget();
  };

  // Handle Arena Miss Click (clicked outside target)
  const handleArenaClick = (e) => {
    if (gameState !== "playing") return;

    sound("miss");
    setTotalClicks((prev) => prev + 1);
    setStreak(0);
    setScore((prev) => Math.max(0, prev - 50));

    if (arenaRef.current) {
      const rect = arenaRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const rippleId = Date.now() + Math.random();
      setClickRipples((prev) => [
        ...prev,
        { id: rippleId, x: clickX, y: clickY },
      ]);
      setTimeout(() => {
        setClickRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 550);
    }
  };

  // Game Over (Triggered at 30 seconds)
  const handleGameOver = () => {
    if (targetTimeoutRef.current) clearTimeout(targetTimeoutRef.current);
    sound("finish");
    setGameState("gameover");

    const avgTime =
      reactionTimes.length > 0
        ? Math.round(
            reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length,
          )
        : 0;
    const acc = totalClicks > 0 ? Math.round((hits / totalClicks) * 100) : 100;
    const passed = hits >= 1;

    let earnedStars = 1;
    if (hits >= 10 && acc >= 80 && avgTime <= 350) earnedStars = 3;
    else if (hits >= 5 && acc >= 60) earnedStars = 2;

    // Direct localStorage unlock safety net
    try {
      const saved = localStorage.getItem("reaction_rush_levels");
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.map((lvl) => {
          if (lvl.id !== level) return lvl;
          const newStages = lvl.stages.map((st) => {
            if (st.id === stage) {
              const timeFormatted =
                avgTime > 0 ? (avgTime / 1000).toFixed(2) + "s" : "00.00s";
              return {
                ...st,
                stars: Math.max(st.stars || 0, earnedStars),
                best: timeFormatted,
              };
            }
            if (st.id === stage + 1) {
              return { ...st, locked: false };
            }
            return st;
          });
          const clearedCount = newStages.filter((s) => s.stars > 0).length;
          return { ...lvl, cleared: clearedCount, stages: newStages };
        });
        localStorage.setItem("reaction_rush_levels", JSON.stringify(updated));
      }
    } catch (err) {
      console.error(err);
    }

    if (onStageComplete) {
      onStageComplete({
        level,
        stage,
        score,
        hits,
        reactionTimes,
        avgReactionTime: avgTime,
        accuracy: acc,
        starsEarned: earnedStars,
        isPassed: passed,
      });
    }
  };

  // Restart Stage
  const handleRestart = () => {
    if (targetTimeoutRef.current) clearTimeout(targetTimeoutRef.current);
    setTimeLeft(TOTAL_TIME);
    setHits(0);
    setMisses(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalClicks(0);
    setReactionTimes([]);
    setLastReactionTime(null);
    setLastRating(null);
    setTarget({
      id: 1,
      type: "standard",
      x: 50,
      y: 50,
      spawnTime: 0,
      duration: config.duration,
    });
    setCountdown(3);
    setGameState("countdown");
  };

  // Final Stats Calculations
  const avgReactionTime =
    reactionTimes.length > 0
      ? Math.round(
          reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length,
        )
      : 0;

  const accuracy =
    totalClicks > 0 ? Math.round((hits / totalClicks) * 100) : 100;

  const isPassed = hits >= 1;

  const calculateStars = () => {
    if (!isPassed) return 0;
    if (hits >= 10 && accuracy >= 80 && avgReactionTime <= 350) return 3;
    if (hits >= 5 && accuracy >= 60) return 2;
    return 1;
  };

  const starsEarned = calculateStars();

  // Reflex Rank Descriptor
  const getReflexRank = (ms) => {
    if (ms === 0) return "UNRANKED";
    if (ms < 220) return "GODLIKE SPEED ⚡";
    if (ms < 280) return "CYBER PRO 🚀";
    if (ms < 360) return "FAST RACER 🏎️";
    if (ms < 480) return "SHARP REFLEX 👀";
    return "TRAINEE 🎯";
  };

  return (
    <div className="w-full h-screen max-h-screen bg-[#f3f4f7] flex flex-col justify-between items-center overflow-hidden select-none p-2 sm:p-4 font-sans relative">
      {/* Self-contained Fonts & Styling */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&family=Outfit:wght@500;600;700;800;900&display=swap');

        .font-racing {
          font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .font-branding {
          font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        }

        @keyframes targetPulse {
          0% { transform: translate(-50%, -50%) scale(0.92); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
          100% { transform: translate(-50%, -50%) scale(0.92); }
        }
        .anim-target {
          animation: targetPulse 1.1s infinite ease-in-out;
        }

        @keyframes shrinkTimer {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 283; }
        }
        .timer-progress {
          stroke-dasharray: 283;
          animation: shrinkTimer ${target.duration}ms linear forwards;
        }

        @keyframes floatUp {
          0% { transform: translate(-50%, 0) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -40px) scale(1.2); opacity: 0; }
        }
        .floating-pts {
          animation: floatUp 0.75s ease-out forwards;
        }

        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
        }
        .click-ripple {
          animation: ripple 0.5s ease-out forwards;
        }
      `}</style>

      {/* =========================================================================
          BACKGROUND RACING ACCENTS & WATERMARKS
         ========================================================================= */}
      {/* Top-Left Diagonal Racing Stripes */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-44 sm:h-44 pointer-events-none z-0">
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
        </svg>
      </div>

      {/* Bottom-Right Diagonal Racing Wedge */}
      <div className="absolute bottom-0 right-0 w-36 h-36 sm:w-52 sm:h-52 pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full absolute bottom-0 right-0"
          fill="none"
        >
          <polygon points="200,20 50,200 200,200" fill="#08080a" />
          <line
            x1="120"
            y1="0"
            x2="200"
            y2="80"
            stroke="#e51b24"
            strokeWidth="4.5"
          />
          <line
            x1="140"
            y1="0"
            x2="200"
            y2="60"
            stroke="#ffffff"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* Faint Center Arena Grid Watermark */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-20">
        <svg width="450" height="450" viewBox="0 0 450 450" fill="none">
          <circle
            cx="225"
            cy="225"
            r="200"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="5 7"
          />
          <circle
            cx="225"
            cy="225"
            r="140"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <circle cx="225" cy="225" r="75" stroke="#94a3b8" strokeWidth="1.2" />
          <line
            x1="225"
            y1="10"
            x2="225"
            y2="440"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          <line
            x1="10"
            y1="225"
            x2="440"
            y2="225"
            stroke="#94a3b8"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* =========================================================================
          TOP HUD BAR (Stage, 30s Timer, Score, Sound, Pause)
         ========================================================================= */}
      <div className="w-full max-w-6xl flex items-center justify-between gap-2 sm:gap-4 relative z-20 shrink-0">
        {/* Left: Back / Pause Button & Stage Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              if (gameState === "playing") setGameState("paused");
              else if (onBack) onBack();
            }}
            className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-white border border-neutral-200/90 shadow-sm hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-neutral-800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="font-branding font-black text-xs text-neutral-800 uppercase tracking-wider hidden sm:inline">
              {gameState === "playing" ? "PAUSE" : "BACK"}
            </span>
          </button>

          {/* Level & Stage Pill */}
          <div className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-white border border-neutral-200/90 shadow-sm flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <span className="font-branding font-black text-xs sm:text-sm text-neutral-900 tracking-wider uppercase">
              {config.name} • L-{stage}
            </span>
          </div>
        </div>

        {/* Center: PROMINENT 30-SECOND COUNTDOWN CLOCK */}
        <div className="flex flex-col items-center">
          <div
            className={`flex items-center gap-2 px-4 sm:px-6 py-1 rounded-2xl border transition-all duration-200 shadow-sm ${
              timeLeft <= 5.0
                ? "bg-red-50 border-red-400 text-[#e51b24] animate-pulse scale-105"
                : timeLeft <= 10.0
                  ? "bg-amber-50 border-amber-300 text-amber-600"
                  : "bg-white border-neutral-200/90 text-neutral-900"
            }`}
          >
            {/* Stopwatch Icon */}
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 sm:w-5 sm:h-5 text-current"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 6 12 12 15 15" />
            </svg>

            {/* Digital Timer */}
            <span className="font-racing font-black text-lg sm:text-2xl md:text-3xl tracking-tight">
              {timeLeft.toFixed(1)}s
            </span>
          </div>

          {/* Progress Bar of 30 Seconds */}
          <div className="w-32 sm:w-44 h-1.5 bg-neutral-200 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full transition-all duration-100 ${
                timeLeft <= 5.0
                  ? "bg-[#e51b24]"
                  : timeLeft <= 10.0
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              }`}
              style={{ width: `${(timeLeft / TOTAL_TIME) * 100}%` }}
            />
          </div>
        </div>

        {/* Right: Sound Toggle, Hits & Score Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-neutral-200/90 shadow-sm flex items-center justify-center hover:bg-neutral-50 cursor-pointer"
            aria-label="Sound Toggle"
          >
            {isMuted ? (
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-neutral-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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
                className="w-4 h-4 text-neutral-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon
                  points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                  fill="currentColor"
                />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>

          {/* Targets Hit Counter */}
          <div className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-center leading-none text-right">
            <span className="font-branding text-[8px] font-extrabold text-neutral-400 uppercase tracking-wider">
              HITS
            </span>
            <span className="font-racing text-xs sm:text-base font-black text-emerald-600">
              {hits} / {config.minHitsToPass}
            </span>
          </div>

          {/* Score Badge */}
          <div className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-center leading-none text-right">
            <span className="font-branding text-[8px] font-extrabold text-neutral-400 uppercase tracking-wider">
              SCORE
            </span>
            <span className="font-racing text-xs sm:text-base font-black text-neutral-900 tracking-tight">
              {score.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Sub-HUD: Reaction ms, Rating & Streak Indicator */}
      <div className="w-full max-w-5xl flex items-center justify-between px-2 sm:px-4 my-1 text-xs font-branding z-20 shrink-0">
        {/* Live Reaction Time */}
        <div className="flex items-center gap-1.5 bg-white/85 px-3 py-1 rounded-lg border border-neutral-200/80 shadow-xs">
          <span className="text-neutral-500 font-bold">REACTION:</span>
          <span className="font-black text-neutral-900 font-racing">
            {lastReactionTime ? `${lastReactionTime} ms` : "--"}
          </span>
        </div>

        {/* Live Rating Pop */}
        {lastRating && (
          <div
            className={`font-racing font-black text-xs sm:text-sm px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs ${
              lastRating.includes("PERFECT") || lastRating.includes("BONUS")
                ? "bg-amber-100 text-amber-700 border border-amber-300"
                : lastRating.includes("FAST")
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  : lastRating.includes("HAZARD") || lastRating === "MISSED"
                    ? "bg-red-100 text-red-700 border border-red-300 animate-shake"
                    : "bg-neutral-100 text-neutral-700"
            }`}
          >
            {lastRating}
          </div>
        )}

        {/* Streak Combo Badge */}
        <div className="flex items-center gap-1.5 bg-white/85 px-3 py-1 rounded-lg border border-neutral-200/80 shadow-xs">
          <span className="text-[#e51b24] font-black">🔥</span>
          <span className="text-neutral-500 font-bold">STREAK:</span>
          <span className="font-black text-neutral-900 font-racing">
            {streak}x
          </span>
        </div>
      </div>

      {/* =========================================================================
          MAIN GAME ARENA (Responsive Full-Cover Interactive Field)
         ========================================================================= */}
      <div className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center relative z-20 my-1 min-h-[300px]">
        <div
          ref={arenaRef}
          onClick={handleArenaClick}
          className="relative w-full h-full rounded-3xl bg-white border-2 border-neutral-300/90 shadow-xl overflow-hidden cursor-crosshair select-none"
          style={{
            backgroundImage: `radial-gradient(#e2e8f0 1.5px, transparent 1.5px)`,
            backgroundSize: "26px 26px",
          }}
        >
          {/* High-Tech Grid Coordinate Markers */}
          <span className="absolute top-2 left-3 font-mono text-[9px] text-neutral-400 font-bold pointer-events-none">
            LOC: X[A1] Y[01]
          </span>
          <span className="absolute top-2 right-3 font-mono text-[9px] text-neutral-400 font-bold pointer-events-none">
            30S_RUSH // STG_{stage}
          </span>
          <span className="absolute bottom-2 left-3 font-mono text-[9px] text-neutral-400 font-bold pointer-events-none">
            CALIBRATION_ACTIVE
          </span>

          {/* Miss / Click Ripples */}
          {clickRipples.map((ripple) => (
            <div
              key={ripple.id}
              className="absolute click-ripple pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: ripple.x, top: ripple.y }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-[#e51b24] flex items-center justify-center text-[#e51b24] text-[10px] font-black">
                ✕
              </div>
            </div>
          ))}

          {/* Floating Points Feedback (+350, +500) */}
          {floatingTexts.map((f) => (
            <div
              key={f.id}
              className="absolute floating-pts font-racing font-black text-sm sm:text-base pointer-events-none drop-shadow-md z-30"
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                color: f.color,
              }}
            >
              {f.text}
            </div>
          ))}

          {/* =====================================================================
              ACTIVE TARGET (Standard Bullseye, Golden Bonus, or Hazard Decoy)
             ===================================================================== */}
          {gameState === "playing" && (
            <div
              onClick={handleTargetClick}
              className="absolute anim-target transition-transform active:scale-90 cursor-pointer select-none z-20"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: `${config.targetSize}px`,
                height: `${config.targetSize}px`,
              }}
            >
              {/* Outer Shrinking Timer Ring */}
              <svg
                className="w-full h-full -rotate-90 pointer-events-none overflow-visible"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e2e8f0"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={
                    target.type === "hazard"
                      ? "#111827"
                      : target.type === "bonus"
                        ? "#eab308"
                        : "#e51b24"
                  }
                  strokeWidth="5.5"
                  fill="none"
                  strokeLinecap="round"
                  className="timer-progress"
                />
              </svg>

              {/* Target Graphic */}
              <div
                className={`absolute inset-1.5 rounded-full flex items-center justify-center shadow-lg border transition-all ${
                  target.type === "hazard"
                    ? "bg-[#0b0c10] border-neutral-800 text-white"
                    : target.type === "bonus"
                      ? "bg-amber-400 border-amber-500 text-neutral-900 shadow-amber-500/40"
                      : "bg-white border-neutral-300 shadow-red-500/20"
                }`}
              >
                {target.type === "hazard" ? (
                  // Hazard Icon
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-sm font-black text-[#e51b24]">☠</span>
                  </div>
                ) : target.type === "bonus" ? (
                  // Golden Bonus Target Icon
                  <div className="w-3/4 h-3/4 rounded-full border-2 border-amber-600 flex items-center justify-center">
                    <span className="font-racing font-black text-xs text-amber-900">
                      ★
                    </span>
                  </div>
                ) : (
                  // Standard Bullseye Target
                  <div className="w-3/4 h-3/4 rounded-full border-2 border-neutral-900 flex items-center justify-center">
                    <div className="w-1/2 h-1/2 rounded-full bg-[#e51b24] flex items-center justify-center shadow-xs">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                )}

                {/* Crosshair Lines for Standard Target */}
                {target.type === "standard" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-[1px] bg-[#e51b24]/60" />
                    <div className="absolute h-full w-[1px] bg-[#e51b24]/60" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =====================================================================
              COUNTDOWN OVERLAY (3... 2... 1... RUSH!)
             ===================================================================== */}
          {gameState === "countdown" && (
            <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center z-40">
              <span className="font-branding text-xs font-black tracking-[0.3em] text-[#e51b24] uppercase mb-1">
                STAGE L-{stage} // 30 SECONDS RUSH
              </span>
              <div className="font-racing font-black italic text-7xl sm:text-8xl md:text-9xl text-neutral-900 leading-none animate-pulse my-1">
                {countdown > 0 ? countdown : "RUSH!"}
              </div>
              <span className="font-branding text-[11px] sm:text-xs font-bold text-neutral-500 tracking-widest uppercase mt-3">
                HIT AT LEAST {config.minHitsToPass} TARGETS TO CLEAR
              </span>
            </div>
          )}

          {/* =====================================================================
              PAUSE OVERLAY
             ===================================================================== */}
          {gameState === "paused" && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center z-40 p-4">
              <div className="bg-white border-2 border-neutral-900 rounded-3xl p-6 sm:p-7 max-w-xs w-full shadow-2xl text-center">
                <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center mx-auto mb-3 text-neutral-800 font-black text-lg">
                  ⏸
                </div>
                <h2 className="font-branding font-black text-xl text-neutral-900 uppercase tracking-wider mb-4">
                  RACE PAUSED
                </h2>
                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGameState("playing")}
                    className="w-full py-2.5 rounded-xl bg-[#0b0c10] text-white font-branding font-black text-xs tracking-wider uppercase hover:bg-neutral-800 cursor-pointer"
                  >
                    RESUME RACE
                  </button>
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="w-full py-2.5 rounded-xl border border-neutral-300 font-branding font-bold text-xs tracking-wider uppercase hover:bg-neutral-50 cursor-pointer"
                  >
                    RESTART 30S
                  </button>
                  <button
                    type="button"
                    onClick={onBack}
                    className="w-full py-2.5 rounded-xl border border-neutral-300 font-branding font-bold text-xs tracking-wider uppercase hover:bg-neutral-50 cursor-pointer"
                  >
                    EXIT TO LEVELS
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              30-SECOND GAME OVER / STAGE RESULTS OVERLAY
             ===================================================================== */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center z-50 p-3 sm:p-4">
              <div className="bg-white border-2 border-neutral-900 rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl text-center">
                {/* Status Subtitle */}
                <div className="flex items-center justify-center gap-1.5 text-[#e51b24] font-branding font-black text-[10px] tracking-[0.25em] uppercase mb-1">
                  <span>──</span>
                  <span>30-SECOND RUSH COMPLETED</span>
                  <span>──</span>
                </div>

                {/* Main Outcome Heading */}
                <h2 className="font-black italic text-3xl text-neutral-900 leading-tight uppercase mb-6">
                  {isPassed ? "Level Completed!" : "TIME'S UP!"}
                </h2>

                {/* Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-left my-2 sm:my-3">
                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                      TARGETS HIT
                    </span>
                    <span
                      className={`font-racing text-base font-black ${
                        isPassed ? "text-emerald-600" : "text-[#e51b24]"
                      }`}
                    >
                      {hits} / {config.minHitsToPass} target
                    </span>
                  </div>

                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                      AVG REACTION
                    </span>
                    <span className="font-racing text-base font-black text-neutral-900">
                      {avgReactionTime} ms
                    </span>
                  </div>

                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                      ACCURACY
                    </span>
                    <span className="font-racing text-base font-black text-emerald-600">
                      {accuracy}%
                    </span>
                  </div>

                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                      FINAL SCORE
                    </span>
                    <span className="font-racing text-base font-black text-[#e51b24]">
                      {score.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Primary & Secondary Action Buttons */}
                <div className="flex flex-col gap-2 mt-3">
                  {/* Claim Certificate Button */}
                  <button
                    type="button"
                    onClick={() => setShowCertModal(true)}
                    className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-900 font-branding font-black text-xs tracking-wider uppercase hover:brightness-105 shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer border border-amber-600/30 transition-transform active:scale-98"
                  >
                    <span>📜</span>
                    <span>GENERATE CERTIFICATE</span>
                  </button>

                  <button
                    type="button"
                    onClick={onBack}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-branding font-black text-xs tracking-wider uppercase hover:brightness-105 shadow-md shadow-emerald-500/25 cursor-pointer"
                  >
                    Back To Level
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="flex-1 py-2 rounded-xl border border-neutral-300 font-branding font-bold text-xs uppercase hover:bg-neutral-50 cursor-pointer"
                    >
                      RETRY ↺
                    </button>
                  </div>
                </div>
              </div>

              {/* Name Input Modal for Certificate Generation */}
              {showCertModal && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center z-50 p-4">
                  <div className="bg-white border-2 border-neutral-900 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl text-center relative">
                    <button
                      type="button"
                      onClick={() => setShowCertModal(false)}
                      className="absolute top-4 right-4 w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-xs font-bold text-neutral-500 hover:bg-neutral-100 cursor-pointer"
                    >
                      ✕
                    </button>

                    <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center mx-auto mb-2 text-xl shadow-xs">
                      📜
                    </div>

                    <h3 className="font-branding text-lg font-black tracking-wider uppercase text-neutral-900 mb-1">
                      OFFICIAL CERTIFICATE
                    </h3>
                    <p className="font-branding text-neutral-500 text-xs mb-4">
                      Enter your name to personalize your verified Reaction Rush
                      Reflex Certificate!
                    </p>

                    <form
                      onSubmit={handleCertificateSubmit}
                      className="flex flex-col gap-3"
                    >
                      <div className="text-left">
                        <label className="font-branding text-[10px] font-black uppercase text-neutral-600 tracking-wider block mb-1">
                          RACER FULL NAME
                        </label>
                        <input
                          type="text"
                          required
                          autoFocus
                          value={certPlayerName}
                          onChange={(e) => setCertPlayerName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-neutral-800 font-branding font-bold text-sm text-neutral-900 focus:outline-none focus:border-[#e51b24] transition-colors"
                        />
                      </div>

                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setShowCertModal(false)}
                          className="flex-1 py-2.5 rounded-xl border border-neutral-300 font-branding font-bold text-xs uppercase hover:bg-neutral-50 cursor-pointer"
                        >
                          CANCEL
                        </button>
                        <button
                          type="submit"
                          disabled={!certPlayerName.trim()}
                          className="flex-1 py-2.5 rounded-xl bg-[#e51b24] disabled:opacity-50 text-white font-branding font-black text-xs uppercase tracking-wider hover:bg-red-700 shadow-md shadow-red-500/25 cursor-pointer"
                        >
                          GENERATE ▶
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          BOTTOM SLOGAN / MOTTO BAR
         ========================================================================= */}
      <div className="w-full flex justify-center relative z-20 shrink-0 mb-1">
        <div className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full border border-neutral-300 bg-white/85 backdrop-blur-sm shadow-xs">
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 fill-[#e51b24] text-[#e51b24]"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span className="font-branding font-black text-[9.5px] sm:text-[10px] tracking-[0.2em] text-neutral-800 uppercase">
            30-SECOND RUSH. EVERY CLICK COUNTS. EVERY MILLISECOND MATTERS.
          </span>
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 text-[#e51b24]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" fill="#e51b24" stroke="none" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Game;
