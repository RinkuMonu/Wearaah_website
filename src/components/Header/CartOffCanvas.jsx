import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import {
  CART_UPDATED_EVENT,
  getCartItems,
  setCartItems,
} from "../../utils/cartStorage";
import LoginModal from "./Login";
import { useAuth } from "../service/AuthContext";
import api from "../service/axios";
import { FiCheck } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  removeFromCart,
  incrementDecrementItemQuantity,
} from "../../features/Cart/cartSlice";

export default function CartOffCanvas({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { cartItems: reduxCartItems, status, grandTotal } = useSelector((state) => state.cart);
  const { loginOpen, setLoginOpen, user } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [localCartItems, setLocalCartItems] = useState([]);

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

  const resolveCartImageUrl = (img) => {
    if (!img) return "/images/placeholder.png";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads")) {
      const base = (import.meta.env.VITE_BASE_URL || "").replace(/\/api\/?$/, "").replace(/\/+$/, "");
      return `${base}${img}`;
    }
    return img.startsWith("/") ? img : `/${img}`;
  };

  // Helper function to get stock from item
  const getItemStock = (item) => {
    if (user && item.variant) {
      return item.variant.stock || 0;
    }
    // For guest users, you might want to store stock in localStorage or fetch it
    return item.stock || 999; // Default high number if not available
  };

  // Function to normalize items for guest users
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
      stock: item.stock || 999,
    }));
  };

  // Load guest cart from localStorage when not logged in
  useEffect(() => {
    if (!user && isOpen) {
      const savedCart = getCartItems();
      setLocalCartItems(normalizeGuestItems(savedCart));
    }
  }, [user, isOpen]);

  // Fetch cart items when user is logged in and cart is open
  useLayoutEffect(() => {
    if (user && isOpen) {
      dispatch(fetchCartItems());
    }
  }, [user, isOpen, dispatch]);

  // Sync local cart with storage changes for guest users
  useEffect(() => {
    const syncCart = () => {
      if (!user && isOpen) {
        const savedCart = getCartItems();
        setLocalCartItems(normalizeGuestItems(savedCart));
      }
    };

    if (isOpen && !user) syncCart();
    window.addEventListener(CART_UPDATED_EVENT, syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, [isOpen, user]);

  // Update guest cart in localStorage
  const updateGuestCart = (updatedItems) => {
    const itemsToStore = updatedItems.map(item => ({
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
      stock: item.stock,
    }));
    setCartItems(itemsToStore);
    setLocalCartItems(updatedItems);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  };

  const removeItem = (productId, variantId) => {
    if (user) {
      // For logged-in users, use Redux with variantId
      dispatch(removeFromCart({ productId: variantId }))
        .unwrap()
        .then(() => {
          setToast({ type: "success", message: "Item removed from cart" });
          setTimeout(() => setToast(null), 3000);
        })
        .catch((error) => {
          setToast({
            type: "error",
            message: error?.message || "Failed to remove item"
          });
          setTimeout(() => setToast(null), 3000);
        });
    } else {
      // For guest users, update localStorage
      const updatedItems = localCartItems.filter(item => item.variantId !== variantId);
      updateGuestCart(updatedItems);
      setToast({ type: "success", message: "Item removed from cart" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const increaseQty = (productId, variantId) => {
    if (user) {
      // For logged-in users, use Redux with variantId
      const currentItem = reduxCartItems.find(item => 
        item.variant?._id === variantId || item.variantId === variantId
      );
      
      const currentStock = currentItem?.variant?.stock || 0;
      const currentQuantity = currentItem?.quantity || 0;
      
      // Check if stock is available
      if (currentStock === 0) {
        setToast({
          type: "error",
          message: "This item is out of stock"
        });
        setTimeout(() => setToast(null), 3000);
        return;
      }
      
      // Check if adding one more would exceed available stock
      if (currentQuantity >= currentStock) {
        setToast({
          type: "error",
          message: `Only ${currentStock} item(s) available in stock`
        });
        setTimeout(() => setToast(null), 3000);
        return;
      }
      
      const newQuantity = currentQuantity + 1;
      
      dispatch(incrementDecrementItemQuantity({ 
        variantId: variantId,
        quantity: newQuantity
      }))
        .unwrap()
        .catch((error) => {
          setToast({
            type: "error",
            message: error?.message || "Failed to update quantity"
          });
          setTimeout(() => setToast(null), 3000);
        });
    } else {
      // For guest users, update localStorage
      const currentItem = localCartItems.find(item => item.variantId === variantId);
      const currentStock = currentItem?.stock || 999;
      const currentQuantity = currentItem?.quantity || 0;
      
      // Check if stock is available
      if (currentStock === 0) {
        setToast({
          type: "error",
          message: "This item is out of stock"
        });
        setTimeout(() => setToast(null), 3000);
        return;
      }
      
      // Check if adding one more would exceed available stock
      if (currentQuantity >= currentStock) {
        setToast({
          type: "error",
          message: `Only ${currentStock} item(s) available in stock`
        });
        setTimeout(() => setToast(null), 3000);
        return;
      }
      
      const updatedItems = localCartItems.map(item =>
        item.variantId === variantId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      updateGuestCart(updatedItems);
    }
  };

  const decreaseQty = (productId, variantId) => {
    if (user) {
      // For logged-in users, use Redux with variantId
      const currentItem = reduxCartItems.find(item => 
        item.variant?._id === variantId || item.variantId === variantId
      );
      const newQuantity = Math.max(1, (currentItem?.quantity || 0) - 1);
      
      dispatch(incrementDecrementItemQuantity({ 
        variantId: variantId,
        quantity: newQuantity
      }))
        .unwrap()
        .catch((error) => {
          setToast({
            type: "error",
            message: error?.message || "Failed to update quantity"
          });
          setTimeout(() => setToast(null), 3000);
        });
    } else {
      // For guest users, update localStorage
      const updatedItems = localCartItems.map(item =>
        item.variantId === variantId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      updateGuestCart(updatedItems);
    }
  };

  // Get current cart items based on user login status
  const currentCartItems = user ? reduxCartItems : localCartItems;
  const isLoading = user ? status === "loading" : false;

  // Calculate subtotal
  const subtotal = useMemo(() => {
    if (!currentCartItems || currentCartItems.length === 0) return 0;
    
    if (user && grandTotal) {
      return grandTotal;
    }
    
    return currentCartItems.reduce((sum, item) => {
      const price = item.variant?.sellingPrice || item.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
  }, [currentCartItems, user, grandTotal]);

  const tax = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);
  const discount = subtotal > 4000 ? 250 : 0;
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const total = subtotal + tax - discount + shipping;

  if (!isOpen) return null;

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
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div
        className={`fixed left-0 right-0 top-0 z-50 bg-white shadow-2xl overflow-auto h-[calc(100vh-220px)] transform transition-all duration-500 ease-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#ED1C24]" />
              <h2 className="text-base font-normal text-gray-900 uppercase tracking-widest">Shopping Bag</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 overflow-hidden">
          <div className={`grid grid-cols-1 ${currentCartItems?.length > 0 ? 'lg:grid-cols-12' : ''} gap-8`}>
            {/* Items List */}
            <div className="lg:max-h-full lg:overflow-y-auto pr-0 lg:pr-4 col-span-8">
              {isLoading && currentCartItems?.length === 0 ? (
                <div className="text-center py-20 lg:py-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED1C24] mx-auto"></div>
                  <p className="text-gray-500 mt-4 font-normal">Loading your shopping bag...</p>
                </div>
              ) : !currentCartItems || currentCartItems.length === 0 ? (
                <div className="text-center py-20 lg:py-32">
                  <ShoppingBag
                    size={48}
                    className="mx-auto text-gray-300 mb-4"
                  />
                  <p className="text-gray-900 text-lg mb-2 font-normal uppercase tracking-wider">
                    Your Shopping Bag is empty
                  </p>
                  <p className="text-gray-500 text-xs mb-6 max-w-xs mx-auto font-normal">
                    Explore our latest men's denim &amp; contemporary collections.
                  </p>
                  <Link
                    to="/productlist"
                    onClick={onClose}
                    className="inline-block bg-[#ED1C24] text-white px-7 py-3 font-normal text-xs uppercase tracking-[0.15em] hover:bg-black transition-all duration-200"
                  >
                    Start Shopping &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  {currentCartItems.map((item) => {
                    // For logged-in users: data comes from API with product and variant objects
                    // For guest users: data comes from localStorage with flat structure
                    const isLoggedInUser = user && item.variant;
                    
                    const productId = isLoggedInUser ? item.product?._id : item.productId;
                    const variantId = isLoggedInUser ? item.variant?._id : item.variantId;
                    const imageUrl = isLoggedInUser 
                      ? item.variant?.variantImages?.[0] 
                      : item.image;
                    const price = isLoggedInUser 
                      ? item.variant?.sellingPrice 
                      : item.price;
                    const mrp = isLoggedInUser 
                      ? item.variant?.mrp 
                      : item.mrp;
                    const name = isLoggedInUser 
                      ? item.product?.title 
                      : item.name;
                    const size = isLoggedInUser 
                      ? extractSizeFromVariant(item.variant?.name) 
                      : item.size;
                    const color = isLoggedInUser 
                      ? extractColorFromVariant(item.variant?.name) 
                      : item.color;
                    const stock = isLoggedInUser 
                      ? (item.variant?.stock || 0)
                      : (item.stock || 0);
                    const isOutOfStock = stock === 0;
                    const isMaxQuantityReached = item.quantity >= stock;
                    
                    return (
                      <div
                        key={item._id || item.lineId || variantId}
                        className={`group bg-white/50 hover:bg-white p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 border-b border-[#cccc] ${
                          isOutOfStock ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-start gap-4 lg:gap-6">
                          <div className="shrink-0">
                            <img
                              src={resolveCartImageUrl(imageUrl)}
                              onError={(e) => {
                                e.currentTarget.src = "/images/placeholder.png";
                              }}
                              className="w-20 h-24 lg:w-24 lg:h-28 rounded-2xl object-cover shadow-lg group-hover:scale-[1.02] transition-transform duration-200"
                              alt={name}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-base lg:text-lg leading-tight mb-2 lg:mb-3 line-clamp-2">
                              {name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                              {size && (
                                <span className="px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-2xl text-xs lg:text-sm font-semibold text-gray-800 shadow-sm border border-gray-200/50">
                                  Size: {size}
                                </span>
                              )}
                              {color && (
                                <span className="px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-2xl text-xs lg:text-sm font-semibold text-gray-800 shadow-sm border border-gray-200/50">
                                  {color}
                                </span>
                              )}
                              {isOutOfStock && (
                                <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-2xl text-xs lg:text-sm font-semibold">
                                  Out of Stock
                                </span>
                              )}
                              {!isOutOfStock && stock <= 5 && (
                                <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-2xl text-xs lg:text-sm font-semibold">
                                  Only {stock} left
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => decreaseQty(productId, variantId)}
                                disabled={isLoading || isOutOfStock}
                                className="w-10 h-10 border border-neutral-300 flex items-center justify-center hover:bg-black hover:text-white transition-all text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-10 text-center font-normal text-sm text-black">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => increaseQty(productId, variantId)}
                                disabled={isLoading || isOutOfStock || isMaxQuantityReached}
                                className="w-10 h-10 border border-neutral-300 flex items-center justify-center hover:bg-black hover:text-white transition-all text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                            <div className="font-normal text-lg lg:text-xl text-black leading-none">
                              ₹{(price * item.quantity).toLocaleString()}
                            </div>
                            {mrp > price && (
                              <div className="text-xs text-gray-400 line-through">
                                ₹{mrp.toLocaleString()}
                              </div>
                            )}
                            <button
                              onClick={() => removeItem(productId, variantId)}
                              disabled={isLoading}
                              className="text-xs text-red-500 hover:text-red-600 font-normal hover:underline transition-colors opacity-0 group-hover:opacity-100 group-hover:translate-y-1 duration-200 disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {currentCartItems?.length > 0 && (
              <div className="col-span-4 lg:sticky lg:top-4 lg:self-start bg-neutral-50 border border-neutral-200 p-6 shadow-sm">
                <h3 className="text-base font-normal uppercase tracking-wider text-gray-900 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-xs text-gray-600 font-normal">
                      Subtotal
                    </span>
                    <span className="text-xs font-normal text-gray-900">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-xs text-gray-600 font-normal">
                      Tax (GST)
                    </span>
                    <span className="text-xs font-normal text-gray-900">
                      ₹{tax.toLocaleString()}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between py-1 border-b border-gray-100 bg-green-50 rounded-md p-2 -mx-2">
                      <span className="text-xs font-normal text-green-800">
                        Discount
                      </span>
                      <span className="text-xs font-normal text-green-600">
                        -₹{discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-xs text-gray-600 font-normal">
                      Shipping
                    </span>
                    <span className="text-xs font-normal text-gray-900">
                      {shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-normal uppercase text-black tracking-wider">
                      Total
                    </span>
                    <span className="text-lg font-normal text-black">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-normal">
                    Inclusive of all taxes &amp; duties
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
                    if (!currentCartItems?.length) return;

                    // Check if any item is out of stock
                    const hasOutOfStock = currentCartItems.some(item => {
                      const stock = user ? (item.variant?.stock || 0) : (item.stock || 0);
                      return stock === 0;
                    });

                    if (hasOutOfStock) {
                      setToast({
                        type: "error",
                        message: "Some items in your cart are out of stock. Please remove them to proceed."
                      });
                      setTimeout(() => setToast(null), 3000);
                      return;
                    }

                    if (!user) {
                      setLoginOpen(true);
                      localStorage.setItem("redirectAfterLogin", "/checkout");
                    } else {
                      // Transform cart data for checkout
                      const checkoutCartData = currentCartItems.map((item, index) => {
                        const isLoggedInUser = user && item.variant;
                        
                        return {
                          id: item._id || item.lineId || index,
                          name: isLoggedInUser ? item.product?.title : item.name,
                          price: isLoggedInUser ? item.variant?.sellingPrice : item.price,
                          qty: item.quantity || 1,
                          image: isLoggedInUser 
                            ? item.variant?.variantImages?.[0] 
                            : item.image,
                          size: isLoggedInUser 
                            ? extractSizeFromVariant(item.variant?.name) 
                            : item.size,
                          color: isLoggedInUser 
                            ? extractColorFromVariant(item.variant?.name) 
                            : item.color,
                          variantId: isLoggedInUser ? item.variant?._id : item.variantId,
                          productId: isLoggedInUser ? item.product?._id : item.productId,
                          stock: isLoggedInUser ? (item.variant?.stock || 0) : (item.stock || 0)
                        };
                      });
                      
                      onClose();
                      navigate("/checkout", { state: { cartData: checkoutCartData } });
                    }
                  }}
                  disabled={isLoading || currentCartItems?.some(item => {
                    const stock = user ? (item.variant?.stock || 0) : (item.stock || 0);
                    return stock === 0;
                  })}
                  className={`block w-full text-center py-3.5 px-8 text-xs font-normal uppercase tracking-[0.16em] transition-all duration-300 ${
                    currentCartItems?.length && !isLoading && !currentCartItems?.some(item => {
                      const stock = user ? (item.variant?.stock || 0) : (item.stock || 0);
                      return stock === 0;
                    })
                      ? "bg-[#ED1C24] hover:bg-black text-white shadow-sm cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  {isLoading
                    ? "Loading..."
                    : currentCartItems?.some(item => {
                        const stock = user ? (item.variant?.stock || 0) : (item.stock || 0);
                        return stock === 0;
                      })
                    ? "Out of Stock Items in Cart"
                    : currentCartItems?.length
                    ? "Proceed to Checkout →"
                    : "Proceed to Checkout"}
                </button>

                {/* Coupon Section */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <label className="block text-xs font-normal uppercase tracking-wider text-black mb-3">
                    Have a Promo Code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2.5 border border-neutral-300 text-xs placeholder-gray-400 focus:outline-none focus:border-black transition-all"
                    />
                    <button className="text-center py-2.5 px-5 bg-black hover:bg-[#ED1C24] text-white text-xs font-normal uppercase tracking-wider transition-colors">
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