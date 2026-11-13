import React, { useState, useEffect } from "react";
import KidsHeroAgeSection from "../components/Kids/KidsHeroAgeSection";
import KidsOnTheMoveBanner from "../components/Kids/KidsOnTheMoveBanner";
import KidsBigDealsBanner from "../components/Kids/KidsBigDealsBanner";
import KidsSplitDripShowcase from "../components/Kids/KidsSplitDripShowcase";
import KidsCatalogGrid from "../components/Kids/KidsCatalogGrid";

export default function Kids() {
  const [selectedAge, setSelectedAge] = useState("all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelectAge = (ageId) => {
    setSelectedAge(ageId);
  };

  return (
    <div className="w-full bg-white font-sans">
      {/* 1. Hero Section (Screenshot 1: Discover Kids Collection + Age Group Menu) */}
      <KidsHeroAgeSection onSelectAge={handleSelectAge} selectedAge={selectedAge} />

      {/* 2. On The Move Campaign Banner (Screenshot 2: Built For Kids On The Move) */}
      <KidsOnTheMoveBanner />

      {/* 3. Big Deals & Season Ticker (Screenshot 3 & 4: Big Deals For Little Stars + Marquee) */}
      <KidsBigDealsBanner />

      {/* 4. Split Showcase (Screenshot 5: Find Your Next Drip & Product Slider) */}
      <KidsSplitDripShowcase />

      {/* 5. Complete Junior Catalog Grid */}
      <KidsCatalogGrid selectedAge={selectedAge} />
    </div>
  );
}
