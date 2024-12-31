<template>
  <div>
    <h1>Your Cart</h1>
    <div v-if="cart.length === 0">Your cart is empty.</div>
    <div v-else>
      <div v-for="item in cart" :key="item.productId._id">
        <p>{{ item.productId.name }} - Quantity: {{ item.quantity }}</p>
        <button @click="removeFromCart(item.productId._id)">Remove</button>
      </div>
      <p>Total Items: {{ cartItemCount }}</p>
      <p>Total Price: {{ cartTotalPrice }}</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['cartItemCount', 'cartTotalPrice']),
  },
  methods: {
    ...mapActions(['fetchCart', 'removeFromCart']),
  },
  created() {
    this.fetchCart();
  },
};
</script>
