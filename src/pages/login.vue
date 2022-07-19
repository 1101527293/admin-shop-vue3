<template>
    <el-row class="bg-indigo-500 min-h-screen">
        <el-col :lg="16" :md="12" class="flex items-center justify-center">
            <div>
                <div class="font-bold text-5xl text-light-50 mb-4">欢迎光临</div>
                <div class="text-gray-200 text-sm">这是一个电商后台管理网站 &nbsp;&nbsp; A Website of Shop Management</div>
            </div>
        </el-col>
        <el-col :lg="8" :md="12" class="bg-light-50 flex items-center justify-center flex-col">
            <h2 class="font-bold text-3xl text-gray-800 mb-3">欢迎回来</h2>
            <div class="flex items-center justify-center text-gray-300 space-x-2 mb-5">
                <span class="h-[1px] w-16 bg-gray-200"></span>
                <span>账号密码登录</span>
                <span class="h-[1px] w-16 bg-gray-200"></span>
            </div>
            <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px] ">
                <el-form-item prop="username" class="mb-5">
                    <el-input v-model="form.username" placeholder="请输入用户名....">
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="form.password" show-password placeholder="请输入密码...."
                        @keydown.enter="onSubmit">
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button round color="#626aef" type="primary" @click="onSubmit" class="w-[250px]" :loading="loading">登录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { login, getInfo } from '~/api/manager'
    import { ElNotification } from 'element-plus'
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex'
    import { setToken } from '~/composables/auth.js'
    
    const router = useRouter()
    const store = useStore()

    let loading = ref(false)

    const form = reactive({
        username: '',
        password: ''
    })

    const rules = reactive({
        username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
    })

    const formRef = ref(null)

    const onSubmit = () => {
        formRef.value.validate(valid => {
            if(!valid) return false
        })

        loading.value = true

        login(form.username, form.password).then(res => {
            console.log(res)

            // 弹窗提示登陆成功
            ElNotification({
                message: '登录成功',
                type: 'success',
                duration: 3000
            })

            // 在cookies中存储token
            setToken(res.token)

            // 跳转到首页
            router.push('/')
        }).finally(() => {
            loading.value = false
        })
    }
</script>