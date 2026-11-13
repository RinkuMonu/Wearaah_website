import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { BsCart } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/Productlist/ProductSlice";
import { getCartItems, setCartItems } from "../../utils/cartStorage";
import { resolveImageUrl } from "../../utils/resolveImage";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const FALLBACK_KIDS_PRODUCTS = [
  {
    _id: "kp-1",
    name: "Boys Casual Denim Indigo Shirt",
    price: 1299,
    startingPrice: 1299,
    mrp: 1899,
    discountPercent: 32,
    front: "/images/Kids/kids-boy.jpg",
    back: "/images/Kids/K1.jpg",
  },
  {
    _id: "kp-2",
    name: "Kids Printed Summer Cotton Tee",
    price: 799,
    startingPrice: 799,
    mrp: 1299,
    discountPercent: 38,
    front: "/images/Kids/K2.jpg",
    back: "/images/Kids/K3.jpeg",
  },
  {
    _id: "kp-3",
    name: "Boys Cargo Jogger Pants",
    price: 1199,
    startingPrice: 1199,
    mrp: 1699,
    discountPercent: 29,
    front: "/images/Kids/K4.jpg",
    back: "/images/Kids/K5.jpg",
  },
  {
    _id: "kp-4",
    name: "Junior Striped Casual Polo",
    price: 899,
    startingPrice: 899,
    mrp: 1399,
    discountPercent: 36,
    front: "/images/Kids/K6.jpg",
    back: "/images/Kids/K7.jpg",
  },
  {
    _id: "kp-5",
    name: "Kids Everyday Comfort Shorts",
    price: 699,
    startingPrice: 699,
    mrp: 999,
    discountPercent: 30,
    front: "/images/Kids/K8.jpg",
    back: "/images/Kids/K9.jpg",
  },
];

const KidsProducts = React.memo(function KidsProducts() {
  const dispatch = useDispatch();
  const key = JSON.stringify({ gender: "Kids" });
  const rawProducts = useSelector((state) => state.products.products[key]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        gender: "Kids",
      }),
    );
  }, [dispatch]);

  const handleAddToCart = React.useCallback((product) => {
    const existing = getCartItems();
    const selectedSize = product.sizes?.[0] || "M";
    const selectedColor = product.colors?.[0] || "Standard";
    const id = product.id || product._id;
    const currentIndex = existing.findIndex(
      (item) =>
        (item.productId === id || item.id === id) &&
        item.size === selectedSize &&
        item.color === selectedColor,
    );

    if (currentIndex > -1) {
      existing[currentIndex].quantity += 1;
    } else {
      existing.push({
        lineId: `${id}-${selectedSize}-${selectedColor}-${Date.now()}`,
        productId: id,
        id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
        price: product.price || product.startingPrice || 0,
        name: product.name,
        image: product.front,
      });
    }

    setCartItems(existing);
  }, []);

  const formattedProducts = React.useMemo(() => {
    if (Array.isArray(rawProducts) && rawProducts.length > 0) {
      return rawProducts.map((p, idx) => {
        const price = Number(p.startingPrice || p.price || 0);
        const mrp = Number(p.mrp || p.originalPrice || 0);
        const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
        const fallbackFront = FALLBACK_KIDS_PRODUCTS[idx % FALLBACK_KIDS_PRODUCTS.length].front;
        const fallbackBack = FALLBACK_KIDS_PRODUCTS[idx % FALLBACK_KIDS_PRODUCTS.length].back;

        const rawFront = Array.isArray(p.productImage) ? p.productImage[0] : p.productImage;
        const rawBack = Array.isArray(p.productImage) ? p.productImage[1] : null;

        const front = resolveImageUrl(rawFront, fallbackFront);
        const back = rawBack ? resolveImageUrl(rawBack, front) : fallbackBack;

        return {
          ...p,
          _id: p._id || `kp-${idx}`,
          name: p.name || "Kids Fashion Essential",
          discountPercent,
          price,
          mrp,
          front,
          back,
          formattedPrice: CURRENCY_FORMATTER.format(price),
          formattedOriginal: CURRENCY_FORMATTER.format(mrp),
        };
      });
    }
    return FALLBACK_KIDS_PRODUCTS.map((p) => ({
      ...p,
      formattedPrice: CURRENCY_FORMATTER.format(p.price),
      formattedOriginal: CURRENCY_FORMATTER.format(p.mrp),
    }));
  }, [rawProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-normal text-neutral-900 uppercase tracking-[0.14em]">
            Top Kids Summer Products
          </h2>
          <span className="text-xs text-neutral-400 tracking-wider mt-1 uppercase">
            Fun & comfortable summer wear
          </span>
        </div>
        <Link
          to="/productlist?gender=Kids"
          className="text-xs font-normal uppercase tracking-[0.15em] text-neutral-900 hover:text-[#ED1C24] pb-0.5 border-b border-neutral-900 hover:border-[#ED1C24] transition-all"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
        {formattedProducts.map((product, idx) => (
          <article
            key={product._id}
            className="group cursor-pointer flex flex-col bg-white"
            aria-label={product.name}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
              <Link to={`/product/${product._id}`} className="block w-full h-full">
                <img
                  src={product.front}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.failed) {
                      e.currentTarget.dataset.failed = "true";
                      e.currentTarget.src = FALLBACK_KIDS_PRODUCTS[idx % FALLBACK_KIDS_PRODUCTS.length].front;
                    }
                  }}
                />

                {product.discountPercent > 0 && (
                  <span className="absolute bottom-2 left-2 bg-black text-white text-[10px] font-normal tracking-widest uppercase px-2 py-0.5">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </Link>

              <button
                onClick={() => handleAddToCart(product)}
                aria-label={`Add ${product.name} to cart`}
                className="absolute bottom-2 right-2 w-7 h-7 bg-white/90 hover:bg-white text-neutral-900 rounded-none shadow-xs flex items-center justify-center transition"
              >
                <BsCart size={13} />
              </button>
            </div>

            <Link to={`/product/${product._id}`} className="pt-2">
              <p className="text-xs uppercase tracking-wide font-normal text-neutral-800 line-clamp-1 hover:text-black">
                {product.name}
              </p>
              <p className="text-xs text-[#ED1C24] font-medium mt-1">
                Rs. {product.formattedPrice}
                {product.mrp > product.price && (
                  <span className="line-through text-neutral-400 font-normal ml-2 text-[11px]">
                    Rs. {product.formattedOriginal}
                  </span>
                )}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
});

export default KidsProducts;
