<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-tabs v-model="activeName">
            <el-tab-pane label="组织架构" name="first" class="tab-pane">
              <!-- 头部 -->
              <el-row
                align="middle"
                class="department-header"
                type="flex"
                justify="space-between"
              >
                <el-col :span="20">
                  <i class="el-icon-s-home" />
                  <span class="company">后台人力资源管理系统</span>
                </el-col>
                <el-col :span="4">
                  <el-row
                    tyep="flex"
                    justify="end"
                  >
                    <el-col :span="12">负责人</el-col>
                    <el-col :span="12">
                      <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item icon="el-icon-plus" @click.native="addDept">添加子部门</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!-- 列表 -->
              <el-tree
                class="department-tree"
                :data="departmentList"
                :props="defaultProps"
                node-key="id"
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
              >
                <template slot-scope="{ data }">
                  <el-row
                    type="flex"
                    justify="space-between"
                    align="middle"
                    style="width:100%; height:40px;"
                  >
                    <el-col :span="20">
                      <span>{{ data.name }}</span>
                    </el-col>
                    <el-col :span="4">
                      <el-row justify="end" type="flex">
                        <el-col :span="12">
                          <span>{{ data.manager }}</span>
                        </el-col>
                        <el-col :span="12">
                          <el-dropdown trigger="click">
                            <span class="el-dropdown-link">
                              操作<i class="el-icon-arrow-down el-icon--right" />
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item icon="el-icon-plus" @click.native="addDept(data)">添加子部门</el-dropdown-item>
                              <el-dropdown-item icon="el-icon-edit-outline" @click.native="editDept(data)">编辑部门</el-dropdown-item>
                              <el-dropdown-item v-if="data.children.length === 0" icon="el-icon-minus" @click.native="delDept(data)">删除部门</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
      <depart-dialog
        ref="departDialog"
        :dialog-visible.sync="dialogVisible"
        :user-list="userList"
        :form-obj="clickDept"
        :origin-list="originList"
        :click-dept-id="clickDeptId"
        :is-edit="isEdit"
        @toAddDept="addDepartment"
      />
      <!-- @showDialog="changeDia" -->
    </div>
  </div>
</template>

<script>
import { requestAddDept, requestDelDept, requestDeptDeta, requestGetDepartmentList,
  requestGetSimpleUserList, requestUpdateDept } from '@/api'
import { transTree } from '@/utils'
import departDialog from './components/departDialog'
export default {
  name: 'Departments',
  components: {
    departDialog
  },
  data() {
    return {
      activeName: 'first',
      departmentList: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogVisible: false,
      userList: [],
      clickDeptId: '',
      clickDept: {},
      isEdit: false,
      originList: {}
    }
  },
  created() {
    this.getDeptInfo()
    this.getSimpleUserList()
  },
  methods: {
    // 获取部门列表数据
    async getDeptInfo() {
      const Dept = await requestGetDepartmentList()
      this.originList = Dept.data.depts.map(item => (
        {
          id: item.id,
          code: item.code,
          name: item.name,
          pid: item.pid
        })
      )
      this.departmentList = transTree(Dept.data.depts)
    },
    // 用户简单列表
    async getSimpleUserList() {
      const list = await requestGetSimpleUserList()
      this.userList = list.data
    },
    // 增、改窗口
    async addDepartment(dataForm) {
      let res = {}
      if (this.isEdit) {
        res = await requestUpdateDept(dataForm)

        // console.log(dataForm)
        // console.log({ ...this.clickDept, ...dataForm })
      } else {
        dataForm.pid = this.clickDeptId
        res = await requestAddDept(dataForm)
        console.log(2)
      }
      this.$message.success(res.message)
      this.getDeptInfo()
    },
    // tree组件的节点的点击事件
    handleNodeClick(data) {
      this.clickDeptId = data ? data.id : ''
      console.log(data, this.clickDeptId)
    },
    // 下拉菜单操作总管
    // 增-部门
    addDept(data) {
      this.isEdit = false
      this.dialogVisible = true
    },
    // 改-部门
    async editDept(data) {
      this.isEdit = true
      const res = await requestDeptDeta(data.id)
      this.clickDept = res.data
      this.dialogVisible = true
    },
    // 删-部门
    async delDept(data) {
      const res = await requestDelDept(data.id)
      this.$message.success(res.message)
      this.getDeptInfo()
    },
    // 关闭弹窗
    changeDia(status) {
      console.log(4)
      this.dialogVisible = status
    }

  }
}
</script>

<style lang="scss">
.box-card {
  padding: 10px 30px;
}
.tab-pane {
  padding: 20px 80px;
  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }
  .department-header {
    height: 50px;
    display: flex;
    align-content: center;
    border-bottom: 1px solid #ccc;
  }
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
.el-icon-arrow-down {
  font-size: 12px;
}
.department-tree{
  margin-top: 20px;
}
</style>
