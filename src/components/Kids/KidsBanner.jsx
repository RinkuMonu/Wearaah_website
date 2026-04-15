import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanner } from "../../features/Banner/bannerSlice";


export default function KidsBanner() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const EMPTY_ARRAY = [];

  const banners = useSelector(
    (state) => state.banner.banners["homepage-top"] || EMPTY_ARRAY,
  );
 
  useEffect(() => {
    dispatch(
      fetchBanner({
        position: "homepage-top",
        deviceType: "desktop",
        targetGender:"kids"
      }),
    );
  }, [dispatch]);

  if (!banners.length) return null;
  return (
    <section className="relative w-full h-[80vh]">
      <Swiper
        modules={[Autoplay, EffectFade]}
        slidesPerView={1}
        loop
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        className="w-full h-full"
      >
        {banners?.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="relative w-full h-screen">
              {/* Background image */}
              <img
                src={`${BASE_URL}${slide?.images}`}
                alt={slide.bannerName}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />

              {/* Dark overlay */}
              {/* <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/10 to-black/5" /> */}

              {/* Centered content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-6xl mx-auto px-6 md:px-10">
                  <div className="max-w-xl">
                    <p className="text-sm md:text-base tracking-[0.3em] uppercase text-orange-200 mb-3">
                      Kids • Summer 2026
                    </p>
                   
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
