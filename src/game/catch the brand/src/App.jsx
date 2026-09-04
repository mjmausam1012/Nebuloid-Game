import React, { useCallback, useEffect, useRef, useState } from "react";
import logo from "../public/logo.png"

const LEVELS = [
  { level: 1, speed: 0.9, spawn: 1400, goal: 8 },
  { level: 2, speed: 1.1, spawn: 1350, goal: 10 },
  { level: 3, speed: 1.3, spawn: 1300, goal: 12 },
  { level: 4, speed: 1.5, spawn: 1250, goal: 14 },
  { level: 5, speed: 1.7, spawn: 1200, goal: 16 },
  { level: 6, speed: 1.9, spawn: 1150, goal: 18 },
  { level: 7, speed: 2.1, spawn: 1100, goal: 20 },
  { level: 8, speed: 2.3, spawn: 1050, goal: 22 },
  { level: 9, speed: 2.5, spawn: 1000, goal: 24 },
  { level: 10, speed: 2.7, spawn: 950, goal: 26 },
];

const WRONG_BRANDS = [
  { name: "Pepsi", emoji: "🥤" },
  { name: "Adidas", emoji: "👟" },
  { name: "Samsung", emoji: "📱" },
  { name: "Burger King", emoji: "🍔" },
  { name: "Google", emoji: "🔎" },
  { name: "Netflix", emoji: "🎬" },
];

function randomX() {
  return Math.random() * 84 + 8;
}

function playCatchSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.09);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.45, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);

    osc.addEventListener("ended", () => {
      ctx.close().catch(() => {});
    });
  } catch {
    // Sound is optional; never let audio errors break the game.
  }
}

function createObject() {
  const correct = Math.random() < 0.43;

  if (correct) {
    return {
      id: `${Date.now()}-${Math.random()}`,
      name: "Nebuloid Tech",
      correct: true,
      x: randomX(),
      y: -12,
      rotation: Math.random() * 16 - 8,
    };
  }

  const wrong = WRONG_BRANDS[Math.floor(Math.random() * WRONG_BRANDS.length)];

  return {
    id: `${Date.now()}-${Math.random()}`,
    name: wrong.name,
    emoji: wrong.emoji,
    correct: false,
    x: randomX(),
    y: -12,
    rotation: Math.random() * 24 - 12,
  };
}

