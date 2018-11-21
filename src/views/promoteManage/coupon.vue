<template>
  <div class="couponManage">
    <div class="queryCoupon">
      <el-row>
        <div class="col col-8">
          <label>优惠券/码名称</label>
          <el-input size="small" v-model="queryCouponFormData.name" placeholder="优惠券/码名称"></el-input>
        </div>
        <div class="col col-8">
          <label>模版ID</label>
          <el-input size="small" v-model="queryCouponFormData.id" placeholder="模版ID"></el-input>
        </div>
        <div class="col col-8">
          <label>操作人名称</label>
          <el-input size="small" v-model="queryCouponFormData.operator" placeholder="操作人名称"></el-input>
        </div>
      </el-row>
      <el-row>
        <div class="col col-8">
          <label>券/码状态</label>
          <el-select  size="small"  v-model="queryCouponFormData.status">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(val,key) in couponStateMap" :key="key" :label="val" :value="key"></el-option>
          </el-select>
        </div>
        <div class="col col-8">
          <label>券/码类型</label>
          <el-select  size="small"  v-model="queryCouponFormData.type">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(val,key) in templateTypeMap" :key="key" :label="val" :value="key"></el-option>
          </el-select>
        </div>
        <div class="col col-8">
          <label>规则类型</label>
          <el-select  size="small"  v-model="queryCouponFormData.ruleType">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(val,key) in ruleTypeMap" :key="key" :label="val" :value="key"></el-option>
          </el-select>
        </div>
      </el-row>
      <el-row>
        <div class="col col-16">
          <label>领取发放时间</label>
          <el-date-picker type="date" size="small" v-model="queryCouponFormData.startDate" placeholder="开始时间"  @blur="verifyDate"></el-date-picker>
          <div class="span">-</div>
          <el-date-picker type="date" size="small" v-model="queryCouponFormData.endDate" placeholder="结束时间" @blur="verifyDate"></el-date-picker>
        </div>
      </el-row>
      <el-row class="channel">
        <span class="label">发放渠道</span>
        <el-checkbox-group v-model="queryCouponFormData.channel" @change="handelChannel">
          <el-checkbox v-for="(val, key) in channelMap" :key="key" :label="key">{{val}}</el-checkbox>
        </el-checkbox-group>
      </el-row>
      <el-row class="query-coupon-btn">
        <el-button type="primary" icon="el-icon-search" size="small" :loading="isOnloading" @click="onSubmit">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="openCouponDialog('add')">新增</el-button>
      </el-row>
    </div>

    <div class="couponList">
      <el-table
        :data="couponListData"
        style="width: 100%"
        size="medium"
        header-row-class-name="coupon-list-header">
        <el-table-column
        width="70"
          prop="couponTemplateId"
          label="模版ID">
        </el-table-column>
        <el-table-column
          width="120"
          prop="couponName"
          label="券/码名称">
        </el-table-column>
        <el-table-column
          width="100"
          prop="channel"
          :formatter="channelFormatter"
          label="渠道">
        </el-table-column>
        <el-table-column
          width="100"
          prop="thresholdAmount"
          :formatter="priceFormatter"
          label="面额">
        </el-table-column>
        <el-table-column
          prop="templateType"
          :formatter="typeFormatter"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="acquireStartTime"
          :formatter="acquireFormatter"
          width="170"
          label="领取发放时间">
        </el-table-column>
        <el-table-column
          width="70"
          prop="residueQuantity"
          label="券剩余数量">
        </el-table-column>
        <el-table-column
          prop="couponRange"
          :formatter="ruleFormatter"
          label="规则类型">
        </el-table-column>
        <el-table-column
          prop="templateStatus"
          label="状态">
        </el-table-column>
        <el-table-column
          width="140"
          prop="createdBy"
          label="操作人">
        </el-table-column>
        <el-table-column
          class-name="button-cell"
          label="操作"
          fixed="right"
          width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="openCouponDialog('view', scope.row.couponTemplateId)">查看</el-button>

            <el-button
              type="text"
              size="mini"
              v-if="scope.row.templateStatus === '编辑中'"
              @click="openCouponDialog('edit', scope.row.couponTemplateId)">编辑
            </el-button>

            <el-button
              v-if="scope.row.templateStatus !== '启用'"
              type="text"
              size="mini"
              @click="startUse(scope.row.couponTemplateId, scope.row.couponName)">启用
            </el-button>
            <el-button
              v-if="scope.row.templateStatus !== '禁用'"
              type="text"
              size="mini"
              @click="forbidden(scope.row.couponTemplateId, scope.row.couponName)">禁用
            </el-button>
            <el-button
              v-if="scope.row.templateStatus !== '启用'"
              type="text"
              size="mini"
              @click="deleteCoupon(scope.row.couponTemplateId, scope.row.couponName)">删除
            </el-button>

            <el-button type="text" size="mini" @click="manageNum(scope.row.couponTemplateId,scope.row.updateDate)">券码管理</el-button>

            <el-button
              v-if="scope.row.couponRange !== '6' && scope.row.couponRange !== '7'"
              type="text"
              size="mini"
              @click="ruleTypeDialog(scope.row.couponTemplateId,scope.row.couponRange,'edit')">{{ruleTypeBtnMap[scope.row.couponRange]}}
            </el-button>

            <el-button
              v-if="scope.row.couponRange !== '6' && scope.row.couponRange !== '7' && scope.row.couponRange !== '2'"
              type="text"
              size="mini"
              @click="ruleTypeDialog(scope.row.couponTemplateId,'2','exclude')">排除商品
            </el-button>
            <el-button
              v-if="scope.row.couponRange === '3' || scope.row.couponRange === '4' || scope.row.couponRange === '5'"
              type="text"
              size="mini"
              @click="ruleTypeDialog(scope.row.couponTemplateId,'1','exclude')">排除商户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :page-sizes="[10, 25, 50, 100]"
          :page-size="Number(queryCouponFormData.pageSize)"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listTotalNum"
          @size-change="sizeChange"
          @current-change="currentChange">
        </el-pagination>
      </div>
    </div>
    <operate-coupon :operateCouponData="operateCouponData" @refreshList="refreshList"></operate-coupon>
    <editProduct :editRuleData="editRuleData"></editProduct>
    <editMall :editRuleData="editRuleData"></editMall>
    <edit-category :editRuleData="editRuleData"></edit-category>
    <exclude-product :excludeRuleData="excludeRuleData"></exclude-product>
    <exclude-mall :excludeRuleData="excludeRuleData"></exclude-mall>
  </div>
