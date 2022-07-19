import { router, addRoutes } from '~/router'
import { getToken } from '~/composables/auth.js'
import { toast, showFullLoading, hideFullLoading } from '~/composables/utils.js'
import store from '~/store'

let hasGetInfo = false
router.beforeEach(async (to, from, next) => {
    // 显示进度条
    showFullLoading()
    
    const token = getToken()

    // 没有登录
    if( !token && to.path != '/login') {
        toast('请先登录账号', 'error')
        return next({path: '/login'})
    }

    // 避免重复登录
    if( token && to.path == '/login') {
        return next({ path: '/'})
    }

    // 自动获取用户信息
    let hasNewRoutes = false
    if(token && !hasGetInfo) {
        let res = await store.dispatch('getInfo')
        // 动态添加路由
        hasNewRoutes = addRoutes(res.menus)
        hasGetInfo = true
    }

    // 页面名称
    // let title = (to.meta.title ? to.meta.title : '') + '-商城后台管理'
    // document.title = title

    hasNewRoutes ? next(to.fullPath) : next()
})

router.afterEach((to, from) => {
    hideFullLoading()
})