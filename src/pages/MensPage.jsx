import React, { useEffect } from "react";
import MensHeroSection from "../components/Mens/MensHeroSection";
import MensFeatureSpotlight from "../components/Mens/MensFeatureSpotlight";
import MensEnergyBanner from "../components/Mens/MensEnergyBanner";
import MensSplitShowcase from "../components/Mens/MensSplitShowcase";
import MensCollectionGrid from "../components/Mens/MensCollectionGrid";

export default function MensPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-white font-sans">
      {/* 1. Hero Section (Screenshot 1: "OWN YOUR STYLE ALL DAY AND NIGHT") */}
      <MensHeroSection />

      {/* 2. Feature Spotlight (Screenshot 2: "STYLE IN YOUR OWN WAY") */}
      <MensFeatureSpotlight />

      {/* 3. High-Energy Campaign Banner (Screenshot 3 & 4: "DONT MISSOUT! FEW PIECES LEFT") */}
      <MensEnergyBanner />

      {/* 4. Split Showcase (Screenshot 5: "PRINT THAT RULES" & Product Slider) */}
      <MensSplitShowcase />

      {/* 5. Complete Men's Catalog Grid */}
      <MensCollectionGrid />
    </div>
  );
}

