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
            <div class="flex items-center justify-between mb-4">
                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>

                <el-tooltip class="box-item" effect="dark" content="刷新数据" placement="top">
                    <el-button text @click="getData">
                        <el-icon :size="20">
                            <Refresh />
                        </el-icon>
                    </el-button>
                </el-tooltip>
            </div>

            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
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
                        <el-tag :type="row.status == 0 ? 'success' : 'danger'" size="small">{{ row.status == 0 ? '上架' :
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
                            <el-button class="px-1" type="primary" size="small" text @click="">商品规格</el-button>
                            <el-button class="px-1" type="primary" size="small" text @click="">设置轮播图</el-button>
                            <el-button class="px-1" type="primary" size="small" text @click="">商品详情</el-button>

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
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item label="头像" prop="avatar">
                        <ChooseImage v-model="form.avatar"></ChooseImage>
                    </el-form-item>
                    <el-form-item label="所属角色" prop="role_id">
                        <el-select v-model="form.role_id" value-key="" placeholder="选择所属角色" clearable filterable
                            @change="">
                            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>

                    </el-form-item>
                    <el-form-item label="状态">
                        <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                        </el-switch>
                    </el-form-item>
                </el-form>
            </FormDrawer>

        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { getGoodsList, updateGoodsStatus, createGoods, updateGoods, deleteGoods } from '~/api/goods.js'
import { getCategoryList } from "~/api/category.js"
import { toast } from '../../composables/utils';
import FormDrawer from '~/components/FormDrawer.vue';
import ChooseImage from '~/components/ChooseImage.vue';
import Search from "~/components/Search.vue"
import SearchItem from "~/components/SearchItem.vue"
import { useInitTable, useInitForm } from '~/composables/useCommon.js';

const roles = ref([])

const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    getData,
    handleDelete,
    handleStatusChange
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
        roles.value = res.roles
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
        username: '',
        password: '',
        role_id: null,
        status: 1,
        avatar: ''
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
    category_list.value = res.list
})

const showSearch = ref(false)

</script>