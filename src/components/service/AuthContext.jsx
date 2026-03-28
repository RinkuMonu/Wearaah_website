import { createContext, useContext, useEffect, useState } from "react";
import api from "./axios";
import { useDispatch } from "react-redux";
import { syncLocalCartToAPI } from "../../utils/cartSync";
import { fetchCartItems } from "../../features/Cart/cartSlice";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, settoken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [pareantcategory, setPareantcategory] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
   const dispatch = useDispatch();
  useEffect(() => {
    const handleForceLogout = () => {
      setLoginOpen(true);
    };

    window.addEventListener("force-logout", handleForceLogout);

    return () => {
      window.removeEventListener("force-logout", handleForceLogout);
    };
  }, []);

  useEffect(() => {
    if (token) {
      syncLocalCartToAPI(token);
    }
  }, [token]);
    // Function to sync cart after login
  const syncCartAfterLogin = async () => {
    try {
      setIsSyncing(true);
      
      // Check if there are items in localStorage
      const localCart = JSON.parse(localStorage.getItem("lionies_cart_v1") || "[]");
      
      if (localCart.length > 0) {
        console.log(`Found ${localCart.length} items in local cart, syncing to API...`);
        
        // Sync local cart to API
        const syncResult = await syncLocalCartToAPI();
        
        if (syncResult.success && syncResult.synced > 0) {
          console.log(`Successfully synced ${syncResult.synced} items to cart`);
          
          // Dispatch event to notify other components
          window.dispatchEvent(new Event("cart-synced"));
          
          // Fetch fresh cart from API
          await dispatch(fetchCartItems());
        } else if (syncResult.failed > 0) {
          console.warn(`Failed to sync ${syncResult.failed} items`);
        }
      } else {
        console.log("No local cart items to sync");
        // Still fetch cart from API
        await dispatch(fetchCartItems());
      }
    } catch (error) {
      console.error("Error syncing cart after login:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const handleForceLogout = () => {
      setLoginOpen(true);
    };

    window.addEventListener("force-logout", handleForceLogout);

    return () => {
      window.removeEventListener("force-logout", handleForceLogout);
    };
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      settoken(token);
      return;
    }
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        console.log("res form auth profile", res);

        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);
  useEffect(() => {
    const parentCate = async () => {
      try {
        const ress = await api.get("/category");
        if (ress.data.success) {
          setPareantcategory(ress?.data?.categories);
        }
      } catch (err) {
        setPareantcategory(null);
      }
    };

    parentCate();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        loginOpen,
        setLoginOpen,
        pareantcategory,
        settoken,
        syncCartAfterLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
