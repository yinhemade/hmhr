<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="登录账户设置" name="first">
            <login-setting />
          </el-tab-pane>
          <el-tab-pane label="个人详情" name="second">
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="岗位信息" name="third">
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import JobInfo from './job-info.vue'
import loginSetting from './login-setting.vue'
import UserInfo from './user-info.vue'
export default {
  name: 'Detail',
  components: { loginSetting, JobInfo, UserInfo },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style scoped>
.clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
.box-card {
  padding: 10px 30px;
}
</style>
