import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./index.css";

const TOTAL_LEVELS = 10;

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const LEVELS = [
  { name: "Bullseye", subtitle: "Classic precision", time: 25, target: "bullseye", size: 84, need: 8, points: 10, spawn: 1250, accent: "red" },
  { name: "Quick Shot", subtitle: "Fast and focused", time: 25, target: "rings", size: 68, need: 10, points: 12, spawn: 1000, accent: "orange" },
  { name: "Precision", subtitle: "Tiny targets", time: 28, target: "precision", size: 48, need: 10, points: 16, spawn: 1050, accent: "violet" },
  { name: "Moving Targets", subtitle: "Targets won't stay still", time: 30, target: "moving", size: 62, need: 12, points: 18, spawn: 1050, accent: "blue" },
  { name: "Multi Target", subtitle: "Choose your shot", time: 28, target: "multi", size: 64, need: 14, points: 20, spawn: 850, accent: "emerald" },
  { name: "Speed Rush", subtitle: "No time to hesitate", time: 25, target: "speed", size: 54, need: 16, points: 22, spawn: 700, accent: "amber" },
  { name: "Small Targets", subtitle: "Steady hands win", time: 30, target: "small", size: 38, need: 16, points: 25, spawn: 800, accent: "pink" },
  { name: "Zigzag", subtitle: "Unpredictable positions", time: 28, target: "zigzag", size: 52, need: 18, points: 28, spawn: 720, accent: "cyan" },
  { name: "Extreme", subtitle: "Fast. Small. Brutal.", time: 30, target: "extreme", size: 34, need: 20, points: 32, spawn: 600, accent: "rose" },
  { name: "Master Shooter", subtitle: "The final test", time: 35, target: "master", size: 42, need: 25, points: 40, spawn: 520, accent: "red" }
];

function pos() {
  return { x: 7 + Math.random() * 86, y: 8 + Math.random() * 82 };
}

function makeTarget(level) {
  const p = pos();
  return { id: makeId(), ...p, size: level.size };
}

function BrandLogo({ compact = false }) {
  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      <div className={`${compact ? "h-10 w-10 text-lg" : "h-11 w-11 text-xl"} flex items-center justify-center overflow-hidden rounded-xl bg-slate-950 shadow-sm`}>
        <img src="/nebuloid-tech-logo.png" alt="Nebuloid Tech" className="h-8 w-8 object-contain" />
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-900">Nebuloid Tech</div>
        {!compact && <div className="text-lg font-black tracking-tight text-slate-950">Target Shooter</div>}
      </div>
    </div>
  );
}

function Header({ levelIndex, onSettings, onExitGame }) {
  return (
    <header className="relative z-20 mx-auto mb-6 flex w-full max-w-6xl items-center justify-between px-1 sm:px-2">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-[23px] shadow-sm">
          🎯
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.28em] text-red-600">
            Nebuloid Tech
          </div>
          <div className="text-lg font-black tracking-tight text-slate-950">
            Target Shooter
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {levelIndex !== undefined && (
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black shadow-sm">
            Level {levelIndex + 1} / {TOTAL_LEVELS}
          </div>
        )}

        {onExitGame && (
          <button
            type="button"
            onClick={onExitGame}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-95"
          >
            <span>←</span>
            <span>Back to Games</span>
          </button>
        )}

        {onSettings && (
          <button
            type="button"
            onClick={onSettings}
            aria-label="Open settings"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl shadow-sm transition hover:bg-slate-50 active:scale-95"
          >
            ⚙
          </button>
        )}
      </div>
    </header>
  );
}

