import React from "react";
import { Link } from "react-router-dom";

export default function MensEnergyBanner() {
  return (
    <section className="relative w-full min-h-[500px] sm:min-h-[620px] lg:min-h-[700px] bg-[#9a9a9c] overflow-hidden flex items-center">
      {/* Background Model Photo: Cap, Duffle Bag, Streetwear Aesthetic (Exact Screenshot 3 & 4) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/15.jpg"
          alt="Limited Edition Menswear"
          className="w-full h-full object-cover object-[center_25%]"
          onError={(e) => {
            e.currentTarget.src = "/images/1.jpg";
          }}
        />
        {/* Editorial Film Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/40 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full py-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        
        {/* Left CTA: EXPLORE NOW (Exact Screenshot 3 & 4) */}
        <div className="mb-8 md:mb-12">
          <Link
            to="/productlist?category=mens&isTrending=true"
            className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold text-white pb-2 border-b-2 border-[#08266B] hover:border-white transition-all inline-block drop-shadow-md"
          >
            EXPLORE NOW
          </Link>
        </div>

        {/* Right Massive Headline: DONT MISSOUT! FEW PIECES LEFT */}
        <div className="text-right max-w-xl md:ml-auto">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.95] drop-shadow-lg font-display">
            DONT<br />
            MISSOUT!
          </h2>
          <span className="block mt-2 text-xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide text-white/90 drop-shadow-md">
            FEW PIECES LEFT
          </span>
          <p className="mt-3 text-xs sm:text-sm uppercase tracking-widest text-white/70 font-medium">
            Exclusive drops &bull; Limited season inventory
          </p>
        </div>

      </div>
    </section>
  );
}

