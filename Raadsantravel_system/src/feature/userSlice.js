import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userloginfo: [],
  userinformation: [],
  currentuserinformation: [],
  categoryinformation: [],
  bankaccountinformation: [],
  isOpen: false,
};

const userSlice = createSlice({
  name: "userinformation",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userinformation = action.payload;
    },
    setCurrentUserInfo: (state, action) => {
      state.currentuserinformation = action.payload;
    },
    setUserLogInfo: (state, action) => {
      state.userloginfo = action.payload;
    },

    setCategoryInfo: (state, action) => {
      state.categoryinformation = action.payload;
    },
    setBankAccountInfo: (state, action) => {
      state.bankaccountinformation = action.payload;
    },
    handleModal: (state) => {
      state.isOpen = !state.isOpen;
    },
    logout: (state) => {
      return initialState; // Reset state to initial values
    },
  },
});

export default userSlice.reducer;
export const {
  setUserInfo,
  setCurrentUserInfo,
  setUserLogInfo,
  handleModal,
  setCategoryInfo,
  logout,
  setBankAccountInfo,
} = userSlice.actions;
