<template>

    <FormDrawer ref="formDrawerRef" title="设置商品详情" @submit="submit" destory-on-close>
        <el-form-item>
            <Editor v-model="form.content"></Editor>
        </el-form-item>
    </FormDrawer>

</template>

<script setup>
import { ref, reactive } from "vue"
import { readGoods, updateGoods } from "~/api/goods.js"
import FormDrawer from "~/components/FormDrawer.vue"
import Editor from "~/components/Editor.vue";
import { toast } from "~/composables/utils";

const formDrawerRef = ref(null)
const form = reactive({
    content: ""
})

const emit = defineEmits(["reloadData"])
const submit = () => {
    formDrawerRef.value.showLoading()
    updateGoods(goodsId.value, form)
        .then(res => {
            toast("设置商品详情成功")
            formDrawerRef.value.close()
            emit("reloadData")
        })
        .finally(() => {
            formDrawerRef.value.hideLoading()
        })
}

const goodsId = ref(0)
const open = (row) => {
    goodsId.value = row.id
    readGoods(goodsId.value).then(res => {
        form.content = res.content
        formDrawerRef.value.open()
    })
}

defineExpose({
    open
})
</script>