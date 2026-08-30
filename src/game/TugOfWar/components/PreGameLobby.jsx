import React, { useState } from "react";

export default function PreGameLobby({ onCancel, onStart }) {
  const [step, setStep] = useState(1);
  const [cfg, setCfg] = useState({
    difficulty: "Primary",
    mode: "team",
    teamA: "Team A",
    teamB: "Team B",
    timeLimit: 120,
  });
  const [errorMsg, setErrorMsg] = useState("");

  const DIFFS = ["Nursery", "Primary", "Middle", "High", "Gamer"];
  const MODES = [
    {
      id: "team",
      label: "Team vs Team",
      desc: "2 Groups, 1 Screen",
      icon: "👥",
    },
    {
      id: "robot",
      label: "Robot",
      desc: "Solo practice",
      icon: "🤖",
    },
  ];

  const handleStart = () => {
    setErrorMsg("");
    if (cfg.mode === "team") {
      if (!cfg.teamA.trim()) {
        setErrorMsg("Please enter a name for Team A.");
        return;
      }
      if (!cfg.teamB.trim()) {
        setErrorMsg("Please enter a name for Team B.");
        return;
      }
    }
    onStart({ ...cfg, timeLimit: 120 });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top decorative bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-500"></div>

        {step === 1 && (
          <div className="flex flex-col animate-fade-in">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
              CHOOSE DIFFICULTY
            </h2>
            <div className="flex flex-col flex-wrap gap-3 sm:gap-4">
              {DIFFS.map((d) => {
                const isSelected = cfg.difficulty === d;
                return (
                  <button
                    key={d}
                    className={`relative px-4 py-4 rounded-xl font-bold text-sm transition-all duration-300 border-2 ${
                      isSelected
                        ? "border-amber-500 bg-amber-50 text-amber-700 shadow-md"
                        : "border-gray-200 bg-white text-gray-700 hover:border-black hover:shadow-sm"
                    }`}
                    onClick={() => {
                      setCfg({ ...cfg, difficulty: d });
                      setStep(2);
                    }}
                  >
                    {d}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-sm">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col animate-fade-in">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
              CHOOSE MODE
            </h2>
            <div className="flex flex-col flex-wrap gap-4">
              {MODES.map((m) => {
                const isSelected = cfg.mode === m.id;
                return (
                  <button
                    key={m.id}
                    className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-amber-500 bg-amber-50 text-amber-700 shadow-md"
                        : "border-gray-200 bg-white hover:border-black hover:shadow-sm"
                    }`}
                    onClick={() => {
                      if (m.id === "team") {
                        setCfg({ ...cfg, mode: m.id });
                        setStep(3);
                      } else {
                        onStart({ ...cfg, mode: "robot", timeLimit: 120 });
                      }
                    }}
                  >
                    <div className="text-4xl mb-3 drop-shadow-sm">{m.icon}</div>
                    <div className="font-bold text-lg text-gray-900 mb-1">
                      {m.label}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {m.desc}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex justify-center">
              <button
                className="px-6 py-2.5 rounded-full text-gray-500 font-bold hover:bg-gray-100 hover:text-gray-900 transition-colors"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col animate-fade-in">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
              TEAM SETUP
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-extrabold text-gray-700 mb-2 tracking-wide">
                  TEAM A NAME
                </label>
                <input
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-500 focus:ring-0 outline-none transition-all font-bold text-gray-900 shadow-inner"
                  value={cfg.teamA}
                  onChange={(e) => {
                    setCfg({ ...cfg, teamA: e.target.value });
                    setErrorMsg("");
                  }}
                  placeholder="Enter Team A name"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-gray-700 mb-2 tracking-wide">
                  TEAM B NAME
                </label>
                <input
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-500 focus:ring-0 outline-none transition-all font-bold text-gray-900 shadow-inner"
                  value={cfg.teamB}
                  onChange={(e) => {
                    setCfg({ ...cfg, teamB: e.target.value });
                    setErrorMsg("");
                  }}
                  placeholder="Enter Team B name"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="mt-5 p-3.5 bg-red-50 text-red-600 font-bold text-sm rounded-xl border border-red-200 text-center shadow-sm">
                {errorMsg}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                className="flex-1 px-6 py-3.5 rounded-xl text-gray-700 font-bold bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
                onClick={() => {
                  setStep(2);
                  setErrorMsg("");
                }}
              >
                Back
              </button>
              <button
                className="flex-[2] px-6 py-3.5 rounded-xl text-white font-bold bg-black hover:bg-amber-500 hover:text-black shadow-lg shadow-black/20 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-1 flex justify-center items-center gap-2"
                onClick={handleStart}
              >
                Start Game
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
