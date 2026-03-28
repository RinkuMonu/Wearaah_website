import { useEffect, useState, useCallback, useMemo } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { CART_UPDATED_EVENT, getCartCount } from "../../utils/cartStorage";
import { useAuth } from "../service/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems } from "../../features/Cart/cartSlice";

export default function CartTrigger({ onOpen }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  
  // Redux state
  const { cartItems: reduxCartItems, status } = useSelector((state) => state.cart);
  
  const [cartCount, setCartCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoized count calculation
  const getCount = useCallback(() => {
    if (user) {
      return reduxCartItems?.length || 0;
    } else {
      return getCartCount();
    }
  }, [user, reduxCartItems]);

  // Initial fetch when user logs in
  useEffect(() => {
    if (user && !isInitialized) {
      dispatch(fetchCartItems());
      setIsInitialized(true);
    }
  }, [user, dispatch, isInitialized]);

  // Update count when Redux cart changes
  useEffect(() => {
    if (user) {
      const newCount = reduxCartItems?.length || 0;
      if (cartCount !== newCount) {
        setCartCount(newCount);
      }
    }
  }, [user, reduxCartItems, cartCount]);

  // Update count for guest users
  useEffect(() => {
    if (!user) {
      const newCount = getCartCount();
      if (cartCount !== newCount) {
        setCartCount(newCount);
      }
    }
  }, [user, cartCount]);

  // Listen for localStorage cart changes (guest only)
  useEffect(() => {
    if (user) return;

    const syncCount = () => {
      const newCount = getCartCount();
      setCartCount(newCount);
    };

    window.addEventListener(CART_UPDATED_EVENT, syncCount);
    window.addEventListener("storage", syncCount);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCount);
      window.removeEventListener("storage", syncCount);
    };
  }, [user]);

  // Optional: Poll for cart updates every few seconds (for real-time sync)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const currentCount = reduxCartItems?.length || 0;
      if (cartCount !== currentCount) {
        setCartCount(currentCount);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [user, reduxCartItems, cartCount]);

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