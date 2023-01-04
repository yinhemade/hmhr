<template>
  <div>
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="role in allRoleList" :key="role.id" :label="role.id">{{ role.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="comfirmFn">确定</el-button>
        <el-button size="small" @click="cancelFn">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssignRoleDialog',
  props: {
    allRoleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkList: []
    }
  },
  methods: {
    cancelFn() {
      this.$emit('update:show', false)
    },
    comfirmFn() {
      this.$emit('assignRoled', this.checkList)
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss">
.footer {
  margin-top: 30px;
}
</style>
