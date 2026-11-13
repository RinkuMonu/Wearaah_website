import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../features/Productlist/ProductSlice";
import ProductCard from "../common/ProductCard";
import { FiArrowRight } from "react-icons/fi";
import { resolveImageUrl } from "../../utils/resolveImage";

const FALLBACK_TRENDING = [
  {
    _id: "trend-1",
    id: "trend-1",
    name: "Oversized Merino Blend Cardigan",
    brand: "Wearaah Studio",
    price: 3899,
    originalPrice: 5999,
    front: "/images/24.webp",
    back: "/images/25.webp",
    isNewArrival: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Mocha", "Onyx Black"],
  },
  {
    _id: "trend-2",
    id: "trend-2",
    name: "Textured Linen Cuban Collar Shirt",
    brand: "Wearaah Signature",
    price: 2699,
    originalPrice: 3999,
    front: "/images/shirt4.jpg",
    back: "/images/shirt5.jpg",
    isNewArrival: true,
    sizes: ["38", "40", "42"],
    colors: ["Natural Ecru", "Olive"],
  },
  {
    _id: "trend-3",
    id: "trend-3",
    name: "Wide-Leg Sartorial Wool Trouser",
    brand: "Wearaah Atelier",
    price: 4299,
    originalPrice: 6999,
    front: "/images/cargopants.webp",
    back: "/images/3.jpg",
    isNewArrival: true,
    sizes: ["30", "32", "34", "36"],
    colors: ["Espresso", "Midnight Navy"],
  },
  {
    _id: "trend-4",
    id: "trend-4",
    name: "Classic Silk Blend Notch Lapel Suit",
    brand: "Wearaah Couture",
    price: 11999,
    originalPrice: 17999,
    front: "/images/4.jpg",
    back: "/images/5.jpg",
    isNewArrival: true,
    sizes: ["38R", "40R", "42R"],
    colors: ["Classic Navy", "Tuxedo Black"],
  },
];

export default function Discount() {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "";
  const dispatch = useDispatch();
  const key = JSON.stringify({ isTrending: true });
  const rawProducts = useSelector((state) => state.products?.products?.[key]);

  useEffect(() => {
    dispatch(fetchProducts({ isTrending: true }));
  }, [dispatch]);

  const displayProducts = React.useMemo(() => {
    if (Array.isArray(rawProducts) && rawProducts.length > 0) {
      return rawProducts.slice(0, 4).map((p, idx) => {
        const fallbackFront = FALLBACK_TRENDING[idx % FALLBACK_TRENDING.length].front;
        const rawFront = Array.isArray(p.productImage) ? p.productImage[0] : p.productImage;
        const rawBack = Array.isArray(p.productImage) ? p.productImage[1] : null;
        const front = resolveImageUrl(rawFront, fallbackFront);
        const back = rawBack ? resolveImageUrl(rawBack, front) : front;
        return {
          id: p._id,
          _id: p._id,
          name: p.name || "Trending Style",
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
    return FALLBACK_TRENDING;
  }, [rawProducts]);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-neutral-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-normal text-neutral-900 uppercase tracking-[0.14em]">
              Trending Products
            </h2>
            <p className="text-xs text-neutral-400 tracking-wider mt-1 uppercase">
              Trending Pieces You'll Want
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
