<template>
  <el-dialog
    title="券码管理"
    width="30%"
    :visible.sync="manageVisible">
    <el-form
      :model="form"
      ref="ruleForm"
      :rules="rules"
      label-width="80px">
      <el-form-item label="追加数量" prop="quantity">
        <el-input v-model.number="form.quantity" auto-complete="off" placeholder="请输入追加数量"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="manageVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    manageId: {

    }
  },
  data () {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('追加数量不能为空'))
      } else if (!Number.isInteger(value)) {
        callback(new Error('请输入大于0的数字值'))
      } else {
        callback()
      }
    }
    return {
      manageVisible: false,
      form: {
        quantity: ''
      },
      rules: {
        quantity: [
          { validator: checkAge, trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    manageId (newVal) {
      console.log(newVal)
      this.manageVisible = true
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
