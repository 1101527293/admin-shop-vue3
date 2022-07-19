<template>
    <div class="f-header">
        <!-- logo和名称 -->
        <span class="logo">
            <el-icon class="mr-2">
                <eleme-filled></eleme-filled>
            </el-icon>
            后台管理系统
        </span>

        <!-- 刷新图标 -->
        <el-tooltip class="box-item" content="刷新" placement="bottom">
            <!-- 刷新图标 -->
            <el-icon class="icon-btn" @click="handleRefresh">
                <refresh></refresh>
            </el-icon>
        </el-tooltip>

        <!-- 折叠图标 -->
        <el-tooltip class="box-item" content="折叠" placement="bottom">
            <!-- 折叠图标 -->
            <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
                <fold v-if="$store.state.asideWidth == '250px'"></fold>
                <expand v-else></expand>
            </el-icon>
        </el-tooltip>

        <div class="ml-auto flex items-center mr-5">
            <el-tooltip class="box-item" content="全屏" placement="bottom">
                <!-- 全屏图标 -->
                <el-icon class="icon-btn" @click="toggle">
                    <full-screen v-if="!isFullscreen"></full-screen>
                    <Crop v-else />
                </el-icon>
            </el-tooltip>

            <!-- 头像下拉菜单 -->
            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="flex items-center text-light-50">
                    <el-avatar class="mr-2" :size="30" :src="$store.state.user.avatar"></el-avatar>
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>


            <!-- 修改密码抽屉 -->
            <form-drawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">
                <el-form ref="formRef" :rules="rules" :model="form" label-width="80px" size="small">
                    <el-form-item prop="oldpassword" class="mb-5" label="旧密码">
                        <el-input v-model="form.oldpassword" placeholder="请输入旧密码....">
                            <template #prefix>
                                <el-icon>
                                    <User />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" class="mb-5" label="新密码">
                        <el-input type="password" v-model="form.password" show-password placeholder="请输入新密码...."
                            @keydown.enter="onSubmit">
                            <template #prefix>
                                <el-icon>
                                    <Lock />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="repassword" label="确认密码">
                        <el-input type="password" v-model="form.repassword" show-password placeholder="请确认新密码...."
                            @keydown.enter="onSubmit">
                            <template #prefix>
                                <el-icon>
                                    <Lock />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
            </form-drawer>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { showModal, toast } from '~/composables/utils.js'
import { logout, updatepassword } from '~/api/manager.js'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'
import { useFullscreen } from '@vueuse/core'

import FormDrawer from '~/components/FormDrawer.vue';

const { isFullscreen, toggle } = useFullscreen()

const router = useRouter()
const store = useStore()

const formDrawerRef = ref(null)

const form = reactive({
    oldpassword: '',
    password: '',
    repassword: ''
})

const rules = reactive({
    oldpassword: [
        { required: true, message: '旧密码不能为空', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '新密码不能为空', trigger: 'blur' }
    ],
    repassword: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' }
    ]
})

const formRef = ref(null)

const onSubmit = () => {
    formRef.value.validate(valid => {
        if (!valid) return false
    })

    formDrawerRef.value.showLoading()

    updatepassword(form).then(res => {
        toast('修改成功，请重新登录', 'success')

        store.dispatch('logout')

        router.push('/login')
    }).finally(() => formDrawerRef.value.hideLoading())
}

const handleRefresh = () => location.reload()

function handleLogout() {
    showModal('是否确定退出登录').then(res => {
        logout().then(res => {
            // 移除token

            // 清除vuex中的用户状态
            store.dispatch('logout')

            // 跳转回登录页面
            router.push('/login')

            // 弹窗提示
            toast('退出登录成功', 'success')
        })
    })
}

function handleCommand(e) {
    switch (e) {
        case 'logout':
            handleLogout()
            break;
        case 'rePassword':
            // drawer.value = true
            console.log(formDrawerRef.value);
            formDrawerRef.value.open()
            break;
        default:
            break;
    }
}
</script>

<style scoped>
.f-header {
    @apply bg-indigo-700 text-light-50 flex items-center fixed top-0 left-0 right-0;
    height: 64px;
    z-index: 1000;
}

.logo {
    @apply flex justify-center items-center text-xl font-thin;
    width: 250px;
}

.icon-btn {
    @apply flex justify-center items-center;
    width: 42px;
    height: 64px;
    cursor: pointer;
}

.icon-btn:hover {
    @apply bg-indigo-600;
}

.f-header .dropdown {
    @apply flex justify-center items-center mx-5;
    height: 64px;
    cursor: pointer
}
</style>