<template>
  <!-- :visible.sync="dialogVisible"
    @update:visible="val => $emit('update:dialogVisible', false)"
  -->
  <el-dialog
    :title="isEdit ? '修改部门': '新增部门'"
    width="40%"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :before-close="handleClose"
    @close="whenClose"
  >
    <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:80%" placeholder="2-10个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:80%" placeholder="1-10个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
          <el-option
            v-for="employee in userList"
            :key="employee.id"
            :label="employee.username"
            :value="employee.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="cancelFn">取 消</el-button>
      <el-button type="primary" @click.native="confirmFn">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script>

export default {
  name: 'DepartDialog',
  props: {
    'dialogVisible': {
      type: Boolean
    },
    'userList': {
      type: Array,
      default: () => []
    },
    'formObj': {
      type: Object,
      default: () => {}
    },
    'originList': {
      type: Array,
      default: () => []
    },
    'isEdit': {
      type: Boolean,
      default: false
    },
    'clickDeptId': {
      type: String,
      default: ''
    }
  },
  data() {
    // 部门id不能相同
    const validcode = (_, value, callback) => {
      const codeList = this.originList.map(item => {
        if (this.isEdit) {
          if (item.id === this.clickDeptId) {
            return ''
          } else {
            return item.code
          }
        } else {
          return item.code
        }
      })
      console.log('过滤后', codeList)
      codeList.includes(value) ? callback(new Error(`部门编码 ${value} 已存在`)) : callback()
    }
    // 同级部门中不能存在同名的
    const validname = (_, value, callback) => {
      let nameList = this.originList.filter(item => item.pid === this.clickDeptId).map(item => item.name)
      if (this.isEdit) {
        const obj = this.originList.find(item => item.id === this.clickDeptId)
        const pid = obj.pid
        nameList = this.originList.filter(item => item.pid === pid && item.id !== this.clickDeptId).map(item => item.name)
      }
      nameList.includes(value) ? callback(new Error(`部门名字 ${value} 已存在`)) : callback()
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 2, max: 10, message: '部门名称要求2-10个字符', trigger: ['blur', 'change'] },
          { validator: validname, trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 10, message: '部门编码要求1-10个字符', trigger: ['blur', 'change'] },
          { validator: validcode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  watch: {
    'formObj'(newVal) {
      this.$nextTick(() => {
        this.form = newVal
      })
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    cancelFn() {
      this.$emit('update:dialogVisible', false)
    },
    confirmFn() {
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          this.$emit('toAddDept', { ...this.form })
          this.$emit('update:dialogVisible', false)
        }
      })
    },
    whenClose() {
      console.log('关闭了')
      this.$nextTick(() => {
        this.$refs.deptForm.resetFields()
      })
    }
  }
}
</script>

<style>

</style>
