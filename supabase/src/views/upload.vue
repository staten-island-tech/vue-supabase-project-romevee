<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const caption = ref('')
const image_url = ref('')
const posts = ref([])
const fileInput = ref(null)
const uploading = ref(false)

async function addPost(imageUrl) {
  const { error } = await supabase
    .from('posting1')
    .insert([
      {
        caption: caption.value,
        image_url: imageUrl
      }
    ])

  if (error) {
    console.log(error)
    alert(error.message)
    return
  }

  caption.value = ''
  image_url.value = ''


  if (fileInput.value) {
    fileInput.value.value = ''
  }


  getPosts()
}

async function uploadFileAndPost() {

  if (image_url.value && !fileInput.value.files.length) {
    await addPost(image_url.value)
    return
  }

  const file = fileInput.value.files[0]

  if (!file) {
    alert('Choose an image first')
    return
  }

  uploading.value = true

  const fileName = `${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, file)

  if (uploadError) {
    console.log(uploadError)
    alert(uploadError.message)
    uploading.value = false
    return
  }

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(fileName)

  const publicUrl = data.publicUrl

  await addPost(publicUrl)

  uploading.value = false
}

async function getPosts() {

  const { data, error } = await supabase
    .from('posting1')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.log(error)
    return
  }

  posts.value = data
}

onMounted(() => {
  getPosts()
})
</script>
<template>
  <div class="container">

    <h1>Instagram Clone</h1>

    <div class="upload-box">

      <input
        v-model="caption"
        placeholder="Enter caption"
      />
      <input
        v-model="image_url"
        placeholder="Paste image URL (optional)"
      />
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
      />
      <button
        @click="uploadFileAndPost"
        :disabled="uploading"
      >
        {{ uploading ? 'Uploading...' : 'Post' }}
      </button>
    </div>
    <hr />
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
.upload-box {
  margin-bottom: 20px;
}
input {
  display: block;
  margin-bottom: 10px;
  padding: 8px;
  width: 300px;
}
button {
  padding: 10px;
}
.post {
  margin-top: 20px;
}
img {
  margin-top: 10px;
  border-radius: 10px;
}
</style>





