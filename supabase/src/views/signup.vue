<template>
  <div class="signup-container">
    <h1>Sign Up</h1>
    <form @submit.prevent="signup">
      <div class="form-group">
        <label>Username</label>
        <input type="text" v-model="form.username" placeholder="Enter username" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="form.email" placeholder="Enter email" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" v-model="form.password" placeholder="Enter password" />
      </div>
      <button type="submit">Sign Up</button>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      <p v-if="successMsg" class="success">{{ successMsg }}</p>
    </form>
    <p class="login-link">Already have an account? <a href="/login">Login</a></p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ username: '', email: '', password: '' })
const errorMsg = ref('')
const successMsg = ref('')

async function signup() {
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
  })

  if (error) {
    errorMsg.value = error.message
    return
  }
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ id: data.user.id, username: form.username, email: form.email }])

  if (profileError) {
    errorMsg.value = profileError.message
    return
  }

  successMsg.value = 'Account created! Redirecting to login...'
  setTimeout(() => router.push('/login'), 2000)
}
</script>

<style lang="scss" scoped>
.signup-container {
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

.success {
  color: green;
  margin-top: 1rem;
  text-align: center;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
}
</style>