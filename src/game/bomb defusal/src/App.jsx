import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  Brain,
  BatteryWarning,
  Check,
  ChevronRight,
  Clock3,
  Download,
  Flame,
  LockKeyhole,
  Layers3,
  HelpCircle,
  House,
  UserRound,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";

const LEVELS = [
  {
    id: 1,
    kind: "wire",
    title: "Wire Sequence",
    subtitle: "Identify the only safe wire.",
    time: 35,
    brief:
      "The manual says to cut the wire whose number is greater than 4, even, and not divisible by 3.",
    clue: "Greater than 4 • Even • Not divisible by 3",
    options: ["2", "6", "8", "9"],
    answer: "8",
  },
  {
    id: 2,
    kind: "code",
    title: "Code Lock",
    subtitle: "Find the three-digit disarm code.",
    time: 40,
    brief:
      "The code has three digits. The first digit is 2 more than the second. The third digit is twice the second. Their total is 14.",
    clue: "A = B + 2 • C = 2B • A + B + C = 14",
    options: ["563", "452", "365", "524"],
    answer: "452",
  },
  {
    id: 3,
    kind: "switch",
    title: "Switch Logic",
    subtitle: "Set the switches to the safe state.",
    time: 40,
    brief:
      "Switch A must be ON. Switch B must be opposite to A. Switch C must be OFF.",
    clue: "A = ON • B ≠ A • C = OFF",
    options: [
      "A ON / B OFF / C OFF",
      "A OFF / B ON / C OFF",
      "A ON / B ON / C OFF",
      "A ON / B OFF / C ON",
    ],
    answer: "A ON / B OFF / C OFF",
  },
  {
    id: 4,
    kind: "symbol",
    title: "Symbol Decoder",
    subtitle: "Decode the mathematical symbol lock.",
    time: 40,
    brief:
      "Triangle equals 2, circle equals 4, and square equals 6. What is triangle + circle × square?",
    clue: "Multiplication is performed before addition.",
    options: ["26", "50", "14", "30"],
    answer: "26",
  },
  {
    id: 5,
    kind: "sequence",
    title: "Fuse Order",
    subtitle: "Activate the fuses in the safe order.",
    time: 40,
    brief:
      "Fuse C must be activated first. Fuse A must be activated immediately before Fuse B.",
    clue: "C is first • A immediately precedes B",
    options: ["C → A → B", "A → C → B", "B → A → C", "C → B → A"],
    answer: "C → A → B",
  },
  {
    id: 6,
    kind: "valve",
    title: "Pressure Chamber",
    subtitle: "Choose the valve that reaches safe pressure.",
    time: 40,
    brief:
      "Current pressure is 9. Valve 1 lowers pressure by 2. Valve 2 raises it by 5. Valve 3 lowers it by 6. Safe pressure is exactly 7.",
    clue: "9 must become exactly 7.",
    options: ["Valve 1", "Valve 2", "Valve 3", "Do nothing"],
    answer: "Valve 1",
  },
  {
    id: 7,
    kind: "circuit",
    title: "Circuit Path",
    subtitle: "Route the signal around the dead node.",
    time: 45,
    brief:
      "The signal must travel from START to END. Node B is dead. Select the safe path.",
    clue: "Never enter node B.",
    options: [
      "START → A → C → END",
      "START → B → C → END",
      "START → A → B → END",
      "START → B → A → END",
    ],
    answer: "START → A → C → END",
  },
  {
    id: 8,
    kind: "binary",
    title: "Binary Lock",
    subtitle: "Convert the binary instruction.",
    time: 40,
    brief: "The bomb display reads 1011. Enter its decimal value.",
    clue: "1011₂ = 8 + 2 + 1",
    options: ["9", "10", "11", "12"],
    answer: "11",
  },
  {
    id: 9,
    kind: "master",
    title: "Master Code",
    subtitle: "Combine all three clues.",
    time: 45,
    brief:
      "The master code is even, greater than 20, less than 30, and its digits add up to 8.",
    clue: "20 < code < 30 • Even • Digit sum = 8",
    options: ["22", "24", "26", "28"],
    answer: "26",
  },
  {
    id: 10,
    kind: "final",
    title: "Final Bomb",
    subtitle: "One last deduction. Defuse it.",
    time: 55,
    brief:
      "Four numbers are shown: 1, 3, 6, 10. The manual says to enter the next number in the pattern.",
    clue: "The gaps are +2, +3, +4, so the next gap is +5.",
    options: ["12", "14", "15", "16"],
    answer: "15",
  },
];

