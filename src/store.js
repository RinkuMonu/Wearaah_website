import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/Productlist/ProductSlice"; 
import cartReducer from "./features/Cart/cartSlice";
export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
  },
});