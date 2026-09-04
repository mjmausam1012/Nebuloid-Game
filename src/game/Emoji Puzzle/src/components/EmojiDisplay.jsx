import React, { useState, useEffect, useCallback, useMemo } from 'react';
import puzzles from '../data/puzzles';
import { soundFx } from '../utils/audio';
import {
  ArrowLeft,
  Lightbulb,
  Delete,
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star,
  ChevronRight,
  Award,
  Volume2,
  VolumeX,
  HelpCircle,
  User,
  X,
  RefreshCw,
  Home
} from 'lucide-react';
import CertificateModal from './CertificateModal';
import { saveCertificateToHistory } from '../utils/storage';

// Geometric Corner Accent: Top-Left Diagonal Stripes
const CornerStripesTopLeft = () => (
  <div className="absolute top-0 left-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 pointer-events-none select-none z-0">
    <svg viewBox="0 0 140 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="emoji-tl-clip">
          <polygon points="0,0 140,0 0,140" />
        </clipPath>
      </defs>
      <g clipPath="url(#emoji-tl-clip)">
        <polygon points="0,0 140,0 0,140" fill="#0a0a0a" />
        <line x1="-30" y1="10" x2="70" y2="110" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="-15" y1="25" x2="85" y2="125" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="0" y1="40" x2="100" y2="140" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="15" y1="55" x2="115" y2="155" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="30" y1="70" x2="130" y2="170" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  </div>
);

// Geometric Corner Accent: Bottom-Right Diagonal Stripes
const CornerStripesBottomRight = () => (
  <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 pointer-events-none select-none z-0">
    <svg viewBox="0 0 140 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="emoji-br-clip">
          <polygon points="140,140 0,140 140,0" />
        </clipPath>
      </defs>
      <g clipPath="url(#emoji-br-clip)">
        <polygon points="140,140 0,140 140,0" fill="#0a0a0a" />
        <line x1="10" y1="-30" x2="110" y2="70" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="25" y1="-15" x2="125" y2="85" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="40" y1="0" x2="140" y2="100" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="55" y1="15" x2="155" y2="115" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
        <line x1="70" y1="30" x2="170" y2="130" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  </div>
);

// Geometric Corner Accent: Dot Matrix Pattern
const DotGrid = ({ className = "" }) => {
  const rows = 4;
  const cols = 4;
  return (
    <div className={`grid grid-cols-4 gap-2 pointer-events-none select-none z-0 ${className}`}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-800/70" />
      ))}
    </div>
  );
};

// Helper to generate a scrambled letter pool with decoys
const generateLetterBank = (answer) => {
  const cleanAnswer = answer.toUpperCase().replace(/[^A-Z]/g, '');
  const answerLetters = cleanAnswer.split('');
  
  // Add 4-6 random decoy letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const decoys = [];
  const decoyCount = Math.max(4, 14 - answerLetters.length);
  
  for (let i = 0; i < decoyCount; i++) {
    const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
    decoys.push(randomChar);
  }

  const combined = [...answerLetters, ...decoys];
  // Shuffle array
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.map((letter, index) => ({
    id: `${letter}-${index}-${Math.random()}`,
    letter,
    used: false,
  }));
};

