<template>
  <el-upload
    class="avatar-uploader"
    action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :http-request="customizeUploadFn"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
    <el-progress v-show="showProgress" type="circle" :percentage="percent" class="progress" />
  </el-upload>
</template>

<script>
var COS = require('cos-js-sdk-v5')

// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'AKIDNacR5asxsa5NPNAjOnz66speIoJhspXy',
  SecretKey: 'QabHogV9Wu48ZpqcCamjS1LVR8g6LM8f'
})
export default {
  name: 'UploadImg',
  data() {
    return {
      imageUrl: '',
      showProgress: false,
      percent: 0
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImg) {
        this.$message.error('上传头像图片只能是 JPG/JPEG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isImg && isLt2M
    },
    // 自定义上传事件
    customizeUploadFn(fileObj) {
      this.showProgress = true
      console.log(fileObj.file, this)
      cos.uploadFile({
        Bucket: 'linwyuanhmrz-1316392093', /* 填写自己的bucket，必须字段 */
        Region: 'ap-guangzhou', /* 存储桶所在地域，必须字段 */
        Key: fileObj.file.name, /* 存储在桶里的对象键（例如:1.jpg，a/b/test.txt，图片.jpg）支持中文，必须字段 */
        Body: fileObj.file, // 上传文件对象
        SliceSize: 1024 * 1024 * 2, /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
        onProgress: (progressData) => {
          this.percent = parseInt(progressData.percent * 100)
        }
      }, (err, data) => {
        if (err) {
          console.log('上传失败' + err)
        } else {
          this.$message.success('图片' + fileObj.file.name + ' 上传成功')
          this.imageUrl = 'http://' + data.Location
          setTimeout(() => { this.showProgress = false }, 500)
        }
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: #fff;
}
</style>
