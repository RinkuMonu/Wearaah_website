import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../components/service/axios";

export const fetchBanner = createAsyncThunk(
  "banner/fetchBanner",
  async ({ position, deviceType,targetGender }, { rejectWithValue }) => {
    try {
      const response = await api.get("/banner", {
        params: { position, deviceType, targetGender },
      });
      return { position, data: response.data.banners };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  banners: {},
  status: {},
  loading: false,
  error: null,
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanner.fulfilled, (state, action) => {
        const { position, data } = action.payload;

        state.banners[position] = data;
        state.status[position] = "success";
      })
      .addCase(fetchBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bannerSlice.reducer;
