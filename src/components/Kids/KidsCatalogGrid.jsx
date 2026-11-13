import React, { useState, useMemo } from "react";
import ProductCard from "../common/ProductCard";

const KIDS_CATALOG_PRODUCTS = [
  // ─── T-SHIRTS ───
  {
    _id: "kc-t-1",
    id: "kc-t-1",
    name: "KID'S WHITE SLIM FIT PRINTED T-SHIRTS",
    category: "t-shirts",
    ageGroup: "4-6",
    price: 799,
    originalPrice: 1199,
    front: "/images/Kids/K2.jpg",
    back: "/images/Kids/K3.jpeg",
    isSoldOut: true,
    sizes: ["4-5Y", "5-6Y"],
  },
  {
    _id: "kc-t-2",
    id: "kc-t-2",
    name: "JUNIOR EVERYDAY ACTIVE STRIPED TEE",
    category: "t-shirts",
    ageGroup: "7-9",
    price: 699,
    originalPrice: 999,
    front: "/images/Kids/K3.jpeg",
    back: "/images/Kids/K2.jpg",
    isSoldOut: false,
    sizes: ["7-8Y", "8-9Y"],
  },
  {
    _id: "kc-t-3",
    id: "kc-t-3",
    name: "BOYS GRAPHIC LOGO SUMMER CREW TEE",
    category: "t-shirts",
    ageGroup: "10-12",
    price: 849,
    originalPrice: 1299,
    front: "/images/Kids/K7.jpg",
    back: "/images/Kids/K8.jpg",
    isSoldOut: false,
    sizes: ["10-11Y", "11-12Y"],
  },

  // ─── SHIRTS ───
  {
    _id: "kc-s-1",
    id: "kc-s-1",
    name: "BOYS CASUAL DENIM INDIGO SHIRT",
    category: "shirts",
    ageGroup: "4-6",
    price: 1299,
    originalPrice: 1899,
    front: "/images/Kids/kids-boy.jpg",
    back: "/images/Kids/K1.jpg",
    isSoldOut: false,
    sizes: ["4-5Y", "5-6Y"],
  },
  {
    _id: "kc-s-2",
    id: "kc-s-2",
    name: "KID'S NAVY PRINTED RESORT SUMMER SHIRT",
    category: "shirts",
    ageGroup: "7-9",
    price: 999,
    originalPrice: 1499,
    front: "/images/Kids/K1.jpg",
    back: "/images/Kids/kids-boy.jpg",
    isSoldOut: true,
    sizes: ["7-8Y", "8-9Y"],
  },
  {
    _id: "kc-s-3",
    id: "kc-s-3",
    name: "JUNIOR CRISP WHITE COTTON OXFORD SHIRT",
    category: "shirts",
    ageGroup: "13-14",
    price: 1199,
    originalPrice: 1699,
    front: "/images/Kids/K9.jpg",
    back: "/images/Kids/K1.jpg",
    isSoldOut: false,
    sizes: ["13-14Y"],
  },

  // ─── JEANS & JOGGERS ───
  {
    _id: "kc-j-1",
    id: "kc-j-1",
    name: "BOYS COMFORT STRETCH BLUE DENIM JEANS",
    category: "jeans",
    ageGroup: "4-6",
    price: 1399,
    originalPrice: 1999,
    front: "/images/Kids/K4.jpg",
    back: "/images/Kids/K5.jpg",
    isSoldOut: false,
    sizes: ["22", "24"],
  },
  {
    _id: "kc-j-2",
    id: "kc-j-2",
    name: "KID'S VINTAGE WASH CARGO JOGGER PANTS",
    category: "joggers",
    ageGroup: "7-9",
    price: 1199,
    originalPrice: 1699,
    front: "/images/Kids/K5.jpg",
    back: "/images/Kids/K4.jpg",
    isSoldOut: true,
    sizes: ["24", "26"],
  },
  {
    _id: "kc-j-3",
    id: "kc-j-3",
    name: "JUNIOR RAW INDIGO SLIM FIT JEANS",
    category: "jeans",
    ageGroup: "10-12",
    price: 1499,
    originalPrice: 2199,
    front: "/images/Kids/KB4.jpg",
    back: "/images/Kids/KB5.jpg",
    isSoldOut: false,
    sizes: ["26", "28"],
  },
  {
    _id: "kc-j-4",
    id: "kc-j-4",
    name: "TEEN RELAXED TAPERED BLACK JEANS",
    category: "jeans",
    ageGroup: "15-16",
    price: 1599,
    originalPrice: 2299,
    front: "/images/Kids/KB6.jpg",
    back: "/images/Kids/KB7.jpg",
    isSoldOut: true,
    sizes: ["28", "30"],
  },

  // ─── SHORTS ───
  {
    _id: "kc-sh-1",
    id: "kc-sh-1",
    name: "KID'S EVERYDAY COMFORT COTTON SHORTS",
    category: "shorts",
    ageGroup: "4-6",
    price: 699,
    originalPrice: 999,
    front: "/images/Kids/K8.jpg",
    back: "/images/Kids/K9.jpg",
    isSoldOut: false,
    sizes: ["4-5Y", "5-6Y"],
  },
  {
    _id: "kc-sh-2",
    id: "kc-sh-2",
    name: "BOYS UTILITY CARGO DENIM SHORTS",
    category: "shorts",
    ageGroup: "7-9",
    price: 799,
    originalPrice: 1199,
    front: "/images/Kids/KB8.jpg",
    back: "/images/Kids/KB9.jpg",
    isSoldOut: true,
    sizes: ["7-8Y", "8-9Y"],
  },
];

