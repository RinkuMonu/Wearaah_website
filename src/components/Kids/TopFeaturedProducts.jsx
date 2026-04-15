import React, { useEffect } from "react";
import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/Productlist/ProductSlice";
import { fetchBanner } from "../../features/Banner/bannerSlice";

export default function TopFeaturedProducts() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const key = JSON.stringify({ gender: "Kids", isTrending: true });

  const products = useSelector((state) => state.products.products[key]);
  const banners = useSelector(
    (state) => state.banner.banners["delivery"] || {},
  );
  console.log(banners);
  

  useEffect(() => {
    dispatch(
      fetchProducts({
        gender: "Kids",
        isTrending: true,
      }),
    );
    dispatch(
      fetchBanner({
        position: "delivery",
        deviceType: "desktop",
      }),
    );
  }, [dispatch]);

  if (products?.length === 0) return null;

  return (
    <section className="py-16 bg-[#f5f5f5]">
      <div className="px-6">
        {/* Section Title */}
        <h2 className="text-3xl font-semibold mb-10 text-[#2c3e50]">
          Top Trending Products
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {products?.map((item) => (
            <Link
              href="productlisting"
              key={item?._id}
              className="bg-white rounded-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={`${BASE_URL}${item.productImage[0]}`}
                  alt={item.name}
                  className="w-full h-[340px] object-cover"
                />

                {/* Rating */}

                {item.rating > 0 && (
                  <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full flex items-center gap-1 text-sm shadow">
                    <Star
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    {item.rating}
                  </div>
                )}

                {/* Wishlist */}
                <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow cursor-pointer">
                  <Heart size={18} />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="font-semibold text-gray-800">{item.brand}</p>

                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {item?.name}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="font-semibold text-lg">{item.price}</span>

                  <span className="text-gray-400 line-through text-sm">
                    {item?.mrp}
                  </span>

                  <span className="text-green-600 text-sm font-semibold">
                    {item?.startingPrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full mt-10">
        <img
          src={`${BASE_URL}${banners[0]?.images}`}
          className="w-full"
          alt="Center Banner"
        />
      </div>
    </section>
  );
}