</template>

<script>
import excludeProduct from './common/excludeProduct.vue'
import excludeMall from './common/excludeMall.vue'
import editProduct from './common/editProduct.vue'
import editMall from './common/editMall.vue'
import editCategory from './common/editCategory.vue'
import operateCoupon from './common/operateCoupon.vue'
import { parseTime } from '@/utils'
import { queryCoupon, updateCouponState, addCouponNum, deleteCoupon } from '@/api/promoteManage/coupon/ajax'

export default {
  created () {
    this.refreshList()
  },
  computed: {
    submitFormData () {
      let data = {...this.queryCouponFormData}
      data.startDate = data.startDate ? parseTime(data.startDate, '{y}/{m}/{d}') : ''
      data.endDate = data.endDate ? parseTime(data.endDate, '{y}/{m}/{d}') : ''
      data.channel = data.channel.join(',')
      return data
    }
  },
  data () {
    return {
      queryCouponFormData: {
        name: '',
        id: '',
        startDate: '',
        endDate: '',
        status: '',
        type: '',
        ruleType: '',
        channel: [],
        operator: '',
        kind: '',
        pageNum: '1',
        pageSize: '10'
      },
      couponListData: [],
      listTotalNum: 0,
      isOnloading: false,
      operateCouponData: {},
      editRuleData: {},
      excludeRuleData: {},
      ruleTypeBtnMap: {
        '1': '编辑商户',
        '2': '编辑商品',
        '3': '编辑类目',
        '4': '编辑类目',
        '5': '编辑类目'
      },
      ruleTypeMap: {
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
      },
      templateTypeMap: {
        '1': '优惠券',
        '2': '优惠码'
      },
      couponStateMap: {
        '1': '编辑中',
        '2': '启用',
        '3': '禁用'
      }
    }
  },
  methods: {
    // 获取列表数据
    refreshList () {
      this.isOnloading = true
      queryCoupon(this.submitFormData).then((res) => {
        if (res.responseCode === '000') {
          this.couponListData = res.pageList.list
          this.listTotalNum = Number(res.pageList.total)
        } else {
          this.$message.error(res.message)
        }
        this.isOnloading = false
      }).catch((err) => {
        this.$message.error(String(err))
        this.isOnloading = false
      })
    },
    // 查询表单中领取日期的校验
    verifyDate () {
      if (this.queryCouponFormData.endDate && this.queryCouponFormData.startDate) {
        if (Number(this.queryCouponFormData.endDate) < Number(this.queryCouponFormData.startDate)) {
          this.$message.error('结束时间不能小于开始时间！')
        }
      }
    },
    // 查询表单中渠道的勾选处理
    handelChannel (val) {
      if (this.isInArray('0', val)) {
        this.queryCouponFormData.channel = ['0']
      }
    },
    isInArray (val, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (val === arr[i]) {
          return true
        }
      }
      return false
    },
    // 提交查询表单
    onSubmit () {
      this.refreshList()
    },
    // 表格列格式化
    typeFormatter (row, col, value) {
      return value ? (value === '1' ? '优惠券' : '优惠码') : ''
    },
    priceFormatter (row, col, value) {
      return value && value !== '0' && value !== '00' ? '满' + value + '减' + row.deductibleAmount : '无门槛' + row.deductibleAmount + '元'
    },
    channelFormatter (row, col, value) {
      return value ? value.split(',').map((code) => this.channelMap[code]).join(' ') : ''
    },
    acquireFormatter (row, col, value) {
      return value ? value.split('-').join('.') + '-' + row.acquireEndTime.split('-').join('.') : ''
    },
    ruleFormatter (row, col, value) {
      return value ? this.ruleTypeMap[value] : ''
    },
    // 券码数量追加
    manageNum (id, updatedDate) {
      this.$prompt('追加数量为：', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9]+$/,
        inputErrorMessage: '数量格式不正确'
      }).then(({ value }) => {
        return addCouponNum(id, Number(value), updatedDate)
      }).then((res) => {
        if (res.responseCode === '000') {
          this.$message({
            type: 'success',
            message: '追加数量成功'
          })
          this.refreshList()
        } else {
          this.$message.error(res.message)
        }
      }).catch((err) => {
        if (err !== 'cancel') {
          this.$message.error(String(err))
        }
      })
    },
    // 启用
    startUse (id, name) {
      let msg = '确定启用（券/码ID：' + id + '，券/码名称：' + name + '）吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return updateCouponState(id, '2')
      }).then((res) => {
        if (res.responseCode === '000') {
          this.$message({
            type: 'success',
            message: '启用成功'
          })
          this.refreshList()
        } else {
          this.$message.error(res.message)
        }
      }).catch((err) => {
        if (err !== 'cancel') {
          this.$message.error(String(err))
        }
      })
    },
    // 禁用
    forbidden (id, name) {
      let msg = '确定禁用（券/码ID：' + id + '，券/码名称：' + name + '）吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return updateCouponState(id, '3')
      }).then((res) => {
        if (res.responseCode === '000') {
          this.$message({
            type: 'success',
            message: '禁用成功'
          })
          this.refreshList()
        } else {
          this.$message.error(res.message)
        }
      }).catch((err) => {
        if (err !== 'cancel') {
          this.$message.error(String(err))
        }
      })
    },
    // 删除优惠券
    deleteCoupon (id, name) {
      let msg = '确定删除（券/码ID：' + id + '，券/码名称：' + name + '）吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteCoupon(id, '0')
      }).then((res) => {
        if (res.responseCode === '000') {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.refreshList()
        } else {
          this.$message.error(res.message)
        }
      }).catch((err) => {
        if (err !== 'cancel') {
          this.$message.error(String(err))
        }
      })
    },
    // 与编辑排除类子组件通信
    ruleTypeDialog (id, ruleType, action) {
      this[action + 'RuleData'] = {
        id: id,
        ruleType: ruleType
      }
    },
    // 与查看、新增、编辑组件通信
    openCouponDialog (action, id = '') {
      this.operateCouponData = {
        id: id,
        action: action,
        isShow: true
      }
    },
    // 分页操作
    sizeChange (size) {
      this.queryCouponFormData.pageSize = String(size)
      this.refreshList()
    },
    currentChange (curPage) {
      this.queryCouponFormData.pageNum = String(curPage)
      this.refreshList()
    }
  },
  components: {
    editMall,
    editProduct,
    excludeProduct,
    excludeMall,
    editCategory,
    operateCoupon
  }
}
</script>

