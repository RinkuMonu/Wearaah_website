// features/Cart/cartSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../components/service/axios";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (item, { dispatch, rejectWithValue }) => {
    console.log(item, "item from cart");
    try {
      const response = await api.post("/cart/add", item);
      console.log(response.data, "from redux toolkit data");
      dispatch(fetchCartItems());
      return response.data;
    } catch (error) {
      console.log(error, "error toolkit data");
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart");
      console.log(response.data, "Fetch Item form redux toolkit");
      // Return the full response data which contains items and grandTotal
      return response.data;
    } catch (error) {
      console.log(error, "error toolkit data");
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId }, { dispatch, rejectWithValue }) => {
    console.log(productId, "productId from redux toolkit ");
    try {
      // Using the endpoint from your existing code: /cart/removecart/${variantId}
      const response = await api.delete(`/cart/removecart/${productId}`);
      console.log(response.data, "delete from reduxtoolkit");
      dispatch(fetchCartItems());
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const removeAllCart = createAsyncThunk(
  "cart/removeAllCart",
  async (id, { rejectWithValue }) => {
    console.log(id, "item id from cart");
    try {
      const response = await api.delete(`/cart/deleteCart/${id}`);
      console.log(response.data, "delete from reduxtoolkit");
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const incrementDecrementItemQuantity = createAsyncThunk(
  "cart/incrementDecrementItemQuantity",
  async ({ productId, action }, { dispatch, rejectWithValue }) => {
    try {
      // Using the endpoint from your existing code: /cart/updateCart
      // Calculate new quantity based on action
      let newQuantity;
      if (action === 'increment') {
        newQuantity = { increment: 1 };
      } else if (action === 'decrement') {
        newQuantity = { decrement: 1 };
      } else {
        newQuantity = { quantity: action };
      }
      
      const response = await api.put(`/cart/updateCart`, { 
        variantId: productId, 
        ...newQuantity 
      });
      console.log(response.data, "update from redux toolkit");
      dispatch(fetchCartItems());
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  error: null,
  cartItems: [],
  grandTotal: 0,
  status: "idle",
  addToCartStatus: "idle",
  addToCartError: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.grandTotal = 0;
    },
    resetAddToCartStatus: (state) => {
      state.addToCartStatus = "idle";
      state.addToCartError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to cart cases
      .addCase(addToCart.pending, (state) => {
        state.addToCartStatus = "loading";
        state.addToCartError = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.addToCartStatus = "succeeded";
        state.addToCartError = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addToCartStatus = "failed";
        state.addToCartError = action.payload?.message || "Failed to add to cart";
      })
      
      // Fetch cart items cases
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Extract items and grandTotal from the response
        state.cartItems = action.payload?.data?.items || action.payload?.items || [];
        state.grandTotal = action.payload?.data?.grandTotal || action.payload?.grandTotal || 0;
        state.error = null;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch cart";
        state.cartItems = [];
        state.grandTotal = 0;
      })
      
      // Remove from cart cases
      .addCase(removeFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.status = "succeeded";
        // Cart items will be updated by fetchCartItems
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to remove item";
      })
      
      // Increment/decrement quantity
      .addCase(incrementDecrementItemQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(incrementDecrementItemQuantity.fulfilled, (state) => {
        state.status = "succeeded";
        // Cart items will be updated by fetchCartItems
        state.error = null;
      })
      .addCase(incrementDecrementItemQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update quantity";
      })
      
      // Remove all cart items
      .addCase(removeAllCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeAllCart.fulfilled, (state) => {
        state.status = "succeeded";
        state.cartItems = [];
        state.grandTotal = 0;
        state.error = null;
      })
      .addCase(removeAllCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to clear cart";
      });
  },
});

export const { clearCart, resetAddToCartStatus } = cartSlice.actions;
export default cartSlice.reducer;