function Target({ target, level, onHit }) {
  const common = {
    position: "absolute",
    left: `${target.x}%`,
    top: `${target.y}%`,
    width: target.size,
    height: target.size,
    cursor: "crosshair"
  };

  if (level.target === "multi") {
    return <button type="button" aria-label="Shoot target" onClick={(e) => { e.stopPropagation(); onHit(target.id); }}
      className="target-pop rounded-lg border-4 border-slate-950 bg-emerald-400 p-1 shadow-[0_5px_0_#064e3b]" style={{...common, transform:"translate(-50%,-50%) rotate(45deg)"}}>
      <span className="block h-full w-full rounded-md border-2 border-white" />
    </button>;
  }
  if (level.target === "zigzag") {
    return <button type="button" aria-label="Shoot target" onClick={(e) => { e.stopPropagation(); onHit(target.id); }}
      className="target-spin rounded-full border-4 border-slate-950 bg-cyan-400 p-1 shadow-lg" style={{...common, transform:"translate(-50%,-50%)"}}>
      <span className="flex h-full w-full items-center justify-center rounded-full border-2 border-white">
        <span className="h-1/3 w-1/3 rounded-full bg-slate-950" />
      </span>
    </button>;
  }
  const inner = level.target === "precision" || level.target === "small" || level.target === "extreme" || level.target === "speed";
  return <button type="button" aria-label="Shoot target" onClick={(e) => { e.stopPropagation(); onHit(target.id); }}
    className={`${level.target === "moving" ? "target-pulse" : ""} target-pop rounded-full border-4 border-white bg-red-500 p-1 shadow-[0_0_0_4px_rgba(239,68,68,.18)]`}
    style={common}>
    <span className="flex h-full w-full items-center justify-center rounded-full border-2 border-red-200">
      <span className={`${inner ? "h-[34%] w-[34%]" : "h-[42%] w-[42%]"} rounded-full bg-slate-950`} />
    </span>
  </button>;
}

function Stat({ label, value, danger }) {
  return <div className="min-w-[88px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-center shadow-sm">
    <div className="text-[9px] font-black uppercase tracking-[.18em] text-slate-400">{label}</div>
    <div className={`mt-1 text-lg font-black ${danger ? "text-red-600" : "text-slate-900"}`}>{value}</div>
  </div>;
}

function SettingsPanel({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-950">Game Settings</h2>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-xl font-bold hover:bg-slate-50">×</button>
        </div>
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-black uppercase tracking-widest text-slate-400">Controls</div>
            <div className="mt-2 font-bold text-slate-700">Click the target to shoot.</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-black uppercase tracking-widest text-slate-400">Challenge</div>
            <div className="mt-2 font-bold text-slate-700">10 levels · 10 certificates</div>
          </div>
        </div>
        <button type="button" onClick={onClose} className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-800">Done</button>
      </div>
    </div>
  );
}

