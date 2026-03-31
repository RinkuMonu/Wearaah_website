import { useEffect, useState, useCallback, useMemo, useLayoutEffect } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { CART_UPDATED_EVENT, getCartCount } from "../../utils/cartStorage";
import { useAuth } from "../service/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems } from "../../features/Cart/cartSlice";

export default function CartTrigger({ onOpen }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  
  // Redux state
  const { cartItems: reduxCartItems, status, grandTotal } = useSelector((state) => state.cart);
  console.log(reduxCartItems, "redux cart items in trigger");
  console.log("Cart count from Redux:", reduxCartItems?.length);
  
  const [cartCount, setCartCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoized count calculation - removed useCallback dependency issues
  const getCount = useCallback(() => {
    if (user) {
      return reduxCartItems?.length || 0;
    } else {
      return getCartCount();
    }
  }, [user, reduxCartItems]);

  // Initial fetch when user logs in or component mounts
  useLayoutEffect(() => {
    if (user && !isInitialized) {
      console.log("Fetching cart items for logged-in user");
      dispatch(fetchCartItems());
      setIsInitialized(true);
    } else if (!user && !isInitialized) {
      // For guest users, just set initial count
      setCartCount(getCartCount());
      setIsInitialized(true);
    }
  }, [user, dispatch, isInitialized]);

  // Update count when Redux cart changes - REMOVE the condition for immediate updates
  useEffect(() => {
    if (user) {
      const newCount = reduxCartItems?.length || 0;
      console.log("Redux cart changed, new count:", newCount);
      // Remove the condition to force update
      setCartCount(newCount);
    }
  }, [user, reduxCartItems]); // Remove cartCount from dependencies

  // Update count for guest users - also remove condition
  useEffect(() => {
    if (!user) {
      const newCount = getCartCount();
      console.log("Guest cart changed, new count:", newCount);
      setCartCount(newCount);
    }
  }, [user, getCartCount]); // Remove cartCount from dependencies

  // Listen for localStorage cart changes (guest only)
  useEffect(() => {
    if (user) return;

    const syncCount = () => {
      const newCount = getCartCount();
      console.log("Storage event triggered, new count:", newCount);
      setCartCount(newCount);
    };

    window.addEventListener(CART_UPDATED_EVENT, syncCount);
    window.addEventListener("storage", syncCount);
    
    // Also listen for custom events
    window.addEventListener("cart-item-added", syncCount);
    window.addEventListener("cart-item-removed", syncCount);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCount);
      window.removeEventListener("storage", syncCount);
      window.removeEventListener("cart-item-added", syncCount);
      window.removeEventListener("cart-item-removed", syncCount);
    };
  }, [user, getCartCount]);

  // Force update when Redux status changes (for when fetch completes)
  useEffect(() => {
    if (user && status === "succeeded") {
      const newCount = reduxCartItems?.length || 0;
      console.log("Redux fetch completed, updating count to:", newCount);
      setCartCount(newCount);
    }
  }, [user, status, reduxCartItems]);

  // Display count with max limit
  const displayCount = useMemo(() => {
    if (cartCount === 0) return null;
    return cartCount > 99 ? '99+' : cartCount;
  }, [cartCount]);

  return (
    <button
      onClick={onOpen}
      className="flex flex-col items-center relative focus:outline-none cursor-pointer group"
      aria-label="Shopping cart"
    >
      <FiShoppingBag 
        size={18} 
        className="group-hover:scale-110 transition-transform duration-200" 
      />

      {displayCount && (
        <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] leading-4 animate-pulse">
          {displayCount}
        </span>
      )}

      <span className="hidden sm:block lg:inline text-xs font-medium mt-0.5">
        Basket
      </span>
    </button>
  );
}