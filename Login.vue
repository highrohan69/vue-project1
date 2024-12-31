<template>
  <div>
    <form @submit.prevent="handleLogin">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async handleLogin() {
  try {
    const response = await axios.post('http://localhost:5000/api/login', {
      username: this.username,
      password: this.password
    });

    // টোকেন স্থানীয় স্টোরেজে সংরক্ষণ
    const token = response.data.token; // ধরে নিচ্ছি টোকেন রেসপন্সে আসছে
    localStorage.setItem('authToken', token);

    // Redirect to homepage
    this.$router.push('/');
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    alert('Login failed! Please try again.');
  }
}

  }
};
</script>
