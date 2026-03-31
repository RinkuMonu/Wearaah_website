import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/Productlist/ProductSlice"; 
import categorySlice from "./features/Category/categorySlice"; 
import cartReducer from "./features/Cart/cartSlice"; 
export const store = configureStore({
  reducer: {
    products: productReducer,
    category: categorySlice,
    cart: cartReducer,
  },
}); 