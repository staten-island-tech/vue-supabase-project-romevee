import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import Login from '../views/login.vue'
import Signup from '../views/signup.vue'
import UploadDashboard from '../views/upload.vue' 

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/upload',
    name: 'Upload',
    component: UploadDashboard, 
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router