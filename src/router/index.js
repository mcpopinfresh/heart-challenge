import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AddChallenge from '../views/AddChallenge.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    icon: 'mdi-home-heart'
  },
  {
    path: '/addChallenge',
    name: 'Add Challenge',
    component: AddChallenge,
    icon: 'mdi-hand-heart'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
