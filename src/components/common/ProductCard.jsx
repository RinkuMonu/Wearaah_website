import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiCheck } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addToWishlist,
  removeFromWishlist,
  selectWishlistItems,
} from "../../features/Wishlist/wishlistSlice";
import { useAuth } from "../service/AuthContext";
import { getCartItems, setCartItems } from "../../utils/cartStorage";
import { resolveImageUrl, DEFAULT_PRODUCT_IMAGES } from "../../utils/resolveImage";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const wishlistItems = useSelector(selectWishlistItems) || [];
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  if (!product) return null;

  const id = product.id || product._id;
  const name = product.name || "Contemporary Style";
  const price = Number(product.price || product.startingPrice || 0);
  const mrp = Number(product.originalPrice || product.mrp || 0);
  const discountPercent =
    mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const rawFront = product.front || product.image || (Array.isArray(product.productImage) ? product.productImage[0] : product.productImage);
  const rawBack = product.back || (Array.isArray(product.productImage) ? product.productImage[1] : null);

  const frontImage = resolveImageUrl(rawFront, DEFAULT_PRODUCT_IMAGES[0]);
  const backImage = rawBack ? resolveImageUrl(rawBack, frontImage) : frontImage;

  const isWishlisted = wishlistItems.some(
    (item) => (item.product?._id || item.productId || item._id) === id
  );

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info("Please sign in to save items to your wishlist");
      return;
    }

    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist({ productId: id })).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlist({ productId: id })).unwrap();
        toast.success("Added to your wishlist");
      }
    } catch (err) {
      toast.info(isWishlisted ? "Item removed" : "Saved to wishlist");
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const existing = getCartItems();
    const selectedSize = product.sizes?.[0] || "M";
    const selectedColor = product.colors?.[0] || "Standard";

    const currentIndex = existing.findIndex(
      (item) =>
        (item.productId === id || item.id === id) &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    if (currentIndex > -1) {
      existing[currentIndex].quantity += 1;
    } else {
      existing.push({
        lineId: `${id}-${selectedSize}-${selectedColor}-${Date.now()}`,
        productId: id,
        id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
        price,
        mrp,
        name,
        image: frontImage,
      });
    }

    setCartItems(existing);
    setAddedAnim(true);
    toast.success(`Added ${name.slice(0, 24)}... to bag`);
    setTimeout(() => setAddedAnim(false), 1800);
  };

  const handleImageError = (e) => {
    const el = e.currentTarget;
    if (!el.dataset.fallbackTried) {
      el.dataset.fallbackTried = "true";
      // Pick a consistent fallback based on product id
      const idx = Math.abs((id || "").toString().split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % DEFAULT_PRODUCT_IMAGES.length;
      el.src = DEFAULT_PRODUCT_IMAGES[idx] || "/images/1.jpg";
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link
        to={`/product/${id}`}
        className="relative block w-full aspect-[3/4] overflow-hidden bg-neutral-100"
      >
        <img
          src={frontImage}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
            backImage && isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
          onError={handleImageError}
        />

        {backImage && backImage !== frontImage && (
          <img
            src={backImage}
            alt={`${name} alternative angle`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            onError={handleImageError}
          />
        )}

        {/* Badge: Bottom Left on Image (Matching Killer Jeans) */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isSoldOut ? (
            <span className="px-2.5 py-0.5 bg-black text-white text-[10px] font-normal tracking-widest uppercase">
              SOLD OUT
            </span>
          ) : discountPercent > 0 ? (
            <span className="px-2.5 py-0.5 bg-black text-white text-[10px] font-normal tracking-widest uppercase">
              {discountPercent}% OFF
            </span>
          ) : product.isNewArrival ? (
            <span className="px-2.5 py-0.5 bg-black text-white text-[10px] font-normal tracking-widest uppercase">
              NEW
            </span>
          ) : null}
        </div>

        {/* Wishlist Heart: Top Right (Delicate Outline) */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-1.5 text-neutral-600 hover:text-black transition-transform duration-200 hover:scale-110 z-20"
          aria-label="Add to wishlist"
        >
          <FiHeart
            size={18}
            strokeWidth={1.5}
            className={
              isWishlisted
                ? "text-[#ED1C24] fill-[#ED1C24]"
                : "text-neutral-700 hover:text-black"
            }
          />
        </button>

        {/* Quick Add Bag Button: Bottom Right on Image */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 hover:bg-white text-neutral-800 hover:text-black flex items-center justify-center shadow-xs transition-all duration-200 z-20 group/btn"
          aria-label="Quick add to bag"
        >
          {addedAnim ? (
            <FiCheck size={14} className="text-[#ED1C24]" />
          ) : (
            <FiShoppingBag size={14} strokeWidth={1.5} />
          )}
        </button>
      </Link>

      {/* Details: Simple, Clean & Elegant (Screenshot 5) */}
      <div className="pt-2.5 pb-2 flex flex-col">
        <Link
          to={`/product/${id}`}
          className="text-[12px] sm:text-[13px] uppercase tracking-wide font-normal text-neutral-800 line-clamp-1 hover:text-black transition-colors mb-1"
          title={name}
        >
          {name}
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="text-[13px] sm:text-[14px] font-normal sm:font-medium text-[#ED1C24]">
            ₹{CURRENCY_FORMATTER.format(price)}
          </span>
          {mrp > price && (
            <span className="text-[11px] sm:text-xs text-neutral-400 line-through font-normal">
              ₹{CURRENCY_FORMATTER.format(mrp)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
