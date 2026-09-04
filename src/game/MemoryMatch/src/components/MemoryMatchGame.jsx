import React, { useState, useEffect, useCallback, useRef } from "react";
import DifficultySelector from "./DifficultySelector";
import PlayerBoard from "./PlayerBoard";

function MemoryMatchGame({ config, onGoHome }) {
  const mode = config?.mode || "team";
  const teamA = config?.teamA || "Team A";
  const teamB = config?.teamB || (mode === "robot" ? "Robot" : "Team B");
  const initialDifficulty = config?.difficulty?.toLowerCase() || "primary";
  const initialTime = config?.timeLimit || 300;

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [gameStatus, setGameStatus] = useState("playing"); // "playing", "won", "timeup"
  const [winner, setWinner] = useState(null);
  
  const timerRef = useRef(null);
  const TARGET_SCORE = 10;

  // Handle timer
  useEffect(() => {
    if (gameStatus === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameStatus("timeup");
            
            // Determine winner on timeout
            if (scoreA > scoreB) setWinner(teamA);
            else if (scoreB > scoreA) setWinner(teamB);
            else setWinner("TIE");
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameStatus, scoreA, scoreB]);

  // Handle scoring and winning condition
  const handleScore = useCallback((team) => {
    if (team === "A") {
      setScoreA((prev) => {
        const newScore = prev + 1;
        if (newScore >= TARGET_SCORE) {
          setGameStatus("won");
          setWinner(teamA);
          if (timerRef.current) clearInterval(timerRef.current);
        }
        return newScore;
      });
    } else {
      setScoreB((prev) => {
        const newScore = prev + 1;
        if (newScore >= TARGET_SCORE) {
          setGameStatus("won");
          setWinner(teamB);
          if (timerRef.current) clearInterval(timerRef.current);
        }
        return newScore;
      });
    }
  }, []);

  const restartGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setScoreA(0);
    setScoreB(0);
    setTimeLeft(initialTime);
    setGameStatus("playing");
    setWinner(null);
  }, [initialTime]);

  const onMatchA = useCallback(() => handleScore("A"), [handleScore]);
  const onMatchB = useCallback(() => handleScore("B"), [handleScore]);

  const handleDifficultyChange = useCallback((newDifficulty) => {
    if (newDifficulty === difficulty) return;
    setDifficulty(newDifficulty);
    restartGame();
  }, [difficulty, restartGame]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isBoardDisabled = gameStatus !== "playing";
  const isGameOver = gameStatus === "won" || gameStatus === "timeup";

  const boardKey = `${difficulty}-${gameStatus === "playing" ? "play" : "reset"}`;

  return (
    <div className="flex flex-col w-full h-full min-h-[80vh] p-4 md:p-6 lg:p-8 font-sans bg-gray-50 relative overflow-hidden">
      
      {/* VS Scoreboard Header */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-4 md:p-6 mb-6 md:mb-8 border border-gray-100 z-10 relative">
        <div className="flex flex-col items-center flex-1">
          <span className="text-xs sm:text-sm font-extrabold text-amber-500 uppercase tracking-[0.2em] mb-1">{teamA}</span>
          <span className="text-4xl md:text-5xl font-black text-gray-900 drop-shadow-sm">{scoreA}</span>
        </div>
        
        <div className="flex flex-col items-center flex-[1.5] px-2 md:px-4">
          <div className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-[0.2em] mb-2">FIRST TO {TARGET_SCORE}</div>
          <div className={`text-2xl md:text-4xl font-extrabold px-4 sm:px-6 py-2 rounded-xl border-2 transition-all duration-300 ${timeLeft <= 30 && gameStatus === "playing" ? "border-red-500 text-red-600 bg-red-50 animate-pulse shadow-inner" : "border-gray-200 text-gray-800 bg-gray-50 shadow-inner"}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="flex flex-col items-center flex-1">
          <span className="text-xs sm:text-sm font-extrabold text-emerald-500 uppercase tracking-[0.2em] mb-1">{teamB}</span>
          <span className="text-4xl md:text-5xl font-black text-gray-900 drop-shadow-sm">{scoreB}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 z-10">
        <PlayerBoard 
          key={`A-${boardKey}`}
          teamName={teamA} 
          difficulty={difficulty} 
          disabled={isBoardDisabled} 
          onMatch={onMatchA} 
          teamColor="#F59E0B"
        />
        <PlayerBoard 
          key={`B-${boardKey}`}
          teamName={teamB} 
          difficulty={difficulty} 
          disabled={isBoardDisabled} 
          onMatch={onMatchB} 
          teamColor="#10B981"
          isRobot={mode === "robot"}
        />
      </div>

      <div className="flex justify-center gap-4 mt-8 z-10">
        <button 
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-amber-500 hover:text-black shadow-lg shadow-gray-900/20 hover:shadow-amber-500/40 transition-all duration-300 transform hover:-translate-y-1"
          onClick={restartGame} 
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Reset Match
        </button>
        {onGoHome && (
          <button 
            className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-bold rounded-xl border-2 border-red-100 hover:bg-red-50 hover:border-red-200 shadow-md transition-all duration-300 transform hover:-translate-y-1"
            onClick={onGoHome} 
            type="button"
          >
            Quit to Home
          </button>
        )}
      </div>

      {/* Game Over Modal overlay inline replacement */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden transform transition-all scale-100">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            
            <div className="text-6xl mb-4 filter drop-shadow-md">🏆</div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              {winner === "TIE" ? "IT'S A TIE!" : `${winner} WINS!`}
            </h2>
            
            <p className="text-gray-500 font-bold tracking-wide uppercase text-sm mb-6">
              {gameStatus === "timeup" ? "Time's up!" : `Reached ${TARGET_SCORE} points!`}
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100 shadow-inner flex justify-center items-center gap-6">
               <div className="flex flex-col items-center">
                 <span className="text-xs font-bold text-amber-500 uppercase mb-1">{teamA}</span>
                 <span className="text-3xl font-black text-gray-900">{scoreA}</span>
               </div>
               <div className="text-gray-300 text-xl font-light">|</div>
               <div className="flex flex-col items-center">
                 <span className="text-xs font-bold text-emerald-500 uppercase mb-1">{teamB}</span>
                 <span className="text-3xl font-black text-gray-900">{scoreB}</span>
               </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                className="w-full py-3.5 bg-black text-white font-bold rounded-xl hover:bg-amber-500 hover:text-black shadow-lg shadow-black/20 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-1"
                onClick={restartGame}
              >
                Play Again
              </button>
              {onGoHome && (
                <button 
                  className="w-full py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                  onClick={onGoHome}
                >
                  Home
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemoryMatchGame;
