import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../components/service/axios";

export const fatchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/brand/web`);      
      return response.data.brands;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  brands: [],
  status: "idle",
  error: null,
};

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fatchBrands.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fatchBrands.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.brands = action.payload;
      })
      .addCase(fatchBrands.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default brandSlice.reducer;
