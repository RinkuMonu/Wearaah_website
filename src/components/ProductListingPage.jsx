import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  FiAlertCircle,
  FiChevronDown,
  FiGrid,
  FiHeart,
  FiList,
  FiSearch,
  FiStar,
  FiShoppingBag,
} from "react-icons/fi";
import { CiFilter } from "react-icons/ci";
import api from "./service/axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/Productlist/ProductSlice";
import {
  fatchSubCategory,
  fatchSubCategoryByCategoryId,
} from "../features/subCategory/subCategorySlice";
import { fatchBrands } from "../features/Brands/brandSlice";
import ProductCard from "./common/ProductCard";
import { toast } from "react-toastify";
import {
  addToWishlist,
  removeFromWishlist,
  selectWishlistItems,
} from "../features/Wishlist/wishlistSlice";
import { useAuth } from "./service/AuthContext";
import {
  getCartItems,
  setCartItems,
  CART_UPDATED_EVENT,
} from "../utils/cartStorage";
import { resolveImageUrl, DEFAULT_PRODUCT_IMAGES } from "../utils/resolveImage";

const PAGE_SIZE = 8;

// Curated New Arrivals dataset matching Killer Jeans reference
const NEW_ARRIVALS_DATA = [
  // ─── 7 JEANS ──────────────────────────────────────────────────────────────
  {
    _id: "na-jeans-1",
    id: "na-jeans-1",
    name: "MEN'S BLUE SLIM FIT JEANS",
    category: "jeans",
    price: 3599,
    originalPrice: 4499,
    front: "/images/jeans.jpg",
    back: "/images/11.webp",
    badge: "SOLD OUT",
    sizes: ["30", "32", "34", "36"],
    colors: ["Blue"],
  },
  {
    _id: "na-jeans-2",
    id: "na-jeans-2",
    name: "MEN'S DARK GREY SKINNY FIT JEANS",
    category: "jeans",
    price: 3299,
    originalPrice: 4199,
    front: "/images/10.webp",
    back: "/images/12.webp",
    badge: "SOLD OUT",
    sizes: ["30", "32", "34", "36"],
    colors: ["Dark Grey"],
  },
  {
    _id: "na-jeans-3",
    id: "na-jeans-3",
    name: "MEN'S DARK BLUE SLIM FIT JEANS",
    category: "jeans",
    price: 3899,
    originalPrice: 4999,
    front: "/images/12.webp",
    back: "/images/10.webp",
    badge: "SOLD OUT",
    sizes: ["30", "32", "34", "36"],
    colors: ["Dark Blue"],
  },
  {
    _id: "na-jeans-4",
    id: "na-jeans-4",
    name: "MEN'S LIGHT BLUE SLIM FIT JEANS",
    category: "jeans",
    price: 3599,
    originalPrice: 4399,
    front: "/images/11.webp",
    back: "/images/jeans.jpg",
    badge: "SOLD OUT",
    sizes: ["30", "32", "34", "36"],
    colors: ["Light Blue"],
  },
  {
    _id: "na-jeans-5",
    id: "na-jeans-5",
    name: "MEN'S RAW INDIGO SLIM JEANS",
    category: "jeans",
    price: 3799,
    originalPrice: 4699,
    front: "/images/21.webp",
    back: "/images/22.webp",
    badge: "SOLD OUT",
    sizes: ["30", "32", "34", "36"],
    colors: ["Indigo"],
  },
  {
    _id: "na-jeans-6",
    id: "na-jeans-6",
    name: "MEN'S VINTAGE WASH TAPERED JEANS",
    category: "jeans",
    price: 3699,
    originalPrice: 4599,
    front: "/images/22.webp",
    back: "/images/21.webp",
    badge: "SOLD OUT",
    sizes: ["30", "32", "34", "36"],
    colors: ["Vintage Wash"],
  },
  {
    _id: "na-jeans-7",
    id: "na-jeans-7",
    name: "MEN'S ONYX BLACK STRETCH JEANS",
    category: "jeans",
    price: 3599,
    originalPrice: 4499,
    front: "/images/cargopants.webp",
    back: "/images/10.webp",
    badge: "SOLD OUT",
    sizes: ["30", "32", "34", "36"],
    colors: ["Onyx Black"],
  },

  // ─── 5 T-SHIRTS ───────────────────────────────────────────────────────────
  {
    _id: "na-tee-1",
    id: "na-tee-1",
    name: "MEN'S OLIVE SOLID SLIM FIT T-SHIRTS",
    category: "t-shirts",
    price: 1399,
    originalPrice: 1999,
    front: "/images/tee1.jpg",
    back: "/images/plain.webp",
    badge: "SOLD OUT",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Olive"],
  },
  {
    _id: "na-tee-2",
    id: "na-tee-2",
    name: "MEN'S GREY PRINTED SLIM FIT T-SHIRTS",
    category: "t-shirts",
    price: 1399,
    originalPrice: 1999,
    front: "/images/printed.webp",
    back: "/images/plain.webp",
    badge: "SOLD OUT",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Grey"],
  },
  {
    _id: "na-tee-3",
    id: "na-tee-3",
    name: "MEN'S BLUE PRINTED SLIM FIT T-SHIRTS",
    category: "t-shirts",
    price: 1399,
    originalPrice: 1999,
    front: "/images/tshirts.avif",
    back: "/images/printed.webp",
    badge: "SOLD OUT",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue"],
  },
  {
    _id: "na-tee-4",
    id: "na-tee-4",
    name: "MEN'S WHITE GRAPHIC CREW T-SHIRT",
    category: "t-shirts",
    price: 1299,
    originalPrice: 1799,
    front: "/images/plain.webp",
    back: "/images/tee1.jpg",
    badge: "SOLD OUT",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
  },
  {
    _id: "na-tee-5",
    id: "na-tee-5",
    name: "MEN'S CHARCOAL MINIMAL POCKET T-SHIRT",
    category: "t-shirts",
    price: 1499,
    originalPrice: 2099,
    front: "/images/polo.webp",
    back: "/images/plain.webp",
    badge: "SOLD OUT",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Charcoal"],
  },

  // ─── PLAIN SHIRTS ────────────────────────────────────────────────────────
  {
    _id: "na-shirt-1",
    id: "na-shirt-1",
    name: "MEN'S CRISP WHITE LINEN PLAIN SHIRT",
    category: "shirts",
    price: 2499,
    originalPrice: 3499,
    front: "/images/1.jpg",
    back: "/images/2.jpg",
    badge: "SOLD OUT",
    sizes: ["38", "40", "42", "44"],
    colors: ["Crisp White"],
  },
  {
    _id: "na-shirt-2",
    id: "na-shirt-2",
    name: "MEN'S SKY BLUE OXFORD COTTON SHIRT",
    category: "shirts",
    price: 2299,
    originalPrice: 3199,
    front: "/images/2.jpg",
    back: "/images/1.jpg",
    badge: "SOLD OUT",
    sizes: ["38", "40", "42", "44"],
    colors: ["Sky Blue"],
  },
  {
    _id: "na-shirt-3",
    id: "na-shirt-3",
    name: "MEN'S MIDNIGHT BLACK SOLID CASUAL SHIRT",
    category: "shirts",
    price: 2599,
    originalPrice: 3599,
    front: "/images/4.jpg",
    back: "/images/5.jpg",
    badge: "SOLD OUT",
    sizes: ["38", "40", "42", "44"],
    colors: ["Midnight Black"],
  },
  {
    _id: "na-shirt-4",
    id: "na-shirt-4",
    name: "MEN'S BEIGE LINEN RESORT SHIRT",
    category: "shirts",
    price: 2699,
    originalPrice: 3699,
    front: "/images/8.webp",
    back: "/images/9.webp",
    badge: "SOLD OUT",
    sizes: ["38", "40", "42", "44"],
    colors: ["Beige"],
  },
  {
    _id: "na-shirt-5",
    id: "na-shirt-5",
    name: "MEN'S SAGE GREEN OVERSIZED PLAIN SHIRT",
    category: "shirts",
    price: 2399,
    originalPrice: 3299,
    front: "/images/14.webp",
    back: "/images/15.jpg",
    badge: "SOLD OUT",
    sizes: ["38", "40", "42", "44"],
    colors: ["Sage Green"],
  },
  {
    _id: "na-shirt-6",
    id: "na-shirt-6",
    name: "MEN'S NAVY BLUE MANDARIN COLLAR SHIRT",
    category: "shirts",
    price: 2499,
    originalPrice: 3499,
    front: "/images/shirts.avif",
    back: "/images/3.jpg",
    badge: "SOLD OUT",
    sizes: ["38", "40", "42", "44"],
    colors: ["Navy Blue"],
  },
];

