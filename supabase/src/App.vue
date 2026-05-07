<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

const transactions = ref([])
const error = ref(null)
const loading = ref(true)

onMounted(async () => {
  let { data, error: err } = await supabase
    .from('transactions')
    .select('*')
    .order('id', { ascending: false })

  if (err) {
    error.value = err.message
  } else {
    transactions.value = data
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
      v-for="transaction in transactions"
      :key="transaction.id"
      class="post-card"
    >
      <img
        :src="transaction.image_url"
        class="post-image"
      />

      <div class="post-content">
        <h3>@{{ transaction.username }}</h3>

        <p>
          {{ transaction.caption }}
        </p>

        <button>
          ❤️ Like
        </button>
      </div>
    </div>

  </div>
</template>
<style lang="scss" scoped>

</style>