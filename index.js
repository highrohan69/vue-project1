import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cart: [],
  },
  mutations: {
    SET_CART(state, cart) {
      state.cart = cart;
    },
    ADD_TO_CART(state, item) {
      const existingItem = state.cart.find(i => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cart.push(item);
      }
    },
    REMOVE_FROM_CART(state, productId) {
      state.cart = state.cart.filter(item => item.productId !== productId);
    },
  },
  actions: {
    async fetchCart({ commit }) {
      try {
        const response = await axios.get('/api/cart');
        commit('SET_CART', response.data.items);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    },
    async addToCart({ commit }, { productId, quantity }) {
      try {
        const response = await axios.post('/api/cart/add', { productId, quantity });
        commit('SET_CART', response.data.items);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    },
    async removeFromCart({ commit }, productId) {
      try {
        const response = await axios.post('/api/cart/remove', { productId });
        commit('SET_CART', response.data.items);
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    },
  },
  getters: {
    cartItemCount: state => {
      return state.cart.reduce((total, item) => total + item.quantity, 0);
    },
    cartTotalPrice: state => {
      return state.cart.reduce((total, item) => total + item.productId.price * item.quantity, 0);
    },
  },
});
