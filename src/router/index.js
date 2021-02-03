import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  { path: '/', redirect: '/gprint' },
  { path: '/gprint', component: () => import('@/views/pingge/gprint/index') },
  { path: '/scan', component: () => import('@/views/pingge/QRCode/index') }
]

export default new Router({
  routes,
  mode: 'history'
})

