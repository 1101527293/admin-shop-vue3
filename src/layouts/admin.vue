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
                <router-view></router-view>
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
</style>