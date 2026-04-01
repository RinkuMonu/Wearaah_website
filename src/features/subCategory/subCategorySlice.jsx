import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../components/service/axios";
import { sub } from "framer-motion/client";

export const fatchSubCategoryByCategoryId = createAsyncThunk(
  "subcategory/fetchSubCategoriesByCategoryId",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subcategory/by-category/${categoryId}`);
      return response.data.subcategories;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
export const fatchSubCategory = createAsyncThunk(
  "subcategory/fetchSubCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subcategory`);
      console.log(response);
      
      return response.data.categories;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  subcategoriesById: [],
  subcategories: [],
  dynamicFilters: {},
  status: "idle",
  error: null,
};

const subCategorySlice = createSlice({
  name: "subcategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch by categoryId
      .addCase(fatchSubCategoryByCategoryId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fatchSubCategoryByCategoryId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subcategoriesById = action.payload;

        const data = action.payload;
        const attrs = data?.[0]?.attributes || {};
        const formatted = {};

        Object.entries(attrs).forEach(([key, val]) => {
          if (val.filterable) {
            formatted[key] = val.values;
          }
        });

        state.dynamicFilters = formatted;
      })
      .addCase(fatchSubCategoryByCategoryId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // 🔹 Fetch all
      .addCase(fatchSubCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fatchSubCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subcategories = action.payload;
      })
      .addCase(fatchSubCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});
export default subCategorySlice.reducer;
