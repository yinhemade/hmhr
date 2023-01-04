<template>
  <el-dialog title="新增员工" :visible="showDialog" top="8vh" @close="closeDialog">
    <!-- 表单 -->
    <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width:50%"
          placeholder="请选择部门"
          @focus="departmentNameFocus"
        />
        <div v-if="showTree" class="tree-box">
          <el-tree :data="treeData" :props="{ label: 'name' }" @node-click="selectNode" />
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-button @click.native="closeDialog">取消</el-button>
      <el-button type="primary" @click.native="submitAdd">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant'
import { requestAddEmployee, requestGetDepartmentList } from '@/api'
import { transTree } from '@/utils'

export default {
  name: 'AddEmployee',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      },
      EmployeeEnum,
      treeData: [],
      showTree: false,
      clickDepartmentName: ''
    }
  },
  watch: {
    'formData.departmentName'(newVal) {
      // 这里用于避免部门名字被修改，也可以直接用readonly锁住
      if (newVal.length === 0) {
        return
      }
      if (newVal !== this.clickDepartmentName) {
        console.log(1)
        this.formData.departmentName = this.clickDepartmentName
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog', false)
      // 重置原来的数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 重置校验结果
      this.$refs.addForm.resetFields()
    },
    // 获取部门
    departmentNameFocus() {
      this.getDeptList()
    },
    async getDeptList() {
      const res = await requestGetDepartmentList()
      this.treeData = transTree(res.data.depts)
      this.showTree = true
    },
    selectNode(nodeData) {
      // 该还有子节点, 就是展开操作, 不选中
      if (nodeData.children && nodeData.children.length > 0) return
      this.formData.departmentName = nodeData.name
      this.clickDepartmentName = nodeData.name
      this.showTree = false
    },
    // 添加员工
    submitAdd() {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        await requestAddEmployee(this.formData) // 调用新增接口
        this.$message.success('添加成功')
        this.$emit('close-dialog', false)
      })
    }
  }
}
</script>
