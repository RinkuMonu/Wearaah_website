import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../components/service/axios';

// Async Thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wishlist');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ variantId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/wishlist', { variantId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async ({ variantId }, { rejectWithValue }) => {
    try {
      const response = await api.post("/wishlist",{variantId});
      return { variantId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

export const moveToCart = createAsyncThunk(
  'wishlist/moveToCart',
  async ({ variantId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/wishlist/move-to-cart', { variantId, quantity });
      // After moving to cart, refresh cart and wishlist
      return { variantId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to move to cart');
    }
  }
);

// Initial State
const initialState = {
  items: [],
  isLoading: false,
  error: null,
  totalItems: 0,
  lastFetched: null,
};

// Slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
    resetWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.error = null;
      state.lastFetched = null;
    },
    // Optimistic update for UI (optional)
    optimisticRemoveFromWishlist: (state, action) => {
      const variantId = action.payload;
      state.items = state.items.filter(item => item.variantId !== variantId);
      state.totalItems = state.items.length;
    },
    optimisticAddToWishlist: (state, action) => {
      const newItem = action.payload;
      if (!state.items.find(item => item.variantId === newItem.variantId)) {
        state.items.unshift(newItem);
        state.totalItems = state.items.length;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.wishlist || action.payload.items || [];
        state.totalItems = state.items.length;
        state.lastFetched = Date.now();
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const newItem = action.payload.item || action.payload.wishlistItem;
        if (newItem && !state.items.find(item => item.variantId === newItem.variantId)) {
          state.items.unshift(newItem);
          state.totalItems = state.items.length;
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const { variantId } = action.payload;
        state.items = state.items.filter(item => item.variantId !== variantId);
        state.totalItems = state.items.length;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Move to Cart
      .addCase(moveToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(moveToCart.fulfilled, (state, action) => {
        const { variantId } = action.payload;
        state.items = state.items.filter(item => item.variantId !== variantId);
        state.totalItems = state.items.length;
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { 
  clearWishlistError, 
  resetWishlist, 
  optimisticRemoveFromWishlist,
  optimisticAddToWishlist 
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistLoading = (state) => state.wishlist.isLoading;
export const selectWishlistError = (state) => state.wishlist.error;
export const selectWishlistTotalItems = (state) => state.wishlist.totalItems;
export const selectIsInWishlist = (variantId) => (state) => 
  state.wishlist.items.some(item => item.variantId === variantId);

export default wishlistSlice.reducer;