const EmojiDisplay = ({
  difficulty = 'easy',
  levelNumber = 1,
  userName = 'Player',
  onBackToLevels,
  onBackToHome,
  onLevelComplete,
  onGoToNextLevel,
  isMuted = false,
  onToggleMute,
}) => {
  const [randomSeed, setRandomSeed] = useState(() => Math.random());

  // Get 2 randomized puzzles for this difficulty
  const levelPuzzles = useMemo(() => {
    const diffPuzzles = puzzles.filter((p) => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    const shuffled = [...diffPuzzles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }, [difficulty, levelNumber, randomSeed]);

  const [currentStage, setCurrentStage] = useState(0); // 0 (1/2) or 1 (2/2)
  const currentPuzzle = levelPuzzles[currentStage] || levelPuzzles[0];

  // Game Play States
  const [letterBank, setLetterBank] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]); // array of { bankId, letter }
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [isShaking, setIsShaking] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [stageCleared, setStageCleared] = useState(false);
  const [levelCompletedModal, setLevelCompletedModal] = useState(false);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [candidateName, setCandidateName] = useState(userName || '');
  const [nameError, setNameError] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Split answer into words and structure
  const rawAnswer = currentPuzzle ? currentPuzzle.answer.toUpperCase() : '';
  const answerWords = useMemo(() => {
    return rawAnswer.split(' ').map((word) => word.split(''));
  }, [rawAnswer]);

  const totalLettersRequired = useMemo(() => {
    return rawAnswer.replace(/[^A-Z]/g, '').length;
  }, [rawAnswer]);

  // Initialize or reset stage
  const initStage = useCallback((puzzle) => {
    if (!puzzle) return;
    setLetterBank(generateLetterBank(puzzle.answer));
    setSelectedLetters([]);
    setFeedback(null);
    setStageCleared(false);
    setIsGameOver(false);
    setTimeLeft(60);
    setHintsUsed(0);
  }, []);

  // When stage or puzzle changes
  useEffect(() => {
    if (currentPuzzle) {
      initStage(currentPuzzle);
    }
  }, [currentPuzzle, initStage]);

  // Timer countdown with Game Over trigger
  useEffect(() => {
    if (stageCleared || levelCompletedModal || isGameOver || feedback === 'correct') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          soundFx.playGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stageCleared, levelCompletedModal, isGameOver, feedback]);

  // Check Answer Handler
  const validateAnswer = useCallback(
    (currentSelections) => {
      const currentString = currentSelections.map((s) => s.letter).join('');
      const targetString = rawAnswer.replace(/[^A-Z]/g, '');

      if (currentString.length === targetString.length) {
        if (currentString === targetString) {
          // CORRECT ANSWER!
          soundFx.playCorrect();
          setFeedback('correct');

          const speedBonus = Math.max(10, timeLeft * 2);
          const hintPenalty = hintsUsed * 20;
          const stageScore = Math.max(50, 100 + speedBonus - hintPenalty);
          setScore((prev) => prev + stageScore);

          setTimeout(() => {
            if (currentStage === 0 && levelPuzzles.length > 1) {
              // Move to Stage 2
              setStageCleared(true);
            } else {
              // Level Completed!
              soundFx.playLevelComplete();
              setLevelCompletedModal(true);
              if (onLevelComplete) {
                const stars = hintsUsed === 0 && timeLeft > 20 ? 3 : hintsUsed <= 1 ? 2 : 1;
                onLevelComplete(difficulty, levelNumber, stars, score + stageScore);
              }
            }
          }, 900);
        } else {
          // WRONG ANSWER
          soundFx.playWrong();
          setFeedback('wrong');
          setIsShaking(true);
          setTimeout(() => {
            setIsShaking(false);
            setFeedback(null);
          }, 1000);
        }
      }
    },
    [rawAnswer, timeLeft, hintsUsed, currentStage, levelPuzzles.length, onLevelComplete, difficulty, levelNumber, score]
  );

  // Handle letter bank selection
  const handleSelectLetter = useCallback(
    (bankItem) => {
      if (bankItem.used || feedback === 'correct' || stageCleared || isGameOver) return;
      if (selectedLetters.length >= totalLettersRequired) return;

      soundFx.playClick();

      // Mark letter as used in bank
      setLetterBank((prev) =>
        prev.map((item) => (item.id === bankItem.id ? { ...item, used: true } : item))
      );

      const nextSelections = [...selectedLetters, { bankId: bankItem.id, letter: bankItem.letter }];
      setSelectedLetters(nextSelections);

      if (nextSelections.length === totalLettersRequired) {
        validateAnswer(nextSelections);
      }
    },
    [feedback, stageCleared, isGameOver, selectedLetters, totalLettersRequired, validateAnswer]
  );

  // Handle removing a letter from slots
  const handleRemoveLetter = useCallback(
    (index) => {
      if (feedback === 'correct' || stageCleared || isGameOver) return;
      soundFx.playClick();

      const itemToRemove = selectedLetters[index];
      if (!itemToRemove) return;

      // Free up letter in bank
      setLetterBank((prev) =>
        prev.map((item) => (item.id === itemToRemove.bankId ? { ...item, used: false } : item))
      );

      const updated = selectedLetters.filter((_, i) => i !== index);
      setSelectedLetters(updated);
      setFeedback(null);
    },
    [feedback, stageCleared, isGameOver, selectedLetters]
  );

  // Handle Backspace (Delete last)
  const handleDeleteLast = useCallback(() => {
    if (selectedLetters.length === 0 || feedback === 'correct' || isGameOver) return;
    handleRemoveLetter(selectedLetters.length - 1);
  }, [selectedLetters, feedback, isGameOver, handleRemoveLetter]);

  // Handle Clear All
  const handleClearAll = useCallback(() => {
    if (selectedLetters.length === 0 || feedback === 'correct' || isGameOver) return;
    soundFx.playClick();
    setLetterBank((prev) => prev.map((item) => ({ ...item, used: false })));
    setSelectedLetters([]);
    setFeedback(null);
  }, [selectedLetters, feedback, isGameOver]);

  // Handle Hint (fills next empty correct letter - Max 3 characters)
  const handleHint = useCallback(() => {
    if (feedback === 'correct' || stageCleared || isGameOver || hintsUsed >= 3) return;
    const cleanAnswer = rawAnswer.replace(/[^A-Z]/g, '');
    const currentLength = selectedLetters.length;

    if (currentLength >= cleanAnswer.length) return;

    const nextCorrectLetter = cleanAnswer[currentLength];
    // Find available bank item matching nextCorrectLetter
    const availableBankItem = letterBank.find(
      (item) => !item.used && item.letter === nextCorrectLetter
    );

    if (availableBankItem) {
      soundFx.playHover();
      setHintsUsed((prev) => prev + 1);
      handleSelectLetter(availableBankItem);
    }
  }, [feedback, stageCleared, isGameOver, hintsUsed, rawAnswer, selectedLetters.length, letterBank, handleSelectLetter]);

  // Keyboard input listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stageCleared || levelCompletedModal || isGameOver || showExitDialog) return;

      if (e.key === 'Backspace') {
        handleDeleteLast();
      } else if (e.key === 'Escape') {
        setShowExitDialog(true);
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        const char = e.key.toUpperCase();
        const available = letterBank.find((item) => !item.used && item.letter === char);
        if (available) {
          handleSelectLetter(available);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [letterBank, selectedLetters, stageCleared, levelCompletedModal, isGameOver, showExitDialog, handleDeleteLast, handleSelectLetter]);

  // Next Stage Transition (from Stage 1 to Stage 2)
  const handleNextStage = () => {
    soundFx.playClick();
    setCurrentStage(1);
    setStageCleared(false);
  };

  // Play Again after Game Over
  const handlePlayAgain = () => {
    soundFx.playClick();
    setIsGameOver(false);
    setCurrentStage(0);
    setScore(0);
    setHintsUsed(0);
    setRandomSeed(Math.random());
  };

  // Get current filled letters mapped to word structure
  let letterCursor = 0;

  return (
    <div className="relative min-h-screen w-full bg-[#f8f9fa] flex flex-col justify-between items-center px-4 py-5 select-none font-['Outfit',sans-serif] overflow-x-hidden">
      {/* Decorative Geometric Corner Elements */}
      <CornerStripesTopLeft />
      <CornerStripesBottomRight />
      
      {/* Top Header Bar */}
      <header className="w-full max-w-2xl flex justify-between items-center z-20 border-b border-neutral-200/80 pb-3.5">
        {/* Back to Levels Button */}
        <button
          onClick={() => setShowExitDialog(true)}
          className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-neutral-900 bg-white border-2 border-neutral-900 px-3.5 py-1.5 rounded-xl hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Levels</span>
        </button>

        {/* Level & Stage Info Badge */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500">
              {difficulty}
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-black bg-neutral-200 px-2 py-0.5 rounded-md">
              LEVEL {levelNumber}
            </span>
          </div>

          {/* Stage 1 / 2 Indicator Dots */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] font-bold tracking-wider text-neutral-600 uppercase mr-1">
              STAGE {currentStage + 1}/2
            </span>
            <div className={`w-2 h-2 rounded-full transition-all ${currentStage === 0 ? 'bg-black scale-110' : 'bg-emerald-500'}`} />
            <div className={`w-2 h-2 rounded-full transition-all ${currentStage === 1 ? 'bg-black scale-110' : 'bg-neutral-300'}`} />
          </div>
        </div>

        {/* Score & Sound Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-black text-white px-3 py-1.5 rounded-xl text-xs font-extrabold tracking-wider flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{score}</span>
          </div>

          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-200 cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Game Play Area */}
      <main className="w-full max-w-xl flex flex-col items-center justify-center my-auto z-10 py-2">
        
        {/* Category Pill & Countdown Timer */}
        <div className="w-full flex justify-between items-center mb-3 px-2">
          {/* Category */}
          <div className="flex items-center gap-1.5 bg-white border border-neutral-300 px-3 py-1 rounded-full shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-800">
              CATEGORY: {currentPuzzle?.category || 'PUZZLE'}
            </span>
          </div>

          {/* Countdown Clock */}
          <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-colors ${
            timeLeft <= 10 ? 'bg-rose-100 text-rose-700 animate-pulse border border-rose-300 font-extrabold' : 'bg-neutral-200 text-neutral-800'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Emoji Display Box */}
        <div className="w-full bg-white border-2 border-neutral-900 rounded-2xl p-6 sm:p-8 shadow-md flex flex-col items-center relative overflow-hidden mb-5">
          {/* Inner Corner Diamonds */}
          <div className="absolute top-2.5 left-2.5 text-[8px] font-black text-neutral-900 select-none">◆</div>
          <div className="absolute top-2.5 right-2.5 text-[8px] font-black text-neutral-900 select-none">◆</div>
          <div className="absolute bottom-2.5 left-2.5 text-[8px] font-black text-neutral-900 select-none">◆</div>
          <div className="absolute bottom-2.5 right-2.5 text-[8px] font-black text-neutral-900 select-none">◆</div>

          {/* Ambient Top Tag */}
          <div className="text-[10px] font-black tracking-widest text-neutral-400 mb-1">
            {difficulty.toUpperCase()} • L{levelNumber} - S{currentStage + 1}
          </div>

          {/* Large Emoji Cards */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-2">
            {currentPuzzle?.emojis.map((emoji, index) => (
              <React.Fragment key={index}>
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-50 border-2 border-neutral-900 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-sm hover:scale-105 transition-transform duration-200">
                  <span className="filter drop-shadow-xs">{emoji}</span>
                </div>
                {index < currentPuzzle.emojis.length - 1 && (
                  <span className="text-2xl sm:text-3xl font-black text-neutral-400">
                    +
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Subtext Prompt */}
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mt-3 text-center">
            Decode the {currentPuzzle?.category.toLowerCase()} by solving the emoji clues
          </p>
        </div>

        {/* Answer Letter Slots (Grouped by Words) */}
        <div className={`w-full flex flex-wrap justify-center items-center gap-x-4 gap-y-3 mb-6 ${isShaking ? 'animate-shake' : ''}`}>
          {answerWords.map((word, wordIndex) => {
            return (
              <div key={wordIndex} className="flex items-center gap-1.5 sm:gap-2">
                {word.map((char, charIndex) => {
                  const isSpecialChar = !/^[A-Z]$/.test(char);
                  
                  if (isSpecialChar) {
                    return (
                      <span key={charIndex} className="text-xl font-black text-neutral-700 px-1">
                        {char}
                      </span>
                    );
                  }

                  const currentIndex = letterCursor;
                  letterCursor++;
                  const filledItem = selectedLetters[currentIndex];

                  return (
                    <button
                      key={charIndex}
                      onClick={() => filledItem && handleRemoveLetter(currentIndex)}
                      className={`w-10 h-12 sm:w-11 sm:h-13 rounded-xl border-2 font-black text-lg sm:text-xl flex items-center justify-center transition-all cursor-pointer ${
                        filledItem
                          ? feedback === 'correct'
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-105'
                            : feedback === 'wrong'
                            ? 'bg-rose-500 border-rose-600 text-white shadow-md'
                            : 'bg-black border-black text-white shadow-sm hover:bg-neutral-800 active:scale-95'
                          : 'bg-white border-neutral-300 border-dashed text-transparent'
                      }`}
                      title={filledItem ? 'Click to remove' : ''}
                    >
                      {filledItem ? filledItem.letter : ''}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Feedback Alert Pill */}
        <div className="h-6 mb-2 flex items-center justify-center">
          {feedback === 'correct' && (
            <div className="text-xs font-black tracking-wider uppercase text-emerald-600 flex items-center gap-1 animate-bounce">
              <CheckCircle2 className="w-4 h-4" /> Correct Answer!
            </div>
          )}
          {feedback === 'wrong' && (
            <div className="text-xs font-black tracking-wider uppercase text-rose-600 flex items-center gap-1 animate-pulse">
              <AlertCircle className="w-4 h-4" /> Not quite, try again!
            </div>
          )}
        </div>

        {/* Scrambled Letter Bank */}
        <div className="w-full bg-white border-2 border-neutral-300 rounded-2xl p-4 sm:p-5 shadow-xs mb-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 text-center mb-2.5">
            Tap letters or type on keyboard
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {letterBank.map((bankItem) => (
              <button
                key={bankItem.id}
                onClick={() => handleSelectLetter(bankItem)}
                disabled={bankItem.used || feedback === 'correct' || isGameOver}
                className={`w-9 h-11 sm:w-10 sm:h-12 rounded-xl font-extrabold text-sm sm:text-base transition-all flex items-center justify-center cursor-pointer ${
                  bankItem.used
                    ? 'bg-neutral-100 border border-neutral-200 text-neutral-300 cursor-not-allowed scale-90'
                    : 'bg-neutral-50 border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white active:scale-90 shadow-xs'
                }`}
              >
                {bankItem.letter}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls: Hint, Delete, Clear */}
        <div className="w-full flex justify-between items-center gap-2">
          {/* Hint Button (Max 3 Characters) */}
          <button
            onClick={handleHint}
            disabled={hintsUsed >= 3 || feedback === 'correct' || isGameOver}
            className={`flex-1 bg-white border-2 py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
              hintsUsed >= 3 || feedback === 'correct' || isGameOver
                ? 'border-neutral-200 text-neutral-300 bg-neutral-100 cursor-not-allowed opacity-50'
                : 'border-neutral-900 text-neutral-900 hover:bg-amber-50 hover:border-amber-600 hover:text-amber-700 active:scale-95 cursor-pointer'
            }`}
            title={hintsUsed >= 3 ? 'Maximum 3 hints reached' : `Use Hint (${3 - hintsUsed} left)`}
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Hint ({3 - hintsUsed}/3)</span>
          </button>

          {/* Delete Last Button */}
          <button
            onClick={handleDeleteLast}
            disabled={selectedLetters.length === 0 || feedback === 'correct' || isGameOver}
            className="flex-1 bg-white border-2 border-neutral-900 text-neutral-900 py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer shadow-2xs disabled:opacity-40"
          >
            <Delete className="w-4 h-4" />
            <span>Delete</span>
          </button>

          {/* Clear All Button */}
          <button
            onClick={handleClearAll}
            disabled={selectedLetters.length === 0 || feedback === 'correct' || isGameOver}
            className="flex-1 bg-white border-2 border-neutral-900 text-neutral-900 py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer shadow-2xs disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </main>

      {/* ========================================================== */}
      {/* MODAL 1: STAGE 1/2 CLEARED BANNER */}
      {/* ========================================================== */}
      {stageCleared && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-black rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-3 text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-[10px] font-black tracking-[0.25em] text-neutral-400 uppercase">
              STAGE 1 COMPLETED
            </div>
            <h3 className="text-xl font-black text-black uppercase tracking-tight mt-1">
              Awesome Solve!
            </h3>
            <p className="text-xs text-neutral-600 mt-2 mb-5">
              1 out of 2 puzzles cleared for <span className="font-bold text-black">{difficulty.toUpperCase()} Level {levelNumber}</span>. Ready for Stage 2?
            </p>

            <button
              onClick={handleNextStage}
              className="w-full bg-black text-white py-3 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-900 active:scale-95 transition-all cursor-pointer border-2 border-black"
            >
              <span>Play Stage 2 (2/2)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 2: LEVEL COMPLETED CELEBRATION */}
      {/* ========================================================== */}
      {levelCompletedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-black rounded-2xl w-full max-w-md p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
            {/* Top Trophy */}
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center text-3xl border-2 border-neutral-900 shadow-md">
                🏆
              </div>
            </div>

            <div className="text-[10px] font-black tracking-[0.3em] text-neutral-500 uppercase mt-2">
              {difficulty.toUpperCase()} DIFFICULTY
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mt-1">
              Level {levelNumber} Cleared!
            </h3>

            {/* Star Rating Display */}
            <div className="flex justify-center gap-2 my-4">
              <Star className="w-8 h-8 fill-amber-400 text-amber-500 drop-shadow-xs" />
              <Star className="w-8 h-8 fill-amber-400 text-amber-500 drop-shadow-xs" />
              <Star className={`w-8 h-8 ${hintsUsed === 0 ? 'fill-amber-400 text-amber-500' : 'text-neutral-300'}`} />
            </div>

            {/* Score & Candidate Details */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 mb-6 text-left">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-neutral-500 font-bold">SOLVER:</span>
                <span className="font-extrabold text-black uppercase">{userName}</span>
              </div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-neutral-500 font-bold">PUZZLES SOLVED:</span>
                <span className="font-extrabold text-emerald-600">2 / 2 (100%)</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1.5 border-t border-neutral-200">
                <span className="text-neutral-700 font-black">TOTAL LEVEL SCORE:</span>
                <span className="font-black text-base text-black">+{score} PTS</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5">
              {/* Generate Certificate Button (Opens Name Input Popup) */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  setNameError('');
                  setShowNamePopup(true);
                }}
                className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer border-2 border-emerald-700 shadow-md"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Generate Certificate</span>
              </button>

              {levelNumber < 5 ? (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    if (onGoToNextLevel) {
                      onGoToNextLevel(levelNumber + 1);
                    }
                  }}
                  className="w-full bg-black text-white py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-900 active:scale-95 transition-all cursor-pointer border-2 border-black shadow-sm"
                >
                  <span>Play Level {levelNumber + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-800 text-center mb-1">
                  🎉 Congratulations! You have mastered all 5 levels in {difficulty}!
                </div>
              )}

              <button
                onClick={() => {
                  soundFx.playClick();
                  onBackToLevels();
                }}
                className="w-full border-2 border-neutral-900 bg-white text-black py-3 rounded-xl font-extrabold text-xs uppercase tracking-widest hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
              >
                Back To Level Select
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 3: GAME OVER POPUP (Triggered when Timer Over) */}
      {/* ========================================================== */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-neutral-900 rounded-2xl w-full max-w-md p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
            
            {/* Clock Expired Icon */}
            <div className="w-16 h-16 rounded-full bg-rose-100 border-2 border-rose-500 flex items-center justify-center mx-auto mb-3 text-rose-600 animate-pulse">
              <Clock className="w-8 h-8" />
            </div>

            <div className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase">
              TIME EXPIRED
            </div>

            <h3 className="text-3xl font-black text-rose-600 uppercase tracking-tight mt-1">
              GAME OVER
            </h3>

            <p className="text-xs text-neutral-600 mt-2 mb-4">
              Time ran out on <span className="font-bold text-black">{difficulty.toUpperCase()} Level {levelNumber} (Stage {currentStage + 1}/2)</span>.
            </p>

            {/* Answer Reveal Box */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                THE CORRECT ANSWER WAS:
              </div>
              <div className="text-lg font-black text-black uppercase tracking-wide">
                {rawAnswer}
              </div>
              <div className="flex justify-center gap-2 text-2xl mt-2">
                {currentPuzzle?.emojis.map((emoji, idx) => (
                  <span key={idx}>{emoji}</span>
                ))}
              </div>
            </div>

            {/* Action Buttons: Play Again & Back to Home */}
            <div className="flex flex-col gap-2.5">
              {/* Play Again Button */}
              <button
                onClick={handlePlayAgain}
                className="w-full bg-black text-white py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-900 active:scale-95 transition-all cursor-pointer border-2 border-black shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Play Again</span>
              </button>

              {/* Back To Home Button */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  if (onBackToHome) {
                    onBackToHome();
                  } else {
                    onBackToLevels();
                  }
                }}
                className="w-full border-2 border-neutral-900 bg-white text-black py-3 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Back To Home</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 4: EXIT CONFIRMATION */}
      {/* ========================================================== */}
      {showExitDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-black rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl">
            <h4 className="text-base font-black uppercase tracking-wider text-black mb-1">
              Leave Current Level?
            </h4>
            <p className="text-xs text-neutral-600 mb-5">
              Your progress in this current level puzzle will be lost.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowExitDialog(false);
                  onBackToLevels();
                }}
                className="flex-1 bg-black text-white py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:bg-neutral-900 cursor-pointer"
              >
                Exit to Levels
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowExitDialog(false);
                }}
                className="flex-1 border-2 border-neutral-300 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                Keep Playing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 4.5: ENTER NAME FOR CERTIFICATE GENERATION */}
      {/* ========================================================== */}
      {showNamePopup && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-neutral-900 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setShowNamePopup(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-full bg-neutral-100 border-2 border-neutral-900 flex items-center justify-center mx-auto mb-3">
              <Award className="w-7 h-7 text-neutral-900" />
            </div>

            <div className="text-[10px] font-black tracking-[0.25em] text-neutral-400 uppercase">
              CERTIFICATE RECIPIENT
            </div>
            <h3 className="text-xl font-black text-black uppercase tracking-tight mt-1">
              Enter Your Name
            </h3>
            <p className="text-xs text-neutral-600 mt-1 mb-4">
              Enter the recipient name to be printed on your official Nebuloid Certificate.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = candidateName.trim();
                if (!trimmed) {
                  setNameError('Please enter your name');
                  soundFx.playWrong();
                  return;
                }
                soundFx.playLevelComplete();
                const earnedStars = hintsUsed === 0 && timeLeft > 20 ? 3 : hintsUsed <= 1 ? 2 : 1;
                
                // Save certificate to history!
                saveCertificateToHistory({
                  userName: trimmed,
                  difficulty,
                  levelNumber,
                  score,
                  stars: earnedStars,
                  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                  certificateId: `NT-EP-${Math.floor(100000 + Math.random() * 900000)}`,
                });

                setShowNamePopup(false);
                setShowCertificateModal(true);
              }}
              className="flex flex-col gap-3 text-left"
            >
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1">
                  Recipient / Candidate Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => {
                      setCandidateName(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    placeholder="e.g. Mausam"
                    autoFocus
                    maxLength={26}
                    className="w-full pl-9 pr-3.5 py-2.5 border-2 border-neutral-300 focus:border-black rounded-xl text-sm font-bold uppercase outline-none transition-colors"
                  />
                </div>
                {nameError && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1">
                    {nameError}
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-900 active:scale-95 transition-all cursor-pointer border-2 border-black shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Generate Certificate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 5: VERIFIED NEBULOID CERTIFICATE MODAL */}
      {/* ========================================================== */}
      <CertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        userName={candidateName || userName || 'Candidate'}
        difficulty={difficulty}
        levelNumber={levelNumber}
        score={score}
        stars={hintsUsed === 0 && timeLeft > 20 ? 3 : hintsUsed <= 1 ? 2 : 1}
      />
    </div>
  );
};

export default EmojiDisplay;