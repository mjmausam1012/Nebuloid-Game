import { useState, useEffect, useCallback, useRef } from 'react';
import tugBGSrc from '../assets/tugBG.png';
import heroSrc from '../assets/tugEmoji.png';
import './tugOfWar.css';

// TYPES
const TARGET_SCORE = 10;

const TUG_DIFFICULTY = {
  Nursery: { maxVal: 9,  minVal: 0,  ops: ['+'],                     name: 'Nursery' },
  Primary: { maxVal: 99,  minVal: 10,  ops: ['+', '−'],                name: 'Primary' },
  Middle:  { maxVal: 250, minVal: 50, ops: ['+', '−', '×', '÷'],      name: 'Middle'  },
  High:    { maxVal: 500, minVal: 100, ops: ['+', '−', '×', '÷'],      name: 'High'    },
  Gamer:   { maxVal: 5000, minVal: 200, ops: ['+', '−', '×', '÷'],      name: 'Gamer'   },
};

const ROBOT_DELAYS = {
  Nursery: 5000,
  Primary: 4000,
  Middle:  3500,
  High:    2800,
  Gamer:   2000,
};

const randInt = (min, max) => {
  if (min > max) [min, max] = [max, min];
  if (min === max) return min;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateQuestion = (difficulty = 'Primary') => {
  try {
    const diff = TUG_DIFFICULTY[difficulty] || TUG_DIFFICULTY.Primary;
    const ops = diff.ops;
    const op = ops[Math.floor(Math.random() * ops.length)];

    let a, b, ans, eq;

    switch (op) {
      case '+': {
        a = randInt(diff.minVal, diff.maxVal);
        b = randInt(diff.minVal, diff.maxVal);
        ans = a + b;
        eq = `${a} + ${b}`;
        break;
      }
      case '−': {
        a = randInt(diff.minVal, diff.maxVal);
        b = randInt(diff.minVal, diff.maxVal);
        if (b > a) [a, b] = [b, a];
        ans = a - b;
        eq = `${a} − ${b}`;
        break;
      }
      case '×': {
        const maxFactor = Math.min(20, Math.floor(Math.sqrt(diff.maxVal)));
        a = randInt(2, Math.max(2, maxFactor));
        b = randInt(2, Math.max(2, maxFactor));
        ans = a * b;
        eq = `${a} × ${b}`;
        break;
      }
      case '÷': {
        b = randInt(2, Math.min(12, Math.max(2, diff.maxVal)));
        const maxQuotient = Math.max(1, Math.floor(diff.maxVal / b));
        ans = randInt(1, Math.min(20, maxQuotient));
        a = b * ans;
        eq = `${a} ÷ ${b}`;
        break;
      }
      default: {
        a = randInt(1, 10);
        b = randInt(1, 10);
        ans = a + b;
        eq = `${a} + ${b}`;
      }
    }

    if (!Number.isFinite(ans) || ans < 0 || !Number.isInteger(ans)) {
      throw new Error('Generated answer is invalid');
    }

    return { eq, ans };
  } catch (error) {
    const a = randInt(1, 10);
    const b = randInt(1, 10);
    return { eq: `${a} + ${b}`, ans: a + b };
  }
};

function TugNumPad({ team, input, flash, score, onKeyPress }) {
  const isA = team === 'A';
  const side = isA ? 'a' : 'b';

  let displayClass = 'pad__display';
  if (flash === 'correct') displayClass += ' pad__display--ok';
  else if (flash === 'wrong') displayClass += ' pad__display--err';

  const numKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const bottomRow = isA
    ? [
        { key: 'X',  label: '✕', cls: 'pad__key pad__key--clear' },
        { key: '0',  label: '0', cls: 'pad__key' },
        { key: 'ok', label: '✓', cls: 'pad__key pad__key--ok' },
      ]
    : [
        { key: 'ok', label: '✓', cls: 'pad__key pad__key--ok' },
        { key: '0',  label: '0', cls: 'pad__key' },
        { key: 'X',  label: '✕', cls: 'pad__key pad__key--clear' },
      ];

  return (
    <div className={`pad-wrapper pad-wrapper--${side}`}>
      {/* Score badge - top */}
      <div className={`pad__score-top pad__score-top--${side}`}>
        <span className="pad__score-label">Score</span>
        <span className="pad__score-value">{score}</span>
      </div>

      {/* Calculator body */}
      <div className={`pad pad--${side}`}>
        <div className={`pad__ans-header pad__ans-header--${side}`}>
          Your Answer
        </div>

        <div className={displayClass}>
          {input || <span className="pad__display-placeholder">—</span>}
        </div>

        <div className="pad__grid">
          {numKeys.map((n) => (
            <button key={n} className="pad__key" onClick={() => onKeyPress(String(n))}>
              {n}
            </button>
          ))}
          {bottomRow.map(({ key, label, cls }) => (
            <button key={key} className={cls} onClick={() => onKeyPress(key)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom progress badge */}
      <div className={`pad__progress pad__progress--${side}`}>
        <span className="pad__progress-check">✓</span>
        <span>{score}/{TARGET_SCORE}</span>
      </div>
    </div>
  );
}

function RobotPanel({ score }) {
  return (
    <div className="pad-wrapper pad-wrapper--b">
      <div className="pad__score-top pad__score-top--b">
        <span className="pad__score-label">Score</span>
        <span className="pad__score-value">{score}</span>
      </div>
      <div className="pad pad--robot">
        <div className="robot__icon">🤖</div>
        <div className="robot__text">ROBOT IS PLAYING</div>
        <div className="robot__sub">Auto-solving equations...</div>
      </div>
      <div className="pad__progress pad__progress--b">
        <span className="pad__progress-check">✓</span>
        <span>{score}/{TARGET_SCORE}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN TUG OF WAR COMPONENT
   ═══════════════════════════════════════════ */
const TugOfWar = ({ config, onClose }) => {
  const difficulty = config?.difficulty || 'Primary';
  const mode       = config?.mode || 'team';
  const teamAName  = config?.teamA || 'Team A';
  const teamBName  = config?.teamB || 'Team B';

  const [question, setQuestion] = useState(() => generateQuestion(difficulty));
  const [scores, setScores]     = useState([0, 0]);
  const [winner, setWinner]     = useState(null);
  const [inputA, setInputA]     = useState('');
  const [inputB, setInputB]     = useState('');
  const [flashA, setFlashA]     = useState(null);
  const [flashB, setFlashB]     = useState(null);

  const robotTimerRef = useRef(null);

  useEffect(() => {
    if (winner) return;

    if (scores[0] >= TARGET_SCORE) {
      setWinner(teamAName);
      config?.onGameOver?.();
    } else if (scores[1] >= TARGET_SCORE) {
      setWinner(mode === 'robot' ? 'Robot' : teamBName);
      config?.onGameOver?.();
    } else if (config?.timesUp) {
      if (scores[0] > scores[1]) {
        setWinner(teamAName);
      } else if (scores[1] > scores[0]) {
        setWinner(mode === 'robot' ? 'Robot' : teamBName);
      } else {
        setWinner('Tie');
      }
      config?.onGameOver?.();
    }
  }, [scores, winner, teamAName, teamBName, mode, config]);

  useEffect(() => {
    if (mode !== 'robot' || winner || config?.timesUp) return;

    const baseDelay = ROBOT_DELAYS[difficulty] || 3500;
    const jitter = Math.random() * 1500;

    robotTimerRef.current = setTimeout(() => {
      setScores((prev) => [prev[0], prev[1] + 1]);
      setFlashB('correct');
      setTimeout(() => setFlashB(null), 400);
      setQuestion(generateQuestion(difficulty));
    }, baseDelay + jitter);

    return () => {
      if (robotTimerRef.current) clearTimeout(robotTimerRef.current);
    };
  }, [question, mode, winner, difficulty, config?.timesUp]);

  const handlePad = useCallback((team, key) => {
    if (winner || config?.timesUp) return;

    try {
      const isA = team === 'A';
      const currentInput = isA ? inputA : inputB;
      const setInput = isA ? setInputA : setInputB;
      const setFlash = isA ? setFlashA : setFlashB;

      if (key === 'X') {
        setInput('');
        return;
      }

      if (key === 'ok') {
        if (!currentInput) {
          setFlash('wrong');
          setTimeout(() => setFlash(null), 400);
          return;
        }

        const parsed = parseInt(currentInput, 10);
        if (isNaN(parsed)) {
          setFlash('wrong');
          setInput('');
          setTimeout(() => setFlash(null), 400);
          return;
        }

        if (parsed === question.ans) {
          setScores((prev) => isA ? [prev[0] + 1, prev[1]] : [prev[0], prev[1] + 1]);
          setFlash('correct');
          setQuestion(generateQuestion(difficulty));
        } else {
          setFlash('wrong');
        }

        setInput('');
        setTimeout(() => setFlash(null), 400);
        return;
      }

      if (currentInput.length < 5) {
        setInput(currentInput + key);
      }
    } catch (error) {
      console.error('[TugOfWar] Numpad handler error:', error);
    }
  }, [winner, inputA, inputB, question, difficulty, config?.timesUp]);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (winner || config?.timesUp) return;
      if (e.key >= '0' && e.key <= '9') {
        handlePad('A', e.key);
      } else if (e.key === 'Backspace') {
        handlePad('A', 'X');
      } else if (e.key === 'Enter') {
        handlePad('A', 'ok');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePad, winner, config?.timesUp]);

  const scoreDiff = scores[1] - scores[0];
  const rawRopePos = 50 + scoreDiff * (40 / TARGET_SCORE);
  const ropePos = Math.max(5, Math.min(95, rawRopePos));

  const timeLeft   = config?.timeLeft ?? 0;
  const timeLimit  = config?.timeLimit ?? 1;
  const timerProgress = timeLimit ? Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100)) : 0;
  const timerMM = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const timerSS = (timeLeft % 60).toString().padStart(2, '0');
  const isTimerWarning = timeLeft <= 30 && timeLeft > 0;

  /* ── WINNER SCREEN ── */
  if (winner) {
    return (
      <div className="tow-container" style={{ backgroundImage: `url(${tugBGSrc})` }}>
        <div className="tow-overlay" />
        <div className="tow-win-bg">
          <div className="tow-win-card">
            <div className="tow-win__trophy">{winner === 'Tie' ? '🤝' : '🏆'}</div>
            <div className="tow-win__title">{winner === 'Tie' ? "It's a Tie!" : `${winner} Wins!`}</div>
            <div className="tow-win__scores">{scores[0]} – {scores[1]}</div>
            <div className="tow-win__btns">
              {config?.onPlayAgain && (
                <button className="tow-win__btn tow-win__btn--play" onClick={config.onPlayAgain}>
                  ▶ Play Again
                </button>
              )}
              {config?.onNewTimer && (
                <button className="tow-win__btn tow-win__btn--lvl" onClick={config.onNewTimer}>
                  Choose Level
                </button>
              )}
              <button className="tow-win__btn tow-win__btn--close" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── MAIN GAME SCREEN ── */
  return (
    <div className="tow-container" style={{ backgroundImage: `url(${tugBGSrc})` }}>
      <div className="tow-overlay" />
      <div className="tow-content">

        {/* ─── TOP: Hero image + Rope Track ─── */}
        <div className="tow-top">
          <div className="tow-hero-container">
            <img
              src={heroSrc}
              alt="Teams Pulling Rope"
              className="tow-hero-img"
              style={{ transform: `translateX(${(ropePos - 50) * 0.8}%)` }}
            />
          </div>

          <div className="tow-rope-track-section">
            <div className="tow-team-label tow-team-label--a">{teamAName}</div>
            <div className="tow-rope-track">
              <div className="tow-rope-fill tow-rope-fill--a" style={{ width: `${100 - ropePos}%` }} />
              <div className="tow-rope-fill tow-rope-fill--b" style={{ width: `${ropePos}%` }} />
              <div className="tow-rope-knot" style={{ left: `${ropePos}%` }} />
            </div>
            <div className="tow-team-label tow-team-label--b">{mode === 'robot' ? 'Robot' : teamBName}</div>
          </div>
        </div>

        {/* ─── BOTTOM: Left Pad + Center (Question + Timer) + Right Pad ─── */}
        <div className="tow-game-area">
          {/* Left Pad (Team A - Blue) */}
          <TugNumPad
            team="A"
            input={inputA}
            flash={flashA}
            score={scores[0]}
            onKeyPress={(k) => handlePad('A', k)}
          />

          {/* Center: Question + Timer */}
          <div className="tow-center">
            <div className="tow-q-box">
              <div className="tow-q-tab">
                <span className="tow-q-tab-line" />
                <span className="tow-q-tab-text">Solve It</span>
                <span className="tow-q-tab-line" />
              </div>
              <div className="tow-q-equation">
                {question.eq} = <span className="tow-q-mark">?</span>
              </div>
            </div>

            {config?.timeLimit != null && !config?.timesUp && (
              <div className="tow-timer-wrap">
                <div className={`tow-timer ${isTimerWarning ? 'tow-timer--warn' : ''}`}>
                  <div
                    className="tow-timer__arc"
                    style={{
                      background: `conic-gradient(${isTimerWarning ? '#EF4444' : '#F59E0B'} ${timerProgress}%, transparent ${timerProgress}%)`,
                    }}
                  />
                  <div className="tow-timer__inner">
                    <div className="tow-timer__icon">⏱</div>
                    <div className="tow-timer__digits">{timerMM}:{timerSS}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Pad (Team B - Orange) */}
          {mode === 'team' ? (
            <TugNumPad
              team="B"
              input={inputB}
              flash={flashB}
              score={scores[1]}
              onKeyPress={(k) => handlePad('B', k)}
            />
          ) : (
            <RobotPanel score={scores[1]} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TugOfWar;
