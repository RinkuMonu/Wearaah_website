import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/Productlist/ProductSlice";
import ProductCard from "../common/ProductCard";
import { FiArrowRight } from "react-icons/fi";
import { resolveImageUrl } from "../../utils/resolveImage";

const FALLBACK_BLAZERS = [
  {
    _id: "bl-1",
    id: "bl-1",
    name: "Double-Breasted Cashmere Blazer",
    brand: "Wearaah Couture",
    price: 8999,
    originalPrice: 12999,
    front: "/images/1.jpg",
    back: "/images/2.jpg",
    sizes: ["38", "40", "42", "44"],
    colors: ["Midnight Blue", "Camel"],
  },
  {
    _id: "bl-2",
    id: "bl-2",
    name: "Structured Velvet Evening Tuxedo",
    brand: "Wearaah Atelier",
    price: 10499,
    originalPrice: 15999,
    front: "/images/4.jpg",
    back: "/images/5.jpg",
    sizes: ["38", "40", "42"],
    colors: ["Deep Black", "Burgundy"],
  },
  {
    _id: "bl-3",
    id: "bl-3",
    name: "Unstructured Linen Summer Blazer",
    brand: "Wearaah Studio",
    price: 5999,
    originalPrice: 8499,
    front: "/images/2.jpg",
    back: "/images/1.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ecru Oat", "Navy"],
  },
  {
    _id: "bl-4",
    id: "bl-4",
    name: "Heritage Tweed Overcoat",
    brand: "Wearaah Signature",
    price: 9499,
    originalPrice: 13999,
    front: "/images/5.jpg",
    back: "/images/4.jpg",
    sizes: ["38R", "40R", "42R"],
    colors: ["Herringbone Grey"],
  },
];

export default function Blazercoat() {
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
    if (Array.isArray(rawProducts) && rawProducts.length > 4) {
      return rawProducts.slice(4, 8).map((p, idx) => {
        const fallbackFront = FALLBACK_BLAZERS[idx % FALLBACK_BLAZERS.length].front;
        const rawFront = Array.isArray(p.productImage) ? p.productImage[0] : p.productImage;
        const rawBack = Array.isArray(p.productImage) ? p.productImage[1] : null;
        const front = resolveImageUrl(rawFront, fallbackFront);
        const back = rawBack ? resolveImageUrl(rawBack, front) : front;
        return {
          id: p._id,
          _id: p._id,
          name: p.name || "Tailored Blazer",
          brand: p.brand?.name || p.brand || "Wearaah Couture",
          price: p.startingPrice || p.price || 0,
          originalPrice: p.mrp || p.originalPrice || 0,
          front,
          back,
          sizes: p.sizes?.length ? p.sizes : ["38", "40", "42"],
          colors: p.colors?.length ? p.colors : ["Standard"],
        };
      });
    }
    return FALLBACK_BLAZERS;
  }, [rawProducts]);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-neutral-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-normal text-neutral-900 uppercase tracking-[0.14em]">
              Blazer and Coat
            </h2>
            <p className="text-xs text-neutral-400 tracking-wider mt-1 uppercase">
              Shop now for ultimate comfort
            </p>
          </div>
          <Link
            to="/productlist?category=blazers"
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
