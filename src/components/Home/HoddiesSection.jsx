import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fatchSubCategory } from "../../features/subCategory/subCategorySlice";
import { FiArrowRight } from "react-icons/fi";
import { resolveImageUrl } from "../../utils/resolveImage";

const FALLBACK_MOST_SELLING = [
  {
    _id: "ms-1",
    name: "Tailored Blazers",
    slug: "tailored-blazers",
    subtitle: "Precision Italian Fit",
    image: "/images/1.jpg",
    bgColor: "bg-neutral-50",
  },
  {
    _id: "ms-2",
    name: "Luxury Formal Trousers",
    slug: "luxury-formal-trousers",
    subtitle: "Razor-Sharp Pleats",
    image: "/images/3.jpg",
    bgColor: "bg-[#f8f6f2]",
  },
  {
    _id: "ms-3",
    name: "Egyptian Cotton Shirts",
    slug: "egyptian-cotton-shirts",
    subtitle: "Crisp Pure Weaves",
    image: "/images/shirt1.jpg",
    bgColor: "bg-neutral-50",
  },
  {
    _id: "ms-4",
    name: "Artisan Denim & Jeans",
    slug: "artisan-denim-jeans",
    subtitle: "Selvedge Comfort Stretch",
    image: "/images/jeans.jpg",
    bgColor: "bg-[#f8f6f2]",
  },
  {
    _id: "ms-5",
    name: "Heritage Kurta Sets",
    slug: "heritage-kurta-sets",
    subtitle: "Ceremonial Silk & Linen",
    image: "/images/23.jpg",
    bgColor: "bg-neutral-50",
  },
  {
    _id: "ms-6",
    name: "Two-Piece Bespoke Suits",
    slug: "two-piece-bespoke-suits",
    subtitle: "Modern Sartorial Cut",
    image: "/images/4.jpg",
    bgColor: "bg-[#f8f6f2]",
  },
];

export default function HoddiesSection() {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "";
  const dispatch = useDispatch();
  const { subcategories } = useSelector((state) => state.subCategory || {});

  useEffect(() => {
    dispatch(fatchSubCategory());
  }, [dispatch]);

  const cleanImageUrl = (path) => {
    if (!path) return "/images/placeholder.png";
    if (path.startsWith("http") || path.startsWith("/images/")) return path;
    const base = BASE_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const displayCategories = React.useMemo(() => {
    if (Array.isArray(subcategories) && subcategories.length > 0) {
      return subcategories.slice(0, 6).map((cat, idx) => ({
        _id: cat._id,
        name: cat.name,
        slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-"),
        subtitle: cat.subtitle || "Premium Craftsmanship",
        image: cat.smallimage ? cleanImageUrl(cat.smallimage) : "/images/1.jpg",
        bgColor: idx % 2 === 0 ? "bg-neutral-50" : "bg-[#f8f6f2]",
      }));
    }
    return FALLBACK_MOST_SELLING;
  }, [subcategories, BASE_URL]);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-neutral-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-normal text-neutral-900 uppercase tracking-[0.14em]">
              Most Selling Categories
            </h2>
            <p className="text-xs text-neutral-400 tracking-wider mt-1 uppercase">
              Browse Popular Categories
            </p>
          </div>
          <Link
            to="/productlist"
            className="text-xs font-normal uppercase tracking-[0.15em] text-neutral-900 hover:text-[#ED1C24] pb-0.5 border-b border-neutral-900 hover:border-[#ED1C24] transition-all inline-flex items-center gap-1.5"
          >
            <span>View All</span>
            <FiArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((category) => (
            <div
              key={category._id}
              className="bg-neutral-50 border border-neutral-200 p-6 hover:shadow-md hover:border-black transition-all duration-300 group"
            >
              <div className="flex items-center justify-between gap-4 h-full">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#ED1C24] font-normal uppercase tracking-[0.2em] block mb-1">
                    {category.subtitle}
                  </span>
                  <h3 className="text-base sm:text-lg font-normal uppercase text-black mb-4 leading-tight group-hover:text-[#ED1C24] transition-colors">
                    {category.name}
                  </h3>
                  <Link
                    to={
                      category._id?.startsWith("ms-")
                        ? `/productlist?category=${category.slug}`
                        : `/productlist?subCategoryId=${category._id}&subCategory=${category.slug}`
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-normal uppercase tracking-wider text-black border-b border-black pb-0.5 group-hover:border-[#ED1C24] group-hover:text-[#ED1C24] transition-colors"
                  >
                    <span>Shop Now</span>
                    <FiArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 overflow-hidden bg-white shadow-md border border-neutral-200">
                  <img
                    src={category.image}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={category.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/images/1.jpg";
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
