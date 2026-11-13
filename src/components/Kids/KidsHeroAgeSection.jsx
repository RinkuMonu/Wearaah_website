import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const AGE_GROUPS = [
  { id: "4-6", label: "4 TO 6 YEARS" },
  { id: "7-9", label: "7 TO 9 YEARS" },
  { id: "10-12", label: "10 TO 12 YEARS" },
  { id: "13-14", label: "13 TO 14 YEARS" },
  { id: "15-16", label: "15 TO 16 YEARS" },
];

export default function KidsHeroAgeSection({ onSelectAge, selectedAge }) {
  const [activeAge, setActiveAge] = useState(selectedAge || "4-6");

  const handleAgeClick = (id) => {
    setActiveAge(id);
    if (onSelectAge) onSelectAge(id);
    const catalogEl = document.getElementById("kids-catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full bg-white overflow-hidden border-b border-neutral-200">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[460px] lg:min-h-[520px]">
          
          {/* ─── LEFT: Typography & Description (Screenshot 1) ─── */}
          <div className="md:col-span-4 flex flex-col justify-center text-left z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-neutral-900 leading-[1.05] font-display">
              DISCOVER KIDS<br />
              <span className="text-[#08266B]">COLLECTION</span>
            </h1>

            <p className="mt-4 text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed max-w-sm">
              Fun, Comfy, and Ready to Wear Kidswear Made for Everyday Adventures.
            </p>

            <div className="mt-6 sm:mt-8">
              <a
                href="#kids-catalog"
                className="px-8 py-3 bg-black hover:bg-[#08266B] text-white text-xs uppercase tracking-widest font-semibold transition-all inline-block shadow-sm"
              >
                EXPLORE ALL
              </a>
            </div>
          </div>

          {/* ─── CENTER: Little Boy Sitting Visual (Screenshot 1) ─── */}
          <div className="md:col-span-5 flex items-center justify-center relative">
            <div className="relative w-72 sm:w-80 lg:w-96 aspect-[4/5] overflow-hidden">
              <img
                src="/images/Kids/kids-boy.jpg"
                alt="Junior Wearaah Kids Boy"
                className="w-full h-full object-contain object-bottom filter drop-shadow-lg transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/images/Kids/1.png";
                }}
              />
            </div>
          </div>

          {/* ─── RIGHT: Age Group Navigation Menu (Screenshot 1) ─── */}
          <div className="md:col-span-3 flex flex-col justify-center space-y-3 sm:space-y-4 text-left md:pl-4">
            {AGE_GROUPS.map((age) => {
              const isActive = activeAge === age.id;
              return (
                <button
                  key={age.id}
                  onClick={() => handleAgeClick(age.id)}
                  className={`group flex items-center gap-2 text-left text-sm sm:text-base lg:text-lg font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-[#08266B] translate-x-1"
                      : "text-neutral-400 hover:text-neutral-900"
                  }`}
                >
                  <span
                    className={`transition-all duration-200 ${
                      isActive
                        ? "text-[#08266B] font-black opacity-100 text-lg"
                        : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                    }`}
                  >
                    &gt;
                  </span>
                  <span className={isActive ? "border-b border-[#08266B] pb-0.5" : ""}>
                    {age.label}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

