import React from "react";

const Card = ({ card, isFlipped, isMatched, onClick, disabled }) => {
  const isRevealed = isFlipped || isMatched;
  
  const cardClass = `relative w-full aspect-[3/4] sm:aspect-square cursor-pointer transition-transform duration-300 transform [perspective:1000px] ${
    disabled || isMatched ? 'opacity-90 cursor-default' : 'hover:scale-[1.03] hover:shadow-lg'
  }`;

  const ariaLabel = isRevealed
    ? `${card.lbl} card`
    : "Hidden memory card";

  return (
    <button
      className={cardClass}
      onClick={() => onClick(card)}
      disabled={disabled || isMatched}
      aria-label={ariaLabel}
      type="button"
    >
      <div 
        className={`w-full h-full rounded-xl transition-all duration-500 [transform-style:preserve-3d] shadow-md border-2 ${
          isRevealed ? '[transform:rotateY(180deg)] border-transparent' : 'border-gray-200 hover:border-amber-400'
        }`}
      >
        {/* Front (Hidden state, showing logo/question mark) */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center">
          <span className="text-3xl md:text-4xl font-black text-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] opacity-80">?</span>
        </div>

        {/* Back (Revealed state, showing emoji) */}
        <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl flex items-center justify-center transition-colors duration-300 ${
          isMatched ? 'bg-amber-100 shadow-[inset_0_0_15px_rgba(245,158,11,0.3)]' : 'bg-white'
        }`}>
          <span className={`text-3xl sm:text-4xl filter drop-shadow-sm transition-transform duration-300 ${isMatched ? 'scale-110' : ''}`}>
            {card.lbl}
          </span>
        </div>
      </div>
    </button>
  );
};

export default React.memo(Card);
