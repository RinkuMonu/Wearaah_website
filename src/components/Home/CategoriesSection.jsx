import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fatchSubCategory } from "../../features/subCategory/subCategorySlice";
import { Link } from "react-router-dom";
import { fetchBanner } from "../../features/Banner/bannerSlice";
import { FiArrowRight } from "react-icons/fi";

const FALLBACK_CATEGORIES = [
  {
    _id: "cat-1",
    name: "Tailored Blazers",
    slug: "tailored-blazers",
    image: "/images/1.jpg",
    itemCount: "48+ Styles",
  },
  {
    _id: "cat-2",
    name: "Luxury Trousers",
    slug: "luxury-trousers",
    image: "/images/3.jpg",
    itemCount: "62+ Styles",
  },
  {
    _id: "cat-3",
    name: "Artisan Shirts",
    slug: "artisan-shirts",
    image: "/images/shirt1.jpg",
    itemCount: "75+ Styles",
  },
  {
    _id: "cat-4",
    name: "Heritage Kurta Sets",
    slug: "heritage-kurta-sets",
    image: "/images/23.jpg",
    itemCount: "34+ Styles",
  },
  {
    _id: "cat-5",
    name: "Contemporary Denim",
    slug: "contemporary-denim",
    image: "/images/jeans.jpg",
    itemCount: "29+ Styles",
  },
  {
    _id: "cat-6",
    name: "Fine Knitwear",
    slug: "fine-knitwear",
    image: "/images/14.webp",
    itemCount: "41+ Styles",
  },
  {
    _id: "cat-7",
    name: "Signature Tees",
    slug: "signature-tees",
    image: "/images/tee1.jpg",
    itemCount: "50+ Styles",
  },
  {
    _id: "cat-8",
    name: "Evening Tuxedos",
    slug: "evening-tuxedos",
    image: "/images/5.jpg",
    itemCount: "18+ Styles",
  },
];

export default function CategoriesSection() {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "";
  const dispatch = useDispatch();
  const { subcategories } = useSelector((state) => state.subCategory || {});
  const banners = useSelector(
    (state) => state.banner?.banners?.["delivery"] || []
  );

  useEffect(() => {
    dispatch(fatchSubCategory());
    dispatch(
      fetchBanner({
        position: "delivery",
        deviceType: "desktop",
      })
    );
  }, [dispatch]);

  const cleanImageUrl = (path) => {
    if (!path) return "/images/placeholder.png";
    if (path.startsWith("http") || path.startsWith("/images/")) return path;
    const base = BASE_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const categoriesToRender = React.useMemo(() => {
    if (Array.isArray(subcategories) && subcategories.length > 0) {
      return subcategories.slice(0, 8).map((cat) => ({
        _id: cat._id,
        name: cat.name,
        slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-"),
        image: cat.smallimage ? cleanImageUrl(cat.smallimage) : "/images/1.jpg",
        itemCount: "Shop Now",
      }));
    }
    return FALLBACK_CATEGORIES;
  }, [subcategories, BASE_URL]);

  const centerBanner = banners?.[1]?.images
    ? cleanImageUrl(banners[1].images)
    : banners?.[0]?.images
    ? cleanImageUrl(banners[0].images)
    : null;

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-neutral-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-normal text-neutral-900 uppercase tracking-[0.14em]">
              Top Categories
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

        {/* Responsive Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoriesToRender.map((category) => (
            <Link
              key={category._id}
              to={
                category._id?.startsWith("cat-")
                  ? `/productlist?category=${category.slug}`
                  : `/productlist?subCategoryId=${category._id}&subCategory=${category.slug}`
              }
              className="group relative block aspect-[3/4] overflow-hidden bg-neutral-900 shadow-sm hover:shadow-lg transition-all duration-500 border border-neutral-200"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/images/1.jpg";
                }}
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Text Information */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col items-center text-center text-white">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#ED1C24] font-normal mb-1">
                  MENSWEAR
                </span>
                <h3 className="text-sm sm:text-base font-normal uppercase tracking-wider text-white group-hover:text-[#ED1C24] transition-colors duration-300">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Editorial Delivery Banner if present */}
      {centerBanner && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="relative overflow-hidden shadow-lg border border-neutral-200">
            <img
              src={centerBanner}
              className="w-full h-44 sm:h-64 object-cover"
              alt="Wearaah Express Nationwide Delivery"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
