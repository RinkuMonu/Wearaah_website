
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { FiAlertCircle, FiChevronDown, FiGrid, FiHeart, FiList, FiSearch, FiStar } from "react-icons/fi";
import { CiFilter } from "react-icons/ci";

const TITLE = "Men's T-Shirts";
const PAGE_SIZE = 8;
const DEFAULT_SORT = "recommended";
const CACHE_KEY = "plp_cache_v1";
const WISHLIST_KEY = "plp_wishlist_v1";

const PRODUCTS = [
  { id: 1, name: "T-Shirts Classic", brand: "Lionies", price: 999, mrp: 1199, rating: 4.5, reviews: 312, discount: 10, popularity: 88, img: "/images/similar1.png", hoverImg: "/images/similarback1.png", size: "M", color: "Black", fit: "Regular", fabric: "Cotton", design: "Graphic", sleeves: "Short", neck: "Round", subCategory: "Graphic", isNew: true, trending: true, sponsored: false, inStock: true, sizesAvailable: ["S", "M", "L"] },
  { id: 2, name: "T-Shirts Premium", brand: "Urban Crew", price: 1299, mrp: 1529, rating: 4.2, reviews: 158, discount: 15, popularity: 79, img: "/images/similar2.png", hoverImg: "/images/similarback2.jpeg", size: "L", color: "Grey", fit: "Slim", fabric: "Polyester", design: "Printed", sleeves: "Long", neck: "V-Neck", subCategory: "Printed", isNew: true, trending: false, sponsored: true, inStock: true, sizesAvailable: ["L"] },
  { id: 3, name: "T-Shirts Street Polo", brand: "Lionies", price: 1499, mrp: 1579, rating: 4.8, reviews: 510, discount: 5, popularity: 96, img: "/images/similar3.png", hoverImg: "/images/similarback3.png", size: "S", color: "White", fit: "Oversized", fabric: "Cotton", design: "Plain", sleeves: "Short", neck: "Polo", subCategory: "Polo", isNew: false, trending: true, sponsored: false, inStock: true, sizesAvailable: ["S", "M"] },
  { id: 4, name: "T-Shirts Graphic Drop", brand: "Apex Fit", price: 1599, mrp: 1999, rating: 4.1, reviews: 98, discount: 20, popularity: 66, img: "/images/similar4.png", hoverImg: "/images/similarback4.png", size: "XL", color: "Blue", fit: "Regular", fabric: "Cotton Blend", design: "Graphic", sleeves: "Short", neck: "Round", subCategory: "Graphic", isNew: false, trending: false, sponsored: false, inStock: false, sizesAvailable: [] },
  { id: 5, name: "T-Shirts Bold Print", brand: "Lionies", price: 1799, mrp: 1955, rating: 4.7, reviews: 419, discount: 8, popularity: 90, img: "/images/similar5.png", hoverImg: "/images/similarback5.png", size: "M", color: "Red", fit: "Slim", fabric: "Cotton", design: "Printed", sleeves: "Short", neck: "Crew", subCategory: "Printed", isNew: false, trending: true, sponsored: false, inStock: true, sizesAvailable: ["M", "L", "XL"] },
  { id: 6, name: "T-Shirts Fleece Hoodie", brand: "Urban Crew", price: 899, mrp: 1022, rating: 4.3, reviews: 222, discount: 12, popularity: 75, img: "/images/similar1.png", hoverImg: "/images/similarback6.png", size: "S", color: "Navy", fit: "Regular", fabric: "Fleece", design: "Plain", sleeves: "Long", neck: "Round", subCategory: "Plain", isNew: true, trending: false, sponsored: false, inStock: true, sizesAvailable: ["S", "M"] },
  { id: 7, name: "T-Shirts Oversized Polo", brand: "Apex Fit", price: 1999, mrp: 2665, rating: 4.6, reviews: 343, discount: 25, popularity: 93, img: "/images/similar2.png", hoverImg: "/images/similarback7.png", size: "XXL", color: "Green", fit: "Oversized", fabric: "Pima Cotton", design: "Graphic", sleeves: "Short", neck: "Polo", subCategory: "Oversized", isNew: false, trending: true, sponsored: true, inStock: true, sizesAvailable: ["L", "XL", "XXL"] },
  { id: 8, name: "T-Shirts Printed Essential", brand: "Lionies", price: 1099, mrp: 1340, rating: 4.4, reviews: 277, discount: 18, popularity: 81, img: "/images/similar3.png", hoverImg: "/images/similarback1.png", size: "L", color: "Black", fit: "Slim", fabric: "Cotton", design: "Printed", sleeves: "Short", neck: "V-Neck", subCategory: "Printed", isNew: true, trending: false, sponsored: false, inStock: true, sizesAvailable: ["L", "XL"] },
];

