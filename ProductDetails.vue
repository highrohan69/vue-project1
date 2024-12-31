<template>
  <div>
    <h1>Product Details</h1>
   
    <img v-if="product && product.image" :src="`http://localhost:5000${product.image}`" style="width: 50%; height: 50%;">
    <p v-if="product">Product Name: {{ product.name }}</p>
    <p v-if="product">Product Price: {{ product.price }}</p>
    <p v-if="product">Product Description: {{ product.description }}</p>
    <p v-if="error">Error: {{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      product: null,
      error: null
    }
  },
  created() {
    this.fetchProductDetails()
  },
  methods: {
  async fetchProductDetails() {
    const productId = this.$route.params.id;
    axios.get(`http://localhost:5000/api/products/${productId}`)
      .then(response => {
        this.product = response.data;
      })
      .catch(error => {
        console.error(error);
      });
  }
}
}
</script>
<style>
/* স্টাইলিং */
.product-details {
  display: flex;
  gap: 20px;
  margin: 20px;
}
.image-section img {
  max-width: 300px; /* ইমেজের সর্বোচ্চ প্রস্থ */
}
.info-section {
  flex: 1; /* ইনফো সেকশন ফ্লেক্সিবল */
}
</style>