function Certificate({ name, levelIndex, score, accuracy, certificateId, onNext, onBack, final }) {
  const level = LEVELS[levelIndex] || LEVELS[0];

  const downloadCertificate = () => {
    const printWindow = window.open("", "_blank", "width=1200,height=900");
    if (!printWindow) return;

    const safeName = escapeHtml(name || "Player");
    const safeLevel = escapeHtml(level.name);
    const safeSubtitle = escapeHtml(level.subtitle);

    printWindow.document.write(`<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>Target Shooter Certificate - ${safeName}</title>
<style>
*{box-sizing:border-box}
body{margin:0;padding:36px;background:#fff;font-family:Arial,Helvetica,sans-serif;color:#0f172a}
.certificate{max-width:1100px;margin:0 auto;border:8px solid #0f172a;padding:8px}
.inner{position:relative;border:1px solid #cbd5e1;padding:55px 65px;text-align:center;overflow:hidden}
.inner:before{content:"";position:absolute;left:-80px;top:-80px;width:260px;height:420px;border-radius:50%;border:2px solid #e2e8f0;transform:rotate(-20deg);opacity:.7}
.inner:after{content:"";position:absolute;right:-90px;bottom:-120px;width:300px;height:430px;border-radius:50%;border:2px solid #e2e8f0;transform:rotate(20deg);opacity:.7}
.logo{height:70px;max-width:180px;object-fit:contain}
.eyebrow{margin-top:28px;color:#dc2626;font-size:13px;font-weight:900;letter-spacing:5px}
.game-logo{display:flex;align-items:center;justify-content:center;gap:8px;margin:12px 0 18px}
.target{position:relative;width:42px;height:42px;border:3px solid #0f172a;border-radius:50%;background:#fff}
.target:before{content:"";position:absolute;inset:6px;border:4px solid #ef4444;border-radius:50%}
.target span{position:absolute;width:12px;height:12px;left:12px;top:12px;background:#ef4444;border:2px solid #0f172a;border-radius:50%}
.target:after{content:"";position:absolute;width:6px;height:27px;right:-8px;top:-9px;background:#0f172a;border-radius:4px;transform:rotate(45deg)}
.game-name{text-align:left;font-size:23px;line-height:.88;font-weight:900;letter-spacing:-.5px}
.game-name span{display:block;color:#0f172a}.game-name b{display:block;color:#dc2626}
h1{font-size:52px;margin:15px 0 22px}
.muted{color:#64748b;font-size:18px}
.name{max-width:680px;margin:10px auto 25px;border-bottom:2px solid #0f172a;padding:8px;font-size:40px;font-weight:900}
.desc{color:#475569;font-size:17px}
.stats{display:flex;gap:16px;justify-content:center;margin:30px auto;max-width:760px}
.stat{width:220px;padding:18px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px}
.value{font-size:26px;font-weight:900}.label{font-size:10px;letter-spacing:2px;color:#94a3b8;text-transform:uppercase;margin-top:5px}
.footer{display:flex;justify-content:space-between;border-top:1px solid #e2e8f0;padding-top:22px;margin-top:26px;color:#64748b;font-size:13px}
.qr{width:150px;height:150px;object-fit:contain;margin-top:20px}
.id{font-size:10px;color:#94a3b8;margin-top:6px}
@media print{body{padding:0}.certificate{max-width:none;min-height:100vh}.inner{min-height:calc(100vh - 100px)}}
</style>
</head>
<body>
<div class="certificate"><div class="inner">
<img class="logo" src="/nebuloid-tech-logo.png" alt="Nebuloid Tech">
<div class="eyebrow">CERTIFICATE OF ACHIEVEMENT</div>
<div class="game-logo">
  <div class="target"><span></span></div>
  <div class="game-name"><span>TARGET</span><b>SHOOTER</b></div>
</div>
<div class="muted">This certificate is proudly presented to</div>
<div class="name">${safeName}</div>
<div class="desc">for successfully completing <b>Level ${levelIndex + 1} — ${safeLevel}</b> in the Target Shooter challenge.</div>
<div class="stats">
<div class="stat"><div class="value">${score || 0}</div><div class="label">Score</div></div>
<div class="stat"><div class="value">${accuracy || 0}%</div><div class="label">Accuracy</div></div>
<div class="stat"><div class="value">${levelIndex + 1}/10</div><div class="label">Level</div></div>
</div>
<div class="footer">
<div><b>Achievement:</b> ${safeSubtitle}</div>
<div><b>Issued by:</b> Nebuloid Tech</div>
</div>
</div></div>
<script>window.onload=function(){window.print();}</script>
</body></html>`);
    printWindow.document.close();
  };

  return (
    <section className="relative z-10 mx-auto max-w-4xl">
      <div className="mb-5 text-center">
        <div className="inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-red-600">
          {final ? "All levels completed" : "Level completed"}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border-8 border-slate-900 bg-white p-2 shadow-xl">
        <div className="border border-slate-300 p-8 text-center sm:p-12">
          <div className="flex justify-center">
            <img
              src="/nebuloid-tech-logo.png"
              alt="Nebuloid Tech"
              className="h-16 w-auto object-contain"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>

          <div className="mt-5 text-xs font-bold uppercase tracking-[.35em] text-red-600">
            Certificate of Achievement
          </div>

          <div className="mx-auto mt-4 flex items-center justify-center gap-2">
            <svg
              viewBox="0 0 64 64"
              className="h-10 w-10 shrink-0"
              aria-label="Target Shooter logo"
              role="img"
            >
              <circle cx="30" cy="34" r="23" fill="white" stroke="#0f172a" strokeWidth="3.5" />
              <circle cx="30" cy="34" r="16" fill="white" stroke="#ef4444" strokeWidth="5" />
              <circle cx="30" cy="34" r="8" fill="#ef4444" />
              <circle cx="30" cy="34" r="3" fill="#0f172a" />
              <path d="M39 24 L56 7" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
              <path d="M50 7 H57 V14" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-left text-[22px] font-black leading-[0.9] tracking-tight">
              <span className="block text-slate-900">TARGET</span>
              <span className="block text-red-600">SHOOTER</span>
            </div>
          </div>

          <p className="mt-7 text-slate-500">
            This certificate is proudly presented to
          </p>

          <div className="mx-auto mt-3 max-w-xl border-b-2 border-slate-900 pb-3 text-3xl font-black sm:text-4xl">
            {name || "Player"}
          </div>

          <p className="mx-auto mt-7 max-w-2xl leading-7 text-slate-600">
            for successfully completing{" "}
            <b>Level {levelIndex + 1} — {level.name}</b> in the Target Shooter challenge.
          </p>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <b className="text-xl">{score || 0}</b>
              <span className="mt-1 block text-[10px] uppercase tracking-widest text-slate-400">Score</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <b className="text-xl">{accuracy || 0}%</b>
              <span className="mt-1 block text-[10px] uppercase tracking-widest text-slate-400">Accuracy</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <b className="text-xl">{levelIndex + 1}/10</b>
              <span className="mt-1 block text-[10px] uppercase tracking-widest text-slate-400">Level</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-5 border-t border-slate-200 pt-6 text-left text-xs text-slate-400 sm:flex-row">
            <div>
              <span className="font-bold text-slate-600">Achievement:</span>{" "}
              {level.subtitle}
            </div>
            <div>
              <span className="font-bold text-slate-600">Issued by:</span>{" "}
              Nebuloid Tech
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={onBack}
          className="order-1 rounded-xl border-2 border-red-500 bg-white px-7 py-3 font-black text-red-600 transition hover:bg-red-50"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="order-2 rounded-xl bg-red-600 px-7 py-3 font-black text-white transition hover:bg-red-500"
        >
          {final ? "Finish & View Result" : `Start Level ${levelIndex + 2} →`}
        </button>

        <button
          type="button"
          onClick={downloadCertificate}
          className="order-3 rounded-xl border-2 border-slate-300 bg-white px-7 py-3 font-black text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
        >
          ↓ Download Certificate
        </button>
      </div>
    </section>
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function App({ onExitGame }) {
  const [screen, setScreen] = useState("start");
  const [name, setName] = useState("");
  const [levelIndex, setLevelIndex] = useState(0);
  const [pendingLevelIndex, setPendingLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [levelHits, setLevelHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [levelMisses, setLevelMisses] = useState(0);
  const [lives, setLives] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25);
  const [combo, setCombo] = useState(0);
  const [target, setTarget] = useState(() => makeTarget(LEVELS[0]));
  const [best, setBest] = useState(0);
  const [notice, setNotice] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [certificateId, setCertificateId] = useState("");
  const timerRef = useRef(null);
  const spawnRef = useRef(null);
  const noticeRef = useRef(null);

  const level = LEVELS[levelIndex];
  const accuracy = useMemo(() => {
    const total = levelHits + levelMisses;
    return total ? Math.round((levelHits / total) * 100) : 0;
  }, [levelHits, levelMisses]);

  const showNotice = useCallback((text) => {
    setNotice(text);
    clearTimeout(noticeRef.current);
    noticeRef.current = setTimeout(() => setNotice(""), 450);
  }, []);

  const startLevel = useCallback((idx, resetAll = false) => {
    const cfg = LEVELS[idx];
    if (resetAll) {
      setScore(0); setHits(0); setMisses(0); setBest(0);
    }
    setLevelIndex(idx);
    setCertificateId("");
    setLevelScore(0);
    setLevelHits(0);
    setLevelMisses(0);
    setLives(5);
    setCombo(0);
    setTimeLeft(cfg.time);
    setTarget(makeTarget(cfg));
    setNotice("");
    setScreen("game");
  }, []);

  useEffect(() => {
    if (screen !== "game") return;
    clearInterval(timerRef.current);
    clearInterval(spawnRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); clearInterval(spawnRef.current); setCertificateId(`${Date.now().toString(36)}-${makeId().slice(0, 8)}`); setScreen("certificate"); return 0; }
        return t - 1;
      });
    }, 1000);

    spawnRef.current = setInterval(() => setTarget(makeTarget(level)), level.spawn);
    return () => { clearInterval(timerRef.current); clearInterval(spawnRef.current); };
  }, [screen, level]);

  useEffect(() => {
    if (screen === "game" && lives <= 0) {
      clearInterval(timerRef.current); clearInterval(spawnRef.current);
      setCertificateId(`${Date.now().toString(36)}-${makeId().slice(0, 8)}`);
      setScreen("certificate");
    }
  }, [lives, screen]);

  const hitTarget = (id) => {
    if (id !== target.id || screen !== "game") return;
    const newCombo = combo + 1;
    const pts = level.points + Math.min(30, Math.max(0, newCombo - 1) * 2);
    setScore(s => s + pts);
    setLevelScore(s => s + pts);
    setHits(h => h + 1);
    setLevelHits(h => {
      const next = h + 1;
      if (next >= level.need) {
        clearInterval(timerRef.current); clearInterval(spawnRef.current);
        setCertificateId(`${Date.now().toString(36)}-${makeId().slice(0, 8)}`);
        setTimeout(() => setScreen("certificate"), 180);
      }
      return next;
    });
    setCombo(newCombo);
    showNotice(`+${pts} HIT`);
    setTarget(makeTarget(level));
  };

  const missShot = () => {
    if (screen !== "game") return;
    setMisses(m => m + 1);
    setLevelMisses(m => m + 1);
    setLives(l => Math.max(0, l - 1));
    setCombo(0);
    showNotice("MISS");
  };

  const nextFromCertificate = () => {
    if (levelIndex >= TOTAL_LEVELS - 1) setScreen("final");
    else startLevel(levelIndex + 1);
  };

  const openNameScreen = (idx = 0) => {
    setPendingLevelIndex(idx);
    setScreen("name");
  };

  const openLevels = () => {
    setScreen("levels");
  };

  const beginSelectedLevel = () => {
    const playerName = name.trim();
    if (!playerName) {
      setScreen("name");
      return;
    }
    setName(playerName.slice(0, 24));
    startLevel(pendingLevelIndex, pendingLevelIndex === 0);
  };

  const selectLevel = (idx) => {
    if (name.trim()) {
      startLevel(idx, idx === 0);
    } else {
      setPendingLevelIndex(idx);
      setScreen("name");
    }
  };

  const exitGame = () => {
    clearInterval(timerRef.current);
    clearInterval(spawnRef.current);
    if (onExitGame) {
      onExitGame();
      return;
    }
    try {
      window.close();
    } catch {}
    setScreen("exit");
  };

  const finalAccuracy = hits + misses ? Math.round((hits / (hits + misses)) * 100) : 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-white px-4 py-6 text-slate-950 sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute -left-10 -top-10 h-72 w-72 rotate-45 opacity-90">
        <div className="absolute left-0 top-20 h-[2px] w-72 bg-slate-950" />
        <div className="absolute left-0 top-28 h-[2px] w-56 bg-slate-950" />
        <div className="absolute left-0 top-36 h-[2px] w-40 bg-slate-950" />
        <div className="absolute left-20 top-0 h-72 w-[2px] bg-slate-950" />
      </div>
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-72 w-72 -rotate-45 opacity-90">
        <div className="absolute right-0 bottom-20 h-[2px] w-72 bg-slate-950" />
        <div className="absolute right-0 bottom-28 h-[2px] w-56 bg-slate-950" />
        <div className="absolute right-0 bottom-36 h-[2px] w-40 bg-slate-950" />
        <div className="absolute right-20 bottom-0 h-72 w-[2px] bg-slate-950" />
      </div>
      <div className="pointer-events-none absolute right-8 top-8 grid grid-cols-5 gap-3">
        {Array.from({ length: 25 }).map((_, i) => <span key={i} className="h-1 w-1 rounded-full bg-slate-950" />)}
      </div>
      <div className="pointer-events-none absolute bottom-8 left-8 grid grid-cols-5 gap-3">
        {Array.from({ length: 25 }).map((_, i) => <span key={i} className="h-1 w-1 rounded-full bg-slate-950" />)}
      </div>
      <div className="mx-auto max-w-6xl">
        {screen === "start" && (
          <>
            <Header onSettings={() => setSettingsOpen(true)} onExitGame={onExitGame} />

            <section className="relative z-10 mx-auto mt-10 flex max-w-5xl justify-center sm:mt-12">
              <div className="w-full max-w-[810px] rounded-[30px] border border-slate-200 bg-white px-7 py-10 text-center shadow-[0_18px_55px_rgba(15,23,42,0.10)] sm:px-20 sm:py-11">
                <div className="mx-auto flex h-[92px] items-center justify-center">
                  <img
                    src="/nebuloid-tech-logo.png"
                    alt="Nebuloid Tech"
                    className="h-full w-auto object-contain"
                  />
                </div>

                <div className="mt-8 text-[15px] font-black uppercase tracking-[0.30em] text-red-600">
                  10-Level Challenge
                </div>

                <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950 sm:text-[54px]">
                  Target Shooter
                </h1>

                <p className="mx-auto mt-4 max-w-[620px] text-[16px] leading-7 text-slate-500">
                  Test your aim across ten progressively harder shooting levels
                  and earn a certificate for every completed level.
                </p>

                <div className="mx-auto mt-9 grid max-w-[500px] gap-3">
                  <button
                    type="button"
                    onClick={() => openNameScreen(0)}
                    className="flex min-h-[58px] items-center justify-between rounded-2xl bg-slate-950 px-6 text-left text-[17px] font-black text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 active:scale-[0.99]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">▶</span>
                      Start Game
                    </span>
                    <span className="text-xl">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={openLevels}
                    className="flex min-h-[58px] items-center justify-between rounded-2xl border-2 border-slate-200 bg-white px-6 text-left text-[17px] font-black text-slate-950 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-sm">▦</span>
                      Levels
                    </span>
                    <span className="text-xl text-slate-400">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={exitGame}
                    className="flex min-h-[58px] items-center justify-between rounded-2xl border-2 border-red-100 bg-white px-6 text-left text-[17px] font-black text-red-600 transition hover:border-red-200 hover:bg-red-50 active:scale-[0.99]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 text-sm">←</span>
                      {onExitGame ? "Back to Games" : "Exit Game"}
                    </span>
                    <span className="text-xl">→</span>
                  </button>
                </div>

                <div className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  10 levels · 10 certificates
                </div>
              </div>
            </section>
          </>
        )}

        {screen === "name" && (
          <>
            <Header onSettings={() => setSettingsOpen(true)} onExitGame={onExitGame} />

            <section className="relative z-10 mx-auto mt-10 max-w-3xl sm:mt-14">
              <div className="rounded-[30px] border border-slate-200 bg-white px-7 py-10 text-center shadow-[0_18px_55px_rgba(15,23,42,0.10)] sm:px-14 sm:py-12">
                <div className="text-xs font-black uppercase tracking-[0.28em] text-red-600">
                  Player Setup
                </div>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  Enter Your Name
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-[16px] leading-7 text-slate-500">
                  Your name will appear on every certificate you earn.
                </p>

                <div className="mx-auto mt-9 max-w-[520px] text-left">
                  <label className="mb-3 block text-[15px] font-black text-slate-900">
                    Player name
                  </label>
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 24))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && name.trim()) beginSelectedLevel();
                    }}
                    placeholder="Enter your name"
                    className="h-[60px] w-full rounded-2xl border border-slate-300 bg-white px-5 text-[16px] font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                <div className="mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setScreen("start")}
                    className="rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 font-black text-slate-700 transition hover:bg-slate-50"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={beginSelectedLevel}
                    disabled={!name.trim()}
                    className="rounded-2xl bg-slate-950 px-9 py-4 font-black text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Start Level {pendingLevelIndex + 1} →
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {screen === "levels" && (
          <>
            <Header onSettings={() => setSettingsOpen(true)} onExitGame={onExitGame} />

            <section className="relative z-10 mx-auto mt-8 max-w-6xl sm:mt-10">
              <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-red-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                    Choose Your Challenge
                  </div>
                  <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                    All Levels
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Pick a challenge and test your accuracy, speed and reaction time.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setScreen("start")}
                  className="group inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md lg:self-auto"
                >
                  <span className="transition-transform group-hover:-translate-x-0.5">←</span>
                  Main Menu
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {LEVELS.map((item, idx) => {
                  const difficulty =
                    idx < 3 ? "Warm Up" : idx < 6 ? "Advanced" : idx < 9 ? "Expert" : "Master";
                  const difficultyClass =
                    idx < 3
                      ? "bg-slate-100 text-slate-600"
                      : idx < 6
                        ? "bg-red-50 text-red-600"
                        : idx < 9
                          ? "bg-slate-950 text-white"
                          : "bg-red-600 text-white";

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => selectLevel(idx)}
                      className="group relative overflow-hidden rounded-[22px] border border-slate-200 bg-white hover:bg-slate-950 p-5 text-left shadow-[0_8px_28px_rgba(15,23,42,0.06)] transition duration-150 hover:-translate-y-1 hover:border-slate-950 hover:shadow-[0_18px_42px_rgba(15,23,42,0.11)] active:scale-[0.99] active:bg-slate-950 active:border-slate-950"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-slate-950 transition-colors group-hover:bg-red-600" />

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white transition group-hover:bg-red-600">
                            {String(idx + 1).padStart(2, "0")}
                          </div>

                          <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-red-600">
                              Level {idx + 1}
                            </div>
                            <h2 className="mt-0.5 text-[19px] font-black tracking-tight text-slate-950 transition-colors group-hover:text-white group-active:text-white">
                              {item.name}
                            </h2>
                          </div>
                        </div>

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-black text-slate-900 transition group-hover:border-red-100 group-hover:bg-red-50 group-hover:text-red-600">
                          →
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <p className="text-sm leading-5 text-slate-500 transition-colors group-hover:text-slate-300 group-active:text-slate-300">{item.subtitle}</p>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${difficultyClass}`}>
                          {difficulty}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200 rounded-xl border border-slate-100 bg-slate-50/70 py-3 group-active:divide-slate-700 group-active:border-slate-700 group-active:bg-slate-900">
                        <div className="px-3">
                          <div className="text-sm font-black text-slate-950 group-active:text-white">{item.need}</div>
                          <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 group-active:text-slate-500">Hits</div>
                        </div>
                        <div className="px-3">
                          <div className="text-sm font-black text-slate-950">{item.time}s</div>
                          <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 group-active:text-slate-500">Time</div>
                        </div>
                        <div className="px-3">
                          <div className="text-sm font-black text-slate-950 group-active:text-white">{item.points}</div>
                          <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 group-active:text-slate-500">Points</div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 group-active:text-slate-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          Certificate included
                        </span>
                        <span className="text-[11px] font-black text-slate-400 transition group-hover:text-white group-active:text-white">
                          Start →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {screen === "exit" && (
          <>
            <Header onExitGame={onExitGame} />
            <section className="relative z-10 mx-auto mt-16 max-w-xl text-center sm:mt-24">
              <div className="rounded-[30px] border border-slate-200 bg-white px-7 py-12 shadow-[0_18px_55px_rgba(15,23,42,0.10)] sm:px-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-3xl font-black text-white">×</div>
                <div className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-red-600">Game Exited</div>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">See you next time</h1>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  The game session has been closed.
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setScreen("start")}
                    className="rounded-2xl border-2 border-slate-200 bg-white px-7 py-4 font-black text-slate-700 transition hover:bg-slate-50"
                  >
                    Main Menu
                  </button>
                  {onExitGame && (
                    <button
                      type="button"
                      onClick={onExitGame}
                      className="rounded-2xl bg-slate-950 px-8 py-4 font-black text-white shadow-lg transition hover:bg-slate-800"
                    >
                      Back to Games List
                    </button>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {screen === "game" && (
          <section>
            <Header levelIndex={levelIndex} />
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[.25em] text-red-600">Level {levelIndex + 1}</div>
                <h2 className="text-2xl font-black">{level.name}</h2>
                <p className="text-sm text-slate-500">{level.subtitle} · Hit {level.need} targets</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Stat label="Score" value={score} />
                <Stat label="Hits" value={`${levelHits}/${level.need}`} />
                <Stat label="Combo" value={`x${combo}`} />
                <Stat label="Time" value={`${timeLeft}s`} danger={timeLeft <= 5} />
                <Stat label="Lives" value={`♥ ${lives}`} danger />
              </div>
            </div>

            <div onClick={missShot} className="relative min-h-[560px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
              style={{ cursor: "crosshair" }}>
              <div className="pointer-events-none absolute inset-0 opacity-60"
                style={{backgroundImage:"linear-gradient(#e2e8f0 1px,transparent 1px),linear-gradient(90deg,#e2e8f0 1px,transparent 1px)",backgroundSize:"42px 42px"}} />
              <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-slate-400 shadow-sm">
                {level.name} · Click target
              </div>
              <Target target={target} level={level} onHit={hitTarget} />
              {notice && <div className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black ${notice === "MISS" ? "text-red-600" : "text-emerald-600"}`}>{notice}</div>}
              <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white">
                {levelHits} / {level.need} targets
              </div>
            </div>

            <p className="mt-7 text-center text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              Hit the target on screen to get points
            </p>
          </section>
        )}

        {screen === "certificate" && (
          <Certificate name={name} levelIndex={levelIndex} score={levelScore} accuracy={accuracy} certificateId={certificateId}
            onNext={nextFromCertificate} onBack={() => setScreen("levels")} final={levelIndex === TOTAL_LEVELS - 1} />
        )}

        {screen === "final" && (
          <section className="mx-auto max-w-3xl text-center">
            <Header />
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
              <div className="text-xs font-black uppercase tracking-[.35em] text-red-600">Challenge Complete</div>
              <h1 className="mt-3 text-5xl font-black">Master Shooter</h1>
              <p className="mt-3 text-slate-500">{name || "Player"} completed all 10 levels.</p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                <Stat label="Total Score" value={score} />
                <Stat label="Total Hits" value={hits} />
                <Stat label="Accuracy" value={`${finalAccuracy}%`} />
              </div>
              <div className="mt-8 rounded-2xl bg-slate-950 p-7 text-white">
                <div className="text-xs font-black uppercase tracking-[.25em] text-red-400">Nebuloid Tech</div>
                <div className="mt-2 text-2xl font-black">10 / 10 Levels Completed</div>
                <p className="mt-2 text-sm text-slate-400">Ten level certificates earned.</p>
              </div>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <button type="button" onClick={() => { setName(""); setScreen("start"); }}
                  className="rounded-xl bg-red-600 px-8 py-4 font-black text-white hover:bg-red-500">
                  Play Again
                </button>
                {onExitGame && (
                  <button type="button" onClick={onExitGame}
                    className="rounded-xl border-2 border-slate-200 bg-white px-8 py-4 font-black text-slate-800 hover:bg-slate-50">
                    Back to Games
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </main>
  );
}