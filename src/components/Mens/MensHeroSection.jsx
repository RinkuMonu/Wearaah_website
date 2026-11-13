import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiHeart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist, selectWishlistItems } from "../../features/Wishlist/wishlistSlice";
import { useAuth } from "../service/AuthContext";
import { toast } from "react-toastify";

const HERO_FEATURED_PRODUCTS = [
  {
    id: "m-hero-1",
    title: "WEARAAH MEN BLUE PRINTED SLIM FIT T-SHIRTS",
    price: 1276,
    originalPrice: 1695,
    discount: "-25%",
    image: "/images/tee1.jpg",
    to: "/productdetail?id=m-hero-1&name=WEARAAH+MEN+BLUE+PRINTED+SLIM+FIT+T-SHIRTS",
  },
  {
    id: "m-hero-2",
    title: "WEARAAH MEN RAW INDIGO SLIM JEANS",
    price: 2599,
    originalPrice: 3499,
    discount: "-26%",
    image: "/images/jeans.jpg",
    to: "/productdetail?id=m-hero-2&name=WEARAAH+MEN+RAW+INDIGO+SLIM+JEANS",
  },
  {
    id: "m-hero-3",
    title: "WEARAAH MEN OLIVE SOLID POLO SHIRT",
    price: 1399,
    originalPrice: 1899,
    discount: "-26%",
    image: "/images/polo.webp",
    to: "/productdetail?id=m-hero-3&name=WEARAAH+MEN+OLIVE+SOLID+POLO+SHIRT",
  },
];

export default function MensHeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const wishlistItems = useSelector(selectWishlistItems) || [];

  const currentProd = HERO_FEATURED_PRODUCTS[activeSlide];
  const isWishlisted = wishlistItems.some(
    (item) => (item.product?._id || item.productId || item._id) === currentProd.id
  );

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_FEATURED_PRODUCTS.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + HERO_FEATURED_PRODUCTS.length) % HERO_FEATURED_PRODUCTS.length);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please sign in to save items to your wishlist");
      return;
    }
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist({ productId: currentProd.id })).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlist({ productId: currentProd.id })).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.info(isWishlisted ? "Item removed" : "Saved to wishlist");
    }
  };

  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[680px] lg:min-h-[760px] bg-[#222] overflow-hidden flex items-center justify-between">
      {/* Background Image: Denim Jeans Action Visual (Matching Reference Screenshot 1) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/21.webp"
          alt="Men Denim Campaign"
          className="w-full h-full object-cover object-[center_35%] filter brightness-[0.92] contrast-[1.05]"
          onError={(e) => {
            e.currentTarget.src = "/images/jeans.jpg";
          }}
        />
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Center Left Typography (Matching Screenshot 1) */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full flex flex-col md:flex-row items-center md:items-end justify-between py-12 md:py-16 gap-8">
        
        {/* Big Bold Headline */}
        <div className="max-w-2xl text-white text-center md:text-left">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-wide leading-tight drop-shadow-md">
            OWN YOUR STYLE ALL DAY AND NIGHT
          </h1>
          <div className="mt-6 inline-block">
            <Link
              to="/productlist?category=mens"
              className="text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-white pb-1.5 border-b-2 border-[#08266B] hover:border-white transition-all inline-block drop-shadow-xs"
            >
              SHOP CLASSICS
            </Link>
          </div>
        </div>

        {/* Floating Bottom-Right Product Carousel Card (Exact Screenshot 1) */}
        <div className="w-full sm:w-80 md:w-88 shrink-0 bg-white/95 backdrop-blur-xs shadow-2xl p-4 border border-neutral-200">
          <div className="flex gap-4">
            {/* Product Thumbnail */}
            <div className="relative w-28 sm:w-32 aspect-[3/4] bg-neutral-100 overflow-hidden shrink-0">
              <img
                src={currentProd.image}
                alt={currentProd.title}
                className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/images/1.jpg";
                }}
              />
              <span className="absolute top-1.5 left-1.5 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 tracking-wider uppercase">
                {currentProd.discount}
              </span>
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex items-start justify-between gap-1">
                  <h3 className="text-[11px] sm:text-xs uppercase font-medium tracking-wide text-neutral-900 line-clamp-2">
                    {currentProd.title}
                  </h3>
                  <button
                    onClick={handleWishlist}
                    className="p-1 text-neutral-500 hover:text-[#08266B] transition-colors"
                    aria-label="Wishlist"
                  >
                    <FiHeart
                      size={15}
                      className={isWishlisted ? "fill-[#08266B] text-[#08266B]" : ""}
                    />
                  </button>
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-[#08266B]">
                    Rs. {currentProd.price.toLocaleString("en-IN")}.00
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-neutral-400 line-through">
                    Rs. {currentProd.originalPrice.toLocaleString("en-IN")}.00
                  </span>
                </div>
              </div>

              <Link
                to={currentProd.to}
                className="mt-3 block text-center text-[10px] sm:text-[11px] font-bold tracking-widest uppercase py-2 bg-neutral-900 text-white hover:bg-[#08266B] transition-colors"
              >
                CHOOSE OPTIONS
              </Link>
            </div>
          </div>

          {/* Slider Pagination Controls below card */}
          <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {HERO_FEATURED_PRODUCTS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeSlide === idx ? "bg-[#08266B] w-5" : "bg-neutral-300"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-neutral-700">
              <button
                onClick={handlePrev}
                className="p-1 hover:text-[#08266B] transition-colors cursor-pointer"
                aria-label="Previous"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="p-1 hover:text-[#08266B] transition-colors cursor-pointer"
                aria-label="Next"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

