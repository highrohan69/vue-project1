// CategoryProducts.vue
<template>
  <div>
    <h1>Products in this Category</h1>
    <div v-if="products.length">
      <div v-for="product in products" :key="product.id">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
      </div>
    </div>
    <p v-else>No products available in this category</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: []
    };
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    fetchProducts(categoryId) {
    // axios.get এর মধ্যে categoryId ব্যবহার করুন
    axios.get(`http://localhost:5000/api/products?categoryId=${categoryId}`)
      .then(response => {
        this.products = response.data; // প্রাপ্ত ডেটা
        console.log("Products fetched:", response.data);  // প্রোডাক্ট ডেটা
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      });

    }
  }
};
</script>
