<template>
  <div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
      <el-col :span="12">
        <el-form-item label="商户ID">
           <el-input
            class="inline-input normalInput"
            placeholder="请输入商户ID"
            v-model="ruleForm.mall"
            clearable
            size="mini">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="商户名称">
          <el-autocomplete
            class="inline-input longInput"
            v-model="ruleForm.goodsName"
            :fetch-suggestions="querySearch"
            placeholder="搜索商户名称"
            @select="handleSelect"
            size="mini">
            </el-autocomplete>
        </el-form-item>
      </el-col>
    </el-form>
    <div class="clear"></div>
    <div class="searchButtons">
      <el-button type="primary" size="mini" @click="queryForm" v-if="activeName==='first'||activeTab==='first'" :loading="loadingState" icon="el-icon-search">搜索</el-button>
      <el-button type="primary" size="mini" @click="querySecondForm" v-else-if="activeName==='second'" :loading="loadingState" icon="el-icon-search">搜索</el-button>
      <el-button type="primary" size="mini" @click="querySecondForm" v-else :loading="loadingState" icon="el-icon-search">搜索</el-button>
      <upload
        v-if="activeTab==='first'||activeName==='first'"
        :uploadType="uploadType"
        :templateId="couponTemplateId"
        @uploadResult="uploadResult">
      </upload>
      <download v-show="activeName==='first'||activeTab==='first'" :downloadType="downloadType"></download>
    </div>
  </div>
</template>
<script>
import upload from '../upload.vue'
import download from '../download.vue'
import {
  mallNameSearch,
  mallList,
  excludeMall,
  ERR_OK
} from 'api/promoteManage/coupon/index'
export default {
  props: {
    activeTab: {
      type: String
    },
    activeName: {
      type: String
    },
    pageSize: {
      type: Number
    },
    currentPage: {
      type: Number
    },
    couponTemplateId: {
      type: String
    },
    refresh: {
      type: Number
    },
    uploadType: {
      type: String
    },
    uploadData: {
      type: Number
    },
    queryAgain: {
      type: Number
    }
  },
  components: {
    upload,
    download
  },
  data () {
    return {
      restaurants: [],
      state1: '',
      value: '',
      form: {},
      ruleForm: {
        mall: '',
        goodsName: ''
      },
      downloadType: 2,
      loadingState: false
    }
  },
  methods: {
    querySearch (queryString, cb) {
      if (queryString !== '') {
        mallNameSearch(queryString).then(res => {
          if (res.responseCode === ERR_OK) {
            for (var k in res.providerList) {
              this.restaurants[k] = {}
              this.restaurants[k].value = res.providerList[k]
            }
          }
        }).catch(_ => {})
      }
      var results = queryString ? this.restaurants.filter(this.createFilter(queryString)) : this.restaurants
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
    },
    selectedLevel (val) {
    },
    tabsClean () {
      this.ruleForm = {
        mall: '',
        goodsName: ''
      }
    },
    queryForm () {
      // 编辑添加搜索表单请求
      let params = {
        couponTemplateId: this.couponTemplateId,
        merchantId: this.ruleForm.mall,
        merchantName: this.ruleForm.goodsName,
        optType: this.activeName === 'first' ? 1 : 2,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      this.loadingState = true
      mallList(params).then(res => {
        if (res.responseCode === ERR_OK) {
          if (res.merchantList.list.length === 0) {
            this.$message('抱歉, 您搜索的结果为空')
          }
          let resMsg = {
            list: res.merchantList.list,
            total: res.merchantList.total
          }
          this.loadingState = false
          this.$emit('queryListData', resMsg)
        }
      }).catch(ERR => {})
    },
    querySecondForm (empty) {
      let params = {
        couponTemplateId: this.couponTemplateId,
        merchantId: this.ruleForm.mall,
        merchantName: this.ruleForm.goodsName,
        optType: this.activeName === 'second' ? 1 : 2,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      this.loadingState = true
      excludeMall(params).then(res => {
        if (res.responseCode === ERR_OK) {
          if (res.merchantList.list.length === 0 && empty !== true) {
            this.$message('抱歉,您搜索的结果为空')
          }
          let resMsg = {
            list: res.merchantList.list,
            total: res.merchantList.total
          }
          this.$emit('queryListData', resMsg)
        }
        this.loadingState = false
      }).catch(_ => {})
    },
    queryExclude () {
      // 排除商户搜索
    },
    uploadResult (val) {
      let params = {
        couponTemplateId: this.couponTemplateId,
        merchantId: '',
        merchantName: '',
        optType: this.activeName === 'first' ? 1 : 2,
        pageNum: 1,
        pageSize: this.pageSize
      }
      excludeMall(params).then(res => {
        if (res.responseCode === ERR_OK) {
          // this.selectedNum = res.merchantList.total
          this.$emit('selectedNum', res.merchantList.total)
        }
      }).catch(_ => {})
    }

  },
  watch: {
    activeName: {
      deep: true,
      handler (newval) {
        this.tabsClean()
        if (newval === 'second') {
          let params = {
            couponTemplateId: this.couponTemplateId,
            merchantId: '',
            merchantName: '',
            optType: this.activeName === 'second' ? 1 : 2,
            pageNum: 1,
            pageSize: this.pageSize
          }
          excludeMall(params).then(res => {
            if (res.responseCode === ERR_OK) {
              let resMsg = {
                list: res.merchantList.list,
                total: res.merchantList.total
              }
              this.$emit('queryListData', resMsg)
            }
          }).catch(_ => {})
        }
      }
    },
    activeTab: {
      deep: true,
      handler (newval) {
        this.tabsClean()
        if (newval === 'second') {
          // 初始化已选择排除商户列表
          let params = {
            couponTemplateId: this.couponTemplateId,
            merchantId: '',
            merchantName: '',
            optType: this.activeName === 'second' ? 1 : 2,
            pageNum: 1,
            pageSize: this.pageSize
          }
          excludeMall(params).then(res => {
            if (res.responseCode === ERR_OK) {
              let resMsg = {
                list: res.merchantList.list,
                total: res.merchantList.total
              }
              this.$emit('queryListData', resMsg)
            }
          })
        }
      }
    },
    refresh () {
      let empty = true
      this.querySecondForm(empty)
    },
    currentPage () {
      if (this.activeName === 'first') {
        this.queryForm()
      } else if (this.activeName === 'second') {
        this.querySecondForm()
      } else if (this.activeTab === 'first') {
        this.queryForm()
      } else if (this.activeTab === 'second') {
        this.querySecondForm()
      }
    },
    pageSize () {
      if (this.activeName === 'first') {
        this.queryForm()
      } else if (this.activeName === 'second') {
        this.querySecondForm()
      } else if (this.activeTab === 'first') {
        this.queryForm()
      } else if (this.activeTab === 'second') {
        this.querySecondForm()
      }
    },
    uploadData: {
      deep: true,
      handler (newval) {
        this.$emit('uploadData', newval)
      }
    },
    queryAgain () {
      this.queryForm()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import '../../../../styles/coupon/exclude.scss';
</style>
