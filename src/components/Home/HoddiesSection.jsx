import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fatchSubCategory } from "../../features/subCategory/subCategorySlice";

const categories = [
  {
    bgColor: "bg-[#eaedca]",
    shadowColor: "shadow-orange-200",
  },
  {
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
    shadowColor: "shadow-blue-200",
  },
  {
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
    shadowColor: "shadow-purple-200",
  },
  {
    bgColor: "bg-gradient-to-r from-rose-50 to-orange-50",
    shadowColor: "shadow-rose-200",
  },
  {
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
    shadowColor: "shadow-emerald-200",
  },
  {
    bgColor: "bg-gradient-to-r from-yellow-50 to-amber-50",
    shadowColor: "shadow-amber-200",
  },
];

export default function HoddiesSection() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { subcategories } = useSelector((state) => state.subCategory);
  useEffect(() => {
    dispatch(fatchSubCategory());
  }, [dispatch]);
  return (
    <>
      <section className="pb-10 bg-white">
        <div className="mx-auto px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Most Selling Categories
              </h2>
              <span className="text-sm text-gray-500">
                Browse Popular Categories
              </span>
            </div>
            <Link
              to={"/productlist"}
              className="text-[#633426] font-semibold text-sm hover:text-orange-600 transition-colors duration-300"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4 md:gap-6">
            {subcategories?.slice(0, 6)?.map((category, index) => (
              <div
                key={category?._id}
                className={`${categories[index]?.bgColor}  p-4 md:p-6 `}
              >
                <div className="flex items-center gap-3 md:gap-4 h-full">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base md:text-xl font-black text-gray-900 mb-2 md:mb-3 leading-tight">
                      {category?.name}
                    </h2>
                    <span className="text-[14px] text-gray-600 font-medium uppercase tracking-wide mb-3 md:mb-4 block">
                      {category?.subtitle}
                    </span>
                    <Link
                      to={`/productlist?subCategoryId=${category?._id}&subCategory=${category?.slug}`}
                      className={`group inline-block px-4 py-2 md:px-5 md:py-3 bg-white/90 backdrop-blur-sm text-gray-900 
                                text-sm md:text-md font-semibold  border-white/50 
                                group-hover:${categories[index]?.shadowColor}`}
                    >
                      Shop Now
                    </Link>
                  </div>
                  <div className="shrink-0 w-16 h-16 md:w-40 md:h-34 bg-transparent flex items-center justify-center">
                    <img
                      src={`${BASE_URL}${category?.smallimage}`}
                      className="w-full h-full object-contain mix-blend-multiply hover:scale-110 transition-transform duration-300"
                      alt={category?.title}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
