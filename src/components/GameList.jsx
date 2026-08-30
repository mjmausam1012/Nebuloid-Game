import React from "react";
import tugOfWarImg from "../assets/tug-of-war.png";
import memoryMatchImg from "../assets/memory-match.png";
import heroImg from "../assets/hero-images.png"; // Used as fallback
import race2048 from "../assets/2048-race-banner.png"

const gamesData = [
  {
    id: 1,
    title: "Tug of War",
    description:
      "A classic game of strength and strategy. Pull your opponents across the line and show your power!",
    image: tugOfWarImg,
    category: "Action",
  },
  {
    id: 2,
    title: "Memory Match",
    description:
      "Test your memory! Find all the matching pairs before the time runs out. Great for brain training.",
    image: memoryMatchImg,
    category: "Puzzle",
  },
  {
    id: 3,
    title: "2048 Race",
    description:
      "Race to 2048! Combine numbers to reach the target tile and claim victory in this fast-paced puzzle game.",
    image: race2048,
    category: "Puzzle",
  },
  {
    id: 4,
    title: "Space Invaders",
    description:
      "Defend the galaxy from an alien invasion in this modern take on a retro arcade shooter.",
    image: heroImg,
    category: "Arcade",
  },
  {
    id: 5,
    title: "Galactic Racing",
    description:
      "Race across the stars in high-speed, futuristic vehicles against players worldwide.",
    image: heroImg,
    category: "Racing",
  },
];

const GameList = ({ onPlayGame }) => {
  const handleGameClick = (game) => {
    if (onPlayGame) {
      onPlayGame(game.title);
    } else {
      // Fallback behavior if prop is not provided
      alert(`Proceeding to next step for: ${game.title}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 font-sans">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
          Explore{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
            All Games
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose from our collection of exciting multiplayer games and start
          your adventure today.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {gamesData.map((game) => (
          <div
            key={game.id}
            className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col transform hover:-translate-y-2"
          >
            {/* Image Container with Hover Effect */}
            <div
              className="relative w-full h-56 overflow-hidden cursor-pointer"
              onClick={() => handleGameClick(game)}
            >
              {/* Overlay that appears on hover */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                <span className="bg-amber-500 text-white font-bold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                  Play Now
                </span>
              </div>

              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Game Info */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                  {game.title}
                </h3>
                <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                  {game.category}
                </span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow font-medium leading-relaxed">
                {game.description}
              </p>

              <button
                onClick={() => handleGameClick(game)}
                className="w-full py-3 bg-gray-50 hover:bg-black text-black hover:text-white font-bold rounded-xl border-2 border-gray-100 hover:border-black transition-all duration-300"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameList;
