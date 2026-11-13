import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiCheck,
  FiChevronDown,
  FiCopy,
  FiHeart,
  FiInfo,
  FiShoppingCart,
  FiStar,
  FiThumbsDown,
  FiThumbsUp,
  FiTruck,
  FiZoomIn,
} from "react-icons/fi";
import {
  PRODUCTS,
  SIZE_SYSTEMS,
  getSizeConversion,
  getSizeChartRows,
  toDisplaySize,
  getProductById,
} from "../data/products";
import { useAuth } from "../components/service/AuthContext";
import {
  CART_UPDATED_EVENT,
  getCartItems,
  setCartItems,
} from "../utils/cartStorage";
import { getWishlist, setWishlist } from "../utils/wishlistStorage";
import api from "../components/service/axios";
import { fetchCartItems } from "../features/Cart/cartSlice";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from "../features/Wishlist/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";

const RECENTLY_VIEWED_KEY = "wearaah_recently_viewed_v1";
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const OFFER_LIST = [
  "10% instant discount on HDFC cards above Rs. 1,999",
  "Festival offer: Flat Rs. 300 off on 2+ items",
  "No cost EMI available on orders above Rs. 3,000",
  "Get extra 5% off on prepaid orders",
];

// const DETAIL_SECTIONS = [
//   { key: "details",      title: "Product Details",           render: (p) => p.description },
//   { key: "care",         title: "Fabric & Care",             render: (p) => `${p.material}. ${p.care}` },
//   { key: "fit",          title: "Size & Fit",                render: (p) => p.fit },
//   { key: "material",     title: "Material & Transparency",   render: (p) => `${p.material}; Opaque fabric.` },
//   { key: "pattern",      title: "Pattern / Occasion",        render: (p) => `${p.pattern}; Suitable for ${p.occasion}.` },
//   { key: "origin",       title: "Country of Origin",         render: (p) => p.countryOfOrigin },
//   { key: "manufacturer", title: "Manufacturer Details",      render: (p) => p.manufacturer },
// ];

const REVIEW_DATA = [
  {
    id: 1,
    author: "Arjun S.",
    rating: 5,
    helpful: 32,
    date: "2026-02-12",
    comment: "Fit is perfect and quality is great for the price.",
    images: [],
  },
  {
    id: 2,
    author: "Kiran M.",
    rating: 4,
    helpful: 11,
    date: "2026-01-25",
    comment: "Color and print look exactly like photos.",
    images: [],
  },
  {
    id: 3,
    author: "Dev P.",
    rating: 5,
    helpful: 19,
    date: "2026-02-19",
    comment: "Soft fabric and good oversized look.",
    images: [],
  },
];

/* ─── Stars ──────────────────────────────────────────────── */
const Stars = ({ rating, size = 13 }) => (
  <span className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <FiStar
        key={s}
        size={size}
        className={
          s <= Math.round(rating)
            ? "text-amber-400 fill-amber-400"
            : "text-gray-200 fill-gray-200"
        }
      />
    ))}
  </span>
);

/* ─── Rating bar ─────────────────────────────────────────── */
const RatingBar = ({ label, pct }) => (
  <div className="flex items-center gap-3 text-xs text-gray-500">
    <span className="w-8 shrink-0 font-medium">{label}</span>
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
        style={{ width: `${pct}%` }}
      />
    </div>
    <span className="w-6 text-right text-gray-400">{pct}%</span>
  </div>
);

