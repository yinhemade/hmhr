<template>
  <div class="permissions-container">
    <div class="app-container">
      <pageTools :no-left="noLeft">
        <template #right>
          <div style="text-align: right;">
            <el-button type="primary" size="small" @click="addPermissionFn(1,'0')">添加权限</el-button>
          </div>
        </template>
      </pageTools>
      <!-- 表格 -->
      <el-card class="permissions-footer">
        <el-table
          border
          :data="permissionList"
          row-key="id"
        >
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button v-if="row.type === 1" type="text" @click="addPermissionFn(2, row.id)">添加</el-button>
              <el-button type="text">编辑</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 添加权限的弹窗 -->
      <perDialog
        ref="permissionDialog"
        @addPer="clickSubmit"
      />
    </div>
  </div>
</template>

<script>
import { requestAddPermission, requestGetPermissionList } from '@/api'
import perDialog from './components/perDialog'
import { transTree } from '@/utils'

export default {
  name: 'Permissions',
  components: {
    perDialog
  },
  data() {
    return {
      // 用于控制头部组件的左侧部分不出现
      noLeft: false,
      // 权限点列表
      permissionList: [],
      formData: {}
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const res = await requestGetPermissionList()
      this.permissionList = transTree(res.data)
    },
    /**
     * 添加权限--方法
     * @param {*} type 页面权限点：1；功能权限点：2
     * @param {*} pid 页面权限：'0'；功能权限：父对象id字符串
     */
    addPermissionFn(type, pid) {
      this.$refs.permissionDialog.showDialog = true
      this.$refs.permissionDialog.formData.type = type
      this.$refs.permissionDialog.formData.pid = pid
    },
    async clickSubmit(formData) {
      const res = await requestAddPermission(formData)
      this.$message.success(res.message)
      this.getPermissionList()
      this.$refs.permissionDialog.showDialog = false
    }
  }
}
</script>

<style>
.permissions-footer{
  margin-top: 10px;
}
</style>
