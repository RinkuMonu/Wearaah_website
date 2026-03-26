import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/Productlist/ProductSlice"; 
export const store = configureStore({
  reducer: {
    products: productReducer,
  },
});