import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchBanner } from "../../features/Banner/bannerSlice";
import { FiShield, FiTruck, FiRefreshCw, FiHeadphones, FiArrowRight } from "react-icons/fi";

const FALLBACK_BANNERS = [
  {
    _id: "fallback-1",
    title: "AUTUMN / WINTER 2026",
    subtitle: "THE CONTEMPORARY MENSWEAR EDIT",
    tagline: "Elegance redefined with premium denim, rich fabrics & timeless silhouettes.",
    image: "/images/1.jpg",
    cta: "Shop The Collection",
    link: "/productlist?category=men",
  },
  {
    _id: "fallback-2",
    title: "NEW ARRIVALS",
    subtitle: "TAILORED MENSWEAR ESSENTIALS",
    tagline: "Tailored blazers, luxury trousers, and hand-finished shirts.",
    image: "/images/2.jpg",
    cta: "Explore New In",
    link: "/productlist?isNewArrival=true",
  },
  {
    _id: "fallback-3",
    title: "SIGNATURE CAPSULE",
    subtitle: "URBAN MENSWEAR & DENIM",
    tagline: "Understated craftsmanship crafted for everyday distinction.",
    image: "/images/3.jpg",
    cta: "Discover More",
    link: "/productlist?subCategory=jeans",
  },
];

const HeroBanner = React.memo(function HeroBanner() {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const rawBanners = useSelector(
    (state) => state.banner?.banners?.["homepage-top"] || []
  );

  const bannerList = Array.isArray(rawBanners) && rawBanners.length > 0 ? rawBanners : [];

  useEffect(() => {
    dispatch(
      fetchBanner({
        position: "homepage-top",
        deviceType: "desktop",
      })
    );
  }, [dispatch]);

  const getImageUrl = (item) => {
    const img = item?.images || item?.image;
    if (!img) return "/images/1.jpg";
    if (img.startsWith("http") || img.startsWith("/images/")) return img;
    const cleanBase = BASE_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");
    return `${cleanBase}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  const handleBannerClick = (banner) => {
    if (banner.link) {
      navigate(banner.link);
      return;
    }

    const { redirectType } = banner;
    if (!redirectType || redirectType === "none") return;

    switch (redirectType) {
      case "category":
        navigate(
          `/productlist?category=${banner?.category?.slug}&ctd=${banner?.category?._id}`
        );
        break;
      case "subcategory":
        navigate(
          `/productlist?subCategoryId=${banner?.subcategory?._id}&subCategory=${banner?.subcategory?.slug}`
        );
        break;
      case "brand":
        navigate(
          `/productlist?brand=${banner?.brand?.slug}&brandId=${banner?.brand?._id}`
        );
        break;
      case "external":
        if (banner.redirectValue) window.open(banner.redirectValue, "_blank");
        break;
      default:
        break;
    }
  };

  const activeSlides = bannerList.length > 0 ? bannerList : FALLBACK_BANNERS;

  return (
    <section className="relative w-full bg-neutral-950 overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        loop={activeSlides.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={1000}
        pagination={{
          clickable: true,
          bulletActiveClass: "!bg-[#ED1C24] !w-8 !rounded-full transition-all duration-300",
        }}
        className="w-full h-[65vh] sm:h-[75vh] lg:h-[82vh]"
      >
        {activeSlides.map((slide, idx) => {
          const bgUrl = getImageUrl(slide);
          return (
            <SwiperSlide key={slide._id || idx} className="relative w-full h-full">
              <div
                onClick={() => handleBannerClick(slide)}
                className="relative w-full h-full cursor-pointer flex items-center justify-center overflow-hidden"
              >
                {/* Background Image with subtle scale */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out hover:scale-105"
                  style={{
                    backgroundImage: `url(${bgUrl})`,
                  }}
                />

                {/* Dark Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/35" />

                {/* Content Overlay */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 text-center text-white flex flex-col items-center">
                  <span className="inline-block px-3 py-1 mb-3 text-[11px] font-normal tracking-[0.22em] text-white uppercase bg-[#ED1C24] shadow-sm animate-fade-in">
                    {slide.title || "NEW DROP 2026"}
                  </span>
                  
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-[0.14em] mb-3 uppercase leading-tight drop-shadow-sm">
                    {slide.subtitle || "THE DENIM & MENSWEAR EDIT"}
                  </h1>

                  {slide.tagline && (
                    <p className="max-w-xl text-xs sm:text-sm text-neutral-300 font-light tracking-wider uppercase mb-7 hidden sm:block">
                      {slide.tagline}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBannerClick(slide);
                      }}
                      className="px-7 py-3 bg-[#ED1C24] text-white hover:bg-black transition-all duration-300 text-xs font-medium uppercase tracking-[0.16em] shadow-md flex items-center gap-2 group cursor-pointer"
                    >
                      <span>{slide.cta || "Shop Now"}</span>
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </button>
                    <Link
                      to="/productlist"
                      onClick={(e) => e.stopPropagation()}
                      className="px-6 py-3 border border-white hover:bg-white hover:text-black text-white transition-all duration-300 text-xs font-medium uppercase tracking-[0.16em] backdrop-blur-xs hidden md:inline-block cursor-pointer"
                    >
                      View All Catalog
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Trust & Assurance Strip */}
      <div className="border-t border-neutral-800 bg-[#0A0A0A] text-neutral-300 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <FiTruck className="text-[#ED1C24] shrink-0" size={20} strokeWidth={1.5} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white">Free Shipping Across India</p>
              <p className="text-[11px] text-neutral-400">On all prepaid orders nationwide</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <FiShield className="text-[#ED1C24] shrink-0" size={20} strokeWidth={1.5} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white">100% Original Men's Wear</p>
              <p className="text-[11px] text-neutral-400">Curated certified apparel only</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <FiRefreshCw className="text-[#ED1C24] shrink-0" size={20} strokeWidth={1.5} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white">7-Day Easy Returns</p>
              <p className="text-[11px] text-neutral-400">Doorstep pickup & exchange</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <FiHeadphones className="text-[#ED1C24] shrink-0" size={20} strokeWidth={1.5} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white">Secure & COD Available</p>
              <p className="text-[11px] text-neutral-400">Fast checkout & assistance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HeroBanner;
