import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/Productlist/ProductSlice"; 
import categorySlice from "./features/Category/categorySlice"; 
export const store = configureStore({
  reducer: {
    products: productReducer,
    category: categorySlice,
  },
});