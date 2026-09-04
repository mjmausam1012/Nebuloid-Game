import { useState } from "react";
import "./App.css";
import Navbar from "./ui/Navbar";
import Hero from "./ui/Hero";
import GameList from "./components/GameList";

// Import all 12 games from the game directory
import TugOfWarApp from "./game/TugOfWar/App";
import MemoryMatchApp from "./game/MemoryMatch/App";
import Game2048Race from "./game/2048-Race/src/App";
import TargetShooterApp from "./game/TargetShooter/src/App";
import LogoQuizApp from "./game/LogoQuiz/src/App";
import ColorClashApp from "./game/Color Clash/src/App";
import EmojiPuzzleApp from "./game/Emoji Puzzle/src/App";
import MemorySequenceApp from "./game/Memory Sequence/src/App";
import ReactionRushApp from "./game/Reaction Rush/src/App";
import StackMasterApp from "./game/Stack Master/src/App";
import BombDefusalApp from "./game/bomb defusal/src/App";
import CatchTheBrandApp from "./game/catch the brand/src/App";

function App() {
  const [showGames, setShowGames] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  const handlePlayGame = (gameTitle) => {
    switch (gameTitle) {
      case "Tug of War":
        setActiveGame("TugOfWar");
        break;
      case "Memory Match":
        setActiveGame("MemoryMatch");
        break;
      case "2048 Race":
        setActiveGame("2048Race");
        break;
      case "Target Shooter":
        setActiveGame("TargetShooter");
        break;
      case "Logo Quiz":
        setActiveGame("LogoQuiz");
        break;
      case "Color Clash":
        setActiveGame("ColorClash");
        break;
      case "Emoji Puzzle":
        setActiveGame("EmojiPuzzle");
        break;
      case "Memory Sequence":
        setActiveGame("MemorySequence");
        break;
      case "Reaction Rush":
        setActiveGame("ReactionRush");
        break;
      case "Stack Master":
        setActiveGame("StackMaster");
        break;
      case "Bomb Defusal":
        setActiveGame("BombDefusal");
        break;
      case "Catch the Brand":
        setActiveGame("CatchTheBrand");
        break;
      default:
        alert(`The game '${gameTitle}' is not yet implemented.`);
    }
  };

  const handleNavHome = () => {
    setShowGames(false);
    setActiveGame(null);
  };

  const handleNavGames = () => {
    setShowGames(true);
    setActiveGame(null);
  };

  const handleExitGame = () => {
    setActiveGame(null);
    setShowGames(true);
  };

  return (
    <>
      {!activeGame && (
        <Navbar onNavHome={handleNavHome} onNavGames={handleNavGames} />
      )}

      {!showGames && !activeGame && (
        <Hero onShowGames={() => setShowGames(true)} />
      )}

      {showGames && !activeGame && <GameList onPlayGame={handlePlayGame} />}

      {activeGame === "TugOfWar" && (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8 animate-fade-in font-sans bg-gray-50">
          <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <TugOfWarApp onExitGame={handleExitGame} />
          </div>
        </div>
      )}

      {activeGame === "MemoryMatch" && (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8 animate-fade-in font-sans bg-gray-50">
          <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <MemoryMatchApp onExitGame={handleExitGame} />
          </div>
        </div>
      )}

      {activeGame === "2048Race" && (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8 animate-fade-in font-sans bg-gray-50">
          <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <Game2048Race onExitGame={handleExitGame} />
          </div>
        </div>
      )}

      {activeGame === "TargetShooter" && (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8 animate-fade-in font-sans bg-gray-50">
          <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <TargetShooterApp onExitGame={handleExitGame} />
          </div>
        </div>
      )}

      {activeGame === "LogoQuiz" && (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8 animate-fade-in font-sans bg-gray-50">
          <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <LogoQuizApp onExitGame={handleExitGame} />
          </div>
        </div>
      )}

      {activeGame === "ColorClash" && (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8 animate-fade-in font-sans bg-gray-50">
          <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <ColorClashApp onExitGame={handleExitGame} />
          </div>
        </div>
      )}

      {activeGame === "EmojiPuzzle" && (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8 animate-fade-in font-sans bg-gray-50">
          <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <EmojiPuzzleApp onExitGame={handleExitGame} />
          </div>
        </div>
      )}

      {activeGame === "MemorySequence" && (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8 animate-fade-in font-sans bg-gray-50">
          <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <MemorySequenceApp onExitGame={handleExitGame} />
          </div>
        </div>
      )}

      {activeGame === "ReactionRush" && (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8 animate-fade-in font-sans bg-gray-50">
          <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <ReactionRushApp onExitGame={handleExitGame} />
          </div>
        </div>
      )}

      {activeGame === "StackMaster" && (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8 animate-fade-in font-sans bg-gray-50">
          <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <StackMasterApp onExitGame={handleExitGame} />
          </div>
        </div>
      )}

      {activeGame === "BombDefusal" && (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8 animate-fade-in font-sans bg-gray-50">
          <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <BombDefusalApp onExitGame={handleExitGame} />
          </div>
        </div>
      )}

      {activeGame === "CatchTheBrand" && (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8 animate-fade-in font-sans bg-gray-50">
          <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <CatchTheBrandApp onExitGame={handleExitGame} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
