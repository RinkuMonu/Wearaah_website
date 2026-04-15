import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fatchBrands } from "../../features/Brands/brandSlice";


export default function BrandsSection() {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { brands } = useSelector((state) => state.brands);
  useEffect(() => {
    dispatch(fatchBrands());
  }, [dispatch]);
    return (
        <section className="w-full py-20 bg-white">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Top Kids Brands</h2>
                        <span className="text-sm text-gray-500">Most Favourite Brands</span>
                    </div>
                    <Link to="/productlist?gender=Kids" className="text-[#633426] font-semibold text-sm hover:text-orange-600 transition">
                        View All
                    </Link>
                </div>
                <Swiper
                    modules={[Autoplay]}
                    slidesPerView={4}
                    spaceBetween={2}
                    loop
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    breakpoints={{
                        320: { slidesPerView: 2, spaceBetween: 20 },
                        640: { slidesPerView: 3, spaceBetween: 24 },
                        768: { slidesPerView: 4, spaceBetween: 32 },
                        1024: { slidesPerView: 5, spaceBetween: 40 },
                        1280: { slidesPerView: 6, spaceBetween: 48 }
                    }}
                    className=""
                >
                    {brands?.map((logo, index) => (
                        <SwiperSlide key={index} className=" flex! justify-center">
                            <div className="overflow-hiddenflex items-center justify-center p-2 sm:p-3 hover:scale-110 transition-all duration-300 cursor-pointer mx-auto">
                              <Link to={`/productlist?brand=${logo.slug}&brandId=${logo._id}`}>
                                <img
                                   src={`${BASE_URL}${logo?.banner}`}
                                    alt="Brand"
                                    className="w-50 h-50 object-contain rounded-full"
                                    loading="lazy"
                                />
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
