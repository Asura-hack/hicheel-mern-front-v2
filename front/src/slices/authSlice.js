import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      // Cart will be loaded automatically through the CartScreen useEffect
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      // Don't remove cart from localStorage
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
