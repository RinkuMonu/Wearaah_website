import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import {
  CART_UPDATED_EVENT,
  getCartItems,
  setCartItems,
} from "../../utils/cartStorage";
import LoginModal from "./Login";
import { useAuth } from "../service/AuthContext";
import { useQuery } from '@tanstack/react-query';
import api from "../service/axios";
import { FiCheck } from "react-icons/fi";

export default function CartOffCanvas({ isOpen, onClose }) {
  const { loginOpen, setLoginOpen, user } = useAuth();
  const navigate = useNavigate();
const [toast, setToast] = useState("");
  // Function to normalize items from API response to match your component's expected format
  const normalizeApiItems = (apiData) => {
    if (!apiData?.data?.items) return [];
    
    return apiData.data.items.map((item, index) => ({
      lineId: item._id || `api-item-${index}`,
      productId: item.productId,
      variantId: item.variantId,
      sellerId: item.sellerId,
      quantity: item.quantity,
      name: item.product?.title || item.variant?.name || "Product",
      price: item.variant?.sellingPrice || 0,
      mrp: item.variant?.mrp || 0,
      image: item.variant?.variantImages?.[0] || "/placeholder-image.jpg",
      size: extractSizeFromVariant(item.variant?.name),
      color: extractColorFromVariant(item.variant?.name),
      variant: item.variant,
      product: item.product,
      grandTotal: apiData.data.grandTotal
    }));
  };

  // Helper function to extract size from variant name
  const extractSizeFromVariant = (variantName) => {
    if (!variantName) return "M";
    const sizeMatch = variantName.match(/\b(S|M|L|XL|XXL|XS)\b/i);
    return sizeMatch ? sizeMatch[0].toUpperCase() : "M";
  };

  // Helper function to extract color from variant name
  const extractColorFromVariant = (variantName) => {
    if (!variantName) return "Black";
    const colors = ["Black", "Blue", "Red", "Green", "White", "Gray", "Brown"];
    const foundColor = colors.find(color => 
      variantName.toLowerCase().includes(color.toLowerCase())
    );
    return foundColor || "Black";
  };

  const normalizeItems = (items) =>
    items.map((item, index) => ({
      ...item,
      quantity: Number(item.quantity || item.qty || 1),
      lineId:
        item.lineId ||
        `${item.productId || item.id || "line"}-${item.size || "M"}-${item.color || "Black"}-${index}`,
    }));

  // 🔹 React Query for API cart
  const fetchCart = async () => {
    const { data } = await api.get("/cart");
    console.log(data, "cart data from api");
    return data;
  };

  const { data: apiCart, refetch: refetchApiCart } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!user, // only fetch if logged in
  });

  // State for cart items - use API data if logged in, otherwise use local storage
  const [cartItems, setLocalCartItems] = useState(() => {
    if (user && apiCart) {
      return normalizeApiItems(apiCart);
    }
    return normalizeItems(getCartItems());
  });
