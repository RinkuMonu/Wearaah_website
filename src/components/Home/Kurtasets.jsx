import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/Productlist/ProductSlice";
import ProductCard from "../common/ProductCard";
import { FiArrowRight } from "react-icons/fi";
import { resolveImageUrl } from "../../utils/resolveImage";

const FALLBACK_SHIRTS = [
  {
    _id: "sh-1",
    id: "sh-1",
    name: "Classic Silk-Blend Egyptian Cotton Shirt",
    brand: "Wearaah Essentials",
    price: 2999,
    originalPrice: 4499,
    front: "/images/shirt1.jpg",
    back: "/images/shirt2.jpg",
    sizes: ["38", "40", "42", "44"],
    colors: ["Crisp White"],
  },
  {
    _id: "sh-2",
    id: "sh-2",
    name: "Embroidered Heritage Kurta Set",
    brand: "Wearaah Royal",
    price: 5499,
    originalPrice: 7999,
    front: "/images/23.jpg",
    back: "/images/26.jpg",
    sizes: ["38", "40", "42"],
    colors: ["Ivory Gold"],
  },
  {
    _id: "sh-3",
    id: "sh-3",
    name: "Bespoke French Cuff Evening Shirt",
    brand: "Wearaah Atelier",
    price: 3499,
    originalPrice: 4999,
    front: "/images/shirt4.jpg",
    back: "/images/shirt5.jpg",
    sizes: ["39", "40", "42"],
    colors: ["Midnight Black"],
  },
  {
    _id: "sh-4",
    id: "sh-4",
    name: "Handcrafted Silk Chanderi Kurta",
    brand: "Wearaah Royal",
    price: 4999,
    originalPrice: 6999,
    front: "/images/26.jpg",
    back: "/images/23.jpg",
    sizes: ["38", "40", "42"],
    colors: ["Forest Emerald"],
  },
];

export default function DesignerShirts() {
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
    if (Array.isArray(rawProducts) && rawProducts.length > 8) {
      return rawProducts.slice(8, 12).map((p, idx) => {
        const fallbackFront = FALLBACK_SHIRTS[idx % FALLBACK_SHIRTS.length].front;
        const rawFront = Array.isArray(p.productImage) ? p.productImage[0] : p.productImage;
        const rawBack = Array.isArray(p.productImage) ? p.productImage[1] : null;
        const front = resolveImageUrl(rawFront, fallbackFront);
        const back = rawBack ? resolveImageUrl(rawBack, front) : front;
        return {
          id: p._id,
          _id: p._id,
          name: p.name || "Artisan Shirt",
          brand: p.brand?.name || p.brand || "Wearaah Signature",
          price: p.startingPrice || p.price || 0,
          originalPrice: p.mrp || p.originalPrice || 0,
          front,
          back,
          sizes: p.sizes?.length ? p.sizes : ["38", "40", "42"],
          colors: p.colors?.length ? p.colors : ["Standard"],
        };
      });
    }
    return FALLBACK_SHIRTS;
  }, [rawProducts]);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-neutral-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-normal text-neutral-900 uppercase tracking-[0.14em]">
              Designer Shirts
            </h2>
            <p className="text-xs text-neutral-400 tracking-wider mt-1 uppercase">
              Browse Popular Shirts
            </p>
          </div>
          <Link
            to="/productlist?category=shirts"
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
