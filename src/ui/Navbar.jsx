import React from "react";
import logo from "../assets/nebuloid-logo.png";

const Navbar = ({ onNavHome, onNavGames }) => {
  return (
    <>
      <div className="flex items-center justify-around p-4 mx-4">
        <div className="flex items-center justify-baseline cursor-pointer" onClick={onNavHome}>
          <img src={logo} alt="nebuloid-logo" className="h-12 w-auto" />
          {/* <span className='text-2xl font-bold'>Nebuloid</span> */}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-10 bg-black text-white font-bold w-[300px] rounded-xl p-2">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); if(onNavHome) onNavHome(); }}
            className="hover:text-amber-500 transition duration-300 ease-in-out"
          >
            Home
          </a>
          <a
            href="#"
            className="hover:text-amber-500 transition duration-300 ease-in-out"
          >
            About
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); if(onNavGames) onNavGames(); }}
            className="hover:text-amber-500 transition duration-300 ease-in-out"
          >
            Game
          </a>
        </div>
        <div>
          <button className="cursor-pointer bg-amber-500 px-6 py-2 rounded-xl text-white hover:text-black transition font-bold">
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
