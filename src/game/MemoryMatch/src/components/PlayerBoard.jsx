import React, { useState, useEffect, useCallback, useRef } from "react";
import GameBoard from "./GameBoard";
import { createCards, DIFFICULTY_CONFIG } from "../utils/createCards";

const PlayerBoard = ({ teamName, difficulty, disabled, onMatch, teamColor, isRobot }) => {
  const [cards, setCards] = useState(() => createCards(difficulty));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const timeoutRef = useRef(null);

  // If the board is cleared, wait a second and reset it with new cards
  useEffect(() => {
    if (cards.length > 0 && matchedCards.length === cards.length) {
      const timer = setTimeout(() => {
        setCards(createCards(difficulty));
        setFlippedCards([]);
        setMatchedCards([]);
        setMoves(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [matchedCards, cards.length, difficulty]);

  // Robot auto-play logic
  useEffect(() => {
    if (!isRobot || disabled || matchedCards.length === cards.length || cards.length === 0) return;

    const robotTimer = setInterval(() => {
      // Find a pair that hasn't been matched yet
      const unmatchedCards = cards.filter(c => !matchedCards.includes(c.id));
      if (unmatchedCards.length >= 2) {
        // Just pick the first card and find its match
        const first = unmatchedCards[0];
        const second = unmatchedCards.find(c => c.id !== first.id && c.val === first.val);
        
        if (first && second) {
          setFlippedCards([first.id, second.id]);
          setMoves(prev => prev + 1);
          
          setTimeout(() => {
            setMatchedCards(prev => [...prev, first.id, second.id]);
            setFlippedCards([]);
            if (onMatch) onMatch();
          }, 1000);
        }
      }
    }, 5000);

    return () => clearInterval(robotTimer);
  }, [isRobot, disabled, matchedCards, cards, onMatch]);

  const handleCardClick = useCallback(
    (card) => {
      if (disabled || isRobot) return;
      if (matchedCards.includes(card.id)) return;
      if (flippedCards.includes(card.id)) return;
      if (isChecking) return;
      if (flippedCards.length >= 2) return;

      const newFlippedCards = [...flippedCards, card.id];
      setFlippedCards(newFlippedCards);

      if (newFlippedCards.length === 2) {
        setMoves((prev) => prev + 1);

        const firstCard = cards.find((c) => c.id === newFlippedCards[0]);
        const secondCard = cards.find((c) => c.id === newFlippedCards[1]);

        if (firstCard.val === secondCard.val) {
          // Match!
          setMatchedCards((prev) => [...prev, firstCard.id, secondCard.id]);
          setFlippedCards([]);
          if (onMatch) onMatch();
        } else {
          // No match
          setIsChecking(true);
          timeoutRef.current = setTimeout(() => {
            setFlippedCards([]);
            setIsChecking(false);
            timeoutRef.current = null;
          }, 1000);
        }
      }
    },
    [cards, flippedCards, matchedCards, isChecking, disabled, onMatch]
  );

  const totalPairs = DIFFICULTY_CONFIG[difficulty]?.pairs || 4;
  const currentMatches = matchedCards.length / 2;

  return (
    <div 
      className="flex-1 flex flex-col items-center bg-white p-4 md:p-6 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden transition-all duration-300"
      style={{ boxShadow: `0 10px 30px -10px ${teamColor}30` }}
    >
      <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: teamColor }}></div>
      
      <h2 
        className="text-xl md:text-2xl font-black uppercase tracking-[0.15em] mb-4 md:mb-6 text-center" 
        style={{ color: teamColor, textShadow: `0 2px 10px ${teamColor}40` }}
      >
        {teamName}
      </h2>
      
      <div className="w-full flex justify-between items-center px-2 md:px-4 mb-6 text-xs md:text-sm font-bold text-gray-400 tracking-wider">
        <span className="flex items-center gap-1.5">
          MOVES: <strong className="text-gray-900 text-lg md:text-xl font-black">{moves}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          MATCHED: <strong style={{ color: teamColor }} className="text-lg md:text-xl font-black">{currentMatches}/{totalPairs}</strong>
        </span>
      </div>

      <div className="w-full flex-1 flex items-center justify-center">
        <GameBoard
          cards={cards}
          flippedCards={flippedCards}
          matchedCards={matchedCards}
          onCardClick={handleCardClick}
          disabled={disabled || isChecking}
          difficulty={difficulty}
        />
      </div>
    </div>
  );
};

export default PlayerBoard;
