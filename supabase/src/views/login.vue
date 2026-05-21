<template>
  <div>
    <form @submit.prevent="login(user)">
      <label for="username">Email</label>
      <input type="text" v-model="user.username" />
      <label for="password">Password</label>
      <input type="password" v-model="user.password" />
      <button type="submit">Login</button>
      <p v-if="errorMsg" style="color: red;">{{ errorMsg }}</p>
    </form>
    <h2 v-if="loggedIn">Welcome {{ user.username }}</h2>
    <h2 v-else>Please Login</h2>
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email: user.username,
    password: user.password,
  })

  if (error) {
    errorMsg.value = error.message
    console.error(error)
  } else {
    loggedIn.value = true
    router.push('/')  // redirects to home after login
  }
}
</script>
<style lang="scss" scoped></style>
