<template>
    <div v-if="modelValue && preview">
        <el-image v-if="typeof modelValue == 'string'" :src="modelValue" fit="cover"
            class="w-[100px] h-[100px] rounded border mr-2"></el-image>
        <div v-else class="flex flex-wrap">
            <div class="relative mx-1 mb-2 w-[100px] h-[100px]" v-for="(url, index) in modelValue" :key="index">
                <el-icon class="absolute right-[5px] top-[5px] cursor-pointer bg-white rounded-full" style="z-index:10"
                    @click="removeImage(url)">
                    <CircleClose />
                </el-icon>
                <el-image :src="url" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
            </div>
        </div>
    </div>
    <div v-if="preview" class="choose-image-btn" @click="open">
        <el-icon :size="25" class="text-gray-400">
            <Plus />
        </el-icon>
    </div>
    <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">
        <!-- 默认插槽 内容部分 -->
        <el-container class="bg-white rounded" style="height: 70vh;">
            <el-header class="image-header">
                <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
                <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>

            </el-header>
            <el-container>
                <ImageAside ref="imageAsideRef" @change="handleAsideChange"></ImageAside>

                <ImageMain :limit="limit" openChoose ref="imageMainRef" @choose="handleChoose"></ImageMain>
            </el-container>
        </el-container>

        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import ImageAside from '~/components/ImageAside.vue'
import ImageMain from '~/components/ImageMain.vue'
import { toast } from '../composables/utils';

const dialogVisible = ref(false)

const callbackFunction = ref(null)
const open = (callback = null) => {
    dialogVisible.value = true
    callbackFunction.value = callback
}
const close = () => dialogVisible.value = false

const submit = () => {
    let value = null
    if (props.limit == 1) {
        value = urls[0]
    } else {
        value = props.preview ? [...props.modelValue, ...urls] : [...urls]
        if (value.length > props.limit) {
            let limit = props.preview ? (props.limit - props.modelValue.length) : props.limit
            return toast("最多还能传" + limit + "张图片")
        }
    }
    if (value && props.preview) {
        emit('update:modelValue', value)
    }
    if (!props.preview && typeof callbackFunction.value == "function") {
        callbackFunction.value(value)
    }
    close()
}

const imageAsideRef = ref(null)
const imageMainRef = ref(null)

const handleOpenCreate = () => imageAsideRef.value.handleCreate()

const handleAsideChange = (image_class_id) => imageMainRef.value.loadData(image_class_id)

const handleOpenUpload = () => imageMainRef.value.openUploadFile()

const props = defineProps({
    modelValue: [String, Array],
    limit: {
        type: Number,
        default: 1
    },
    preview: {
        type: Boolean,
        default: true
    }
})
const emit = defineEmits(['update:modelValue'])

let urls = []
const handleChoose = (e) => {
    urls = e.map(o => o.url)
}

const removeImage = (url) => {
    emit("update:modelValue", props.modelValue.filter(item => item != url))

}

defineExpose({
    open,
    close
})

</script>

<style>
.choose-image-btn {
    @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover: (bg-gray-100);
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