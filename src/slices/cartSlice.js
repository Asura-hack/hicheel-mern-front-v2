import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';
import { apiSlice } from './apiSlice';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveCart: builder.mutation({
      query: (cartItems) => ({
        url: '/api/cart',
        method: 'PUT',
        body: { cartItems },
      }),
    }),
    getCart: builder.query({
      query: () => '/api/cart',
    }),
  }),
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    resetCart: (state) => {
      state.cartItems = [];  // Clear cart items
      state.shippingAddress = {};
      state.paymentMethod = 'PayPal';
      localStorage.setItem('cart', JSON.stringify(state));
    },
    setCart: (state, action) => {
      state.cartItems = action.payload;
      return updateCart(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
  setCart,
} = cartSlice.actions;

export const { useSaveCartMutation, useGetCartQuery } = cartApiSlice;

export default cartSlice.reducer;