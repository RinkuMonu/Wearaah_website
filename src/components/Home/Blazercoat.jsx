import { useEffect } from "react";
import { BsCart } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/Productlist/ProductSlice";
import { Link } from "react-router-dom";

const Blazercoat = () => {
  const categoryId = "69c50b8293df3e7bd375833a";
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products[`category-${categoryId}`]);

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
    <>
      <div className="mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Blazer and Coat
            </h2>
            <span className="text-sm text-gray-500">
              Shop now for ultimate comfort
            </span>
          </div>
          <button className="text-[#633426] font-semibold text-sm hover:text-orange-600 transition">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {products?.slice(0, 10).map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden bg-gray-100">
                <img
                  src={`${BASE_URL}${product.productImage[0]}`}
                  alt="product"
                  className="w-full transition duration-500 group-hover:opacity-0"
                />

                <img
                  src={`${BASE_URL}${product?.productImage[1]}`}
                  alt="product hover"
                  className="w-full absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition duration-500"
                />

                <div className="absolute top-3 -right-15 group-hover:right-3 transition-all duration-500 flex flex-col gap-2">
                  {/* <div className="relative group/cart">
                    <div className="bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                      <BsCart size={18} className="text-gray-800" />
                    </div>
                    <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/cart:opacity-100 transition whitespace-nowrap shadow-lg z-20">
                      Add to cart
                    </span>
                  </div> */}

                  <div className="relative group/quickview">
                    <div className="bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                      <svg
                        className="w-5 h-5 text-gray-800"
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
                    <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/quickview:opacity-100 transition whitespace-nowrap shadow-lg z-20">
                      Quick View
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm font-medium">{product.name}</p>
              <p className="text-red-500 font-semibold">
                Rs. {product?.startingPrice}{" "}
                <span className="line-through text-gray-400 ml-2">
                  Rs. {product?.mrp}
                </span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Blazercoat;
