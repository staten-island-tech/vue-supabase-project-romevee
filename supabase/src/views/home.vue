<template>
  <div class="home-container">
    <h1>Welcome</h1>
    <p>Please login or create an account to get started.</p>
    <div class="buttons">
      <button @click="router.push('/login')">Login</button>
      <button @click="router.push('/signup')" class="signup-btn">Sign Up</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.home-container {
  max-width: 400px;
  margin: 100px auto;
  text-align: center;

  h1 {
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    color: #666;
  }
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

button {
  padding: 0.75rem 2rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
}

.signup-btn {
  background-color: #2196F3;

  &:hover {
    background-color: #1976D2;
  }
}
</style>