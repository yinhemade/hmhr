<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 上半卡片 -->
      <page-tools>
        <!-- 插入到left插槽位置 -->
        <template #left>
          <span>本月: 社保在缴 公积金在缴</span>
        </template>
        <!-- 插入到right插槽位置 -->
        <template #right>
          <el-button type="primary" size="small" @click="ImportExcel">导入excel</el-button>
          <el-button type="primary" size="small" @click="ExportExcel">导出excel</el-button>
          <el-button type="primary" size="small" @click.native="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 下半卡片 -->
      <el-card style="margin-top: 10px;">
        <el-table
          border
          :data="list"
          :default-sort="{prop: 'workNumber'}"
        >
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" width="200">
            <template #default="scope">
              <!-- <img :src="scope.row.staffPhoto" alt="" width="80"> -->
              <image-holder :src="scope.row.staffPhoto" class="avatar" />
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="workNumber" sortable :sort-method="workNumberSort" />
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template #default="{row}">
              <!-- 插值表达式支持函数执行 并且渲染的是函数的return值 -->
              {{ formatEmployment(row.formOfEmployment) }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable :formatter="formatDate" />
          <el-table-column label="账户状态" prop="enableState" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="DetailEmployee(row.id, row.formOfEmployment)">查看</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small" @click="assignRoleBtnFn(row)">角色</el-button>
              <el-button type="text" size="small" @click.native="DelEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div style="margin-top: 10px">
          <el-pagination
            layout="total, prev, pager, next, jumper, ->,sizes"
            :total="total"
            :current-page="params.page"
            :page-sizes="[4, 6, 7, 8, 10]"
            :page-size="params.size"
            align="middle"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
      <!-- 新增 弹窗 -->
      <AddEmployee
        :show-dialog="showDialog"
        @close-dialog="closeDialog"
      />
      <!-- 分配角色 弹窗 -->
      <el-dialog
        title="分配角色"
        :visible.sync="showRoleDialog"
      >
        <assignRoleDialog
          ref="assignRoleDialog"
          :show.sync="showRoleDialog"
          :all-role-list="allRoleList"
          @assignRoled="addRoleForEmp"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { requestAssignRole, requestDelEmployee,
  requestGetEmployeeList, requestGetRoleList, requestOfBaseInfo } from '@/api'
import EmployeeType from '@/api/constant'
import AddEmployee from './components/AddEmployee'
import assignRoleDialog from './components/assignRoleDialog'
import dayjs from 'dayjs'

export default {
  name: 'Employees',
  components: {
    AddEmployee,
    assignRoleDialog
  },
  data() {
    return {
      list: [],
      params: {
        page: 1, // 当前页
        size: 6 // 每页条数
      },
      total: 0, // 总数
      loading: false,
      // 新增=弹窗
      showDialog: false,
      // 角色=弹窗
      showRoleDialog: false,
      // 某员工的角色列表
      allRoleList: [],
      // 所选员工---分配角色
      clickedroleId: ''
    }
  },
  created() {
    this.getEmployeeList()
    this.getAllRoles()
  },
  methods: {
    // all为所有
    async getEmployeeList(choose = 'some') {
      if (choose === 'all') {
        this.params.size = this.total
        this.params.page = 1
      }
      this.loading = true
      const res = await requestGetEmployeeList(this.params)
      const { total, rows } = res.data
      this.total = total
      this.list = rows
      this.loading = false
    },
    async getAllRoles() {
      const res = await requestGetRoleList({
        page: 1,
        pagesize: 5
      })
      const allRoleList = await requestGetRoleList({
        page: 1,
        pagesize: res.data.total
      })
      this.allRoleList = allRoleList.data.rows
    },
    // 每一页大小
    handleSizeChange(newSize) {
      console.log(newSize)
      this.params.size = newSize
      this.getEmployeeList()
    },
    // 切换页码
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.params.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式函数
    formatEmployment(type) {
      // 根据源数据经过处理 把处理之后的数据返回
      // 定义一个映射结构
      // {1::'正式', 0:'非正式'}
      const map = {
        1: '正式',
        2: '非正式'
      }
      return map[type] ? map[type] : '未知'
    },
    // 格式化入职日期函数
    formatDate(row, dom, value, _, str = 'YYYY-MM-DD') {
      /* 参数：
      第一个参数是当前列row
      第二个参数是当前的dom结构
      第三个参数是当前的值
      第四个是0或1
      没有第五个值 */
      return dayjs(value).format(str)
    },
    // 工号排序
    workNumberSort(a, b) {
      // 由小到大排序
      return parseInt(a.workNumber) - parseInt(b.workNumber)
    },
    // 删除员工
    async DelEmployee(id) {
      const res = await requestDelEmployee(id)
      this.$message.success(res.message)
      if (this.list.length === 1 && this.params.page !== 1) {
        this.params.page--
      }
      this.getEmployeeList()
    },
    // 关闭弹窗
    closeDialog() {
      this.showDialog = false
    },
    // 导入Excel
    ImportExcel() {
      this.$router.push('/import')
    },
    // 导出Excel
    ExportExcel() {
      import('@/vendor/Export2Excel')
        .then(async excel => {
          // 中英文对照
          const headerRelation = {
            '手机号': 'mobile',
            '姓名': 'username',
            '入职日期': 'timeOfEntry',
            '工号': 'workNumber',
            '转正日期': 'correctionTime',
            '部门': 'departmentName',
            '聘用形式': 'formOfEmployment'
          }
          const tHeader = ['序号', '姓名', '手机号', '入职日期', '聘用形式', '工号', '转正日期', '部门']
          await this.getEmployeeList('all')
          const data = this.list.map((enObj, index) => {
            const newArr = []
            tHeader.forEach(header => {
              if (header === '序号') {
                newArr.push(++index)
              } else {
                // 若不是序号列，通过 中文列名 获得 英文名
                const enName = headerRelation[header]
                // 通过英文名，在enObj中获取值
                if (enName === 'formOfEmployment') {
                  const obj = EmployeeType.hireType.find(item => item.id === parseInt(enObj[enName]))
                  console.log(enObj[enName])
                  newArr.push(obj ? obj.value : '未知')
                } else {
                  const value = enObj[enName]
                  newArr.push(value)
                }
              }
            })
            return newArr
          })
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '员工数据表',
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.handleSizeChange(6)
        })
    },
    // 员工详情
    DetailEmployee(id, formId) {
      this.$router.push(`/detail?id=${id}&formId=${formId}`)
    },
    // 分配角色弹窗--出现
    async assignRoleBtnFn(employeeObj) {
      this.showRoleDialog = true
      const res = await requestOfBaseInfo(employeeObj.id)
      this.clickedroleId = employeeObj.id
      this.$refs.assignRoleDialog.checkList = [...res.data.roleIds]
    },
    async addRoleForEmp(rolelist) {
      const res = await requestAssignRole({
        id: this.clickedroleId,
        roleIds: [...rolelist]
      })
      this.$message.success(res.message)
    }
  }

}
</script>

<style>
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
