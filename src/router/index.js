import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 如访问的路径为login页，则直接放行
  if (to.path === '/login') return next()

  // 获取页面的token，假如没值则强制回退到login页面，有值则放行
  const tokenStr = window.sessionStorage.getItem('token')

  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router
