
import { createRouter, createWebHistory } from 'vue-router'
import LayoutTest from '../components/LayoutTest.vue'
import HelloWorld from '../components/HelloWorld.vue'
import CanvasTest from '@/components/CanvasTest.vue'

import ZoomTest from '@/components/ZoomTest.vue'

const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  },{
    path: '/layout',
    name: 'LayoutTest',
    component: LayoutTest
  },{
    path: '/canvas',
    name: 'CanvasTest',
    component: CanvasTest
  },{
    path: '/zoom',
    name: 'ZoomTest',
    component: ZoomTest
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
