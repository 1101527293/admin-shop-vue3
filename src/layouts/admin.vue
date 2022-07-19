<template>
    <el-container>
        <!-- 头部区域 -->
        <el-header>
            <f-header></f-header>
        </el-header>
        <el-container>
            <!-- 侧边栏区域 -->
            <el-aside :width="$store.state.asideWidth">
                <f-menu></f-menu>
            </el-aside>

            <!-- 主体区域 -->
            <el-main>
                <!-- 标签导航栏 -->
                <f-tag-list></f-tag-list>

                <!-- 内容主体 -->
                <router-view v-slot="{ Component }">
                    <!-- 动画效果 -->
                    <transition name="fade">
                        <keep-alive :max="5">
                            <component :is="Component"></component>
                        </keep-alive>
                    </transition>
                </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import FHeader from './components/FHeader.vue'
import FMenu from './components/FMenu.vue'
import FTagList from './components/FTagList.vue'
</script>

<style>
.el-aside {
    transition: all 0.2s;
}

/* 进入前 */
.fade-enter-from {
    opacity: 0;
}

/* 进入后 */
.fade-enter-to {
    opacity: 1;
}

/* 离开前 */
.fade-leave-from {
    opacity: 1;
}

/* 离开后 */
.fade-leave-to {
    opacity: 0;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s;
}

/* 延迟 */
.fade-enter-active {
    transition-delay: 00.3s;
}
</style>