import { useEffect, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { CART_UPDATED_EVENT, getCartCount } from "../../utils/cartStorage";
import api from "../service/axios";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../service/AuthContext";

export default function CartTrigger({ onOpen }) {
  const { user } = useAuth();

  const [cartCount, setCartCount] = useState(0);

  // 🔹 API Call
  const fetchCart = async () => {
    const { data } = await api.get("/cart");
    return data;
  };

  // 🔹 React Query (only when logged in)
  const { data: apiCart } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!user,
  });

  // 🔹 Sync Count
  useEffect(() => {
    if (user) {
      // ✅ Logged-in → API count
      const apiCount = apiCart?.data?.items?.length || 0;
      setCartCount(apiCount);
    } else {
      // ✅ Guest → Local storage count
      setCartCount(getCartCount());
    }
  }, [user, apiCart]);

  // 🔹 Listen for local cart changes (guest only)
  useEffect(() => {
    if (user) return; // ❌ skip for logged-in

    const syncCount = () => setCartCount(getCartCount());

    window.addEventListener(CART_UPDATED_EVENT, syncCount);
    window.addEventListener("storage", syncCount);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCount);
      window.removeEventListener("storage", syncCount);
    };
  }, [user]);

  return (
    <button
      onClick={onOpen}
      className="flex flex-col items-center relative focus:outline-none cursor-pointer"
    >
      <FiShoppingBag size={18} className="group-hover:scale-110 transition-transform" />

      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] leading-4">
          {cartCount}
        </span>
      )}

      <span className="hidden sm:block lg:inline">Basket</span>
    </button>
  );
}