<style lang="scss">
  .couponManage{
    padding: 10px;
    .queryCoupon{
      .el-row{
        display: flex;
        margin: 20px 0;
        .col{
          display: flex;
          display: -webkit-flex;
          label{
            display: block;
            flex: 0 0 110px;
            font-weight: 700;
            text-align: right;
            color: #606266;
            font-size: 14px;
            line-height: 32px;
            padding-right: 15px;
          }
          .el-input, .el-select{
            width: 100%;
          }
        }
        .col-8{
          width: 33.33333%;
        }
        .col-16{
          width: 66.66666%;
          .span{
            display: block;
            width: 100px;
            text-align: center;
            line-height: 32px;
            color: #999999;
          }
        }
        .label{
          display: block;
          flex: 0 0 110px;
          font-weight: 700;
          text-align: right;
          color: #606266;
          font-size: 14px;
          line-height: 32px;
          padding-right: 15px;
        }
      }
      .channel{
        .el-checkbox-group{
          line-height: 32px;
          .el-checkbox{
            margin-left: 0;
            margin-right: 30px;
          }
        }
        .el-checkbox__label{
          padding-left: 5px;
          font-weight: normal;
        }
      }
      .query-coupon-btn{
        justify-content: flex-end;
        .el-button{
          margin-left: 30px;
        }
      }
    }
    .el-tabs__header{
      margin: 0;
    }
    .couponList{
      margin-top: 20px;
      border-top: 1px solid #e4e7ed;
      display: flex;
      display: -webkit-flex;
      flex-direction: column;
      align-items: center;
    }
    .pagination{
      .el-pagination{
        margin-top: 15px;
      }
    }
    .button-cell{
      .cell{
        padding-right: 0;
      }
      .el-button{
        margin: 0 6px 0 0;
        border: none;
      }
    }
  }
</style>
