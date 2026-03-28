import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Payment from "../components/cart/Payment.jsx";
import Address from "../components/cart/Address.jsx";
import Delivery from "../components/cart/Delivery.jsx"; 

const INITIAL_CART = [
  { id: 1, name: "DR CRZ Jacket", price: 235, qty: 1, image: "../extra/wo1.png", size: "M", color: "Black" },
  { id: 2, name: "Solid White Graphic Tee", price: 397, qty: 1, image: "/image/tee1.jpg", size: "L", color: "White" },
];

const SHIPPING = 6;
const VALID_COUPON = "SAVE10";

const CheckoutPage = () => {
  const [cart, setCart] = useState(INITIAL_CART);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [showLottie, setShowLottie] = useState(false); 
  const lottieTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (lottieTimeoutRef.current) {
        clearTimeout(lottieTimeoutRef.current);
      }
    };
  }, []);

  const increaseQty = useCallback((id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  }, []);

  const decreaseQty = useCallback((id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.qty, 0),
    [cart]
  );
  const total = useMemo(() => subtotal + SHIPPING - discount, [subtotal, discount]);

  const applyCoupon = useCallback(() => {
    if (coupon.trim() === VALID_COUPON && !couponApplied) {
      setDiscount(subtotal * 0.1);
      setCouponApplied(true);
      setShowLottie(true);

      if (lottieTimeoutRef.current) {
        clearTimeout(lottieTimeoutRef.current);
      }
      lottieTimeoutRef.current = setTimeout(() => {
        setShowLottie(false);
      }, 2500);
    }
  }, [coupon, couponApplied, subtotal]);

  return (
    <>
      {showLottie && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/20">
          <iframe
            src="https://lottie.host/embed/c0ba5fdc-793b-4076-9f17-01b91cd310d5/tFXMU37AOa.lottie"
            className="w-64 h-64"
            allowFullScreen
          />
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-12">
        <div className=" mx-auto px-4 sm:px-6 lg:px-20">
          
          {/* Simple Progress Steps */}
          <div className="flex items-center justify-center gap-8 mb-12 text-sm font-medium">
            <span className="text-gray-400">1. Bag</span>
            <div className="w-16 h-px bg-gray-200"></div>
            <span className="text-[#927f68] font-semibold">2. Address</span>
            <div className="w-16 h-px bg-gray-200"></div>
            <span className="text-gray-400">3. Payment</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Address Card */}
              <div className="bg-white p-6 lg:p-8 border border-gray-200">
                <Address />
              </div>

              {/* Delivery Card */}
              <div className="bg-white p-6 lg:p-8 border border-gray-200">
                <Delivery />
              </div>

              {/* Payment Card */}
              <div className="bg-white p-6 lg:p-8 border border-gray-200">
                <Payment />
              </div>
            </div>

            {/* Minimal Cart Summary */}
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <div className="bg-white border border-gray-200 p-6 lg:p-8">
                
                {/* Cart Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Your Bag ({cart.length} items)</h3>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-72 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-16 object-cover"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-1 leading-tight">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          Size: {item.size} | {item.color}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 p-1.5 border border-gray-200 rounded-sm">
                            <button 
                              onClick={() => decreaseQty(item.id)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm font-medium text-gray-900">
                              {item.qty}
                            </span>
                            <button 
                              onClick={() => increaseQty(item.id)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-500 hover:text-red-600 font-medium ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="text-right font-semibold text-sm text-gray-900">
                        ₹{(item.price * item.qty).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Section */}
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <div className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      placeholder="Promo code"
                      className="flex-1 px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#927f68] focus:border-transparent"
                      disabled={couponApplied}
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponApplied}
                      className="px-4 py-2.5 border border-[#927f68] text-[#927f68] text-sm font-medium hover:bg-[#927f68] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-xs text-green-600 mt-2">Coupon applied successfully</p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Shipping</span>
                    <span>₹{SHIPPING.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between py-2 text-green-600 font-medium">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(0).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-semibold text-[#927f68]">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">incl. taxes</p>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-[#927f68] text-white py-3 px-4 text-sm font-semibold hover:bg-[#7a6650] transition-colors border border-[#927f68]">
                  Place Order
                </button>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
