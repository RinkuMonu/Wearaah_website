import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Payment from "../components/cart/Payment.jsx";
import Address from "../components/cart/Address.jsx";
import Delivery from "../components/cart/Delivery.jsx";
import { useDispatch, useSelector } from "react-redux";
import { FiCheck } from "react-icons/fi";
import { useAuth } from "./service/AuthContext.jsx";
import {
  fetchCartItems,
  incrementDecrementItemQuantity,
  removeFromCart,
} from "../features/Cart/cartSlice.jsx";
import {
  CART_UPDATED_EVENT,
  getCartItems,
  setCartItems,
} from "../utils/cartStorage.js";
import api from "./service/axios.js";

const VALID_COUPON = "SAVE10";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, wallet1, getWallet } = useAuth();
  const {
    cartItems: reduxCartItems,
    status,
    grandTotal,
  } = useSelector((state) => state.cart);
  const [toast, setToast] = useState(null);
  const [localCartItems, setLocalCartItems] = useState([]);
  const [addressData, setAddressData] = useState(null);
  const [useWallet, setUseWallet] = useState(false);
  const [useCoins, setUseCoins] = useState(false);

  // Get cart data from location state (passed from CartOffCanvas)
  const [cart, setCart] = useState(() => {
    if (location.state?.cartData) {
      return location.state.cartData;
    }
    return [];
  });

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [showLottie, setShowLottie] = useState(false);
  const lottieTimeoutRef = useRef(null);

  // Helper functions
  const extractSizeFromVariant = (variantName) => {
    if (!variantName) return "M";
    const sizeMatch = variantName.match(/\b(S|M|L|XL|XXL|XS)\b/i);
    return sizeMatch ? sizeMatch[0].toUpperCase() : "M";
  };

  const extractColorFromVariant = (variantName) => {
    if (!variantName) return "Black";
    const colors = ["Black", "Blue", "Red", "Green", "White", "Gray", "Brown"];
    const foundColor = colors.find((color) =>
      variantName.toLowerCase().includes(color.toLowerCase()),
    );
    return foundColor || "Black";
  };

  // Function to transform Redux cart items to display format
  const transformReduxCartToDisplay = (reduxItems) => {
    if (!reduxItems || !Array.isArray(reduxItems)) return [];

    return reduxItems.map((item, index) => {
      const isLoggedInUser = user && item.variant;
      return {
        id: item._id || index,
        name: isLoggedInUser ? item.product?.title : item.name,
        price: isLoggedInUser ? item.variant?.sellingPrice : item.price,
        qty: item.quantity || 1,
        image: isLoggedInUser ? item.variant?.variantImages?.[0] : item.image,
        size: isLoggedInUser
          ? extractSizeFromVariant(item.variant?.name)
          : item.size,
        color: isLoggedInUser
          ? extractColorFromVariant(item.variant?.name)
          : item.color,
        variantId: isLoggedInUser ? item.variant?._id : item.variantId,
        productId: isLoggedInUser ? item.product?._id : item.productId,
      };
    });
  };

  // Function to normalize guest items
  const normalizeGuestItems = (items) => {
    if (!items || !Array.isArray(items)) return [];

    return items.map((item, index) => ({
      lineId: item.lineId || `guest-item-${index}`,
      productId: item.productId,
      variantId: item.variantId,
      quantity: Number(item.quantity || 1),
      name: item.name || "Product",
      price: item.price || 0,
      mrp: item.mrp || 0,
      image: item.image || "/placeholder-image.jpg",
      size: item.size || "M",
      color: item.color || "Black",
    }));
  };

  // Update guest cart in localStorage
  const updateGuestCart = (updatedItems) => {
    const itemsToStore = updatedItems.map((item) => ({
      variantId: item.variantId,
      productId: item.productId,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
      mrp: item.mrp,
      image: item.image,
      size: item.size,
      color: item.color,
      lineId: item.lineId,
    }));
    setCartItems(itemsToStore);
    setLocalCartItems(updatedItems);

    // Also update the display cart
    const displayCart = updatedItems.map((item, index) => ({
      id: item.lineId || index,
      name: item.name,
      price: item.price,
      qty: item.quantity,
      image: item.image,
      size: item.size,
      color: item.color,
      variantId: item.variantId,
      productId: item.productId,
    }));
    setCart(displayCart);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  };

  useEffect(() => {
    if (user) {
      getWallet();
    }
  }, [user]);

  // Load guest cart from localStorage
  useEffect(() => {
    if (!user && (!cart || cart.length === 0)) {
      const savedCart = getCartItems();
      const normalized = normalizeGuestItems(savedCart);
      setLocalCartItems(normalized);

      const displayCart = normalized.map((item, index) => ({
        id: item.lineId || index,
        name: item.name,
        price: item.price,
        qty: item.quantity,
        image: item.image,
        size: item.size,
        color: item.color,
        variantId: item.variantId,
        productId: item.productId,
      }));
      setCart(displayCart);
    }
  }, [user]);

  // Fetch cart items when user is logged in
  useEffect(() => {
    if (user && (!cart || cart.length === 0)) {
      dispatch(fetchCartItems());
    }
  }, [user, dispatch]);

  // Sync local cart with storage changes for guest users
  useEffect(() => {
    const syncCart = () => {
      if (!user) {
        const savedCart = getCartItems();
        const normalized = normalizeGuestItems(savedCart);
        setLocalCartItems(normalized);

        const displayCart = normalized.map((item, index) => ({
          id: item.lineId || index,
          name: item.name,
          price: item.price,
          qty: item.quantity,
          image: item.image,
          size: item.size,
          color: item.color,
          variantId: item.variantId,
          productId: item.productId,
        }));
        setCart(displayCart);
      }
    };

    window.addEventListener(CART_UPDATED_EVENT, syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, [user]);

  // Transform Redux cart items to display format and update local cart state
  useEffect(() => {
    if (user && reduxCartItems) {
      const transformedCart = transformReduxCartToDisplay(reduxCartItems);
      setCart(transformedCart);
    }
  }, [user, reduxCartItems]);

  useEffect(() => {
    return () => {
      if (lottieTimeoutRef.current) {
        clearTimeout(lottieTimeoutRef.current);
      }
    };
  }, []);

  // Cart operations
  const removeItem = (productId, variantId) => {
    if (user) {
      // For logged-in users, use Redux with variantId
      dispatch(removeFromCart({ productId: variantId }))
        .unwrap()
        .then(() => {
          setToast({ type: "success", message: "Item removed from cart" });
          setTimeout(() => setToast(null), 3000);
          // Refresh cart display - this will trigger the useEffect above
          dispatch(fetchCartItems());
        })
        .catch((error) => {
          setToast({
            type: "error",
            message: error?.message || "Failed to remove item",
          });
          setTimeout(() => setToast(null), 3000);
        });
    } else {
      // For guest users, update localStorage
      const updatedItems = localCartItems.filter(
        (item) => item.variantId !== variantId,
      );
      updateGuestCart(updatedItems);
      setToast({ type: "success", message: "Item removed from cart" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const increaseQty = (productId, variantId) => {
    if (user) {
      // For logged-in users, use Redux with variantId
      const currentItem = reduxCartItems.find(
        (item) =>
          item.variant?._id === variantId || item.variantId === variantId,
      );
      const newQuantity = (currentItem?.quantity || 0) + 1;

      dispatch(
        incrementDecrementItemQuantity({
          variantId: variantId,
          quantity: newQuantity,
        }),
      )
        .unwrap()
        .then(() => {
          // After successful update, fetch fresh cart data
          dispatch(fetchCartItems());
        })
        .catch((error) => {
          setToast({
            type: "error",
            message: error?.message || "Failed to update quantity",
          });
          setTimeout(() => setToast(null), 3000);
        });
    } else {
      // For guest users, update localStorage
      const updatedItems = localCartItems.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      updateGuestCart(updatedItems);
    }
  };

  const decreaseQty = (productId, variantId) => {
    if (user) {
      // For logged-in users, use Redux with variantId
      const currentItem = reduxCartItems.find(
        (item) =>
          item.variant?._id === variantId || item.variantId === variantId,
      );
      const newQuantity = Math.max(1, (currentItem?.quantity || 0) - 1);

      dispatch(
        incrementDecrementItemQuantity({
          variantId: variantId,
          quantity: newQuantity,
        }),
      )
        .unwrap()
        .then(() => {
          // After successful update, fetch fresh cart data
          dispatch(fetchCartItems());
        })
        .catch((error) => {
          setToast({
            type: "error",
            message: error?.message || "Failed to update quantity",
          });
          setTimeout(() => setToast(null), 3000);
        });
    } else {
      // For guest users, update localStorage
      const updatedItems = localCartItems.map((item) =>
        item.variantId === variantId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
      updateGuestCart(updatedItems);
    }
  };

  const subtotal = useMemo(() => {
    if (user && grandTotal) {
      return grandTotal;
    }
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  }, [cart, user, grandTotal]);

  const { finalTotal, usedWallet, usedCoins } = useMemo(() => {
    let baseTotal = subtotal - discount;

    const walletBalance = wallet1?.availableBalance || 0;
    const coinBalance = wallet1?.superCoinBalance || 0;

    let usedWallet = 0;
    let usedCoins = 0;

    // ✅ Sirf jo user select kare wahi apply hoga
    if (useWallet) {
      usedWallet = Math.min(walletBalance, baseTotal);
      baseTotal -= usedWallet;
    }

    if (useCoins) {
      usedCoins = Math.min(coinBalance, baseTotal);
      baseTotal -= usedCoins;
    }

    return {
      finalTotal: Math.max(0, baseTotal),
      usedWallet,
      usedCoins,
    };
  }, [subtotal, discount, wallet1, useWallet, useCoins]);

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

  const handlePlaceOrder = async () => {
    try {
      // Prepare items array from cart
      const items = cart.map((item) => ({
        variant: item.variantId,
        quantity: item.qty,
      }));

      const payload = {
        items,
        shippingAddress: {
          fullName: addressData?.firstName + " " + addressData.lastName,
          mobile: addressData.phone,
          street: addressData.address,
          landmark: addressData.landmark,
          city: addressData.city,
          state: addressData.state,
          pincode: addressData.zip,
        },
        paymentMethod: "UPI",
        coinUsed: usedCoins,
        walletUsed: usedWallet,
      };

      // console.log("Sending order payload:", payload);

      const response = await api.post("/order", payload);
      if (response.data?.success) {
        console.log("Raw response data:", response.data);
        // alert(response.data?.message || "Order placed successfully");
        setToast({
          type: "success",
          message: response.data?.message || "Order placed successfully",
        });
      }

      // Optional: redirect to success page
      // navigate("/order-success");
    } catch (error) {
      console.error("Order error:", error.message || error);
      // alert(error?.response?.data?.message || "Failed to place order");
      setToast({
        type: "error",
        message: error?.response?.message,
      });
    }
  };

  const isLoading = user ? status === "loading" : false;

  if ((!cart || cart.length === 0) && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/productlist")}
            className="bg-[#927f68] text-white px-6 py-2 rounded-md"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-sm shadow-2xl flex items-center gap-2
          ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-gray-900 text-white"
          }`}
        >
          {toast.type === "error" ? (
            <span>⚠️</span>
          ) : (
            <FiCheck size={14} className="text-emerald-400" />
          )}
          {toast.message}
        </div>
      )}

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
        <div className="mx-auto px-4 sm:px-6 lg:px-20">
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
                <Address onAddressChange={setAddressData} />
              </div>

              {/* Delivery Card */}
              {/* <div className="bg-white p-6 lg:p-8 border border-gray-200">
                <Delivery />
              </div> */}

              {/* Payment Card */}
              {/* <div className="bg-white p-6 lg:p-8 border border-gray-200">
                <Payment />
              </div> */}
            </div>

            {/* Minimal Cart Summary */}
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <div className="bg-white border border-gray-200 p-6 lg:p-8">
                {/* Cart Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Your Bag ({cart.length} items)
                    </h3>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-72 overflow-y-auto">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#927f68] mx-auto"></div>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `https://lrd46c05-5000.inc1.devtunnels.ms${item.image}`
                          }
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
                                onClick={() =>
                                  decreaseQty(item.productId, item.variantId)
                                }
                                disabled={isLoading}
                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-50"
                              >
                                −
                              </button>
                              <span className="w-6 text-center text-sm font-medium text-gray-900">
                                {item.qty}
                              </span>
                              <button
                                onClick={() =>
                                  increaseQty(item.productId, item.variantId)
                                }
                                disabled={isLoading}
                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-50"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                removeItem(item.productId, item.variantId)
                              }
                              disabled={isLoading}
                              className="text-xs text-red-500 hover:text-red-600 font-medium ml-2 disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="text-right font-semibold text-sm text-gray-900">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
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
                    <p className="text-xs text-green-600 mt-2">
                      Coupon applied successfully
                    </p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {/* <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Shipping</span>
                    <span>₹{SHIPPING.toLocaleString()}</span>
                  </div> */}
                  {wallet1.availableBalance > 0 && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={useWallet}
                          onChange={() => {
                            setUseWallet(!useWallet);
                            setUseCoins(false);
                          }}
                        />
                        <span>Wallet</span>
                        <span className="text-sm text-gray-500">
                          (₹{wallet1.availableBalance})
                        </span>
                      </div>
                    </div>
                  )}

                  {wallet1.superCoinBalance > 0 && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={useCoins}
                          onChange={() => {
                            setUseCoins(!useCoins);
                            setUseWallet(false);
                          }}
                        />
                        <span>Coins</span>
                        <span className="text-sm text-gray-500">
                          (₹{wallet1.superCoinBalance})
                        </span>
                      </div>
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="flex justify-between py-2 text-green-600 font-medium">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(0).toLocaleString()}</span>
                    </div>
                  )}
                </div>
                {usedWallet > 0 && (
                  <div className="flex justify-between py-2 text-green-600">
                    <span>Wallet Used</span>
                    <span>-₹{usedWallet.toLocaleString()}</span>
                  </div>
                )}

                {usedCoins > 0 && (
                  <div className="flex justify-between py-2 text-green-600">
                    <span>Coins Used</span>
                    <span>-₹{usedCoins.toLocaleString()}</span>
                  </div>
                )}
                {/* Total */}
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-semibold text-[#927f68]">
                      ₹{finalTotal.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">incl. taxes</p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="w-full bg-[#927f68] text-white py-3 px-4 text-sm font-semibold hover:bg-[#7a6650] transition-colors border border-[#927f68] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Place Order"}
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
