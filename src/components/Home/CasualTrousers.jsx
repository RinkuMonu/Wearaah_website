import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/Productlist/ProductSlice";
import ProductCard from "../common/ProductCard";
import { FiArrowRight } from "react-icons/fi";
import { resolveImageUrl, DEFAULT_PRODUCT_IMAGES } from "../../utils/resolveImage";

const FALLBACK_TROUSERS = [
  {
    _id: "tr-1",
    id: "tr-1",
    name: "Pleated Double-Facing Wool Trouser",
    brand: "Wearaah Studio",
    price: 3899,
    originalPrice: 5999,
    front: "/images/3.jpg",
    back: "/images/4.jpg",
    sizes: ["30", "32", "34", "36"],
    colors: ["Charcoal", "Mocha"],
  },
  {
    _id: "tr-2",
    id: "tr-2",
    name: "Relaxed Drawstring Silk-Blend Pant",
    brand: "Wearaah Essentials",
    price: 3299,
    originalPrice: 4799,
    front: "/images/10.webp",
    back: "/images/11.webp",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Sand", "Black"],
  },
  {
    _id: "tr-3",
    id: "tr-3",
    name: "Tailored Cropped Wool Trousers",
    brand: "Wearaah Atelier",
    price: 4199,
    originalPrice: 6299,
    front: "/images/12.webp",
    back: "/images/13.webp",
    sizes: ["30", "32", "34"],
    colors: ["Navy", "Grey"],
  },
  {
    _id: "tr-4",
    id: "tr-4",
    name: "Structured Belgian Linen Trousers",
    brand: "Wearaah Signature",
    price: 3599,
    originalPrice: 5199,
    front: "/images/21.webp",
    back: "/images/22.webp",
    sizes: ["30", "32", "34", "36"],
    colors: ["Natural Ecru"],
  },
];

export default function CasualTrousers() {
  const categoryId = "69c50b8293df3e7bd375833a";
  const BASE_URL = import.meta.env.VITE_BASE_URL || "";
  const dispatch = useDispatch();
  const key = JSON.stringify({ category: categoryId });

  const rawProducts = useSelector((state) => state.products?.products?.[key]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        category: categoryId,
      })
    );
  }, [dispatch, categoryId]);

  const displayProducts = React.useMemo(() => {
    if (Array.isArray(rawProducts) && rawProducts.length > 0) {
      return rawProducts.slice(0, 4).map((p, idx) => {
        const fallbackFront = FALLBACK_TROUSERS[idx % FALLBACK_TROUSERS.length].front;
        const rawFront = Array.isArray(p.productImage) ? p.productImage[0] : p.productImage;
        const rawBack = Array.isArray(p.productImage) ? p.productImage[1] : null;
        const front = resolveImageUrl(rawFront, fallbackFront);
        const back = rawBack ? resolveImageUrl(rawBack, front) : front;
        return {
          id: p._id,
          _id: p._id,
          name: p.name || "Tailored Trouser",
          brand: p.brand?.name || p.brand || "Wearaah Studio",
          price: p.startingPrice || p.price || 0,
          originalPrice: p.mrp || p.originalPrice || 0,
          front,
          back,
          sizes: p.sizes?.length ? p.sizes : ["30", "32", "34", "36"],
          colors: p.colors?.length ? p.colors : ["Standard"],
        };
      });
    }
    return FALLBACK_TROUSERS;
  }, [rawProducts]);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-neutral-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-normal text-neutral-900 uppercase tracking-[0.14em]">
              Formal Wear
            </h2>
            <p className="text-xs text-neutral-400 tracking-wider mt-1 uppercase">
              Shop now for ultimate comfort
            </p>
          </div>
          <Link
            to={`/productlist?category=formal-wear&ctd=${categoryId}`}
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