export default function KidsCatalogGrid({ selectedAge }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeAgeFilter, setActiveAgeFilter] = useState(selectedAge || "all");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = useMemo(() => {
    let list = [...KIDS_CATALOG_PRODUCTS];

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (activeAgeFilter !== "all") {
      list = list.filter((p) => p.ageGroup === activeAgeFilter);
    }

    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [activeCategory, activeAgeFilter, sortBy]);

  return (
    <section id="kids-catalog" className="w-full py-14 sm:py-16 bg-[#fafafa] scroll-mt-20">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-neutral-900 font-display">
              SHOP ALL JUNIOR STYLES
            </h2>
            <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">
              Curated everyday comfort & trendsetting junior looks
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            {[
              { id: "all", label: "ALL" },
              { id: "t-shirts", label: "T-SHIRTS" },
              { id: "shirts", label: "SHIRTS" },
              { id: "jeans", label: "JEANS" },
              { id: "joggers", label: "JOGGERS" },
              { id: "shorts", label: "SHORTS" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all rounded-full cursor-pointer whitespace-nowrap ${
                  activeCategory === tab.id
                    ? "bg-[#08266B] text-white shadow-xs"
                    : "bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs uppercase tracking-wider font-semibold border-b border-black py-1 px-1 bg-transparent outline-none cursor-pointer"
            >
              <option value="featured">FILTER &amp; SORT: FEATURED</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
              <option value="name">NAME (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Age Quick Selector Bar */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs uppercase tracking-wider font-bold text-neutral-500 mr-2 shrink-0">
            AGE FILTER:
          </span>
          {[
            { id: "all", label: "ALL AGES" },
            { id: "4-6", label: "4-6 YRS" },
            { id: "7-9", label: "7-9 YRS" },
            { id: "10-12", label: "10-12 YRS" },
            { id: "13-14", label: "13-14 YRS" },
            { id: "15-16", label: "15-16 YRS" },
          ].map((age) => (
            <button
              key={age.id}
              onClick={() => setActiveAgeFilter(age.id)}
              className={`px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-xs transition-colors cursor-pointer shrink-0 ${
                activeAgeFilter === age.id
                  ? "bg-black text-white"
                  : "bg-neutral-200/70 text-neutral-700 hover:bg-neutral-300"
              }`}
            >
              {age.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid (3 to 4 columns matching Killer Jeans) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
}

