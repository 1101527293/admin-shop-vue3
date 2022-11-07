<template>
    <div>
        <el-tabs v-model="searchForm.tab" @tab-change="getData">
            <el-tab-pane v-for="item in tabbars" :key="item.key" :label="item.name" :name="item.key"></el-tab-pane>
        </el-tabs>

        <el-card shadow="never" class="border-0">
            <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
                <!-- 搜索 -->
                <SearchItem label="关键词">
                    <el-input v-model="searchForm.title" placeholder="关键词" clearable></el-input>
                </SearchItem>
                <!-- 高级搜索 -->
                <template #show>
                    <SearchItem label="商品分类">
                        <el-select v-model="searchForm.category_id" placeholder="请选择分类" clearable>
                            <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </SearchItem>
                </template>
            </Search>


            <!-- 新增和刷新 -->
            <ListHeader layout="create,refresh,delete" @create="handleCreate" @refresh="getData"
                @delete="handleMutiDelete">
                <el-button size="small" @click="handleMutiStatusChange(1)"
                    v-if="searchForm.tab == 'all' || searchForm.tab == 'off'">上架
                </el-button>
                <el-button size="small" @click="handleMutiStatusChange(0)"
                    v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'">下架
                </el-button>
            </ListHeader>


            <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
                style="width: 100%" v-loading="loading">
                <!-- 选择框 -->
                <el-table-column type="selection" width="55" />
                <!-- 商品信息 -->
                <el-table-column label="商品" width="300px">
                    <template #default="{ row }">
                        <div class="flex">
                            <el-image class="mr-3 rounded " :src="row.cover" fit="cover" :lazy="true"
                                style="width:50px; height:50px">
                            </el-image>
                            <div class="flex-1">
                                <p>{{ row.title }}</p>
                                <div>
                                    <span class="text-rose-500">￥{{ row.min_price }}</span>
                                    <el-divider direction="vertical" />
                                    <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
                                </div>
                                <p class="text-gray-400 text-xs mb-1">分类：{{ row.category ? row.category.name : "未分类" }}
                                </p>
                                <p class="text-gray-400 text-xs">创建时间：{{ row.create_time }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <!-- 实际销量 -->
                <el-table-column label="实际销量" align="center" width="80" prop="sale_count"></el-table-column>

                <!-- 商品状态 -->
                <el-table-column label="商品状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status == 1 ? 'success' : 'danger'" size="small">{{ row.status == 1 ? '上架' :
                                '仓库'
                        }}</el-tag>
                    </template>
                </el-table-column>

                <!-- 审核状态 -->
                <el-table-column label="审核状态" width="120" align="center">
                    <template #default="{ row }">
                        <div class="flex flex-col" v-if="row.ischeck == 0">
                            <el-button type="success" size="small" plain>审核通过</el-button>
                            <el-button class="mt-2 !ml-0" type="danger" size="small" plain>审核拒绝</el-button>
                        </div>
                        <span v-else>{{ row.ischeck == 1 ? '通过' : '拒绝' }}</span>
                    </template>
                </el-table-column>

                <!-- 总库存 -->
                <el-table-column label="总库存" align="center" width="90" prop="stock"></el-table-column>

                <!-- 操作 -->
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <div v-if="searchForm.tab != 'delete'">
                            <el-button class="px-1" type="primary" size="small" text @click="handleEdit(scope.row)">修改
                            </el-button>
                            <el-button class="px-1" type="primary" size="small" text @click="handleSetSkus(scope.row)">
                                商品规格</el-button>
                            <el-button class="px-1" :type="scope.row.goods_banner.length == 0 ? 'danger' : 'primary'"
                                size="small" text @click="handleSetBanners(scope.row)">设置轮播图</el-button>
                            <el-button class="px-1" :type="!scope.row.content ? 'danger' : 'primary'" size="small" text
                                @click="handleSetContent(scope.row)">商品详情</el-button>

                            <!-- scope.row 就可以拿到当前对象 -->
                            <el-popconfirm title="是否要删除该商品？" confirmButtonText="确认" cancelButtonText="取消"
                                @confirm="handleDelete(scope.row.id)">
                                <template #reference>
                                    <el-button type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <span v-else class="text-gray-500 text-sm">暂无操作</span>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页器 -->
            <div class="flex items-center justify-center mt-5">
                <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>

            <!-- 抽屉 -->
            <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
                <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                    <el-form-item label="商品名称" prop="title">
                        <el-input v-model="form.title" placeholder="商品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="封面" prop="cover">
                        <ChooseImage v-model="form.cover"></ChooseImage>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="category_id">
                        <el-select v-model="form.category_id" placeholder="选择所属商品分类" clearable>
                            <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="商品描述" prop="desc">
                        <el-input type="textarea" v-model="form.desc" placeholder="选填，商品描述"></el-input>
                    </el-form-item>

                    <el-form-item label="单位" prop="unit">
                        <el-input v-model="form.unit" placeholder="单位" style="width:50%"></el-input>
                    </el-form-item>

                    <el-form-item label="总库存" prop="stock">
                        <el-input type="number" v-model="form.stock" style="width:50%">
                            <template #append>件</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存预警" prop="min_stock">
                        <el-input type="number" v-model="form.min_stock" style="width:50%">
                            <template #append>件</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低售价" prop="min_price">
                        <el-input type="number" v-model="form.min_price" style="width:50%">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低原价" prop="min_orice">
                        <el-input type="number" v-model="form.min_orice" style="width:50%">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="库存显示" prop="stock_display">
                        <el-radio-group v-model="form.stock_display">
                            <el-radio :label="0">隐藏</el-radio>
                            <el-radio :label="1">显示</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="是否上架" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio :label="0">放入仓库</el-radio>
                            <el-radio :label="1">立即上架</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </FormDrawer>

        </el-card>

        <banners ref="bannersRef" @reload-data="getData"></banners>
        <content ref="contentRef" @reload-data="getData"></content>
        <skus ref="skusRef" @reload-data="getData"></skus>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { getGoodsList, updateGoodsStatus, createGoods, updateGoods, deleteGoods } from '~/api/goods.js'
import { getCategoryList } from "~/api/category.js"
import { toast } from '../../composables/utils';
import FormDrawer from '~/components/FormDrawer.vue';
import ChooseImage from '~/components/ChooseImage.vue';
import ListHeader from "~/components/ListHeader.vue"
import Search from "~/components/Search.vue"
import SearchItem from "~/components/SearchItem.vue"
import banners from "./banners.vue"
import content from "./content.vue"
import skus from "./skus.vue"
import { useInitTable, useInitForm } from '~/composables/useCommon.js';

const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    getData,
    handleDelete,
    handleStatusChange,
    handleSelectionChange,
    multipleTableRef,
    handleMutiDelete,
    handleMutiStatusChange
} = useInitTable({
    searchForm: {
        title: '',
        tab: "all",
        category_id: null
    },
    getList: getGoodsList,
    delete: deleteGoods,
    updateStatus: updateGoodsStatus,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            return o
        })
        total.value = res.totalCount
    }
})

