import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/Productlist/ProductSlice";
import ProductCard from "../common/ProductCard";
import { FiArrowRight } from "react-icons/fi";
import { resolveImageUrl } from "../../utils/resolveImage";

const FALLBACK_JEANS = [
  {
    _id: "jean-1",
    id: "jean-1",
    name: "Straight-Leg Japanese Selvedge Denim",
    brand: "Wearaah Denim",
    price: 3999,
    originalPrice: 5999,
    front: "/images/jeans.jpg",
    back: "/images/3.jpg",
    isNewArrival: false,
    sizes: ["30", "32", "34", "36"],
    colors: ["Raw Indigo", "Washed Blue"],
  },
  {
    _id: "jean-2",
    id: "jean-2",
    name: "Relaxed Fit Vintage Wash Jeans",
    brand: "Wearaah Denim",
    price: 3499,
    originalPrice: 4999,
    front: "/images/cargopants.webp",
    back: "/images/jeans.jpg",
    isNewArrival: false,
    sizes: ["30", "32", "34"],
    colors: ["Light Vintage"],
  },
  {
    _id: "jean-3",
    id: "jean-3",
    name: "Tapered Black Comfort-Stretch Denim",
    brand: "Wearaah Studio",
    price: 3699,
    originalPrice: 5499,
    front: "/images/10.webp",
    back: "/images/11.webp",
    isNewArrival: false,
    sizes: ["30", "32", "34", "36"],
    colors: ["Jet Black"],
  },
  {
    _id: "jean-4",
    id: "jean-4",
    name: "Classic Indigo Clean Rinse Jean",
    brand: "Wearaah Essentials",
    price: 3299,
    originalPrice: 4799,
    front: "/images/12.webp",
    back: "/images/13.webp",
    isNewArrival: false,
    sizes: ["30", "32", "34", "36"],
    colors: ["Deep Indigo"],
  },
];

export default function JoggersSection() {
  const subCategoryId = "69c23c0df1295fef10514873";
  const BASE_URL = import.meta.env.VITE_BASE_URL || "";
  const dispatch = useDispatch();
  const key = JSON.stringify({ subCategory: subCategoryId });

  const rawProducts = useSelector((state) => state.products?.products?.[key]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        subCategory: subCategoryId,
      })
    );
  }, [dispatch, subCategoryId]);

  const displayProducts = React.useMemo(() => {
    if (Array.isArray(rawProducts) && rawProducts.length > 0) {
      return rawProducts.slice(0, 4).map((p, idx) => {
        const fallbackFront = FALLBACK_JEANS[idx % FALLBACK_JEANS.length].front;
        const rawFront = Array.isArray(p.productImage) ? p.productImage[0] : p.productImage;
        const rawBack = Array.isArray(p.productImage) ? p.productImage[1] : null;
        const front = resolveImageUrl(rawFront, fallbackFront);
        const back = rawBack ? resolveImageUrl(rawBack, front) : front;
        return {
          id: p._id,
          _id: p._id,
          name: p.name || "Tailored Denim",
          brand: p.brand?.name || p.brand || "Wearaah Denim",
          price: p.startingPrice || p.price || 0,
          originalPrice: p.mrp || p.originalPrice || 0,
          front,
          back,
          sizes: p.sizes?.length ? p.sizes : ["30", "32", "34", "36"],
          colors: p.colors?.length ? p.colors : ["Standard"],
        };
      });
    }
    return FALLBACK_JEANS;
  }, [rawProducts]);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-neutral-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-normal text-neutral-900 uppercase tracking-[0.14em]">
              Jeans
            </h2>
            <p className="text-xs text-neutral-400 tracking-wider mt-1 uppercase">
              Shop now for ultimate comfort
            </p>
          </div>
          <Link
            to={`/productlist?subCategoryId=${subCategoryId}&subCategory=jeans`}
            className="text-xs font-normal uppercase tracking-[0.15em] text-neutral-900 hover:text-[#ED1C24] pb-0.5 border-b border-neutral-900 hover:border-[#ED1C24] transition-all inline-flex items-center gap-1.5"
          >
            <span>View All</span>
            <FiArrowRight size={13} />
          </Link>
        </div>

        {/* Denim Fit Filter Tags */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar mb-8 pb-1">
          {["All Jeans", "Slim Fit", "Straight Fit", "Relaxed Fit", "Ankle Length", "Tapered"].map((fit, idx) => (
            <Link
              key={fit}
              to={`/productlist?subCategoryId=${subCategoryId}&subCategory=jeans`}
              className={`px-4 py-1.5 text-xs font-normal uppercase tracking-wider whitespace-nowrap transition-all border ${
                idx === 0
                  ? "bg-black text-white border-black"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-black hover:text-black"
              }`}
            >
              {fit}
            </Link>
          ))}
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
