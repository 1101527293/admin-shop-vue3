import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)

// vue-router
import { router } from './router'
app.use(router)

// element-plus-icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// windicss
import 'virtual:windi.css'

// vuex
import store from '~/store/index'
app.use(store)

// 工具类
import './permission.js'

// 全屏进度条
import 'nprogress/nprogress.css'

app.mount('#app')
