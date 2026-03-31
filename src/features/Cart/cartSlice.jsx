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
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    try {
      const response = await api.get("/cart/get");
      console.log(response.data, "Fetch Item form redux toolkit");
      return response.data;
    } catch (error) {
      console.log(error, "error toolkit data");
      return error;
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",

  async ({productId}, { dispatch, rejectWithValue }) => {
    console.log(productId, 'item id from redux toolkit ')
    try {
      const response = await api.post(`/cart/delete`,{productId});
   

      console.log(response.data, "delete from reduxtoolkit");
      dispatch(fetchCartItems());
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
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
      return rejectWithValue(error.response.data);
    }
  }
);

export const incrementDecrementItemQuantity = createAsyncThunk(
  "cart/incrementDecrementItemQuantity",
  async ({ productId, action }, { dispatch, rejectWithValue }) => {
    // console.log(itemId, "item action from slice");
    try {
      const response = await api.put("/cart/updateItemQuantity", {
        productId,
        action,
      });
      console.log(response.data, "update from redux toolkit");

      dispatch(fetchCartItems());
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  error: null,
  cartItems: [],
  status: "idle",
  // couponCode: null,
};

console.log(initialState.cartItems, "cart Items");

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const existingItem = state.cartItems.find(
          (item) => item._id === action.payload._id
        );
        if (!existingItem) {
          state.cartItems?.push(action.payload);
        }
        // state.cartItems.push(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.cartItems = action.payload;
        // state.couponCode = action.payload.couponCode || null;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.error = "Coupon code is not valid";
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        console.log(state, "statet from reject case");
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        console.log(state, "statelog");
        state.cartItems = state.cartItems?.filter(
          (item) => item?.productId?._id !== action.payload._id

              
        );
      })
      .addCase(incrementDecrementItemQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(removeAllCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = [];
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;