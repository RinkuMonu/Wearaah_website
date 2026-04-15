import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  FiAlertCircle,
  FiChevronDown,
  FiGrid,
  FiList,
  FiSearch,
  FiStar,
} from "react-icons/fi";
import { CiFilter } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/Productlist/ProductSlice";
import {
  fatchSubCategory,
  fatchSubCategoryByCategoryId,
} from "../features/subCategory/subCategorySlice";
import { fatchBrands } from "../features/Brands/brandSlice";

const PAGE_SIZE = 8;

const parseArray = (v) => (v ? v.split(",").filter(Boolean) : []);

const emptyFilters = () => ({
  subCategoryId: "",
  brand: [],
  size: [],
  gender: [],
  color: [],
  isNewArrival: false,
  minPrice: "",
  maxPrice: "",
  minDiscount: "",
  minRating: "",
});

const SearchProductPage = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();

  const { products: allProducts, status } = useSelector(
    (state) => state.products
  );
  const { brands } = useSelector((state) => state.brands);
  const { subcategories } = useSelector((state) => state.subCategory);

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search"); 

  const [filters, setFilters] = useState({
    ...emptyFilters(),
    brand: parseArray(searchParams.get("brandId")),
  });

  const [sortBy, setSortBy] = useState(searchParams.get("sort"));
  const [viewMode, setViewMode] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const products = allProducts["search"] || [];

  // =========================
  // 🔥 API CALL
  // =========================
  const buildParams = () => ({
    search: searchQuery,
    brand: filters.brand,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sort: sortBy,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (searchQuery) {
      dispatch(fetchProducts(buildParams()));
    }
  }, [searchQuery, filters, sortBy]);

  useEffect(() => {
    dispatch(fatchBrands());
    dispatch(fatchSubCategory());
  }, []);

  // =========================
  // 🔥 FILTER HANDLER
  // =========================
  const toggleBrand = (brand) => {
    setFilters((prev) => {
      const exists = prev.brand.includes(brand._id);
      return {
        ...prev,
        brand: exists
          ? prev.brand.filter((id) => id !== brand._id)
          : [...prev.brand, brand._id],
      };
    });
  };

  const clearAll = () => {
    setFilters(emptyFilters());
    setSearchParams({ q: searchQuery });
  };

  // =========================
  // UI
  // =========================
  return (
    <section className="min-h-screen bg-white pb-8">
      {/* HEADER */}
      <div className="border-b border-gray-200 my-6 py-6 px-6">
        <h1 className="text-3xl font-bold">
          Search results for "{searchQuery}"
        </h1>
        <p className="text-gray-500 mt-1">
          {products.length} products found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 px-6">
        {/* FILTERS */}
        <aside className="w-full lg:w-64">
          <div className="bg-white p-6 border-r">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CiFilter /> Filters
            </h2>

            {/* BRAND */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Brand</h3>
              {brands.map((b) => (
                <label key={b._id} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.brand.includes(b._id)}
                    onChange={() => toggleBrand(b)}
                    className="mr-2"
                  />
                  {b.name}
                </label>
              ))}
            </div>

            <button
              onClick={clearAll}
              className="mt-4 px-4 py-2 bg-[#d18736] text-white rounded"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* PRODUCTS */}
        <main className="flex-1">
          {status === "loading" && (
            <div className="text-center py-10">Loading...</div>
          )}

          {a.length === 0 ? (
            <div className="text-center py-20">
              <FiSearch className="mx-auto w-10 h-10 text-gray-400" />
              <h3 className="mt-4 text-xl font-bold">
                No results for "{searchQuery}"
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(0, visibleCount).map((p) => (
                <Link key={p._id} to={`/product/${p._id}`}>
                  <div className="group">
                    <img
                      src={`${BASE_URL}${p.productImage[0]}`}
                      className="w-full h-60 object-cover"
                    />
                    <h3 className="mt-2 text-sm font-semibold">{p.name}</h3>
                    <p className="text-[#633426] font-bold">
                      ₹{p.startingPrice}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {visibleCount < products.length && (
            <div className="text-center mt-6">
              <button
                onClick={() =>
                  setVisibleCount((v) => v + PAGE_SIZE)
                }
                className="px-6 py-2 border rounded"
              >
                Load More
              </button>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default SearchProductPage;