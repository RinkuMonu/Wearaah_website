// utils/cartSync.js

import api from "../components/service/axios";

// import api from "../components/service/axios";

// Use the same cart key that you use in cartStorage.js
const CART_STORAGE_KEY = "lionies_cart_v1";

export const syncLocalCartToAPI = async () => {
    
  try {
    // Get local cart items
    const localCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    
    if (!localCart || localCart.length === 0) {
      console.log("No local cart items to sync");
      return { success: true, synced: 0 };
    }

    console.log(`Syncing ${localCart.length} items from localStorage to API`);

    let syncedCount = 0;
    let failedItems = [];
    let errorMessages = [];

    // Sync each item to API
    for (const item of localCart) {
      try {
        const cartItemData = {
          variantId: item.variantId,
          quantity: item.quantity,
        };

        const response = await api.post("/cart/add", cartItemData);
        
        if (response.data?.success) {
          syncedCount++;
          console.log(`✓ Synced item: ${item.name || item.variantId} (Qty: ${item.quantity})`);
        } else {
          failedItems.push(item);
          errorMessages.push(`Failed to sync ${item.name}: ${response.data?.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error(`✗ Failed to sync item ${item.variantId}:`, error);
        failedItems.push(item);
        errorMessages.push(`Error syncing ${item.name}: ${error.response?.data?.message || error.message}`);
      }
    }

    // Clear localStorage cart after successful sync (only if at least one item synced)
    if (syncedCount > 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
      console.log(`✓ Cleared localStorage cart after syncing ${syncedCount} items`);
      
      // Dispatch event to update cart trigger
      window.dispatchEvent(new Event("cartUpdated"));
    } else if (failedItems.length > 0) {
      console.warn(`⚠ Failed to sync ${failedItems.length} items, keeping them in localStorage`);
    }

    return {
      success: syncedCount > 0 || failedItems.length === 0,
      synced: syncedCount,
      failed: failedItems.length,
      failedItems: failedItems,
      errors: errorMessages
    };

  } catch (error) {
    console.error("Error syncing cart:", error);
    return {
      success: false,
      error: error.message,
      synced: 0,
      failed: 0
    };
  }
};

// Optional: Function to merge carts instead of replacing
export const mergeLocalCartWithAPI = async () => {
  try {
    const localCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    
    if (!localCart || localCart.length === 0) {
      return { success: true, merged: 0 };
    }

    console.log(`Merging ${localCart.length} items from localStorage with API cart`);

    let mergedCount = 0;
    let updatedCount = 0;

    for (const item of localCart) {
      try {
        // First check if item already exists in API cart
        const cartResponse = await api.get("/cart");
        const existingItem = cartResponse.data?.data?.items?.find(
          apiItem => apiItem.variantId?._id === item.variantId
        );

        if (existingItem) {
          // Update quantity if item exists
          const newQuantity = existingItem.quantity + item.quantity;
          await api.put(`/cart/updateCart`, {
            variantId: item.variantId,
            quantity: newQuantity
          });
          updatedCount++;
          console.log(`✓ Updated existing item: ${item.name} (${existingItem.quantity} → ${newQuantity})`);
        } else {
          // Add new item if doesn't exist
          await api.post("/cart/add", {
            variantId: item.variantId,
            quantity: item.quantity
          });
          mergedCount++;
          console.log(`✓ Added new item: ${item.name} (Qty: ${item.quantity})`);
        }
      } catch (error) {
        console.error(`Failed to merge item ${item.variantId}:`, error);
      }
    }

    // Clear localStorage after successful merge
    if (mergedCount > 0 || updatedCount > 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new Event("cartUpdated"));
    }

    return {
      success: true,
      merged: mergedCount,
      updated: updatedCount
    };

  } catch (error) {
    console.error("Error merging carts:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to get cart count from localStorage (for guest users)
export const getLocalCartCount = () => {
  try {
    const localCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return localCart.reduce((total, item) => total + (item.quantity || 1), 0);
  } catch (error) {
    console.error("Error getting cart count:", error);
    return 0;
  }
};

// Function to check if localStorage has cart items
export const hasLocalCartItems = () => {
  try {
    const localCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return localCart.length > 0;
  } catch (error) {
    return false;
  }
};