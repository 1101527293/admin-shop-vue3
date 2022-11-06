<template>
    <el-drawer title="设置轮播图" v-model="dialogVisible" size="50%" destroy-on-close>
        <el-form :model="form" label-width="80px">
            <el-form-item label="轮播图">
                <ChooseImage v-model="form.banners" :limit="9"></ChooseImage>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
            </el-form-item>
        </el-form>

    </el-drawer>

</template>

<script setup>
import { ref, reactive } from "vue"
import { readGoods, setGoodsBanner } from "~/api/goods.js"
import ChooseImage from "~/components/ChooseImage.vue"
import { toast } from "~/composables/utils";

const dialogVisible = ref(false)
const form = reactive({
    banners: []
})

const loading = ref(false)
const submit = () => {
    loading.value = true
    setGoodsBanner(goodsId.value, form)
        .then(res => {
            toast("设置轮播图成功")
            dialogVisible.value = false
        })
        .finally(() => {
            loading.value = false
        })
}

const goodsId = ref(0)
const open = (row) => {
    goodsId.value = row.id
    readGoods(goodsId.value).then(res => {
        form.banners = res.goodsBanner.map(o => o.url)
    })
    dialogVisible.value = true
}

defineExpose({
    open
})
</script>