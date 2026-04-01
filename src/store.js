import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/Productlist/ProductSlice";
import categorySlice from "./features/Category/categorySlice";
import cartReducer from "./features/Cart/cartSlice";
import subCategorySlice from "./features/subCategory/subCategorySlice";
import brandSlice from "./features/Brands/brandSlice";
export const store = configureStore({
  reducer: {
    products: productReducer,
    category: categorySlice,
    subCategory: subCategorySlice,
    brands: brandSlice,
    cart: cartReducer,
  },
});
