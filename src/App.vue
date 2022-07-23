<script setup>

</script>

<template>
  <router-view></router-view>
</template>

<style>
body {
  @apply bg-gray-100;
}

/* 加载进度条样式 */
#npogress .bar {
  background-color: #f4f4f4 !important;
  height: 3px !important;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
  height: 6px;
}

/* 滚动条边角部分 */
::-webkit-scrollbar-corner {
  display: block;
}

/* 滚动条方块部分 */
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-thumb,
::-webkit-scrollbar-thumb {
  border-right-color: transparent;
  border-left-color: transparent;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