function App({ onExitGame }) {
  const [screen, setScreen] = useState("landing");
  const [name, setName] = useState("");
  const [levelIndex, setLevelIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [timeLeft, setTimeLeft] = useState(LEVELS[0].time);
  const [score, setScore] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [completedLevel, setCompletedLevel] = useState(0);

  const level = LEVELS[levelIndex];

  useEffect(() => {
    if (screen !== "game") return;

    if (timeLeft <= 0) {
      setScreen("gameover");
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((value) => value - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [screen, timeLeft]);

  const progress = ((levelIndex + 1) / LEVELS.length) * 100;
  const timerProgress = Math.max(0, Math.min(100, (timeLeft / level.time) * 100));
  const danger = timeLeft <= 10;

  const startMission = () => {
    if (!name.trim()) return;
    setLevelIndex(0);
    setSelected("");
    setScore(0);
    setCompletedLevel(0);
    setTimeLeft(LEVELS[0].time);
    setScreen("game");
  };

  const submit = () => {
    if (!selected) return;

    if (selected !== level.answer) {
      setScreen("gameover");
      return;
    }

    const earned = 100 + timeLeft * 5;
    setScore((value) => value + earned);
    setCompletedLevel(level.id);
    setScreen("complete");
  };

  const nextLevel = () => {
    if (levelIndex === LEVELS.length - 1) {
      setScreen("final");
      return;
    }

    const nextIndex = levelIndex + 1;
    setLevelIndex(nextIndex);
    setSelected("");
    setTimeLeft(LEVELS[nextIndex].time);
    setScreen("game");
  };

  const retry = () => {
    setLevelIndex(0);
    setSelected("");
    setScore(0);
    setCompletedLevel(0);
    setTimeLeft(LEVELS[0].time);
    setScreen("game");
  };

  const playAgain = () => {
    setName("");
    setLevelIndex(0);
    setSelected("");
    setScore(0);
    setCompletedLevel(0);
    setTimeLeft(LEVELS[0].time);
    setScreen("name");
  };

  const downloadCertificate = (finalCertificate = false) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1800;
    canvas.height = 1100;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#05070b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 8;
    ctx.strokeRect(55, 55, 1690, 990);

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.strokeRect(78, 78, 1644, 944);

    ctx.textAlign = "center";

    ctx.fillStyle = "#ef4444";
    ctx.font = "800 36px Arial";
    ctx.fillText("BOMB DEFUSAL COMMAND", 900, 190);

    ctx.fillStyle = "#fff";
    ctx.font = "900 74px Arial";
    ctx.fillText(
      finalCertificate ? "MASTER DEFUSAL CERTIFICATE" : "DEFUSAL CERTIFICATE",
      900,
      315
    );

    ctx.fillStyle = "#94a3b8";
    ctx.font = "28px Arial";
    ctx.fillText("This certifies that", 900, 425);

    ctx.fillStyle = "#fff";
    ctx.font = "900 68px Arial";
    ctx.fillText(name, 900, 515);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "28px Arial";
    ctx.fillText(
      finalCertificate
        ? "successfully completed all 10 logical bomb-defusal levels"
        : `successfully completed Level ${completedLevel}`,
      900,
      600
    );

    ctx.fillStyle = "#ef4444";
    ctx.font = "800 34px Arial";
    ctx.fillText(`SCORE: ${score}`, 900, 720);

    ctx.fillStyle = "#64748b";
    ctx.font = "22px Arial";
    ctx.fillText("BOMB DEFUSAL TRAINING DIVISION", 900, 900);

    const link = document.createElement("a");
    link.download = finalCertificate
      ? "Bomb-Defusal-Master-Certificate.png"
      : `Bomb-Defusal-Level-${completedLevel}-Certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900">
      <Background />

      {screen === "landing" && (
        <Landing
          onStart={() => setScreen("name")}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
          onExitGame={onExitGame}
        />
      )}

      {screen === "name" && (
        <NameEntry
          name={name}
          setName={setName}
          onStart={startMission}
          onBack={() => setScreen("landing")}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />
      )}

      {screen === "game" && (
        <Game
          level={level}
          levelIndex={levelIndex}
          progress={progress}
          timerProgress={timerProgress}
          timeLeft={timeLeft}
          danger={danger}
          selected={selected}
          setSelected={setSelected}
          submit={submit}
          score={score}
          name={name}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />
      )}

      {screen === "complete" && (
        <LevelComplete
          level={completedLevel}
          score={score}
          name={name}
          onDownload={() => downloadCertificate(false)}
          onNext={nextLevel}
        />
      )}

      {screen === "gameover" && (
        <GameOver
          level={level.id}
          onRetry={retry}
          onHome={() => setScreen("landing")}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />
      )}

      {screen === "final" && (
        <FinalCertificate
          name={name}
          score={score}
          onDownload={() => downloadCertificate(true)}
          onPlayAgain={playAgain}
        />
      )}
    </div>
  );
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-red-600/[0.035] blur-[130px]" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />
    </div>
  );
}

function Header({ soundOn, setSoundOn, showSound = true }) {
  return (
    <header className="relative border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Bomb Defusal"
            className="h-10 w-auto max-w-[180px] object-contain"
          />
        </div>

        {showSound && (
          <button
            onClick={() => setSoundOn((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Toggle sound"
          >
            {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
        )}
      </div>
    </header>
  );
}

function Shell({ children, ...headerProps }) {
  return (
    <div className="relative min-h-screen">
      <Header {...headerProps} />
      <main className="relative px-5 py-9 md:px-8 md:py-14">{children}</main>
    </div>
  );
}

function Landing({ onStart, soundOn, setSoundOn, onExitGame }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="relative h-screen min-h-[760px] overflow-hidden bg-white text-slate-900">
      {/* soft center glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[18%] h-[620px] w-[760px] -translate-x-1/2 rounded-full bg-red-500/[0.035] blur-[110px]" />

        {/* corner brackets */}
        <div className="absolute left-6 top-6 h-9 w-9 border-l-[5px] border-t-[5px] border-red-600 md:left-7 md:top-7" />
        <div className="absolute right-6 top-6 h-9 w-9 border-r-[5px] border-t-[5px] border-red-600 md:right-7 md:top-7" />
        <div className="absolute bottom-6 left-6 h-9 w-9 border-b-[5px] border-l-[5px] border-red-600 md:left-7 md:bottom-7" />
        <div className="absolute bottom-6 right-6 h-9 w-9 border-b-[5px] border-r-[5px] border-red-600 md:right-7 md:bottom-7" />

        {/* decorative plus signs */}
        <span className="absolute left-[24%] top-[15%] text-3xl font-black text-red-300/80">+</span>
        <span className="absolute left-[22%] top-[36%] text-3xl font-black text-red-300/70">+</span>
        <span className="absolute right-[25%] top-[19%] text-3xl font-black text-red-300/80">+</span>
        <span className="absolute right-[18%] top-[45%] text-3xl font-black text-red-300/70">+</span>
        <span className="absolute left-[19%] bottom-[12%] text-2xl font-black text-red-300/70">+</span>
        <span className="absolute right-[20%] bottom-[12%] text-2xl font-black text-red-300/70">+</span>

        {/* dotted decorative clusters */}
        <div className="absolute left-8 top-[22%] grid grid-cols-4 gap-2 opacity-60">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-red-300" />
          ))}
        </div>
        <div className="absolute bottom-[-15px] left-[-10px] grid grid-cols-9 gap-2 opacity-40">
          {Array.from({ length: 54 }).map((_, i) => (
            <span key={i} className="h-2 w-2 rounded-full bg-red-300" />
          ))}
        </div>
        <div className="absolute bottom-[-15px] right-[-10px] grid grid-cols-9 gap-2 opacity-40">
          {Array.from({ length: 54 }).map((_, i) => (
            <span key={i} className="h-2 w-2 rounded-full bg-red-300" />
          ))}
        </div>

        {/* faint diagonal accents */}
        <div className="absolute left-[11%] top-[22%] h-24 w-28 -skew-x-[25deg] bg-gradient-to-r from-red-100/50 to-transparent blur-sm" />
        <div className="absolute right-[10%] top-[24%] h-24 w-28 skew-x-[25deg] bg-gradient-to-l from-red-100/50 to-transparent blur-sm" />
        <div className="absolute left-[9%] top-[46%] h-28 w-px rotate-[38deg] bg-red-200/60" />
        <div className="absolute left-[11%] top-[43%] h-28 w-px rotate-[38deg] bg-red-200/50" />
        <div className="absolute right-[9%] top-[47%] h-28 w-px -rotate-[38deg] bg-red-200/60" />
        <div className="absolute right-[11%] top-[44%] h-28 w-px -rotate-[38deg] bg-red-200/50" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col px-6 py-6 md:px-10 md:py-7">
        {/* top controls + studio logo */}
        <div className="grid grid-cols-3 items-start">
          <button
            onClick={() => setSoundOn((value) => !value)}
            className="group flex w-[88px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white/95 px-3 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-xl md:w-[92px] md:py-4 cursor-pointer"
          >
            <Volume2
              size={25}
              strokeWidth={2.7}
              className={soundOn ? "text-slate-900" : "text-slate-400"}
            />
            <span className="text-[11px] font-black uppercase tracking-wide text-slate-800">
              Sound
            </span>
          </button>

          <div className="justify-self-center text-center">
            <div className="text-xl font-black tracking-tight text-slate-950">
              NEBULOID TECH
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600">
              STUDIO
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowHowToPlay(true)}
              className="group flex w-[88px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white/95 px-3 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-xl md:w-[92px] md:py-4 cursor-pointer"
            >
              <span className="flex h-[25px] w-[25px] items-center justify-center rounded-full border-[2.5px] border-slate-900 text-[15px] font-black leading-none text-slate-900">
                ?
              </span>
              <span className="text-[11px] font-black uppercase tracking-wide text-slate-800">
                How To Play
              </span>
            </button>
          </div>
        </div>

        {/* hero */}
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
          <div className="mb-5 flex items-center gap-3 rounded-full border-[2px] border-red-300 bg-white/90 px-5 py-2 shadow-[0_5px_20px_rgba(239,68,68,0.08)] md:mb-6 md:px-6">
            <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.45)]" />
            <span className="text-sm font-black uppercase tracking-[0.08em] text-red-600 md:text-[17px]">
              Emergency Protocol
            </span>
            <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.45)]" />
          </div>

          {/* bomb */}
          <div className="relative mb-5 flex h-[138px] w-[138px] items-center justify-center rounded-[28px] bg-white shadow-[0_14px_35px_rgba(15,23,42,0.07),0_0_30px_rgba(239,68,68,0.08)] md:mb-6 md:h-[150px] md:w-[150px]">
            <div className="absolute left-1/2 top-[53%] h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-slate-800 bg-slate-700 shadow-inner" />
            <div className="absolute left-[39%] top-[28%] h-8 w-4 -rotate-45 rounded-full bg-slate-800" />
            <div className="absolute left-[47%] top-[20%] h-7 w-5 rotate-[22deg] rounded-md bg-slate-800" />
            <div className="absolute left-[54%] top-[17%] h-3 w-3 rounded-full bg-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.18)]" />
            <div className="absolute left-[58%] top-[14%] text-xl">💥</div>
            <div className="absolute left-[38%] top-[46%] h-3 w-5 rounded-full bg-slate-500/70 blur-[1px]" />
          </div>

          <p className="mb-3 text-[13px] font-black uppercase tracking-[0.48em] text-red-600 md:text-[15px]">
            Bomb Defusal
          </p>

          <h1 className="text-[48px] font-black leading-[0.92] tracking-[-0.045em] text-slate-950 sm:text-[62px] md:text-[76px] lg:text-[88px]">
            THINK FAST.
            <br />
            <span className="text-red-600">DEFUSE FASTER.</span>
          </h1>

          <p className="mt-6 text-sm font-medium leading-6 text-slate-500 md:text-[17px] md:leading-7">
            Solve quick logic puzzles before the countdown reaches zero.
            <br />
            Complete all 10 levels and earn your master defusal certificate.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7 md:mt-8">
            <button
              onClick={onStart}
              className="group flex min-w-[280px] sm:min-w-[320px] items-center justify-center gap-4 rounded-xl bg-red-600 px-9 py-4 text-base font-black uppercase tracking-[0.06em] text-white shadow-[0_12px_22px_rgba(239,68,68,0.28)] transition hover:-translate-y-1 hover:bg-red-500 hover:shadow-[0_16px_28px_rgba(239,68,68,0.32)] md:py-[18px] md:text-lg cursor-pointer"
            >
              <span className="text-xl md:text-2xl">◎</span>
              <span>Start Mission</span>
              <ArrowRight size={26} strokeWidth={2.7} className="transition-transform group-hover:translate-x-1" />
            </button>

            {onExitGame && (
              <button
                onClick={onExitGame}
                className="flex items-center justify-center px-6 py-4 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm uppercase transition cursor-pointer"
              >
                ← Back to Games
              </button>
            )}
          </div>
        </div>

        {/* bottom stats */}
        <div className="mx-auto mb-1 grid w-full max-w-[760px] grid-cols-3 overflow-hidden rounded-2xl bg-white/95 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col items-center justify-center px-3 py-4 md:py-5">
            <Layers3 size={31} strokeWidth={2.4} className="text-red-600" />
            <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-500">Levels</p>
            <p className="mt-0.5 text-2xl font-black text-slate-950 md:text-3xl">10</p>
          </div>
          <div className="relative flex flex-col items-center justify-center px-3 py-4 md:py-5">
            <span className="absolute left-0 top-1/2 h-12 w-px -translate-y-1/2 bg-red-200" />
            <Brain size={31} strokeWidth={2.4} className="text-red-600" />
            <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-500">Mode</p>
            <p className="mt-0.5 text-2xl font-black text-slate-950 md:text-3xl">LOGIC</p>
            <span className="absolute right-0 top-1/2 h-12 w-px -translate-y-1/2 bg-red-200" />
          </div>
          <div className="flex flex-col items-center justify-center px-3 py-4 md:py-5">
            <ShieldCheck size={31} strokeWidth={2.4} className="text-red-600" />
            <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-500">Threat</p>
            <p className="mt-0.5 text-2xl font-black text-slate-950 md:text-3xl">HIGH</p>
          </div>
        </div>
      </div>

      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-7 text-left shadow-2xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600">Mission Guide</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">How To Play</h2>
              </div>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-500 transition hover:border-red-200 hover:text-red-600"
              >
                CLOSE
              </button>
            </div>
            <div className="mt-6 space-y-3">
              {[
                "Read the mission brief and clue carefully.",
                "Choose the single correct answer before time runs out.",
                "A wrong answer or zero seconds means Game Over.",
                "Defuse all 10 levels to unlock the master certificate.",
              ].map((item, index) => (
                <div key={item} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setShowHowToPlay(false);
                onStart();
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-4 text-sm font-black uppercase tracking-[0.15em] text-white transition hover:bg-red-500"
            >
              Start Mission <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NameEntry({ name, setName, onStart, onBack, soundOn, setSoundOn }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      {/* soft registration-page background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[27%] h-[430px] w-[430px] -translate-x-1/2 rounded-full border border-red-100/70 opacity-60" />
        <div className="absolute left-1/2 top-[27%] h-[500px] w-[500px] -translate-x-1/2 rounded-full border border-red-100/50 opacity-50" />
        <div className="absolute left-1/2 top-[27%] h-[570px] w-[570px] -translate-x-1/2 rounded-full border border-red-100/40 opacity-40" />
        <div className="absolute left-1/2 top-[27%] h-[640px] w-[640px] -translate-x-1/2 rounded-full border border-red-100/30 opacity-30" />
        <div className="absolute left-1/2 top-[26%] h-[500px] w-[850px] -translate-x-1/2 rounded-full bg-red-100/20 blur-[90px]" />

        {/* circuit traces */}
        <div className="absolute left-0 top-[39%] h-px w-[21%] bg-red-200/65" />
        <div className="absolute left-[9%] top-[39%] h-14 w-20 border-b border-r border-red-200/65" />
        <div className="absolute left-0 top-[44%] h-px w-[20%] bg-red-200/55" />
        <div className="absolute left-[8%] top-[44%] h-12 w-28 border-b border-r border-red-200/55" />
        <div className="absolute left-0 top-[49%] h-px w-[22%] bg-red-200/55" />
        <div className="absolute left-[10%] top-[49%] h-9 w-20 border-b border-r border-red-200/55" />
        <div className="absolute right-0 top-[39%] h-px w-[21%] bg-red-200/65" />
        <div className="absolute right-[9%] top-[39%] h-14 w-20 border-b border-l border-red-200/65" />
        <div className="absolute right-0 top-[44%] h-px w-[20%] bg-red-200/55" />
        <div className="absolute right-[8%] top-[44%] h-12 w-28 border-b border-l border-red-200/55" />
        <div className="absolute right-0 top-[49%] h-px w-[22%] bg-red-200/55" />
        <div className="absolute right-[10%] top-[49%] h-9 w-20 border-b border-l border-red-200/55" />

        {["left-[20.2%] top-[39%]", "left-[20.2%] top-[44%]", "left-[20.2%] top-[49%]", "right-[20.2%] top-[39%]", "right-[20.2%] top-[44%]", "right-[20.2%] top-[49%]"].map((pos) => (
          <span key={pos} className={`absolute ${pos} h-4 w-4 rounded-full border-[3px] border-red-200 bg-white`} />
        ))}

        {/* corner brackets */}
        <div className="absolute left-5 top-5 h-12 w-12 border-l-[7px] border-t-[7px] border-red-600" />
        <div className="absolute right-5 top-5 h-12 w-12 border-r-[7px] border-t-[7px] border-red-600" />
        <div className="absolute bottom-5 left-5 h-12 w-12 border-b-[7px] border-l-[7px] border-red-600" />
        <div className="absolute bottom-5 right-5 h-12 w-12 border-b-[7px] border-r-[7px] border-red-600" />

        {/* halftone corners */}
        <div className="absolute -bottom-16 -left-12 h-64 w-72 rotate-[-18deg] opacity-45" style={{ backgroundImage: "radial-gradient(circle, rgba(239,68,68,.42) 2px, transparent 3px)", backgroundSize: "16px 16px" }} />
        <div className="absolute -bottom-16 -right-12 h-64 w-72 rotate-[18deg] opacity-45" style={{ backgroundImage: "radial-gradient(circle, rgba(239,68,68,.42) 2px, transparent 3px)", backgroundSize: "16px 16px" }} />

        {/* decorative pluses */}
        {[
          "left-[20%] top-[20%]",
          "right-[23%] top-[20%]",
          "left-[15%] top-[64%]",
          "right-[22%] top-[70%]",
          "left-[25%] top-[82%]",
        ].map((pos) => (
          <span key={pos} className={`absolute ${pos} text-2xl font-black text-red-300/75`}>+</span>
        ))}

        <div className="absolute left-12 top-[28%] grid grid-cols-3 gap-2 opacity-55">
          {Array.from({ length: 9 }).map((_, i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-red-300" />)}
        </div>
        <div className="absolute right-12 top-[28%] grid grid-cols-3 gap-2 opacity-55">
          {Array.from({ length: 9 }).map((_, i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-red-300" />)}
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-5 py-5 md:px-10 md:py-6">
        {/* top controls + centered studio branding */}
        <div className="grid grid-cols-3 items-start">
          <button
            onClick={() => setSoundOn((value) => !value)}
            className="flex w-[92px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white/95 px-3 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.09)] transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            {soundOn ? <Volume2 size={28} strokeWidth={2.5} className="text-red-600" /> : <VolumeX size={28} strokeWidth={2.5} className="text-red-600" />}
            <span className="text-[11px] font-black uppercase tracking-wide text-slate-900">Sound</span>
          </button>

          <div className="justify-self-center text-center">
            <img
              src="/logo.png"
              alt="Nebuloid Tech Studio"
              className="h-[76px] w-auto max-w-[220px] object-contain md:h-[92px] md:max-w-[250px]"
            />
          </div>

          <button
            onClick={() => setShowHowToPlay(true)}
            className="justify-self-end flex w-[108px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white/95 px-3 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.09)] transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <HelpCircle size={29} strokeWidth={2.5} className="text-red-600" />
            <span className="text-[11px] font-black uppercase tracking-wide text-slate-900">How To Play</span>
          </button>
        </div>

        {/* registration card */}
        <div className="flex flex-1 items-center justify-center py-8 md:py-10">
          <div className="w-full max-w-[575px] rounded-[28px] border border-red-100 bg-white/95 p-7 shadow-[0_25px_70px_rgba(239,68,68,0.13),0_15px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-10 lg:p-11">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-[106px] w-[106px] items-center justify-center rounded-full border border-red-300 bg-red-50/70">
                <LockKeyhole size={45} strokeWidth={2.3} className="text-red-600" />
              </div>

              <div className="mx-auto mb-6 flex max-w-[180px] items-center justify-center gap-4">
                <span className="h-px w-14 bg-red-200" />
                <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
                <span className="h-px w-14 bg-red-200" />
              </div>

              <p className="text-[12px] font-black uppercase tracking-[0.3em] text-red-600 md:text-[13px]">
                Operative Registration
              </p>

              <h2 className="mt-4 text-[38px] font-black leading-none tracking-[-0.04em] text-slate-900 md:text-[44px]">
                Enter <span className="text-red-600">Your</span> Name
              </h2>

              <p className="mx-auto mt-5 max-w-sm text-base font-medium leading-7 text-slate-500 md:text-[17px]">
                Your name will appear on the<br className="hidden md:block" /> defusal certificate.
              </p>

              <div className="relative mt-7">
                <UserRound size={27} strokeWidth={2.2} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-red-600" />
                <input
                  autoFocus
                  value={name}
                  maxLength={30}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") onStart();
                  }}
                  placeholder="Enter your name"
                  className="h-[68px] w-full rounded-xl border-[1.5px] border-red-300 bg-white px-14 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 md:text-lg"
                />
              </div>

              <button
                onClick={onStart}
                disabled={!name.trim()}
                className="group mt-5 flex h-[68px] w-full items-center justify-center gap-5 rounded-xl bg-red-600 px-6 text-base font-black uppercase tracking-[0.05em] text-white shadow-[0_12px_24px_rgba(239,68,68,0.28)] transition hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-[0_16px_30px_rgba(239,68,68,0.34)] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none md:text-lg"
              >
                <span className="text-3xl leading-none">◎</span>
                Begin Defusal
                <ArrowRight size={27} strokeWidth={2.7} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onBack}
                className="mx-auto mt-7 flex items-center justify-center gap-6 text-xs font-black uppercase tracking-[0.16em] text-slate-500 transition hover:text-red-600"
              >
                <span className="h-px w-16 bg-slate-200" />
                Back To Main Menu
                <span className="h-px w-16 bg-slate-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-7 text-left shadow-2xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600">Mission Guide</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">How To Play</h2>
              </div>
              <button onClick={() => setShowHowToPlay(false)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-500 hover:border-red-200 hover:text-red-600">CLOSE</button>
            </div>
            <div className="mt-6 space-y-3">
              {[
                "Enter your operative name to begin.",
                "Read every mission clue carefully.",
                "Choose the correct answer before the timer reaches zero.",
                "Complete all 10 levels to earn the master certificate.",
              ].map((item, index) => (
                <div key={item} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white">{index + 1}</span>
                  <p className="text-sm font-semibold leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function Game({
  level,
  levelIndex,
  progress,
  timerProgress,
  timeLeft,
  danger,
  selected,
  setSelected,
  submit,
  score,
  name,
  soundOn,
  setSoundOn,
}) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      {/* futuristic background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[32%] h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-red-500/[0.025] blur-[100px]" />

        <div className="absolute left-5 top-5 h-10 w-10 border-l-[6px] border-t-[6px] border-red-600 md:left-6 md:top-6" />
        <div className="absolute right-5 top-5 h-10 w-10 border-r-[6px] border-t-[6px] border-red-600 md:right-6 md:top-6" />
        <div className="absolute bottom-5 left-5 h-10 w-10 border-b-[6px] border-l-[6px] border-red-600 md:left-6 md:bottom-6" />
        <div className="absolute bottom-5 right-5 h-10 w-10 border-b-[6px] border-r-[6px] border-red-600 md:right-6 md:bottom-6" />

        <div className="absolute left-8 top-[27%] grid grid-cols-3 gap-2 opacity-60">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-red-300" />
          ))}
        </div>
        <div className="absolute right-8 top-[27%] grid grid-cols-3 gap-2 opacity-60">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-red-300" />
          ))}
        </div>

        <div className="absolute -bottom-10 -left-8 h-72 w-80 rotate-[-18deg] opacity-45"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(239,68,68,.42) 2px, transparent 3px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="absolute -bottom-10 -right-8 h-72 w-80 rotate-[18deg] opacity-45"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(239,68,68,.42) 2px, transparent 3px)",
            backgroundSize: "16px 16px",
          }}
        />

        <span className="absolute left-[20%] top-[22%] text-3xl font-black text-red-300/75">+</span>
        <span className="absolute right-[23%] top-[21%] text-3xl font-black text-red-300/75">+</span>
        <span className="absolute left-[15%] bottom-[19%] text-2xl font-black text-red-300/70">+</span>
        <span className="absolute right-[20%] bottom-[18%] text-2xl font-black text-red-300/70">+</span>

        {/* side circuit traces */}
        <div className="absolute left-0 top-[43%] h-px w-[16%] bg-red-200/70" />
        <div className="absolute left-[7%] top-[43%] h-12 w-20 border-b border-r border-red-200/70" />
        <div className="absolute left-0 top-[49%] h-px w-[17%] bg-red-200/60" />
        <div className="absolute left-[8%] top-[49%] h-10 w-24 border-b border-r border-red-200/60" />
        <div className="absolute left-0 top-[55%] h-px w-[15%] bg-red-200/60" />
        <div className="absolute left-[6%] top-[55%] h-9 w-20 border-b border-r border-red-200/60" />

        <div className="absolute right-0 top-[43%] h-px w-[16%] bg-red-200/70" />
        <div className="absolute right-[7%] top-[43%] h-12 w-20 border-b border-l border-red-200/70" />
        <div className="absolute right-0 top-[49%] h-px w-[17%] bg-red-200/60" />
        <div className="absolute right-[8%] top-[49%] h-10 w-24 border-b border-l border-red-200/60" />
        <div className="absolute right-0 top-[55%] h-px w-[15%] bg-red-200/60" />
        <div className="absolute right-[6%] top-[55%] h-9 w-20 border-b border-l border-red-200/60" />
      </div>

      <div className="relative z-10 mx-auto min-h-screen max-w-[1500px] px-5 py-5 md:px-10 md:py-6">
        {/* top navigation */}
        <div className="relative flex items-start justify-between">
          <button
            onClick={() => setSoundOn((value) => !value)}
            className="flex w-[92px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white/95 px-3 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-xl"
            aria-label="Toggle sound"
          >
            {soundOn ? (
              <Volume2 size={28} strokeWidth={2.5} className="text-red-600" />
            ) : (
              <VolumeX size={28} strokeWidth={2.5} className="text-red-600" />
            )}
            <span className="text-[11px] font-black uppercase tracking-wide text-slate-900">
              Sound
            </span>
          </button>

          <div className="absolute left-1/2 top-0 -translate-x-1/2 text-center">
            <img
              src="/logo.png"
              alt="Nebuloid Tech Studio"
              className="h-[76px] w-auto max-w-[220px] object-contain md:h-[88px] md:max-w-[250px]"
            />
          </div>

          <button
            onClick={() => setShowHowToPlay(true)}
            className="ml-auto flex w-[108px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white/95 px-3 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <HelpCircle size={29} strokeWidth={2.5} className="text-red-600" />
            <span className="text-[11px] font-black uppercase tracking-wide text-slate-900">
              How To Play
            </span>
          </button>
        </div>

        {/* mission header */}
        <div className="mx-auto mt-5 max-w-[1040px] md:mt-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-red-600">
                Active Mission
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <h1 className="text-[34px] font-black tracking-[-0.04em] text-slate-950 md:text-[39px]">
                  LEVEL {level.id}
                </h1>
                <span className="text-xl font-bold text-slate-500 md:text-2xl">/ 10</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Operative" value={name} />
              <MiniStat label="Score" value={score} />
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-slate-700">Mission Progress</span>
              <span className="text-slate-500">
                {levelIndex + 1} / {LEVELS.length}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-red-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* main game panel */}
        <div className="mx-auto mt-6 max-w-[1040px] rounded-[24px] border border-slate-200 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:mt-7 md:p-8 lg:p-9">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-10">
            {/* bomb / timer */}
            <div className="flex flex-col items-center justify-center">
              <BombVisual danger={danger} timeLeft={timeLeft} />

              <div className="mt-5 w-full max-w-xs md:mt-7">
                <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.16em]">
                  <span className="text-slate-800">Detonation Countdown</span>
                  <span className={danger ? "text-red-600" : "text-slate-600"}>
                    {timeLeft}s
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      danger ? "bg-red-500 animate-flicker" : "bg-red-600"
                    }`}
                    style={{ width: `${timerProgress}%` }}
                  />
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-red-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
                  Device Armed
                </div>
              </div>
            </div>

            {/* puzzle */}
            <div className="min-w-0">
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-red-600">
                  <Zap size={14} />
                  {level.kind}
                </div>
                <h2 className="text-[32px] font-black leading-none tracking-[-0.035em] text-slate-950 md:text-[38px]">
                  {level.title}
                </h2>
                <p className="mt-2 text-sm font-medium text-slate-500 md:text-base">
                  {level.subtitle}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
                <div className="mb-2.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
                  <ShieldAlert size={15} />
                  Mission Brief
                </div>
                <p className="text-sm font-semibold leading-6 text-slate-700 md:text-[15px] md:leading-7">
                  {level.brief}
                </p>
              </div>

              <div className="mt-3 rounded-2xl border border-red-200 bg-red-50/60 p-4">
                <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
                  <Sparkles size={14} />
                  Clue
                </div>
                <p className="text-sm font-semibold leading-6 text-slate-600">
                  {level.clue}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {level.options.map((option, index) => {
                  const active = selected === option;

                  return (
                    <button
                      key={option}
                      onClick={() => setSelected(option)}
                      className={`group flex min-h-[49px] w-full items-center gap-3 rounded-xl border px-3.5 text-left transition md:min-h-[52px] ${
                        active
                          ? "border-red-500 bg-red-50 text-slate-950 shadow-[0_5px_18px_rgba(239,68,68,0.08)]"
                          : "border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:bg-red-50/30"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-black ${
                          active
                            ? "border-red-600 bg-red-600 text-white"
                            : "border-red-200 bg-white text-red-600"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span className="text-sm font-bold md:text-[15px]">{option}</span>

                      {active && (
                        <Check size={18} strokeWidth={2.8} className="ml-auto text-red-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={submit}
                disabled={!selected}
                className="group mt-4 flex h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-5 text-sm font-black uppercase tracking-[0.15em] text-white shadow-[0_10px_22px_rgba(239,68,68,0.2)] transition hover:-translate-y-0.5 hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none md:h-[54px] md:text-base"
              >
                Defuse Bomb
                <ShieldCheck size={20} strokeWidth={2.5} className="transition-transform group-hover:scale-110" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600">
                  Mission Guide
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  How To Play
                </h2>
              </div>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-500 transition hover:border-red-200 hover:text-red-600"
              >
                CLOSE
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {[
                "Read the mission brief and clue carefully.",
                "Choose one answer before the countdown reaches zero.",
                "A wrong answer immediately ends the mission.",
                "Defuse all 10 levels to unlock your master certificate.",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold leading-6 text-slate-600">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BombVisual({ timeLeft, danger }) {
  const seconds = String(timeLeft).padStart(2, "0");

  return (
    <div className="relative flex h-[330px] w-[330px] items-center justify-center">
      {/* outer holographic rings */}
      <div className="absolute inset-2 rounded-full border border-red-100/80" />
      <div className="absolute inset-7 rounded-full border border-red-100/75" />
      <div className="absolute inset-12 rounded-full border border-red-100/55" />
      <div className="absolute inset-[58px] rounded-full border border-red-100/45" />
      <div className="absolute inset-0 rounded-full bg-red-500/[0.035] blur-3xl" />

      {/* orbit marks */}
      <div className="absolute left-[22px] top-[50%] h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-red-200 bg-white" />
      <div className="absolute right-[22px] top-[50%] h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-red-200 bg-white" />
      <div className="absolute left-[50%] top-[22px] h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-red-200 bg-white" />
      <div className="absolute bottom-[22px] left-[50%] h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-red-200 bg-white" />

      {/* bomb fuse */}
      <div className="absolute left-[52%] top-[15px] z-20 h-[70px] w-[30px] -rotate-[-20deg]">
        <div className="absolute left-1/2 top-0 h-[58px] w-[9px] -translate-x-1/2 rotate-[18deg] rounded-full bg-gradient-to-r from-slate-900 via-slate-600 to-slate-950 shadow-[0_4px_8px_rgba(15,23,42,.28)]" />
        <div className="absolute left-[15px] top-0 h-3 w-3 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,.9),0_0_24px_rgba(239,68,68,.65)]" />
        <span className="absolute -right-2 -top-3 text-xl leading-none">✦</span>
      </div>

      {/* main bomb shell */}
      <div className="relative flex h-[238px] w-[238px] items-center justify-center rounded-full border-[10px] border-slate-700 bg-gradient-to-br from-slate-500 via-slate-950 to-black shadow-[0_24px_55px_rgba(15,23,42,.30),inset_0_5px_8px_rgba(255,255,255,.22),inset_0_-12px_25px_rgba(0,0,0,.7)]">
        {/* metallic highlight */}
        <div className="pointer-events-none absolute inset-[8px] rounded-full border border-white/15" />
        <div className="pointer-events-none absolute left-[22px] top-[25px] h-16 w-24 rotate-[-28deg] rounded-full bg-white/[0.08] blur-md" />

        {/* side red indicator marks */}
        <div className="absolute left-1 top-[93px] h-[4px] w-9 rotate-[128deg] rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,.55)]" />
        <div className="absolute right-1 top-[93px] h-[4px] w-9 rotate-[52deg] rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,.55)]" />

        {/* recessed center bezel */}
        <div className="relative flex h-[178px] w-[178px] items-center justify-center rounded-full border-[8px] border-slate-800 bg-gradient-to-br from-slate-900 via-[#07111b] to-black shadow-[inset_0_0_0_3px_rgba(255,255,255,.06),inset_0_0_32px_rgba(0,0,0,.95),0_5px_12px_rgba(0,0,0,.45)]">
          {/* glass */}
          <div className="absolute inset-[9px] rounded-full border border-slate-500/20 bg-[#020b13]" />

          {/* digital display */}
          <div className="relative z-10 flex h-[125px] w-[148px] flex-col items-center justify-center rounded-[20px] border-[4px] border-slate-800 bg-[#07131e] shadow-[inset_0_0_28px_rgba(0,0,0,.9),0_2px_5px_rgba(0,0,0,.55)]">
            <span className="text-[9px] font-black uppercase tracking-[0.24em] text-red-500">
              DETONATION
            </span>

            <div
              className={`mt-1 font-mono text-[54px] font-black leading-none tracking-[-0.06em] tabular-nums ${
                danger ? "text-red-500 animate-flicker" : "text-red-500"
              }`}
              style={{ textShadow: "0 0 12px rgba(239,68,68,.42)" }}
            >
              {seconds}
            </div>

            <span className="mt-2 text-[9px] font-black uppercase tracking-[0.22em] text-white/90">
              Seconds
            </span>
          </div>
        </div>

        {/* bottom warning module */}
        <div className="absolute -bottom-[9px] left-1/2 flex h-[35px] w-[48px] -translate-x-1/2 items-center justify-center rounded-[7px] border-2 border-slate-700 bg-gradient-to-b from-slate-800 to-black shadow-[0_5px_12px_rgba(0,0,0,.4)]">
          <span
            className={`h-3 w-3 rounded-full bg-red-500 ${
              danger ? "animate-pulse" : "animate-pulse"
            }`}
            style={{ boxShadow: "0 0 8px rgba(239,68,68,.95), 0 0 18px rgba(239,68,68,.55)" }}
          />
        </div>
      </div>
    </div>
  );
}

function LevelComplete({ level, score, name, onDownload, onNext }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <CertificateBackground />

      <div className="relative z-10 flex min-h-screen flex-col px-5 py-5 md:px-10 md:py-6">
        <CertificateTopBar
          soundOn={true}
          setSoundOn={() => {}}
          onHowToPlay={() => setShowHowToPlay(true)}
        />

        <div className="mx-auto w-full max-w-[860px] flex-1 pb-8 pt-6 md:pt-7">
          <div className="mb-5 text-center">
            <div className="mb-2 inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.25em] text-emerald-500">
              <Check size={17} strokeWidth={3} />
              Device Disarmed
            </div>

            <h1 className="text-[39px] font-black leading-none tracking-[-0.04em] text-slate-950 md:text-[48px]">
              Level <span className="text-red-600">Complete</span>
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-500 md:text-[16px]">
              Good. Move to the next device.
            </p>
          </div>

          <CertificateCard name={name} level={level} score={score} final={false} />

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button
              onClick={onDownload}
              className="group flex h-[66px] items-center justify-center gap-3 rounded-xl border-[1.5px] border-red-200 bg-white text-sm font-black uppercase tracking-[0.08em] text-slate-900 shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-red-400 hover:text-red-600 md:text-base"
            >
              <Download size={22} strokeWidth={2.4} className="text-red-600" />
              Download Certificate
            </button>

            <button
              onClick={onNext}
              className="group flex h-[66px] items-center justify-center gap-3 rounded-xl bg-red-600 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_12px_25px_rgba(239,68,68,0.25)] transition hover:-translate-y-0.5 hover:bg-red-500 md:text-base"
            >
              Next Level
              <ArrowRight size={23} strokeWidth={2.6} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {showHowToPlay && <HowToPlayOverlay onClose={() => setShowHowToPlay(false)} />}
    </div>
  );
}

function FinalCertificate({ name, score, onDownload, onPlayAgain }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <CertificateBackground />

      <div className="relative z-10 flex min-h-screen flex-col px-5 py-5 md:px-10 md:py-6">
        <CertificateTopBar
          soundOn={true}
          setSoundOn={() => {}}
          onHowToPlay={() => setShowHowToPlay(true)}
        />

        <div className="mx-auto w-full max-w-[860px] flex-1 pb-8 pt-6 md:pt-7">
          <div className="mb-5 text-center">
            <div className="mb-2 inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.25em] text-emerald-500">
              <Sparkles size={17} strokeWidth={2.8} />
              Mission Accomplished
            </div>

            <h1 className="text-[39px] font-black leading-none tracking-[-0.04em] text-slate-950 md:text-[48px]">
              Master <span className="text-red-600">Complete</span>
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-500 md:text-[16px]">
              All 10 bombs have been successfully defused.
            </p>
          </div>

          <CertificateCard name={name} level={10} score={score} final />

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button
              onClick={onDownload}
              className="group flex h-[66px] items-center justify-center gap-3 rounded-xl border-[1.5px] border-red-200 bg-white text-sm font-black uppercase tracking-[0.08em] text-slate-900 shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-red-400 hover:text-red-600 md:text-base"
            >
              <Download size={22} strokeWidth={2.4} className="text-red-600" />
              Download Certificate
            </button>

            <button
              onClick={onPlayAgain}
              className="group flex h-[66px] items-center justify-center gap-3 rounded-xl bg-red-600 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_12px_25px_rgba(239,68,68,0.25)] transition hover:-translate-y-0.5 hover:bg-red-500 md:text-base"
            >
              <RotateCcw size={22} strokeWidth={2.5} />
              Play Again
            </button>
          </div>
        </div>
      </div>

      {showHowToPlay && <HowToPlayOverlay onClose={() => setShowHowToPlay(false)} />}
    </div>
  );
}

function GameOver({ level, onRetry, onHome, soundOn, setSoundOn }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[46%] h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-100/70" />
        <div className="absolute left-1/2 top-[46%] h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-100/45" />
        <div className="absolute left-1/2 top-[43%] h-[540px] w-[900px] -translate-x-1/2 rounded-full bg-red-100/25 blur-[110px]" />

        <div className="absolute left-5 top-5 h-10 w-10 border-l-[6px] border-t-[6px] border-red-600 md:left-6 md:top-6" />
        <div className="absolute right-5 top-5 h-10 w-10 border-r-[6px] border-t-[6px] border-red-600 md:right-6 md:top-6" />
        <div className="absolute bottom-5 left-5 h-10 w-10 border-b-[6px] border-l-[6px] border-red-600 md:left-6 md:bottom-6" />
        <div className="absolute bottom-5 right-5 h-10 w-10 border-b-[6px] border-r-[6px] border-red-600 md:right-6 md:bottom-6" />

        <div className="absolute left-8 top-[28%] grid grid-cols-3 gap-2 opacity-60">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-red-300" />
          ))}
        </div>
        <div className="absolute right-8 top-[28%] grid grid-cols-3 gap-2 opacity-60">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-red-300" />
          ))}
        </div>

        <div className="absolute -bottom-14 -left-8 h-72 w-80 rotate-[-18deg] opacity-45"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(239,68,68,.42) 2px, transparent 3px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="absolute -bottom-14 -right-8 h-72 w-80 rotate-[18deg] opacity-45"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(239,68,68,.42) 2px, transparent 3px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="absolute left-0 top-[43%] h-px w-[19%] bg-red-200/65" />
        <div className="absolute left-[8%] top-[43%] h-12 w-24 border-b border-r border-red-200/65" />
        <div className="absolute left-0 top-[49%] h-px w-[17%] bg-red-200/55" />
        <div className="absolute left-[7%] top-[49%] h-9 w-28 border-b border-r border-red-200/55" />
        <div className="absolute left-0 top-[55%] h-px w-[19%] bg-red-200/55" />
        <div className="absolute left-[9%] top-[55%] h-10 w-24 border-b border-r border-red-200/55" />

        <div className="absolute right-0 top-[43%] h-px w-[19%] bg-red-200/65" />
        <div className="absolute right-[8%] top-[43%] h-12 w-24 border-b border-l border-red-200/65" />
        <div className="absolute right-0 top-[49%] h-px w-[17%] bg-red-200/55" />
        <div className="absolute right-[7%] top-[49%] h-9 w-28 border-b border-l border-red-200/55" />
        <div className="absolute right-0 top-[55%] h-px w-[19%] bg-red-200/55" />
        <div className="absolute right-[9%] top-[55%] h-10 w-24 border-b border-l border-red-200/55" />

        <span className="absolute left-[20%] top-[24%] text-3xl font-black text-red-300/75">+</span>
        <span className="absolute right-[21%] top-[24%] text-3xl font-black text-red-300/75">+</span>
        <span className="absolute left-[17%] bottom-[25%] text-2xl font-black text-red-300/70">+</span>
        <span className="absolute right-[17%] bottom-[24%] text-2xl font-black text-red-300/70">+</span>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-5 py-5 md:px-10 md:py-6">
        <div className="grid grid-cols-3 items-start">
          <button
            onClick={() => setSoundOn((value) => !value)}
            className="flex w-[92px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white/95 px-3 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.09)] transition hover:-translate-y-0.5 hover:shadow-xl"
            aria-label="Toggle sound"
          >
            {soundOn ? (
              <Volume2 size={29} strokeWidth={2.5} className="text-red-600" />
            ) : (
              <VolumeX size={29} strokeWidth={2.5} className="text-red-600" />
            )}
            <span className="text-[11px] font-black uppercase tracking-wide text-slate-900">Sound</span>
          </button>

          <div className="justify-self-center">
            <img
              src="/logo.png"
              alt="Nebuloid Tech Studio"
              className="h-[76px] w-auto max-w-[220px] object-contain md:h-[92px] md:max-w-[250px]"
            />
          </div>

          <button
            onClick={() => setShowHowToPlay(true)}
            className="justify-self-end flex w-[108px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white/95 px-3 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.09)] transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <HelpCircle size={29} strokeWidth={2.5} className="text-red-600" />
            <span className="text-[11px] font-black uppercase tracking-wide text-slate-900">How To Play</span>
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center pb-10 pt-5 md:pb-14 md:pt-4">
          <div className="w-full max-w-[900px] text-center">
            <div className="mx-auto flex h-[118px] w-[118px] items-center justify-center rounded-full border border-red-300 bg-red-50/70 shadow-[0_0_45px_rgba(239,68,68,0.14)] md:h-[140px] md:w-[140px]">
              <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full border-2 border-red-200 bg-white md:h-[100px] md:w-[100px]">
                <span className="font-mono text-[58px] font-black leading-none text-red-600 md:text-[68px]">!</span>
              </div>
            </div>

            <div className="mx-auto mt-7 flex max-w-[480px] items-center justify-center gap-5 text-red-600">
              <span className="h-px w-14 bg-red-300 md:w-20" />
              <span className="text-[12px] font-black uppercase tracking-[0.4em] md:text-[14px]">
                Critical Failure
              </span>
              <span className="h-px w-14 bg-red-300 md:w-20" />
            </div>

            <h1 className="mt-5 text-[52px] font-black leading-none tracking-[-0.055em] text-slate-950 sm:text-[66px] md:text-[88px]">
              GAME <span className="text-red-600">OVER</span>
            </h1>

            <p className="mx-auto mt-6 max-w-[760px] text-base font-medium leading-7 text-slate-600 md:text-[20px] md:leading-8">
              Bomb {level} was not defused in time or the wrong sequence
              <br className="hidden md:block" />
              was selected. The mission has been terminated.
            </p>

            <div className="mx-auto mt-9 grid w-full max-w-[720px] gap-4 md:grid-cols-2">
              <button
                onClick={onRetry}
                className="group flex h-[72px] items-center justify-center gap-4 rounded-xl bg-red-600 px-6 text-base font-black uppercase tracking-[0.08em] text-white shadow-[0_14px_28px_rgba(239,68,68,0.27)] transition hover:-translate-y-0.5 hover:bg-red-500 md:text-lg"
              >
                <RotateCcw size={29} strokeWidth={2.4} className="transition-transform duration-300 group-hover:-rotate-45" />
                Retry Mission
              </button>

              <button
                onClick={onHome}
                className="group flex h-[72px] items-center justify-center gap-4 rounded-xl border-[1.5px] border-red-300 bg-white px-6 text-base font-black uppercase tracking-[0.08em] text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-red-500 hover:text-red-600 md:text-lg"
              >
                <House size={28} strokeWidth={2.3} />
                Main Menu
              </button>
            </div>
          </div>
        </div>
      </div>

      {showHowToPlay && <HowToPlayOverlay onClose={() => setShowHowToPlay(false)} />}
    </div>
  );
}

function CertificateBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-[42%] h-[680px] w-[1050px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-100/20 blur-[110px]" />

      {/* corner brackets */}
      <div className="absolute left-5 top-5 h-10 w-10 border-l-[6px] border-t-[6px] border-red-600 md:left-6 md:top-6" />
      <div className="absolute right-5 top-5 h-10 w-10 border-r-[6px] border-t-[6px] border-red-600 md:right-6 md:top-6" />
      <div className="absolute bottom-5 left-5 h-10 w-10 border-b-[6px] border-l-[6px] border-red-600 md:left-6 md:bottom-6" />
      <div className="absolute bottom-5 right-5 h-10 w-10 border-b-[6px] border-r-[6px] border-red-600 md:right-6 md:bottom-6" />

      {/* circuit lines */}
      <div className="absolute left-0 top-[43%] h-px w-[18%] bg-red-200/70" />
      <div className="absolute left-[8%] top-[43%] h-8 w-24 border-b border-r border-red-200/70" />
      <div className="absolute left-0 top-[49%] h-px w-[17%] bg-red-200/60" />
      <div className="absolute left-[7%] top-[49%] h-9 w-28 border-b border-r border-red-200/60" />
      <div className="absolute left-0 top-[55%] h-px w-[18%] bg-red-200/60" />
      <div className="absolute left-[9%] top-[55%] h-9 w-24 border-b border-r border-red-200/60" />

      <div className="absolute right-0 top-[43%] h-px w-[18%] bg-red-200/70" />
      <div className="absolute right-[8%] top-[43%] h-8 w-24 border-b border-l border-red-200/70" />
      <div className="absolute right-0 top-[49%] h-px w-[17%] bg-red-200/60" />
      <div className="absolute right-[7%] top-[49%] h-9 w-28 border-b border-l border-red-200/60" />
      <div className="absolute right-0 top-[55%] h-px w-[18%] bg-red-200/60" />
      <div className="absolute right-[9%] top-[55%] h-9 w-24 border-b border-l border-red-200/60" />

      {[
        "left-[17.5%] top-[43%]",
        "left-[17.5%] top-[49%]",
        "left-[17.5%] top-[55%]",
        "right-[17.5%] top-[43%]",
        "right-[17.5%] top-[49%]",
        "right-[17.5%] top-[55%]",
      ].map((pos) => (
        <span
          key={pos}
          className={`absolute ${pos} h-3 w-3 rounded-full border-2 border-red-200 bg-white`}
        />
      ))}

      {/* dot clusters */}
      <div className="absolute left-10 top-[27%] grid grid-cols-3 gap-2 opacity-60">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-red-300" />
        ))}
      </div>
      <div className="absolute right-10 top-[27%] grid grid-cols-3 gap-2 opacity-60">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-red-300" />
        ))}
      </div>

      {/* halftone corners */}
      <div
        className="absolute -bottom-16 -left-10 h-72 w-80 rotate-[-18deg] opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(239,68,68,.42) 2px, transparent 3px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div
        className="absolute -bottom-16 -right-10 h-72 w-80 rotate-[18deg] opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(239,68,68,.42) 2px, transparent 3px)",
          backgroundSize: "16px 16px",
        }}
      />

      <span className="absolute left-[18%] top-[22%] text-3xl font-black text-red-300/75">+</span>
      <span className="absolute right-[20%] top-[21%] text-3xl font-black text-red-300/75">+</span>
      <span className="absolute left-[18%] bottom-[22%] text-2xl font-black text-red-300/70">+</span>
      <span className="absolute right-[19%] bottom-[21%] text-2xl font-black text-red-300/70">+</span>
    </div>
  );
}

function CertificateTopBar({ soundOn, setSoundOn, onHowToPlay }) {
  return (
    <div className="relative mx-auto w-full max-w-[1500px]">
      <button
        onClick={() => setSoundOn((value) => !value)}
        className="absolute left-0 top-0 flex w-[92px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white/95 px-3 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        {soundOn ? (
          <Volume2 size={29} strokeWidth={2.5} className="text-red-600" />
        ) : (
          <VolumeX size={29} strokeWidth={2.5} className="text-red-600" />
        )}
        <span className="text-[11px] font-black uppercase tracking-wide text-slate-900">
          Sound
        </span>
      </button>

      <div className="flex justify-center">
        <img
          src="/logo.png"
          alt="Nebuloid Tech Studio"
          className="h-[76px] w-auto max-w-[220px] object-contain md:h-[92px] md:max-w-[250px]"
        />
      </div>

      <button
        onClick={onHowToPlay}
        className="absolute right-0 top-0 flex w-[108px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white/95 px-3 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <HelpCircle size={29} strokeWidth={2.5} className="text-red-600" />
        <span className="text-[11px] font-black uppercase tracking-wide text-slate-900">
          How To Play
        </span>
      </button>
    </div>
  );
}

function HowToPlayOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600">
              Mission Guide
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">How To Play</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-500 transition hover:border-red-200 hover:text-red-600"
          >
            CLOSE
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {[
            "Read the mission brief and clue carefully.",
            "Choose the correct answer before the countdown reaches zero.",
            "A wrong answer immediately ends the mission.",
            "Defuse all 10 levels to unlock the master certificate.",
          ].map((item, index) => (
            <div
              key={item}
              className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white">
                {index + 1}
              </span>
              <p className="text-sm font-semibold leading-6 text-slate-600">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CertificateCard({ name, level, score, final }) {
  return (
    <div className="rounded-[12px] border-[1.5px] border-red-500 bg-white p-2 shadow-[0_14px_35px_rgba(239,68,68,0.10)]">
      <div className="relative overflow-hidden rounded-[6px] border border-red-200 bg-white px-6 py-6 text-center md:px-12 md:py-7">
        {/* subtle certificate rays */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-conic-gradient(from 0deg at 50% 50%, rgba(239,68,68,.08) 0deg, rgba(239,68,68,.08) 1deg, transparent 1deg, transparent 8deg)",
          }}
        />

        {/* inner corner brackets */}
        <div className="absolute left-2 top-2 h-8 w-8 border-l-[5px] border-t-[5px] border-red-600" />
        <div className="absolute right-2 top-2 h-8 w-8 border-r-[5px] border-t-[5px] border-red-600" />
        <div className="absolute bottom-2 left-2 h-8 w-8 border-b-[5px] border-l-[5px] border-red-600" />
        <div className="absolute bottom-2 right-2 h-8 w-8 border-b-[5px] border-r-[5px] border-red-600" />

        <div className="relative z-10">
          <img
            src="/logo.png"
            alt="Nebuloid Tech Studio"
            className="mx-auto h-[58px] w-auto max-w-[180px] object-contain md:h-[66px]"
          />

          <div className="mx-auto mt-3 flex max-w-[300px] items-center justify-center gap-4">
            <span className="h-px w-14 bg-red-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            <span className="h-px w-14 bg-red-300" />
          </div>

          <p className="mt-4 text-[9px] font-black uppercase tracking-[0.32em] text-slate-500 md:text-[10px]">
            This Certifies That
          </p>

          <div className="mx-auto mt-1 flex max-w-[700px] items-center justify-center gap-4">
            <span className="hidden h-5 w-8 border-t-[3px] border-red-600 sm:block" />
            <h2 className="max-w-full break-words text-[35px] font-black leading-none tracking-[-0.04em] text-slate-950 md:text-[48px]">
              {name}
            </h2>
            <span className="hidden h-5 w-8 border-t-[3px] border-red-600 sm:block" />
          </div>

          <p className="mt-3 text-xs font-semibold text-slate-500 md:text-sm">
            has successfully{" "}
            {final ? "completed all 10 logical bomb-defusal missions" : `defused Bomb ${level}`}.
          </p>

          <div className="mx-auto mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-red-300" />
            <span className="h-2 w-2 rounded-full bg-red-600" />
            <span className="h-px w-10 bg-red-300" />
          </div>

          {/* shield / bomb seal */}
          <div className="mx-auto mt-4 flex h-[62px] w-[62px] items-center justify-center rounded-full border border-red-200 bg-red-50/60">
            {final ? (
              <Award size={31} strokeWidth={2.2} className="text-red-600" />
            ) : (
              <ShieldCheck size={31} strokeWidth={2.2} className="text-red-600" />
            )}
          </div>

          <p className="mt-2 text-[8px] font-black uppercase tracking-[0.3em] text-red-600">
            Bomb Defusal Command
          </p>

          <div className="mx-auto mt-3 h-px max-w-[480px] bg-slate-200" />

          <div className="mx-auto mt-3 flex max-w-[420px] items-center justify-center divide-x divide-slate-300">
            <div className="px-8">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                Level
              </p>
              <p className="mt-0.5 text-[24px] font-black leading-none text-red-600">
                {level}/10
              </p>
            </div>

            <div className="px-8">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                Score
              </p>
              <p className="mt-0.5 text-[24px] font-black leading-none text-slate-950">
                {score}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-3 h-px max-w-[480px] bg-slate-200" />

          <div className="mt-2 flex items-center justify-center gap-5 text-[8px] font-black uppercase tracking-[0.28em] text-slate-500">
            <span className="text-red-600">≋</span>
            Bomb Defusal Training Division
            <span className="text-red-600">≋</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl backdrop-blur-sm md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/60 px-4 py-4">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/60 px-4 py-2.5">
      <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-700">
        {label}
      </p>
      <p className="mt-0.5 max-w-32 truncate text-xs font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

export default App;
