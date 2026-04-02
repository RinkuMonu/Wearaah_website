import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fatchSubCategory } from "../../features/subCategory/subCategorySlice";
import { Link } from "react-router-dom";
import { fetchBanner } from "../../features/Banner/bannerSlice";

export default function CategoriesSection() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { subcategories } = useSelector((state) => state.subCategory);
  const banners = useSelector(
    (state) => state.banner.banners["delivery"] || {},
  );

  useEffect(() => {
    dispatch(fatchSubCategory());
    dispatch(
      fetchBanner({
        position: "delivery",
        deviceType: "desktop",
      }),
    );
  }, [dispatch]);
  return (
    <section className="pt-16 bg-white">
      <div className=" mx-auto px-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Top Categories
            </h2>
            <span className="text-sm text-gray-500">
              Browse Popular Categories
            </span>
          </div>
          <Link
            to={"/productlist"}
            className="text-[#633426] font-semibold text-sm hover:text-orange-600 transition"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3 text-center">
          {subcategories?.slice(0, 8)?.map((category, index) => (
            <Link
              key={category._id}
              to={`/productlist?subCategoryId=${category?._id}&subCategory=${category?.slug}`}
              className="group relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300"
            >
              <img
                src={`${BASE_URL}${category?.smallimage}`}
                alt={category.name}
                className="w-full h-64 md:h-80 object-cover"
              />
              <span> {category.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full mt-10">
        <img
          src={`${BASE_URL}${banners[1]?.images}`}
          className="w-full"
          alt="Center Banner"
        />
      </div>
    </section>
  );
}
