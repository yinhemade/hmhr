<template>
  <div class="settings-container">
    <div class="app-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <!-- @tab-click="handleClick" -->
          <el-tabs v-model="activeName">
            <el-tab-pane label="用户管理" name="first">
              <!-- 1 -->
              <el-button
                style="margin: 30px 0;"
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="showDialog = true"
              >新增角色</el-button>
              <!-- 2 表格 -->
              <el-table
                :data="roleList"
                style="width: 100%"
                border
              >
                <el-table-column type="index" label="序号" width="120" />
                <el-table-column prop="name" label="名称" width="240" />
                <el-table-column prop="description" label="描述" />
                <el-table-column prop="address" label="操作">
                  <template slot-scope="{ row }">
                    <el-button size="small" type="success">分配权限</el-button>
                    <el-button size="small" type="primary" @click.native="edit(row.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click.native="delRole(row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 3 分页 -->
              <el-pagination
                layout="prev, pager, next"
                :total="total"
                justify="center"
                align="middle"
                :current-page="query.page"
                :page-size="query.pagesize"
                @current-change="pageChange"
              />
            </el-tab-pane>
            <el-tab-pane label="公司信息" name="second">
              <!-- 提示 -->
              <el-alert
                title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
                type="info"
                show-icon
              />
              <!-- 主体 -->
              <el-form ref="companyForm" :model="companyForm" label-width="80px" style="margin-top:50px; width: 500px;" disabled>
                <el-form-item label="公司名字">
                  <el-input v-model="companyForm.name" />
                </el-form-item>
                <el-form-item label="地址">
                  <el-input v-model="companyForm.address" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="companyForm.email" />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="companyForm.message" type="textarea" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
      <!-- 新增弹框 -->
      <el-dialog
        :title="roleForm.id?'编辑角色':'新增角色'"
        :visible="showDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="closeDialog"
      >
        <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click.native="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click.native="btnOK">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { requestAddRole, requestDelRole, requestGetCompanyInfo,
  requestGetRoleDetail, requestGetRoleList, requestUpdateRole, requestOfUserMessage } from '@/api'

export default {
  name: 'Settings',
  data() {
    return {
      activeName: 'first',
      companyForm: {},
      roleList: [],
      query: {
        page: 1,
        pagesize: 5
      },
      total: 0,
      // 弹窗
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const res = await requestGetRoleList(this.query)
      this.roleList = res.data.rows
      this.total = res.data.total
    },
    async getCompanyInfo() {
      const { data: { companyId }} = await requestOfUserMessage()
      const res = await requestGetCompanyInfo(companyId)
      const { name, companyAddress, mailbox, remarks } = res.data
      this.companyForm = { name: name, address: companyAddress, email: mailbox, message: remarks }
    },
    // 删除角色
    delRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 调用删除接口
        await requestDelRole(id)
        // 更新列表
        if (this.roleList.length === 1 && this.query.page !== 1) {
          this.query.page -= 1
        }
        this.getRoleList()
        // 提示用户
        this.$message.success('删除角色成功')
      }).catch()
    },
    // 页码变化
    pageChange(newPage) {
      console.log('newPage', newPage)
      this.query.page = newPage
      this.getRoleList()
    },
    // 弹窗点确定
    btnOK() {
      this.$refs.roleForm.validate(async validate => {
        if (validate) {
          // 编辑
          if (this.roleForm.id) {
            requestUpdateRole(this.roleForm).then(res => {
              // 重新拉取数据
              this.$message.success('更新角色成功')
            })
          } else {
            // 新增
            requestAddRole(this.roleForm).then(res => {
              // 重新拉取数据
              this.$message.success('新增角色成功')
            })
          }
          this.getRoleList()
          this.showDialog = false
        }
      })
    },
    // 弹窗点取消
    btnCancel() {
      // 清空表单数据
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      // 关闭弹框
      this.showDialog = false
    },
    // 编辑
    edit(id) {
      // 1.展开弹框
      this.showDialog = true
      // 2.回填数据
      this.getRoleDetail(id)
    },
    // 获取角色详情
    async getRoleDetail(id) {
      const res = await requestGetRoleDetail(id)
      // 回填操作
      this.roleForm = res.data
      console.log(res.data)
    },
    // 关闭弹窗
    closeDialog() {
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

</style>
