<template>
  <div class="delivery-details">
    <h1>Delivery Details</h1>
    <form @submit.prevent="submitDetails">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="deliveryDetails.name" required />
      </div>
      <div>
        <label for="phone">Phone:</label>
        <input type="text" id="phone" v-model="deliveryDetails.phone" required />
      </div>
      <div>
        <label for="address">Address:</label>
        <textarea id="address" v-model="deliveryDetails.address" required></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      deliveryDetails: {
        name: "",
        phone: "",
        address: "",
      },
    };
  },
  methods: {
    submitDetails() {
      // অর্ডার তথ্য সার্ভারে পাঠানো
      axios
        .post("http://localhost:5000/api/orders", {
          ...this.deliveryDetails,
          cart: JSON.parse(localStorage.getItem("cart")), // কার্টের প্রোডাক্ট যুক্ত করা
        })
        .then(() => {
          alert("Order submitted successfully!");
          localStorage.removeItem("cart"); // কার্ট খালি করা
          this.$router.push("/"); // হোমপেজে রিডাইরেক্ট
        })
        .catch((error) => {
          console.error("Error submitting order:", error);
          alert("Failed to submit order. Please try again.");
        });
    },
  },
};
</script>

<style>
.delivery-details {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.delivery-details label {
  display: block;
  margin-bottom: 8px;
}
.delivery-details input,
.delivery-details textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.delivery-details button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.delivery-details button:hover {
  background-color: #45a049;
}
</style>
