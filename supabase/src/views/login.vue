<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="login(user)">
      <div class="form-group">
        <label>Username</label>
        <input type="text" v-model="user.username" placeholder="Enter username" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" v-model="user.password" placeholder="Enter password" />
      </div>
      <button type="submit">Login</button>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </form>
    <h2 v-if="loggedIn">Welcome {{ user.username }}</h2>
    <h2 v-else>Please Login</h2>
    <div class="nav-buttons">
      <button class="home-btn" @click="router.push('/')">Home</button>
      <button class="signup-btn" @click="router.push('/signup')">Sign Up</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = reactive({ username: '', password: '' })
const loggedIn = ref(false)
const errorMsg = ref('')

async function login(user) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('email')
    .eq('username', user.username)
    .single()

  if (profileError || !profile) {
    errorMsg.value = 'Username not found'
    return
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password: user.password,
  })

  if (error) {
    errorMsg.value = error.message
  } else {
    loggedIn.value = true
    router.push('/')
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;

  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  label {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
}

button {
  width: 100%;
  padding: 0.75rem;
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

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  .home-btn {
    background-color: #555;

    &:hover {
      background-color: #333;
    }
  }

  .signup-btn {
    background-color: #2196F3;

    &:hover {
      background-color: #1976D2;
    }
  }
}
</style>