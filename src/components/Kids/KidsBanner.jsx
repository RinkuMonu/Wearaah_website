import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanner } from "../../features/Banner/bannerSlice";
import { resolveImageUrl } from "../../utils/resolveImage";

const FALLBACK_KIDS_BANNERS = [
  {
    _id: "kb-default-1",
    bannerName: "Junior Season Styles",
    images: "/images/centerbanner.webp",
  },
];


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

  const activeBanners = banners && banners.length > 0 ? banners : FALLBACK_KIDS_BANNERS;

  return (
    <section className="relative w-full h-[60vh] sm:h-[80vh]">
      <Swiper
        modules={[Autoplay, EffectFade]}
        slidesPerView={1}
        loop
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        className="w-full h-full"
      >
        {activeBanners.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="relative w-full h-full">
              {/* Background image */}
              <img
                src={resolveImageUrl(slide?.images, "/images/centerbanner.webp")}
                alt={slide.bannerName || "Kids Banner"}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = "/images/centerbanner.webp";
                }}
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
