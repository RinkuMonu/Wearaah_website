import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../components/service/axios";

// 1️⃣ Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  "category",
  async () => {
    const response = await api.get("category");    
    return response.data;
  }
);

// 2️⃣ Initial state
const initialState = {
  categories: [],
  loading: false,
  error: null,
};

// 3️⃣ Slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload; 
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;