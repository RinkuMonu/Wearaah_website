import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchBanner } from "../../features/Banner/bannerSlice";

const SWIPER_MODULES = [Autoplay, Navigation];

const SWIPER_BREAKPOINTS = {
  0: {
    slidesPerView: 1,
    spaceBetween: 20,
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 30,
  },
  768: {
    slidesPerView: 3,
    spaceBetween: 30,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 40,
  },
  1440: {
    slidesPerView: 3,
    spaceBetween: 10,
  },
};

const HeroBanner = React.memo(function HeroBanner() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const banners = useSelector(
    (state) => state.banner.banners["homepage-top"] || {},
  );
 
  useEffect(() => {
    dispatch(
      fetchBanner({
        position: "homepage-top",
        deviceType: "desktop",
      }),
    );
  }, [dispatch]);

  const handleBannerClick = (banner) => {
    const { redirectType } = banner;

    if (!redirectType || redirectType === "none") return;

    switch (redirectType) {
      case "category":
        navigate(
          `/productlist?category=${banner?.category?.slug}&ctd=${banner?.category?._id}`,
        );
        break;

      case "subcategory":
        navigate(
          `/productlist?subCategoryId=${banner?.subcategory?._id}&subCategory=${banner?.subcategory?.slug}`,
        );
        break;

      case "brand":
        navigate(
          `/productlist?brand=${banner?.brand?.slug}&brandId=${banner?.brand?._id}`,
        );
        break;

      case "external":
        window.open(banner.redirectValue, "_blank");
        break;

      default:
        break;
    }
  };

  if (!banners.length) return null;
  return (
    <section className="z-10 overflow-hidden w-full">
      <Swiper
        modules={SWIPER_MODULES}
        slidesPerView={3}
        spaceBetween={20}
        loop={banners.length > 3}
        slidesPerGroup={1}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={800} // 🔥 smooth slide
        breakpoints={SWIPER_BREAKPOINTS}
        className="mySwiper w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id} className="h-full">
            <div className="w-full h-[80vh] relative flex items-center justify-center">
              <div
                onClick={() => handleBannerClick(banner)}
                className="w-full h-full cursor-pointer"
                style={{
                  backgroundImage: `url(${BASE_URL}${banner.images})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
});

export default HeroBanner;
