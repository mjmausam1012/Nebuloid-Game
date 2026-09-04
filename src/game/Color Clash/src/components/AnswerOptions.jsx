import React from 'react';

export default function AnswerOptions({
  options = [],
  onSelectOption,
  disabled = false
}) {
  return (
    <div className="w-full max-w-md mx-auto z-10">

      {/* Answer Buttons Grid */}
      <div
        className={`grid gap-2.5 sm:gap-3 ${
          options.length <= 4
            ? 'grid-cols-2'
            : options.length === 5
            ? 'grid-cols-2 sm:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-3'
        }`}
      >
        {options.map((option, index) => {
          const hotkeyNumber = index + 1;
          const colorObj = option;

          return (
            <button
              key={`${colorObj.name}-${index}`}
              onClick={() => onSelectOption(colorObj.name)}
              disabled={disabled}
              className={`group relative overflow-hidden flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 border-black bg-white hover:bg-neutral-50 text-black transition-all duration-150 transform select-none shadow-sm ${
                disabled
                  ? 'opacity-60 cursor-not-allowed scale-[0.99]'
                  : 'hover:scale-[1.02] active:scale-[0.98] hover:shadow-md cursor-pointer'
              } ${
                options.length === 5 && index === 4
                  ? 'col-span-2 sm:col-span-1'
                  : ''
              }`}
              aria-label={`Select color ${colorObj.name} (Key ${hotkeyNumber})`}
            >
              {/* Color swatch circle + Name */}
              <div className="flex items-center gap-2.5 z-10">
                <span className="text-sm sm:text-base font-black tracking-wider text-black">
                  {colorObj.name}
                </span>
              </div>

              {/* Hotkey Badge */}
              <span
                className="z-10 px-1.5 py-0.5 rounded text-[11px] font-mono font-black bg-neutral-100 text-black border border-black/30 group-hover:bg-black group-hover:text-white transition-colors"
              >
                {hotkeyNumber}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

