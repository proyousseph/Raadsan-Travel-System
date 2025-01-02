import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productinformation: [],
  currentProductInfo: [],
  CartProducts: [],
  isOpen: false,
};

const productSlice = createSlice({
  name: "productinformation",
  initialState,
  reducers: {
    setproductInfo: (state, action) => {
      state.productinformation = action.payload;
    },
    setCurrentproductInfo: (state, action) => {
      state.currentProductInfo = action.payload;
    },
    setCartProductsInfo: (state, action) => {
      state.CartProducts.push(action.payload);
    },
    setCartProducts: (state, action) => {
      state.CartProducts = action.payload;
    },
    handleModal: (state) => {
      state.isOpen = !state.isOpen;
    },
    logoutP: (state) => {
      return initialState; // Reset state to initial values
    },
  },
});

export default productSlice.reducer;
export const {
  setproductInfo,
  setCurrentproductInfo,
  setCartProductsInfo,
  setCartProducts,
  handleModal,
  logoutP,
} = productSlice.actions;
