import { createRouter, createWebHistory } from 'vue-router'
import home from "../views/home.vue"
import login from "../views/login.vue"
import signup from "../views/signup.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home', 
      component: home
    },
    {
      path: '/signup',
      name: 'signup',
      component: signup
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})

export default router