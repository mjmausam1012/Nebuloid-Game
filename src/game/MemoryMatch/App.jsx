import { useState } from "react";
import MemoryMatchGame from "./components/MemoryMatchGame";
import PreGameLobby from "./components/PreGameLobby";

function App({ onExitGame }) {
  const [appState, setAppState] = useState("home"); // "home", "lobby", "game"
  const [gameConfig, setGameConfig] = useState(null);

  const handleStartLobby = () => {
    setAppState("lobby");
  };

  const handleStartGame = (config) => {
    setGameConfig(config);
    setAppState("game");
  };

  const handleGoHome = () => {
    setAppState("home");
    setGameConfig(null);
  };

  return (
    <div className="app-container w-full h-full font-sans flex-1 flex flex-col">
      {appState === "home" && (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[80vh] bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 relative overflow-hidden border border-gray-100 flex-1">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-500"></div>
          
          <div className="z-10 flex flex-col items-center text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900">
              Memory <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Match</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-lg font-medium">
              Test your memory! Find all the matching pairs before time runs out. Great for brain training.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                className="px-10 py-4 bg-black text-white font-bold rounded-2xl hover:bg-amber-500 hover:text-black shadow-xl shadow-black/20 hover:shadow-amber-500/40 transition-all duration-300 transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3"
                onClick={handleStartLobby}
              >
                Start Game
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              
              {onExitGame && (
                <button
                  className="px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 text-lg flex items-center justify-center"
                  onClick={onExitGame}
                >
                  Back to Games
                </button>
              )}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      )}

      {appState === "lobby" && (
        <PreGameLobby 
          onCancel={handleGoHome} 
          onStart={handleStartGame} 
        />
      )}

      {appState === "game" && (
        <MemoryMatchGame 
          config={gameConfig}
          onGoHome={handleGoHome} 
        />
      )}
    </div>
  );
}

export default App;
