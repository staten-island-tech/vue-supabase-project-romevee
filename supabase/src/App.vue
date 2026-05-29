// ...existing code...
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

const caption = ref('')
const image_url = ref('')
const posts = ref([])
const fileInput = ref(null)
const uploading = ref(false)

// try to obtain current user id (supports supabase-js v1 and v2)
async function getCurrentUserId() {
  try {
    if (supabase.auth?.getUser) {
      const { data } = await supabase.auth.getUser()
      return data?.user?.id ?? null
    }
    if (supabase.auth?.user) {
      const user = supabase.auth.user()
      return user?.id ?? null
    }
  } catch (e) {
    console.warn('getCurrentUserId error', e)
  }
  return null
}

async function addPost(url) {
  const user_id = await getCurrentUserId()
  const payload = {
    caption: caption.value,
    image_url: url ?? image_url.value,
  }
  if (user_id) payload.user_id = user_id

  const { error } = await supabase
    .from('posting1') // your posting table
    .insert([payload])

  if (error) {
    console.log(error)
    alert('Failed to add post')
  } else {
    caption.value = ''
    image_url.value = ''
    if (fileInput.value) fileInput.value.value = ''
    getPosts()
  }
}

async function uploadFileAndPost() {
  const files = fileInput.value?.files
  if (!files || files.length === 0) {
    if (!image_url.value) {
      alert('Select a file or paste an image URL first.')
      return
    }
    await addPost(image_url.value)
    return
  }

  const file = files[0]
  const filePath = `${Date.now()}-${file.name}`
  uploading.value = true

  const { error: uploadError } = await supabase.storage
    .from('images') // ensure this bucket exists
    .upload(filePath, file, { cacheControl: '3600', upsert: true })

  if (uploadError) {
    console.error('Upload error', uploadError)
    alert('Upload failed')
    uploading.value = false
    return
  }

  // get public URL (handles different supabase-js returns)
  const { data: publicData } = supabase.storage.from('images').getPublicUrl(filePath)
  const publicUrl = publicData?.publicUrl ?? publicData?.publicURL ?? publicData?.public_url

  if (!publicUrl) {
    alert('Could not get public URL for uploaded file')
    uploading.value = false
    return
  }

  await addPost(publicUrl)
  uploading.value = false
}

async function getPosts() {
  // select posts; add any joins/filters if needed
  const { data, error } = await supabase
    .from('posting1')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.log(error)
  } else {
    posts.value = data || []
  }
}

onMounted(() => {
  getPosts()
})
</script>

<template>
  <div class="container">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/upload">Upload</router-link>
    </nav>

    <h1>Instagram Clone Test</h1>

    <div class="upload-box">
      <label>Caption</label>
      <input v-model="caption" placeholder="Enter caption" />

      <label>Image URL (optional)</label>
      <input v-model="image_url" placeholder="Paste image URL" />

      <label>Or choose a file</label>
      <input ref="fileInput" type="file" accept="image/*" />

      <button @click="uploadFileAndPost" :disabled="uploading">
        {{ uploading ? 'Uploading...' : 'Upload & Post' }}
      </button>
    </div>

    <hr />

    <div v-for="post in posts" :key="post.id" class="post">
      <h3>{{ post.caption }}</h3>
      <img :src="post.image_url" width="300" />
      <div v-if="post.user_id"><small>by: {{ post.user_id }}</small></div>
    </div>

    <router-view />
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  font-family: Arial;
}
.upload-box { margin-bottom: 20px; }
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
nav { margin-bottom: 12px; }
</style>
// ...existing code...