import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { CiFilter } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/Productlist/ProductSlice";
import { fatchBrands } from "../features/Brands/brandSlice";
import ProductCard from "./common/ProductCard";
import { resolveImageUrl, DEFAULT_PRODUCT_IMAGES } from "../utils/resolveImage";

const PAGE_SIZE = 12;

const parseArray = (v) => (v ? v.split(",").filter(Boolean) : []);

export default function SearchProductPage() {
  const dispatch = useDispatch();
  const { products: allProducts, status } = useSelector(
    (state) => state.products
  );
  const { brands } = useSelector((state) => state.brands);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  const [selectedBrands, setSelectedBrands] = useState(
    parseArray(searchParams.get("brandId"))
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const products = allProducts["search"] || [];

  useEffect(() => {
    if (searchQuery) {
      dispatch(
        fetchProducts({
          search: searchQuery,
          brand: selectedBrands,
          page: 1,
          limit: 40,
        })
      );
    }
  }, [searchQuery, selectedBrands, dispatch]);

  useEffect(() => {
    dispatch(fatchBrands());
  }, [dispatch]);

  const toggleBrand = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const clearAll = () => {
    setSelectedBrands([]);
  };

  return (
    <div className="min-h-screen bg-white pb-16 font-sans">
      {/* HEADER BANNER */}
      <div className="border-b border-neutral-200 py-8 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
            SEARCH RESULTS
          </span>
          <h1 className="text-xl sm:text-2xl font-normal uppercase tracking-wider text-neutral-900 mt-1">
            "{searchQuery}"
          </h1>
        </div>
        <p className="text-xs uppercase tracking-wider text-neutral-500 font-normal">
          {products.length} Products Found
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 flex flex-col lg:flex-row gap-10">
        {/* FILTERS */}
        <aside className="w-full lg:w-60 shrink-0">
          <div className="border border-neutral-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h2 className="text-xs font-normal uppercase tracking-[0.16em] flex items-center gap-1.5 text-neutral-900">
                <CiFilter size={16} /> Filters
              </h2>
              {selectedBrands.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-[11px] text-neutral-500 hover:text-black uppercase tracking-wider underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* BRAND */}
            <div className="mb-4">
              <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-800 mb-3">
                Brand
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {brands.map((b) => (
                  <label
                    key={b._id}
                    className="flex items-center text-xs text-neutral-700 hover:text-black cursor-pointer uppercase tracking-wider"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b._id)}
                      onChange={() => toggleBrand(b._id)}
                      className="mr-2.5 h-3.5 w-3.5 accent-black rounded-none border-neutral-300"
                    />
                    <span className="truncate">{b.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <main className="flex-1">
          {status === "loading" && (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs uppercase tracking-wider text-neutral-400">Loading Products...</p>
            </div>
          )}

          {status !== "loading" && products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-neutral-200">
              <FiSearch className="mx-auto w-10 h-10 text-neutral-300" strokeWidth={1.5} />
              <h3 className="mt-4 text-sm font-normal uppercase tracking-wider text-neutral-800">
                No products found for "{searchQuery}"
              </h3>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                Try searching with different keywords or check your spelling
              </p>
              <Link
                to="/productlist"
                className="inline-block mt-6 px-6 py-2.5 bg-black hover:bg-[#ED1C24] text-white text-xs font-normal uppercase tracking-widest transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.slice(0, visibleCount).map((p, idx) => {
                const frontImg = resolveImageUrl(
                  Array.isArray(p.productImage) ? p.productImage[0] : p.productImage,
                  DEFAULT_PRODUCT_IMAGES[idx % DEFAULT_PRODUCT_IMAGES.length]
                );
                const backImg = resolveImageUrl(
                  Array.isArray(p.productImage) && p.productImage[1] ? p.productImage[1] : null,
                  frontImg
                );
                const formattedProduct = {
                  _id: p._id,
                  id: p._id,
                  name: p.name,
                  price: p.startingPrice || p.price,
                  originalPrice: p.mrp || p.originalPrice,
                  front: frontImg,
                  back: backImg,
                  image: frontImg,
                  isNewArrival: p.isNewArrival,
                  isSoldOut: p.stock === 0,
                  brand: p.brand?.name || p.brand,
                };
                return <ProductCard key={p._id || idx} product={formattedProduct} />;
              })}
            </div>
          )}

          {visibleCount < products.length && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="px-8 py-3 border border-black hover:bg-black hover:text-white text-xs font-normal uppercase tracking-widest transition-colors"
              >
                Load More Products
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}