export default function App({ onExitGame }) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.style.width = "100%";
    html.style.maxWidth = "100%";
    html.style.height = "100%";
    html.style.margin = "0";
    html.style.padding = "0";
    html.style.overflowX = "hidden";

    body.style.width = "100%";
    body.style.maxWidth = "100%";
    body.style.minHeight = "100%";
    body.style.margin = "0";
    body.style.padding = "0";
    body.style.overflowX = "hidden";

    return () => {
      html.style.width = "";
      html.style.maxWidth = "";
      html.style.height = "";
      html.style.margin = "";
      html.style.padding = "";
      html.style.overflowX = "";

      body.style.width = "";
      body.style.maxWidth = "";
      body.style.minHeight = "";
      body.style.margin = "";
      body.style.padding = "";
      body.style.overflowX = "";
    };
  }, []);
  const [screen, setScreen] = useState("start");
  const [playerName, setPlayerName] = useState("");
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [caught, setCaught] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [objects, setObjects] = useState([]);
  const [certificate, setCertificate] = useState(null);
  const [basketX, setBasketX] = useState(50);
  const [isPaused, setIsPaused] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const gameAreaRef = useRef(null);
  const animationRef = useRef(null);
  const spawnRef = useRef(null);
  const objectsRef = useRef([]);
  const basketRef = useRef(50);

  const level = LEVELS[levelIndex];

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setCaught(0);
    setLevelScore(0);
    setObjects([]);
    objectsRef.current = [];
    basketRef.current = 50;
    setBasketX(50);
    setIsPaused(false);
  }, []);

  const startLevel = useCallback(() => {
    resetGame();
    setScreen("game");
  }, [resetGame]);

  const finishLevel = useCallback(() => {
    setObjects([]);
    objectsRef.current = [];
    setIsPaused(false);
    setCertificate({
      player: playerName,
      level: level.level,
      score: levelScore,
    });
    setScreen("certificate");
  }, [playerName, level.level, levelScore]);

  const handleCatch = useCallback((item) => {
    if (item.correct) {
      if (isSoundOn) playCatchSound();
      setCaught((v) => v + 1);
      setScore((v) => v + 10);
      setLevelScore((v) => v + 10);
    } else {
      setLives((v) => Math.max(0, v - 1));
    }

    objectsRef.current = objectsRef.current.filter((obj) => obj.id !== item.id);
    setObjects([...objectsRef.current]);
  }, [isSoundOn]);

  useEffect(() => {
    if (screen !== "game" || isPaused) return;

    const move = (e) => {
      if (e.key === "ArrowLeft") {
        basketRef.current = Math.max(7, basketRef.current - 6);
        setBasketX(basketRef.current);
      }
      if (e.key === "ArrowRight") {
        basketRef.current = Math.min(93, basketRef.current + 6);
        setBasketX(basketRef.current);
      }
    };

    window.addEventListener("keydown", move);
    return () => window.removeEventListener("keydown", move);
  }, [screen, isPaused]);

  useEffect(() => {
    if (screen !== "game" || isPaused) return;

    spawnRef.current = setInterval(() => {
      const item = createObject();
      objectsRef.current.push(item);
      setObjects([...objectsRef.current]);
    }, level.spawn);

    return () => clearInterval(spawnRef.current);
  }, [screen, isPaused, level]);

  useEffect(() => {
    if (screen !== "game" || isPaused) return;

    let last = performance.now();

    const animate = (now) => {
      const delta = Math.min((now - last) / 16.67, 2);
      last = now;
      const next = [];

      for (const item of objectsRef.current) {
        const newY = item.y + level.speed * delta;
        const basketLeft = basketRef.current - 8;
        const basketRight = basketRef.current + 8;
        const nearBasket =
          newY > 80 &&
          newY < 92 &&
          item.x >= basketLeft &&
          item.x <= basketRight;

        if (nearBasket) {
          handleCatch(item);
          continue;
        }

        if (newY > 104) {
          if (item.correct) setLives((v) => Math.max(0, v - 1));
          continue;
        }

        next.push({ ...item, y: newY });
      }

      objectsRef.current = next;
      setObjects(next);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [screen, isPaused, level, handleCatch]);

  useEffect(() => {
    if (screen !== "game") return;
    if (lives <= 0) {
      const timer = setTimeout(() => setScreen("gameover"), 300);
      return () => clearTimeout(timer);
    }
  }, [lives, screen]);

  useEffect(() => {
    if (screen !== "game") return;
    if (caught >= level.goal) {
      const timer = setTimeout(finishLevel, 400);
      return () => clearTimeout(timer);
    }
  }, [caught, level.goal, screen, finishLevel]);

  const handlePointerMove = (e) => {
    if (!gameAreaRef.current || isPaused) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    basketRef.current = Math.max(7, Math.min(93, x));
    setBasketX(basketRef.current);
  };

  const handleNextLevel = () => {
    if (levelIndex >= LEVELS.length - 1) {
      setScreen("finished");
      return;
    }

    setLevelIndex((v) => v + 1);
    setCertificate(null);
    resetGame();
    setScreen("game");
  };

  const restartEverything = () => {
    setLevelIndex(0);
    setCertificate(null);
    resetGame();
    setScreen("start");
  };

  const downloadCertificate = () => {
    if (!certificate) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, 1600, 1000);
    bg.addColorStop(0, "#ffffff");
    bg.addColorStop(0.55, "#fbfdff");
    bg.addColorStop(1, "#eef9ff");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1600, 1000);

    ctx.strokeStyle = "#9bdcff";
    ctx.lineWidth = 4;
    ctx.strokeRect(55, 55, 1490, 890);
    ctx.strokeStyle = "#14213d";
    ctx.lineWidth = 5;
    ctx.strokeRect(70, 70, 1460, 860);
    ctx.strokeStyle = "#55c9f3";
    ctx.lineWidth = 2;
    ctx.strokeRect(86, 86, 1428, 828);

    ctx.fillStyle = "#14213d";
    ctx.font = "28px Arial";
    ctx.fillText("✦", 105, 125);
    ctx.fillText("✦", 1470, 125);
    ctx.fillText("✦", 105, 900);
    ctx.fillText("✦", 1470, 900);

    const center = 800;
    ctx.textAlign = "center";

    const drawCertificate = () => {
      ctx.fillStyle = "#14213d";
      ctx.font = "700 22px Arial";
      ctx.fillText("N E B U L O I D   T E C H", center, 225);

      ctx.strokeStyle = "#22b9ee";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(730, 250);
      ctx.lineTo(870, 250);
      ctx.stroke();

      ctx.fillStyle = "#14213d";
      ctx.font = "900 72px Arial";
      ctx.fillText("CERTIFICATE", center, 335);

      ctx.font = "700 26px Arial";
      ctx.fillText("OF ACHIEVEMENT", center, 375);

      ctx.fillStyle = "#52627a";
      ctx.font = "24px Arial";
      ctx.fillText("This certificate is proudly presented to", center, 440);

      ctx.fillStyle = "#0f172a";
      ctx.font = "900 48px Arial";
      ctx.fillText(certificate.player || "Player", center, 505);

      ctx.strokeStyle = "#8ecfe9";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(610, 525);
      ctx.lineTo(990, 525);
      ctx.stroke();

      ctx.fillStyle = "#52627a";
      ctx.font = "24px Arial";
      ctx.fillText("for successfully completing", center, 570);

      ctx.fillStyle = "#159bd7";
      ctx.font = "900 34px Arial";
      ctx.fillText("CATCH THE BRAND", center, 625);

      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#d5e3ef";
      ctx.lineWidth = 2;
      ctx.roundRect(620, 675, 150, 105, 18);
      ctx.fill();
      ctx.stroke();
      ctx.roundRect(830, 675, 150, 105, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#159bd7";
      ctx.font = "700 18px Arial";
      ctx.fillText("LEVEL", 695, 710);
      ctx.fillText("SCORE", 905, 710);

      ctx.fillStyle = "#0f172a";
      ctx.font = "900 34px Arial";
      ctx.fillText(String(certificate.level), 695, 752);
      ctx.fillText(String(certificate.score), 905, 752);

      ctx.fillStyle = "#52627a";
      ctx.font = "700 16px Arial";
      ctx.fillText("KEEP PLAYING • KEEP ACHIEVING", center, 855);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Catch-The-Brand-Certificate-Level-${certificate.level}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }, "image/png");
    };

    const logo = new Image();
    logo.onload = () => {
      ctx.drawImage(logo, center - 58, 110, 116, 78);
      drawCertificate();
    };
    logo.onerror = drawCertificate;
    logo.src = logo;
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="absolute -right-40 top-1/2 h-96 w-96 rounded-full bg-blue-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
      </div>

      <div className="relative z-10 h-full w-full max-w-full px-0 py-0 overflow-x-hidden">
        {screen === "start" && (
          <div className="flex h-full w-full items-center justify-center">
            <div className="relative h-full min-h-screen w-full max-w-full overflow-hidden bg-white text-center">
              {/* soft background atmosphere */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,1)_0%,rgba(248,251,255,0.98)_42%,rgba(236,246,255,0.9)_100%)]" />
              <div className="pointer-events-none absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />
              <div className="pointer-events-none absolute right-[5%] top-[20%] h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />

              {/* faded brand cards in the background */}
              {[
                ["👟", "Adidas", "left-[8%] top-[24%] -rotate-12"],
                ["👟", "Nike", "right-[8%] top-[27%] rotate-12"],
                ["🐆", "Puma", "left-[8%] bottom-[20%] rotate-10"],
                ["👟", "Reebok", "right-[8%] bottom-[18%] -rotate-10"],
              ].map(([emoji, name, position]) => (
                <div
                  key={name}
                  className={`pointer-events-none absolute ${position} hidden h-28 w-28 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white/65 text-slate-400 opacity-25 shadow-xl md:flex`}
                >
                  <span className="text-5xl">{emoji}</span>
                  <span className="mt-1 text-sm font-black">{name}</span>
                </div>
              ))}

              {/* decorative plus signs */}
              {[
                ["left-[10%] top-[16%]", "text-cyan-500"],
                ["left-[25%] top-[31%]", "text-cyan-500"],
                ["right-[30%] top-[19%]", "text-cyan-500"],
                ["right-[10%] top-[35%]", "text-cyan-500"],
                ["left-[20%] bottom-[18%]", "text-cyan-500"],
                ["right-[22%] bottom-[20%]", "text-cyan-500"],
              ].map(([position, color], i) => (
                <span
                  key={i}
                  className={`pointer-events-none absolute ${position} ${color} text-3xl font-light`}
                >
                  +
                </span>
              ))}

              {/* speed-line decorations */}
              <div className="pointer-events-none absolute left-[27%] top-[39%] hidden opacity-80 md:block">
                <div className="h-1 w-14 bg-cyan-300" />
                <div className="mt-2 h-1 w-8 bg-cyan-500" />
                <div className="mt-2 h-1 w-14 bg-cyan-300" />
              </div>
              <div className="pointer-events-none absolute right-[25%] top-[50%] hidden opacity-80 md:block">
                <div className="h-1 w-14 bg-cyan-300" />
                <div className="mt-2 h-1 w-8 bg-cyan-500" />
                <div className="mt-2 h-1 w-14 bg-cyan-300" />
              </div>

              {/* top controls */}
              <button
                type="button"
                onClick={() => setIsSoundOn((v) => !v)}
                aria-label={isSoundOn ? "Mute sound" : "Turn sound on"}
                className="absolute left-5 top-5 z-20 flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_5px_18px_rgba(20,70,120,0.10)] transition hover:-translate-y-1"
              >
                <span className="text-4xl leading-none">
                  {isSoundOn ? "🔊" : "🔇"}
                </span>
                <span className="mt-2 text-xs font-black tracking-wide text-cyan-600">
                  {isSoundOn ? "MUTE" : "VOLUME"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowHowToPlay(true)}
                className="absolute right-5 top-5 z-20 flex h-24 w-28 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_5px_18px_rgba(20,70,120,0.10)] transition hover:-translate-y-1"
              >
                <span className="text-4xl font-black leading-none text-slate-800">?</span>
                <span className="mt-2 text-xs font-black tracking-wide text-cyan-600">
                  HOW TO PLAY
                </span>
              </button>

              <div className="relative z-10 flex h-full min-h-screen flex-col items-center justify-center px-6 pb-10 pt-7 md:px-12">
                {/* Nebuloid Tech header */}
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={logo}
                    alt="Nebuloid Tech"
                    className="h-16 w-20 object-contain md:h-20 md:w-24"
                  />
                  <div className="text-left">
                    <div className="text-2xl font-black leading-none tracking-tight text-slate-950 md:text-3xl">
                      NEBULOID TECH
                    </div>
                    <div className="mt-1 text-xl font-black tracking-[0.3em] text-cyan-600">
                      STUDIO
                    </div>
                  </div>
                </div>

                {/* NTS emblem */}
                <div className="relative mt-8 flex h-32 w-32 items-center justify-center md:mt-10">
                  <div className="absolute inset-0 rounded-full border-[7px] border-cyan-500" />
                  <div className="absolute inset-3 rounded-full border-[4px] border-slate-900" />
                  <div className="absolute inset-8 flex items-center justify-center rounded-full bg-slate-900 text-2xl font-black text-white">
                    NTS
                  </div>
                  <span className="absolute left-1/2 top-0 h-9 w-1.5 -translate-x-1/2 -translate-y-3 rounded-full bg-cyan-500" />
                  <span className="absolute bottom-0 left-1/2 h-9 w-1.5 -translate-x-1/2 translate-y-3 rounded-full bg-cyan-500" />
                  <span className="absolute left-0 top-1/2 h-1.5 w-9 -translate-x-3 -translate-y-1/2 rounded-full bg-cyan-500" />
                  <span className="absolute right-0 top-1/2 h-1.5 w-9 translate-x-3 -translate-y-1/2 rounded-full bg-cyan-500" />
                </div>

                {/* main title */}
                <h1 className="mt-4 font-black leading-[0.86] tracking-tight text-slate-950">
                  <span className="block text-7xl md:text-[8rem]">CATCH</span>
                  <span className="mt-2 flex items-center justify-center gap-3 md:gap-5">
                    <span className="text-3xl font-black italic md:text-5xl">THE</span>
                    <span className="text-7xl text-cyan-600 md:text-[7.5rem]">
                      BRAND
                    </span>
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-lg font-medium leading-snug text-slate-600 md:text-2xl">
                  Catch the falling Nebuloid Tech logo and
                  <br className="hidden md:block" />
                  avoid the wrong brands.
                  <br className="hidden md:block" />
                  Complete every level to earn your certificate.
                </p>

                {/* stats in a single clean row */}
                <div className="mt-7 flex items-stretch justify-center">
                  {[
                    ["🎯", "TARGET", "NEBULOID"],
                    ["❤️", "LIVES", "3"],
                    ["🏆", "LEVELS", "10"],
                  ].map(([icon, label, value], i) => (
                    <div
                      key={label}
                      className={`min-w-[190px] px-10 py-2 md:min-w-[245px] ${
                        i !== 0 ? "border-l-2 border-slate-200" : ""
                      }`}
                    >
                      <div className="text-4xl md:text-5xl">{icon}</div>
                      <div className="mt-1 text-sm font-black text-cyan-600 md:text-base">
                        {label}
                      </div>
                      <div className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center gap-3 mt-7">
                  <button
                    onClick={() => setScreen("name")}
                    className="flex min-w-[390px] items-center justify-center gap-5 rounded-full border-2 border-cyan-600 bg-gradient-to-r from-cyan-600 to-cyan-500 px-12 py-5 text-2xl font-black text-white shadow-[0_10px_25px_rgba(8,145,178,0.30)] transition hover:-translate-y-1 hover:shadow-[0_15px_32px_rgba(8,145,178,0.38)] cursor-pointer"
                  >
                    <span className="text-3xl">▶</span>
                    START LEVEL
                  </button>

                  {onExitGame && (
                    <button
                      type="button"
                      onClick={onExitGame}
                      className="px-8 py-3 rounded-full border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm uppercase transition cursor-pointer"
                    >
                      ← Back to Games List
                    </button>
                  )}
                </div>
              </div>

              {showHowToPlay && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/25 px-5 backdrop-blur-sm">
                  <div className="relative w-full max-w-2xl rounded-[2rem] border border-cyan-200 bg-white p-7 text-left shadow-[0_25px_70px_rgba(15,60,100,0.22)] md:p-9">
                    <button
                      type="button"
                      onClick={() => setShowHowToPlay(false)}
                      className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-black text-slate-700 transition hover:bg-slate-200"
                      aria-label="Close How To Play"
                    >
                      ×
                    </button>

                    <div className="pr-12">
                      <div className="text-sm font-black tracking-[0.25em] text-cyan-600">
                        CATCH THE BRAND
                      </div>
                      <h2 className="mt-1 text-3xl font-black text-slate-950 md:text-4xl">
                        HOW TO PLAY
                      </h2>
                    </div>

                    <div className="mt-7 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-cyan-50 p-5">
                        <div className="text-2xl">🎯</div>
                        <h3 className="mt-2 font-black text-slate-950">Your Goal</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          Catch only the falling <b>Nebuloid Tech</b> logo. Avoid all wrong brands.
                        </p>
                      </div>

                      <div className="rounded-2xl bg-blue-50 p-5">
                        <div className="text-2xl">🖱️</div>
                        <h3 className="mt-2 font-black text-slate-950">Move & Catch</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          Move your mouse or touch the screen to control the catcher. Arrow keys also work.
                        </p>
                      </div>

                      <div className="rounded-2xl bg-emerald-50 p-5">
                        <div className="text-2xl">❤️</div>
                        <h3 className="mt-2 font-black text-slate-950">Lives & Score</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          You start with 3 lives. A correct catch gives <b>+10 points</b>. Wrong catches cost a life.
                        </p>
                      </div>

                      <div className="rounded-2xl bg-violet-50 p-5">
                        <div className="text-2xl">🏆</div>
                        <h3 className="mt-2 font-black text-slate-950">Complete Levels</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          Complete the target in every level to unlock your certificate. There are 10 levels.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowHowToPlay(false)}
                      className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 text-base font-black text-white shadow-[0_8px_20px_rgba(8,145,178,0.22)]"
                    >
                      GOT IT — LET'S PLAY
                    </button>
                  </div>
                </div>
              )}

              {/* bottom corner line accents */}
              <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-48 overflow-hidden">
                <div className="absolute -left-5 bottom-4 h-1 w-60 rotate-45 bg-cyan-500/70" />
                <div className="absolute -left-5 bottom-1 h-1 w-60 rotate-45 bg-cyan-300" />
              </div>
              <div className="pointer-events-none absolute bottom-0 right-0 h-24 w-48 overflow-hidden">
                <div className="absolute -right-5 bottom-4 h-1 w-60 -rotate-45 bg-cyan-500/70" />
                <div className="absolute -right-5 bottom-1 h-1 w-60 -rotate-45 bg-cyan-300" />
              </div>
            </div>
          </div>
        )}

        {screen === "name" && (
          <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white">
            {/* soft blue/purple background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,1)_0%,rgba(247,251,255,0.98)_45%,rgba(232,246,255,0.9)_100%)]" />
            <div className="pointer-events-none absolute left-[-8%] top-[20%] h-96 w-96 rounded-full bg-cyan-100/45 blur-3xl" />
            <div className="pointer-events-none absolute right-[-8%] bottom-[5%] h-96 w-96 rounded-full bg-sky-100/50 blur-3xl" />
            <div className="pointer-events-none absolute left-[20%] bottom-[-15%] h-72 w-72 rounded-full bg-purple-100/30 blur-3xl" />

            {/* faded background brand cards */}
            {[
              ["👟", "Adidas", "left-[10%] top-[22%] -rotate-12"],
              ["👟", "Nike", "right-[12%] top-[25%] rotate-12"],
              ["🐆", "Puma", "left-[9%] bottom-[15%] rotate-12"],
              ["👟", "Reebok", "right-[10%] bottom-[17%] -rotate-12"],
            ].map(([emoji, name, position]) => (
              <div
                key={name}
                className={`pointer-events-none absolute ${position} hidden h-32 w-32 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white/60 text-slate-400 opacity-25 shadow-xl md:flex`}
              >
                <span className="text-5xl">{emoji}</span>
                <span className="mt-1 text-sm font-black">{name}</span>
              </div>
            ))}

            {/* decorative plus signs */}
            {[
              "left-[7%] top-[20%]",
              "left-[25%] top-[28%]",
              "right-[32%] top-[25%]",
              "right-[7%] top-[28%]",
              "left-[23%] bottom-[12%]",
              "right-[28%] bottom-[11%]",
            ].map((position, i) => (
              <span
                key={i}
                className={`pointer-events-none absolute ${position} text-3xl font-light text-cyan-500`}
              >
                +
              </span>
            ))}

            {/* top controls */}
            <button
              type="button"
              className="absolute left-8 top-7 z-20 flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_5px_18px_rgba(20,70,120,0.10)]"
            >
              <span className="text-4xl leading-none">🔊</span>
              <span className="mt-2 text-xs font-black tracking-wide text-cyan-600">
                SOUND
              </span>
            </button>

            <button
              type="button"
              className="absolute right-8 top-7 z-20 flex h-24 w-28 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_5px_18px_rgba(20,70,120,0.10)]"
            >
              <span className="text-4xl font-black leading-none text-slate-800">?</span>
              <span className="mt-2 text-xs font-black tracking-wide text-cyan-600">
                HOW TO PLAY
              </span>
            </button>

            <div className="relative z-10 flex h-full w-full max-w-4xl flex-col items-center px-6 pt-10 text-center">
              {/* header */}
              <div className="flex items-center justify-center gap-3">
                <img
                  src={logo}
                  alt="Nebuloid Tech"
                  className="h-14 w-16 object-contain md:h-16 md:w-20"
                />
                <div className="text-left">
                  <div className="text-xl font-black leading-none text-slate-950 md:text-2xl">
                    NEBULOID TECH
                  </div>
                  <div className="mt-1 text-sm font-black tracking-[0.3em] text-cyan-600 md:text-base">
                    STUDIO
                  </div>
                </div>
              </div>

              {/* level/game logo */}
              <div className="relative mt-10 flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[4px] border-cyan-500" />
                <div className="absolute inset-2 rounded-full border-2 border-slate-900" />
                <div className="absolute inset-5 flex items-center justify-center rounded-full bg-white text-lg font-black text-slate-900">
                  NTS
                </div>
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                CATCH
                <span className="ml-3 text-cyan-600">THE BRAND</span>
              </h1>

              <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-slate-600 md:text-lg">
                Catch the falling Nebuloid Tech logo
                <br />
                and avoid the wrong brands.
              </p>

              {/* stats */}
              <div className="mt-8 flex items-stretch justify-center">
                {[
                  ["🎯", "TARGET", "NEBULOID"],
                  ["❤️", "LIVES", "3"],
                  ["🏆", "LEVELS", "10"],
                ].map(([icon, label, value], i) => (
                  <div
                    key={label}
                    className={`min-w-[150px] px-7 md:min-w-[195px] md:px-10 ${
                      i !== 0 ? "border-l-2 border-cyan-200" : ""
                    }`}
                  >
                    <div className="text-3xl md:text-4xl">{icon}</div>
                    <div className="mt-1 text-sm font-black text-cyan-600">{label}</div>
                    <div className="mt-1 text-xl font-black text-slate-950 md:text-2xl">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* name input */}
              <div className="mt-8 w-full max-w-2xl">
                <div className="relative">
                  <span className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-4xl text-cyan-600">
                    👤
                  </span>
                  <input
                    id="player-name"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && playerName.trim()) {
                        setScreen("game");
                      }
                    }}
                    placeholder="Enter your name"
                    autoComplete="name"
                    autoFocus
                    className="h-20 w-full rounded-2xl border-2 border-cyan-500 bg-white px-20 text-xl font-medium text-slate-800 shadow-[0_5px_20px_rgba(8,145,178,0.10)] outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-cyan-100"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={!playerName.trim()}
                onClick={() => setScreen("game")}
                className="mt-7 flex h-16 w-full max-w-md items-center justify-center gap-5 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-xl font-black text-white shadow-[0_10px_25px_rgba(8,145,178,0.28)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="text-3xl">›</span>
                CONTINUE
              </button>
            </div>

            {/* bottom corner accents */}
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-52 overflow-hidden">
              <div className="absolute -left-5 bottom-8 h-1 w-64 rotate-45 bg-cyan-300" />
              <div className="absolute -left-5 bottom-4 h-1 w-64 rotate-45 bg-cyan-400" />
              <div className="absolute -left-5 bottom-0 h-1 w-64 rotate-45 bg-cyan-200" />
            </div>
            <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-52 overflow-hidden">
              <div className="absolute -right-5 bottom-8 h-1 w-64 -rotate-45 bg-cyan-300" />
              <div className="absolute -right-5 bottom-4 h-1 w-64 -rotate-45 bg-cyan-400" />
              <div className="absolute -right-5 bottom-0 h-1 w-64 -rotate-45 bg-cyan-200" />
            </div>
          </div>
        )}

        {screen === "game" && (
          <div className="relative h-full w-full overflow-hidden bg-white">
            {/* game-page background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,1)_0%,rgba(248,252,255,0.98)_52%,rgba(232,246,255,0.92)_100%)]" />
            <div className="pointer-events-none absolute left-[-7%] top-[8%] h-80 w-80 rounded-full bg-cyan-100/45 blur-3xl" />
            <div className="pointer-events-none absolute right-[-7%] top-[17%] h-96 w-96 rounded-full bg-blue-100/45 blur-3xl" />

            {/* faded brand cards */}
            {[
              ["👟", "Adidas", "left-[15%] top-[27%] -rotate-12"],
              ["👟", "Nike", "right-[14%] top-[29%] rotate-12"],
              ["🐆", "Puma", "left-[12%] bottom-[17%] rotate-12"],
              ["👟", "Reebok", "right-[11%] bottom-[16%] -rotate-12"],
            ].map(([emoji, name, position]) => (
              <div
                key={name}
                className={`pointer-events-none absolute ${position} hidden h-28 w-28 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white/65 text-slate-400 opacity-[0.18] shadow-xl md:flex`}
              >
                <span className="text-5xl">{emoji}</span>
                <span className="mt-1 text-sm font-black">{name}</span>
              </div>
            ))}

            {/* dotted bottom corners */}
            <div className="pointer-events-none absolute -bottom-10 -left-6 h-44 w-80 opacity-35">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(14,165,233,.32) 2px, transparent 3px)",
                  backgroundSize: "16px 16px",
                  transform: "rotate(-10deg)",
                }}
              />
            </div>
            <div className="pointer-events-none absolute -bottom-10 -right-6 h-44 w-80 opacity-35">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(14,165,233,.32) 2px, transparent 3px)",
                  backgroundSize: "16px 16px",
                  transform: "rotate(10deg)",
                }}
              />
            </div>

            {/* top buttons */}
            <button
              type="button"
              className="absolute left-6 top-6 z-30 flex h-20 w-20 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_5px_18px_rgba(20,70,120,0.10)]"
            >
              <span className="text-3xl leading-none">🔊</span>
              <span className="mt-2 text-[11px] font-black tracking-wide text-slate-800">
                SOUND
              </span>
            </button>

            <button
              type="button"
              className="absolute right-6 top-6 z-30 flex h-20 w-24 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_5px_18px_rgba(20,70,120,0.10)]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-slate-800 text-xl font-black leading-none text-slate-800">
                ?
              </span>
              <span className="mt-1 text-[10px] font-black tracking-wide text-slate-800">
                HOW TO PLAY
              </span>
            </button>

            {/* Nebuloid Tech Studio header */}
            <div className="absolute left-1/2 top-7 z-20 flex -translate-x-1/2 items-center gap-3">
              <img
                src={logo}
                alt="Nebuloid Tech"
                className="h-14 w-16 object-contain md:h-16 md:w-20"
              />
              <div className="text-left">
                <div className="text-xl font-black leading-none tracking-tight text-slate-950 md:text-2xl">
                  NEBULOID TECH
                </div>
                <div className="mt-1 text-base font-black tracking-[0.22em] text-cyan-600 md:text-lg">
                  STUDIO
                </div>
              </div>
            </div>

            {/* level information */}
            <div className="absolute left-7 top-[148px] z-20 text-left md:left-8">
              <div className="text-sm font-black tracking-wide text-cyan-600 md:text-base">
                CATCH THE BRAND
              </div>
              <h2 className="mt-1 text-4xl font-black leading-none tracking-tight text-slate-950 md:text-5xl">
                LEVEL {level.level}
              </h2>
              <div className="mt-3 text-sm font-black text-cyan-600 md:text-base">
                SPEED {level.speed.toFixed(1)}x
              </div>
            </div>

            {/* score / target / lives */}
            <div className="absolute right-7 top-[148px] z-20 flex gap-3 md:right-8">
              <Stat label="SCORE" value={score} />
              <Stat label="TARGET" value={`${caught}/${level.goal}`} />
              <Stat
                label="LIVES"
                value={`${"❤️".repeat(lives)}${"🖤".repeat(3 - lives)}`}
              />
            </div>

            <div className="absolute right-8 top-[276px] z-20 text-sm font-medium text-slate-600">
              MOVE MOUSE / TOUCH
            </div>

            {/* game play area */}
            <div
              ref={gameAreaRef}
              onPointerMove={handlePointerMove}
              className="absolute left-6 right-6 top-[158px] bottom-[34px] touch-none select-none overflow-hidden md:left-8 md:right-8"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.42]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(15,23,42,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.055) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />

              {/* pause */}
              <button
                type="button"
                onClick={() => setIsPaused((v) => !v)}
                className="absolute left-1/2 top-12 z-30 -translate-x-1/2 rounded-full border border-slate-200 bg-white/90 px-6 py-2 text-sm font-black text-slate-800 shadow-[0_5px_15px_rgba(20,70,120,0.08)] backdrop-blur-sm"
              >
                {isPaused ? "▶  RESUME" : "Ⅱ  PAUSE"}
              </button>

              {/* falling brands */}
              {objects.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    handleCatch(item);
                  }}
                  aria-label={`Catch ${item.name}`}
                  className={`absolute -translate-x-1/2 rounded-2xl border bg-white shadow-[0_5px_15px_rgba(20,70,120,0.08)] transition-transform active:scale-90 ${
                    item.correct
                      ? "border-cyan-300/70"
                      : "border-slate-200"
                  } flex h-24 w-24 flex-col items-center justify-center`}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: `translateX(-50%) rotate(${item.rotation}deg)`,
                  }}
                >
                  {item.correct ? (
                    <>
                      <img
                        src={logo}
                        alt="Nebuloid Tech"
                        className="h-14 w-20 object-contain"
                        draggable="false"
                      />
                      <span className="mt-1 text-[9px] font-black uppercase tracking-wide text-slate-700">
                        NTS
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl">{item.emoji}</span>
                      <span className="mt-1 max-w-[84px] truncate text-[9px] font-black uppercase tracking-wide text-slate-700">
                        {item.name}
                      </span>
                    </>
                  )}
                </button>
              ))}

              {/* catcher */}
              <div
                className="absolute bottom-[14%] -translate-x-1/2"
                style={{ left: `${basketX}%` }}
              >
                <div className="relative">
                  <div className="h-8 w-52 rounded-b-[2rem] border-x-4 border-b-4 border-cyan-500 bg-cyan-100/10" />
                  <div className="absolute -left-1 right-0 top-[-2px] h-2.5 rounded-full bg-cyan-400" />
                  <div className="absolute left-1/2 top-10 -translate-x-1/2 whitespace-nowrap text-base font-black tracking-[0.12em] text-cyan-600">
                    CATCHER
                  </div>
                </div>
              </div>

              {/* pause overlay */}
              {isPaused && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="mb-4 text-5xl">⏸</div>
                    <h3 className="text-3xl font-black text-slate-950">
                      GAME PAUSED
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsPaused(false)}
                      className="mt-6 rounded-xl bg-cyan-300 px-8 py-3 font-black text-slate-950"
                    >
                      RESUME
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* bottom instruction */}
            <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-base font-medium text-slate-600 md:text-lg">
              ← Move left&nbsp; • &nbsp;Move right →&nbsp; • &nbsp;Catch only the Nebuloid Tech logo
            </div>
          </div>
        )}

        {screen === "gameover" && (
          <div className="relative flex h-full min-h-screen w-full items-center justify-center overflow-hidden bg-white">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,1)_0%,rgba(248,252,255,0.98)_50%,rgba(231,246,255,0.92)_100%)]" />
            <div className="pointer-events-none absolute left-[-6%] top-[5%] h-80 w-80 rounded-full bg-cyan-100/45 blur-3xl" />
            <div className="pointer-events-none absolute right-[-6%] top-[18%] h-96 w-96 rounded-full bg-blue-100/45 blur-3xl" />

            {[
              ["👟", "Adidas", "left-[8%] top-[23%] -rotate-12"],
              ["👟", "Nike", "right-[9%] top-[25%] rotate-12"],
              ["🐆", "Puma", "left-[8%] bottom-[13%] rotate-12"],
              ["👟", "Reebok", "right-[8%] bottom-[14%] -rotate-12"],
            ].map(([emoji, name, position]) => (
              <div
                key={name}
                className={`pointer-events-none absolute ${position} hidden h-32 w-32 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white/60 text-slate-400 opacity-[0.18] shadow-xl lg:flex`}
              >
                <span className="text-5xl">{emoji}</span>
                <span className="mt-1 text-sm font-black">{name}</span>
              </div>
            ))}

            <span className="pointer-events-none absolute left-[25%] top-[21%] text-3xl font-light text-cyan-400">+</span>
            <span className="pointer-events-none absolute right-[24%] top-[20%] text-3xl font-light text-cyan-400">+</span>
            <span className="pointer-events-none absolute left-[22%] bottom-[16%] text-3xl font-light text-cyan-400">+</span>
            <span className="pointer-events-none absolute right-[5%] top-[48%] text-3xl font-light text-cyan-400">+</span>

            <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-80 opacity-40">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(59,130,246,.38) 2px, transparent 3px)",
                  backgroundSize: "15px 15px",
                }}
              />
            </div>
            <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-80 opacity-40">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(14,165,233,.38) 2px, transparent 3px)",
                  backgroundSize: "15px 15px",
                }}
              />
            </div>

            <button
              type="button"
              className="absolute left-6 top-6 z-30 flex h-24 w-28 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_8px_22px_rgba(20,70,120,0.12)]"
            >
              <span className="text-4xl leading-none">🔊</span>
              <span className="mt-2 text-xs font-black tracking-wide text-slate-900">SOUND</span>
            </button>

            <button
              type="button"
              className="absolute right-6 top-6 z-30 flex h-24 w-28 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_8px_22px_rgba(20,70,120,0.12)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-slate-900 text-2xl font-black leading-none text-slate-900">?</span>
              <span className="mt-2 text-xs font-black tracking-wide text-slate-900">HOW TO PLAY</span>
            </button>

            <div className="absolute left-1/2 top-7 z-20 flex -translate-x-1/2 items-center gap-4">
              <img src={logo} alt="Nebuloid Tech" className="h-14 w-16 object-contain md:h-16 md:w-20" />
              <div className="text-left">
                <div className="text-xl font-black leading-none tracking-tight text-slate-950 md:text-2xl">NEBULOID TECH</div>
                <div className="mt-1 text-base font-black tracking-[0.25em] text-slate-900 md:text-lg">STUDIO</div>
              </div>
            </div>

            <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center">
              <div className="relative mb-2 flex h-24 w-48 items-center justify-center">
                <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-[4px] border-slate-900" />
                <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm font-black text-slate-900">NTS</div>
              </div>

              <div className="flex items-center gap-4 text-sm font-black tracking-[0.25em] text-rose-500 md:text-base">
                <span className="h-px w-12 bg-rose-300 md:w-16" />
                <span>LEVEL {level.level}</span>
                <span className="h-px w-12 bg-rose-300 md:w-16" />
              </div>

              <h1 className="mt-7 text-6xl font-black tracking-tight text-slate-950 md:text-7xl lg:text-8xl">GAME OVER</h1>

              <p className="mt-5 text-lg font-medium text-slate-500 md:text-2xl">
                You ran out of lives. Your score was{" "}
                <span className="font-black text-blue-600">{score}.</span>
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={startLevel}
                  className="flex min-w-[310px] items-center justify-center gap-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-400 px-10 py-5 text-xl font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.28)] transition hover:-translate-y-1"
                >
                  <span className="text-4xl leading-none">↻</span>
                  TRY AGAIN
                </button>

                <button
                  type="button"
                  onClick={restartEverything}
                  className="flex min-w-[310px] items-center justify-center gap-5 rounded-2xl bg-slate-100 px-10 py-5 text-xl font-black text-slate-900 shadow-[0_10px_24px_rgba(20,70,120,0.10)] transition hover:-translate-y-1 hover:bg-white"
                >
                  <span className="text-3xl leading-none">⌂</span>
                  MAIN MENU
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === "certificate" && certificate && (
          <div className="relative flex h-full min-h-screen w-full items-center justify-center overflow-hidden bg-white px-5 py-6 md:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,1)_0%,rgba(248,252,255,0.98)_48%,rgba(231,246,255,0.92)_100%)]" />
            <div className="pointer-events-none absolute left-[-5%] top-[8%] h-80 w-80 rounded-full bg-cyan-100/45 blur-3xl" />
            <div className="pointer-events-none absolute right-[-5%] top-[18%] h-96 w-96 rounded-full bg-blue-100/45 blur-3xl" />

            {[
              ["👟", "Adidas", "left-[5%] top-[18%] -rotate-12"],
              ["👟", "Nike", "right-[6%] top-[23%] rotate-12"],
              ["🐆", "Puma", "left-[5%] bottom-[10%] rotate-12"],
              ["👟", "Reebok", "right-[5%] bottom-[12%] -rotate-12"],
            ].map(([emoji, name, position]) => (
              <div
                key={name}
                className={`pointer-events-none absolute ${position} hidden h-32 w-32 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white/60 text-slate-400 opacity-[0.18] shadow-xl lg:flex`}
              >
                <span className="text-5xl">{emoji}</span>
                <span className="mt-1 text-sm font-black">{name}</span>
              </div>
            ))}

            <span className="pointer-events-none absolute left-[20%] top-[6%] text-3xl font-light text-cyan-400">+</span>
            <span className="pointer-events-none absolute right-[20%] top-[10%] text-3xl font-light text-cyan-400">+</span>
            <span className="pointer-events-none absolute left-[16%] bottom-[10%] text-3xl font-light text-cyan-400">+</span>
            <span className="pointer-events-none absolute right-[7%] top-[49%] text-3xl font-light text-cyan-400">+</span>

            <div className="relative z-10 w-full max-w-6xl">
              <div className="mb-5 text-center">
                <div className="flex items-center justify-center gap-4 text-xs font-black tracking-[0.3em] text-cyan-600 md:text-sm">
                  <span className="hidden h-px w-12 bg-cyan-300 md:block" />
                  LEVEL COMPLETE
                  <span className="hidden h-px w-12 bg-cyan-300 md:block" />
                </div>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                  YOUR CERTIFICATE
                </h2>
                <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-cyan-400" />
              </div>

              <div className="rounded-[2rem] border border-cyan-300 bg-white/80 p-2 shadow-[0_20px_55px_rgba(20,70,120,0.14)] backdrop-blur-sm md:p-3">
                <div className="relative overflow-hidden rounded-[1.6rem] border-[3px] border-slate-900 p-7 text-center md:p-10 lg:p-12">
                  <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_20%,rgba(14,165,233,0.06),transparent_45%)]" />
                  <div className="absolute left-5 top-5 text-2xl text-slate-950">✦</div>
                  <div className="absolute right-5 top-5 text-2xl text-slate-950">✦</div>
                  <div className="absolute bottom-5 left-5 text-2xl text-slate-950">✦</div>
                  <div className="absolute bottom-5 right-5 text-2xl text-slate-950">✦</div>

                  <div className="relative z-10">
                    <img
                      src={logo}
                      alt="Nebuloid Tech"
                      className="mx-auto h-16 w-24 object-contain md:h-20 md:w-28"
                    />

                    <div className="mt-2 text-xs font-black tracking-[0.4em] text-slate-900 md:text-sm">
                      N E B U L O I D   T E C H
                    </div>

                    <div className="mx-auto mt-4 flex items-center justify-center gap-2">
                      <span className="h-px w-14 bg-cyan-400" />
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      <span className="h-px w-14 bg-cyan-400" />
                    </div>

                    <h1 className="mt-4 text-5xl font-black uppercase tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
                      CERTIFICATE
                    </h1>

                    <div className="mt-1 flex items-center justify-center gap-3 text-sm font-black tracking-[0.25em] text-slate-950 md:text-base">
                      <span className="h-px w-10 bg-cyan-400" />
                      OF ACHIEVEMENT
                      <span className="h-px w-10 bg-cyan-400" />
                    </div>

                    <p className="mt-6 text-base font-medium text-slate-600 md:text-lg">
                      This certificate is proudly presented to
                    </p>

                    <h2 className="mt-3 inline-block min-w-[180px] border-b-2 border-cyan-300 px-8 pb-2 text-3xl font-black text-slate-950 md:min-w-[260px] md:text-5xl">
                      {certificate.player}
                    </h2>

                    <p className="mt-5 text-base font-medium text-slate-600 md:text-lg">
                      for successfully completing
                    </p>

                    <div className="mt-2 flex items-center justify-center gap-3">
                      <span className="text-xl text-cyan-500">➜</span>
                      <h3 className="text-2xl font-black text-cyan-600 md:text-3xl">
                        CATCH THE BRAND
                      </h3>
                      <span className="text-xl text-cyan-500">➜</span>
                    </div>

                    <div className="mt-6 flex justify-center gap-5">
                      <div className="flex h-24 w-28 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="text-xl text-cyan-500">★</div>
                        <div className="text-[10px] font-black tracking-wide text-slate-600">LEVEL</div>
                        <div className="text-2xl font-black text-slate-950">{certificate.level}</div>
                      </div>

                      <div className="flex h-24 w-28 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="text-xl text-cyan-500">◎</div>
                        <div className="text-[10px] font-black tracking-wide text-slate-600">SCORE</div>
                        <div className="text-2xl font-black text-slate-950">{certificate.score}</div>
                      </div>
                    </div>

                    <div className="mt-6 text-xs font-black tracking-[0.2em] text-slate-600 md:text-sm">
                      ❧ &nbsp; KEEP PLAYING • KEEP ACHIEVING &nbsp; ❧
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={downloadCertificate}
                  className="flex min-w-[260px] items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-4 text-base font-black text-white shadow-[0_10px_25px_rgba(8,145,178,0.25)] transition hover:-translate-y-1"
                >
                  <span className="text-xl">⇩</span>
                  DOWNLOAD CERTIFICATE
                </button>

                <button
                  type="button"
                  onClick={handleNextLevel}
                  className="min-w-[230px] rounded-2xl border-2 border-cyan-500 bg-white px-8 py-4 text-base font-black text-cyan-700 shadow-sm transition hover:-translate-y-1 hover:bg-cyan-50"
                >
                  {levelIndex === LEVELS.length - 1 ? "FINISH GAME →" : "NEXT LEVEL →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === "finished" && (
          <div className="flex min-h-[90vh] items-center justify-center">
            <div className="max-w-2xl text-center">
              <div className="mb-6 text-8xl">🏆</div>
              <div className="text-sm font-black tracking-[0.3em] text-cyan-600">
                ALL LEVELS COMPLETE
              </div>
              <h1 className="mt-3 text-5xl font-black md:text-7xl">CHAMPION!</h1>

              <p className="mt-5 text-lg text-slate-500">
                Congratulations{" "}
                <span className="font-bold text-slate-900">{playerName}</span>.
                You completed all 10 levels of Catch the Brand.
              </p>

              <div className="mt-9 rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
                <img
                  src={logo}
                  alt="Nebuloid Tech"
                  className="mx-auto mb-4 h-12 object-contain"
                />
                <div className="text-sm text-slate-500">Achievement unlocked</div>
                <div className="mt-1 text-xl font-black">
                  BRAND CATCHING MASTER
                </div>
              </div>

              <button
                onClick={restartEverything}
                className="mt-8 rounded-2xl bg-cyan-300 px-10 py-4 font-black text-slate-950"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-3">
      <span className="text-xs text-slate-500">{label}</span>
      <div className="text-xl font-black">{value}</div>
    </div>
  );
}
