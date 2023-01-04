<template>
  <div>
    <el-row>
      <el-col :span="8" :offset="8">
        <el-form ref="form" :model="loginInfoForm" label-width="80px">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="loginInfoForm.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginInfoForm.password" type="password" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="uploadUserInfo">立刻更新</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { requestOfBaseInfo, requestUploadEmployee } from '@/api'
export default {
  name: 'LoginSetting',
  data() {
    return {
      loginInfoForm: {},
      rules: {
        username: [
          { required: true, message: '用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 4, message: '长度在 3 到 4 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请选择输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 24, message: '长度在 3 到 24 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      // console.log(this.$route)
      const res = await requestOfBaseInfo(this.$route.query.id)
      this.loginInfoForm = res.data
    },
    uploadUserInfo() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const res = await requestUploadEmployee(this.loginInfoForm)
          this.$message.success(res.message)
        } else {
          this.$message.error('用户名或者密码格式不正确')
          return false
        }
      })
    }
  }
}
</script>

<style>
.form {
  width: 400px;
  margin-left: 120px;
}
</style>
