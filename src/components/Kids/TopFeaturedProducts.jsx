import React, { useEffect } from "react";
import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/Productlist/ProductSlice";
import { fetchBanner } from "../../features/Banner/bannerSlice";
import { resolveImageUrl } from "../../utils/resolveImage";

const FALLBACK_KIDS_TRENDING = [
  {
    _id: "k-trend-1",
    name: "Classic Boy Linen Indigo Casual Shirt",
    brand: "Wearaah Junior",
    price: 1199,
    mrp: 1799,
    startingPrice: 1199,
    rating: 4.8,
    image: "/images/Kids/kids-boy.jpg",
  },
  {
    _id: "k-trend-2",
    name: "Cotton Striped Smart Polo",
    brand: "Wearaah Junior",
    price: 899,
    mrp: 1399,
    startingPrice: 899,
    rating: 4.6,
    image: "/images/Kids/K1.jpg",
  },
  {
    _id: "k-trend-3",
    name: "Denim Washed Relaxed Trousers",
    brand: "Wearaah Kids",
    price: 1399,
    mrp: 1999,
    startingPrice: 1399,
    rating: 4.9,
    image: "/images/Kids/K4.jpg",
  },
  {
    _id: "k-trend-4",
    name: "Everyday Play Graphic T-Shirt",
    brand: "Wearaah Kids",
    price: 699,
    mrp: 1099,
    startingPrice: 699,
    rating: 4.7,
    image: "/images/Kids/K2.jpg",
  },
  {
    _id: "k-trend-5",
    name: "Warm Knitted Casual Pullover",
    brand: "Wearaah Studio",
    price: 1499,
    mrp: 2299,
    startingPrice: 1499,
    rating: 4.8,
    image: "/images/Kids/K6.jpg",
  },
];

export default function TopFeaturedProducts() {
  const dispatch = useDispatch();
  const key = JSON.stringify({ gender: "Kids", isTrending: true });

  const rawProducts = useSelector((state) => state.products.products[key]);
  const banners = useSelector(
    (state) => state.banner.banners["delivery"] || [],
  );

  useEffect(() => {
    dispatch(
      fetchProducts({
        gender: "Kids",
        isTrending: true,
      }),
    );
    dispatch(
      fetchBanner({
        position: "delivery",
        deviceType: "desktop",
      }),
    );
  }, [dispatch]);

  const displayProducts = React.useMemo(() => {
    if (Array.isArray(rawProducts) && rawProducts.length > 0) {
      return rawProducts.slice(0, 5).map((item, idx) => {
        const fallbackImg = FALLBACK_KIDS_TRENDING[idx % FALLBACK_KIDS_TRENDING.length].image;
        const rawImg = Array.isArray(item.productImage) ? item.productImage[0] : item.productImage;
        return {
          ...item,
          _id: item._id || `kt-${idx}`,
          image: resolveImageUrl(rawImg, fallbackImg),
        };
      });
    }
    return FALLBACK_KIDS_TRENDING;
  }, [rawProducts]);

  const bannerImg = banners?.[0]?.images
    ? resolveImageUrl(banners[0].images, "/images/centerbanner.webp")
    : "/images/centerbanner.webp";

  return (
    <section className="py-14 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-neutral-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-normal text-neutral-900 uppercase tracking-[0.14em]">
              Top Trending Kids Products
            </h2>
            <p className="text-xs text-neutral-400 tracking-wider mt-1 uppercase">
              Curated comfortable style for juniors
            </p>
          </div>
          <Link
            to="/productlist?gender=Kids"
            className="text-xs font-normal uppercase tracking-[0.15em] text-neutral-900 hover:text-[#ED1C24] pb-0.5 border-b border-neutral-900 hover:border-[#ED1C24] transition-all"
          >
            View All
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {displayProducts.map((item, idx) => (
            <Link
              to={`/product/${item._id}`}
              key={item._id}
              className="bg-white flex flex-col group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.failed) {
                      e.currentTarget.dataset.failed = "true";
                      e.currentTarget.src = FALLBACK_KIDS_TRENDING[idx % FALLBACK_KIDS_TRENDING.length].image;
                    }
                  }}
                />

                {item.rating > 0 && (
                  <div className="absolute bottom-2 left-2 bg-white/95 px-2 py-0.5 flex items-center gap-1 text-[11px] shadow-xs">
                    <Star size={11} className="text-[#08266B] fill-[#08266B]" />
                    <span>{item.rating}</span>
                  </div>
                )}

                <div className="absolute top-2 right-2 p-1.5 text-neutral-600 hover:text-black transition">
                  <Heart size={16} />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                  {item.brand || "Wearaah Kids"}
                </p>
                <p className="text-xs text-neutral-800 line-clamp-1 mt-0.5 uppercase tracking-wide">
                  {item.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-normal text-xs text-[#ED1C24]">
                    Rs. {Number(item.price || item.startingPrice || 0).toLocaleString("en-IN")}
                  </span>
                  {item.mrp > item.price && (
                    <span className="text-neutral-400 line-through text-[11px]">
                      Rs. {Number(item.mrp).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <img
          src={bannerImg}
          className="w-full h-44 sm:h-64 object-cover"
          alt="Delivery Banner"
          onError={(e) => {
            e.currentTarget.src = "/images/centerbanner.webp";
          }}
        />
      </div>
    </section>
  );
}
