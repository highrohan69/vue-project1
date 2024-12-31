<template>
  <div>
    <!-- Header Section -->
    <div class="header" id="myHeader">
      <div class="headercontent">
        <div class="logo">
          <img src="../assets/Latest Tech Gadgets & Mobile Accessories.png" alt="Logo" />
          <h1>Avado</h1>
        </div>

        <div class="search-container">
          <div class="input-icon-container">
            <input type="text" class="search-bar" placeholder="Search" />
            <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div class="headericons">
          <div class="svgtext" v-if="!isLoggedIn">
            <button @click="goToLogin">Login</button>
          </div>
          <div class="svgtext" v-else>
            <button @click="logout">Logout</button>
          </div>
          <div class="svgtext">
            <svg xmlns="http://www.w3.org/2000/svg" height="31px" viewBox="0 0 24 24" fill="#EFEFEF">
              <path d="M7 4V3h10v1H7zm5 16c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-9H9v2h2v2h2v-2h2v-2h-2V9h-2v2z" />
            </svg>
            <h1>Order</h1>
          </div>
          <div class="svgtext cart-icon-container" @click="goToCart">
            <svg xmlns="http://www.w3.org/2000/svg" height="31px" viewBox="0 0 24 24" fill="#EFEFEF">
              <path d="M3 3h18v2H3V3zm0 5h18v2H3V8zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
            </svg>
            <h1>Cart</h1>
            <span class="cart-count" v-if="cartCount > 0">{{ cartCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Banner Section -->
    <div class="banner">
      <img :src="`http://localhost:5000${bannerImage}`" alt="Banner Image" />
    </div>

    <!-- Categories Section -->
    <h1>Categories</h1>
    <div v-if="categories.length > 0" class="category-list">
      <div
        v-for="category in categories"
        :key="category._id"
        class="category-card"
        @click="fetchProducts(category._id)"
      >
        <img :src="category.image" alt="Category Image" />
        <p>{{ category.name }}</p>
      </div>
    </div>

    <!-- Products Section -->
    <h1>Our Products</h1>
    <div class="product-list">
      <div v-for="product in products" :key="product._id" class="product-card">
        <img v-if="product.image" :src="`http://localhost:5000${product.image}`" alt="Product Image" />

        <div class="product-info">
          <h2>{{ product.name }}</h2>
          <p>{{ product.price }} ৳</p>
          <button @click="addToCart(product, authToken )">Add to Cart</button>
          <button @click="goToDetails(product._id)">View Details</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      bannerImage: null,
      categories: [],
      products: [],
      cartCount: 0, // Cart count for icon
      isLoggedIn: false, // User login state
    };
  },
  methods: {
    async addToCart(productId) {
      try {
        const token = localStorage.getItem("authToken");
        await axios.post(
          "http://localhost:5000/api/cart/add",
          { productId, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Item added to cart!");
      } catch (error) {
        console.error(error);
        alert("Failed to add to cart");
      }
    },

    
updateCartCount() {
  // authToken থেকে Cart ডাটা নিন
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    this.cartCount = 0;
    return;
  }

  let cart = JSON.parse(localStorage.getItem(`cart_${authToken}`)) || [];
  this.cartCount = cart.length;
}
,
    fetchBanner() {
      axios
        .get("http://localhost:5000/api/banner")
        .then((response) => {
          this.bannerImage = response.data.image;
        })
        .catch((error) => {
          console.error("Error fetching banner:", error);
        });
    },
    fetchCategories() {
      axios
        .get("http://localhost:5000/api/categories")
        .then((response) => {
          this.categories = response.data;
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
    },
    fetchProducts(categoryId = null) {
      let url = "http://localhost:5000/api/products";
      if (categoryId) {
        url += `?categoryId=${categoryId}`;
      }
      axios
        .get(url)
        .then((response) => {
          this.products = response.data;
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    },
    goToDetails(productId) {
      this.$router.push({ name: "ProductDetails", params: { id: productId } });
    },
    goToLogin() {
      this.$router.push({ name: "Login" }); // Navigate to login page
    },
    logout() {
      localStorage.removeItem("authToken"); // Remove token
      this.isLoggedIn = false; // Set state
      alert("Logged out successfully!");
    },
  },
  mounted() {
    this.fetchBanner();
    this.fetchCategories();
    this.fetchProducts();
    this.updateCartCount(); // Initialize cart count
    this.isLoggedIn = !!localStorage.getItem("authToken"); // Check login state
  },
};
</script>
<style src="./HomePage.css"></style>
