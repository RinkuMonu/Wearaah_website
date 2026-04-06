import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../features/Category/categorySlice";

export default function TrendingCategorie() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category.categories);
  console.log(categories);
  
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Trending Categories
            </h2>
            <span className="text-sm text-gray-500">
              Latest trends you love
            </span>
          </div>
          <Link to={"/productlist"} className="text-[#633426] font-semibold text-sm hover:text-orange-600 transition">
            View All →
          </Link>
        </div>

        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Autoplay]}
          className="mySwiper"
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 20 },
            640: { slidesPerView: 2, spaceBetween: 25 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
        >
          {categories?.map((data, index) => (
            <SwiperSlide key={index}>
              <Link
                to={`/productlist?category=${data?.slug}&ctd=${data?._id}`}
                className="w-full h-full  overflow-hidden cursor-pointer"
              >
                <img
                  src={`${BASE_URL}${data?.smallimage}`}
                  alt={`Trend ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
