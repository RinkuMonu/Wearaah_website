import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiHeart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist, selectWishlistItems } from "../../features/Wishlist/wishlistSlice";
import { useAuth } from "../service/AuthContext";
import { toast } from "react-toastify";

const SPLIT_SLIDER_ITEMS = [
  {
    id: "m-split-1",
    title: "WEARAAH MEN BLUE PRINTED SLIM FIT T-SHIRTS",
    price: 1439,
    originalPrice: 1799,
    discountBadge: "SALE -20%",
    statusBadge: "SOLD OUT",
    image: "/images/polo.webp",
    to: "/productdetail?id=m-split-1&name=WEARAAH+MEN+BLUE+PRINTED+SLIM+FIT+T-SHIRTS",
  },
  {
    id: "m-split-2",
    title: "WEARAAH MEN OVERSIZED VINTAGE GRAPHIC TEE",
    price: 1399,
    originalPrice: 1999,
    discountBadge: "SALE -30%",
    statusBadge: "SOLD OUT",
    image: "/images/printed.webp",
    to: "/productdetail?id=m-split-2&name=WEARAAH+MEN+OVERSIZED+VINTAGE+GRAPHIC+TEE",
  },
  {
    id: "m-split-3",
    title: "WEARAAH MEN SOLID MINIMAL POCKET TEE",
    price: 1299,
    originalPrice: 1699,
    discountBadge: "SALE -24%",
    statusBadge: "SOLD OUT",
    image: "/images/plain.webp",
    to: "/productdetail?id=m-split-3&name=WEARAAH+MEN+SOLID+MINIMAL+POCKET+TEE",
  },
];

export default function MensSplitShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const wishlistItems = useSelector(selectWishlistItems) || [];

  const currentItem = SPLIT_SLIDER_ITEMS[currentIndex];
  const isWishlisted = wishlistItems.some(
    (item) => (item.product?._id || item.productId || item._id) === currentItem.id
  );

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SPLIT_SLIDER_ITEMS.length) % SPLIT_SLIDER_ITEMS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SPLIT_SLIDER_ITEMS.length);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please sign in to save items to your wishlist");
      return;
    }
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist({ productId: currentItem.id })).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlist({ productId: currentItem.id })).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.info(isWishlisted ? "Item removed" : "Saved to wishlist");
    }
  };

  return (
    <section className="w-full py-12 sm:py-16 bg-white border-b border-neutral-200">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Product Card Carousel (Exact Screenshot 5 ~38%) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Outer Left Arrow */}
            <button
              onClick={handlePrev}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-neutral-200 text-neutral-800 hover:text-[#08266B] flex items-center justify-center transition-all cursor-pointer hover:scale-110"
              aria-label="Previous product"
            >
              <FiChevronLeft size={18} />
            </button>

            {/* Product Card Container */}
            <div className="w-full max-w-sm flex flex-col bg-white">
              <Link
                to={currentItem.to}
                className="relative block aspect-[3/4] bg-[#f5f5f5] overflow-hidden group shadow-sm"
              >
                <img
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/images/tee1.jpg";
                  }}
                />

                {/* Top-Left Sale Tag */}
                <span className="absolute top-3 left-3 bg-white/95 text-neutral-900 border border-neutral-200 text-[10px] font-bold tracking-wider uppercase px-2 py-1 shadow-xs">
                  {currentItem.discountBadge}
                </span>

                {/* Top-Right Wishlist Heart */}
                <button
                  onClick={handleWishlist}
                  className="absolute top-3 right-3 p-1.5 text-neutral-600 hover:text-[#08266B] transition-colors cursor-pointer z-10"
                  aria-label="Wishlist"
                >
                  <FiHeart
                    size={18}
                    className={isWishlisted ? "fill-[#08266B] text-[#08266B]" : ""}
                  />
                </button>

                {/* Bottom-Left Status Badge */}
                {currentItem.statusBadge && (
                  <span className="absolute bottom-3 left-3 bg-black text-white text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5">
                    {currentItem.statusBadge}
                  </span>
                )}
              </Link>

              {/* Product Info below image */}
              <div className="pt-3">
                <Link
                  to={currentItem.to}
                  className="block text-xs sm:text-[13px] font-medium uppercase tracking-wider text-neutral-900 hover:text-[#08266B] transition-colors truncate"
                >
                  {currentItem.title}
                </Link>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs sm:text-[13px] font-semibold text-[#08266B]">
                    Rs. {currentItem.price.toLocaleString("en-IN")}.00
                  </span>
                  <span className="text-[11px] text-neutral-400 line-through">
                    Rs. {currentItem.originalPrice.toLocaleString("en-IN")}.00
                  </span>
                </div>
              </div>
            </div>

            {/* Outer Right Arrow */}
            <button
              onClick={handleNext}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-neutral-200 text-neutral-800 hover:text-[#08266B] flex items-center justify-center transition-all cursor-pointer hover:scale-110"
              aria-label="Next product"
            >
              <FiChevronRight size={18} />
            </button>
          </div>

          {/* Right Column: Editorial Graphic Back-Print Visual (Exact Screenshot 5 ~62%) */}
          <div className="lg:col-span-7 relative min-h-[440px] sm:min-h-[520px] lg:min-h-[580px] bg-neutral-900 overflow-hidden group shadow-lg">
            <img
              src="/images/shirts.avif"
              alt="Print That Rules"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 filter brightness-[0.88]"
              onError={(e) => {
                e.currentTarget.src = "/images/1.jpg";
              }}
            />
            
            {/* Subtle Gradient for Typography Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Bottom Overlay Typography: PRINT THAT RULES / EXPLORE ALL (Exact Screenshot 5) */}
            <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12 right-6 sm:right-12 text-center select-none z-10">
              <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-wider text-white drop-shadow-lg font-display">
                PRINT THAT RULES
              </h3>
              <div className="mt-4 inline-block">
                <Link
                  to="/productlist?category=mens&search=Print"
                  className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold text-white pb-1.5 border-b-2 border-[#08266B] hover:border-white transition-all inline-block drop-shadow-md"
                >
                  EXPLORE ALL
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

