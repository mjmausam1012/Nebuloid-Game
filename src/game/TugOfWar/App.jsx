import { useState, useEffect } from "react";
import TugOfWar from "./components/TugOfWar";
import PreGameLobby from "./components/PreGameLobby";
import "./components/startScreen.css";
import nebuloidLogo from "../../assets/nebuloid-logo-cropped.png"

function CornerDecor() {
  return (
    <>
      <div className="tow-corner tow-corner-tl">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="tow-corner tow-corner-br">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="tow-dots tow-dots-tr">
        {Array.from({ length: 20 }, (_, i) => (
          <b key={i} />
        ))}
      </div>
      <div className="tow-dots tow-dots-bl">
        {Array.from({ length: 16 }, (_, i) => (
          <b key={i} />
        ))}
      </div>
    </>
  );
}

function Button({ children, primary = false, onClick, icon }) {
  return (
    <button
      className={`tow-menu-btn ${primary ? "primary" : ""}`}
      onClick={onClick}
    >
      <span className="tow-btn-icon">{icon}</span>
      <span>{children}</span>
    </button>
  );
}

function App({ onExitGame }) {
  const [page, setPage] = useState("welcome");
  const [showGame, setShowGame] = useState(false);
  const [showLobby, setShowLobby] = useState(false);
  const [gameConfig, setGameConfig] = useState({
    difficulty: "Primary",
    mode: "team",
    teamA: "Team A",
    teamB: "Team B",
    timeLimit: 120,
    timeLeft: 120,
    timesUp: false,
    sessionId: 0,
  });

  useEffect(() => {
    let timer;
    if (showGame && !gameConfig.timesUp && gameConfig.timeLeft > 0) {
      timer = setInterval(() => {
        setGameConfig((prev) => {
          if (prev.timeLeft <= 1) {
            clearInterval(timer);
            return { ...prev, timeLeft: 0, timesUp: true };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showGame, gameConfig.timesUp, gameConfig.timeLeft]);

  const handleStartGame = (config) => {
    setGameConfig((prev) => ({
      ...prev,
      ...config,
      timeLeft: config.timeLimit,
      timesUp: false,
      sessionId: prev.sessionId + 1,
    }));
    setShowLobby(false);
    setShowGame(true);
  };

  const handleClose = () => {
    setShowGame(false);
    setShowLobby(false);
    setPage("welcome");
  };

  const handleGameOver = () => {
    // Game over is handled internally by TugOfWar component showing the win overlay
  };

  const handlePlayAgain = () => {
    setGameConfig((prev) => ({
      ...prev,
      timeLeft: prev.timeLimit,
      timesUp: false,
      sessionId: prev.sessionId + 1,
    }));
  };

  const handleNewTimer = () => {
    setShowGame(false);
    setShowLobby(true);
  };

  return (
    <div className="app-container tow-start-app w-full h-full flex-1 flex flex-col">
      {!showGame && !showLobby && page === "welcome" && (
        <main className="tow-screen tow-welcome">
          <CornerDecor />
          <section className="tow-hero">
            <img src={nebuloidLogo} alt="Nebuloid Logo" className="nebuloid-logo h-40 w-auto mx-auto mb-2" />
            <h1>TUG</h1>
            <h2>O F&nbsp;&nbsp;W A R</h2>
            <div className="tow-hero-rule">
              <span /> <b>PULL • SOLVE • WIN</b> <span />
            </div>
          </section>
          <div className="tow-menu">
            <Button primary icon="▶" onClick={() => setShowLobby(true)}>
              START GAME
            </Button>
            <Button icon="ⓘ" onClick={() => setPage("how")}>
              HOW TO PLAY
            </Button>
            {onExitGame && (
              <Button icon="←" onClick={onExitGame}>
                BACK TO GAMES
              </Button>
            )}
          </div>
          <p className="tow-bottom-note">
            ★　Answer faster, pull harder, and drag your rivals across the line.　★
          </p>
        </main>
      )}

      {!showGame && !showLobby && page === "how" && (
        <main className="tow-screen tow-subpage">
          <CornerDecor />
          <div className="tow-panel wide">
            <div className="tow-eyebrow">GUIDE</div>
            <h1>HOW TO PLAY</h1>
            <div className="tow-steps">
              <div>
                <b>01</b>
                <strong>Pick a difficulty</strong>
                <span>From Nursery basics to Gamer-level challenge.</span>
              </div>
              <div>
                <b>02</b>
                <strong>Choose your mode</strong>
                <span>Team vs Team on one screen, or practice against a robot.</span>
              </div>
              <div>
                <b>03</b>
                <strong>Solve math questions</strong>
                <span>Use your numpad to enter answers as fast as you can.</span>
              </div>
              <div>
                <b>04</b>
                <strong>Pull the rope</strong>
                <span>Every correct answer tugs the rope — first to the target wins.</span>
              </div>
            </div>
            <div className="tow-actions">
              <Button onClick={() => setPage("welcome")} icon="←">
                MAIN MENU
              </Button>
            </div>
          </div>
        </main>
      )}

      {showLobby && (
        <PreGameLobby onCancel={handleClose} onStart={handleStartGame} />
      )}

      {showGame && (
        <TugOfWar
          key={gameConfig.sessionId}
          config={{
            ...gameConfig,
            onGameOver: handleGameOver,
            onPlayAgain: handlePlayAgain,
            onNewTimer: handleNewTimer,
          }}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default App;
