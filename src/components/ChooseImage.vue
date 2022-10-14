<template>
    <div class="choose-image-btn">
        <div v-if="modelValue">
            <el-image :src="modelValue" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
        </div>
        <el-icon :size="25" class="text-gray-400" @click="open">
            <Plus />
        </el-icon>
        <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">
            <!-- 默认插槽 内容部分 -->
            <el-container class="bg-white rounded" style="height: 70vh;">
                <el-header class="image-header">
                    <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
                    <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>

                </el-header>
                <el-container>
                    <ImageAside ref="imageAsideRef" @change="handleAsideChange"></ImageAside>

                    <ImageMain openChoose ref="imageMainRef" @choose="handleChoose"></ImageMain>
                </el-container>
            </el-container>

            <template #footer>
                <span>
                    <el-button @click="close">取消</el-button>
                    <el-button type="primary" @click="submit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ImageAside from '~/components/ImageAside.vue'
import ImageMain from '~/components/ImageMain.vue'

const dialogVisible = ref(false)

const open = () => dialogVisible.value = true

const close = () => dialogVisible.value = false

const submit = () => {
    if (urls.length) {
        emit('update:modelValue', urls[0])
    }
    close()
}

const imageAsideRef = ref(null)
const imageMainRef = ref(null)

const handleOpenCreate = () => imageAsideRef.value.handleCreate()

const handleAsideChange = (image_class_id) => imageMainRef.value.loadData(image_class_id)

const handleOpenUpload = () => imageMainRef.value.openUploadFile()

const props = defineProps({
    modelValue: [String, Array]
})
const emit = defineEmits(['update:modelValue'])

let urls = []
const handleChoose = (e) => {
    urls = e.map(o => o.url)
}

</script>

<style>
.choose-image-btn {
    @apply w-[100px] h-[100px] rounded border flex items-center justify-center cursor-pointer hover: (bg-gray-100);
}

.image-header {
    @apply flex items-center;
    border-bottom: 1px solid #eee;
}

.image-aside {
    border-right: 1px solid #eee;
    position: relative;
}

.image-main {
    position: relative;
}

.image-aside .top,
.image-main .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-aside .bottom,
.image-main .bottom {
    @apply flex items-center justify-center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
}
</style>