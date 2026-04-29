import { createRouter, createWebHistory } from 'vue-router'
import Signin from '../views/SigninView.vue'
import Signup from '../views/SignupView.vue'
import Home from '../views/HomeView.vue'
import Captured from '../views/CapturedView.vue'
import Ia from '../views/IaView.vue'

const routes = [
  { path: '/', name: 'signin', component: Signin, meta: { hideHeader: true } },
  { path: '/signup', name: 'signup', component: Signup, meta: { hideHeader: true } },
  { path: '/home', name: 'home', component: Home },
  { path: '/captured', name: 'captured', component: Captured },
  { path: '/ia', name: 'ia', component: Ia }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