const {
    formDrawerRef,
    formRef,
    form,
    rules,
    editId,
    drawerTitle,
    handleSubmit,
    resetForm,
    handleCreate,
    handleEdit
} = useInitForm({
    form: {
        title: null,
        category_id: null,
        cover: null,
        desc: null,
        unit: "件",
        stock: 100, // 总库存
        min_stock: 10, // 库存预警
        status: 1, // 是否上架 0.仓库 1.上架
        stock_display: 1, // 库存显示 0.隐藏 1.显示
        min_price: 1, // 最低销售价格
        min_oprice: 1 // 最低原价
    },
    rules: {
        username: [
            {
                required: true,
                message: '用户名不能为空',
                trigger: 'blur'
            }
        ],
        password: [
            {
                required: true,
                message: '密码不能为空',
                trigger: 'blur'
            }
        ]
    },
    getData,
    update: updateGoods,
    create: createGoods
})

const tabbars = [
    {
        key: "all",
        name: "全部"
    },
    {
        key: "checking",
        name: "审核"
    },
    {
        key: "saling",
        name: "出售中"
    },
    {
        key: "off",
        name: "已下架"
    },
    {
        key: "min_stock",
        name: "库存预警"
    },
    {
        key: "delete",
        name: "回收站"
    },
]

// 获取商品分类
const category_list = ref([])
getCategoryList().then(res => {
    category_list.value = res
})

const showSearch = ref(false)

// 设置轮播图
const bannersRef = ref(null)
const handleSetBanners = (row) => {
    bannersRef.value.open(row)
}

// 设置商品详情
const contentRef = ref(null)
const handleSetContent = (row) => {
    contentRef.value.open(row)
}

// 设置商品规格
const skusRef = ref(null)
const handleSetSkus = (row) => {
    skusRef.value.open(row)
}

</script>