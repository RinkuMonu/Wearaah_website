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
      <section className="w-full bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Login to view your wishlist</h2>
          <p className="text-gray-500 mb-4">Save your favorite items and never lose them</p>
          <button className="bg-[#e4a156] text-white px-6 py-2 rounded-full hover:bg-[#d4854a] transition-colors">
            Login / Sign Up
          </button>
        </div>
      </section>
    );
  }

  if (isLoading && wishlistItems.length === 0) {
    return (
      <section className="w-full bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4a156] mx-auto" />
          <p className="text-gray-500 mt-4">Loading your wishlist...</p>
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
    <section className="w-full bg-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold">
            My Wishlist{" "}
            <span className="text-gray-500">
              ({wishlistItems.length} items)
            </span>
          </h1>
          
          {/* Optional: Clear all button */}
          {/* {wishlistItems.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Remove all items from wishlist?')) {
                  wishlistItems.forEach(item => {
                    handleRemoveFromWishlist(item._id, item.variant?._id);
                  });
                }
              }}
              className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          )} */}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
            <p className="text-gray-400 text-sm mt-2">
              Start adding items you love to your wishlist!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const wishlistId = item._id;
              const variantId = item.variant?._id;
              const variantData = item.variant;
              const productData = item.product;
              const isOutOfStock = item.isOutOfStock;
              const discount = calculateDiscount(variantData?.mrp, variantData?.price);
              
              // Get image URL (handle both absolute and relative paths)
              const getImageUrl = (imagePath) => {
                if (!imagePath) return '/api/placeholder/400/400';
                if (imagePath.startsWith('http')) return imagePath;
                if (imagePath.startsWith('/uploads')) {
                  const BASE_URL = import.meta.env.VITE_BASE_URL || '';
                  return `${BASE_URL}${imagePath}`;
                }
                return imagePath;
              };

              const productImage = getImageUrl(variantData?.image || productData?.image);
              const productName = variantData?.title || productData?.name || 'Product';
              const productPrice = variantData?.price || 0;
              const productMrp = variantData?.mrp || productPrice;
              
              return (
                <div
                  key={wishlistId}
                  className="border border-gray-200 rounded-lg overflow-hidden relative shadow-sm hover:shadow-md transition-all duration-300 bg-white group"
                >
                  {/* Toggle Remove Button with confirmation */}
                  <ToggleRemoveButton 
                    wishlistId={wishlistId}
                    variantId={variantId}
                    isRemoving={removingItems[wishlistId]} 
                  />

                  <div className="relative overflow-hidden bg-gray-100 cursor-pointer" style={{ aspectRatio: '1/1' }}>
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      
                    />
                    
                    {discount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {discount}% OFF
                      </div>
                    )}
                    
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <AlertCircle size={14} className="text-red-500" />
                          <span className="text-xs font-bold text-red-600">OUT OF STOCK</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Hover overlay with quick actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleMoveToCart(variantId, 1, wishlistId)}
                        disabled={movingItems[wishlistId] || isOutOfStock}
                        className="bg-white text-gray-800 p-2 rounded-full hover:bg-[#e4a156] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Move to cart"
                      >
                        {movingItems[wishlistId] ? (
                          <Loader size={16} className="animate-spin" />
                        ) : (
                          <ShoppingBag size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(wishlistId, variantId)}
                        disabled={removingItems[wishlistId]}
                        className="bg-white text-gray-800 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                        aria-label="Remove"
                      >
                        {removingItems[wishlistId] ? (
                          <Loader size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="text-sm font-semibold leading-snug line-clamp-2 mb-1">
                      {productName}
                    </h2>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[#e4a156] text-sm font-bold">
                          ₹{productPrice.toLocaleString('en-IN')}
                        </span>
                        {productMrp > productPrice && (
                          <span className="text-gray-400 line-through text-xs">
                            ₹{productMrp.toLocaleString('en-IN')}
                          </span>
                        )}
                        {discount && (
                          <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded">
                            {discount}% off
                          </span>
                        )}
                      </div>
                      
                      {isOutOfStock && (
                        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                          <AlertCircle size={12} />
                          Out of stock
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleMoveToCart(variantId, 1, wishlistId)}
                      disabled={movingItems[wishlistId] || isOutOfStock}
                      className={`w-full py-2.5 text-sm font-semibold border-t border-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isOutOfStock 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-[#633426] hover:text-[#e4a156]'
                      }`}
                    >
                      {movingItems[wishlistId] ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          MOVING...
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          {isOutOfStock ? 'OUT OF STOCK' : 'MOVE TO CART'}
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