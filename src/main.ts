import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


// 创建应用实例
const app = createApp(App)

// 将路由、axios 插件和 ElementPlus 插件安装到应用中
app.use(router)
//   .use(axios:any)
  .use(ElementPlus)

// 注册 ElementPlus 组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 挂载应用到 #app 元素上
app.mount('#app')

