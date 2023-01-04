<template>
  <el-image :src="src" class="avatar" lazy>
    <!-- 具名插槽新语法  图片加载出错的时候自动显示 -->
    <template #error>
      <!-- <i class="el-icon-picture-outline" /> -->
      <img src="./bigUserHeader.png" width="170">
    </template>
  </el-image>
</template>

<script>
export default {
  name: 'ImageHolder',
  props: {
    src: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
/* .avatar {
  width: 178px;
  height: 178px;
  display: block;
} */
</style>
