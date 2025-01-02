import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../feature/userSlice";
import productSlice from "../feature/productSlice";

const store = configureStore({
  reducer: {
    userReducer: userSlice,
    productReducer:productSlice,
  },
});

export default store;
