import { useEffect, useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../features/Productlist/ProductSlice";

const Discount = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
 const key = JSON.stringify({ isTrending: true });

const products = useSelector(
  (state) => state.products.products[key]
);

  const [selectedColors, setSelectedColors] = useState({
    1: "#000000",
    2: "#ffffff",
    3: "#808080",
    4: "#000000",
  });

  const handleColorSelect = (productId, color) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: color,
    }));
  };
  useEffect(() => {
    dispatch(
      fetchProducts({
        isTrending: true,
      }),
    );
  }, []);
  if (products?.length == 0) {
    return;
  }

  return (
    <section className="py-16 bg-white">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Trending Products
            </h2>
            <span className="text-sm text-gray-500">
              Trending Pieces You'll Want
            </span>
          </div>
          <Link to={"/productlist"} className="text-[#633426] font-semibold text-sm hover:text-orange-600 transition">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products?.slice(0,8)?.map((product) => (
            <div
              key={product?._id}
              className="group relative cursor-pointer bg-white  overflow-hidden"
            >
              {/* Image + Quick Actions */}
              <div className="relative h-80 lg:h-96 overflow-hidden">
                <img
                  src={product?.productImage[0]}
                  alt={product?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Green "New" Badge */}
                <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 shadow-lg">
                  New
                </span>
                {/* Select Button - Hover Reveal */}
                <Link
                  to={"/productdetail"}
                  className="absolute text-center bottom-6 w-[90%] left-1/2 right-10 -translate-x-1/2 bg-black text-white px-8 py-3 rounded-sm font-semibold shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all cursor-pointer duration-300 transform -translate-y-4 group-hover:translate-y-0 hover:bg-black-300"
                >
                  Select
                </Link>
              </div>

              {/* Product Info */}
              <div className="py-2">
                <h3 className="text-lg md:text-md font-semibold text-gray-900 line-clamp-2">
                  {product?.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-md font-bold text-gray-900">
                    {product?.startingPrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {product?.mrp}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                    Color:
                  </span>
                  <div className="flex gap-1">
                    {product?.colorValue.map((color, idx) => (
                      <button
                        key={idx}
                        type="button"
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(product._id, color)} // Add click handler
                        className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 cursor-pointer relative ${
                          selectedColors[product.id] === color
                            ? "border-black ring-4 ring-white/50 shadow-lg scale-110"
                            : "border-gray-300 hover:border-gray-500 hover:shadow-md"
                        }`}
                        aria-label={`Select ${color} color`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Discount;
