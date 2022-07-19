import { useCookies } from "@vueuse/integrations/useCookies";
const cookie = useCookies()

const TokenKey = 'admin-token'

// 获取token
export function getToken() {
    const token = cookie.get(TokenKey)
    return token
}

// 设置token
export function setToken(token) {
    cookie.set(TokenKey, token)
}

// 清楚token
export function removeToken(token) {
    cookie.remove(TokenKey)
}