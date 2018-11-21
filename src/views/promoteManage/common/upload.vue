<template>
  <div class="upload-wrapper">
    <el-button
      type="primary"
      size="mini"
      :loading='loading'
      @click="innerVisibl=true">
      <i class="el-icon-upload2"></i>
      批量导入
    </el-button>

    <el-dialog
      title="批量上传"
      append-to-body
      width="30%"
      :visible.sync="innerVisibl">
      <el-form label-width="80px">
        <el-form-item label="选择文件">
          <div class="upload-btn">
            <input
            type="file"
            name="file"
            id="file"
            ref="uploadFile"
            @change="handleChangeFile"
            auto-complete="off">
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisibl = false">取 消</el-button>
        <el-button type="primary" @click="templateImport">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  importTemplate,
  ERR_OK
} from 'api/promoteManage/coupon/index'
export default {
  props: {
    uploadType: {
      type: String,
      require: true
    },
    templateId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      innerVisibl: false,
      file: '',
      uploadFile: Object
    }
  },
  methods: {
    handleChangeFile () {
      this.file = this.$refs.uploadFile.files[0]
      const fileName = this.file.name

      const idx = fileName.lastIndexOf('.')
      const ext = fileName.substr(idx + 1).toLowerCase()

      if (ext !== 'csv') {
        this.$message({
          message: '只能上传.csv格式的文件',
          type: 'warning'
        })
        this.$refs.uploadFile.value = ''
        return
      }

      this.uploadFile = new FormData()
      this.uploadFile.append('fileUpload', this.file)
      this.uploadFile.append('couponTemplateId', this.templateId)
      this.uploadFile.append('uploadType', this.uploadType)
    },
    templateImport () {
      if (!this.file) {
        this.$message({
          message: '请先上传文件',
          type: 'warning'
        })
        return
      }
      this.loading = true
      importTemplate(this.uploadFile).then((res) => {
        this.innerVisibl = false
        this.loading = false
        if (res.responseCode === ERR_OK) {
          this.$message({
            message: '文件导入成功',
            type: 'success'
          })
          this.$emit('uploadResult', 'success')
        } else {
          this.$message(res.message)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.upload-wrapper{
  display: inline;
}
.upload-btn{
  height: 30px;
  margin-top: 5px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  input{
    margin-left: -72px;
    outline: none;
    vertical-align: top;
    line-height: 22px;
  }
}
</style>
