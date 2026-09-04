import React, { useState } from "react";
import nebMemoryMatchImg from "../assets/gemini-memory-match.png";
import geminiTugOfWarImg from "../assets/gemini-tug-of-war.png";
import gemini2048Img from "../assets/gemini-2048.png";
import heroImg from "../assets/hero-images.png";
import race2048 from "../assets/2048-race-banner.png";

const gamesData = [
  {
    id: 1,
    title: "Tug of War",
    description:
      "A classic game of strength and strategy. Pull your opponents across the line and show your power!",
    image: geminiTugOfWarImg,
    category: "Action",
    badgeColor: "bg-red-50 text-red-600 border-red-200",
  },
  {
    id: 2,
    title: "Memory Match",
    description:
      "Test your memory! Find all the matching pairs before the time runs out. Great for brain training.",
    image: nebMemoryMatchImg,
    category: "Puzzle",
    badgeColor: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    id: 3,
    title: "2048 Race",
    description:
      "Race to 2048! Combine numbers to reach the target tile and claim victory in this fast-paced puzzle game.",
    image: gemini2048Img,
    category: "Puzzle",
    badgeColor: "bg-amber-50 text-amber-600 border-amber-200",
  },
  {
    id: 4,
    title: "Target Shooter",
    description:
      "Shoot the targets before they shoot you! Test your accuracy and speed in this fast-paced shooter game.",
    image: race2048,
    category: "Action",
    badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    id: 5,
    title: "Logo Quiz",
    description:
      "Guess the logos of the world's most famous brands. Test your knowledge across multiple exciting modes!",
    image: heroImg,
    category: "Trivia",
    badgeColor: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    id: 6,
    title: "Color Clash",
    description:
      "Challenge your brain with the Stroop effect! Match font colors while ignoring confusing text distractors.",
    image: heroImg,
    category: "Reflex",
    badgeColor: "bg-pink-50 text-pink-600 border-pink-200",
  },
  {
    id: 7,
    title: "Emoji Puzzle",
    description:
      "Decipher creative emoji combinations to solve riddles, unlock tricky stages, and earn official certificates.",
    image: heroImg,
    category: "Puzzle",
    badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-200",
  },
  {
    id: 8,
    title: "Memory Sequence",
    description:
      "Watch the illuminated tiles and listen to melodic notes. Repeat the sequence as it gets faster and longer!",
    image: heroImg,
    category: "Memory",
    badgeColor: "bg-violet-50 text-violet-600 border-violet-200",
  },
  {
    id: 9,
    title: "Reaction Rush",
    description:
      "Test your lightning-fast reaction speed! Tap rapidly when targets illuminate and rise to the leaderboard.",
    image: heroImg,
    category: "Reflex",
    badgeColor: "bg-rose-50 text-rose-600 border-rose-200",
  },
  {
    id: 10,
    title: "Stack Master",
    description:
      "Build the tallest tower in town! Perfectly align sliding blocks with precision timing and rhythm.",
    image: heroImg,
    category: "Arcade",
    badgeColor: "bg-cyan-50 text-cyan-600 border-cyan-200",
  },
  {
    id: 11,
    title: "Bomb Defusal",
    description:
      "Work against the intense countdown timer! Solve logic puzzles, cut wires, and defuse explosive devices.",
    image: heroImg,
    category: "Strategy",
    badgeColor: "bg-orange-50 text-orange-600 border-orange-200",
  },
  {
    id: 12,
    title: "Catch the Brand",
    description:
      "Catch falling Nebuloid Tech logos into the moving basket while dodging incorrect brand distractors!",
    image: heroImg,
    category: "Arcade",
    badgeColor: "bg-teal-50 text-teal-600 border-teal-200",
  },
];

const categories = ["All", "Action", "Puzzle", "Reflex", "Arcade", "Strategy", "Trivia", "Memory"];

const GameList = ({ onPlayGame }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredGames = selectedCategory === "All"
    ? gamesData
    : gamesData.filter((game) => game.category === selectedCategory);

  const handleGameClick = (game) => {
    if (onPlayGame) {
      onPlayGame(game.title);
    } else {
      alert(`Proceeding to next step for: ${game.title}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 font-sans">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
          Explore{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
            All Games ({gamesData.length})
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose from our complete collection of 12 exciting games and start
          your adventure today.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-black text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col transform hover:-translate-y-2"
          >
            {/* Image Container with Hover Effect */}
            <div
              className="relative w-full h-52 overflow-hidden cursor-pointer bg-slate-900"
              onClick={() => handleGameClick(game)}
            >
              {/* Overlay that appears on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                <span className="bg-amber-500 text-white font-bold py-2.5 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg flex items-center gap-2">
                  <span>▶</span>
                  <span>Play Now</span>
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
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${game.badgeColor || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                  {game.category}
                </span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow font-medium leading-relaxed">
                {game.description}
              </p>

              <button
                onClick={() => handleGameClick(game)}
                className="w-full py-3 bg-gray-50 hover:bg-black text-black hover:text-white font-bold rounded-xl border-2 border-gray-100 hover:border-black transition-all duration-300 cursor-pointer"
              >
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameList;
