import { def } from '@vue/shared'
import {
    createRouter,
    createWebHashHistory
} from 'vue-router'

import Index from '~/pages/index.vue'
import About from '~/pages/about.vue'
import Login from '~/pages/login.vue'
import NotFound from '~/pages/404.vue'
import Admin from '~/layouts/admin.vue'
import GoodList from '~/pages/goods/list.vue'
import CategoryList from '~/pages/category/list.vue'


const routes = [
    {
        path: '/',
        name: 'admin',
        component: Admin,
    },
    {
        path: '/about',
        component: About,
        meta: {
            title: '关于本站'
        }
    },
    {
        path: '/login',
        component: Login,
        meta: {
            title: '登录页'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]

// 动态路由
const asyncRoutes = [
    {
        path:'/',
        name:'/',
        component: Index,
        meta: {
            title: '首页'
        },
    },
    {
        path:'/goods/list',
        name:'/goods/list',
        component: GoodList,
        meta: {
            title: '商品管理'
        },
    },
    {
        path:'/category/list',
        name:'/category/list',
        component: CategoryList,
        meta: {
            title: '分类列表'
        },
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 动态添加路由
export function addRoutes(menus) {
    // 是否有新路由
    let hasNewRouter = false

    const findAndAddRoutesByMenus = (arr) => {
        arr.forEach(element => {
            let item = asyncRoutes.find(o => o.path == element.frontpath)
            console.log(element.frontpath);
            if (item && !router.hasRoute(item.path)){
                router.addRoute('admin', item)
                hasNewRouter = true
            }
            if(element.child && element.child.length > 0) {
                findAndAddRoutesByMenus(element.child)
            }
        });
    }

    findAndAddRoutesByMenus(menus)

    return hasNewRouter
}