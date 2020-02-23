import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/login')},  
  { path: '/begin', name: 'begin', component: () => import('@/views/begin')},  //一开启软件出现的大海报
  { path: '/search', name: 'search', component: () => import('../views/list/search')}, //搜索页面
  { path: '/list/:key', name: 'list', component: () => import('@/views/list')}, //列表页面
  { path: '/details/:key', name: 'details', component: () => import('@/views/details')}, //文章详情页面

  { path: '/', redirect: "/home" },  //路由重定向 - 两个页面转到同一页面

  //tabBar
  {
    path: '/', name: 'tabBar', component: () => import('@/views/tabBar'), children:[  //主页
      {path: 'home', name: 'home', component: () => import('@/views/tabBar/home')},  //主页里边的home页面  
      {path: 'my', name: 'my', component: () => import('@/views/tabBar/my')},  //主页里边的my页面  
      {path: 'video', name: 'video', component: () => import('@/views/tabBar/video')},  //主页里边的video页面  
      {path: 'wenDa', name: 'wenDa', component: () => import('@/views/tabBar/wenDa')},  //主页里边的wenDa页面  
    ] 
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