console.log(cartItems, "cart items in state");
  // Update cart when API data changes
  useEffect(() => {
    if (user && apiCart) {
      const apiItems = normalizeApiItems(apiCart);
      setLocalCartItems(apiItems);
    }
  }, [user, apiCart]);

  // Sync local cart with storage changes
  useEffect(() => {
    const syncCart = () => {
      if (!user) {
        setLocalCartItems(normalizeItems(getCartItems()));
      }
    };
    
    if (isOpen) syncCart();
    window.addEventListener(CART_UPDATED_EVENT, syncCart);
    window.addEventListener("storage", syncCart);
    
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, [isOpen, user]);

  const updateItems = (updater) => {
    const updated = normalizeItems(
      typeof updater === "function" ? updater(getCartItems()) : updater,
    );
    setCartItems(updated);
    setLocalCartItems(updated);
  };

  const removeItem = (lineId) => {
    if (user) {
      // If logged in, call API to remove item
      const itemToRemove = cartItems.find(item => item.variantId === lineId);
      console.log(itemToRemove.variantId, 'item to remove');
      if (itemToRemove) {
        api.delete(`/cart/removecart/${itemToRemove.variantId}`).then(() => {
          refetchApiCart(); // Refresh cart from API

          setToast({ type: "success", message: "Item removed from cart" });
          setTimeout(() => setToast(null), 3000);
        }).catch(error => {
          console.error("Error removing item:", error);
          setToast({ type: "error", message: "Failed to remove item" });
          setTimeout(() => setToast(null), 3000);
        });
      }
    } else {
      updateItems((prev) => prev.filter((item) => item.variantId !== lineId));
      setToast({ type: "success", message: "Item removed from cart" });
    setTimeout(() => setToast(null), 3000);
    }
  };

 const increaseQty = (lineId) => {
    if (user) {
      const itemToUpdate = cartItems.find(item => item.variantId === lineId);
      if (itemToUpdate) {
        const newQuantity = Number(itemToUpdate.quantity || 1) + 1;
        api.put(`/cart/updateCart`, { variantId: itemToUpdate.variantId, quantity: newQuantity })
          .then(() => {
            refetchApiCart(); // Refresh cart from API
            // Clear toast after successful operation
            setTimeout(() => setToast(null), 3000);
          })
          .catch(error => {
            const message =
              error?.response?.data?.message ||
              error?.response?.data?.error ||
              error?.message ||
              "Failed to update quantity";
            // alert(message);
            setToast({ type: "error", message });
            // Auto-clear error toast after 3 seconds
            setTimeout(() => setToast(null), 3000);
          });
      }
    } else {
      updateItems((prev) =>
        prev.map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: Number(item.quantity || 1) + 1 }
            : item,
        ),
      );
    }
  };

  const decreaseQty = (lineId) => {
    if (user) {
      // If logged in, call API to update quantity
      const itemToUpdate = cartItems.find(item => item.variantId === lineId);
      if (itemToUpdate) {
        const newQuantity = Math.max(1, Number(itemToUpdate.quantity || 1) - 1);
        api.put(`/cart/updateCart`, { variantId: itemToUpdate.variantId, quantity: newQuantity })
          .then(() => {
            refetchApiCart(); // Refresh cart from API
          })
          .catch(error => {
            console.error("Error updating quantity:", error);
          });
      }
    } else {
      updateItems((prev) =>
        prev.map((item) =>
          item.variantId === lineId
            ? { ...item, quantity: Math.max(1, Number(item.quantity || 1) - 1) }
            : item,
        ),
      );
    }
  };

  const subtotal = useMemo(() => {
    if (user && apiCart?.data?.grandTotal) {
      return apiCart.data.grandTotal;
    }
    return cartItems.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Number(item.quantity || item.qty || 1),
      0,
    );
  }, [cartItems, user, apiCart]);

  const tax = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);
  const discount = subtotal > 4000 ? 250 : 0;
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const total = subtotal + tax - discount + shipping;

  if (!isOpen) return null;

  return (
    <>
 {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-99  px-6 py-3 rounded-full text-sm shadow-2xl flex items-center gap-2
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
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div
        className={`fixed left-0 right-0 top-0 z-50 bg-white shadow-2xl overflow-auto h-[calc(100vh-220px)] transform transition-all duration-500 ease-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={24} className="text-[#927f68]" />
              <h2 className="text-xl font-bold text-gray-900">Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 overflow-hidden">
          <div className={`grid grid-cols-1 ${cartItems.length > 0 ? 'lg:grid-cols-12' : ''} gap-8`}>
            {/* Items List */}
            <div className="lg:max-h-full lg:overflow-y-auto pr-0 lg:pr-4 col-span-8">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 lg:py-32">
                  <ShoppingBag
                    size={64}
                    className="mx-auto text-gray-300 mb-6"
                  />
                  <p className="text-gray-500 text-xl mb-6 font-medium">
                    Your cart is empty
                  </p>
                  <Link
                    to="/productlist"
                    onClick={onClose}
                    className="inline-block bg-[#927f68] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#7a6650] transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.lineId}
                      className="group bg-white/50 hover:bg-white p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 border-b border-[#cccc]"
                    >
                      <div className="flex items-start gap-4 lg:gap-6">
                        <div className="shrink-0">
                          <img
                            src={`https://lrd46c05-5000.inc1.devtunnels.ms${item.image}`}
                            className="w-20 h-24 lg:w-24 lg:h-28 rounded-2xl object-cover shadow-lg group-hover:scale-[1.02] transition-transform duration-200"
                            alt={item.name}

                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-base lg:text-lg leading-tight mb-2 lg:mb-3 line-clamp-2">
                            {item.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {item.size && (
                              <span className="px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-2xl text-xs lg:text-sm font-semibold text-gray-800 shadow-sm border border-gray-200/50">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-2xl text-xs lg:text-sm font-semibold text-gray-800 shadow-sm border border-gray-200/50">
                                {item.color}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => decreaseQty(item.variantId)}
                              className="w-11 h-11 rounded-2xl border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-[#927f68] transition-all duration-200 text-gray-700 hover:text-[#927f68] shadow-sm hover:shadow-md"
                            >
                              <Minus size={18} />
                            </button>
                            <span className="w-12 text-center font-bold text-lg text-gray-900 bg-white px-4 py-2 rounded-xl shadow-sm border">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQty(item.variantId)}
                              className="w-11 h-11 rounded-2xl border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-[#927f68] transition-all duration-200 text-gray-700 hover:text-[#927f68] shadow-sm hover:shadow-md"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                          <div className="font-bold text-xl lg:text-2xl text-gray-900 leading-none">
                            ₹
                            {(
                              Number(item.price) * Number(item.quantity)
                            ).toLocaleString()}
                          </div>
                          {item.mrp && item.mrp > item.price && (
                            <div className="text-sm text-gray-400 line-through">
                              ₹{item.mrp.toLocaleString()}
                            </div>
                          )}
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-sm lg:text-base text-red-500 hover:text-red-600 font-semibold hover:underline transition-colors opacity-0 group-hover:opacity-100 group-hover:translate-y-1 duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
              {cartItems.length > 0 && (
                   <div className="col-span-4 lg:sticky lg:top-4 lg:self-start bg-linear-to-b from-white/90 via-white/70 to-gray-50/80 backdrop-blur-xl border border-gray-100/50 rounded-3xl p-8 shadow-2xl lg:shadow-none lg:border-none">
              <h3 className="text-2xl lg:text-xl font-black text-gray-900 mb-8 tracking-tight">
                Order Summary
              </h3>

              <div className="space-y-4 mb-5">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-[14px] text-gray-700 font-semibold">
                    Subtotal
                  </span>
                  <span className="text-[13px] font-black text-gray-900">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-[14px] text-gray-700 font-semibold">
                    Tax (GST)
                  </span>
                  <span className="text-[13px] font-black text-gray-900">
                    ₹{tax.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between py-1 border-b border-gray-100 bg-green-50 rounded-2xl p-4 -mx-4">
                    <span className="text-[14px] font-semibold text-green-800">
                      Discount
                    </span>
                    <span className="text-[13px] font-black text-green-600">
                      -₹{discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-[14px] text-gray-700 font-semibold">
                    Shipping
                  </span>
                  <span className="text-[13px] font-black text-gray-900">
                    {shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[15px] font-black text-gray-900">
                    Total
                  </span>
                  <span className="text-[18px] lg:text-[15px] font-black bg-linear-to-r from-[#927f68] to-[#A68A6D] bg-clip-text text-transparent tracking-tight">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Estimated delivery by 25 Apr 2026
                </p>
              </div>
              
              {/* LOGIN MODAL */}
              <LoginModal
                isOpen={loginOpen}
                onClose={() => setLoginOpen(false)}
              />
              
              {/* CTA Button */}
              <button
                onClick={() => {
                  if (!cartItems.length) return;

                  if (!user) {
                    setLoginOpen(true);
                    localStorage.setItem("redirectAfterLogin", "/checkout");
                  } else {      
                    onClose();
                    navigate("/checkout");
                  }
                }}
                className={`block w-full text-center py-3 px-8 rounded-md text-base transition-all duration-300 ${
                  cartItems.length
                    ? "bg-linear-to-r from-[#927f68] to-[#A68A6D] text-white hover:-translate-y-0.5"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                {cartItems.length
                  ? "Proceed to Checkout →"
                  : "Proceed to Checkout"}
              </button>

              {/* Coupon Section */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Have a Coupon?
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-md text-base placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#927f68]/20 focus:border-[#927f68] transition-all duration-200 shadow-sm"
                  />
                  <button className="text-center py-3 px-8 rounded-md text-base transition-all duration-300 bg-[#927f68] hover:bg-[#7a6650] text-white font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 whitespace-nowrap">
                    Apply
                  </button>
                </div>
              </div>
            </div>
              )}
           
          </div>
        </div>
      </div>
    </>
  );
}