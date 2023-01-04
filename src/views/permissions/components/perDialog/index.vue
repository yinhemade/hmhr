<template>
  <el-dialog :visible.sync="showDialog" title="弹层标题" @close="closeDialog">
    <el-form ref="form" label-width="100px" :model="formData">
      <el-form-item label="权限名称" prop="name" required>
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code" required>
        <el-input v-model="formData.code" />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="formData.description" />
      </el-form-item>
      <el-form-item label="权限启用">
        <el-switch
          v-model="formData.enVisible"
          active-text="启用"
          active-value="1"
          inactive-text="不启用"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="text-align: right;">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmFn">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>

export default {
  name: 'PerDialog',
  props: {
  },
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      },
      rules: {
        name: [
          { required: true, message: '请输入权限点名称', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '请输入权限点标识', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    confirmFn() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('addPer', { ...this.formData })
        } else {
          this.$message.error('请输入权限点名称和标识!')
          return false
        }
      })
    },
    closeDialog() {
      this.formData = {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      }
      this.$refs.form.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