/* ─── Product card (Clean Killer Jeans minimal style) ─────────────────────── */
const ProductCard = ({ item, location }) => {
  const discount =
    item?.originalPrice && item?.price
      ? Math.round(
          ((item.originalPrice - item.price) / item.originalPrice) * 100
        )
      : 0;

  return (
    <Link
      to={`/product/${item.id}`}
      state={{ returnTo: location?.pathname + location?.search }}
      className="group block min-w-[200px] w-52 snap-start shrink-0"
    >
      <div className="bg-white overflow-hidden transition-all duration-300">
        <div className="relative overflow-hidden aspect-[3/4] bg-neutral-100">
          <img
            src={item.front || "/placeholder.png"}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {item.stock === 0 ? (
            <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] font-normal tracking-widest px-2 py-0.5 uppercase">
              SOLD OUT
            </div>
          ) : discount > 0 ? (
            <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] font-normal tracking-widest px-2 py-0.5 uppercase">
              {discount}% OFF
            </div>
          ) : null}
        </div>

        <div className="pt-2.5 pb-1">
          <p className="text-[12px] font-normal text-neutral-800 uppercase tracking-wide truncate">
            {item.name}
          </p>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xs sm:text-sm font-normal text-[#ED1C24]">
              ₹{CURRENCY_FORMATTER.format(item.price)}
            </span>

            {item.originalPrice > item.price && (
              <span className="text-[11px] text-neutral-400 line-through font-normal">
                ₹{CURRENCY_FORMATTER.format(item.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
/* ═══════════════════════════════════════════════════════════
   SIZE CHART MODAL
═══════════════════════════════════════════════════════════ */
const SizeChartModal = ({ onClose, activeSizes, sizeSystem }) => {
  const rows = getSizeChartRows(sizeSystem);
  const convMap = getSizeConversion(sizeSystem);

  const isTopwear = sizeSystem === "TOPWEAR_ALPHA";
  const isBottomNum = sizeSystem === "BOTTOMWEAR_NUM";
  const isBottomAlpha = sizeSystem === "BOTTOMWEAR_ALPHA";

  const categoryLabel = isTopwear
    ? "Topwear  (T-shirts, Shirts, Hoodies, Jackets)"
    : isBottomNum
      ? "Bottomwear — Jeans & Trousers (Waist size)"
      : "Bottomwear — Leggings & Track Pants";

  const cols = isTopwear
    ? ["IN (Alpha)", "UK", "US", "Chest"]
    : isBottomNum``
      ? ["IN (Waist)", "UK", "US", "Waist", "Hip"]
      : ["IN (Alpha)", "UK", "US", "Waist", "Hip"];

  const getCells = (key) => {
    const r = convMap[key];
    if (!r) return [];
    if (isTopwear) return [r.IN, r.UK, r.US, r.chest];
    if (isBottomNum) return [r.IN, r.UK, r.US, r.waist, r.hip];
    return [r.IN, r.UK, r.US, r.waist, r.hip];
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-amber-50">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Size Guide</h3>
            <p className="text-xs text-amber-700 mt-0.5">{categoryLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-sm shadow-sm"
          >
            ✕
          </button>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full text-sm min-w-[380px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {cols.map((h, i) => (
                  <th
                    key={h}
                    className={`px-3 py-3 font-bold text-gray-600 text-xs uppercase tracking-wide ${i === 0 ? "text-left" : "text-center"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((key, i) => {
                const isAvail = activeSizes.includes(key);
                const cells = getCells(key);
                return (
                  <tr
                    key={key}
                    className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} border-b border-gray-50 last:border-0 ${!isAvail ? "opacity-35" : ""}`}
                  >
                    {cells.map((val, ci) => (
                      <td
                        key={ci}
                        className={`px-3 py-3 ${ci === 0 ? "font-bold text-gray-800" : "text-center text-gray-600"}`}
                      >
                        {ci === 0 ? (
                          <span className="flex items-center gap-2">
                            {val}
                            {isAvail ? (
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
                                title="Available"
                              />
                            ) : (
                              <span className="text-[10px] text-gray-400 font-normal">
                                N/A
                              </span>
                            )}
                          </span>
                        ) : (
                          val
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />{" "}
                Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />{" "}
                Not in stock
              </span>
            </div>
            {isBottomNum && (
              <p className="text-xs text-gray-400 leading-relaxed flex items-start gap-1.5">
                <FiInfo size={11} className="shrink-0 mt-0.5 text-neutral-500" />
                Sizes are Indian waist measurements in inches. For best fit,
                measure your natural waist and round up if between sizes.
              </p>
            )}
            {(isTopwear || isBottomAlpha) && (
              <p className="text-xs text-gray-400 leading-relaxed flex items-start gap-1.5">
                <FiInfo size={11} className="shrink-0 mt-0.5 text-neutral-500" />
                Measurements are in inches. If between sizes, we recommend
                sizing up for a comfortable fit.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setLoginOpen } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeSystem, setSizeSystem] = useState("IN");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryState, setDeliveryState] = useState(null);
  const [sizeError, setSizeError] = useState("");
  const [toast, setToast] = useState("");
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [openSection, setOpenSection] = useState("details");
  const [reviewSort, setReviewSort] = useState("helpful");
  const [shareCopied, setShareCopied] = useState(false);
  const [updatingWishlist, setUpdatingWishlist] = useState(false);
  const [wishlist, setWishlistState] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [variants, setVariants] = useState([]);
  const [loadingVariants, setLoadingVariants] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const isLoggedIn = Boolean(user?.user || user);
  const dispatch = useDispatch();

const wishlistItems = useSelector(
  (state) => state.wishlist.items
);

useEffect(() => {
  dispatch(fetchWishlist());
}, [dispatch]);
  const specifications = useMemo(() => {
    if (!variants.length) return {};
    return variants[0]?.productId?.specifications || {};
  }, [variants]);

  const formatColor = useMemo(
    () => (color) => {
      if (!color) return "";
      return color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
    },
    [],
  );

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads")) return `${BASE_URL}${path}`;
    return `${BASE_URL}/uploads/${path}`;
  };

  const colors = useMemo(() => {
    if (variants && variants.length > 0) {
      const uniqueColors = [
        ...new Set(variants.map((v) => formatColor(v.color)).filter(Boolean)),
      ];
      return uniqueColors.length ? uniqueColors : product?.colors || [];
    }
    return product?.colors || [];
  }, [variants, product, formatColor]);

  const sizes = useMemo(() => {
    if (!variants.length || !selectedColor) {
      return product?.sizes || [];
    }
    const normalizedSelectedColor = formatColor(selectedColor);
    const sizesForColor = variants
      .filter((v) => formatColor(v.color) === normalizedSelectedColor)
      .map((v) => v.size)
      .filter((v, i, arr) => arr.indexOf(v) === i);
    return sizesForColor.length ? sizesForColor : product?.sizes || [];
  }, [variants, selectedColor, product, formatColor]);

  const unavailableSizes = useMemo(() => {
    if (!variants.length || !selectedColor) {
      return product?.unavailableSizes || [];
    }
    const normalizedSelectedColor = formatColor(selectedColor);
    return variants
      .filter(
        (v) =>
          formatColor(v.color) === normalizedSelectedColor && v.stock === 0,
      )
      .map((v) => v.size);
  }, [variants, selectedColor, product, formatColor]);

  const selectedVariant = useMemo(() => {
    if (!variants.length || !selectedColor || !selectedSize) return null;
    const normalizedSelectedColor = formatColor(selectedColor);
    return variants.find(
      (v) =>
        formatColor(v.color) === normalizedSelectedColor &&
        v.size === selectedSize,
    );
  }, [variants, selectedColor, selectedSize, formatColor]);

  const displayPrice = useMemo(() => {
    if (selectedVariant?.pricing?.sellingPrice)
      return selectedVariant.pricing.sellingPrice;
    return product?.price || 0;
  }, [selectedVariant, product]);

  const originalPrice = useMemo(() => {
    if (selectedVariant?.pricing?.mrp) return selectedVariant.pricing.mrp;
    return product?.originalPrice || 0;
  }, [selectedVariant, product]);

  const discountPercent = useMemo(() => {
    if (!originalPrice || !displayPrice || originalPrice === displayPrice)
      return 0;
    return Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
  }, [originalPrice, displayPrice]);

  const isOutOfStock = useMemo(() => {
    if (selectedVariant) return selectedVariant.stock <= 0;
    return product?.stock <= 0 || false;
  }, [selectedVariant, product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter((item) => item.id !== product.id).slice(0, 10);
  }, [product]);
 console.log("Related products:", relatedProducts);
  //   const recentlyViewed = useMemo(() => {
  //     const ids = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
  //     return ids
  //       .filter((itemId) => itemId !== product?.id)
  //       .map((itemId) => getProductById(itemId))
  //       .filter(Boolean)
  //       .slice(0, 8);
  //   }, [product?.id]);
  // console.log("Recently viewed products:", recentlyViewed);

  const recentlyViewed = useMemo(() => {
    const items = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
    return items
      .filter(
        (item) => item && typeof item === "object" && item.id && item.id !== id,
      )
      .slice(0, 8);
  }, [id, product]);

  const sortedReviews = useMemo(() => {
    if (!reviews.length) return [];

    let sorted = [...reviews];

    if (reviewSort === "latest") {
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    // Default: sort by helpful (likes)
    return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }, [reviews, reviewSort]);

  const handleReviewLike = async (reviewId, currentAction) => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      setToast("Please login to like reviews");
      return;
    }

    try {
      // Determine new action
      let newAction = "like";
      if (currentAction === "liked") {
        newAction = "unlike";
      } else if (currentAction === "disliked") {
        newAction = "like"; // Remove dislike and add like
      }

      const response = await api.post(`/review/like/${reviewId}`, {
        action: newAction,
      });

      if (response.data.success) {
        // Update the review in state
        setReviews((prevReviews) =>
          prevReviews.map((review) => {
            if (review._id === reviewId) {
              let updatedLikes = review.likes || 0;
              let updatedDislikes = review.dislikes || 0;
              let userAction = newAction === "unlike" ? null : newAction;

              if (currentAction === "liked" && newAction === "unlike") {
                updatedLikes = Math.max(0, updatedLikes - 1);
                userAction = null;
              } else if (currentAction === "disliked" && newAction === "like") {
                updatedDislikes = Math.max(0, updatedDislikes - 1);
                updatedLikes = (review.likes || 0) + 1;
                userAction = "liked";
              } else if (newAction === "like") {
                updatedLikes = (review.likes || 0) + 1;
                userAction = "liked";
              }

              return {
                ...review,
                likes: updatedLikes,
                dislikes: updatedDislikes,
                userAction: userAction,
              };
            }
            return review;
          }),
        );

        setToast(newAction === "like" ? "Liked review ✓" : "Removed like");
      }
    } catch (error) {
      console.error("Error liking review:", error);
      setToast(error?.response?.data?.message || "Failed to like review");
    }
  };

  const handleReviewDislike = async (reviewId, currentAction) => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      setToast("Please login to dislike reviews");
      return;
    }

    try {
      // Determine new action
      let newAction = "dislike";
      if (currentAction === "disliked") {
        newAction = "undislike";
      } else if (currentAction === "liked") {
        newAction = "dislike"; // Remove like and add dislike
      }

      const response = await api.post(`/review/like/${reviewId}`, {
        action: newAction,
      });

      if (response.data.success) {
        // Update the review in state
        setReviews((prevReviews) =>
          prevReviews.map((review) => {
            if (review._id === reviewId) {
              let updatedLikes = review.likes || 0;
              let updatedDislikes = review.dislikes || 0;
              let userAction = newAction === "undislike" ? null : newAction;

              if (currentAction === "disliked" && newAction === "undislike") {
                updatedDislikes = Math.max(0, updatedDislikes - 1);
                userAction = null;
              } else if (currentAction === "liked" && newAction === "dislike") {
                updatedLikes = Math.max(0, updatedLikes - 1);
                updatedDislikes = (review.dislikes || 0) + 1;
                userAction = "disliked";
              } else if (newAction === "dislike") {
                updatedDislikes = (review.dislikes || 0) + 1;
                userAction = "disliked";
              }

              return {
                ...review,
                likes: updatedLikes,
                dislikes: updatedDislikes,
                userAction: userAction,
              };
            }
            return review;
          }),
        );

        setToast(
          newAction === "dislike" ? "Disliked review" : "Removed dislike",
        );
      }
    } catch (error) {
      console.error("Error disliking review:", error);
      setToast(error?.response?.data?.message || "Failed to dislike review");
    }
  };

  const gridImages = useMemo(() => {
    if (selectedVariant?.variantImages?.length) {
      return selectedVariant.variantImages
        .map((img) => getImageUrl(img))
        .slice(0, 4);
    }
    if (variants.length > 0 && variants[0].variantImages?.length) {
      return variants[0].variantImages
        .map((img) => getImageUrl(img))
        .slice(0, 4);
    }
    if (product?.gallery?.length) {
      return product.gallery.map((img) => getImageUrl(img)).slice(0, 4);
    }
    return [];
  }, [selectedVariant, variants, product]);

  const productSizeSystem = product?.sizeSystem || "BOTTOMWEAR_NUM";
  const isNumericSizes = productSizeSystem === "BOTTOMWEAR_NUM";

  const convMap = useMemo(
    () => getSizeConversion(productSizeSystem),
    [productSizeSystem],
  );
  const getBtnLabel = useMemo(
    () => (inKey) => toDisplaySize(inKey, sizeSystem, productSizeSystem),
    [sizeSystem, productSizeSystem],
  );
  const getTooltip = useMemo(
    () => (inKey) => {
      const r = convMap[inKey];
      if (!r) return null;
      if (isNumericSizes)
        return `IN ${r.IN}" · UK ${r.UK} · US ${r.US} · Waist ${r.waist}`;
      return `IN ${r.IN} · UK ${r.UK} · US ${r.US}`;
    },
    [convMap, isNumericSizes],
  );

  const selectedDisplaySize = selectedSize ? getBtnLabel(selectedSize) : "";
  const categoryBadge = isNumericSizes
    ? "Waist size (inches)"
    : productSizeSystem === "BOTTOMWEAR_ALPHA"
      ? "Bottomwear Alpha size"
      : "Topwear Alpha size";

  const isColorOutOfStock = (color) => {
    if (!variants.length) return false;
    const normalizedColor = formatColor(color);
    const colorVariants = variants.filter(
      (v) => formatColor(v.color) === normalizedColor,
    );
    return (
      colorVariants.length === 0 || colorVariants.every((v) => v.stock === 0)
    );
  };

  const isSizeOutOfStock = (size) => unavailableSizes.includes(size);
  // const isWishlisted = wishlist.includes(product?.id);

  const getColorImage = (color) => {
    if (variants.length) {
      const normalizedColor = formatColor(color);
      const variant = variants.find(
        (v) => formatColor(v.color) === normalizedColor,
      );
      if (variant?.variantImages?.length)
        return getImageUrl(variant.variantImages[0]);
    }
    if (product?.gallery?.length) return getImageUrl(product.gallery[0]);
    return "";
  };

  // ─── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;

    const fetchVariants = async () => {
      try {
        setLoadingVariants(true);
        const response = await api.get(`/variant/products/${id}/variants`);
        const variantsData = response.data?.variants || [];
        console.log("Fetched variants:", variantsData);
        const finalVariantsData =
          Array.isArray(variantsData) && variantsData.length > 0
            ? variantsData
            : Array.isArray(response.data)
              ? response.data
              : [];

        if (finalVariantsData.length > 0) {
          setVariants(finalVariantsData);
          const firstVariant = finalVariantsData[0];

          const uniqueColors = [
            ...new Set(
              finalVariantsData
                .map((v) =>
                  v.color
                    ? v.color.charAt(0).toUpperCase() +
                      v.color.slice(1).toLowerCase()
                    : "",
                )
                .filter(Boolean),
            ),
          ];
          const uniqueSizes = [
            ...new Set(finalVariantsData.map((v) => v.size).filter(Boolean)),
          ];
          const totalStock = finalVariantsData.reduce(
            (sum, v) => sum + (v.stock || 0),
            0,
          );
          const unavailableSizesList = finalVariantsData
            .filter((v) => v.stock === 0)
            .map((v) => v.size);

          let detectedSizeSystem = "BOTTOMWEAR_NUM";
          const hasNumericSizes = uniqueSizes.some((size) =>
            /^\d+$/.test(size),
          );
          if (hasNumericSizes) {
            detectedSizeSystem = "BOTTOMWEAR_NUM";
          } else if (
            uniqueSizes.some((size) =>
              ["XS", "S", "M", "L", "XL"].includes(size),
            )
          ) {
            detectedSizeSystem = "TOPWEAR_ALPHA";
          }

          const productData = {
            // id: firstVariant.productId || id,
            // _id: firstVariant.productId || id,
            id: firstVariant.productId?._id || id,
            _id: firstVariant.productId?._id || id,
            name: firstVariant.variantTitle || "Product",
            description: firstVariant.variantDiscription || "",
            brand: "Snitch",
            price: firstVariant.pricing?.sellingPrice || 0,
            originalPrice: firstVariant.pricing?.mrp || 0,
            rating: 4.5,
            reviews: 0,
            gallery: firstVariant.variantImages || [],
            colors: uniqueColors,
            sizes: uniqueSizes,
            sizeSystem: detectedSizeSystem,
            codAvailable: true,
            shippingCharge: 0,
            stock: totalStock,
            unavailableColors: [],
            unavailableSizes: unavailableSizesList,
            category: "Clothing",
            material: "Cotton",
            careInstructions: "Machine wash cold",
            fit: "Regular fit",
          };

          setProduct(productData);

          if (firstVariant.variantImages?.length) {
            setSelectedImage(getImageUrl(firstVariant.variantImages[0]));
          }

          if (uniqueColors.length > 0) {
            const defaultColor = uniqueColors.includes("Black")
              ? "Black"
              : uniqueColors[0];
            setSelectedColor(defaultColor);
          }

          const availableSizes = uniqueSizes.filter(
            (size) => !unavailableSizesList.includes(size),
          );
          if (availableSizes.length > 0) {
            const defaultSize = availableSizes.includes("32")
              ? "32"
              : availableSizes[0];
            setSelectedSize(defaultSize);
          } else if (uniqueSizes.length > 0) {
            setSelectedSize(uniqueSizes[0]);
          }
        } else {
          setVariants([]);
        }
      } catch (error) {
        console.error("Variant API error:", error);
        setVariants([]);
      } finally {
        setLoadingVariants(false);
      }
    };

    fetchVariants();
  }, [id]);

  useEffect(() => {
    if (selectedVariant?.variantImages?.length) {
      setSelectedImage(selectedVariant.variantImages[0]);
    } else if (product?.gallery?.length) {
      setSelectedImage(product.gallery[0]);
    }
  }, [selectedVariant, product]);

  useEffect(() => {
    if (!product) return;
    if (colors.length > 0 && !selectedColor) setSelectedColor(colors[0]);
    if (product.gallery?.length && !selectedImage)
      setSelectedImage(product.gallery[0]);
  }, [product, colors, selectedColor, selectedImage]);

  useEffect(() => {
    if (variants.length > 0 && colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0]);
    }
  }, [variants, colors, selectedColor]);

  useEffect(() => {
    if (!selectedColor) return;
    if (selectedSize && unavailableSizes.includes(selectedSize)) {
      setSelectedSize("");
      setSizeError("Selected size is unavailable for this color.");
    } else if (selectedSize && !sizes.includes(selectedSize)) {
      setSelectedSize("");
      setSizeError("Selected size is not available for this color.");
    } else {
      setSizeError("");
    }
  }, [selectedColor, unavailableSizes, sizes, selectedSize]);

  // useEffect(() => {
  //   if (!product) return;
  //   const prev = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
  //   const next = [product.id, ...prev.filter((i) => i !== product.id)].slice(
  //     0,
  //     20,
  //   );
  //   localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
  // }, [product]);

  useEffect(() => {
    if (!product || !id || !gridImages.length) return;

    const snapshot = {
      id: id, // URL param — always a clean string
      name: product.name,
      price: displayPrice,
      front: gridImages[0] || "",
    };

    const prev = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
    const filtered = prev.filter(
      (item) => typeof item === "object" && item?.id !== id,
    );
    const next = [snapshot, ...filtered].slice(0, 20);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
  }, [product, id, displayPrice, gridImages]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  // ─── Add to cart ─────────────────────────────────────────────────────────────

  const addToCart = async () => {
    if (!selectedSize) {
      setSizeError("Please select a size.");
      return;
    }
    if (selectedVariant && selectedVariant.stock <= 0) {
      setToast("Out of stock");
      return;
    }
    if (variants.length > 0 && !selectedVariant) {
      setSizeError("Selected combination is not available.");
      return;
    }

    const cartItem = {
      lineId: selectedVariant
        ? `${product.id}-${selectedVariant._id}`
        : `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      price: displayPrice,
      image: selectedImage,
      quantity: quantity,
    };

    if (selectedVariant) {
      cartItem.variantId = selectedVariant._id;
      cartItem.size = selectedVariant.size;
      cartItem.color = selectedVariant.color;
      cartItem.sku = selectedVariant.sku;
      cartItem.variantTitle = selectedVariant.variantTitle;
    } else {
      cartItem.size = selectedSize;
      cartItem.color = selectedColor;
    }

    if (isLoggedIn) {
      try {
        const response = await api.post("/cart/add", {
          variantId: selectedVariant?._id,
          quantity: quantity,
        });
        if (response.data?.success) {
          setToast("Added to bag ✓");
          dispatch(fetchCartItems());
          window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.message;
        setToast(errorMessage);
        if (error?.response?.status === 401) {
          setLoginOpen(true);
          setToast("Please login to add items to cart");
        } else {
          setToast(errorMessage);
        }
      }
    } else {
      const items = getCartItems();
      const idx = items.findIndex((i) => i.lineId === cartItem.lineId);
      if (idx > -1) {
        items[idx].quantity += quantity;
      } else {
        items.push(cartItem);
      }
      setCartItems(items);
      window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
      window.dispatchEvent(new CustomEvent("cart-item-added"));
      setToast("Added to bag ✓");
    }
  };

  // ─── Buy Now ──────────────────────────────────────────────────────────────────
  // Saves the single item to sessionStorage and navigates to checkout
  // with checkoutMode: 'buynow' so CheckoutPage knows to use it.

  const handleBuyNow = async () => {
    if (!selectedSize) {
      setSizeError("Please select a size before buying.");
      return;
    }

    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }

    if (isOutOfStock) {
      setToast("This item is out of stock");
      return;
    }

    // Build the buy-now item in the exact shape CheckoutPage expects
    const buyNowItem = {
      id: selectedVariant?._id || `temp-${Date.now()}`,
      name: product.name,
      price: displayPrice,
      originalPrice: originalPrice,
      qty: quantity,
      image: selectedImage,
      size: selectedSize,
      color: selectedColor,
      variantId: selectedVariant?._id,
      productId: product.id,
      sku: selectedVariant?.sku,
      variantTitle: selectedVariant?.variantTitle,
      lineId: selectedVariant
        ? `${product.id}-${selectedVariant._id}-buynow`
        : `${product.id}-${selectedSize}-${selectedColor}-buynow`,
    };

    // Persist to sessionStorage — cleared by CheckoutPage after order success
    sessionStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));

    // Navigate with checkoutMode flag — CheckoutPage reads this
    navigate("/checkout", {
      state: {
        checkoutMode: "buynow",
      },
    });
  };

  const fetchReviews = async (page = 1, reset = true) => {
    if (!product?._id && !id) return;

    try {
      setLoadingReviews(true);
      const variantId = selectedVariant?._id || variants[0]?._id;

      if (!variantId) {
        console.warn("No variant ID available for fetching reviews");
        return;
      }

      const response = await api.get(`/review`, {
        params: {
          variantId: variantId,
          page: page,
          limit: 10,
        },
      });

      if (response.data.success) {
        // Add userAction field to each review (if your API returns user's interaction)
        const reviewsWithUserAction = (response.data.reviews || []).map(
          (review) => ({
            ...review,
            userAction: review.userAction || null, // 'liked', 'disliked', or null
          }),
        );

        if (reset) {
          setReviews(reviewsWithUserAction);
        } else {
          setReviews((prev) => [...prev, ...reviewsWithUserAction]);
        }

        setReviewStats(response.data.stats);
        setHasMoreReviews(
          response.data.reviews?.length === response.data.limit,
        );
        setReviewPage(response.data.page);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setToast("Failed to load reviews");
    } finally {
      setLoadingReviews(false);
    }
  };

  const loadMoreReviews = () => {
    if (!loadingReviews && hasMoreReviews) {
      fetchReviews(reviewPage + 1, false);
    }
  };

  useEffect(() => {
    if (selectedVariant?._id || variants[0]?._id) {
      fetchReviews(1, true);
    }
  }, [selectedVariant, variants]);
  // ─── Wishlist / share / delivery ─────────────────────────────────────────────
  const isInWishlist = useSelector(selectIsInWishlist(selectedVariant?._id));

  const isWishlisted = useMemo(() => {
    const variantToUse = selectedVariant || variants?.[0];
    return variantToUse?.isWishlisted || false;
  }, [selectedVariant, variants]);

  // ─── Wishlist Toggle (Using same API for add/remove) ─────────────────────────────
  const toggleWishlist = async () => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      setToast("Please login to add items to wishlist");
      return;
    }

    const variantToUse = selectedVariant || variants?.[0];

    if (!variantToUse?._id) return;

    setUpdatingWishlist(true);

    try {
      const response = await api.post("/wishlist", {
        variantId: variantToUse._id,
      });

      if (response.data.success) {
        setVariants((prevVariants) =>
          prevVariants.map((variant) =>
            variant._id === variantToUse._id
              ? { ...variant, isWishlisted: !variant.isWishlisted }
              : variant,
          ),
        );
        dispatch(fetchWishlist());
        const newStatus = !variantToUse.isWishlisted;
        setToast(newStatus ? "Added to wishlist ♥" : "Removed from wishlist");
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      setToast(error?.response?.data?.message || "Failed to update wishlist");
    } finally {
      setUpdatingWishlist(false);
    }
  };

  const checkDelivery = () => {
    if (!navigator.onLine) {
      setDeliveryState({ type: "error", message: "Network issue. Try again." });
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryState({
        type: "error",
        message: "Please enter a valid 6-digit pincode.",
      });
      return;
    }
    setDeliveryState({
      type: "success",
      message: `Delivery by ${new Date(
        Date.now() + 3 * 24 * 3600 * 1000,
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })}`,
      cod: product?.codAvailable ? "Available" : "Not Available",
      shipping:
        product?.shippingCharge === 0
          ? "Free"
          : `Rs. ${product?.shippingCharge}`,
      returns: "7-day easy return available",
    });
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    } catch {
      setToast("Could not copy link");
    }
  };

  const COLOR_MAP = {
    Black: "#1a1a1a",
    White: "#f5f5f5",
    Red: "#e53935",
    Blue: "#1e88e5",
    Green: "#43a047",
    Yellow: "#fdd835",
    Pink: "#e91e8c",
    Grey: "#9e9e9e",
    Navy: "#1a237e",
    Maroon: "#880e4f",
    Beige: "#d7ccc8",
    Orange: "#fb8c00",
    Brown: "#795548",
    Olive: "#827717",
  };

  // ─── Loading / not found ──────────────────────────────────────────────────────

  if (loadingVariants) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto" />
          <p className="text-xs uppercase tracking-widest text-neutral-500 mt-4">Loading product details...</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-normal uppercase tracking-wider text-neutral-900">
            Product not found
          </h1>
          <p className="text-xs uppercase tracking-wider text-neutral-500 mt-2">
            The product you are looking for does not exist.
          </p>
          <Link
            to="/productlist"
            className="inline-block mt-6 px-8 py-3 bg-black hover:bg-[#ED1C24] text-white text-xs font-normal uppercase tracking-widest transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-none text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2">
          <FiCheck size={14} className="text-[#ED1C24]" /> {toast}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <img
            src={selectedImage}
            alt=""
            className="h-[90vh] max-w-[90vw] object-contain shadow-2xl"
          />
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Size chart modal */}
      {showSizeChart && (
        <SizeChartModal
          onClose={() => setShowSizeChart(false)}
          activeSizes={sizes}
          sizeSystem={productSizeSystem}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 pb-28 md:pb-12">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-neutral-100 py-3 flex items-center justify-between text-xs uppercase tracking-wider text-neutral-400 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                location.state?.returnTo
                  ? navigate(location.state.returnTo)
                  : navigate(-1);
              }}
              className="hover:text-black transition-colors"
            >
              ← Back
            </button>
            <span className="text-neutral-200">/</span>
            <span>{product.brand}</span>
            <span className="text-neutral-200">/</span>
            <span className="text-neutral-800 font-normal line-clamp-1 max-w-[200px]">
              {product.name}
            </span>
          </div>
          <button
            type="button"
            onClick={copyShareLink}
            className="flex items-center gap-1.5 hover:text-black transition-colors"
          >
            {shareCopied ? <FiCheck size={13} /> : <FiCopy size={13} />}
            {shareCopied ? "Copied!" : "Share"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start mt-6">
          {/* LEFT — desktop image grid */}
          <div className="hidden lg:block sticky top-[90px] self-start w-[520px] shrink-0">
            <div className="grid grid-cols-2 gap-2">
              {gridImages.map(
                (img, idx) =>
                  img && (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedImage(img);
                        setLightboxOpen(true);
                      }}
                      className="relative group overflow-hidden bg-neutral-100"
                      style={{ aspectRatio: "3 / 4" }}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 bg-white/90 p-2 transition-opacity">
                          <FiZoomIn size={16} className="text-neutral-800" />
                        </div>
                      </div>
                      {idx === 0 && discountPercent > 0 && (
                        <div className="absolute bottom-3 left-3 bg-black text-white text-[10px] font-normal tracking-widest px-2.5 py-1 uppercase">
                          {discountPercent}% OFF
                        </div>
                      )}
                      {idx === 0 && isOutOfStock && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <span className="bg-black text-white text-xs font-normal tracking-widest px-4 py-1.5 uppercase">
                            SOLD OUT
                          </span>
                        </div>
                      )}
                    </button>
                  ),
              )}
            </div>
          </div>

          {/* Mobile image */}
          <div className="lg:hidden w-full">
            <div className="grid grid-cols-2 gap-1.5">
              {gridImages.map(
                (img, idx) =>
                  img && (
                    <div
                      key={idx}
                      className="relative overflow-hidden bg-neutral-100"
                      style={{ aspectRatio: "3 / 4" }}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                      {idx === 0 && discountPercent > 0 && (
                        <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] font-normal tracking-widest px-2 py-0.5 uppercase">
                          {discountPercent}% OFF
                        </div>
                      )}
                    </div>
                  ),
              )}
            </div>
          </div>

          {/* RIGHT — details */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Title / Rating / Price */}
            <div className="bg-white border border-neutral-100 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-normal text-neutral-500 uppercase tracking-[0.16em] mb-1">
                    {product.brand}
                  </p>
                  <h1 className="text-xl sm:text-2xl font-normal text-neutral-900 uppercase tracking-wide leading-snug">
                    {product.name}
                  </h1>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleWishlist}
                  disabled={updatingWishlist}
                  className={`shrink-0 w-10 h-10 border flex items-center justify-center transition-all ${
                    isWishlisted
                      ? "border-[#ED1C24] bg-red-50 text-[#ED1C24]"
                      : "border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                  } ${updatingWishlist ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {updatingWishlist ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  ) : (
                    <FiHeart
                      size={17}
                      className={isWishlisted ? "fill-[#ED1C24]" : ""}
                    />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-100">
                <span className="inline-flex items-center gap-1.5 bg-neutral-900 text-white text-xs font-normal px-2.5 py-1">
                  {product.rating} <FiStar size={11} className="fill-white" />
                </span>
                <Stars rating={product.rating} />
                <span className="text-xs uppercase tracking-wider text-neutral-400">
                  {product.reviews} reviews
                </span>
              </div>
              <div className="flex items-baseline gap-3 mt-4 pt-4 border-t border-dashed border-neutral-100">
                <span className="text-2xl font-normal text-[#ED1C24]">
                  ₹{CURRENCY_FORMATTER.format(displayPrice)}
                </span>
                {originalPrice > displayPrice && (
                  <span className="text-neutral-400 line-through text-sm font-normal">
                    ₹{CURRENCY_FORMATTER.format(originalPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-black font-normal text-xs uppercase tracking-wider bg-neutral-100 px-2 py-0.5">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">
                inclusive of all taxes
              </p>
            </div>

            {/* Color / Size / Quantity */}
            <div className="bg-white border border-neutral-100 p-6 space-y-6">
              {/* Color */}
              {colors.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-800 mb-3">
                    Color:{" "}
                    <span className="font-normal text-neutral-500">
                      {selectedColor}
                    </span>
                  </p>
                  <div className="flex gap-2.5 flex-wrap">
                    {colors.map((color) => {
                      const bg = COLOR_MAP[color] || "#ccc";
                      const isSel = selectedColor === color;
                      const oos = isColorOutOfStock(color);
                      return (
                        <button
                          key={color}
                          type="button"
                          disabled={oos}
                          onClick={() => {
                            setSelectedColor(color);
                            setSelectedImage(getColorImage(color));
                            setSelectedSize("");
                          }}
                          title={color}
                          className={`relative w-8 h-8 rounded-full transition-all duration-200 ${
                            isSel
                              ? "ring-2 ring-black ring-offset-2 scale-110 shadow-sm"
                              : "hover:scale-105"
                          } ${oos ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                          style={{
                            backgroundColor: bg,
                            border: `2px solid ${isSel ? "#000" : "#e5e7eb"}`,
                          }}
                        >
                          {isSel && (
                            <FiCheck
                              size={12}
                              className="absolute inset-0 m-auto text-white drop-shadow"
                            />
                          )}
                          {oos && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="block w-full h-px bg-red-400 rotate-45" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size selector */}
              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-800">
                      Select Size
                    </p>
                    <span className="text-[10px] font-normal text-neutral-500 bg-neutral-100 px-2 py-0.5 uppercase tracking-wider">
                      {categoryBadge}
                    </span>
                    {selectedSize && (
                      <span className="text-xs font-normal text-black bg-neutral-100 border border-neutral-200 px-2 py-0.5 uppercase">
                        {selectedDisplaySize} ({sizeSystem})
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSizeChart(true)}
                    className="text-xs text-neutral-700 hover:text-black underline uppercase tracking-wider flex items-center gap-1 shrink-0"
                  >
                    <FiInfo size={11} /> Size Chart
                  </button>
                </div>

                {/* Size system switcher */}
                <div className="flex items-center gap-1 bg-neutral-100 p-1 w-fit mb-4">
                  {SIZE_SYSTEMS.map((sys) => (
                    <button
                      key={sys}
                      type="button"
                      onClick={() => setSizeSystem(sys)}
                      className={`px-3 py-1 text-xs uppercase tracking-wider font-normal transition-all duration-200 ${
                        sizeSystem === sys
                          ? "bg-black text-white shadow-xs"
                          : "text-neutral-600 hover:text-black"
                      }`}
                    >
                      {sys}
                      {sys === "IN" && isNumericSizes && (
                        <span className="block text-[8px] font-normal text-neutral-400 leading-none -mt-0.5">
                          inch
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Size buttons */}
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((inKey) => {
                    const oos = isSizeOutOfStock(inKey);
                    const sel = selectedSize === inKey;
                    const btnLabel = getBtnLabel(inKey);
                    const tip = getTooltip(inKey);
                    return (
                      <div key={inKey} className="relative group/sz">
                        <button
                          type="button"
                          disabled={oos}
                          onClick={() => {
                            setSelectedSize(inKey);
                            setSizeError("");
                          }}
                          className={`relative min-w-[48px] h-10 px-3 border text-xs uppercase tracking-wider font-normal transition-all duration-200 ${
                            sel
                              ? "bg-black text-white border-black"
                              : oos
                                ? "border-neutral-100 text-neutral-300 cursor-not-allowed bg-neutral-50"
                                : "border-neutral-200 text-neutral-800 hover:border-black hover:text-black"
                          }`}
                        >
                          {oos && (
                            <span className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none">
                              <span className="block w-[80%] h-px bg-neutral-300 rotate-45" />
                            </span>
                          )}
                          <span className={oos ? "opacity-40" : ""}>
                            {btnLabel}
                          </span>
                        </button>
                        {!oos && !sel && tip && (
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 uppercase tracking-wider opacity-0 group-hover/sz:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-md">
                            {tip}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-neutral-400 mt-2.5 flex items-center gap-1.5 uppercase tracking-wider">
                  <FiInfo size={10} className="text-neutral-500" />
                  {isNumericSizes
                    ? "Showing waist sizes in inches. Switch to UK/US to see international equivalents."
                    : "Switch IN / UK / US to see sizes in your preferred standard."}
                </p>

                {sizeError && (
                  <p className="text-xs text-[#ED1C24] mt-2 flex items-center gap-1.5 uppercase tracking-wider">
                    ⚠ {sizeError}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-800 mb-2.5">
                  Quantity
                </p>
                <div className="inline-flex items-center border border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                    className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 text-base"
                  >
                    −
                  </button>
                  <span className="w-10 h-9 flex items-center justify-center text-xs font-normal text-neutral-900 border-x border-neutral-200">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((p) => p + 1)}
                    className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 text-base"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white border border-neutral-100 p-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={!selectedSize || isOutOfStock}
                  className="flex-1 h-12 bg-black hover:bg-[#ED1C24] text-white font-normal text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FiShoppingCart size={15} /> ADD TO BAG
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!selectedSize || isOutOfStock}
                  className="flex-1 h-12 bg-[#ED1C24] hover:bg-black text-white font-normal text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  BUY NOW
                </button>
              </div>
              {isOutOfStock && (
                <div className="mt-3 bg-neutral-50 border border-neutral-200 px-4 py-2.5 text-xs text-[#ED1C24] font-normal uppercase tracking-wider text-center">
                  This product is currently out of stock.
                </div>
              )}
            </div>

            {/* Delivery */}
            <div className="bg-white border border-neutral-100 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-800 flex items-center gap-2 mb-4">
                <span className="w-7 h-7 bg-neutral-100 flex items-center justify-center">
                  <FiTruck size={14} className="text-black" />
                </span>
                Delivery Options
              </p>
              <div className="flex gap-2">
                <input
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 h-11 border border-neutral-200 px-4 text-xs focus:outline-none focus:border-black transition-colors"
                />
                <button
                  type="button"
                  onClick={checkDelivery}
                  className="px-6 h-11 bg-black text-white text-xs font-normal uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                >
                  Check
                </button>
              </div>
              {deliveryState && (
                <div
                  className={`mt-3 p-3 text-xs uppercase tracking-wider ${
                    deliveryState.type === "error"
                      ? "bg-red-50 text-[#ED1C24] border border-red-100"
                      : "bg-neutral-50 border border-neutral-200"
                  }`}
                >
                  {deliveryState.type === "success" ? (
                    <div className="space-y-1">
                      <p className="text-black font-medium">
                        ✓ {deliveryState.message}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        COD: {deliveryState.cod} · Shipping:{" "}
                        {deliveryState.shipping}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {deliveryState.returns}
                      </p>
                    </div>
                  ) : (
                    <p>{deliveryState.message}</p>
                  )}
                </div>
              )}
            </div>

            {/* Offers */}
            <div className="bg-white border border-neutral-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-800">
                  🎁 Available Offers
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAllOffers((p) => !p)}
                  className="text-xs text-neutral-700 hover:text-black underline uppercase tracking-wider"
                >
                  {showAllOffers ? "Show Less" : "View All"}
                </button>
              </div>
              <ul className="space-y-2">
                {(showAllOffers ? OFFER_LIST : OFFER_LIST.slice(0, 2)).map(
                  (offer) => (
                    <li
                      key={offer}
                      className="flex items-start gap-2.5 text-xs text-neutral-600 bg-neutral-50 px-3 py-2.5 uppercase tracking-wider"
                    >
                      <span className="text-[#ED1C24] shrink-0 mt-0.5">
                        ✦
                      </span>
                      <span>{offer}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Specifications */}
            {Object.keys(specifications).length > 0 && (
              <div className="bg-white border border-neutral-100 p-5">
                <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-800 mb-4">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-2 gap-x-6">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-2.5 border-b border-neutral-100 text-xs"
                    >
                      <span className="text-neutral-500 uppercase tracking-wider">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                      <span className="text-neutral-800 uppercase tracking-wider">
                        {String(value).replace(/-/g, " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white border border-neutral-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-medium uppercase tracking-wider text-neutral-900">
                  Ratings &amp; Reviews
                </h2>
                <select
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value)}
                  className="h-9 border border-neutral-200 px-3 text-xs uppercase tracking-wider focus:outline-none focus:border-black text-neutral-600"
                >
                  <option value="helpful">Most Helpful</option>
                  <option value="latest">Latest First</option>
                </select>
              </div>

              {reviewStats && (
                <div className="flex gap-8 mb-6 bg-neutral-50 p-4">
                  <div className="text-center shrink-0">
                    <p className="text-4xl font-normal text-neutral-900 leading-none">
                      {reviewStats.avgRating?.toFixed(1) || "0.0"}
                    </p>
                    <Stars rating={reviewStats.avgRating || 0} size={15} />
                    <p className="text-[11px] uppercase tracking-wider text-neutral-400 mt-1">
                      {reviewStats.totalReviews || 0} reviews
                    </p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {reviewStats.avgQuality && (
                      <div className="text-xs text-neutral-600 uppercase tracking-wider">
                        <div>
                          Quality: {reviewStats.avgQuality?.toFixed(1)} ★
                        </div>
                        <div>Fit: {reviewStats.avgFit?.toFixed(1)} ★</div>
                        <div>Value: {reviewStats.avgValue?.toFixed(1)} ★</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {loadingReviews && reviews.length === 0 ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
                </div>
              ) : (
                <div className="space-y-5">
                  {sortedReviews.map((review) => (
                    <article
                      key={review._id}
                      className="border-t border-neutral-100 pt-5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-neutral-900 flex items-center justify-center text-xs font-normal text-white uppercase">
                            {review.user?.name?.[0] ||
                              review.user?.email?.[0] ||
                              "U"}
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-neutral-800 leading-none">
                              {review.user?.name ||
                                review.user?.email?.split("@")[0] ||
                                "Anonymous"}
                            </p>
                            <span className="inline-flex items-center gap-1 bg-black text-white text-[10px] font-normal px-1.5 py-0.5 mt-0.5">
                              {review.rating}{" "}
                              <FiStar size={9} className="fill-white" />
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] uppercase tracking-wider text-neutral-400">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "2-digit",
                            },
                          )}
                        </span>
                      </div>

                      {review.title && (
                        <p className="text-xs font-medium uppercase tracking-wider text-neutral-800 mt-1">
                          {review.title}
                        </p>
                      )}

                      <p className="text-xs text-neutral-600 leading-relaxed mt-1">
                        {review.comment}
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={() =>
                            handleReviewLike(review._id, review.userAction)
                          }
                          className={`text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                            review.userAction === "liked"
                              ? "text-black font-medium"
                              : "text-neutral-400 hover:text-black"
                          }`}
                        >
                          <FiThumbsUp
                            size={14}
                            className={
                              review.userAction === "liked"
                                ? "fill-black"
                                : ""
                            }
                          />
                          <span>Helpful</span>
                          {review.likes > 0 && (
                            <span className="text-xs">
                              ({review.likes})
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() =>
                            handleReviewDislike(review._id, review.userAction)
                          }
                          className={`text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                            review.userAction === "disliked"
                              ? "text-[#ED1C24] font-medium"
                              : "text-neutral-400 hover:text-[#ED1C24]"
                          }`}
                        >
                          <FiThumbsDown
                            size={14}
                            className={
                              review.userAction === "disliked"
                                ? "fill-[#ED1C24]"
                                : ""
                            }
                          />
                          <span>Not helpful</span>
                          {review.dislikes > 0 && (
                            <span className="text-xs">
                              ({review.dislikes})
                            </span>
                          )}
                        </button>
                      </div>
                    </article>
                  ))}

                  {hasMoreReviews && reviews.length > 0 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={loadMoreReviews}
                        disabled={loadingReviews}
                        className="px-6 py-2.5 border border-black text-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                      >
                        {loadingReviews ? "Loading..." : "Load More Reviews"}
                      </button>
                    </div>
                  )}

                  {!loadingReviews && reviews.length === 0 && (
                    <div className="text-center py-8 text-neutral-400 text-xs uppercase tracking-wider">
                      <p>
                        No reviews yet. Be the first to review this product!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-16 pt-8 border-t border-neutral-100">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-sm sm:text-base font-normal uppercase tracking-[0.16em] text-neutral-900">
                You May Also Like
              </h2>
            </div>
            <Link
              to="/productlist"
              className="text-xs text-neutral-500 hover:text-black uppercase tracking-wider"
            >
              View All →
            </Link>
          </div>
          <div
            className="flex gap-4 overflow-x-auto pb-4 snap-x"
            style={{ scrollbarWidth: "none" }}
          >
            {wishlistItems?.length > 0 ? (
              wishlistItems.map((w) => {
                const item = {
                  id: w.product._id,
                  name: w.product.name,
                  front: w.variant?.image || w.product?.image,
                  price: w.variant?.price || w.product?.startingPrice || 0,
                  originalPrice: w.variant?.mrp || w.product?.mrp || 0,
                  brand: "Wearaah",
                  stock: w.variant?.stock,
                };

                return (
                  <ProductCard
                    key={w._id}
                    item={item}
                    location={location}
                  />
                );
              })
            ) : (
              <p className="text-neutral-400 text-xs uppercase tracking-wider">Explore our new arrivals and popular styles</p>
            )}
          </div>
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-100">
            <div className="mb-6">
              <h2 className="text-sm sm:text-base font-normal uppercase tracking-[0.16em] text-neutral-900">
                Recently Viewed
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {recentlyViewed.map((item) => (
                <Link
                  to={`/product/${item.id}`}
                  key={item.id}
                  className="group block"
                >
                  <div className="bg-white overflow-hidden">
                    <div className="relative overflow-hidden aspect-[3/4] bg-neutral-100">
                      <img
                        src={item.front}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="pt-2">
                      <p className="text-xs font-normal text-neutral-800 line-clamp-1 uppercase tracking-wide">
                        {item.name}
                      </p>
                      <p className="text-xs font-normal text-[#ED1C24] mt-1">
                        ₹{CURRENCY_FORMATTER.format(item.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-3 md:hidden z-40 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
              Price
            </p>
            <p className="font-normal text-neutral-900 text-base leading-tight">
              ₹{CURRENCY_FORMATTER.format(displayPrice)}
            </p>
          </div>
          <button
            type="button"
            onClick={addToCart}
            disabled={!selectedSize || isOutOfStock}
            className="h-10 px-5 bg-black text-white text-xs font-normal uppercase tracking-[0.14em] disabled:opacity-40 hover:bg-[#ED1C24] transition-colors"
          >
            ADD TO BAG
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!selectedSize || isOutOfStock}
            className="h-10 px-6 bg-[#ED1C24] text-white text-xs font-normal uppercase tracking-[0.14em] disabled:opacity-40 hover:bg-black transition-colors"
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
