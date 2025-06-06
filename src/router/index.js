
import { createRouter, createWebHistory } from 'vue-router'
import LayoutTest from '../components/LayoutTest.vue'
import HelloWorld from '../components/HelloWorld.vue'

const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  },{
    path: '/layout',
    name: 'LayoutTest',
    component: LayoutTest
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
