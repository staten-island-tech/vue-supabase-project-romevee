<!-- <script setup>
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





 -->

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