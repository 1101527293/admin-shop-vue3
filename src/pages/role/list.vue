<template>
    <el-card shadow="never" class="border-0">
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
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="desc" label="角色描述" width="380" />
            <el-table-column label="状态" width="120">
                <template #default="{ row }">
                    <!-- $event 可以取到switch开关要切换到的状态 0或1 -->
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0" :disabled="row.super == 1"
                        :loading="row.statusLoading" @change="handleStatusChange($event, row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="openSetRule(scope.row)">配置权限</el-button>
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>

                    <!-- scope.row 就可以拿到当前对象 -->
                    <el-popconfirm title="是否要删除该角色？" confirmButtonText="确认" cancelButtonText="取消"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" text>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex items-center justify-center mt-5">
            <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="form.desc" type="textarea" :rows="5" placeholder="角色描述"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>

        </FormDrawer>

        <FormDrawer ref="setRuleFormDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
            <el-tree-v2 ref="elTreeRef" :data="ruleList" :props="{ label:'name', children:'child' }" show-checkbox
                :height="treeHeight" node-key="id" :default-expanded-keys="defaultExpandedKeys"
                :check-strictly="checkStrictly" @check="handleTreeCheck">
                <template #default="{ node, data}">
                    <div class="flex items-center">
                        <el-tag :type="data.menu ? '' : 'info'" size="small">{{ data.menu ? "菜单" : "权限"}}</el-tag>
                        <span class="ml-2 text-sm">{{ data.name }}</span>
                    </div>
                </template>
            </el-tree-v2>
        </FormDrawer>
    </el-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { getRoleList, createRole, updateRole, deleteRole, updateRoleStatus, setRoleRules } from '~/api/role.js'
import { getRuleList } from '~/api/rule.js'
import { toast } from '../../composables/utils';
import FormDrawer from '~/components/FormDrawer.vue';
import { useInitTable, useInitForm } from '~/composables/useCommon.js';

const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    getList: getRoleList,
    delete: deleteRole,
    updateStatus: updateRoleStatus
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
        name: "",
        desc: "",
        status: 1
    },
    rules: {
        name: [
            {
                required: true,
                message: '角色名称不能为空',
                trigger: 'blur'
            }
        ]
    },
    getData,
    update: updateRole,
    create: createRole
})

const setRuleFormDrawerRef = ref(null)
const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const defaultExpandedKeys = ref(0)
const elTreeRef = ref(null)
const ruleIds = ref([])
const checkStrictly = ref(false)

const openSetRule = (row) => {
    roleId.value = row.id
    treeHeight.value = window.innerHeight - 180
    checkStrictly.value = true
    getRuleList(1).then((res) => {
        ruleList.value = res.list
        defaultExpandedKeys.value = res.list.map(o => o.id)
        setRuleFormDrawerRef.value.open()

        // 角色拥有的权限id
        ruleIds.value = row.rules.map(o => o.id)
        setTimeout(() => {
            elTreeRef.value.setCheckedKeys(ruleIds.value)
            checkStrictly.value = false
        }, 150);
    })
}

const handleTreeCheck = (...e) => {
    const { checkedKeys, halfCheckedKeys } = e[1]
    ruleIds.value = [...checkedKeys, ...halfCheckedKeys]
}

const handleSetRuleSubmit = () => {
    setRuleFormDrawerRef.value.showLoading()
    setRoleRules(roleId.value, ruleIds.value)
        .then(res => {
            toast("配置成功")
            getData()
            setRuleFormDrawerRef.value.close()
        })
        .finally(() => {
            setRuleFormDrawerRef.value.hideLoading()
        })
}

</script>