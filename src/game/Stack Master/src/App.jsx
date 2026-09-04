import React, { useCallback, useEffect, useRef, useState } from "react";

const LEVELS = [
  { level: 1, target: 5, speed: 2.0 }, { level: 2, target: 7, speed: 2.5 },
  { level: 3, target: 9, speed: 3.0 }, { level: 4, target: 11, speed: 3.5 },
  { level: 5, target: 13, speed: 4.0 }, { level: 6, target: 15, speed: 4.5 },
  { level: 7, target: 17, speed: 5.0 }, { level: 8, target: 19, speed: 5.5 },
  { level: 9, target: 22, speed: 6.0 }, { level: 10, target: 25, speed: 6.5 },
];

const GAME_WIDTH = 560, GAME_HEIGHT = 520, BLOCK_HEIGHT = 28, BASE_WIDTH = 330;

export default function App({ onExitGame }) {
  const [screen,setScreen]=useState("home"), [playerName,setPlayerName]=useState("");
  const [levelIndex,setLevelIndex]=useState(0), [score,setScore]=useState(0);
  const [combo,setCombo]=useState(0), [blocks,setBlocks]=useState([]);
  const [currentBlock,setCurrentBlock]=useState(null), [dropping,setDropping]=useState(false);
  const [message,setMessage]=useState("");
  const directionRef=useRef(1), rafRef=useRef(null);
  const audioCtxRef=useRef(null);
  const masterGainRef=useRef(null);

  const playStackSound=useCallback(()=>{
    try{
      const AudioContext=window.AudioContext||window.webkitAudioContext;
      if(!AudioContext) return;
      const ctx=audioCtxRef.current||new AudioContext();
      audioCtxRef.current=ctx;
      if(ctx.state==="suspended") ctx.resume();

      if(!masterGainRef.current){
        const master=ctx.createGain();
        master.gain.value=1.0;
        master.connect(ctx.destination);
        masterGainRef.current=master;
      }

      const now=ctx.currentTime;
      const osc=ctx.createOscillator();
      const gain=ctx.createGain();

      osc.type="triangle";
      osc.frequency.setValueAtTime(190,now);
      osc.frequency.exponentialRampToValueAtTime(100,now+0.14);

      gain.gain.setValueAtTime(0.0001,now);
      gain.gain.exponentialRampToValueAtTime(0.65,now+0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001,now+0.20);

      osc.connect(gain);
      gain.connect(masterGainRef.current);
      osc.start(now);
      osc.stop(now+0.21);
    }catch(e){}
  },[]);

  const level=LEVELS[levelIndex];

  const resetLevel=useCallback(()=>{
    const baseLeft=(GAME_WIDTH-BASE_WIDTH)/2;
    setBlocks([{left:baseLeft,width:BASE_WIDTH}]);
    setCurrentBlock({left:0,width:BASE_WIDTH});
    directionRef.current=1; setDropping(false); setCombo(0); setMessage("");
  },[]);

  useEffect(()=>{ if(screen==="playing") resetLevel(); },[screen,levelIndex,resetLevel]);

  useEffect(()=>{
    if(screen!=="playing"||dropping||!currentBlock) return;
    let last=performance.now();
    const tick=(now)=>{
      const delta=Math.min((now-last)/16.67,2); last=now;
      setCurrentBlock(prev=>{
        if(!prev) return prev;
        let left=prev.left+directionRef.current*level.speed*delta;
        const maxLeft=Math.max(0,GAME_WIDTH-prev.width);
        if(left<=0){left=0;directionRef.current=1;}
        if(left>=maxLeft){left=maxLeft;directionRef.current=-1;}
        return {...prev,left};
      });
      rafRef.current=requestAnimationFrame(tick);
    };
    rafRef.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(rafRef.current);
  },[screen,dropping,currentBlock,level.speed]);

  const dropBlock=useCallback(()=>{
    if(screen!=="playing"||dropping||!currentBlock) return;

    setDropping(true);

    const previous=blocks[blocks.length-1];
    const left=Math.max(currentBlock.left,previous.left);
    const right=Math.min(currentBlock.left+currentBlock.width,previous.left+previous.width);
    const overlap=right-left;

    if(overlap<=0){
      setMessage("MISS!");
      setTimeout(()=>setScreen("gameover"),450);
      return;
    }

    // Play the landing sound only after a valid stack/overlap is detected.
    playStackSound();

    const perfect=
      Math.abs(currentBlock.left-previous.left)<=7 &&
      Math.abs(
        (currentBlock.left+currentBlock.width)-
        (previous.left+previous.width)
      )<=7;

    const newBlock={left,width:overlap};
    const newBlocks=[...blocks,newBlock];

    setBlocks(newBlocks);
    setScore(s=>s+(perfect?25:10)+(perfect?combo*5:0));
    setCombo(c=>perfect?c+1:0);
    setMessage(perfect?"PERFECT!":"NICE STACK!");

    if(newBlocks.length>=level.target){
      setTimeout(()=>{
        setCurrentBlock(null);
        setScreen("complete");
      },600);
      return;
    }

    setTimeout(()=>{
      const d=directionRef.current;
      setCurrentBlock({
        left:d===1?0:GAME_WIDTH-overlap,
        width:overlap
      });
      setDropping(false);
      setMessage("");
    },320);
  },[
    screen,dropping,currentBlock,blocks,combo,level.target,playStackSound
  ]);

  useEffect(()=>{
    const key=e=>{
      if(screen==="playing"&&(e.code==="Space"||e.key==="Enter")){e.preventDefault();dropBlock();}
    };
    window.addEventListener("keydown",key); return()=>window.removeEventListener("keydown",key);
  },[screen,dropBlock]);

  const home=()=>{cancelAnimationFrame(rafRef.current);setScreen("home");setScore(0);setCombo(0);setBlocks([]);setCurrentBlock(null);};
  const startGame=()=>setScreen("name");
  const submitName=()=>{if(playerName.trim()){setLevelIndex(0);setScore(0);setScreen("intro");}};
  const retry=()=>{
    cancelAnimationFrame(rafRef.current);
    setScore(0);
    setCombo(0);
    setBlocks([]);
    setCurrentBlock(null);
    setDropping(false);
    setMessage("");
    setScreen("playing");
  };
  const nextLevel=()=>{if(levelIndex===9)setScreen("finished");else{setLevelIndex(v=>v+1);setScreen("intro");}};

  const page="min-h-screen bg-white text-slate-900 flex items-center justify-center p-4";
  const card="w-full max-w-5xl min-h-[650px] rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.12)]";

  if(screen==="home") return <div className="min-h-screen w-full overflow-hidden bg-[#fbfaff] text-slate-900">
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-white via-[#fcfbff] to-[#f0edff]">

      {/* reference-style background */}
      <div className="pointer-events-none absolute -left-16 top-[36%] h-[330px] w-[170px] rounded-r-[100px] bg-violet-200/45" />
      <div className="pointer-events-none absolute -right-16 bottom-[4%] h-[330px] w-[190px] rounded-l-[110px] bg-violet-200/40" />

      <div className="pointer-events-none absolute left-0 top-0 h-[210px] w-[90px] rounded-br-[100px] bg-violet-100/45" />
      <div className="pointer-events-none absolute right-0 top-0 h-[210px] w-[90px] rounded-bl-[100px] bg-violet-100/45" />

      {/* upper-right diagonal strokes */}
      <div className="pointer-events-none absolute -right-10 top-[80px] h-[240px] w-[250px] rotate-[39deg] opacity-75">
        <span className="absolute right-0 top-0 h-[3px] w-[220px] rounded-full bg-violet-300" />
        <span className="absolute right-0 top-[38px] h-[3px] w-[185px] rounded-full bg-violet-200" />
        <span className="absolute right-0 top-[76px] h-[3px] w-[220px] rounded-full bg-violet-400" />
        <span className="absolute right-0 top-[114px] h-[3px] w-[190px] rounded-full bg-violet-300" />
      </div>

      {/* lower-left diagonal strokes */}
      <div className="pointer-events-none absolute -left-12 bottom-[50px] h-[230px] w-[250px] -rotate-[42deg] opacity-70">
        <span className="absolute left-0 top-0 h-[3px] w-[220px] rounded-full bg-violet-300" />
        <span className="absolute left-0 top-[38px] h-[3px] w-[180px] rounded-full bg-violet-200" />
        <span className="absolute left-0 top-[76px] h-[3px] w-[220px] rounded-full bg-violet-400" />
        <span className="absolute left-0 top-[114px] h-[3px] w-[185px] rounded-full bg-violet-300" />
      </div>

      {/* dot grids */}
      <div className="pointer-events-none absolute left-[7.3%] top-[26%] hidden grid-cols-4 gap-[11px] lg:grid">
        {[...Array(16)].map((_,i)=><span key={i} className="h-[6px] w-[6px] rounded-full bg-violet-300/90" />)}
      </div>
      <div className="pointer-events-none absolute right-[7.5%] bottom-[25%] hidden grid-cols-4 gap-[11px] lg:grid">
        {[...Array(16)].map((_,i)=><span key={i} className="h-[6px] w-[6px] rounded-full bg-violet-300/90" />)}
      </div>

      {/* side chevrons */}
      <div className="pointer-events-none absolute left-[8.5%] top-[46%] hidden items-center text-[38px] font-black leading-none text-violet-300 lg:flex">
        <span>›</span><span>›</span><span>›</span><span>›</span>
      </div>
      <div className="pointer-events-none absolute right-[8.5%] top-[46%] hidden items-center text-[38px] font-black leading-none text-violet-300 lg:flex">
        <span>‹</span><span>‹</span><span>‹</span><span>‹</span>
      </div>

      {/* top controls */}
      <button type="button" className="absolute left-7 top-7 z-30 flex h-[84px] w-[82px] flex-col items-center justify-center rounded-2xl bg-white shadow-[0_8px_25px_rgba(76,29,149,0.10)] ring-1 ring-slate-100 transition hover:-translate-y-1">
        <span className="text-[30px] leading-none">🔊</span>
        <span className="mt-1 text-[11px] font-black tracking-wide text-violet-700">SOUND</span>
      </button>

      {onExitGame && (
        <button
          type="button"
          onClick={onExitGame}
          className="absolute left-32 top-7 z-30 flex h-[84px] px-5 flex-row items-center justify-center gap-2 rounded-2xl bg-white shadow-[0_8px_25px_rgba(76,29,149,0.10)] ring-1 ring-slate-100 transition hover:-translate-y-1 cursor-pointer font-black text-xs text-violet-700 uppercase"
        >
          <span>←</span>
          <span>Back to Games</span>
        </button>
      )}

      <button type="button" className="absolute right-7 top-7 z-30 flex h-[84px] w-[100px] flex-col items-center justify-center rounded-2xl bg-white shadow-[0_8px_25px_rgba(76,29,149,0.10)] ring-1 ring-slate-100 transition hover:-translate-y-1">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-violet-600 text-xl font-black text-violet-700">?</span>
        <span className="mt-1 text-[10px] font-black tracking-wide text-violet-700">HOW TO PLAY</span>
      </button>

      {/* main content */}
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col items-center px-5 pt-7 text-center">

        {/* Nebuloid Tech Studio logo */}
        <div className="flex h-[158px] items-center justify-center">
          <img src="/logo.png" alt="Nebuloid Tech Studio" className="h-[145px] w-auto max-w-[290px] object-contain" />
        </div>

        <div className="mt-1 text-[13px] font-black tracking-[0.52em] text-violet-600 md:text-[15px]">
          BRAIN <span className="mx-2">•</span> AUDIO <span className="mx-2">•</span> MEMORY
        </div>

        <h1 className="mt-5 text-[62px] font-black leading-[0.92] tracking-[-0.055em] sm:text-[78px] md:text-[98px] lg:text-[108px]">
          <span className="text-[#071225]">STACK </span>
          <span className="bg-gradient-to-r from-violet-600 via-[#7138e8] to-indigo-500 bg-clip-text text-transparent">
            MASTER
          </span>
        </h1>

        <div className="mt-7 flex items-center justify-center gap-5 text-[15px] font-medium text-slate-500 md:text-[19px]">
          <span className="h-[2px] w-10 bg-violet-500 md:w-12" />
          <span>Build the tallest tower by accurately stacking moving blocks.</span>
          <span className="h-[2px] w-10 bg-violet-500 md:w-12" />
        </div>

        {/* straight tower: widest at bottom, narrowest at top */}
        <div className="relative mt-4 h-[226px] w-[440px]">
          <div className="absolute bottom-[1px] left-1/2 h-[70px] w-[390px] -translate-x-1/2 rounded-[50%] border border-violet-200/70" />
          <div className="absolute bottom-[4px] left-1/2 h-[45px] w-[330px] -translate-x-1/2 rounded-[50%] bg-violet-300/20 blur-xl" />

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col-reverse items-center gap-[2px]">
            {[
              ["w-[278px]","from-indigo-700 to-blue-600"],
              ["w-[255px]","from-blue-700 to-indigo-600"],
              ["w-[232px]","from-violet-700 to-blue-600"],
              ["w-[209px]","from-indigo-600 to-violet-600"],
              ["w-[186px]","from-violet-600 to-indigo-600"],
              ["w-[163px]","from-blue-500 to-violet-600"],
              ["w-[140px]","from-cyan-400 to-blue-500"],
            ].map(([width,gradient],i)=>(
              <div
                key={i}
                className={`${width} h-[27px] rounded-[5px] border border-white/80 bg-gradient-to-r ${gradient} shadow-[0_7px_12px_rgba(67,56,202,0.22)]`}
              />
            ))}
          </div>
        </div>

        {/* reference-style purple CTA */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={startGame}
            className="mt-0 flex h-[86px] min-w-[425px] items-center justify-center gap-5 rounded-2xl bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 px-12 text-[23px] font-black text-white shadow-[0_14px_32px_rgba(109,40,217,0.30)] transition hover:-translate-y-1 hover:shadow-[0_19px_42px_rgba(109,40,217,0.38)] active:scale-[0.98] cursor-pointer"
          >
            <span className="text-[27px]">▶</span>
            START GAME
          </button>

          {onExitGame && (
            <button
              type="button"
              onClick={onExitGame}
              className="py-3 px-8 rounded-xl border-2 border-violet-200 bg-white hover:bg-violet-50 text-violet-800 font-bold text-sm uppercase transition cursor-pointer"
            >
              ← Exit to Games List
            </button>
          )}
        </div>

        {/* bottom features */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-7 pb-7 text-[16px] text-slate-500 md:gap-9 md:text-[17px]">
          <div className="flex items-center gap-3">
            <span className="text-[29px] font-light text-violet-600">▥</span>
            <span>10 Levels</span>
          </div>
          <span className="hidden h-8 w-px bg-violet-200 md:block" />
          <div className="flex items-center gap-3">
            <span className="text-[29px] text-violet-600">♙</span>
            <span>Certificates</span>
          </div>
          <span className="hidden h-8 w-px bg-violet-200 md:block" />
          <div className="flex items-center gap-3">
            <span className="text-[30px] text-violet-600">◎</span>
            <span>Precision Stacking</span>
          </div>
        </div>
      </main>
    </div>
  </div>

  if(screen==="name") return <div className="min-h-screen w-full overflow-hidden bg-[#fafaff] text-slate-900">
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-white via-[#fbfaff] to-[#f0edff]">

      {/* soft reference background */}
      <div className="pointer-events-none absolute -left-24 top-[38%] h-80 w-80 rounded-[100px] bg-violet-200/45 rotate-12" />
      <div className="pointer-events-none absolute -right-24 bottom-[8%] h-80 w-80 rounded-[100px] bg-violet-200/45 -rotate-12" />
      <div className="pointer-events-none absolute left-0 top-0 h-64 w-28 rounded-br-[100px] bg-violet-100/50" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-28 rounded-tl-[100px] bg-violet-100/50" />

      {/* decorative diagonals */}
      <div className="pointer-events-none absolute right-[-10px] top-[-10px] h-56 w-64 rotate-[42deg] opacity-70">
        <span className="absolute right-0 top-0 h-[3px] w-56 rounded-full bg-violet-300" />
        <span className="absolute right-0 top-12 h-[3px] w-48 rounded-full bg-violet-200" />
        <span className="absolute right-0 top-24 h-[3px] w-56 rounded-full bg-violet-400" />
      </div>
      <div className="pointer-events-none absolute bottom-[-10px] left-[-10px] h-56 w-64 -rotate-[42deg] opacity-60">
        <span className="absolute left-0 top-0 h-[3px] w-56 rounded-full bg-violet-300" />
        <span className="absolute left-0 top-12 h-[3px] w-48 rounded-full bg-violet-200" />
        <span className="absolute left-0 top-24 h-[3px] w-56 rounded-full bg-violet-400" />
      </div>

      {/* dot patterns */}
      <div className="pointer-events-none absolute left-[7%] top-[28%] hidden grid-cols-4 gap-3 md:grid">
        {[...Array(16)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-300" />)}
      </div>
      <div className="pointer-events-none absolute right-[8%] bottom-[27%] hidden grid-cols-4 gap-3 md:grid">
        {[...Array(16)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-300" />)}
      </div>

      {/* side controls */}
      <button type="button" className="absolute left-7 top-7 z-30 flex h-[88px] w-[92px] flex-col items-center justify-center rounded-2xl bg-white/95 text-violet-700 shadow-[0_10px_30px_rgba(76,29,149,0.12)] ring-1 ring-slate-100">
        <span className="text-[32px] leading-none">🔊</span>
        <span className="mt-1 text-[11px] font-black">SOUND</span>
      </button>
      <button type="button" className="absolute right-7 top-7 z-30 flex h-[88px] w-[118px] flex-col items-center justify-center rounded-2xl bg-white/95 text-violet-700 shadow-[0_10px_30px_rgba(76,29,149,0.12)] ring-1 ring-slate-100">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-violet-600 text-xl font-black">?</span>
        <span className="mt-1 text-[10px] font-black">HOW TO PLAY</span>
      </button>

      {/* side 3D block decorations */}
      <div className="pointer-events-none absolute left-[7%] bottom-[18%] hidden h-[230px] w-[190px] lg:block">
        <div className="absolute bottom-5 left-8 h-20 w-20 border border-violet-300/60 bg-violet-100/20 rotate-[30deg] skew-y-[-8deg]" />
        <div className="absolute bottom-16 left-16 h-20 w-20 border border-violet-300/70 bg-violet-300/25 rotate-[30deg] skew-y-[-8deg]" />
        <div className="absolute bottom-28 left-20 h-20 w-20 border border-violet-400/70 bg-violet-500/50 rotate-[30deg] skew-y-[-8deg] shadow-[0_10px_25px_rgba(124,58,237,0.18)]" />
      </div>
      <div className="pointer-events-none absolute right-[7%] bottom-[18%] hidden h-[230px] w-[190px] lg:block">
        <div className="absolute bottom-5 right-8 h-20 w-20 border border-violet-300/60 bg-violet-100/20 rotate-[30deg] skew-y-[-8deg]" />
        <div className="absolute bottom-16 right-16 h-20 w-20 border border-violet-300/70 bg-violet-300/25 rotate-[30deg] skew-y-[-8deg]" />
        <div className="absolute bottom-28 right-20 h-20 w-20 border border-violet-400/70 bg-violet-500/50 rotate-[30deg] skew-y-[-8deg] shadow-[0_10px_25px_rgba(124,58,237,0.18)]" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col items-center px-5 pt-7 text-center">

        {/* logo */}
        <div className="flex h-[158px] items-center justify-center">
          <img src="/logo.png" alt="Nebuloid Tech Studio" className="h-[145px] w-auto max-w-[290px] object-contain" />
        </div>

        {/* section label */}
        <div className="mt-2 flex items-center gap-5 text-[13px] font-black tracking-[0.48em] text-violet-600 md:text-[16px]">
          <span className="h-[2px] w-12 bg-violet-300" />
          <span>PLAYER SETUP</span>
          <span className="h-[2px] w-12 bg-violet-300" />
        </div>

        {/* title */}
        <h1 className="mt-7 text-[54px] font-black leading-none tracking-[-0.045em] sm:text-[66px] md:text-[82px]">
          <span className="text-[#071225]">ENTER YOUR </span>
          <span className="bg-gradient-to-r from-violet-600 via-[#7138e8] to-indigo-500 bg-clip-text text-transparent">NAME</span>
        </h1>

        <p className="mt-5 text-[18px] font-medium text-slate-500 md:text-[22px]">
          Your name will appear on every certificate.
        </p>

        {/* name input */}
        <div className="mt-8 flex w-full max-w-[645px] items-center rounded-[22px] border-2 border-violet-300 bg-white/90 px-6 py-3 shadow-[0_8px_25px_rgba(109,40,217,0.10)] focus-within:border-violet-500 focus-within:shadow-[0_10px_30px_rgba(109,40,217,0.18)]">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-2xl text-violet-600">♟</div>
          <input
            autoFocus
            value={playerName}
            onChange={e=>setPlayerName(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&submitName()}
            placeholder="Enter your name"
            maxLength={30}
            className="ml-5 w-full bg-transparent px-1 text-[22px] font-medium text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* continue */}
        <button
          onClick={submitName}
          disabled={!playerName.trim()}
          className="mt-7 flex h-[88px] w-full max-w-[645px] items-center justify-center gap-5 rounded-[20px] bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 text-[24px] font-black text-white shadow-[0_14px_32px_rgba(109,40,217,0.30)] transition hover:-translate-y-1 hover:shadow-[0_19px_42px_rgba(109,40,217,0.38)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span className="text-[30px]">›</span>
          CONTINUE
        </button>

        {/* back */}
        <button onClick={home} className="mt-8 text-[20px] font-semibold text-slate-500 transition hover:text-violet-700">
          ← &nbsp; Back
        </button>
      </main>
    </div>
  </div>;

  if(screen==="intro") return <div className="min-h-screen w-full overflow-hidden bg-[#fafaff] text-slate-900">
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-white via-[#fbfaff] to-[#f0edff]">

      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none absolute -left-20 top-[38%] h-72 w-72 rounded-[90px] bg-violet-200/45 rotate-12" />
      <div className="pointer-events-none absolute -right-24 bottom-[12%] h-72 w-72 rounded-[90px] bg-violet-200/45 -rotate-12" />
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-32 -translate-x-14 rounded-r-[100px] bg-violet-100/55" />
      <div className="pointer-events-none absolute right-0 top-[26%] h-72 w-32 translate-x-14 rounded-l-[100px] bg-violet-100/55" />

      {/* TOP RIGHT DIAGONALS */}
      <div className="pointer-events-none absolute right-[-15px] top-[-5px] h-44 w-64 rotate-[40deg] opacity-65">
        <span className="absolute right-0 top-0 h-[3px] w-56 rounded-full bg-violet-300" />
        <span className="absolute right-0 top-12 h-[3px] w-48 rounded-full bg-violet-400" />
        <span className="absolute right-0 top-24 h-[3px] w-56 rounded-full bg-violet-300" />
      </div>

      {/* LEFT / BOTTOM DIAGONALS */}
      <div className="pointer-events-none absolute bottom-[-5px] left-[-15px] h-44 w-64 -rotate-[40deg] opacity-60">
        <span className="absolute left-0 top-0 h-[3px] w-56 rounded-full bg-violet-300" />
        <span className="absolute left-0 top-12 h-[3px] w-48 rounded-full bg-violet-400" />
        <span className="absolute left-0 top-24 h-[3px] w-56 rounded-full bg-violet-300" />
      </div>

      {/* DOT GROUPS */}
      <div className="pointer-events-none absolute left-[16%] top-[16%] hidden grid-cols-4 gap-3 md:grid">
        {[...Array(16)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-200" />)}
      </div>
      <div className="pointer-events-none absolute left-[9%] bottom-[9%] hidden grid-cols-5 gap-3 md:grid">
        {[...Array(20)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-300" />)}
      </div>
      <div className="pointer-events-none absolute right-[16%] top-[4%] hidden grid-cols-5 gap-3 md:grid">
        {[...Array(20)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-200" />)}
      </div>
      <div className="pointer-events-none absolute right-[8%] bottom-[9%] hidden grid-cols-5 gap-3 md:grid">
        {[...Array(20)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-200" />)}
      </div>

      {/* SMALL DECORATIVE STARS */}
      <span className="pointer-events-none absolute left-[15%] top-[58%] text-3xl text-violet-400">✦</span>
      <span className="pointer-events-none absolute right-[22%] top-[67%] text-3xl text-violet-400">✦</span>

      {/* SIDE CIRCLES / CIRCUIT DETAILS */}
      <div className="pointer-events-none absolute left-[8%] top-[35%] hidden h-4 w-4 rounded-full border-2 border-cyan-300 lg:block" />
      <div className="pointer-events-none absolute right-[12%] top-[43%] hidden h-4 w-4 rounded-full border-2 border-fuchsia-300 lg:block" />
      <div className="pointer-events-none absolute right-[20%] top-[12%] hidden h-4 w-4 rounded-full border-2 border-fuchsia-300 lg:block" />

      {/* TOP CONTROLS */}
      <button type="button" className="absolute left-7 top-7 z-30 flex h-[88px] w-[92px] flex-col items-center justify-center rounded-2xl bg-white/95 text-violet-700 shadow-[0_10px_30px_rgba(76,29,149,0.12)] ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl">
        <span className="text-[32px] leading-none">🔊</span>
        <span className="mt-1 text-[11px] font-black">SOUND</span>
      </button>

      <button type="button" className="absolute right-7 top-7 z-30 flex h-[88px] w-[118px] flex-col items-center justify-center rounded-2xl bg-white/95 text-violet-700 shadow-[0_10px_30px_rgba(76,29,149,0.12)] ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-violet-600 text-xl font-black">?</span>
        <span className="mt-1 text-[10px] font-black">HOW TO PLAY</span>
      </button>

      {/* CONTENT */}
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col items-center px-5 pt-7 text-center">

        {/* LOGO */}
        <div className="flex h-[150px] items-center justify-center">
          <img src="/logo.png" alt="Nebuloid Tech Studio" className="h-[138px] w-auto max-w-[280px] object-contain" />
        </div>

        {/* SECTION LABEL */}
        <div className="mt-2 flex items-center gap-5 text-[13px] font-black tracking-[0.48em] text-violet-600 md:text-[16px]">
          <span className="h-[2px] w-12 bg-violet-300" />
          <span>◆ &nbsp; STACK MASTER &nbsp; ◆</span>
          <span className="h-[2px] w-12 bg-violet-300" />
        </div>

        {/* LEVEL TITLE */}
        <h1 className="mt-8 text-[72px] font-black leading-none tracking-[-0.045em] sm:text-[86px] md:text-[108px] lg:text-[120px]">
          <span className="text-[#081225]">LEVEL </span>
          <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">{level.level}</span>
        </h1>

        {/* SUBTITLE */}
        <div className="mt-6 flex items-center justify-center gap-5 text-[18px] font-semibold text-slate-500 md:text-[25px]">
          <span className="h-[2px] w-12 bg-violet-300" />
          <span>Stack {level.target} blocks</span>
          <span className="h-[2px] w-12 bg-violet-300" />
        </div>

        {/* INFO CARDS */}
        <div className="mt-9 grid w-full max-w-[620px] grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex h-[142px] items-center gap-5 rounded-2xl border border-violet-200/80 bg-white/90 px-6 text-left shadow-[0_8px_25px_rgba(109,40,217,0.08)]">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-4xl text-violet-600">◎</div>
            <div>
              <div className="text-lg font-black text-violet-600 md:text-xl">TARGET</div>
              <div className="mt-1 text-5xl font-black text-[#081225]">{level.target}</div>
            </div>
          </div>

          <div className="flex h-[142px] items-center gap-5 rounded-2xl border border-blue-200/80 bg-white/90 px-6 text-left shadow-[0_8px_25px_rgba(37,99,235,0.08)]">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-4xl text-blue-600">◔</div>
            <div>
              <div className="text-lg font-black text-blue-500 md:text-xl">SPEED</div>
              <div className="mt-1 text-5xl font-black text-[#081225]">{level.speed.toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* START LEVEL */}
        <button
          type="button"
          onClick={()=>setScreen("playing")}
          className="mt-10 flex min-w-[455px] items-center justify-center gap-5 rounded-2xl bg-[#101a3d] px-12 py-[21px] text-[23px] font-black text-white shadow-[0_14px_30px_rgba(76,29,149,0.25)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(76,29,149,0.32)] active:scale-[0.98]"
        >
          <span className="text-3xl text-violet-500">▶</span>
          START LEVEL
        </button>
      </main>
    </div>
  </div>

  if(screen==="playing") return <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#fafaff] text-slate-900">
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-white via-[#fbfaff] to-[#f0edff]">

      {/* SOFT SIDE SHAPES */}
      <div className="pointer-events-none absolute -left-28 top-[38%] h-72 w-72 rounded-[100px] bg-violet-200/45 rotate-12" />
      <div className="pointer-events-none absolute -right-28 bottom-[8%] h-80 w-80 rounded-[100px] bg-violet-200/45 -rotate-12" />

      {/* DOT PATTERNS */}
      <div className="pointer-events-none absolute left-[5.5%] top-[27%] hidden grid-cols-4 gap-3 lg:grid">
        {[...Array(16)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-300" />)}
      </div>
      <div className="pointer-events-none absolute right-[9%] top-[60%] hidden grid-cols-4 gap-3 lg:grid">
        {[...Array(16)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-300" />)}
      </div>

      {/* DECORATIVE DIAGONALS */}
      <div className="pointer-events-none absolute right-[-20px] top-[105px] h-48 w-56 rotate-[43deg] opacity-70">
        <span className="absolute right-0 top-0 h-[2px] w-52 bg-violet-400" />
        <span className="absolute right-0 top-12 h-[2px] w-52 bg-violet-300" />
        <span className="absolute right-0 top-24 h-[2px] w-52 bg-violet-400" />
      </div>
      <div className="pointer-events-none absolute bottom-[-10px] left-[-20px] h-48 w-56 -rotate-[43deg] opacity-60">
        <span className="absolute left-0 top-0 h-[2px] w-52 bg-violet-400" />
        <span className="absolute left-0 top-12 h-[2px] w-52 bg-violet-300" />
        <span className="absolute left-0 top-24 h-[2px] w-52 bg-violet-400" />
      </div>

      {/* TOP CONTROLS */}
      <button type="button" className="absolute left-6 top-6 z-30 flex h-[88px] w-[98px] flex-col items-center justify-center rounded-2xl bg-white/95 text-violet-700 shadow-[0_10px_30px_rgba(76,29,149,0.12)] ring-1 ring-slate-100">
        <span className="text-[32px] leading-none">🔊</span>
        <span className="mt-1 text-[11px] font-black">SOUND</span>
        <span className="text-[8px] font-black text-violet-500">100%</span>
      </button>

      <button type="button" className="absolute right-6 top-6 z-30 flex h-[88px] w-[108px] flex-col items-center justify-center rounded-2xl bg-white/95 text-violet-700 shadow-[0_10px_30px_rgba(76,29,149,0.12)] ring-1 ring-slate-100">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-violet-600 text-xl font-black">?</span>
        <span className="mt-1 text-[10px] font-black">HOW TO PLAY</span>
      </button>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1450px] flex-col items-center px-5 pt-4 text-center">

        {/* LOGO */}
        <div className="flex h-[116px] items-center justify-center">
          <img src="/logo.png" alt="Nebuloid Tech Studio" className="h-[112px] w-auto max-w-[240px] object-contain" />
        </div>

        {/* GAME TITLE */}
        <div className="mt-1 flex items-center gap-6">
          <span className="hidden h-1 w-14 rounded-full bg-violet-300 sm:block" />
          <h1 className="text-[45px] font-black tracking-[-0.04em] sm:text-[58px] md:text-[66px]">
            <span className="text-[#081225]">STACK </span>
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">MASTER</span>
          </h1>
          <span className="hidden h-1 w-14 rounded-full bg-violet-300 sm:block" />
        </div>

        {/* STATS BAR */}
        <div className="mt-4 flex w-full max-w-[1030px] items-center justify-between rounded-[22px] border border-violet-200/70 bg-white/90 px-8 py-4 shadow-[0_10px_35px_rgba(76,29,149,0.10)] md:px-10">
          <div className="flex flex-1 items-center justify-center gap-4 text-left">
            <div className="text-4xl text-violet-600">▰</div>
            <div>
              <div className="text-[14px] font-black text-violet-600">LEVEL</div>
              <div className="text-[25px] font-black">{level.level} / 10</div>
            </div>
          </div>
          <div className="h-12 w-px bg-violet-200" />
          <div className="flex flex-1 items-center justify-center gap-4 text-left">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100 text-3xl text-violet-600">★</div>
            <div>
              <div className="text-[14px] font-black text-violet-600">SCORE</div>
              <div className="text-[25px] font-black">{score}</div>
            </div>
          </div>
          <div className="h-12 w-px bg-violet-200" />
          <div className="flex flex-1 items-center justify-center gap-4 text-left">
            <div className="text-4xl text-violet-600">▥</div>
            <div>
              <div className="text-[14px] font-black text-violet-600">HEIGHT</div>
              <div className="text-[25px] font-black">{blocks.length-1} / {level.target-1}</div>
            </div>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mt-4 w-full max-w-[1030px]">
          <div className="mb-2 flex justify-between text-[15px] font-black text-violet-600">
            <span>PROGRESS</span>
            <span>{blocks.length-1} / {level.target-1}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-700 to-indigo-500 transition-all duration-300"
              style={{width:`${Math.min(100,((blocks.length-1)/(level.target-1))*100)}%`}}
            />
          </div>
        </div>

        {/* GAME BOARD */}
        <div className="mt-5 w-full max-w-[1180px] px-2 sm:px-3">
          <div
            className="relative mx-auto overflow-hidden rounded-[22px] border-2 border-violet-400/80 bg-white/65 shadow-[0_12px_40px_rgba(76,29,149,0.08)]"
            style={{
              width:"100%",
              height:`${Math.max(420, Math.min(760, (level.target + 2) * BLOCK_HEIGHT + 70))}px`,
              maxWidth:"1180px"
            }}
          >
            <div
              className="absolute inset-0 opacity-55"
              style={{
                backgroundImage:"linear-gradient(#dfe3ee 1px, transparent 1px), linear-gradient(90deg, #dfe3ee 1px, transparent 1px)",
                backgroundSize:"28px 28px"
              }}
            />

            {blocks.map((b,i)=>
              <div
                key={i}
                className="absolute h-7 rounded-md border border-white/80 bg-gradient-to-r from-cyan-400 to-blue-600 shadow-[0_5px_12px_rgba(37,99,235,0.22)]"
                style={{
                  left:`${b.left/GAME_WIDTH*100}%`,
                  width:`${b.width/GAME_WIDTH*100}%`,
                  bottom:i*BLOCK_HEIGHT+18
                }}
              />
            )}

            {currentBlock&&
              <div
                className={`absolute h-7 rounded-md border border-white/80 bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-600 shadow-[0_6px_14px_rgba(236,72,153,0.25)] ${dropping?"transition-all duration-500 ease-in":""}`}
                style={{
                  left:`${currentBlock.left/GAME_WIDTH*100}%`,
                  width:`${currentBlock.width/GAME_WIDTH*100}%`,
                  bottom:dropping?blocks.length*BLOCK_HEIGHT+18:blocks.length*BLOCK_HEIGHT+88
                }}
              />
            }

            <div
              className="absolute bottom-0 h-[18px] rounded-t-md bg-[#0a1735]"
              style={{
                left:`${((GAME_WIDTH-BASE_WIDTH)/2/GAME_WIDTH)*100}%`,
                width:`${BASE_WIDTH/GAME_WIDTH*100}%`
              }}
            />

            {message&&
              <div className="absolute left-0 right-0 top-7 text-center text-2xl font-black text-violet-600">
                {message}
              </div>
            }
          </div>
        </div>

        {/* INSTRUCTION */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[16px] font-bold text-slate-500 md:text-[18px]">
          <span className="text-2xl text-violet-600">♧</span>
          <span>Block moves automatically</span>
          <span className="text-violet-500">•</span>
          <span>Click / Tap / Space to drop</span>
        </div>

        {/* STACK BUTTON */}
        <button
          onClick={dropBlock}
          disabled={dropping}
          className="mt-4 flex min-w-[315px] items-center justify-center gap-5 rounded-2xl bg-gradient-to-r from-indigo-800 via-violet-800 to-indigo-700 px-12 py-4 text-[23px] font-black text-white shadow-[0_12px_28px_rgba(76,29,149,0.28)] transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(76,29,149,0.35)] active:scale-95 disabled:opacity-30"
        >
          <span className="text-3xl">▰</span>
          STACK
        </button>

        {combo>0&&<div className="mt-2 text-sm font-black text-orange-500">COMBO ×{combo}</div>}
      </main>
    </div>
  </div>

  if(screen==="gameover") return <div className="min-h-screen w-full overflow-hidden bg-[#fafaff] text-slate-900">
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-white via-[#fcfbff] to-[#f0edff]">

      {/* same outer game UI */}
      <div className="pointer-events-none absolute left-0 top-0 h-[240px] w-[110px] rounded-br-[120px] bg-violet-100/55" />
      <div className="pointer-events-none absolute right-0 top-0 h-[240px] w-[110px] rounded-bl-[120px] bg-violet-100/55" />
      <div className="pointer-events-none absolute -left-16 bottom-[7%] h-[330px] w-[180px] rounded-r-[110px] bg-violet-200/45" />
      <div className="pointer-events-none absolute -right-16 bottom-[7%] h-[330px] w-[190px] rounded-l-[110px] bg-violet-200/45" />

      {/* diagonal lines */}
      <div className="pointer-events-none absolute -right-8 top-[90px] h-[220px] w-[250px] rotate-[39deg] opacity-70">
        <span className="absolute right-0 top-0 h-[3px] w-[220px] rounded-full bg-violet-300" />
        <span className="absolute right-0 top-[38px] h-[3px] w-[185px] rounded-full bg-violet-200" />
        <span className="absolute right-0 top-[76px] h-[3px] w-[220px] rounded-full bg-violet-400" />
      </div>
      <div className="pointer-events-none absolute -left-10 bottom-[70px] h-[220px] w-[250px] -rotate-[42deg] opacity-65">
        <span className="absolute left-0 top-0 h-[3px] w-[220px] rounded-full bg-violet-300" />
        <span className="absolute left-0 top-[38px] h-[3px] w-[180px] rounded-full bg-violet-200" />
        <span className="absolute left-0 top-[76px] h-[3px] w-[220px] rounded-full bg-violet-400" />
      </div>

      {/* dots */}
      <div className="pointer-events-none absolute left-[5.5%] top-[32%] hidden grid-cols-4 gap-3 lg:grid">
        {[...Array(16)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-300" />)}
      </div>
      <div className="pointer-events-none absolute right-[5.5%] top-[57%] hidden grid-cols-4 gap-3 lg:grid">
        {[...Array(16)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-300" />)}
      </div>

      {/* side 3D stack decorations */}
      <div className="pointer-events-none absolute left-[6%] bottom-[19%] hidden h-[210px] w-[170px] lg:block opacity-65">
        <div className="absolute bottom-4 left-5 h-16 w-16 border border-violet-300/70 bg-violet-100/30 rotate-[30deg] skew-y-[-8deg]" />
        <div className="absolute bottom-12 left-12 h-16 w-16 border border-violet-300/80 bg-violet-300/25 rotate-[30deg] skew-y-[-8deg]" />
        <div className="absolute bottom-20 left-20 h-16 w-16 border border-violet-400/80 bg-violet-500/45 rotate-[30deg] skew-y-[-8deg]" />
      </div>
      <div className="pointer-events-none absolute right-[6%] bottom-[19%] hidden h-[210px] w-[170px] lg:block opacity-65">
        <div className="absolute bottom-4 right-5 h-16 w-16 border border-violet-300/70 bg-violet-100/30 rotate-[30deg] skew-y-[-8deg]" />
        <div className="absolute bottom-12 right-12 h-16 w-16 border border-violet-300/80 bg-violet-300/25 rotate-[30deg] skew-y-[-8deg]" />
        <div className="absolute bottom-20 right-20 h-16 w-16 border border-violet-400/80 bg-violet-500/45 rotate-[30deg] skew-y-[-8deg]" />
      </div>

      {/* OUTER TOP CONTROLS */}
      <button
        type="button"
        className="absolute left-7 top-7 z-30 flex h-[88px] w-[92px] flex-col items-center justify-center rounded-2xl bg-white/95 text-violet-700 shadow-[0_10px_30px_rgba(76,29,149,0.12)] ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl"
      >
        <span className="text-[32px] leading-none">🔊</span>
        <span className="mt-1 text-[11px] font-black">SOUND</span>
      </button>

      <button
        type="button"
        className="absolute right-7 top-7 z-30 flex h-[88px] w-[118px] flex-col items-center justify-center rounded-2xl bg-white/95 text-violet-700 shadow-[0_10px_30px_rgba(76,29,149,0.12)] ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-violet-600 text-xl font-black">?</span>
        <span className="mt-1 text-[10px] font-black">HOW TO PLAY</span>
      </button>

      {/* GAME OVER CARD */}
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] items-center justify-center px-5 py-8">
        <div className="relative w-full max-w-[1120px] overflow-hidden rounded-[26px] border border-violet-200 bg-white/95 shadow-[0_22px_70px_rgba(76,29,149,0.16)]">

          <div className="pointer-events-none absolute inset-3 rounded-[20px] border border-violet-300/80" />
          <div className="pointer-events-none absolute inset-5 rounded-[17px] border border-violet-100" />

          <div className="relative z-10 flex flex-col items-center px-8 py-8 text-center md:px-14 md:py-9">

            <img src="/logo.png" alt="Nebuloid Tech Studio" className="h-[82px] w-auto max-w-[190px] object-contain md:h-[94px]" />

            <div className="mt-3 flex items-center gap-4 text-[12px] font-black tracking-[0.27em] text-rose-500 md:text-[15px]">
              <span className="h-[2px] w-11 bg-rose-200 md:w-14" />
              <span>TOWER COLLAPSED</span>
              <span className="h-[2px] w-11 bg-rose-200 md:w-14" />
            </div>

            <h1 className="mt-2 text-[46px] font-black leading-none tracking-tight text-[#0b1230] md:text-[66px]">
              GAME OVER
            </h1>

            <p className="mt-3 text-[15px] font-medium text-slate-600 md:text-[19px]">
              You missed the previous block.
            </p>

            <div className="mt-6 grid w-full max-w-[650px] grid-cols-2 gap-5">
              <div className="rounded-2xl border border-violet-200 bg-white px-6 py-5 shadow-[0_8px_25px_rgba(76,29,149,0.06)]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-[27px] text-violet-700">★</div>
                <div className="mt-3 text-[13px] font-black tracking-wide text-violet-600">SCORE</div>
                <div className="mt-1 text-[38px] font-black leading-none text-[#0b1230] md:text-[44px]">{score}</div>
              </div>

              <div className="rounded-2xl border border-violet-200 bg-white px-6 py-5 shadow-[0_8px_25px_rgba(76,29,149,0.06)]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-[27px] font-black text-violet-700">▥</div>
                <div className="mt-3 text-[13px] font-black tracking-wide text-violet-600">HEIGHT</div>
                <div className="mt-1 text-[38px] font-black leading-none text-[#0b1230] md:text-[44px]">{blocks.length}</div>
              </div>
            </div>

            <div className="mt-6 grid w-full max-w-[650px] grid-cols-2 gap-5">
              <button
                onClick={retry}
                className="flex items-center justify-center gap-3 rounded-xl bg-[#11163f] px-6 py-4 text-[16px] font-black text-white shadow-[0_8px_25px_rgba(17,22,63,0.18)] transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                ↻ RETRY LEVEL
              </button>
              <button
                onClick={home}
                className="flex items-center justify-center gap-3 rounded-xl border-2 border-violet-300 bg-white px-6 py-4 text-[16px] font-black text-[#11163f] shadow-sm transition hover:-translate-y-0.5 hover:border-violet-500"
              >
                ⌂ HOME
              </button>
            </div>

            <div className="mt-6 flex items-center gap-4 text-violet-500">
              <span className="h-[2px] w-24 bg-violet-200" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="h-3 w-7 -skew-x-12 rounded-sm bg-violet-500" />
                <span className="h-3 w-7 -skew-x-12 rounded-sm bg-indigo-500" />
                <span className="h-3 w-7 -skew-x-12 rounded-sm bg-violet-600" />
              </div>
              <span className="h-[2px] w-24 bg-violet-200" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>;

  if(screen==="complete") return <div className="min-h-screen w-full overflow-auto bg-gradient-to-br from-[#f4f1ff] via-white to-[#eeebff] px-4 py-7 text-slate-900 print:bg-white print:p-0">
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-[1450px] flex-col items-center justify-center print:min-h-0">

      {/* CERTIFICATE SHEET */}
      <div id="certificate-sheet" className="relative w-full max-w-[1240px] overflow-hidden rounded-[18px] border-[3px] border-violet-700 bg-white shadow-[0_20px_65px_rgba(50,35,110,0.20)] print:max-w-none print:rounded-none print:border-[3px] print:shadow-none">

        {/* layered border */}
        <div className="pointer-events-none absolute inset-[9px] rounded-[11px] border border-violet-300" />
        <div className="pointer-events-none absolute inset-[15px] rounded-[7px] border border-violet-100" />

        {/* corner ornaments */}
        <div className="pointer-events-none absolute left-0 top-0 h-24 w-24 bg-gradient-to-br from-violet-700 to-violet-500 [clip-path:polygon(0 0,100% 0,0 100%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-violet-700 to-violet-500 [clip-path:polygon(100% 0,100% 100%,0 0)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 bg-gradient-to-tr from-violet-700 to-violet-500 [clip-path:polygon(0 100%,100% 100%,0 0)]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 bg-gradient-to-tl from-violet-700 to-violet-500 [clip-path:polygon(100% 100%,100% 0,0 100%)]" />

        {/* subtle side decorations */}
        <div className="pointer-events-none absolute left-[7%] top-[23%] hidden opacity-60 lg:block">
          <div className="h-4 w-12 rounded bg-violet-200" />
          <div className="mt-1 h-4 w-20 rounded bg-violet-100" />
          <div className="mt-1 h-4 w-14 rounded bg-violet-200" />
          <div className="ml-7 mt-1 h-4 w-16 rounded bg-violet-100" />
        </div>
        <div className="pointer-events-none absolute right-[7%] top-[24%] hidden opacity-60 lg:block">
          <div className="h-4 w-20 rounded bg-violet-100" />
          <div className="ml-6 mt-1 h-4 w-14 rounded bg-violet-200" />
          <div className="mt-1 h-4 w-16 rounded bg-violet-100" />
        </div>

        <div className="pointer-events-none absolute left-[4%] top-[43%] hidden grid-cols-4 gap-2 lg:grid">
          {[...Array(16)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-300/70" />)}
        </div>
        <div className="pointer-events-none absolute right-[4%] top-[48%] hidden grid-cols-4 gap-2 lg:grid">
          {[...Array(16)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-300/70" />)}
        </div>

        {/* certificate content — normal flow, no absolute stacking */}
        <div className="relative z-10 px-[8%] pb-7 pt-7 sm:px-[9%] md:pb-8 md:pt-8">

          {/* logo */}
          <div className="flex justify-center">
            <img src="/logo.png" alt="Nebuloid Tech Studio" className="h-[76px] w-auto max-w-[190px] object-contain sm:h-[86px] md:h-[94px]" />
          </div>

          {/* title */}
          <div className="mt-3 text-center">
            <h1 className="text-[39px] font-black leading-none tracking-[0.01em] text-[#081225] sm:text-[48px] md:text-[58px]">
              CERTIFICATE
            </h1>
            <div className="mt-2 flex items-center justify-center gap-4 text-[12px] font-black tracking-[0.28em] text-violet-700 sm:text-[15px] md:text-[18px]">
              <span className="h-[2px] w-11 bg-violet-300 sm:w-14" />
              <span>OF ACHIEVEMENT</span>
              <span className="h-[2px] w-11 bg-violet-300 sm:w-14" />
            </div>
          </div>

          {/* recipient */}
          <div className="mt-5 text-center sm:mt-6">
            <p className="text-[13px] font-medium text-slate-600 sm:text-[16px] md:text-[18px]">
              This certificate is proudly presented to
            </p>
            <div className="mx-auto mt-2 w-fit min-w-[42%] max-w-[80%] border-b-2 border-violet-600 px-8 pb-2 text-[29px] font-black leading-tight text-[#11183d] sm:text-[36px] md:text-[45px]">
              {playerName}
            </div>
            <p className="mt-3 text-[13px] font-medium text-slate-600 sm:text-[16px] md:text-[18px]">
              for successfully completing
            </p>
          </div>

          {/* game identity */}
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="h-4 w-9 -skew-x-12 rounded-sm bg-violet-600 sm:h-5 sm:w-11" />
              <span className="h-4 w-9 -skew-x-12 rounded-sm bg-indigo-600 sm:h-5 sm:w-11" />
              <span className="h-4 w-9 -skew-x-12 rounded-sm bg-violet-700 sm:h-5 sm:w-11" />
            </div>
            <div>
              <div className="text-left text-[24px] font-black leading-none sm:text-[31px] md:text-[38px]">
                <span className="text-[#081225]">STACK </span>
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">MASTER</span>
              </div>
              <div className="mt-1 text-left text-[8px] font-black tracking-[0.13em] text-slate-700 sm:text-[10px] md:text-[12px]">
                STACK HIGH, SCORE HIGHER!
              </div>
            </div>
          </div>

          {/* achievement ribbon */}
          <div className="mt-4 flex items-center justify-center">
            <span className="mr-1 h-0 w-0 border-b-[10px] border-r-[9px] border-t-[10px] border-b-transparent border-r-violet-600 border-t-transparent" />
            <div className="min-w-[300px] bg-gradient-to-r from-violet-500 via-violet-700 to-violet-500 px-6 py-1.5 text-center text-[11px] font-black tracking-[0.14em] text-white sm:min-w-[370px] sm:text-[14px] md:min-w-[430px] md:text-[17px]">
              LEVEL {level.level} ACHIEVEMENT
            </div>
            <span className="ml-1 h-0 w-0 border-b-[10px] border-l-[9px] border-t-[10px] border-b-transparent border-l-violet-600 border-t-transparent" />
          </div>

          {/* stats */}
          <div className="mx-auto mt-5 grid w-full max-w-[820px] grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {[
              ["LEVEL",`${level.level} / 10`,"▰"],
              ["SCORE",score,"★"],
              ["HEIGHT",level.target,"▥"]
            ].map(([label,value,icon])=>
              <div key={label} className="flex min-h-[67px] items-center justify-center gap-2 rounded-xl border border-violet-300 bg-violet-50/30 px-2 py-2 sm:min-h-[76px] sm:gap-3 md:min-h-[84px]">
                <div className="text-[22px] text-violet-700 sm:text-[27px] md:text-[31px]">{icon}</div>
                <div className="text-left">
                  <div className="text-[8px] font-black tracking-wide text-violet-700 sm:text-[10px] md:text-[12px]">{label}</div>
                  <div className="mt-0.5 text-[17px] font-black leading-none text-[#081225] sm:text-[21px] md:text-[25px]">{value}</div>
                </div>
              </div>
            )}
          </div>

          {/* balanced footer */}
          <div className="mx-auto mt-6 grid w-full max-w-[900px] grid-cols-3 items-end gap-6">
            <div className="flex justify-center">
              <div className="w-[175px] rounded-lg border border-violet-200 bg-violet-50 px-4 py-2.5 text-center">
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-violet-700 text-sm font-black text-white">✓</div>
                <div className="mt-1.5 text-[10px] font-black tracking-[0.12em] text-violet-800 sm:text-[11px]">STACK MASTER</div>
                <div className="mt-0.5 text-[7px] font-bold tracking-[0.12em] text-slate-500 sm:text-[8px]">VERIFIED ACHIEVEMENT</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] border-dashed border-violet-600 bg-violet-50 sm:h-[78px] sm:w-[78px]">
                <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 border-violet-400 bg-white text-2xl text-violet-700">★</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-[175px] text-center">
                <div className="border-b-2 border-violet-500 pb-1.5 text-[9px] font-bold text-slate-700 sm:text-[11px]">
                  {new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})}
                </div>
                <div className="mt-1.5 text-[8px] font-black tracking-[0.12em] text-violet-800 sm:text-[10px]">DATE OF ACHIEVEMENT</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* actions outside certificate */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
        <button
          onClick={()=>window.print()}
          className="rounded-xl bg-violet-700 px-7 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          ↓ DOWNLOAD CERTIFICATE
        </button>
        <button
          onClick={nextLevel}
          className="rounded-xl bg-[#101a3d] px-7 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          {levelIndex<9?"NEXT LEVEL →":"FINISH GAME"}
        </button>
        <button
          onClick={home}
          className="rounded-xl border border-slate-200 bg-white px-7 py-3 font-bold text-slate-700 shadow"
        >
          HOME
        </button>
      </div>
    </div>
  </div>;

  return <div className={page}><div className={`${card} flex items-center justify-center`}><div className="text-center"><div className="text-5xl text-amber-500">★</div><h1 className="mt-5 text-6xl font-black">MASTER ACHIEVED</h1><p className="mt-5 text-lg text-slate-500">{playerName}, you completed all 10 levels.</p><div className="mt-8 inline-block rounded-2xl border border-slate-200 bg-slate-50 px-10 py-6"><div className="text-xs font-bold tracking-widest text-slate-400">FINAL SCORE</div><div className="mt-2 text-5xl font-black text-cyan-600">{score}</div></div><div className="mt-10"><button onClick={()=>{setLevelIndex(0);setScore(0);setCombo(0);setScreen("intro")}} className="rounded-xl bg-slate-900 px-10 py-4 font-black text-white">PLAY AGAIN</button></div></div></div></div>;
}