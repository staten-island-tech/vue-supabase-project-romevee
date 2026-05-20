<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

const caption = ref('')
const image_url = ref('')
const posts = ref([])

async function addPost() {
  const { error } = await supabase
    .from('posting1')
    .insert([
      {
        caption: caption.value,
        image_url: image_url.value,
      },
    ])

  if (error) {
    console.log(error)
  } else {
    alert('Post added!')
    getPosts()
  }
}

async function getPosts() {
  const { data, error } = await supabase
    .from('posting1')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.log(error)
  } else {
    posts.value = data
  }
}

onMounted(() => {
  getPosts()
})
</script>

<template>
  <div class="container">
    <h1>Instagram Clone Test</h1>

    <input
      v-model="caption"
      placeholder="Enter caption"
    />

    <input
      v-model="image_url"
      placeholder="Paste image URL"
    />

    <button @click="addPost">
      Add Post
    </button>

    <div
      v-for="post in posts"
      :key="post.id"
      class="post"
    >
      <h3>{{ post.caption }}</h3>

      <img
        :src="post.image_url"
        width="300"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  font-family: Arial;
}

input {
  display: block;
  margin-bottom: 10px;
  padding: 8px;
  width: 300px;
}

button {
  padding: 10px;
  margin-bottom: 20px;
}

.post {
  margin-top: 20px;
}
</style>