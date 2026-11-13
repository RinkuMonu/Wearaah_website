import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiHeart, FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist, selectWishlistItems } from "../../features/Wishlist/wishlistSlice";
import { useAuth } from "../service/AuthContext";
import { getCartItems, setCartItems, CART_UPDATED_EVENT } from "../../utils/cartStorage";
import { toast } from "react-toastify";

const DRIP_SLIDER_ITEMS = [
  {
    id: "kdrip-1",
    name: "KID'S WHITE SLIM FIT PRINTED T-SHIRTS",
    price: 799,
    originalPrice: 1199,
    image: "/images/Kids/K2.jpg",
    badge: "SOLD OUT",
    to: "/productdetail?id=kdrip-1&name=KID'S+WHITE+SLIM+FIT+PRINTED+T-SHIRTS",
  },
  {
    id: "kdrip-2",
    name: "KID'S NAVY PRINTED SUMMER RESORT SHIRT",
    price: 899,
    originalPrice: 1399,
    image: "/images/Kids/K1.jpg",
    badge: "SOLD OUT",
    to: "/productdetail?id=kdrip-2&name=KID'S+NAVY+PRINTED+SUMMER+RESORT+SHIRT",
  },
  {
    id: "kdrip-3",
    name: "KID'S VINTAGE WASH DENIM JOGGERS",
    price: 1199,
    originalPrice: 1699,
    image: "/images/Kids/K4.jpg",
    badge: "SOLD OUT",
    to: "/productdetail?id=kdrip-3&name=KID'S+VINTAGE+WASH+DENIM+JOGGERS",
  },
];

export default function KidsSplitDripShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const wishlistItems = useSelector(selectWishlistItems) || [];

  const currentItem = DRIP_SLIDER_ITEMS[currentIndex];
  const isWishlisted = wishlistItems.some(
    (item) => (item.product?._id || item.productId || item._id) === currentItem.id
  );

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DRIP_SLIDER_ITEMS.length) % DRIP_SLIDER_ITEMS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DRIP_SLIDER_ITEMS.length);
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

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const existing = getCartItems();
    const idx = existing.findIndex((i) => i.productId === currentItem.id || i.id === currentItem.id);
    if (idx > -1) {
      existing[idx].quantity += 1;
    } else {
      existing.push({
        lineId: `${currentItem.id}-std-${Date.now()}`,
        productId: currentItem.id,
        id: currentItem.id,
        quantity: 1,
        size: "M",
        color: "Standard",
        price: currentItem.price,
        name: currentItem.name,
        image: currentItem.image,
      });
    }
    setCartItems(existing);
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
    toast.success(`Added ${currentItem.name} to bag`);
  };

  return (
    <section className="w-full py-12 sm:py-16 bg-white border-b border-neutral-200">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* ─── LEFT: Editorial Visual: FIND YOUR NEXT DRIP. (Exact Screenshot 5 ~60%) ─── */}
          <div className="lg:col-span-7 relative min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] bg-neutral-900 overflow-hidden group shadow-lg">
            <img
              src="/images/Kids/kid1.jpg"
              alt="Find Your Next Drip"
              className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105 filter brightness-[0.9]"
              onError={(e) => {
                e.currentTarget.src = "/images/Kids/5.png";
              }}
            />

            {/* Gradient Overlay for Typography */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

            {/* Headline & CTA */}
            <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12 right-6 sm:right-12 text-center select-none z-10">
              <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-wider text-white drop-shadow-xl font-display">
                FIND YOUR NEXT DRIP.
              </h3>
              <div className="mt-4 inline-block">
                <Link
                  to="/productlist?gender=Kids&category=drip"
                  className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold text-white pb-1.5 border-b-2 border-[#08266B] hover:border-white transition-all inline-block drop-shadow-md"
                >
                  EXPLORE ALL
                </Link>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Interactive Product Slider (Exact Screenshot 5 ~40%) ─── */}
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
                  alt={currentItem.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/images/Kids/K1.jpg";
                  }}
                />

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
                {currentItem.badge && (
                  <span className="absolute bottom-3 left-3 bg-black text-white text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5">
                    {currentItem.badge}
                  </span>
                )}

                {/* Bottom-Right Cart Trigger */}
                <button
                  onClick={handleQuickAdd}
                  className="absolute bottom-3 right-3 w-8 h-8 rounded-none bg-white/90 hover:bg-white text-neutral-900 hover:text-[#08266B] flex items-center justify-center shadow-xs transition-all cursor-pointer z-10"
                  aria-label="Add to bag"
                >
                  <FiShoppingBag size={14} />
                </button>
              </Link>

              {/* Product Info below image */}
              <div className="pt-3">
                <Link
                  to={currentItem.to}
                  className="block text-xs sm:text-[13px] font-medium uppercase tracking-wider text-neutral-900 hover:text-[#08266B] transition-colors truncate"
                >
                  {currentItem.name}
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

        </div>
      </div>
    </section>
  );
}

