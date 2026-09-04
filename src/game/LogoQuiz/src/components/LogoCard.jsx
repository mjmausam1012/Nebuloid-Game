import React, { useMemo } from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

/**
 * Multi-Mode Visual Distortion Logo Card (Monochrome & High-Contrast Theme)
 */
export default function LogoCard({
  question,
  isAnswered = false,
  isCorrect = false,
  hintActive = false,
}) {
  const { effect = 'blur', effectValue = 12, difficulty = 'easy', svg } = question || {};

  // Compute visual filter based on effect mode and hint status
  const filterStyles = useMemo(() => {
    if (isAnswered) {
      return {
        filter: 'none',
        clipPath: 'none',
        opacity: 1,
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    }

    switch (effect) {
      case 'blur': {
        const blurAmount = hintActive ? Math.max(3, effectValue * 0.35) : effectValue;
        return {
          filter: `blur(${blurAmount}px)`,
          transition: 'filter 0.3s ease-out',
        };
      }

      case 'grayscale': {
        const grayAmount = hintActive ? '40%' : '100%';
        const contrast = hintActive ? '110%' : '140%';
        return {
          filter: `grayscale(${grayAmount}) contrast(${contrast})`,
          transition: 'filter 0.3s ease-out',
        };
      }

      case 'silhouette': {
        if (hintActive) {
          return {
            filter: 'brightness(0.5) contrast(150%)',
            transition: 'filter 0.3s ease-out',
          };
        }
        return {
          filter: 'contrast(180%) brightness(0.2) drop-shadow(0 0 8px rgba(0, 0, 0, 0.4))',
          transition: 'filter 0.3s ease-out',
        };
      }

      case 'partial-reveal': {
        if (hintActive) {
          return {
            clipPath: 'circle(75% at 50% 50%)',
            transition: 'clip-path 0.4s ease-out',
          };
        }
        return {
          clipPath: 'circle(38% at 50% 50%)',
          transition: 'clip-path 0.4s ease-out',
        };
      }

      case 'pixelate': {
        return {
          filter: `blur(${hintActive ? 2 : 4}px) contrast(150%)`,
          transform: hintActive ? 'scale(1)' : 'scale(1.02)',
          transition: 'all 0.3s ease-out',
        };
      }

      default:
        return {};
    }
  }, [effect, effectValue, isAnswered, hintActive]);

  // Determine card border
  let cardBorder = 'border-2 border-black shadow-md';
  if (isAnswered) {
    cardBorder = isCorrect
      ? 'border-2 border-emerald-600 ring-4 ring-emerald-500/20 shadow-emerald-500/10'
      : 'border-2 border-rose-600 ring-4 ring-rose-500/20 shadow-rose-500/10';
  }

  // Effect labels
  const effectLabels = {
    blur: 'Blurred Vision',
    pixelate: 'Pixel Grid',
    mask: 'Hidden Tiles',
    silhouette: 'Silhouette Mode',
    grayscale: 'Monochrome',
    'partial-reveal': 'Partial Fragment',
  };

  return (
    <div
      className={`relative w-full max-w-xs sm:max-w-sm mx-auto h-56 sm:h-64 rounded-3xl bg-white p-4 sm:p-5 flex flex-col items-center justify-between transition-all duration-300 overflow-hidden ${cardBorder}`}
    >
      {/* Top Header: Difficulty Tier & Challenge Mode */}
      <div className="w-full flex items-center justify-between z-20">
        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-100 text-black border border-black">
          {difficulty}
        </span>

        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-black text-white text-[11px] font-black tracking-wide border border-black">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          {isAnswered ? 'Revealed' : effectLabels[effect] || 'Distorted'}
        </span>
      </div>

      {/* Center Display Area */}
      <div className="relative w-36 h-36 sm:w-44 sm:h-44 my-auto flex items-center justify-center rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 p-2 shadow-inner">
        {/* SVG Container with distortion applied */}
        {svg ? (
          <div
            className="w-full h-full flex items-center justify-center select-none [&>svg]:w-full [&>svg]:h-full [&>svg]:drop-shadow-sm"
            style={filterStyles}
            dangerouslySetInnerHTML={{ __html: svg }}
            aria-label="Hidden Brand Logo"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
            <HelpCircle className="w-8 h-8 animate-pulse text-black" />
            <span className="text-xs font-semibold">Loading Logo...</span>
          </div>
        )}

        {/* Pixelate Overlay Grid */}
        {effect === 'pixelate' && !isAnswered && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl opacity-35 mix-blend-overlay"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(0,0,0,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.2) 1px, transparent 1px)',
              backgroundSize: hintActive ? '8px 8px' : '14px 14px',
            }}
          />
        )}

        {/* Masking Geometric Blocks Overlay */}
        {effect === 'mask' && !isAnswered && (
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 pointer-events-none z-10 p-1.5">
            <div className="bg-slate-900 border border-black rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-white">❓</span>
            </div>
            <div
              className={`bg-slate-900 border border-black rounded-xl transition-all duration-300 flex items-center justify-center shadow-md ${
                hintActive ? 'opacity-0 scale-90' : 'opacity-100'
              }`}
            >
              <span className="text-lg font-bold text-white">❓</span>
            </div>
            <div
              className={`bg-slate-900 border border-black rounded-xl transition-all duration-300 flex items-center justify-center shadow-md ${
                hintActive ? 'opacity-0 scale-90' : 'opacity-100'
              }`}
            >
              <span className="text-lg font-bold text-white">❓</span>
            </div>
            <div className="bg-slate-900 border border-black rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-white">❓</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Hint / Brand Name Banner */}
      <div className="w-full text-center z-20">
        {hintActive && !isAnswered && (
          <span className="inline-block text-[10px] font-black uppercase tracking-wider text-black bg-amber-100 border border-black px-3 py-0.5 rounded-full animate-pulse">
            ⚡ Hint active: Distortion reduced
          </span>
        )}
        {isAnswered && (
          <span
            className={`inline-block text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider border-2 border-black ${
              isCorrect ? 'text-white bg-emerald-600' : 'text-white bg-rose-600'
            }`}
          >
            {question?.brand}
          </span>
        )}
      </div>
    </div>
  );
}
