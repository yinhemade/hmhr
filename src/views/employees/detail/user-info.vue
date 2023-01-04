<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="工号" prop="workNumber">
            <el-input v-model="ruleForm.workNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职日期" required prop="timeOfEntry">
            <el-date-picker
              v-model="ruleForm.timeOfEntry"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              format="yyyy年 M月 d日"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="ruleForm.username" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="departmentName">
            <el-input v-model="ruleForm.departmentName" placeholder="请选择活动区域" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="ruleForm.mobile" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="聘用形式" prop="formOfEmployment">
            <el-select v-model="ruleForm.formOfEmployment" placeholder="请选择活动区域">
              <el-option
                v-for="item in EmployeeEnum.hireType"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="员工照片">
        <upload-img ref="uploadImg" />
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="uploadUserInfo">立刻保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { requestOfBaseInfo, requestUploadEmployee } from '@/api'
import EmployeeEnum from '@/api/constant'

export default {
  name: 'UserInfo',
  data() {
    return {
      ruleForm: {},
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 14, message: '用户姓名为1-14位', trigger: ['blur', 'change'] }
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
      EmployeeEnum
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      // console.log(this.$route)
      const res = await requestOfBaseInfo(this.$route.query.id)
      this.ruleForm = res.data
      // 添加聘用形式
      this.$set(this.ruleForm, 'formOfEmployment', parseInt(this.$route.query.formId))
      // 修改时间格式
      // let time = this.ruleForm.timeOfEntry
      // 头像回显
      this.$refs.uploadImg.imageUrl = this.ruleForm.staffPhoto
    },
    // 返回
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 提交表格
    uploadUserInfo() {
      this.ruleForm.staffPhoto = this.$refs.uploadImg.imageUrl
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          const res = await requestUploadEmployee(this.ruleForm)
          this.$message.success(res.message)
        }
      })
      this.getUserInfo()
    }
  }
}
</script>

<style>

</style>
