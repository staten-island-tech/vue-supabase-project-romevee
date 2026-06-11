<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

const users = ref([])
const error = ref(null)
const loading = ref(true)

onMounted(async () => {
  let { data, error: err } = await supabase
    .from('users')
    .select('*')
    .order('id', { ascending: false })

  if (err) {
    error.value = err.message
  } else {
    users.value = data
  }

  loading.value = false
})
</script>
<template>
  <div class="app">

    <h1>Instagram Clone</h1>

    <p v-if="loading">
      Loading posts...
    </p>

    <p v-if="error">
      {{ error }}
    </p>

    <div
      v-for="user in users"
      :key="user.id"
      class="post-card"
    >
      <img
        :src="user.image_url"
        class="post-image"
      />

      <div class="post-content">
        <h3>@{{ user.username }}</h3>
        
        <p>
          {{ user.caption }}
        </p>

        <button>
          ❤️ Like
        </button>
      </div>
    </div>

  </div>
  <router-view></router-view>
</template>
<style lang="scss" scoped>

</style>