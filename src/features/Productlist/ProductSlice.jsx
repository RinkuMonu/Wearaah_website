import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../components/service/axios";

// ✅ GET PRODUCT LIST
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/product/web", { params });
      console.log(response.data, "products from redux toolkit");
      return response.data.products;
    } catch (error) {
      console.log(error, "error fetching products");
      return rejectWithValue(error.response?.data);
    }
  },
);

// (Optional) ✅ GET SINGLE PRODUCT
export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/product/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

const initialState = {
  products: [],
  selectedProduct: null,
  status: "idle",
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 🔹 FETCH ALL PRODUCTS
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // 🔹 FETCH SINGLE PRODUCT
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;

export default productSlice.reducer;