const parseArray = (v) => (v ? v.split(",").filter(Boolean) : []);
const emptyFilters = () => ({
  subCategoryId: "",
  brand: [],
  size: [],
  gender: [],
  color: [],
  isNewArrival: false,
  price: "",
  minDiscount: "",
  minRating: "",
});

const NewArrivalItemCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const wishlistItems = useSelector(selectWishlistItems) || [];
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlistItems.some(
    (item) => (item.product?._id || item.productId || item._id) === product.id
  );

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info("Please sign in to save items to your wishlist");
      return;
    }
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist({ productId: product.id })).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlist({ productId: product.id })).unwrap();
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
    const size = product.sizes?.[0] || "32";
    const color = product.colors?.[0] || "Standard";

    const idx = existing.findIndex(
      (item) => (item.productId === product.id || item.id === product.id) && item.size === size
    );
    if (idx > -1) {
      existing[idx].quantity += 1;
    } else {
      existing.push({
        lineId: `${product.id}-${size}-${Date.now()}`,
        productId: product.id,
        id: product.id,
        quantity: 1,
        size,
        color,
        price: product.price,
        mrp: product.originalPrice,
        name: product.name,
        image: product.front,
      });
    }
    setCartItems(existing);
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
    toast.success(`Added ${product.name} to cart`);
  };

  const categoryFallback =
    product.category === "shirts"
      ? "/images/shirts.avif"
      : product.category === "t-shirts"
      ? "/images/polo.webp"
      : "/images/jeans.jpg";

  const frontImg = resolveImageUrl(product.front, categoryFallback);
  const backImg = product.back ? resolveImageUrl(product.back, frontImg) : frontImg;

  return (
    <div
      className="group flex flex-col bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/productdetail?id=${product.id}&name=${encodeURIComponent(product.name)}`}
        className="block relative aspect-[3/4] bg-[#f4f4f4] overflow-hidden"
      >
        <img
          src={frontImg}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
            backImg && backImg !== frontImg && isHovered
              ? "opacity-0 scale-105"
              : "opacity-100 scale-100"
          }`}
          onError={(e) => {
            if (!e.currentTarget.dataset.failed) {
              e.currentTarget.dataset.failed = "true";
              e.currentTarget.src = categoryFallback;
            }
          }}
        />

        {backImg && backImg !== frontImg && (
          <img
            src={backImg}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            onError={(e) => {
              if (!e.currentTarget.dataset.failed) {
                e.currentTarget.dataset.failed = "true";
                e.currentTarget.src = categoryFallback;
              }
            }}
          />
        )}

        {/* Wishlist Heart Icon Top-Right */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-800 hover:text-[#08266B] flex items-center justify-center transition-all shadow-xs cursor-pointer z-10"
          aria-label="Wishlist"
        >
          <FiHeart
            size={16}
            className={isWishlisted ? "fill-[#08266B] text-[#08266B]" : ""}
          />
        </button>

        {/* Bottom Left Badge */}
        {product.badge && (
          <span className="absolute bottom-3 left-3 bg-black text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 select-none pointer-events-none">
            {product.badge}
          </span>
        )}

        {/* Bottom Right Cart Trigger */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-900 hover:text-[#08266B] flex items-center justify-center transition-all shadow-xs cursor-pointer opacity-90 group-hover:opacity-100 z-10"
          aria-label="Add to bag"
        >
          <FiShoppingBag size={15} />
        </button>
      </Link>

      {/* Info below image */}
      <div className="pt-3">
        <Link
          to={`/productdetail?id=${product.id}&name=${encodeURIComponent(product.name)}`}
          className="block text-xs sm:text-[13px] font-medium uppercase tracking-wider text-neutral-900 hover:text-[#08266B] transition-colors truncate"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs sm:text-[13px] font-normal text-neutral-900">
            Rs. {product.price.toLocaleString("en-IN")}.00
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[11px] text-neutral-400 line-through">
              Rs. {product.originalPrice.toLocaleString("en-IN")}.00
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductListingPage = () => {
  const isInitialLoad = useRef(true);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.products);

  const { brands } = useSelector((state) => state.brands);
  const { subcategoriesById, dynamicFilters, subcategories } = useSelector(
    (state) => state.subCategory,
  );

  console.log(subcategoriesById, dynamicFilters, subcategories);

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const categoryId = searchParams.get("ctd");
  const subCategoryId = searchParams.get("subCategoryId");

  const brandId = searchParams.get("brandId");
  const hasBrand = !!brandId;
  const hasCategory = !!searchParams.get("ctd");
  const hasSubCategory = !!searchParams.get("subCategoryId");
  const isSubCategoryOnlyPage = !hasCategory && hasSubCategory;

  const [sortBy, setSortBy] = useState(searchParams.get("sort"));
  const [viewMode, setViewMode] = useState("grid");

  const [openFilters, setOpenFilters] = useState({
    subCategory: true,
    brand: true,
    size: true,
    color: true,
    price: true,
    rating: true,
    discount: true,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const loadState = status;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const SubCategory = categoryId ? subcategoriesById : subcategories;
  const showSubCategoryFilter = SubCategory?.length > 0 ? true : false;

  const [filters, setFilters] = useState(() => ({
    ...emptyFilters(),
    categoryId: searchParams.get("ctd"),
    subCategory: searchParams.get("subCategory"),
    subCategoryId: searchParams.get("subCategoryId"),
    brand: parseArray(brandId),
    size: parseArray(searchParams.get("size")),
    color: parseArray(searchParams.get("color")),
    isNewArrival: searchParams.get("isNewArrival") === "true",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minDiscount: searchParams.get("discount") || "",
    minRating: searchParams.get("rating") || "",
  }));

  const allProducts = useSelector((state) => state.products.products);
  console.log(allProducts);

  const hasGender = filters.gender?.length || searchParams.get("gender");

  const sentinelRef = useRef(null);
  const buildParams = () => {
    const params = {
      category: categoryId,
      subCategory: subCategoryId,
      brand: filters.brand.length ? filters.brand : [],
      gender: filters.gender.length ? filters.gender : [],
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: sortBy,
      page: 1,
      limit: 10,
    };
    if (filters.isNewArrival) {
      params.isNewArrival = true;
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return;

      // skip already handled keys
      if (["categoryId", "subCategoryId", "subCategory"].includes(key)) return;

      params[key] = Array.isArray(value) ? value : value;
    });
    return params;
  };

  const key = JSON.stringify(buildParams());
  const products = allProducts[key] || [];
  const isLoading = status[key] === "loading";

  const params = useMemo(
    () => buildParams(),
    [filters, sortBy, categoryId, subCategoryId],
  );

  useEffect(() => {
    dispatch(fetchProducts(params));
  }, [params]);

  useEffect(() => {
    dispatch(fatchBrands());
  }, []);

  useEffect(() => {
    if (categoryId) {
      dispatch(
        fatchSubCategoryByCategoryId({ categoryId, gender: filters.gender }),
      );
    }
  }, [categoryId, filters]);
  useEffect(() => {
    if (!categoryId) {
      dispatch(fatchSubCategory());
    }
  }, [filters, category, sortBy]);

  useEffect(() => {
    const subCategoryIdFromURL = searchParams.get("subCategoryId");
    const subCategoryFromURL = searchParams.get("subCategory");
    const brandIdFromURL = searchParams.get("brandId");
    const genderFromURL = searchParams.get("gender");

    setFilters((prev) => ({
      ...prev,
      subCategoryId: subCategoryIdFromURL || "",
      subCategory: subCategoryFromURL || "",

      brand: brandIdFromURL ? brandIdFromURL.split(",") : [],
      gender: genderFromURL ? genderFromURL.split(",") : [],
      size: parseArray(searchParams.get("size")),
      color: parseArray(searchParams.get("color")),
      price: "",
      minDiscount: "",
      minRating: "",
    }));
  }, [location.search]);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    const params = new URLSearchParams();

    // ✅ category
    if (category) params.set("category", category);
    if (categoryId) params.set("ctd", categoryId);

    // ✅ subcategory
    if (filters.subCategoryId) {
      params.set("subCategoryId", filters.subCategoryId);
      params.set("subCategory", filters.subCategory);
    }
    if (filters.isNewArrival) {
      params.set("isNewArrival", "true");
    }
    if (filters.brand?.length) {
      if (filters.brand?.length) {
        const selectedBrands = brands.filter((b) =>
          filters.brand.includes(b._id),
        );

        params.set("brand", selectedBrands.map((b) => b.slug).join(","));

        params.set("brandId", selectedBrands.map((b) => b._id).join(","));
      }
    }
    // 🔥 ALL FILTERS (dynamic + static)
    Object.entries(filters).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return;

      if (
        [
          "categoryId",
          "subCategoryId",
          "subCategory",
          "brand",
          "isNewArrival",
        ].includes(key)
      )
        return;

      if (Array.isArray(value)) {
        params.set(key, value.join(","));
      } else {
        params.set(key, value);
      }
    });

    // ✅ sort
    if (sortBy) params.set("sort", sortBy);

    setSearchParams(params, { replace: true });
  }, [filters, sortBy, category, categoryId, brands]);

  useEffect(() => setVisibleCount(PAGE_SIZE), [filters, sortBy]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting)
          setVisibleCount((n) => Math.min(n + PAGE_SIZE));
      },
      { rootMargin: "220px" },
    );
    return () => observer.disconnect();
  }, [visibleCount]);

  const toggleFilter = (key, value) => {
    console.log(key, value);

    setFilters((prev) => {
      if (Array.isArray(prev[key])) {
        const exists = prev[key].includes(value);
        const next = exists
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value];
        return { ...prev, [key]: next };
      }
      const next = prev[key] === value ? "" : value;
      return { ...prev, [key]: next };
    });
  };

  const toggleSubCategory = (item) => {
    const isSelected = filters.subCategoryId === item._id;

    if (isSelected) {
      setFilters((prev) => ({
        ...prev,
        subCategoryId: "",
        subCategory: "",
        size: [],
      }));

      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.delete("subCategory");
        params.delete("subCategoryId");
        return params;
      });
    } else {
      setFilters((prev) => ({
        ...prev,
        subCategoryId: item._id,
        subCategory: item.slug,
        size: [],
      }));

      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("subCategory", item.slug);
        params.set("subCategoryId", item._id);
        return params;
      });
    }
  };

  const toggleBrand = (brand) => {
    const isSelected = filters.brand.includes(brand._id);

    if (isSelected) {
      // ❌ remove
      setFilters((prev) => ({
        ...prev,
        brand: prev.brand.filter((id) => id !== brand._id),
      }));
    } else {
      // ✅ add
      setFilters((prev) => ({
        ...prev,
        brand: [...prev.brand, brand._id],
      }));
    }
  };

  const clearAll = () => {
    setFilters((prev) => ({
      ...prev,
      ...emptyFilters(),
    }));
    setSearchParams({ category, ctd: categoryId });
  };

  const formatCategory = (slug) => {
    if (!slug) return "";

    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const selectedSubCategory = SubCategory?.find(
    (item) => item._id === filters.subCategoryId,
  );

  const dynamicSizes = useMemo(() => {
    const sizeType = selectedSubCategory?.sizeType;

    if (sizeType === "alpha") {
      return ["XS", "S", "M", "L", "XL", "XXL"];
    }

    if (sizeType === "numeric") {
      return ["28", "30", "32", "34", "36", "38", "40"];
    }

    return [];
  }, [selectedSubCategory]);

  const isNewArrivalPage =
    filters.isNewArrival || searchParams.get("isNewArrival") === "true";
  const [activeNewArrivalTab, setActiveNewArrivalTab] = useState("all");
  const [newArrivalSort, setNewArrivalSort] = useState("featured");

  const displayedNewArrivals = useMemo(() => {
    let list = [...NEW_ARRIVALS_DATA];
    if (activeNewArrivalTab !== "all") {
      list = list.filter((p) => p.category === activeNewArrivalTab);
    }
    if (newArrivalSort === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (newArrivalSort === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (newArrivalSort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [activeNewArrivalTab, newArrivalSort]);

  if ((loadState === "error" || loadState === "offline") && !products.length && !isNewArrivalPage) {
    return (
      <section className="min-h-screen bg-white p-8 text-center">
        <FiAlertCircle className="mx-auto w-12 h-12 text-[#995d37]" />
        <h2 className="mt-4 text-2xl font-bold">
          {loadState === "offline" ? "No internet" : "API error"}
        </h2>
        <p className="mt-2 text-gray-600">
          Retry or continue with fallback products.
        </p>
        <button
          onClick={() => dispatch(fetchProducts(buildParams()))}
          className="mt-6 px-6 py-2.5 bg-black hover:bg-[#ED1C24] text-white text-xs uppercase tracking-wider font-medium transition-colors"
        >
          Retry
        </button>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading
            ? "Loading..."
            : products.slice(0, 4).map((p) => (
                <div key={p.id} className="border rounded-xl p-3">
                  <img
                    src={resolveImageUrl(Array.isArray(p.productImage) ? p.productImage[0] : p.productImage, DEFAULT_PRODUCT_IMAGES[0])}
                    className="h-32 w-full rounded object-cover"
                    alt={p.name || "Product"}
                    onError={(e) => {
                      if (!e.currentTarget.dataset.failed) {
                        e.currentTarget.dataset.failed = "true";
                        e.currentTarget.src = DEFAULT_PRODUCT_IMAGES[0];
                      }
                    }}
                  />
                  <p className="text-sm mt-2">{p.name}</p>
                </div>
              ))}
        </div>
      </section>
    );
  }

  if (isNewArrivalPage) {
    return (
      <section className="min-h-screen bg-white pb-16 font-sans">
        {/* ─── 1. FIRST SCREEN HERO BANNER (Exact Screenshot 4) ─── */}
        <div className="relative w-full bg-[#f6f5f3] overflow-hidden min-h-[360px] sm:min-h-[460px] md:min-h-[520px] flex items-center border-b border-neutral-200">
          <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-10 flex flex-col md:flex-row items-center justify-between relative z-10">
            
            {/* Left Typography */}
            <div className="max-w-xl text-neutral-900 mb-8 md:mb-0">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.08] font-display">
                LIGHT,<br />
                BREEZY AND PERFECT<br />
                <span className="text-[#08266B]">FOR THE SEASON!</span>
              </h2>
              <p className="mt-4 text-xs sm:text-sm uppercase tracking-[0.2em] text-neutral-500 font-medium">
                Summer • Denim &amp; Contemporary Collection 2026
              </p>
            </div>

            {/* Right Editorial Model */}
            <div className="w-full md:w-auto flex justify-center md:justify-end">
              <div className="w-72 sm:w-80 md:w-96 aspect-[3/4] overflow-hidden shadow-2xl rounded-xs bg-neutral-200">
                <img
                  src="/images/15.jpg"
                  alt="New Arrivals Campaign"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>

          {/* Large Background Watermark Typography */}
          <div className="absolute right-4 sm:right-10 bottom-2 sm:bottom-4 select-none pointer-events-none opacity-20">
            <span className="text-5xl sm:text-7xl md:text-8xl font-black tracking-wider uppercase text-neutral-900 leading-none block text-right font-display">
              NEW<br />ARRIVALS
            </span>
          </div>
        </div>

        {/* ─── 2. SUBHEADER BAR (Exact Screenshot 1) ─── */}
        <div className="border-b border-neutral-200 bg-white sticky top-[64px] sm:top-[80px] z-30 shadow-xs">
          <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-4 flex flex-wrap items-center justify-between gap-4">
            
            {/* Left: Breadcrumbs & Product Count */}
            <div>
              <div className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium mb-0.5">
                <Link to="/" className="hover:text-black">Home</Link>
                <span className="mx-1.5">/</span>
                <span className="text-neutral-800 font-semibold">New Arrivals</span>
              </div>
              <span className="text-xs sm:text-sm uppercase tracking-[0.16em] font-bold text-neutral-900">
                {displayedNewArrivals.length} PRODUCTS
              </span>
            </div>

            {/* Center: Category Filter Tabs */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1">
              {[
                { id: "all", label: "ALL PRODUCTS" },
                { id: "jeans", label: "JEANS (7)" },
                { id: "t-shirts", label: "T-SHIRTS (5)" },
                { id: "shirts", label: "PLAIN SHIRTS (6)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveNewArrivalTab(tab.id)}
                  className={`px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all rounded-full cursor-pointer whitespace-nowrap ${
                    activeNewArrivalTab === tab.id
                      ? "bg-[#08266B] text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right: Filter & Sort Toggle */}
            <div className="flex items-center gap-4">
              <select
                value={newArrivalSort}
                onChange={(e) => setNewArrivalSort(e.target.value)}
                className="text-xs uppercase tracking-wider font-semibold border-b border-black py-1 px-1 bg-transparent outline-none cursor-pointer"
              >
                <option value="featured">FILTER &amp; SORT: FEATURED</option>
                <option value="price-low">PRICE: LOW TO HIGH</option>
                <option value="price-high">PRICE: HIGH TO LOW</option>
                <option value="name">NAME (A-Z)</option>
              </select>
            </div>

          </div>
        </div>

        {/* ─── 3. 3-COLUMN PRODUCT GRID (Exact Screenshots 1, 2, 3, 5) ─── */}
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {displayedNewArrivals.map((prod) => (
              <NewArrivalItemCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white pb-8">
      <div className="">
        {/* <div className="w-full h-48 sm:h-64 lg:h-80 mb-6 overflow-hidden">
          <img
            src={
              bannerImage?.startsWith("/uploads")
                ? `${BASE_URL}${bannerImage}`
                : bannerImage
            }
            className="w-full h-full object-cover"
            alt="Banner"
          />
        </div> */}
        <div className="border-b border-gray-200 my-6 py-6 sm:px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 items-start lg:items-center">
            <nav className="text-sm text-gray-500 flex items-center gap-1 lg:gap-2 flex-wrap">
              <Link
                to="/"
                className="hover:text-gray-900 font-medium transition-colors"
              >
                Home
              </Link>
              <span className="hidden sm:inline">/</span>
              <span>Men</span>
              <span className="hidden sm:inline">/</span>
              <span>Clothing</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-none">
                {category}
              </span>
            </nav>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end sm:items-center text-right sm:text-left">
              <h1 className="text-xl sm:text-2xl font-normal text-gray-900 uppercase tracking-widest leading-tight">
                {formatCategory(category)}
              </h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-normal">
                {products?.length || 0} products
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col px-10 lg:flex-row justify-between mt-5 items-start lg:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
          <div className="overflow-x-auto mb-6 -mx-4 sm:-mx-6 lg:mx-0 lg:pb-0 lg:overflow-visible">
            <div className="flex gap-4 px-4 sm:px-6 lg:px-0 min-w-max">
              {!isSubCategoryOnlyPage &&
                SubCategory?.map((tile) => (
                  <button
                    key={tile._id}
                    type="button"
                    className="flex flex-col items-center gap-2 px-2 py-1 shrink-0"
                    onClick={() => toggleSubCategory(tile)}
                  >
                    <span className="w-14 h-14 rounded-full overflow-hidden shadow">
                      <img
                        src={`${BASE_URL}${tile?.smallimage}`}
                        alt={tile.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </span>
                    <span className="text-xs font-normal uppercase tracking-wider text-gray-700">
                      {tile.name}
                    </span>
                  </button>
                ))}
            </div>
          </div>
          <button
            className="lg:hidden px-4 py-2 bg-black hover:bg-[#ED1C24] text-white text-xs uppercase tracking-wider font-medium"
            onClick={() => setShowMobileFilters((v) => !v)}
          >
            Filter &amp; Sort
          </button>
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex gap-1 p-1 rounded-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-black text-white" : "text-gray-600"}`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-black text-white" : "text-gray-600"}`}
              >
                <FiList />
              </button>
            </div>
            <select
              value={sortBy || "recommended"}
              onChange={(e) => {
                setSortBy(e.target.value);
              }}
              className="px-3 py-2 border rounded-md text-sm"
            >
              {[
                ["recommended", "Recommended"],
                ["new", "New arrivals"],
                ["price-low", "Price: Low to High"],
                ["price-high", "Price: High to Low"],
                ["discount", "Discount"],
                ["rating", "Customer rating"],
                ["popularity", "Popularity"],
              ].map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:px-5 px-6">
          <aside
            className={`w-full lg:w-64 ${showMobileFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white p-6 border-r border-gray-200 lg:sticky lg:top-4">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CiFilter />
                Filters
              </h2>
              {[
                ...(showSubCategoryFilter
                  ? [["subCategory", SubCategory]]
                  : []),
                ["brand", brands],
                ["gender", ["Men", "Women", "Boys", "Girls", "Kids", "Unisex"]],
                ...(filters.subCategoryId
                  ? Object.entries(dynamicFilters).filter(
                      ([key]) => !["size", "color"].includes(key),
                    )
                  : []),

                ...(filters.subCategoryId ? [["size", dynamicSizes]] : []),

                [
                  "color",
                  ["Black", "White", "Grey", "Blue", "Red", "Navy", "Green"],
                ],
              ].map((item, index) => {
                return (
                  <div
                    key={index}
                    className="mb-5 border-b pb-4 border-gray-200"
                  >
                    <button
                      className="w-full flex items-center justify-between font-semibold"
                      onClick={() =>
                        setOpenFilters((s) => ({
                          ...s,
                          [item[0]]: !s[item[0]],
                        }))
                      }
                    >
                      {item[0].toUpperCase()}
                      <FiChevronDown
                        className={openFilters[item[0]] ? "rotate-180" : ""}
                      />
                    </button>

                    {openFilters[item[0]] && (
                      <div className="mt-3 space-y-2">
                        {item[1]?.map((op) => {
                          const value = typeof op === "string" ? op : op.name;

                          return (
                            <label
                              key={value}
                              className="flex items-center text-sm"
                            >
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={
                                  item[0] === "subCategory"
                                    ? filters.subCategoryId === op._id
                                    : item[0] === "brand"
                                      ? filters.brand.includes(op._id)
                                      : filters[item[0]]?.includes(value)
                                }
                                onChange={() => {
                                  if (item[0] === "subCategory") {
                                    toggleSubCategory(op);
                                  } else if (item[0] === "brand") {
                                    toggleBrand(op);
                                  } else {
                                    toggleFilter(item[0], value);
                                  }
                                }}
                              />
                              {value}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          <main className="w-full lg:flex-1 relative">
            {loadState === "loading" && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                <div className="h-10 w-10 border-4 border-[#ED1C24] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {products?.length === 0 ? (
              <div className="text-center py-20 border rounded-2xl">
                <FiSearch className="mx-auto w-10 h-10 text-gray-400" />
                <h3 className="mt-4 text-2xl font-bold">No products found</h3>
                <p className="text-gray-600 mt-2">
                  Try removing filters or view trending items.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={clearAll}
                    className="px-5 py-2 bg-black hover:bg-[#ED1C24] text-white text-xs uppercase tracking-wider transition-colors"
                  >
                    Remove filters
                  </button>
                  <button
                    onClick={() => setSortBy("popularity")}
                    className="px-5 py-2 border border-black hover:border-[#ED1C24] hover:text-[#ED1C24] text-black text-xs uppercase tracking-wider transition-colors"
                  >
                    Show trending
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-4 sm:gap-6 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}
              >
                {isLoading
                  ? "Loading..."
                  : products?.slice(0, visibleCount).map((p, idx) => {
                      const frontImg = resolveImageUrl(
                        Array.isArray(p.productImage) ? p.productImage[0] : p.productImage,
                        DEFAULT_PRODUCT_IMAGES[idx % DEFAULT_PRODUCT_IMAGES.length]
                      );
                      const backImg = resolveImageUrl(
                        Array.isArray(p.productImage) && p.productImage[1] ? p.productImage[1] : null,
                        frontImg
                      );
                      const cardData = {
                        id: p._id,
                        _id: p._id,
                        name: p.name,
                        brand: p.brand?.name || p.brand || "Wearaah Studio",
                        price: p.startingPrice || p.price || 0,
                        originalPrice: p.mrp || p.originalPrice || 0,
                        front: frontImg,
                        back: backImg,
                        sizes: p.sizesAvailable?.length ? p.sizesAvailable : (p.sizes || ["M"]),
                        colors: p.colors?.length ? p.colors : ["Standard"],
                        isNewArrival: p.isNew || p.isNewArrival,
                      };
                      return <ProductCard key={p._id || idx} product={cardData} />;
                    })}
              </div>
            )}
            <div ref={sentinelRef} className="h-6" />
            {visibleCount < products?.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() =>
                    setVisibleCount((n) =>
                      Math.min(n + PAGE_SIZE, products.length),
                    )
                  }
                  className="px-6 py-2.5 border border-black hover:border-[#ED1C24] hover:text-[#ED1C24] text-black text-xs uppercase tracking-wider font-medium transition-colors"
                >
                  Load more
                </button>
              </div>
            )}
          </main>
        </div>

        {showLoginModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <h4 className="text-xl font-bold">Login required</h4>
              <p className="mt-2 text-gray-600">
                Please login to add wishlist items.
              </p>
              <div className="mt-5 flex gap-3">
                <button className="w-full py-2.5 bg-black hover:bg-[#ED1C24] text-white text-xs uppercase tracking-wider font-medium transition-colors">
                  Login
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="w-full py-2 rounded-lg border"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductListingPage;
