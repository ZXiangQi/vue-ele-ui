import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login'
// import Home from '../components/Home'
// import Welcome from '../components/Welcome'
// import User from '../components/user/User'
// import Rights from '../components/power/Rights'
// import Roles from '../components/power/Roles'
// import Cate from '../components/goods/Cate'
// import Params from '../components/goods/Params'
// import List from '../components/goods/List'
// import Add from '../components/goods/Add'
// import Order from '../components/order/Order'
// import Report from '../components/report/Report'

// 路由懒加载
// webpackChunkName 可指定打包到一个文件
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome')

const User = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/user/User')
const Rights = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/Rights')
const Roles = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/Roles')

const Cate = () => import(/* webpackChunkName: "cate_params_list_add" */ '../components/goods/Cate')
const Params = () => import(/* webpackChunkName: "cate_params_list_add" */ '../components/goods/Params')
const List = () => import(/* webpackChunkName: "cate_params_list_add" */ '../components/goods/List')
const Add = () => import(/* webpackChunkName: "cate_params_list_add" */ '../components/goods/Add')

const Order = () => import(/* webpackChunkName: "order_report" */ '../components/order/Order')
const Report = () => import(/* webpackChunkName: "order_report" */ '../components/report/Report')

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
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
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
