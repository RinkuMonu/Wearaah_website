import React, { useState, useMemo } from "react";
import ProductCard from "../common/ProductCard";

const MENS_PRODUCTS_DATA = [
  // ─── JEANS ───
  {
    _id: "m-j-1",
    id: "m-j-1",
    name: "MEN'S BLUE SLIM FIT JEANS",
    category: "jeans",
    price: 3599,
    originalPrice: 4499,
    front: "/images/jeans.jpg",
    back: "/images/11.webp",
    isSoldOut: true,
    sizes: ["30", "32", "34", "36"],
  },
  {
    _id: "m-j-2",
    id: "m-j-2",
    name: "MEN'S DARK GREY SKINNY FIT JEANS",
    category: "jeans",
    price: 3299,
    originalPrice: 4199,
    front: "/images/10.webp",
    back: "/images/12.webp",
    isSoldOut: true,
    sizes: ["30", "32", "34", "36"],
  },
  {
    _id: "m-j-3",
    id: "m-j-3",
    name: "MEN'S RAW INDIGO SLIM JEANS",
    category: "jeans",
    price: 3799,
    originalPrice: 4699,
    front: "/images/21.webp",
    back: "/images/22.webp",
    isSoldOut: false,
    sizes: ["30", "32", "34", "36"],
  },
  {
    _id: "m-j-4",
    id: "m-j-4",
    name: "MEN'S VINTAGE WASH TAPERED JEANS",
    category: "jeans",
    price: 3699,
    originalPrice: 4599,
    front: "/images/22.webp",
    back: "/images/21.webp",
    isSoldOut: true,
    sizes: ["30", "32", "34", "36"],
  },

  // ─── T-SHIRTS ───
  {
    _id: "m-t-1",
    id: "m-t-1",
    name: "MEN'S OLIVE SOLID SLIM FIT T-SHIRTS",
    category: "t-shirts",
    price: 1399,
    originalPrice: 1999,
    front: "/images/tee1.jpg",
    back: "/images/plain.webp",
    isSoldOut: true,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    _id: "m-t-2",
    id: "m-t-2",
    name: "MEN'S GREY PRINTED SLIM FIT T-SHIRTS",
    category: "t-shirts",
    price: 1399,
    originalPrice: 1999,
    front: "/images/printed.webp",
    back: "/images/plain.webp",
    isSoldOut: true,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    _id: "m-t-3",
    id: "m-t-3",
    name: "MEN'S BLUE PRINTED SLIM FIT T-SHIRTS",
    category: "t-shirts",
    price: 1399,
    originalPrice: 1999,
    front: "/images/tshirts.avif",
    back: "/images/printed.webp",
    isSoldOut: false,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    _id: "m-t-4",
    id: "m-t-4",
    name: "MEN'S CHARCOAL MINIMAL POCKET T-SHIRT",
    category: "t-shirts",
    price: 1499,
    originalPrice: 2099,
    front: "/images/polo.webp",
    back: "/images/plain.webp",
    isSoldOut: true,
    sizes: ["S", "M", "L", "XL"],
  },

  // ─── SHIRTS ───
  {
    _id: "m-s-1",
    id: "m-s-1",
    name: "MEN'S CRISP WHITE LINEN PLAIN SHIRT",
    category: "shirts",
    price: 2499,
    originalPrice: 3499,
    front: "/images/1.jpg",
    back: "/images/2.jpg",
    isSoldOut: true,
    sizes: ["38", "40", "42", "44"],
  },
  {
    _id: "m-s-2",
    id: "m-s-2",
    name: "MEN'S SKY BLUE OXFORD COTTON SHIRT",
    category: "shirts",
    price: 2299,
    originalPrice: 3199,
    front: "/images/2.jpg",
    back: "/images/1.jpg",
    isSoldOut: false,
    sizes: ["38", "40", "42", "44"],
  },
  {
    _id: "m-s-3",
    id: "m-s-3",
    name: "MEN'S MIDNIGHT BLACK SOLID CASUAL SHIRT",
    category: "shirts",
    price: 2599,
    originalPrice: 3599,
    front: "/images/4.jpg",
    back: "/images/5.jpg",
    isSoldOut: true,
    sizes: ["38", "40", "42", "44"],
  },
  {
    _id: "m-s-4",
    id: "m-s-4",
    name: "MEN'S NAVY BLUE MANDARIN COLLAR SHIRT",
    category: "shirts",
    price: 2499,
    originalPrice: 3499,
    front: "/images/shirts.avif",
    back: "/images/3.jpg",
    isSoldOut: false,
    sizes: ["38", "40", "42", "44"],
  },

  // ─── TROUSERS ───
  {
    _id: "m-tr-1",
    id: "m-tr-1",
    name: "MEN'S PLEATED RELAXED WOOL TROUSER",
    category: "trousers",
    price: 3499,
    originalPrice: 4999,
    front: "/images/3.jpg",
    back: "/images/4.jpg",
    isSoldOut: false,
    sizes: ["30", "32", "34", "36"],
  },
  {
    _id: "m-tr-2",
    id: "m-tr-2",
    name: "MEN'S SARTORIAL CHINO TROUSERS",
    category: "trousers",
    price: 2799,
    originalPrice: 5599,
    front: "/images/12.webp",
    back: "/images/13.webp",
    isSoldOut: true,
    sizes: ["30", "32", "34", "36"],
  },
];

export default function MensCollectionGrid() {
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = useMemo(() => {
    let list = [...MENS_PRODUCTS_DATA];
    if (activeTab !== "all") {
      list = list.filter((p) => p.category === activeTab);
    }
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [activeTab, sortBy]);

  return (
    <section className="w-full py-14 sm:py-16 bg-[#fafafa]">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-neutral-900 font-display">
              SHOP ALL MEN'S STYLES
            </h2>
            <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">
              Curated precision tailoring & everyday essentials
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            {[
              { id: "all", label: "ALL" },
              { id: "jeans", label: "JEANS" },
              { id: "t-shirts", label: "T-SHIRTS" },
              { id: "shirts", label: "SHIRTS" },
              { id: "trousers", label: "TROUSERS" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all rounded-full cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
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

