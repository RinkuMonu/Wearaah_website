import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../features/Category/categorySlice";
import { FiArrowRight } from "react-icons/fi";

const FALLBACK_TRENDING_CATEGORIES = [
  {
    _id: "tc-1",
    name: "Milano Tailoring",
    slug: "milano-tailoring",
    image: "/images/1.jpg",
    subtitle: "Structured Suits & Blazers",
  },
  {
    _id: "tc-2",
    name: "Sartorial Trousers",
    slug: "sartorial-trousers",
    image: "/images/3.jpg",
    subtitle: "Pleated & Relaxed Silhouettes",
  },
  {
    _id: "tc-3",
    name: "Artisan Shirts",
    slug: "artisan-shirts",
    image: "/images/shirt1.jpg",
    subtitle: "Egyptian Cotton & Silk Weaves",
  },
  {
    _id: "tc-4",
    name: "Luxury Outerwear",
    slug: "luxury-outerwear",
    image: "/images/4.jpg",
    subtitle: "Cashmere Overcoats & Trench",
  },
  {
    _id: "tc-5",
    name: "Heritage Ceremonial",
    slug: "heritage-ceremonial",
    image: "/images/23.jpg",
    subtitle: "Silk Kurtas & Bundis",
  },
];

export default function TrendingCategorie() {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "";
  const dispatch = useDispatch();

  const categoryState = useSelector((state) => state.category?.categories);
  const categoriesList = Array.isArray(categoryState?.categories)
    ? categoryState.categories
    : Array.isArray(categoryState)
    ? categoryState
    : [];

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const cleanImageUrl = (path) => {
    if (!path) return "/images/placeholder.png";
    if (path.startsWith("http") || path.startsWith("/images/")) return path;
    const base = BASE_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const activeCategories = React.useMemo(() => {
    if (categoriesList.length > 0) {
      return categoriesList.map((cat) => ({
        _id: cat._id,
        name: cat.name,
        slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-"),
        image: cat.smallimage ? cleanImageUrl(cat.smallimage) : "/images/1.jpg",
        subtitle: "Curated Collection",
      }));
    }
    return FALLBACK_TRENDING_CATEGORIES;
  }, [categoriesList, BASE_URL]);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-neutral-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-normal text-neutral-900 uppercase tracking-[0.14em]">
              Trending Categories
            </h2>
            <p className="text-xs text-neutral-400 tracking-wider mt-1 uppercase">
              Latest trends you love
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

        <Swiper
          slidesPerView={3}
          spaceBetween={24}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true }}
          className="mySwiper !pb-12"
          breakpoints={{
            0: { slidesPerView: 1.2, spaceBetween: 16 },
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
        >
          {activeCategories.map((item, idx) => (
            <SwiperSlide key={item._id || idx}>
              <Link
                to={
                  item._id?.startsWith("tc-")
                    ? `/productlist?category=${item.slug}`
                    : `/productlist?category=${item.slug}&ctd=${item._id}`
                }
                className="group relative block aspect-[3/4] overflow-hidden bg-neutral-900 shadow-sm border border-neutral-200"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-100"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/images/1.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-white flex flex-col items-center text-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#ED1C24] font-normal mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="text-base sm:text-lg font-normal uppercase tracking-wider text-white group-hover:text-[#ED1C24] transition-colors">
                    {item.name}
                  </h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
