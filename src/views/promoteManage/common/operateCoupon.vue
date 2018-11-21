<template>
  <div class="addCoupon">
      <el-dialog :visible.sync="operateCouponData.isShow" center>
        <div slot="title" class="dialog-title">{{dialogTitle}}</div>
        <el-form
          label-width="110px"
          size="mini"
          :disabled="isAllDisable"
          :model="formData"
          :rules="rules"
          ref="addCouponForm">
          <el-form-item label="类型:" prop="templateType">
            <el-select v-model="formData.templateType" :disabled="isSomeDisable">
              <el-option v-for="(val,key) in templateTypeMap" :key="key" :label="val" :value="key"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="优惠券种类:" prop="couponType">
            <el-select v-model="formData.couponType" :disabled="isSomeDisable">
              <el-option v-for="(val,key) in couponTypeMap" :key="key" :label="val" :value="key"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="规则类型:" prop="couponRange">
            <el-select v-model="formData.couponRange" :disabled="isSomeDisable">
              <el-option v-for="(val,key) in couponRangeMap" :key="key" :label="val" :value="key"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="优惠券名称:" prop="couponName">
            <el-input v-model="formData.couponName"></el-input>
          </el-form-item>

          <el-form-item label="优惠券描述:" prop="couponDesc">
            <el-input
              type="textarea"
              :rows="2"
              v-model="formData.couponDesc">
            </el-input>
          </el-form-item>

          <div class="discount-type">
            <el-form-item class="is-required" label="优惠方式:" prop="thresholdAmount">
              <div class="discount-type-item">
                满<el-input v-model="formData.thresholdAmount" placeholder="元" :disabled="isSomeDisable"></el-input>
              </div>
            </el-form-item>
            <el-form-item style="margin-left: -110px;" prop="deductibleAmount">
              <div class="discount-type-item">
                减<el-input v-model="formData.deductibleAmount" placeholder="元" :disabled="isSomeDisable"></el-input>
              </div>
            </el-form-item>
          </div>

          <div class="acquire-time">
            <el-form-item class="is-required" label="领取发放时间:" prop="acquireStartTime">
              <el-date-picker
                type="date"
                v-model="formData.acquireStartTime"
                placeholder="开始日期">
              </el-date-picker>
            </el-form-item>
            <div>-</div>
            <el-form-item style="margin-left: -110px;width: 100%;" prop="acquireEndTime">
              <el-date-picker
                type="date"
                v-model="formData.acquireEndTime"
                placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </div>

          <el-form-item class="valid-date is-required" label="有效期:">
            <el-radio-group v-model="formData.validType">
              <el-radio label="1">绝对时间</el-radio>
              <el-radio label="2">相对时间</el-radio>
            </el-radio-group>
            <div class="valid-date-item absolute" v-show="formData.validType === '1'">
              <el-form-item prop="validStartTime">
                  <el-date-picker type="date" v-model="formData.validStartTime" placeholder="开始日期"></el-date-picker>
                </el-form-item>
                <div>-</div>
                <el-form-item  prop="validEndTime">
                  <el-date-picker type="date" v-model="formData.validEndTime" placeholder="结束日期"></el-date-picker>
                </el-form-item>
            </div>
            <div class="valid-date-item relative" v-show="formData.validType === '2'">
              <el-form-item prop="validDay">
                领取后<el-input v-model="formData.validDay"></el-input>天内有效
              </el-form-item>
            </div>
          </el-form-item>

          <el-form-item label="优惠券数量:" prop="provideQuantity">
            <el-input v-model="formData.provideQuantity" :disabled="isSomeDisable"></el-input>
          </el-form-item>

          <el-form-item label="费用承担方:" prop="">
            <el-radio-group v-model="formData.undertak">
              <el-radio label="1">平台</el-radio>
              <el-radio label="2">商户</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="数量限制:">
            <div class="numlimit">
              <div class="desText">每个用户账号限制</div>
              <el-form-item prop="userLimitQuantity" style="margin-bottom: 12px;">
                <el-input v-model="formData.userLimitQuantity" placeholder="张"></el-input>
              </el-form-item>
            </div>
            <div class="numlimit">
              <div class="desText">每个用户账号每天限制</div>
              <el-form-item prop="userLimitDailyQuantity" style="margin: 0;">
                <el-input v-model="formData.userLimitDailyQuantity" placeholder="张"></el-input>
              </el-form-item>
            </div>
          </el-form-item>

          <el-form-item label="发券方:" prop="channelRemark">
            <el-input v-model="formData.channelRemark"></el-input>
          </el-form-item>

          <el-form-item label="使用须知:" prop="instructions">
            <el-input type="textarea" :rows="2" v-model="formData.instructions"></el-input>
          </el-form-item>

          <el-form-item label="跳转链接:" prop="redirectUrl">
            <el-input v-model="formData.redirectUrl"></el-input>
          </el-form-item>

          <el-form-item label="商详页展示:" prop="">
            <el-radio-group v-model="formData.goodShowSwitch">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item class="channel" label="渠道:">
            <el-checkbox-group v-model="formData.channel" @change="handelChannel">
              <el-checkbox v-for="(val, key) in channelMap" :key="key" :label="key">{{val}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" v-show="!isAllDisable">
          <el-button size="medium" @click="operateCouponData.isShow = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import { viewCoupon, saveCoupon, updateCoupon } from '@/api/promoteManage/coupon/ajax'
import { parseTime } from '@/utils'

export default {
  props: {
    operateCouponData: {
      type: Object
    }
  },
  computed: {
    dialogTitle () {
      return this.operateCouponData.action === 'add' ? '新增' : (this.operateCouponData.action === 'view' ? '查看' : '编辑')
    },
    isAllDisable () {
      return this.operateCouponData.action === 'view'
    },
    isSomeDisable () {
      return this.operateCouponData.action === 'edit'
    },
    submitFormData () {
      let data = {...this.formData}
      data.validStartTime = data.validStartTime ? parseTime(data.validStartTime, '{y}/{m}/{d}') : ''
      data.validEndTime = data.validEndTime ? parseTime(data.validEndTime, '{y}/{m}/{d}') : ''
      data.acquireStartTime = data.acquireStartTime ? parseTime(data.acquireStartTime, '{y}/{m}/{d}') : ''
      data.acquireEndTime = data.acquireEndTime ? parseTime(data.acquireEndTime, '{y}/{m}/{d}') : ''
      data.channel = data.channel.join(',')
      if (this.operateCouponData.action === 'edit') {
        data.couponTemplateId = this.operateCouponData.id
      }
      return data
    }
  },
  data () {
    const minimum = (rule, value, callback) => {
      let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/
      if (value === '') {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('请输入非负数字且最多精确到小数点后2位'))
      } else if (Number(value) < Number(this.formData.deductibleAmount)) {
        callback(new Error('满额应该大于减额'))
      } else {
        callback()
      }
    }
    const cutDown = (rule, value, callback) => {
      let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/
      if (value === '') {
        callback(new Error('优惠金额不能为空'))
      } else if (Number(value) === 0) {
        callback(new Error('请输入正数'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正数且最多精确到小数点后2位'))
      } else if (value > 1000) {
        callback(new Error('优惠金额不大于1000元'))
      } else if (this.formData.thresholdAmount !== '' && Number(this.formData.thresholdAmount) < Number(value)) {
        callback(new Error('减额应该小于满额'))
      } else {
        callback()
      }
    }
    const acquireStart = (rule, value, callback) => {
      let today = new Date()
      today.setHours(0, 0, 0, 0)
      if (value === '' || !value) {
        callback(new Error('开始日期不能为空'))
      } else if (value < today) {
        callback(new Error('开始日期不能在今日之前'))
      } else if (this.formData.acquireEndTime && value > this.formData.acquireEndTime) {
        callback(new Error('开始日期不能在结束日期之后'))
      } else {
        callback()
      }
    }
    const acquireEnd = (rule, value, callback) => {
      if (value === '' || !value) {
        callback(new Error('结束日期不能为空'))
      } else if (value < this.formData.acquireStartTime) {
        callback(new Error('结束日期不能在开始日期之前'))
      } else {
        callback()
      }
    }
    const validStart = (rule, value, callback) => {
      if (this.formData.validType !== '1') {
        callback()
      } else if (value === '' || !value) {
        callback(new Error('日期不能为空'))
      } else if (value < this.formData.acquireStartTime) {
        callback(new Error('该日期不能早于领取发放开始日期'))
      } else {
        callback()
      }
    }
    const validEnd = (rule, value, callback) => {
      if (this.formData.validType !== '1') {
        callback()
      } else if (value === '' || !value) {
        callback(new Error('日期不能为空'))
      } else if (value < this.formData.validStartTime) {
        callback(new Error('结束日期不能早于开始日期'))
      } else {
        callback()
      }
    }
    const validDays = (rule, value, callback) => {
      let reg = /^[0-9]+$/
      if (this.formData.validType === '1') {
        callback()
      } else if (value === '') {
        callback(new Error('有效天数不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入大于0的整数值'))
      } else if (Number(value) === 0) {
        callback(new Error('请输入大于0的整数值'))
      } else {
        callback()
      }
    }
    const numLimit = (rule, value, callback) => {
      let reg = /^[0-9]+$/
      if (value !== '') {
        if (!reg.test(value)) {
          callback(new Error('请输入大于0的整数值'))
        } else if (Number(value) > 1000000) {
          callback(new Error('数量不能大于1000000'))
        } else if (Number(value) === 0) {
          callback(new Error('请输入大于0的整数值'))
        } else {
          callback()
        }
      }
    }
    const userLimit = (rule, value, callback) => {
      let reg = /^[0-9]+$/
      let userLimitDaily = this.formData.userLimitDailyQuantity
      if (value === '') {
        callback()
      } else if (value === '0') {
        callback(new Error('请输入大于0的整数值'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入大于0的整数值'))
      } else if (userLimitDaily !== '' && Number(value) < Number(userLimitDaily)) {
        callback(new Error('总限制量不能小于每天限制量'))
      } else {
        callback()
      }
    }
    const userLimitDaily = (rule, value, callback) => {
      let reg = /^[0-9]+$/
      let userLimit = this.formData.userLimitQuantity
      if (value === '') {
        callback()
      } else if (value === '0') {
        callback(new Error('请输入大于0的整数值'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入大于0的整数值'))
      } else if (userLimit !== '' && Number(value) > Number(userLimit)) {
        callback(new Error('每天制量不能大于总限制量'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        templateType: '',
        couponRange: '',
        couponType: '',
        couponName: '',
        couponDesc: '',
        thresholdAmount: '',
        deductibleAmount: '',
        acquireStartTime: '',
        acquireEndTime: '',
        validType: '1',
        validStartTime: '',
        validEndTime: '',
        validDay: '',
        provideQuantity: '',
        undertak: '1',
        userLimitQuantity: '',
        userLimitDailyQuantity: '',
        channelRemark: '',
        instructions: '',
        redirectUrl: '',
        channel: ['0'],
        goodShowSwitch: '1'
      },
      rules: {
        templateType: [
          { required: true, message: '请选择优惠券类型', trigger: 'change' }
        ],
        couponRange: [
          { required: true, message: '请选择优惠券规则类型', trigger: 'change' }
        ],
        couponType: [
          { required: true, message: '请选择优惠券规则类型', trigger: 'change' }
        ],
        couponName: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' },
          { max: 100, message: '最多100个字符', trigger: 'blur' }
        ],
        couponDesc: [
          { max: 500, message: '最多500个字符', trigger: 'blur' }
        ],
        thresholdAmount: [
          { validator: minimum, trigger: 'blur' }
        ],
        deductibleAmount: [
          { validator: cutDown, trigger: 'blur' }
        ],
        acquireStartTime: [
          { validator: acquireStart, trigger: 'blur' }
        ],
        acquireEndTime: [
          { validator: acquireEnd, trigger: 'blur' }
        ],
        validStartTime: [
          { validator: validStart, trigger: 'blur' }
        ],
        validEndTime: [
          { validator: validEnd, trigger: 'blur' }
        ],
        validDay: [
          { validator: validDays, trigger: 'blur' }
        ],
        provideQuantity: [
          { required: true, message: '请输入优惠券数量', trigger: 'blur' },
          { validator: numLimit, trigger: 'blur' }
        ],
        userLimitQuantity: [
          { validator: userLimit, trigger: 'blur' }
        ],
        userLimitDailyQuantity: [
          { validator: userLimitDaily, trigger: 'blur' }
        ],
        channelRemark: [
          { required: true, message: '请输入发券方名称', trigger: 'blur' },
          { max: 100, message: '最多100个字符', trigger: 'blur' }
        ],
        instructions: [
          { required: true, message: '请输入使用须知', trigger: 'blur' },
          { max: 500, message: '最多500个字符', trigger: 'blur' }
        ]
      },
      templateTypeMap: {
        '1': '优惠券',
        '2': '优惠码'
      },
      couponTypeMap: {
        '0': '普通券',
        '1': '斗票观影券',
        '2': '斗票X元看电影',
        '3': '首单券'
      },
      couponRangeMap: {
        '1': '商户券',
        '2': '商品券',
        '3': '类目券',
        '7': '通用券'
      },
      channelMap: {
        '0': '全部',
        '1': 'WEB',
        '2': 'PHONE',
        '3': 'OB',
        '4': 'IVR',
        '5': '短信',
        '6': '手机商城'
      }
    }
  },
  methods: {
    submitForm () {
      console.log('formData:', this.formData)
      console.log('submitData:', this.submitFormData)
      if (this.operateCouponData.action === 'add') {
        this.$refs.addCouponForm.validate((valid) => {
          if (valid) {
            saveCoupon(this.submitFormData).then((res) => {
              if (res.responseCode === '000') {
                this.$message({
                  type: 'success',
                  message: '新增优惠券成功'
                })
                this.operateCouponData.isShow = false
                this.$emit('refreshList')
              } else {
                this.$message.error(res.message)
              }
            }).catch((err) => { console.log(err) })
          } else {
            console.log('表单校验未完成!')
            return false
          }
        })
      }
      if (this.operateCouponData.action === 'edit') {
        this.$refs.addCouponForm.validate((valid) => {
          if (valid) {
            updateCoupon(this.submitFormData).then((res) => {
              if (res.responseCode === '000') {
                this.$message({
                  type: 'success',
                  message: '更新优惠券成功'
                })
                this.operateCouponData.isShow = false
                this.$emit('refreshList')
              } else {
                this.$message.error(res.message)
              }
            }).catch((err) => { console.log(err) })
          } else {
            console.log('表单校验未完成!')
            return false
          }
        })
      }
    },
    handelChannel (val) {
      if (this.isInArray('0', val)) {
        this.formData.channel = ['0']
      }
    },
    isInArray (val, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (val === arr[i]) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    'operateCouponData.isShow': function (newVal) {
      if (newVal) {
        if (this.operateCouponData.action !== 'add') {
          viewCoupon(this.operateCouponData.id).then((res) => {
            if (res.responseCode === '000') {
              Object.assign(this.formData, res.data)
              this.formData.channel = this.formData.channel.split(',')
            } else {
              this.$message.error(res.message)
            }
          })
        }
      } else {
        this.$refs.addCouponForm.resetFields()
      }
    },
    'formData.validType': function (newVal) {
      if (newVal === '1') {
        this.formData.validDay = ''
      } else {
        this.formData.validStartTime = ''
        this.formData.validEndTime = ''
      }
    }
  }
}
</script>

<style lang="scss">
  .addCoupon{
    .el-dialog{
      width: 50%;
    }
    .dialog-title{
      text-align: left;
      font-weight: 400;
      font-size: 18px;
    }
    .el-dialog__body{
      padding: 5px 25px 5px 15px;
    }
    .el-select{
      width: 100%;
    }
    .discount-type{
      display: flex;
      display: -webkit-flex;
      .el-form-item{
        width: 100%;
      }
      .el-form-item__error{
        left: 15px;
      }
      .discount-type-item{
        display: flex;
        display: -webkit-flex;
      }
    }
    .acquire-time{
      display: flex;
      display: -webkit-flex;
      .el-form-item{
        width: 100%;
      }
      .el-date-editor{
        width: 100%;
      }
    }
    .valid-date{
      .valid-date-item{
        margin-top: 10px;
      }
      .el-form-item{
        margin: 0;
      }
      .absolute{
        display: flex;
        display: -webkit-flex;
        .el-form-item{
          width: 100%;
        }
        .el-date-editor{
          width: 100%;
        }
      }
      .relative{
        .el-form-item__content{
          display: flex;
          white-space: nowrap;
        }
        .el-form-item__error{
          left: 40px;
        }
      }
    }
    .numlimit{
      display: flex;
      display: -webkit-flex;
      .desText{
        white-space: nowrap;
        margin-right: 10px;
      }
      .el-form-item{
        width: 100%;
      }
    }
    .channel{
      .el-checkbox+.el-checkbox{
        margin-left: 18px;
      }
      .el-checkbox__label{
        padding-left: 5px;
        font-weight: normal;
      }
    }
  }
</style>
