import { useState } from "react";
import MemoryMatchGame from "./components/MemoryMatchGame";
import PreGameLobby from "./components/PreGameLobby";
import nebuloidLogo from "./assets/nebuloid-logo-cropped.png"
import "./StartScreen.css";

function CornerDecor() {
  return (
    <>
      <div className="mm-corner mm-corner-tl">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="mm-corner mm-corner-br">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="mm-dots mm-dots-tr">
        {Array.from({ length: 20 }, (_, i) => (
          <b key={i} />
        ))}
      </div>
      <div className="mm-dots mm-dots-bl">
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
      className={`mm-menu-btn ${primary ? "primary" : ""}`}
      onClick={onClick}
    >
      <span className="mm-btn-icon">{icon}</span>
      <span>{children}</span>
    </button>
  );
}

function App({ onExitGame }) {
  const [appState, setAppState] = useState("home"); // "home", "how", "lobby", "game"
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
    <div className="app-container mm-start-app w-full h-full font-sans flex-1 flex flex-col">
      {appState === "home" && (
        <main className="mm-screen mm-welcome">
          <CornerDecor />
          <section className="mm-hero">
          <img src={nebuloidLogo} alt="Nebuloid Logo" className="nebuloid-logo h-40 w-auto mx-auto mb-2" />
            <h1>MEMORY</h1>
            <h2>M A T C H</h2>
            <div className="mm-hero-rule">
              <span /> <b>FLIP • FIND • WIN</b> <span />
            </div>
          </section>
          <div className="mm-menu">
            <Button primary icon="▶" onClick={handleStartLobby}>
              START GAME
            </Button>
            <Button icon="ⓘ" onClick={() => setAppState("how")}>
              HOW TO PLAY
            </Button>
            {onExitGame && (
              <Button icon="←" onClick={onExitGame}>
                BACK TO GAMES
              </Button>
            )}
          </div>
          <p className="mm-bottom-note">
            ★　Flip the cards, remember the pairs, and outscore your rivals.　★
          </p>
        </main>
      )}

      {appState === "how" && (
        <main className="mm-screen mm-subpage">
          <CornerDecor />
          <div className="mm-panel wide">
            <div className="mm-eyebrow">GUIDE</div>
            <h1>HOW TO PLAY</h1>
            <div className="mm-steps">
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
                <strong>Flip and match</strong>
                <span>Turn two cards at a time and find matching pairs.</span>
              </div>
              <div>
                <b>04</b>
                <strong>Race the clock</strong>
                <span>Every match scores a point — first to the target wins.</span>
              </div>
            </div>
            <div className="mm-actions">
              <Button onClick={() => setAppState("home")} icon="←">
                MAIN MENU
              </Button>
            </div>
          </div>
        </main>
      )}

      {appState === "lobby" && (
        <PreGameLobby onCancel={handleGoHome} onStart={handleStartGame} />
      )}

      {appState === "game" && (
        <MemoryMatchGame config={gameConfig} onGoHome={handleGoHome} />
      )}
    </div>
  );
}

export default App;
