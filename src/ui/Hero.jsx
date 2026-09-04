import React from "react";
import hero from "../assets/hero-images.png";

const Hero = ({ onShowGames }) => {
  return (
    <div className="w-full min-h-[calc(100vh-120px)] flex items-center justify-center bg-white px-6 py-12 md:py-20 font-sans mt-8">
      <div className="max-w-7xl mx-auto flex md:flex-row items-center gap-12 lg:gap-20">
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative group">
            {/* Decorative background glow for the image */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-300 to-orange-500 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition duration-700 ease-in-out"></div>

            {/* The rounded image */}
            <img
              src={hero}
              alt="Nebuloid Hero"
              className="relative w-72 h-72 md:w-[450px] md:h-[450px] object-cover rounded-full shadow-2xl border-4 border-white transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* Right Side: Text & Buttons */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-600 font-bold text-sm tracking-wide mb-2 border border-amber-200">
            NEW RELEASE
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-black">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              NEBULOID
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-lg font-medium leading-relaxed">
            NEBULOID is a competitive multiplayer strategy card game where every
            move counts. Master your deck, outsmart opponents, and conquer the
            galaxy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto">
            <button
              onClick={onShowGames}
              className="px-8 py-3.5 bg-black text-white font-bold rounded-xl hover:bg-amber-500 hover:text-black shadow-lg shadow-black/20 hover:shadow-amber-500/40 transition-all duration-300 transform hover:-translate-y-1"
            >
              Play Now
            </button>
            <button
              onClick={onShowGames}
              className="px-8 py-3.5 bg-white text-black font-bold rounded-xl border-2 border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore All Games
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
