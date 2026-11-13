import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/Productlist/ProductSlice";
import ProductCard from "../common/ProductCard";
import { FiArrowRight } from "react-icons/fi";
import { resolveImageUrl, DEFAULT_PRODUCT_IMAGES } from "../../utils/resolveImage";

const FALLBACK_POPULAR = [
  {
    id: "pop-1",
    _id: "pop-1",
    name: "Classic Linen Camp Collar Shirt",
    brand: "Wearaah Signature",
    price: 2499,
    originalPrice: 4999,
    front: "/images/8.webp",
    back: "/images/9.webp",
    isNewArrival: false,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ivory White"],
  },
  {
    id: "pop-2",
    _id: "pop-2",
    name: "Tailored Smart Wool Blend Trouser",
    brand: "Wearaah Studio",
    price: 3299,
    originalPrice: 6599,
    front: "/images/10.webp",
    back: "/images/11.webp",
    isNewArrival: false,
    sizes: ["30", "32", "34", "36"],
    colors: ["Slate Grey"],
  },
  {
    id: "pop-3",
    _id: "pop-3",
    name: "Architectural Trench Overcoat",
    brand: "Wearaah Atelier",
    price: 7999,
    originalPrice: 15999,
    front: "/images/12.webp",
    back: "/images/13.webp",
    isNewArrival: false,
    sizes: ["M", "L"],
    colors: ["Warm Camel"],
  },
  {
    id: "pop-4",
    _id: "pop-4",
    name: "Minimalist Ribbed Merino Knit",
    brand: "Wearaah Essentials",
    price: 2899,
    originalPrice: 5799,
    front: "/images/14.webp",
    back: "/images/15.jpg",
    isNewArrival: false,
    sizes: ["S", "M", "L"],
    colors: ["Jet Black"],
  },
  {
    id: "pop-5",
    _id: "pop-5",
    name: "Double-Pleated Sartorial Chino",
    brand: "Wearaah Studio",
    price: 2799,
    originalPrice: 5599,
    front: "/images/21.webp",
    back: "/images/22.webp",
    isNewArrival: false,
    sizes: ["30", "32", "34"],
    colors: ["Olive Moss"],
  },
  {
    id: "pop-6",
    _id: "pop-6",
    name: "Textured Knit Polo Cardigan",
    brand: "Wearaah Signature",
    price: 3199,
    originalPrice: 6399,
    front: "/images/24.webp",
    back: "/images/25.webp",
    isNewArrival: false,
    sizes: ["M", "L", "XL"],
    colors: ["Espresso Brown"],
  },
  {
    id: "pop-7",
    _id: "pop-7",
    name: "Casual Structured Blazer",
    brand: "Wearaah Couture",
    price: 5499,
    originalPrice: 10999,
    front: "/images/4.jpg",
    back: "/images/5.jpg",
    isNewArrival: false,
    sizes: ["38", "40", "42"],
    colors: ["Deep Navy"],
  },
  {
    id: "pop-8",
    _id: "pop-8",
    name: "Silk Cotton Monogram Scarf",
    brand: "Wearaah Atelier",
    price: 1499,
    originalPrice: 2999,
    front: "/images/15.jpg",
    back: "/images/8.webp",
    isNewArrival: false,
    sizes: ["Free Size"],
    colors: ["Gold & Black"],
  },
];

export default function PopularProducts() {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "";
  const dispatch = useDispatch();
  const key = JSON.stringify({ isTrending: true });
  const trendingProducts = useSelector((state) => state.products?.products?.[key]);

  useEffect(() => {
    dispatch(fetchProducts({ isTrending: true }));
  }, [dispatch]);

  const displayProducts = React.useMemo(() => {
    if (Array.isArray(trendingProducts) && trendingProducts.length > 0) {
      return trendingProducts.slice(0, 8).map((p, idx) => {
        const fallbackFront = DEFAULT_PRODUCT_IMAGES[idx % DEFAULT_PRODUCT_IMAGES.length];
        const rawFront = Array.isArray(p.productImage) ? p.productImage[0] : p.productImage;
        const rawBack = Array.isArray(p.productImage) ? p.productImage[1] : null;
        const front = resolveImageUrl(rawFront, fallbackFront);
        const back = rawBack ? resolveImageUrl(rawBack, front) : front;
        return {
          id: p._id,
          _id: p._id,
          name: p.name || "Signature Selection",
          brand: p.brand?.name || p.brand || "Wearaah Signature",
          price: p.startingPrice || p.price || 0,
          originalPrice: p.mrp || p.originalPrice || 0,
          front,
          back,
          sizes: p.sizes?.length ? p.sizes : ["M"],
          colors: p.colors?.length ? p.colors : ["Standard"],
        };
      });
    }
    return FALLBACK_POPULAR;
  }, [trendingProducts]);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-normal text-neutral-900 uppercase tracking-[0.14em]">
                50% Discount
              </h2>
              <span className="bg-[#ED1C24] text-white text-[10px] font-normal uppercase px-2 py-0.5 tracking-wider">
                FLAT 50% OFF
              </span>
            </div>
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

        {/* 4-column balanced Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
