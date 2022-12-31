import Login from '../views/login.vue'
import Index from '../views/index.vue'
import Field from '../views/field.vue'
import Product from '../views/product.vue'
import DataSource from '../views/dataSource.vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { ElMessage } from 'element-plus'

const routes: Array<RouteRecordRaw> = [{
    path:'/',
    name:'index',
    component: Index,
    redirect:'/field',
    children:[
      {
        path:'/field',
        name:'field',

        component:Field
      },
      {
        path:'/product',
        name:'product',
        component:Product
      },
      {
        path:'/dataSource',
        name:'dataSource',
        component:DataSource
      }
    ]
},{
  path:'/login',
  name:'Login',
  component:Login
}
];


const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  // 1.如果访问的是登录页面（无需权限），直接放行
  if (to.path === '/login') return next()
  // 2.如果访问的是有登录权限的页面，先要获取token
  const tokenStr = localStorage.getItem('token')
  // 2.1如果token为空，强制跳转到登录页面；否则，直接放行
  if (!tokenStr) {
    ElMessage.warning('请先登录')
    return next('/login')
  }
  next()
})

export default router;
