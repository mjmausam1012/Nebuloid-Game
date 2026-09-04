import React, { useRef, useState } from "react";
import "./index.css";

const tiles = [
  { id: 0, name: "Lavender", f: 261.63, b: "#e9e0ff", a: "#a98de5", c: "#6947a8" },
  { id: 1, name: "Sky", f: 329.63, b: "#deefff", a: "#78b5e9", c: "#3972a8" },
  { id: 2, name: "Mint", f: 392, b: "#def7eb", a: "#72c99f", c: "#287b59" },
  { id: 3, name: "Peach", f: 440, b: "#ffe5da", a: "#e99a7d", c: "#a75b42" },
  { id: 4, name: "Butter", f: 523.25, b: "#fff3cc", a: "#e2c34f", c: "#96751e" },
  { id: 5, name: "Rose", f: 659.25, b: "#f9dfeb", a: "#db83ae", c: "#984d73" },
  { id: 6, name: "Aqua", f: 783.99, b: "#dcf4f5", a: "#69c5cc", c: "#32777d" },
  { id: 7, name: "Lilac", f: 880, b: "#e9e5fa", a: "#9d91d1", c: "#675b9c" },
  { id: 8, name: "Powder", f: 1046.5, b: "#e8ebf1", a: "#9ea8bb", c: "#59616f" }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function App({ onExitGame }) {
  const [audio, setAudio] = useState(true);
  const [page, setPage] = useState("home");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() =>
    Number(sessionStorage.getItem("msbest") || 0)
  );
  const [seq, setSeq] = useState([]);
  const [ans, setAns] = useState([]);
  const [active, setActive] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [status, setStatus] = useState("READY");
  const [showHowTo, setShowHowTo] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [certificate, setCertificate] = useState(null);

  const ctx = useRef(null);
  const run = useRef(0);

  function audioCtx() {
    if (!audio) return null;

    const C =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!C) return null;

    if (!ctx.current) {
      ctx.current = new C();
    }

    if (ctx.current.state === "suspended") {
      ctx.current.resume();
    }

    return ctx.current;
  }

  function play(id, duration = 190) {
    const c = audioCtx();
    if (!c) return;

    const o = c.createOscillator();
    const g = c.createGain();

    o.type = "sine";
    o.frequency.value = tiles[id].f;

    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(
      0.62,
      c.currentTime + 0.01
    );
    g.gain.exponentialRampToValueAtTime(
      0.0001,
      c.currentTime + duration / 1000
    );

    o.connect(g);
    g.connect(c.destination);

    o.start();
    o.stop(c.currentTime + duration / 1000 + 0.02);
  }

  function make(length, count) {
    return Array.from(
      { length },
      () => Math.floor(Math.random() * count)
    );
  }

  async function playSeq(sequence, currentLevel, token) {
    setPhase("watch");
    setStatus("WATCH + LISTEN");
    setAns([]);

    const gap = Math.max(300, 760 - (currentLevel - 1) * 35);

    for (const id of sequence) {
      if (run.current !== token) return;

      setActive(id);
      play(id, Math.min(300, gap - 30));

      await sleep(gap * 0.72);

      setActive(null);

      await sleep(gap * 0.28);
    }

    if (run.current !== token) return;

    setPhase("input");
    setStatus("YOUR TURN");
  }

  async function levelStart(currentLevel) {
    run.current++;

    const token = run.current;
    const count = Math.min(
      9,
      6 + Math.floor((currentLevel - 1) / 3)
    );
    const length = Math.min(14, currentLevel + 2);
    const sequence = make(length, count);

    setLevel(currentLevel);
    setSeq(sequence);
    setAns([]);
    setPhase("watch");
    setStatus("WATCH + LISTEN");

    await sleep(400);

    playSeq(sequence, currentLevel, token);
  }

  function start() {
    audioCtx();
    setScore(0);
    setNameInput(playerName);
    setPage("name");
  }

  function beginWithName(event) {
    event.preventDefault();
    const cleanName = nameInput.trim().replace(/\s+/g, " ");
    if (!cleanName) return;
    setPlayerName(cleanName);
    setScore(0);
    setPage("game");
    levelStart(1);
  }

  function makeCertificateId(levelNumber) {
    const d = new Date();
    const date = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("");
    return `NT-MS-${String(levelNumber).padStart(2, "0")}-${date}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
  }

  function continueNextLevel() {
    setCertificate(null);
    setPage("game");
    levelStart(level + 1);
  }

  function fail() {
    run.current++;

    setPhase("failed");
    setStatus("SEQUENCE BROKEN");
    setActive(null);

    const newBest = Math.max(best, level);

    setBest(newBest);
    sessionStorage.setItem("msbest", String(newBest));

    play(seq[ans.length] ?? 0, 300);

    setTimeout(() => {
      setPage("over");
    }, 650);
  }

  function tap(id) {
    if (phase !== "input") return;

    play(id, 155);

    setActive(id);

    setTimeout(() => {
      setActive(null);
    }, 150);

    const index = ans.length;

    if (seq[index] !== id) {
      fail();
      return;
    }

    const nextAnswers = [...ans, id];

    setAns(nextAnswers);

    if (nextAnswers.length === seq.length) {
      const earned = level * 120 + 50;
      const finalScore = score + earned;

      setScore(finalScore);
      setPhase("success");
      setStatus("PERFECT");

      setCertificate({
        name: playerName,
        level,
        score: finalScore,
        length: seq.length,
        difficulty: level < 4 ? "EASY" : level < 8 ? "MEDIUM" : "HIGH",
        date: new Date(),
        id: makeCertificateId(level)
      });

      setTimeout(() => setPage("certificate"), 550);
    }
  }

  function home() {
    run.current++;
    setPage("home");
    setPhase("idle");
    setActive(null);
    setShowHowTo(false);
  }

  const count = Math.min(
    9,
    6 + Math.floor((level - 1) / 3)
  );

  const progress = seq.length
    ? (ans.length / seq.length) * 100
    : 0;

  if (page === "home") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#fafbfe] px-5 py-6 text-slate-900">
        {/* soft background glows */}
        <div className="pointer-events-none absolute -left-28 bottom-[-110px] h-96 w-96 rounded-full bg-violet-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-[-110px] h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-[-170px] h-72 w-[520px] -translate-x-1/2 rounded-full bg-violet-100/50 blur-3xl" />

        {/* top controls */}
        <div className="absolute left-5 top-5 z-30 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAudio((value) => !value)}
            className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl border border-white bg-white shadow-xl shadow-slate-200/60 transition hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="text-2xl">{audio ? "🔊" : "🔇"}</span>
            <span className="mt-0.5 text-[10px] font-black tracking-wide text-violet-600">
              SOUND
            </span>
          </button>
          {onExitGame && (
            <button
              type="button"
              onClick={onExitGame}
              className="flex h-16 px-4 items-center justify-center gap-2 rounded-2xl border border-white bg-white shadow-xl shadow-slate-200/60 transition hover:-translate-y-0.5 cursor-pointer text-slate-700 font-bold text-xs uppercase"
            >
              <span>←</span>
              <span>Back to Games</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowHowTo(true)}
          className="absolute right-5 top-5 z-30 flex h-16 w-28 flex-col items-center justify-center rounded-2xl border border-white bg-white shadow-xl shadow-slate-200/60 transition hover:-translate-y-0.5 cursor-pointer"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-violet-500 text-sm font-black text-violet-500">
            ?
          </span>
          <span className="mt-0.5 text-[10px] font-black tracking-wide text-violet-600">
            HOW TO PLAY
          </span>
        </button>

        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-4xl flex-col items-center justify-center text-center">
          <Brand />

          <p className="mt-6 text-[12px] font-black tracking-[0.34em] text-violet-500 sm:text-sm">
            BRAIN • AUDIO • MEMORY
          </p>

          <h1 className="mt-3 text-6xl font-black leading-[0.9] tracking-tight text-slate-950 sm:text-8xl">
            MEMORY
            <br />
            <span className="text-violet-500">SEQUENCE</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base font-medium leading-7 text-slate-500 sm:text-lg">
            Watch the pattern. Listen to every tone.
            <br />
            Reproduce the sequence in exactly the same order.
          </p>

          <div className="mt-9 grid w-full max-w-2xl grid-cols-3 gap-4">
            <Info t="BEST LEVEL" v={best || "—"} icon="🏆" tone="violet" />
            <Info t="AUDIO" v="HIGH" icon="🔊" tone="blue" />
            <Info t="MODE" v="DUAL" icon="🎮" tone="green" />
          </div>

          <div className="mt-5 w-full max-w-[470px] flex flex-col gap-3">
            <button
              type="button"
              onClick={start}
              className="flex min-h-16 w-full items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-xl font-black tracking-wide text-white shadow-xl shadow-violet-300/50 transition hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 cursor-pointer"
            >
              <span className="text-2xl">▶</span>
              START GAME
            </button>

            {onExitGame && (
              <button
                type="button"
                onClick={onExitGame}
                className="py-3 w-full rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-400 text-slate-800 font-bold text-sm uppercase transition cursor-pointer"
              >
                ← Exit to Games List
              </button>
            )}
          </div>

          <p className="mt-4 text-xs font-medium text-slate-400">
            🔊 Turn your device volume up for the best experience.
          </p>
        </section>

        {showHowTo && <HowTo onClose={() => setShowHowTo(false)} />}
      </main>
    );
  }

  if (page === "name") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_50%_8%,rgba(139,92,246,0.11),transparent_32%),radial-gradient(circle_at_7%_72%,rgba(96,165,250,0.11),transparent_27%),radial-gradient(circle_at_93%_72%,rgba(244,114,182,0.10),transparent_27%)] px-5 py-6 sm:px-8 sm:py-7">
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-5xl flex-col items-center justify-center">
          <Brand />
          <div className="mt-6 w-full max-w-xl rounded-[30px] border border-white/90 bg-white/90 p-6 shadow-2xl shadow-violet-100/70 backdrop-blur-sm sm:p-9">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 text-2xl text-violet-500 shadow-sm">✦</div>
            <div className="mx-auto mt-5 flex items-center justify-center gap-3 text-[10px] font-black tracking-[.22em] text-violet-400"><span className="h-px w-8 bg-violet-200" /><span>PLAYER DETAILS</span><span className="h-px w-8 bg-violet-200" /></div>
            <h1 className="mt-3 text-center text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">ENTER YOUR NAME</h1>
            <p className="mx-auto mt-4 max-w-md text-center text-sm leading-6 text-slate-500">Your name will appear on every Memory Sequence certificate you earn.</p>
            <form onSubmit={beginWithName} className="mt-7">
              <label htmlFor="player-name" className="mb-2 block text-left text-xs font-black tracking-[.15em] text-violet-500">PLAYER NAME</label>
              <div className="relative">
                <input id="player-name" autoFocus value={nameInput} onChange={(event)=>setNameInput(event.target.value)} maxLength={40} placeholder="Enter your full name" className="h-14 w-full rounded-2xl border border-violet-200 bg-white px-5 pr-14 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
                <span className="pointer-events-none absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-violet-100 text-violet-500">●</span>
              </div>
              <button type="submit" disabled={!nameInput.trim()} className="mt-5 h-14 w-full rounded-2xl bg-gradient-to-r from-violet-500 via-violet-600 to-purple-600 text-base font-black text-white shadow-xl shadow-violet-200/70 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer">CONTINUE TO GAME <span className="ml-2 text-lg">→</span></button>
            </form>
            <button type="button" onClick={home} className="mt-5 w-full text-center text-sm font-bold text-slate-400 transition hover:text-slate-700 cursor-pointer">← Back to main menu</button>
          </div>
        </div>
      </main>
    );
  }

  if (page === "certificate" && certificate) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_50%_8%,rgba(139,92,246,0.10),transparent_30%),radial-gradient(circle_at_8%_85%,rgba(96,165,250,0.10),transparent_24%),radial-gradient(circle_at_92%_85%,rgba(244,114,182,0.09),transparent_24%)] px-4 py-8 sm:px-7">
        <style>{`@media print{@page{size:A4 landscape;margin:0}html,body{width:100%;height:100%;background:#fff!important}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}#memory-certificate{width:100%!important;min-height:0!important;box-shadow:none!important;border-radius:0!important} .certificate-actions{display:none!important}}`}</style>

        <div className="mx-auto max-w-5xl">
          <div id="memory-certificate" className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-[30px] border-[3px] border-violet-300 bg-white p-3 shadow-2xl shadow-violet-100 sm:p-4 lg:p-5">
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-violet-100/70 blur-2xl" />
            <div className="pointer-events-none absolute -right-16 bottom-[-70px] h-56 w-56 rounded-full bg-blue-100/70 blur-2xl" />

            <div className="relative rounded-[22px] border border-violet-200 p-4 sm:p-5 lg:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-full bg-violet-100 px-3 py-1.5 text-[10px] font-black tracking-[.16em] text-violet-600">
                  CERTIFICATE OF ACHIEVEMENT
                </div>
                <div className="rounded-b-2xl bg-gradient-to-b from-violet-500 to-purple-700 px-4 py-3 text-center text-white shadow-lg">
                  <div className="text-[10px] font-black tracking-widest">LEVEL</div>
                  <div className="text-3xl font-black leading-none">{certificate.level}</div>
                </div>
              </div>

              <div className="mt-1 text-center">
                <Brand />

                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  MEMORY <span className="text-violet-500">SEQUENCE</span>
                </h1>

                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-500">
                  This certificate is proudly presented to
                </p>

                <div className="mx-auto mt-2 max-w-3xl border-b-2 border-violet-300 px-3 pb-2">
                  <div className="break-words text-3xl font-black text-violet-600 sm:text-4xl">{certificate.name}</div>
                </div>

                <p className="mt-3 text-sm text-slate-500">for successfully completing</p>
                <div className="mt-0.5 text-2xl font-black text-slate-950 sm:text-3xl">LEVEL {certificate.level}</div>
                <p className="mt-0.5 text-xs font-medium text-slate-500">in the Memory Sequence Game</p>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
                <CertStat label="SCORE" value={certificate.score.toLocaleString()} />
                <CertStat label="SEQUENCE" value={certificate.length} />
                <CertStat label="DIFFICULTY" value={certificate.difficulty} />
                <CertStat label="COMPLETED" value={certificate.date.toLocaleDateString(undefined,{day:"2-digit",month:"short",year:"numeric"})} />
              </div>

              <div className="mt-4 flex flex-row items-end justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold italic text-slate-800">Nebuloid Tech Studio</div>
                  <div className="mt-1 text-xs font-black tracking-[.2em] text-violet-500">GAME DEVELOPER</div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-[10px] font-black tracking-[.18em] text-violet-500">CERTIFICATE ID</div>
                  <div className="mt-1 break-all text-xs font-bold text-slate-500">{certificate.id}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="certificate-actions mt-5 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => window.print()} className="min-h-12 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-7 font-black text-white shadow-lg shadow-violet-200/50 cursor-pointer">
              🖨 PRINT CERTIFICATE
            </button>
            <button type="button" onClick={continueNextLevel} className="min-h-12 rounded-xl bg-slate-950 px-7 font-black text-white cursor-pointer">
              CONTINUE TO LEVEL {level + 1} →
            </button>
            <button type="button" onClick={home} className="min-h-12 rounded-xl border border-slate-200 bg-white px-7 font-bold text-slate-700 cursor-pointer">
              MAIN MENU
            </button>
            {onExitGame && (
              <button type="button" onClick={onExitGame} className="min-h-12 rounded-xl border border-slate-300 bg-slate-100 px-7 font-bold text-slate-800 cursor-pointer">
                EXIT GAME
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  if (page === "over") {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_50%_8%,rgba(139,92,246,0.10),transparent_30%),radial-gradient(circle_at_8%_85%,rgba(96,165,250,0.10),transparent_24%),radial-gradient(circle_at_92%_85%,rgba(244,114,182,0.09),transparent_24%)] px-5 py-10">
        <div className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center text-center">
          <Brand />

          <div className="mt-8 grid h-14 w-14 place-items-center rounded-2xl bg-rose-100 text-3xl font-light text-rose-500">
            ×
          </div>

          <p className="mt-5 text-xs font-black tracking-[0.3em] text-rose-500">
            RUN ENDED
          </p>

          <h1 className="mt-2 text-5xl font-black text-slate-950">
            GAME OVER
          </h1>

          <p className="mt-3 text-slate-500">
            You reached level {level}.
          </p>

          <div className="mt-8 grid w-full grid-cols-2 gap-4">
            <Big
              t="FINAL SCORE"
              v={score.toLocaleString()}
            />
            <Big
              t="BEST LEVEL"
              v={best}
            />
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={start}
              className="min-h-12 rounded-xl bg-slate-950 px-7 font-black text-white transition hover:bg-slate-800 cursor-pointer"
            >
              PLAY AGAIN
            </button>

            <button
              type="button"
              onClick={home}
              className="min-h-12 rounded-xl border border-slate-200 bg-white px-7 font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
            >
              MAIN MENU
            </button>

            {onExitGame && (
              <button
                type="button"
                onClick={onExitGame}
                className="min-h-12 rounded-xl border border-slate-300 bg-slate-100 px-7 font-bold text-slate-800 cursor-pointer"
              >
                EXIT GAME
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_8%,rgba(139,92,246,0.10),transparent_30%),radial-gradient(circle_at_8%_85%,rgba(96,165,250,0.10),transparent_24%),radial-gradient(circle_at_92%_85%,rgba(244,114,182,0.09),transparent_24%)] px-5 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-7">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-2 sm:px-4">
          <button
            type="button"
            onClick={home}
            className="text-sm font-bold text-slate-400 hover:text-slate-800 cursor-pointer"
          >
            ← MENU
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="text-[10px] font-black tracking-[0.3em] text-slate-400">
              MEMORY SEQUENCE
            </div>
            <div className="font-black text-violet-600">
              LEVEL {level}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[9px] font-black tracking-[0.2em] text-slate-400">
              SCORE
            </div>
            <div className="font-black text-slate-900">
              {score.toLocaleString()}
            </div>
          </div>
        </header>

        <section className="mt-7 rounded-[24px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 sm:p-6">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-2 sm:px-4">
            <div>
              <div className="text-sm font-black tracking-[0.18em] text-violet-500">
                {status}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                {phase === "input"
                  ? "Repeat every tile in order."
                  : "Pay attention to both light and sound."}
              </div>
            </div>

            <div className="text-xs font-bold text-slate-400">
              {ans.length}/{seq.length}
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-violet-400 transition-all duration-200"
              style={{
                width: `${phase === "watch" ? 0 : progress}%`
              }}
            />
          </div>
        </section>

        <div className="mx-auto mt-8 grid w-full max-w-[760px] grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {tiles.slice(0, count).map((tile) => (
            <button
              key={tile.id}
              type="button"
              disabled={phase !== "input"}
              onClick={() => tap(tile.id)}
              aria-label={`Tile ${tile.name}`}
              style={{
                background:
                  active === tile.id
                    ? tile.a
                    : tile.b,
                color: tile.c
              }}
              className={[
                "aspect-square rounded-[28px] border border-white shadow-lg shadow-slate-200/45 transition-all duration-100",
                phase === "input"
                  ? "cursor-pointer hover:brightness-95 active:scale-95"
                  : "cursor-default",
                active === tile.id
                  ? "scale-[1.035] shadow-xl"
                  : ""
              ].join(" ")}
            >
              <span className="text-3xl font-black sm:text-4xl">
                {active === tile.id ? "●" : "○"}
              </span>
            </button>
          ))}
        </div>

        <div className="mx-auto mt-7 flex w-full max-w-[760px] items-center justify-between px-1 sm:px-2">
          <span className="text-xs font-medium text-slate-400">
            🔊 Unique sound per tile
          </span>

          <button
            type="button"
            onClick={() => setAudio((value) => !value)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm cursor-pointer"
          >
            {audio
              ? "🔊 Sound ON"
              : "🔇 Sound OFF"}
          </button>
        </div>
      </div>
    </main>
  );
}

