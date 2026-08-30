import { useState } from "react";
import "./App.css";
import Navbar from "./ui/Navbar";
import Hero from "./ui/Hero";
import GameList from "./components/GameList";
import TugOfWarApp from "./game/TugOfWar/App";
import MemoryMatchApp from "./game/MemoryMatch/App";
import Game2048Race from "./game/2048-Race/src/App";

function App() {
  const [showGames, setShowGames] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  const handlePlayGame = (gameTitle) => {
    if (gameTitle === "Tug of War") {
      setActiveGame("TugOfWar");
    } else if (gameTitle === "Memory Match") {
      setActiveGame("MemoryMatch");
    } else if (gameTitle === "2048 Race") {
      setActiveGame("2048Race");
    } else {
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
            <TugOfWarApp onExitGame={() => setActiveGame(null)} />
          </div>
        </div>
      )}

      {activeGame === "MemoryMatch" && (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8 animate-fade-in font-sans bg-gray-50">
          <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <MemoryMatchApp onExitGame={() => setActiveGame(null)} />
          </div>
        </div>
      )}

      {activeGame === "2048Race" && (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8 animate-fade-in font-sans bg-gray-50">
          <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <Game2048Race onExitGame={() => setActiveGame(null)} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
