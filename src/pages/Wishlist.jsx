// Wishlist.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, ShoppingBag, Heart, Trash2, Loader, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  clearWishlistError, 
  fetchWishlist, 
  moveToCart, 
  removeFromWishlist, 
  selectWishlistError, 
  selectWishlistItems, 
  selectWishlistLoading 
} from '../features/Wishlist/wishlistSlice';
import { useAuth } from '../components/service/AuthContext';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useAuth();
  const wishlistItems = useSelector(selectWishlistItems);
  const isLoading = useSelector(selectWishlistLoading);
  const error = useSelector(selectWishlistError);
  
  // Track loading states for individual items
  const [removingItems, setRemovingItems] = useState({});
  const [movingItems, setMovingItems] = useState({});

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearWishlistError());
    }
  }, [error, dispatch]);

  const handleRemoveFromWishlist = async (wishlistId, variantId) => {
    // Set loading state for this specific item
    setRemovingItems(prev => ({ ...prev, [wishlistId]: true }));
    
    try {
      await dispatch(removeFromWishlist({ variantId })).unwrap();
      await dispatch(fetchWishlist()).unwrap(); 
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(err || 'Failed to remove from wishlist');
    } finally {
      // Clear loading state
      setRemovingItems(prev => ({ ...prev, [wishlistId]: false }));
    }
  };

  const handleMoveToCart = async (variantId, quantity = 1, wishlistId) => {
    // Set loading state for this specific item
    setMovingItems(prev => ({ ...prev, [wishlistId]: true }));
    
    try {
      await dispatch(moveToCart({ variantId, quantity })).unwrap();
      toast.success('Moved to cart successfully');
      // Optionally trigger cart update event
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (err) {
      toast.error(err || 'Failed to move to cart');
    } finally {
      // Clear loading state
      setMovingItems(prev => ({ ...prev, [wishlistId]: false }));
    }
  };

  // Toggle button component for better UX
  const ToggleRemoveButton = ({ wishlistId, variantId, isRemoving }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    
    if (showConfirm) {
      return (
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          <button
            onClick={() => handleRemoveFromWishlist(wishlistId, variantId)}
            disabled={isRemoving}
            className="bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors disabled:opacity-50"
            aria-label="Confirm remove"
          >
            {isRemoving ? <Loader size={14} className="animate-spin" /> : <Trash2 size={14} />}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="bg-gray-500 text-white rounded-full p-1.5 shadow-md hover:bg-gray-600 transition-colors"
            aria-label="Cancel"
          >
            <X size={14} />
          </button>
        </div>
      );
    }
    
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-red-50 hover:text-red-500 transition-all duration-200 z-10 group"
        aria-label="Remove from wishlist"
      >
        <X size={14} className="text-gray-600 group-hover:text-red-500 transition-colors" />
      </button>
    );
  };

  if (!user) {
    return (
      <section className="w-full bg-white py-16">
        <div className="max-w-md mx-auto px-6 text-center">
          <Heart size={44} strokeWidth={1.5} className="mx-auto text-neutral-300 mb-4" />
          <h2 className="text-xl font-normal uppercase tracking-wider mb-2">Login to view your wishlist</h2>
          <p className="text-neutral-500 text-xs mb-6">Save your favorite menswear pieces and access them across all your devices.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-black hover:bg-[#ED1C24] text-white px-8 py-3 text-xs font-medium uppercase tracking-[0.16em] transition-colors"
          >
            Sign In / Register
          </button>
        </div>
      </section>
    );
  }

  if (isLoading && wishlistItems.length === 0) {
    return (
      <section className="w-full bg-white py-16">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ED1C24] mx-auto" />
          <p className="text-neutral-500 text-xs tracking-wider uppercase mt-4">Loading your wishlist...</p>
        </div>
      </section>
    );
  }

  // Calculate discount if available
  const calculateDiscount = (mrp, price) => {
    if (!mrp || !price || mrp === price) return null;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  return (
    <section className="w-full bg-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-neutral-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-normal uppercase tracking-[0.14em] text-neutral-900">
              My Wishlist
            </h1>
            <p className="text-xs text-neutral-400 tracking-wider uppercase mt-1">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'ITEM' : 'ITEMS'} SAVED
            </p>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 border border-neutral-200 bg-neutral-50/50">
            <Heart size={48} strokeWidth={1.2} className="mx-auto text-neutral-300 mb-4" />
            <h3 className="text-base font-normal uppercase tracking-wider text-neutral-800">Your wishlist is empty</h3>
            <p className="text-neutral-500 text-xs mt-2 max-w-sm mx-auto">
              Explore our denim, shirts, and tailored collections to save your favorite styles.
            </p>
            <a
              href="/productlist"
              className="inline-block mt-6 px-8 py-3 bg-black hover:bg-[#ED1C24] text-white text-xs font-medium uppercase tracking-[0.16em] transition-colors"
            >
              Start Exploring
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {wishlistItems.map((item) => {
              const wishlistId = item._id;
              const variantId = item.variant?._id;
              const variantData = item.variant;
              const productData = item.product;
              const isOutOfStock = item.isOutOfStock;
              const discount = calculateDiscount(variantData?.mrp, variantData?.price);
              
              const getImageUrl = (imagePath) => {
                if (!imagePath) return '/images/placeholder.png';
                if (imagePath.startsWith('http') || imagePath.startsWith('/images/')) return imagePath;
                if (imagePath.startsWith('/uploads')) {
                  const BASE_URL = import.meta.env.VITE_BASE_URL || '';
                  return `${BASE_URL}${imagePath}`;
                }
                return imagePath;
              };

              const productImage = getImageUrl(variantData?.image || productData?.image || productData?.productImage?.[0]);
              const productName = variantData?.title || productData?.name || 'Wearaah Product';
              const productPrice = variantData?.price || productData?.price || 0;
              const productMrp = variantData?.mrp || productData?.mrp || productPrice;
              
              return (
                <div
                  key={wishlistId}
                  className="group relative flex flex-col bg-white border border-neutral-200 transition-all duration-300 hover:shadow-md"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(wishlistId, variantId)}
                    disabled={removingItems[wishlistId]}
                    className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/95 rounded-full flex items-center justify-center text-neutral-500 hover:text-black shadow-xs z-20 hover:scale-105 transition-all"
                    aria-label="Remove from wishlist"
                  >
                    {removingItems[wishlistId] ? (
                      <Loader size={12} className="animate-spin text-[#ED1C24]" />
                    ) : (
                      <X size={14} />
                    )}
                  </button>

                  {/* 3:4 Aspect Ratio Image */}
                  <div className="relative block w-full aspect-[3/4] overflow-hidden bg-neutral-100">
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.png";
                      }}
                    />
                    
                    {/* Badge */}
                    <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 bg-black text-white text-[10px] font-normal tracking-widest uppercase">
                          OUT OF STOCK
                        </span>
                      ) : discount ? (
                        <span className="px-2 py-0.5 bg-black text-white text-[10px] font-normal tracking-widest uppercase">
                          {discount}% OFF
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-3.5 flex flex-col flex-1">
                    <h3 className="text-[12px] sm:text-[13px] uppercase tracking-wide font-normal text-neutral-800 line-clamp-1 mb-1">
                      {productName}
                    </h3>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-[13px] sm:text-[14px] font-medium text-[#ED1C24]">
                        ₹{productPrice.toLocaleString('en-IN')}
                      </span>
                      {productMrp > productPrice && (
                        <span className="text-[11px] sm:text-xs text-neutral-400 line-through font-normal">
                          ₹{productMrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleMoveToCart(variantId, 1, wishlistId)}
                      disabled={movingItems[wishlistId] || isOutOfStock}
                      className={`w-full py-2.5 text-xs font-medium uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        isOutOfStock 
                          ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                          : 'bg-black hover:bg-[#ED1C24] text-white'
                      }`}
                    >
                      {movingItems[wishlistId] ? (
                        <>
                          <Loader size={13} className="animate-spin" />
                          <span>MOVING...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={13} />
                          <span>{isOutOfStock ? 'OUT OF STOCK' : 'MOVE TO BAG'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;