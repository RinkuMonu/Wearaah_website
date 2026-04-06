import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { BsCart } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/Productlist/ProductSlice";

export default function CasualTrousers() {
  const categoryId = "69c50b8293df3e7bd375833a";
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const products = useSelector(
    (state) => state.products.products[`category-${categoryId}`],
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
    <section className="py-12 bg-white">
      <div className="mx-auto px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Formal Wear
            </h2>
            <span className="text-sm text-gray-500">
              Shop now for ultimate comfort
            </span>
          </div>
          <Link
            to={
              "/productlist?category=formal-wear&ctd=69c50b8293df3e7bd375833a"
            }
            className="text-[#633426] font-semibold text-sm hover:text-orange-600 transition"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products?.slice(0, 9)?.map((product) => (
            <div key={product._id} className="group cursor-pointer">
              <Link
                to={`/product/${product._id}`}
                className="block bg-gray-50  overflow-hidden  transition-all duration-300"
              >
                <div className="relative h-full md:h-full">
                  <div className="absolute top-0 left-0 z-20">
                    <span
                      className="text-white text-xs px-2 py-1 font-bold"
                      style={{ backgroundColor: "rgba(0, 184, 82, 0.9)" }}
                    >
                      {product.name}
                    </span>
                  </div>

                  <img
                    src={`${BASE_URL}${product.productImage[0]}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute top-3 -right-20 group-hover:right-3 transition-all duration-500 flex flex-col gap-1 z-30">
                    {/* <div className="relative group/cart">
                      <div className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200">
                        <BsCart size={16} className="text-gray-800" />
                      </div>
                      <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/cart:opacity-100 transition-all whitespace-nowrap shadow-lg z-10">
                        Add to cart
                      </span>
                    </div> */}

                    <div className="relative group/qv">
                      <div className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200">
                        <svg
                          className="w-4 h-4 text-gray-800"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                      <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/qv:opacity-100 transition-all whitespace-nowrap shadow-lg z-10">
                        Quick View
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-2">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-[#633426]">
                      Rs. {product?.startingPrice}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      Rs. {product?.mrp}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
