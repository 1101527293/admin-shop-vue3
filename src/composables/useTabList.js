import { ref } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useCookies } from '@vueuse/integrations/useCookies';
import { router } from '~/router';

export function useTabList() {
    const route = useRoute()
    const cookie = useCookies()

    const activeTab = ref(route.path)
    const tabList = ref([
        {
            title: '后台首页',
            path: '/'
        },
        {
            title: '商城管理',
            path: '/goods/list'
        },
    ])

    function addTab(tab) {
        // 判断是否已经添加过这个tab
        let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1

        if (noTab) {
            tabList.value.push(tab)
        }

        // 添加到cookie中
        cookie.set('tablist', tabList.value)
    }

    // 初始化标签导航栏
    function initTabList() {
        let tbs = cookie.get('tablist')
        if (tbs) tabList.value = tbs
    }

    initTabList()

    onBeforeRouteUpdate((to, from) => {
        activeTab.value = to.path
        addTab({
            title: to.meta.title,
            path: to.path
        })
    })

    const changeTab = (t) => {
        // t 为跳转tab对应的path值
        activeTab.value = t
        router.push(t)
    }

    // 关闭导航栏标签
    const removeTab = (t) => {
        let tabs = tabList.value

        // a 为当前的tab路径
        let a = activeTab.value

        // 如果关掉的路径与当前路径一致
        if (a == t) {
            tabs.forEach((tab, index) => {
                if (tab.path == t) {
                    const nextTab = tabs[index + 1] || tabs[index - 1]
                    if (nextTab) {
                        a = nextTab
                    }
                }
            })
        }
        activeTab.value = a
        tabList.value = tabList.value.filter(tab => tab.path != t)

        cookie.set('tablist', tabList.value)
    }

    const handleClose = (c) => {
        if (c == 'clearAll') {
            activeTab.value = '/'
            tabList.value = [{
                title: '后台首页',
                path: '/',
            }]
        }
        else if (c == 'clearOther') {
            tabList.value = tabList.value.filter(tab => tab.path == '/' || tab.path == activeTab.value)
        }
        cookie.set('tablist', tabList.value)
    }

    return {
        activeTab,
        tabList,
        changeTab,
        removeTab,
        handleClose
    }
}