import React, { useState } from "react";
import { Link } from "react-router-dom";

const CALLOUTS = [
  {
    id: "temp",
    title: "TEMPERATURE REGULATION",
    desc: "Engineered breathable weave for all-season climate adaptation.",
    top: "45%",
    left: "58%",
    lineDirection: "right",
  },
  {
    id: "dry",
    title: "QUICK DRY",
    desc: "Advanced hydrophobic fibers disperse moisture 3x faster.",
    top: "72%",
    left: "42%",
    lineDirection: "left",
  },
  {
    id: "eco",
    title: "ECO FREINDLY",
    desc: "100% sustainably sourced BCI cotton with reduced water footprint.",
    top: "74%",
    left: "64%",
    lineDirection: "right",
  },
];

export default function MensFeatureSpotlight() {
  const [activeCallout, setActiveCallout] = useState(null);

  return (
    <section className="relative w-full min-h-[560px] sm:min-h-[660px] lg:min-h-[740px] bg-[#d3d3d5] overflow-hidden flex items-center">
      {/* Background: Model Leaning in Dark Sweatshirt & Jeans against Concrete Wall (Exact Screenshot 2) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/11.webp"
          alt="Style In Your Own Way"
          className="w-full h-full object-cover object-[center_30%]"
          onError={(e) => {
            e.currentTarget.src = "/images/10.webp";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full py-16 flex items-center">
        
        {/* Left Massive Block Typography (Matching Screenshot 2) */}
        <div className="max-w-md sm:max-w-lg select-none">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white/95 leading-[0.95] drop-shadow-lg font-display">
            STYLE<br />
            IN YOUR<br />
            OWN WAY
          </h2>
          <p className="mt-4 text-xs sm:text-sm uppercase tracking-[0.2em] text-white/80 font-medium drop-shadow-xs">
            Performance Denim &bull; Engineered Comfort
          </p>
          <div className="mt-6">
            <Link
              to="/productlist?category=jeans"
              className="px-6 py-2.5 bg-black/80 hover:bg-[#08266B] text-white text-xs uppercase tracking-widest font-semibold transition-all inline-block shadow-md backdrop-blur-xs"
            >
              DISCOVER DENIM
            </Link>
          </div>
        </div>

        {/* Interactive Feature Callout Pointers (Matching Screenshot 2) */}
        {CALLOUTS.map((c) => (
          <div
            key={c.id}
            style={{ top: c.top, left: c.left }}
            className="absolute hidden sm:flex items-center gap-2 group cursor-pointer z-20 -translate-x-1/2 -translate-y-1/2"
            onMouseEnter={() => setActiveCallout(c.id)}
            onMouseLeave={() => setActiveCallout(null)}
          >
            {/* Glowing Ring Pin */}
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-white opacity-75" />
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-[#08266B] shadow-lg flex items-center justify-center" />
            </div>

            {/* Dashed Connecting Line & Text (Exact Screenshot 2 styling) */}
            <div className={`flex items-center gap-1.5 ${c.lineDirection === "left" ? "flex-row-reverse" : "flex-row"}`}>
              <div className="w-8 md:w-12 border-t-2 border-dashed border-white/90 drop-shadow-xs" />
              <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-xs border border-white/30 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap shadow-md">
                {c.title}
              </div>
            </div>

            {/* Tooltip on Hover */}
            {activeCallout === c.id && (
              <div className="absolute top-8 left-0 w-48 bg-white text-neutral-900 text-[11px] p-2.5 shadow-xl border border-neutral-200 z-30 animate-fadeIn">
                <p className="font-semibold uppercase tracking-wider text-[10px] text-[#08266B] mb-1">
                  {c.title}
                </p>
                <p className="text-neutral-600 leading-relaxed font-normal">
                  {c.desc}
                </p>
              </div>
            )}
          </div>
        ))}

      </div>
    </section>
  );
}

