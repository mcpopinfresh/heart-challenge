import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SheetTest from '../views/SheetTest.vue'
import HeartCart from '../views/HeartCart.vue'
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
    path: '/sheetTest',
    name: 'Sheet Test',
    component: SheetTest,
    icon: 'mdi-mother-heart'
  },
  {
    path: '/heartCart',
    name: 'Heart Cart',
    component: HeartCart,
    icon: 'mdi-cart-heart'
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
