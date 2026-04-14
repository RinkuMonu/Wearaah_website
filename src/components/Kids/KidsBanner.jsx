import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    image: "/images/Herobanner/Kids/B3.png",
    link: "/kids"
  },
  {
    id: 2,
    image: "/images/Herobanner/Kids/B2.jpg",
    link: "/kids-summer"
  },
  {
    id: 3,
    image: "/images/Herobanner/Kids/bannermost.PNG",
    link: "/kids-playwear"
  }
];

export default function KidsBanner() {
  
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
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-screen">
              {/* Background image */}
              <img
                src={slide.image}
                alt={slide.title}
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
