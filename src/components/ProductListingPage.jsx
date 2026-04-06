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
import { b, i } from "framer-motion/client";

const PAGE_SIZE = 8;

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

const ProductListingPage = () => {
  const isInitialLoad = useRef(true);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.products);

  const { brands } = useSelector((state) => state.brands);
  const { subcategoriesById, dynamicFilters } = useSelector(
    (state) => state.subCategory,
  );
  const { subcategories } = useSelector((state) => state.subCategory);

  const SubCategory =
    subcategoriesById.length > 0 ? subcategoriesById : subcategories;

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const categoryId = searchParams.get("ctd");
  const subCategoryId = searchParams.get("subCategoryId");

  const brandId = searchParams.get("brandId");
  const hasBrand = !!brandId;
  const hasCategory = !!searchParams.get("ctd");
  const hasSubCategory = !!searchParams.get("subCategoryId");
  const showSubCategoryFilter = true;
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

  const getKey = () => {
    if (filters.isNewArrival) return "isNewArrival";
    if (categoryId) return `category-${categoryId}`;
    if (subCategoryId) return `subCategory-${subCategoryId}`;
    return "all";
  };

  const allProducts = useSelector((state) => state.products.products);
  const products = allProducts[getKey()] || [];
  console.log(products);

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

  useEffect(() => {
    dispatch(fetchProducts(buildParams()));
  }, [filters, category, categoryId, sortBy, subCategoryId, brandId]);

  useEffect(() => {
    dispatch(fatchBrands());
  }, []);

  useEffect(() => {
    if (categoryId) {
      dispatch(fatchSubCategoryByCategoryId(categoryId));
    }
  }, [filters, category, categoryId, sortBy]);
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
      size: [],
      color: [],
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

  const dynamicSizes = useMemo(() => {
    const sizeType = SubCategory?.[0]?.sizeType;

    if (sizeType === "alpha") {
      return ["XS", "S", "M", "L", "XL", "XXL"];
    }

    if (sizeType === "numeric") {
      return ["28", "30", "32", "34", "36", "38", "40"];
    }

    return [];
  }, [SubCategory]);

  if ((loadState === "error" || loadState === "offline") && !products.length) {
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
          className="mt-6 px-6 py-3 rounded-xl bg-[#d18736] text-white font-semibold"
        >
          Retry
        </button>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => (
            <div key={p.id} className="border rounded-xl p-3">
              <img
                src={`${BASE_URL}${p.productImage}`}
                className="h-32 w-full rounded object-cover"
              />
              <p className="text-sm mt-2">{p.name}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white pb-8">
      <div className="">
        <div className="w-full h-48 sm:h-64 lg:h-80 mb-6 overflow-hidden">
          <img
            src="/images/all.webp"
            className="w-full h-full object-cover"
            alt={`Banner`}
          />
        </div>
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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                {formatCategory(category)}
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium min-w-[90px]">
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
                    <span className="text-xs font-semibold text-gray-700">
                      {tile.name}
                    </span>
                  </button>
                ))}
            </div>
          </div>
          <button
            className="lg:hidden px-4 py-2 rounded-lg bg-[#d18736] text-white font-semibold"
            onClick={() => setShowMobileFilters((v) => !v)}
          >
            Filter
          </button>
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex gap-1 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-[#d18736] text-white" : ""}`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-[#d18736] text-white" : ""}`}
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
                ["gender", ["Men", "Women", "Boys", "Girls", "Unisex"]],
                ...(filters.subCategoryId
                  ? Object.entries(dynamicFilters).filter(
                      ([key]) => !["size", "color"].includes(key),
                    )
                  : []),

                ...(SubCategory?.length > 0 ? [["size", dynamicSizes]] : []),

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
                <div className="h-10 w-10 border-4 border-[#d18736] border-t-transparent rounded-full animate-spin"></div>
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
                    className="px-5 py-2 rounded-lg bg-[#d18736] text-white"
                  >
                    Remove filters
                  </button>
                  <button
                    onClick={() => setSortBy("popularity")}
                    className="px-5 py-2 rounded-lg border border-[#d18736] text-[#d18736]"
                  >
                    Show trending
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 divide-y"}`}
              >
                {products?.slice(0, visibleCount).map((p, idx) => (
                  <div key={idx} className="group">
                    <Link
                      to={`/product/${p._id}`}
                      state={{
                        returnTo: `${location.pathname}${location.search}`,
                      }}
                      className="block"
                      onClick={() =>
                        track("product_click", {
                          productId: p._id,
                          index: idx + 1,
                        })
                      }
                    >
                      <div className="relative h-72 overflow-hidden">
                        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                          {p.mrp > p.startingPrice && (
                            <span className="px-2 py-1 text-xs text-white bg-green-600 rounded">
                              -
                              {Math.round(
                                ((p.mrp - p.startingPrice) / p.mrp) * 100,
                              ) || 0}
                              % OFF
                            </span>
                          )}
                          {p.trending && (
                            <span className="px-2 py-1 text-xs text-white bg-black/80 rounded">
                              Trending
                            </span>
                          )}
                          {p.isNew && (
                            <span className="px-2 py-1 text-xs text-white bg-blue-600 rounded">
                              New
                            </span>
                          )}
                          {p.sponsored && (
                            <span className="px-2 py-1 text-xs bg-white rounded">
                              Sponsored
                            </span>
                          )}
                        </div>

                        <img
                          src={`${BASE_URL}${p.productImage[0]}`}
                          alt={p.name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <img
                          src={`${BASE_URL}${p.productImage[1]}`}
                          alt={`${p.name} hover`}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500"
                        />
                      </div>
                      <div className="pt-3">
                        <p className="text-xs uppercase text-gray-500 font-semibold">
                          {p.brand}
                        </p>
                        <h3 className="font-semibold text-sm mt-1 truncate">
                          {p.name}
                        </h3>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="font-bold text-[#633426]">
                            INR {p.startingPrice}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            INR {p.mrp}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-gray-600">
                            <FiStar className="text-yellow-500" />
                            {p.rating} ({p.reviews})
                          </span>
                          {p.inStock && p.sizesAvailable.length === 1 && (
                            <span className="text-orange-600 font-semibold">
                              Only 1 size left
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
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
                  className="px-6 py-2 rounded-lg border border-[#d18736] text-[#d18736]"
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
                <button className="w-full py-2 rounded-lg bg-[#d18736] text-white">
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
