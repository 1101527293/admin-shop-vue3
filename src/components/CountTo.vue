<template>
    {{ d.num.toFixed(0) }}
</template>

<script setup>
import { reactive, watch } from 'vue';
import gsap from 'gsap'

const d = reactive({
    num: 0
})

const props = defineProps({
    value: {
        type: Number,
        default: 0
    }
})

// 从 d 增加到 props.value
function AnimateToValue() {
    gsap.to(d, {
        duration: 0.5,
        num: props.value
    })
}

AnimateToValue()

// 监听如果数值变化，则重新执行动画
watch(() => props.value, () => AnimateToValue())
</script>