import { createStore } from 'vuex'
import { getInfo } from '~/api/manager'
import { removeToken } from '~/composables/auth.js'

const store = createStore({
  state () {
    return {
        // 用户信息
        user: {},

        // 侧边栏宽度
        asideWidth: '250px',

        menus: [],

        ruleNames: [],
    }
  },
  mutations: {
    SET_USERINFO(state, user) {
        state.user = user
    },
    handleAsideWidth(state) {
      state.asideWidth = state.asideWidth == '250px' ? '64px' : '250px'
    },
    SET_MENUS(state, menus) {
      state.menus = menus
    },
    SET_RULENAMES(state, ruleNames) {
      state.ruleNames = ruleNames
    }
  },
  actions: {
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          this.commit('SET_USERINFO', res)
          this.commit('SET_MENUS', res.menus)
          this.commit('SET_RULENAMES', res.ruleNames)
          resolve(res)
        }).catch(err => reject(err))
      })
    },

    // 退出登录
    logout() {
      removeToken()
      this.commit('SET_USERINFO', {})
    }
  }
})

export default store