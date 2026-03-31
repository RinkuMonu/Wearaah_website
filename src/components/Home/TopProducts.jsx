import React from "react";
import { Link } from "react-router-dom";
import { BsCart } from "react-icons/bs";
import { PRODUCTS } from "../../data/products";
import { getCartItems, setCartItems } from "../../utils/cartStorage";
import api from "../service/axios";

const BANNER_IMAGE = "/images/shoip_your_size_1_1.webp";
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
});

const TopProducts = React.memo(function TopProducts() {
const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

console.log(products, "products from top product component state");

React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/product/web");
                // console.log(res.data, "products from top product component");?
               const data = res.data;

                if (data.success) {
                    setProducts(data.products || []);
                } else {
                    setError("Failed to fetch products");
                }
            } catch (err) {
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);


    const handleAddToCart = React.useCallback((product) => {
        const existing = getCartItems();
        const selectedSize = product.sizes?.[0] || "M";
        const selectedColor = product.colors?.[0] || "Black";
        const currentIndex = existing.findIndex(
            (item) => item.productId === product.id && item.size === selectedSize && item.color === selectedColor
        );

        if (currentIndex > -1) {
            existing[currentIndex].quantity += 1;
        } else {
            existing.push({
                lineId: `${product.id}-${selectedSize}-${selectedColor}`,
                productId: product.id,
                quantity: 1,
                size: selectedSize,
                color: selectedColor,
                price: product.price,
                name: product.name,
                image: product.front,
            });
        }

        setCartItems(existing);
    }, []);

   const BASE_URL = "https://vmm9pgj8-5000.inc1.devtunnels.ms"; // make sure defined

const formattedProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products.slice(0, 10).map((product) => {
        const price = product.startingPrice || 0;
        const originalPrice = product.mrp || 0;
console.log(product, "product in formatted products");
        const discountPercent =
            originalPrice > 0
                ? Math.round(((originalPrice - price) / originalPrice) * 100)
                : 0;

        const imagePath = product.productImage?.[0];

        return {
            id: product._id,
            name: product.name || "No Name",
            price,
            originalPrice,
            front: imagePath
                ? `${BASE_URL}${imagePath}`
                : "/placeholder.png",
            back: imagePath
                ? `${BASE_URL}${imagePath}`
                : "/placeholder.png",
            sizes: ["M"],
            colors: ["Black"],
            discountPercent,
            formattedPrice: CURRENCY_FORMATTER.format(price),
            formattedOriginal: CURRENCY_FORMATTER.format(originalPrice),
        };
    });
}, [products]);

 if (loading) {
        return <p className="text-center py-10">Loading products...</p>;
    }


    if (error) {
        return <p className="text-center py-10 text-red-500">{error}</p>;
    }
    return (
        <>
            <div className=" mx-auto px-8 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Top Summer Products</h2>
                        <span className="text-sm text-gray-500">Shop now for ultimate comfort</span>
                    </div>
                    <Link to="/productlist" className="text-[#633426] font-semibold text-sm hover:text-orange-600 transition">
                        View All 
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                   {formattedProducts.map((product) => (
                        <article key={product.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden bg-gray-100">
                                <Link to={`/product/${product.id}`}>
                                    <img
                                        src={product.front}
                                        alt={product.name}
                                        className="w-full transition duration-500 group-hover:opacity-0"
                                    />

                                    <img
                                        src={product.back}
                                        alt={`${product.name} back`}
                                        className="w-full absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition duration-500"
                                    />

                                    <span className="absolute left-2 top-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                                        {product.discountPercent}% OFF
                                    </span>
                                </Link>

                                <div className="absolute top-3 -right-15 group-hover:right-3 transition-all duration-500">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
                                    >
                                        <BsCart size={18} />
                                    </button>
                                </div>
                            </div>

                            <Link to={`/product/${product.id}`}>
                                <p className="mt-3 text-sm font-medium">
                                    {product.name}
                                </p>

                                <p className="text-red-500 font-semibold">
                                    Rs. {product.formattedPrice}
                                    <span className="line-through text-gray-400 ml-2">
                                        Rs. {product.formattedOriginal}
                                    </span>
                                </p>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>

            <div className="w-full my-10">
                <img src={BANNER_IMAGE} alt="Shop your size banner" className="w-full" loading="lazy" decoding="async" />
            </div>
        </>
    );
});

export default TopProducts;
