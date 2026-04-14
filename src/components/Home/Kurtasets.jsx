import React, { useEffect } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/Productlist/ProductSlice";
import { Link } from "react-router-dom";

export default function DesignerShirts() {
  const categoryId = "69c50b8293df3e7bd375833a";
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
const key = JSON.stringify({ category: categoryId });

const products = useSelector(
  (state) => state.products.products[key]
);

  useEffect(() => {
    dispatch(
      fetchProducts({
        category: categoryId,
      }),
    );
  }, [dispatch]);

    if (products?.length === 0) {
    return;
  }
  return (
    <section className="py-16 bg-linear-to-b from-white via-gray-50 to-white">
      <div className="mx-auto px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Designer Shirts
            </h2>
            <span className="text-sm text-gray-500">Browse Popular Shirts</span>
          </div>
          <button className="text-[#633426] font-semibold text-sm hover:text-orange-600 transition">
            View All →
          </button>
        </div>

        {/* 4-Column Grid with Hover Effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((trend) => (
            <Link
              to={`/product/${trend._id}`}
              key={trend._id}
              className="group relative cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden  shadow-lg group-hover:shadow-2xl transition-all duration-500">
                <img
                  src={`${BASE_URL}${trend.productImage[0]}`}
                  alt={trend.name}
                  className="w-full h-72 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg text-sm font-bold text-gray-900 z-20">
                  {trend.startingPrice}
                </div>

                {/* Hover Overlay + Buttons */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="w-full flex flex-col gap-3">
                    {/* Top Icons Row */}
                    <div className="flex justify-end gap-2">
                      <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 cursor-pointer">
                        <MdOutlineRemoveRedEye />
                      </div>

                      <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 cursor-pointer">
                        <FaRegHeart />
                      </div>
                    </div>

                    {/* Select Options Button */}
                    <button className="w-full bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-semibold py-3 px-6 rounded-2xl shadow-2xl hover:shadow-3xl cursor-pointer hover:bg-white transition-all duration-300 border border-white/50">
                      Select Options
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-4 px-2">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-tight mb-1">
                  {trend.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-yellow-400 mb-1">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>☆</span>
                  <span className="text-gray-500 ml-1">({trend?.rating})</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
