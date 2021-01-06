import Vue from 'vue'
import VueRouter from 'vue-router'
import ebook from '@/Ebook'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/ebook'
  },
  {
    path: '/ebook',
    component: ebook
  }
]

const router = new VueRouter({
  routes
})

export default router
