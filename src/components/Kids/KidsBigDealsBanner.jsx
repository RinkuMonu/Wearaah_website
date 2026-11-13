import React from "react";
import { Link } from "react-router-dom";

export default function KidsBigDealsBanner() {
  const tickerItems = Array(12).fill("SALE OF THE SEASON");

  return (
    <section className="relative w-full bg-[#3d3d3d] overflow-hidden">
      {/* ─── Hero Visual & Typography (Exact Screenshot 3 & 4) ─── */}
      <div className="relative w-full min-h-[500px] sm:min-h-[620px] lg:min-h-[720px] flex items-end">
        
        {/* Background Image: Boy in Red Hooded Windbreaker Jacket */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/Kids/K6.jpg"
            alt="Big Deals For Little Stars"
            className="w-full h-full object-cover object-[center_20%]"
            onError={(e) => {
              e.currentTarget.src = "/images/Kids/3.png";
            }}
          />
          {/* Subtle gradient for bottom text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 pointer-events-none" />
        </div>

        {/* Top-Left Pill Tag: JUNIOR WEARAAH COLLECTION (Exact Screenshot 3) */}
        <div className="absolute top-8 sm:top-12 left-6 sm:left-12 lg:left-16 z-10">
          <span className="px-3 py-1.5 bg-[#08266B] text-white text-[11px] font-bold uppercase tracking-wider shadow-md inline-block">
            JUNIOR WEARAAH COLLECTION
          </span>
        </div>

        {/* Bottom Headline & CTA (Exact Screenshot 4) */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full pb-14 sm:pb-16 text-left">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05] drop-shadow-xl font-display max-w-2xl">
            BIG DEALS FOR LITTLE STARS,<br />
            STYLED JUST RIGHT.
          </h2>

          <div className="mt-6">
            <Link
              to="/productlist?gender=Kids&category=sale"
              className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold text-white pb-1.5 border-b-2 border-[#08266B] hover:border-white transition-all inline-block drop-shadow-md"
            >
              SHOP THE COLLECTION
            </Link>
          </div>
        </div>

      </div>

      {/* ─── Running Ticker Banner: SALE OF THE SEASON (Exact Screenshot 4) ─── */}
      <div className="w-full bg-black py-3 sm:py-3.5 border-t border-b border-neutral-800 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-marquee">
          {tickerItems.map((text, idx) => (
            <div key={idx} className="flex items-center shrink-0">
              <span className="text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.25em] text-white">
                {text}
              </span>
              <span className="mx-6 text-neutral-500 font-bold">&bull;</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

