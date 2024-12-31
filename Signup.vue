<template>
  <div>
    <form @submit.prevent="handleSignup">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
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
    async handleSignup() {
      try {
        const response = await axios.post('http://localhost:5000/api/signup', {
          username: this.username,
          password: this.password
        });
        console.log(response.data);
      } catch (error) {
        console.error('Signup error:', error.response ? error.response.data : error.message);
      }
    }
  }
};
</script>
