<template>
  <div class="app-container">
    <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import { requestImportEmployee } from '@/api'
import { formatExcelDate } from '@/utils'

export default {
  name: 'Import',
  data() {
    return {
      tableData: [],
      tableHeader: [],
      userRelations: {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: '文件大小请不要大于1M',
        type: 'warning'
      })
      return false
    },
    async handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header

      // 处理数据
      // 遍历数据
      const newArr = results.map(obj => {
        const newObj = {}
        const keyArr = Object.keys(obj)
        keyArr.forEach(zhKey => {
          const enKey = this.userRelations[zhKey]
          if (enKey === 'correctionTime' || enKey === 'timeOfEntry') {
            newObj[enKey] = formatExcelDate(obj[zhKey])
          } else {
            newObj[enKey] = obj[zhKey]
          }
        })
        return newObj
      })
      const res = await requestImportEmployee(newArr)
      this.$message.success(res.message)
      this.$router.back()
    }
  }
}
</script>
