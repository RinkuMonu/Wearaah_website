import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const categories = [
  {
    id: 1,
    image: "/images/Kids/1.png",
    title: "Boys Clothing",
    subtitle: "Refined shirts, smart blazers, and play-ready sets.",
    badge: "Up To 40% Off",
    col: "lg:col-span-1",
  },
  {
    id: 2,
    image: "/images/Kids/2.png",
    title: "Girls Clothing",
    subtitle: "Charming dresses, festive kurtas, and separates.",
    badge: "Up To 50% Off",
    col: "lg:col-span-1",
  },
  {
    id: 3,
    image: "/images/Kids/3.png",
    title: "Infants & Toddlers",
    subtitle: "Ultra-soft organic cotton essentials for sensitive skin.",
    badge: "Up To 30% Off",
    col: "lg:col-span-1",
  },
  {
    id: 4,
    image: "/images/Kids/4.png",
    title: "Cozy Winterwear",
    subtitle: "Lightweight cashmere sweaters and warm jackets.",
    badge: "Seasonal Edit",
    col: "lg:col-span-1",
  },
  {
    id: 5,
    image: "/images/Kids/6.png",
    title: "Artisan Footwear & Accessories",
    subtitle: "Orthopedic-cushioned shoes, leather slip-ons, and sneakers.",
    badge: "New In",
    col: "lg:col-span-2",
  },
];

export default function KidsCategories() {
  return (
    <section className="py-16 sm:py-24 bg-[#faf4f0] border-t border-[#f0e4d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="text-[11px] font-bold tracking-[0.25em] text-[#c5a059] uppercase mb-1">
            Wearaah Junior Atelier
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-900 mb-2">
            Kids Luxury Collections
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Find curated styles, breathable natural fabrics, and comfortable luxury essentials for little ones.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/productlist?category=kids`}
              className={`relative bg-white p-6 sm:p-8 hover:shadow-xl border border-neutral-200/80 rounded-xs transition-all duration-300 group overflow-hidden ${cat.col}`}
            >
              {/* Text */}
              <div className="max-w-[62%] relative z-10">
                <span className="inline-block bg-[#f4ebd9] text-[#93662b] px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
                  {cat.badge}
                </span>

                <h3 className="text-lg sm:text-xl font-serif font-normal text-neutral-900 mb-1 group-hover:text-[#c5a059] transition-colors">
                  {cat.title}
                </h3>

                <p className="text-neutral-500 text-xs sm:text-sm mb-4 leading-relaxed font-light">
                  {cat.subtitle}
                </p>

                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-900 group-hover:text-[#c5a059] transition-colors">
                  <span>Explore</span>
                  <FiArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>

              {/* Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute bottom-0 right-2 w-[42%] max-h-[85%] object-contain pointer-events-none transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
