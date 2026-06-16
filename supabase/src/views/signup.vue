<!-- <template>
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
  // Step 1: create the auth user
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
  })

  if (error) {
    errorMsg.value = error.message
    return
  }

  // Step 2: insert username into profiles table
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
</style> -->

<template>
  <div class="signup-container">
    <h1>Sign Up</h1>
    <form @submit.prevent="signUp">
      <div class="form-group">
        <label>Username</label>
        <input type="text" v-model="form.username" placeholder="Enter username" required />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="form.email" placeholder="Enter email" required />
      </div>
      
      <div class="form-group">
        <label>User Role</label>
        <select v-model="form.role" class="custom-select" required>
          <option value="" disabled selected>Select your role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" v-model="form.password" placeholder="Enter password" required />
      </div>
      <button type="submit">Sign Up</button>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      <p v-if="successMsg" class="success">{{ successMsg }}</p>
    </form>

    <div class="nav-buttons">
      <button class="home-btn" @click="router.push('/')">Home</button>
      <button class="login-btn" @click="router.push('/login')">Login</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const errorMsg = ref('')
const successMsg = ref('')

const form = reactive({
  username: '',
  email: '',
  password: '',
  role: '' // ADDED: Tracks the dropdown choice
})

async function signUp() {
  errorMsg.value = ''
  successMsg.value = ''

  // Step 1: Create user in Supabase Auth
  const { data, error: signUpError } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
  })

  if (signUpError) {
    errorMsg.value = signUpError.message
    return
  }

  // Step 2: Insert into your custom 'users' table (including their chosen role!)
  const { error: dbError } = await supabase
    .from('users')
    .insert([
      { 
        id: data.user.id, 
        username: form.username,
        avatar: form.role // Saving the role choice directly into your database column
      }
    ])

  if (dbError) {
    errorMsg.value = dbError.message
    return
  }

  successMsg.value = 'Account created! Redirecting...'
  setTimeout(() => {
    router.push('/upload')
  }, 2000)
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

/* ADDED: Styling to make the select dropdown match your inputs */
.custom-select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  width: 100%;

  &:focus {
    border-color: #4CAF50;
    outline: none;
  }
}

.error {
  color: red;
  margin-top: 0.5rem;
}

.success {
  color: green;
  margin-top: 0.5rem;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
}

button {
  padding: 0.75rem 2rem;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #1976D2;
  }
}

.home-btn {
  background-color: #757575;
  &:hover {
    background-color: #616161;
  }
}

.login-btn {
  background-color: #4CAF50;
  &:hover {
    background-color: #45a049;
  }
}
</style>