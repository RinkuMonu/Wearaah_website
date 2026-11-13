import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiPlay } from "react-icons/fi";

export default function KidsOnTheMoveBanner() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative w-full min-h-[500px] sm:min-h-[620px] lg:min-h-[700px] bg-[#2d2e30] overflow-hidden flex items-center">
      {/* Background: Boys in Blue & Red Button-Down Shirts (Exact Screenshot 2) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/Kids/kid3.jpg"
          alt="Built for Kids On The Move"
          className="w-full h-full object-cover object-[center_25%]"
          onError={(e) => {
            e.currentTarget.src = "/images/Kids/2.png";
          }}
        />
        {/* Cinematic Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/60 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full py-16 flex flex-col items-center justify-center text-center">
        
        {/* Interactive Video Play Button (Exact Screenshot 2) */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white transition-transform duration-300 hover:scale-110 cursor-pointer shadow-2xl"
            aria-label="Play campaign video"
          >
            <FiPlay size={26} className="translate-x-0.5 fill-white text-white" />
          </button>
        </div>

        {/* Big Dual Typography: Uppercase + Stylized Lowercase (Exact Screenshot 2) */}
        <div className="select-none max-w-3xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-normal uppercase tracking-[0.2em] text-white/90 drop-shadow-md">
            BUILT FOR KIDS ON THE MOVE.
          </h2>

          <h3 className="mt-2 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black lowercase tracking-tight text-white leading-[0.95] drop-shadow-xl font-display">
            built for kids on the <span className="text-[#08266B] drop-shadow-md">move.</span>
          </h3>

          <div className="mt-8">
            <Link
              to="/productlist?gender=Kids"
              className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold text-white pb-2 border-b-2 border-[#08266B] hover:border-white transition-all inline-block drop-shadow-md"
            >
              EXPLORE NOW
            </Link>
          </div>
        </div>

      </div>

      {/* Video Modal if clicked */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold z-10 hover:text-[#08266B] cursor-pointer"
            >
              &times;
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Junior Wearaah Campaign"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}

