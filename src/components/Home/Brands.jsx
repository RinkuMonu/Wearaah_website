import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fatchBrands } from "../../features/Brands/brandSlice";
import { FiArrowRight } from "react-icons/fi";

const FALLBACK_BRANDS = [
  {
    _id: "brand-1",
    name: "Wearaah Atelier",
    slug: "wearaah-atelier",
    logoText: "WEARAAH ATELIER",
    origin: "Bespoke & Tailoring",
    image: "/images/1.jpg",
  },
  {
    _id: "brand-2",
    name: "Milano Sartoria",
    slug: "milano-sartoria",
    logoText: "MILANO SARTORIA",
    origin: "Italian Fine Wool",
    image: "/images/2.jpg",
  },
  {
    _id: "brand-3",
    name: "Heritage Clothiers",
    slug: "heritage-clothiers",
    logoText: "HERITAGE & CO.",
    origin: "Classic Craft",
    image: "/images/3.jpg",
  },
  {
    _id: "brand-4",
    name: "Wearaah Studio",
    slug: "wearaah-studio",
    logoText: "STUDIO WEARAAH",
    origin: "Contemporary Essentials",
    image: "/images/4.jpg",
  },
  {
    _id: "brand-5",
    name: "Royal Chanderi",
    slug: "royal-chanderi",
    logoText: "ROYAL CHANDERI",
    origin: "Heritage Silk & Weaves",
    image: "/images/23.jpg",
  },
  {
    _id: "brand-6",
    name: "Onyx Denim Lab",
    slug: "onyx-denim-lab",
    logoText: "ONYX DENIM LAB",
    origin: "Artisan Japanese Selvedge",
    image: "/images/jeans.jpg",
  },
  {
    _id: "brand-7",
    name: "Knit & Loom",
    slug: "knit-and-loom",
    logoText: "KNIT & LOOM",
    origin: "Merino & Fine Cashmere",
    image: "/images/14.webp",
  },
  {
    _id: "brand-8",
    name: "Aura Essentials",
    slug: "aura-essentials",
    logoText: "AURA LUXE",
    origin: "Minimalist Modern",
    image: "/images/shirt1.jpg",
  },
];

const BrandsSection = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "";
  const dispatch = useDispatch();
  const { brands } = useSelector((state) => state.brands || {});

  useEffect(() => {
    dispatch(fatchBrands());
  }, [dispatch]);

  const cleanImageUrl = (path) => {
    if (!path) return "/images/placeholder.png";
    if (path.startsWith("http") || path.startsWith("/images/")) return path;
    const base = BASE_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const brandsList = React.useMemo(() => {
    if (Array.isArray(brands) && brands.length > 0) {
      return brands.slice(0, 8).map((b) => ({
        _id: b._id,
        name: b.name,
        slug: b.slug || b.name?.toLowerCase().replace(/\s+/g, "-"),
        logoText: b.name.toUpperCase(),
        origin: "Official Brand",
        image: b.banner ? cleanImageUrl(b.banner) : "/images/1.jpg",
      }));
    }
    return FALLBACK_BRANDS;
  }, [brands, BASE_URL]);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-neutral-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-normal text-neutral-900 uppercase tracking-[0.14em]">
              Top Men's Brands
            </h2>
            <p className="text-xs text-neutral-400 tracking-wider mt-1 uppercase">
              Discover premium brands for your wardrobe
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

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {brandsList.map((brand) => (
            <Link
              key={brand._id}
              to={`/productlist?brand=${brand.slug}&brandId=${brand._id}`}
              className="group relative block aspect-[3/4] overflow-hidden bg-neutral-900 shadow-sm hover:shadow-lg transition-all duration-500 border border-neutral-200"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out opacity-80 group-hover:opacity-100"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/images/1.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 text-center text-white flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#ED1C24] font-normal mb-1">
                  {brand.origin}
                </span>
                <h3 className="text-sm sm:text-base tracking-[0.12em] font-normal uppercase text-white group-hover:text-[#ED1C24] transition-colors">
                  {brand.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
