<template>
  <div class="admin-panel">
    <h1>Admin Panel</h1>

    <!-- Add Product Section -->
    <section>
      <h2>Add Product</h2>
      <form @submit.prevent="addProduct">
        <input v-model="productName" placeholder="Product Name" required />
        <input v-model.number="productPrice" placeholder="Product Price" type="number" required />
        <textarea v-model="productDescription" placeholder="Product Description" required></textarea>
        <select v-model="productCategory" required>
          <option value="">Select a category</option>
          <option v-for="category in categories" :key="category._id" :value="category._id">
            {{ category.name }}
          </option>
        </select>
        <input type="file" @change="handleFileUpload" required />
        <button type="submit">Add Product</button>
      </form>
    </section>

    <!-- Product List -->
    <section>
      <h2>Product List</h2>
      <div v-for="product in products" :key="product._id" class="product-item">
        <img v-if="product.image" :src="`http://localhost:5000${product.image}`" alt="Product Image" />
        <div>
          <h3>{{ product.name }}</h3>
          <p>Price: {{ product.price }} BDT</p>
          <p>Description: {{ product.description }}</p>
          <button @click="deleteProduct(product._id)">Delete</button>
        </div>
      </div>
    </section>

    <!-- Banner Upload Section -->
    <section>
      <h2>Upload Banner</h2>
      <form @submit.prevent="uploadBanner">
        <input type="file" @change="handleBannerUpload" required />
        <button type="submit">Upload Banner</button>
      </form>
      <div v-if="bannerImage">
        <h3>Current Banner:</h3>
        <img :src="`http://localhost:5000${bannerImage}`" alt="Banner Image" class="banner-image" />
      </div>
    </section>

    <!-- Manage Categories Section -->
    <section>
      <h2>Manage Categories</h2>
      <form @submit.prevent="addCategory">
        <input v-model="categoryName" placeholder="Category Name" required />
        <input type="file" @change="handleCategoryImageUpload" required />
        <button type="submit">Add Category</button>
      </form>

      <div>
        <h3>Existing Categories</h3>
        <div v-for="category in categories" :key="category._id" class="admin-category">
          <img :src="category.image" alt="Category Image" />
          <p>{{ category.name }}</p>
          <button @click="deleteCategory(category._id)">Delete</button>
        </div>
      </div>
    </section>

    <div>
    <h1>Order Inbox</h1>
    <div v-if="orders.length > 0">
      <div v-for="order in orders" :key="order._id" class="order-card">
        <h3>Order by: {{ order.name }}</h3>
        <p>Phone: {{ order.phone }}</p>
        <p>Address: {{ order.address }}</p>
        <p>Date: {{ new Date(order.date).toLocaleString() }}</p>
        <ul>
          <li v-for="item in order.cart" :key="item.id">
            {{ item.name }} - {{ item.price }} BDT
          </li>
        </ul>
      </div>
    </div>
    <p v-else>No orders available.</p>
  </div>






  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      products: [],
      productName: "",
      productPrice: 0,
      productCategory: "",
      productDescription: "",
      productImage: null,
      bannerImage: null,
      bannerFile: null,
      categories: [],
      categoryName: "",
      categoryImage: null,
      orders: [],
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      const validExtensions = ['.jpg', '.jpeg', '.png'];
      const fileExtension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);

      if (!validExtensions.includes(`.${fileExtension.toLowerCase()}`)) {
        alert('Only PNG or JPG images are allowed!');
        return;
      }

      this.productImage = file;
    },
    handleCategoryImageUpload(event) {
      this.categoryImage = event.target.files[0];
    },
    async addProduct() {
  try {
    const formData = new FormData();
    formData.append("name", this.productName);
    formData.append("price", this.productPrice);
    formData.append("description", this.productDescription);
    formData.append("categoryId", this.productCategory);
    if (this.productImage) {
      formData.append("image", this.productImage);
    }

    console.log("Sending product data:", {
      name: this.productName,
      price: this.productPrice,
      description: this.productDescription,
      categoryId: this.productCategory,
      image: this.productImage ? this.productImage.name : 'No image'
    });

    const response = await axios.post("http://localhost:5000/api/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Product added:", response.data);
    this.fetchProducts();
    this.resetProductForm();
  } catch (error) {
    console.error("Error adding product:", error.response ? error.response.data : error.message);
  }
},
    async fetchProducts() {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        this.products = response.data;
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    },
    async deleteProduct(id) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        this.fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error.message);
      }
    },
    handleBannerUpload(event) {
      this.bannerFile = event.target.files[0];
    },
    async uploadBanner() {
      try {
        const formData = new FormData();
        formData.append("image", this.bannerFile);

        const response = await axios.post("http://localhost:5000/api/banner", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        this.bannerImage = response.data.image;
        console.log("Banner uploaded:", response.data);
      } catch (error) {
        console.error("Error uploading banner:", error.message);
      }
    },
    async fetchBanner() {
      try {
        const response = await axios.get("http://localhost:5000/api/banner");
        this.bannerImage = response.data.image;
      } catch (error) {
        console.error("Error fetching banner:", error.message);
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    },
    async addCategory() {
      const formData = new FormData();
      formData.append('name', this.categoryName);
      if (this.categoryImage) {
        formData.append('image', this.categoryImage);
      }

      try {
        const response = await axios.post('http://localhost:5000/api/categories', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Category added successfully:', response.data);
        this.fetchCategories();
        this.resetCategoryForm();
      } catch (error) {
        console.error('Error adding category:', error);
      }
    },
    async deleteCategory(id) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        this.fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error.message);
      }
    },
    resetProductForm() {
      this.productName = "";
      this.productPrice = 0;
      this.productCategory = "";
      this.productDescription = "";
      this.productImage = null;
    },
    resetCategoryForm() {
      this.categoryName = "";
      this.categoryImage = null;
    },
  },
  mounted() {
    this.fetchProducts();
    this.fetchBanner();
    this.fetchCategories();
  },

  created() {
    axios
      .get("http://localhost:5000/api/orders")
      .then((response) => {
        this.orders = response.data;
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  },


};
</script>

<style scoped>
.admin-panel {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

section {
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1, h2 {
  color: #333;
  margin-bottom: 20px;
}

input, button, select, textarea {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #0056b3;
}

.product-item, .admin-category {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.product-item img, .admin-category img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 10px;
}

.banner-image {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
}
</style>