function Brand() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
        NEBULOID TECH
      </div>
      <div className="mt-0.5 text-xs font-bold tracking-[0.48em] text-violet-500 sm:text-sm">
        STUDIO
      </div>
    </div>
  );
}

function Info({ t, v, icon, tone }) {
  const tones = {
    violet: "bg-violet-100 text-violet-500",
    blue: "bg-blue-100 text-blue-500",
    green: "bg-green-100 text-green-500"
  };

  return (
    <div className="rounded-2xl border border-white bg-white px-4 py-4 shadow-lg shadow-slate-200/50 sm:px-5">
      <div className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl text-xl ${tones[tone] || tones.violet}`}>
        {icon}
      </div>
      <p className="mt-3 text-[11px] font-black tracking-wide text-slate-400">
        {t}
      </p>
      <p className="mt-1 text-2xl font-black text-slate-900">{v}</p>
    </div>
  );
}

function Big({ t, v }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white py-6 shadow-sm">
      <p className="text-[9px] font-black tracking-[0.2em] text-slate-400">
        {t}
      </p>
      <p className="mt-2 text-3xl font-black text-slate-900">
        {v}
      </p>
    </div>
  );
}

function CertStat({ label, value }) {
  return (
    <div className="min-w-0 text-center">
      <div className="text-[9px] font-black tracking-[.18em] text-violet-400">{label}</div>
      <div className="mt-1 break-words text-sm font-black text-slate-900">{value}</div>
    </div>
  );
}

function HowTo({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/25 p-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white bg-white p-7 text-left shadow-2xl">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-black tracking-[0.25em] text-violet-500">
              HOW TO PLAY
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Watch. Listen. Repeat.
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-xl text-slate-500 cursor-pointer"
          >
            ×
          </button>
        </div>

        <ol className="mt-6 space-y-4 text-sm leading-6 text-slate-500">
          <li>
            <b className="text-slate-900">01.</b>{" "}
            Watch which tiles light up.
          </li>
          <li>
            <b className="text-slate-900">02.</b>{" "}
            Listen carefully — every tile has its own tone.
          </li>
          <li>
            <b className="text-slate-900">03.</b>{" "}
            Tap the same tiles in exactly the same order.
          </li>
          <li>
            <b className="text-slate-900">04.</b>{" "}
            Each level gets longer and faster.
          </li>
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 min-h-12 w-full rounded-xl bg-slate-950 font-black text-white cursor-pointer"
        >
          GOT IT
        </button>
      </div>
    </div>
  );
}
