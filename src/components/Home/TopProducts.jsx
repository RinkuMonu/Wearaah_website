import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/Productlist/ProductSlice";
import { fatchBrands } from "../../features/Brands/brandSlice";
import { fetchBanner } from "../../features/Banner/bannerSlice";
import ProductCard from "../common/ProductCard";
import { FiArrowRight } from "react-icons/fi";
import { resolveImageUrl, DEFAULT_PRODUCT_IMAGES } from "../../utils/resolveImage";

const FALLBACK_NEW_ARRIVALS = [
  {
    _id: "na-1",
    id: "na-1",
    name: "Milano Tailored Wool Blazer",
    brand: "Wearaah Couture",
    price: 6499,
    originalPrice: 8999,
    front: "/images/1.jpg",
    back: "/images/2.jpg",
    isNewArrival: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Charcoal", "Midnight Navy"],
  },
  {
    _id: "na-2",
    id: "na-2",
    name: "Classic Silk-Blend Oxford Shirt",
    brand: "Wearaah Essentials",
    price: 2999,
    originalPrice: 4299,
    front: "/images/shirt1.jpg",
    back: "/images/shirt2.jpg",
    isNewArrival: true,
    sizes: ["38", "40", "42", "44"],
    colors: ["Crisp White", "Powder Blue"],
  },
  {
    _id: "na-3",
    id: "na-3",
    name: "Pleated Relaxed Trouser",
    brand: "Wearaah Studio",
    price: 3499,
    originalPrice: 4999,
    front: "/images/3.jpg",
    back: "/images/4.jpg",
    isNewArrival: true,
    sizes: ["30", "32", "34", "36"],
    colors: ["Sand Khaki", "Onyx Black"],
  },
  {
    _id: "na-4",
    id: "na-4",
    name: "Heritage Double-Breasted Suit",
    brand: "Wearaah Signature",
    price: 9999,
    originalPrice: 14999,
    front: "/images/5.jpg",
    back: "/images/1.jpg",
    isNewArrival: true,
    sizes: ["38R", "40R", "42R"],
    colors: ["Midnight Blue", "Tweed Grey"],
  },
];

const TopProducts = React.memo(function TopProducts() {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "";
  const dispatch = useDispatch();
  const key = JSON.stringify({ isNewArrival: true });

  const rawProducts = useSelector((state) => state.products?.products?.[key]);
  const banners = useSelector(
    (state) => state.banner?.banners?.["summer-sale"] || []
  );

  useEffect(() => {
    dispatch(fetchProducts({ isNewArrival: true }));
    dispatch(fatchBrands());
    dispatch(
      fetchBanner({
        position: "summer-sale",
        deviceType: "desktop",
      })
    );
  }, [dispatch]);

  const displayProducts = React.useMemo(() => {
    if (Array.isArray(rawProducts) && rawProducts.length > 0) {
      return rawProducts.slice(0, 8).map((p, idx) => {
        const fallbackFront = DEFAULT_PRODUCT_IMAGES[idx % DEFAULT_PRODUCT_IMAGES.length];
        const rawFront = Array.isArray(p.productImage) ? p.productImage[0] : p.productImage;
        const rawBack = Array.isArray(p.productImage) ? p.productImage[1] : null;
        const front = resolveImageUrl(rawFront, fallbackFront);
        const back = rawBack ? resolveImageUrl(rawBack, front) : front;
        return {
          id: p._id,
          _id: p._id,
          name: p.name || "Curated Piece",
          brand: p.brand?.name || p.brand || "Wearaah Studio",
          price: p.startingPrice || p.price || 0,
          originalPrice: p.mrp || p.originalPrice || 0,
          front,
          back,
          sizes: p.sizes?.length ? p.sizes : ["M"],
          colors: p.colors?.length ? p.colors : ["Standard"],
          isNewArrival: true,
        };
      });
    }
    return FALLBACK_NEW_ARRIVALS;
  }, [rawProducts]);

  const promoBanner = banners?.[0]?.images
    ? resolveImageUrl(banners[0].images, "/images/centerbanner.webp")
    : "/images/centerbanner.webp";

  return (
    <section className="w-full py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-neutral-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-normal text-neutral-900 uppercase tracking-[0.14em]">
              New Arrival Products
            </h2>
            <p className="text-xs text-neutral-400 tracking-wider mt-1 uppercase">
              Shop now for ultimate comfort
            </p>
          </div>
          <Link
            to="/productlist?isNewArrival=true"
            className="text-xs font-normal uppercase tracking-[0.15em] text-neutral-900 hover:text-[#ED1C24] pb-0.5 border-b border-neutral-900 hover:border-[#ED1C24] transition-all inline-flex items-center gap-1.5"
          >
            <span>View All</span>
            <FiArrowRight size={13} />
          </Link>
        </div>

        {/* 4-column balanced Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Promotional Editorial Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <Link
          to="/productlist?category=sale"
          className="relative block w-full overflow-hidden group shadow-sm"
        >
          <img
            src={promoBanner}
            alt="Wearaah Promotional Showcase"
            className="w-full h-44 sm:h-64 md:h-80 object-cover object-center transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/images/centerbanner.webp";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center px-6 sm:px-12">
            <div className="text-white max-w-lg">
              <span className="text-[10px] sm:text-xs font-normal tracking-[0.25em] text-[#ED1C24] uppercase block mb-1">
                LIMITED TIME EDIT
              </span>
              <h3 className="text-xl sm:text-3xl font-normal uppercase mb-3 text-white leading-tight tracking-wider">
                UP TO 50% OFF SELECTED MENSWEAR
              </h3>
              <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#ED1C24] text-white text-xs font-medium uppercase tracking-wider group-hover:bg-white group-hover:text-black transition-all">
                Shop The Sale &rarr;
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
});

export default TopProducts;
