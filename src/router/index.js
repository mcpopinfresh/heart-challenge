import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AddChallenge from '../views/AddChallenge.vue'
import HeartMap from '../views/HeartMap.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    icon: 'mdi-home-heart',
    visible: true
  },
  {
    path: '/addChallenge',
    name: 'Add Challenge',
    component: AddChallenge,
    icon: 'mdi-hand-heart',
    visible: true
  },
  {
    path: '/heartMap',
    name: 'Heart Map',
    component: HeartMap,
    icon: 'mdi-earth',
    visible: false
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
