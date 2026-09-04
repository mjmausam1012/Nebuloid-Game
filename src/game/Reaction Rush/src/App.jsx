import { useState, useEffect } from "react";
import "./App.css";
import StartScreen from "./components/StartScreen";
import Level from "./components/Level";
import Game from "./components/Game";
import Certificate from "./components/Certificate";
import { initialLevels } from "./data/levelData";

function App({ onExitGame }) {
  const [currentScreen, setCurrentScreen] = useState("start"); // "start" | "level" | "game" | "certificate"
  const [selectedStage, setSelectedStage] = useState({
    level: "easy",
    stage: 1,
  });

  // Certificate Data State
  const [certificateData, setCertificateData] = useState(() => {
    const saved = localStorage.getItem("reaction_rush_last_certificate");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return null;
  });

  // Persistent Level and Stage State - All stages unlocked
  const [levelData, setLevelData] = useState(() => {
    const saved = localStorage.getItem("reaction_rush_levels");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((lvl) => ({
          ...lvl,
          stages: lvl.stages.map((st) => ({ ...st, locked: false })),
        }));
      } catch {
        // Fallback to default
      }
    }
    return initialLevels.map((lvl) => ({
      ...lvl,
      stages: lvl.stages.map((st) => ({ ...st, locked: false })),
    }));
  });

  // Ensure all stages are unlocked in localStorage on mount and updates
  useEffect(() => {
    const allUnlocked = levelData.map((lvl) => ({
      ...lvl,
      stages: lvl.stages.map((st) => ({ ...st, locked: false })),
    }));
    localStorage.setItem("reaction_rush_levels", JSON.stringify(allUnlocked));
  }, [levelData]);

  // Stage Completion & Next Stage Unlock Handler
  const handleStageComplete = ({
    level,
    stage,
    avgReactionTime,
    starsEarned,
    isPassed,
  }) => {
    // Only unlock next stage if the player passed the stage
    if (!isPassed) return;

    setLevelData((prevLevels) => {
      const updated = prevLevels.map((lvl) => {
        if (lvl.id !== level) return lvl;

        const newStages = lvl.stages.map((st) => {
          if (st.id === stage) {
            // Update current stage with stars & best reaction time
            const timeFormatted =
              avgReactionTime > 0
                ? (avgReactionTime / 1000).toFixed(2) + "s"
                : "00.00s";
            return {
              ...st,
              stars: Math.max(st.stars || 0, starsEarned),
              best: timeFormatted,
            };
          }
          if (st.id === stage + 1) {
            // UNLOCK NEXT STAGE (e.g., L-1 -> L-2, L-2 -> L-3, etc.)
            return {
              ...st,
              locked: false,
            };
          }
          return st;
        });

        // Calculate total cleared stages for this level
        const clearedCount = newStages.filter((s) => s.stars > 0).length;

        return {
          ...lvl,
          cleared: clearedCount,
          stages: newStages,
        };
      });

      localStorage.setItem("reaction_rush_levels", JSON.stringify(updated));
      return updated;
    });
  };

  // Certificate Generator Handler
  const handleGenerateCertificate = (certData) => {
    setCertificateData(certData);
    localStorage.setItem(
      "reaction_rush_last_certificate",
      JSON.stringify(certData),
    );
    setCurrentScreen("certificate");
  };

  // Reset progress handler
  const handleResetProgress = (resetData) => {
    setLevelData(resetData);
    localStorage.setItem("reaction_rush_levels", JSON.stringify(resetData));
  };

  return (
    <>
      {currentScreen === "start" && (
        <StartScreen
          onStartRace={() => setCurrentScreen("level")}
          onCertificates={() => setCurrentScreen("certificate")}
          onExit={onExitGame}
        />
      )}
      {currentScreen === "level" && (
        <Level
          levelData={levelData}
          initialTab={selectedStage.level}
          onBack={() => setCurrentScreen("start")}
          onSelectStage={(stageInfo) => {
            setSelectedStage(stageInfo);
            setCurrentScreen("game");
          }}
          onResetProgress={handleResetProgress}
        />
      )}
      {currentScreen === "game" && (
        <Game
          level={selectedStage.level}
          stage={selectedStage.stage}
          onBack={() => setCurrentScreen("level")}
          onNextStage={(nextStageInfo) => setSelectedStage(nextStageInfo)}
          onStageComplete={handleStageComplete}
          onGenerateCertificate={handleGenerateCertificate}
        />
      )}
      {currentScreen === "certificate" && (
        <Certificate
          certificateData={certificateData}
          onBack={() => setCurrentScreen("level")}
          onHome={() => setCurrentScreen("start")}
        />
      )}
    </>
  );
}

export default App;