const FILTER_SECTIONS = [
  ["subCategory", "Sub Category", ["Polo", "Graphic", "Plain", "Oversized", "Printed"]],
  ["brand", "Brand", ["Lionies", "Urban Crew", "Apex Fit"]],
  ["size", "Size", ["S", "M", "L", "XL", "XXL"]],
  ["color", "Color", ["Black", "White", "Grey", "Blue", "Red", "Navy", "Green"]],
  ["fit", "Fit", ["Regular", "Slim", "Oversized"]],
  ["fabric", "Fabric", ["Cotton", "Polyester", "Fleece", "Pima Cotton", "Cotton Blend"]],
];

const SORT_OPTIONS = [
  ["recommended", "Recommended"],
  ["new", "New arrivals"],
  ["price-low", "Price: Low to High"],
  ["price-high", "Price: High to Low"],
  ["discount", "Discount"],
  ["rating", "Customer rating"],
  ["popularity", "Popularity"],
];

const SUBCATEGORY_TILES = [
  { name: "All", img: "/images/all.webp" },
  { name: "Polo", img: "/images/similar2.png" },
  { name: "Graphic", img: "/images/similarback5.png" },
  { name: "Plain", img: "/images/plain.webp" },
  { name: "Oversized", img: "/images/Oversized.webp" },
  { name: "Printed", img: "/images/printed.webp" },
];

const parseArray = (v) => (v ? v.split(",").filter(Boolean) : []);
const emptyFilters = () => ({ subCategory: [], brand: [], size: [], color: [], fit: [], fabric: [], price: "", minDiscount: "", minRating: "" });

const ProductListingPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const source = searchParams.get("source") || location.state?.source || "category_tile";

  const [sortBy, setSortBy] = useState(searchParams.get("sort") || DEFAULT_SORT);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState(() => ({
    ...emptyFilters(),
    subCategory: parseArray(searchParams.get("subCategory") || searchParams.get("subcat")),
    brand: parseArray(searchParams.get("brand")),
    size: parseArray(searchParams.get("size")),
    color: parseArray(searchParams.get("color")),
    fit: parseArray(searchParams.get("fit")),
    fabric: parseArray(searchParams.get("fabric")),
    price: searchParams.get("price") || "",
    minDiscount: searchParams.get("discount") || "",
    minRating: searchParams.get("rating") || "",
  }));
  const [openFilters, setOpenFilters] = useState({ subCategory: true, brand: true, size: true, color: true, fit: true, fabric: true, price: true, rating: true, discount: true });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loadState, setLoadState] = useState("loading");
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]"));
  const [showLoginModal, setShowLoginModal] = useState(false);

  const categoryRef = useRef(location.pathname);
  const sentinelRef = useRef(null);
  const isLoggedIn = false;

  const track = (event, payload = {}) => console.info("[analytics]", event, { source, ...payload, ts: Date.now() });

  const loadProducts = () => {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
    if (!navigator.onLine) {
      if (cached?.length) {
        setProducts(cached);
        setLoadState("success");
      } else {
        setLoadState("offline");
      }
      return;
    }

    setLoadState("loading");
    window.setTimeout(() => {
      try {
        if (searchParams.get("mockError") === "1") throw new Error("api");
        setProducts(PRODUCTS);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(PRODUCTS));
        setLoadState("success");
      } catch {
        if (cached?.length) {
          setProducts(cached);
          setLoadState("success");
        } else {
          setLoadState("error");
        }
      }
    }, 600);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("source", source);
    if (sortBy !== DEFAULT_SORT) params.set("sort", sortBy);
    Object.entries(filters).forEach(([k, v]) => {
      if (Array.isArray(v) && v.length) params.set(k, v.join(","));
      if (!Array.isArray(v) && v) params.set(k, v);
    });
    setSearchParams(params, { replace: true });
  }, [filters, sortBy, setSearchParams, source]);

  useEffect(() => {
    if (categoryRef.current !== location.pathname) {
      setSortBy(DEFAULT_SORT);
      categoryRef.current = location.pathname;
    }
  }, [location.pathname]);

  useEffect(() => {
    const key = `plp-scroll-${location.pathname}${location.search}`;
    const y = Number(sessionStorage.getItem(key) || 0);
    if (y) window.requestAnimationFrame(() => window.scrollTo(0, y));
    return () => sessionStorage.setItem(key, String(window.scrollY));
  }, [location.pathname, location.search]);

  const filtered = useMemo(() => {
    const priceOk = (p) => {
      if (!filters.price) return true;
      if (filters.price === "0-1000") return p <= 1000;
      if (filters.price === "1001-1500") return p >= 1001 && p <= 1500;
      if (filters.price === "1501-2000") return p >= 1501 && p <= 2000;
      return p > 2000;
    };

    return products
      .filter((p) =>
        (!filters.subCategory.length || filters.subCategory.includes(p.subCategory)) &&
        (!filters.brand.length || filters.brand.includes(p.brand)) &&
        (!filters.size.length || filters.size.includes(p.size)) &&
        (!filters.color.length || filters.color.includes(p.color)) &&
        (!filters.fit.length || filters.fit.includes(p.fit)) &&
        (!filters.fabric.length || filters.fabric.includes(p.fabric)) &&
        priceOk(p.price) &&
        (!filters.minDiscount || p.discount >= Number(filters.minDiscount)) &&
        (!filters.minRating || p.rating >= Number(filters.minRating))
      )
      .sort((a, b) => {
        if (sortBy === "new") return Number(b.isNew) - Number(a.isNew) || b.id - a.id;
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "discount") return b.discount - a.discount;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "popularity") return b.popularity - a.popularity;
        return b.popularity - a.popularity || b.rating - a.rating;
      });
  }, [filters, products, sortBy]);

  useEffect(() => setVisibleCount(PAGE_SIZE), [filters, sortBy]);
  useEffect(() => {
    if (!filtered.length && loadState === "success") track("zero_results", { filters });
  }, [filtered.length, loadState]);

  useEffect(() => {
    if (!sentinelRef.current || visibleCount >= filtered.length) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) setVisibleCount((n) => Math.min(n + PAGE_SIZE, filtered.length));
    }, { rootMargin: "220px" });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [filtered.length, visibleCount]);

  const visible = filtered.slice(0, visibleCount);
  const chips = [
    ...Object.entries(filters).flatMap(([k, v]) => Array.isArray(v) ? v.map((val) => ({ k, val, label: `${k}: ${val}` })) : (v ? [{ k, val: v, label: `${k}: ${v}` }] : [])),
  ];

  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      if (Array.isArray(prev[key])) {
        const exists = prev[key].includes(value);
        const next = exists ? prev[key].filter((v) => v !== value) : [...prev[key], value];
        track("filter_applied", { key, value, selected: !exists });
        return { ...prev, [key]: next };
      }
      const next = prev[key] === value ? "" : value;
      track("filter_applied", { key, value: next || "cleared" });
      return { ...prev, [key]: next };
    });
  };

  const clearAll = () => setFilters(emptyFilters());
  const removeChip = (chip) => toggleFilter(chip.k, chip.val);

  const toggleWishlist = (productId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      track("wishlist_login_prompt", { productId });
      return;
    }
    setWishlist((prev) => prev.includes(productId) ? prev.filter((x) => x !== productId) : [...prev, productId]);
  };

  if (loadState === "loading") {
    return <section className="min-h-screen bg-white p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-80 rounded-xl bg-gray-200 animate-pulse" />)}</section>;
  }

  if ((loadState === "error" || loadState === "offline") && !products.length) {
    return (
      <section className="min-h-screen bg-white p-8 text-center">
        <FiAlertCircle className="mx-auto w-12 h-12 text-[#995d37]" />
        <h2 className="mt-4 text-2xl font-bold">{loadState === "offline" ? "No internet" : "API error"}</h2>
        <p className="mt-2 text-gray-600">Retry or continue with fallback products.</p>
        <button onClick={loadProducts} className="mt-6 px-6 py-3 rounded-xl bg-[#d18736] text-white font-semibold">Retry</button>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {PRODUCTS.slice(0, 4).map((p) => <div key={p.id} className="border rounded-xl p-3"><img src={p.img} className="h-32 w-full rounded object-cover" /><p className="text-sm mt-2">{p.name}</p></div>)}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white pb-8">
      <div className="">
        <div className="w-full h-48 sm:h-64 lg:h-80 mb-6 overflow-hidden"><img src="/images/all.webp" className="w-full h-full object-cover" alt={`${TITLE} Banner`} /></div>
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
                {TITLE}
              </span>
            </nav>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end sm:items-center text-right sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                {TITLE}
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium min-w-[90px]">
                {filtered.length} products
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col px-10 lg:flex-row justify-between mt-5 items-start lg:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
          <div className="overflow-x-auto mb-6 -mx-4 sm:-mx-6 lg:mx-0 lg:pb-0 lg:overflow-visible">
            <div className="flex gap-4 px-4 sm:px-6 lg:px-0 min-w-max">
              {SUBCATEGORY_TILES.map((tile) => (
                <button
                  key={tile.name}
                  type="button"
                  className="flex flex-col items-center gap-2 px-2 py-1 shrink-0"
                  onClick={() => {
                    if (tile.name === "All") return setFilters((prev) => ({ ...prev, subCategory: [] }));
                    toggleFilter("subCategory", tile.name);
                  }}
                >
                  <span className="w-14 h-14 rounded-full overflow-hidden shadow">
                    <img src={tile.img} alt={tile.name} className="w-full h-full object-cover" loading="lazy" />
                  </span>
                  <span className="text-xs font-semibold text-gray-700">{tile.name}</span>
                </button>
              ))}
            </div>
          </div>
          <button className="lg:hidden px-4 py-2 rounded-lg bg-[#d18736] text-white font-semibold" onClick={() => setShowMobileFilters((v) => !v)}>Filter</button>
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex gap-1 p-1 rounded-xl"><button onClick={() => setViewMode("grid")} className={`p-2 rounded ${viewMode === "grid" ? "bg-[#d18736] text-white" : ""}`}><FiGrid /></button><button onClick={() => setViewMode("list")} className={`p-2 rounded ${viewMode === "list" ? "bg-[#d18736] text-white" : ""}`}><FiList /></button></div>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); track("sort_changed", { sortBy: e.target.value }); }} className="px-3 py-2 border rounded-md text-sm">
              {SORT_OPTIONS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </div>
        </div>
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 lg:px-5 px-6">{chips.map((chip) => <button key={`${chip.k}-${chip.val}`} onClick={() => removeChip(chip)} className="px-3 py-1 rounded-full text-xs bg-[#d18736]/10 text-[#d18736]">{chip.label} x</button>)}<button onClick={clearAll} className="px-3 py-1 rounded-full text-xs bg-gray-100">Clear all</button></div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:px-5 px-6">
          <aside className={`w-full lg:w-64 ${showMobileFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white p-6 border-r border-gray-200 lg:sticky lg:top-4">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><CiFilter />Filters</h2>
              {FILTER_SECTIONS.map(([key, label, options]) => (
                <div key={key} className="mb-5 border-b pb-4 border-gray-200">
                  <button className="w-full flex items-center justify-between font-semibold" onClick={() => setOpenFilters((s) => ({ ...s, [key]: !s[key] }))}>{label}<FiChevronDown className={openFilters[key] ? "rotate-180 transition-transform" : "transition-transform"} /></button>
                  {openFilters[key] && <div className="mt-3 space-y-2">{options.map((op) => <label key={op} className="flex items-center text-sm"><input type="checkbox" className="mr-2 accent-[#d18736]" checked={filters[key].includes(op)} onChange={() => toggleFilter(key, op)} />{op}</label>)}</div>}
                </div>
              ))}
              <div className="mb-5 border-b border-gray-200 pb-4"><p className="font-semibold mb-2">Price</p>{["0-1000", "1001-1500", "1501-2000", "2001+"].map((v) => <label key={v} className="block text-sm mb-2"><input type="radio" className="mr-2 accent-[#d18736]" checked={filters.price === v} onChange={() => toggleFilter("price", v)} />{v}</label>)}</div>
              <div className="mb-5 border-b border-gray-200 pb-4"><p className="font-semibold mb-2">Discount</p>{["10", "20", "30"].map((v) => <label key={v} className="block text-sm mb-2"><input type="radio" className="mr-2 accent-[#d18736]" checked={filters.minDiscount === v} onChange={() => toggleFilter("minDiscount", v)} />{v}%+</label>)}</div>
              <div className="mb-6"><p className="font-semibold mb-2">Rating</p>{["4", "4.5", "5"].map((v) => <label key={v} className="block text-sm mb-2"><input type="radio" className="mr-2 accent-[#d18736]" checked={filters.minRating === v} onChange={() => toggleFilter("minRating", v)} />{v}+</label>)}</div>
              <div className="flex gap-2"><button onClick={clearAll} className="w-full py-2 border border-[#d18736] text-[#d18736] rounded-lg">Reset</button><button onClick={() => setShowMobileFilters(false)} className="w-full py-2 rounded-lg bg-[#d18736] text-white lg:hidden">Apply</button></div>
            </div>
          </aside>

          <main className="w-full lg:flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20 border rounded-2xl"><FiSearch className="mx-auto w-10 h-10 text-gray-400" /><h3 className="mt-4 text-2xl font-bold">No products found</h3><p className="text-gray-600 mt-2">Try removing filters or view trending items.</p><div className="mt-6 flex justify-center gap-3"><button onClick={clearAll} className="px-5 py-2 rounded-lg bg-[#d18736] text-white">Remove filters</button><button onClick={() => setSortBy("popularity")} className="px-5 py-2 rounded-lg border border-[#d18736] text-[#d18736]">Show trending</button></div></div>
            ) : (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 divide-y"}`}>
                {visible.map((p, idx) => (
                  <div key={p.id} className="group">
                    <Link
                      to={`/product/${p.id}`}
                      state={{ returnTo: `${location.pathname}${location.search}` }}
                      className="block"
                      onClick={() => track("product_click", { productId: p.id, index: idx + 1 })}
                    >
                      <div className="relative h-72 overflow-hidden">
                        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1"><span className="px-2 py-1 text-xs text-white bg-green-600 rounded">-{p.discount}%</span>{p.trending && <span className="px-2 py-1 text-xs text-white bg-black/80 rounded">Trending</span>}{p.isNew && <span className="px-2 py-1 text-xs text-white bg-blue-600 rounded">New</span>}{p.sponsored && <span className="px-2 py-1 text-xs bg-white rounded">Sponsored</span>}</div>
                        <div className="absolute top-2 right-2 z-20 flex flex-col gap-2"><button type="button" className="p-2 rounded-lg bg-white shadow" onClick={(e) => { e.preventDefault(); toggleWishlist(p.id); }}><FiHeart className={wishlist.includes(p.id) ? "text-red-500 fill-red-500" : "text-gray-800"} /></button></div>
                        <img src={p.img} alt={p.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <img src={p.hoverImg} alt={`${p.name} hover`} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      </div>
                      <div className="pt-3"><p className="text-xs uppercase text-gray-500 font-semibold">{p.brand}</p><h3 className="font-semibold text-sm mt-1 truncate">{p.name}</h3><div className="mt-2 flex items-center gap-2"><span className="font-bold text-[#633426]">INR {p.price}</span><span className="text-xs text-gray-400 line-through">INR {p.mrp}</span></div><div className="mt-2 flex items-center justify-between text-xs"><span className="flex items-center gap-1 text-gray-600"><FiStar className="text-yellow-500" />{p.rating} ({p.reviews})</span>{!p.inStock && <span className="text-red-600 font-semibold">Out of stock</span>}{p.inStock && p.sizesAvailable.length === 1 && <span className="text-orange-600 font-semibold">Only 1 size left</span>}</div></div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
            <div ref={sentinelRef} className="h-6" />
            {visibleCount < filtered.length && <div className="text-center mt-8"><button onClick={() => setVisibleCount((n) => Math.min(n + PAGE_SIZE, filtered.length))} className="px-6 py-2 rounded-lg border border-[#d18736] text-[#d18736]">Load more</button></div>}
          </main>
        </div>

        {showLoginModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm"><h4 className="text-xl font-bold">Login required</h4><p className="mt-2 text-gray-600">Please login to add wishlist items.</p><div className="mt-5 flex gap-3"><button className="w-full py-2 rounded-lg bg-[#d18736] text-white">Login</button><button onClick={() => setShowLoginModal(false)} className="w-full py-2 rounded-lg border">Cancel</button></div></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductListingPage;
