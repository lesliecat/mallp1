<template>
  <div>
    <el-form :model="goodsListParams" ref="goodsListParams" label-width="100px">
      <el-col :span="12">
        <el-form-item label="商户名称">
          <el-autocomplete
          class="inline-input longInput"
          v-model="goodsListParams.merchantName"
          :fetch-suggestions="querySearchMall"
          placeholder="搜索商户名称"
          size="small">
          </el-autocomplete>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="商品名称">
          <el-autocomplete
            class="inline-input longInput"
            v-model="goodsListParams.productName"
            :fetch-suggestions="querySearchGoods"
            placeholder="搜索商品名称"
            size="small">
          </el-autocomplete>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="SkuID">
          <el-input
            class="inline-input normalInput"
            placeholder="请输入SkuID"
            v-model="goodsListParams.skuid"
            clearable
            size="small">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="商品状态">
          <el-select v-model="goodsListParams.productStatus" placeholder="请选择" class="normalInput" size="small">
            <el-option
              v-for="item in states"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <choseCategory :reset="reset" :span="24" @selectedLevel="selectedLevel"></choseCategory>
     <div class="clear"></div>
    </el-form>
    <div class="clear"></div>
    <div class="searchButtons">
      <el-button type="primary" size="mini" @click="searchGoods" :loading="searchState">
        <i class="el-icon-search"></i>
        搜索
      </el-button>
      <upload v-show="activeTab==='first'||activeName==='first'"
              :uploadType="uploadType"
              :templateId="couponId"
              @uploadResult="uploadResult">
      </upload>
      <download v-show="activeTab==='first'||activeName==='first'"
                :downloadType="downloadType">
      </download>
    </div>
  </div>
</template>
<script>
import choseCategory from '../choseCategory.vue'
import upload from '../upload.vue'
import download from '../download.vue'
import {
  mallNameSearch,
  goodsNameSearch,
  goodsList,
  excludeGoods,
  ERR_OK
} from 'api/promoteManage/coupon/index'

export default {
  props: {
    couponId: {
      type: String
    },
    activeTab: {
      type: String
    },
    activeName: {
      type: String
    },
    defaultPageSize: {
      type: Number
    }
  },
  components: {
    choseCategory,
    upload,
    download
  },
  watch: {
    activeName () {
      this.tabsClean()
      if (this.activeName === 'first') {
        this.uploadType = '1'
      }
    },
    activeTab () {
      this.tabsClean()
      if (this.activeTab === 'first') {
        this.uploadType = '2'
      }
    }
  },
  data () {
    return {
      states: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '预存'
      }, {
        value: '1',
        label: '提交'
      }, {
        value: '6',
        label: '已审核1'
      }, {
        value: '2',
        label: '已审核2'
      }, {
        value: '3',
        label: '已发布'
      }, {
        value: '4',
        label: '退回'
      }, {
        value: '5',
        label: '拒绝'
      }],
      goodsListParams: {
        firstCatalogId: '',
        merchantName: '',
        pageNum: 1,
        pageSize: this.defaultPageSize,
        productName: '',
        productStatus: '',
        secondCatalogId: '',
        skuid: '',
        thirdCatalogId: ''
      },
      downloadType: 1,
      reset: false,
      uploadType: '1',
      providerList: [],
      productName: [],
      searchState: false
    }
  },
  computed: {
    tabTypes () {
      return this.activeTab === 'first' || this.activeName === 'first'
    }
  },
  methods: {
    /* 搜索商品 */
    searchGoods () {
      this.goodsListParams.couponTemplateId = this.couponId
      this.goodsListParams.optType = this.activeTab ? 2 : 1
      if (this.tabTypes) {
        // 普通商品列表请求
        this.searchState = true
        goodsList(this.goodsListParams).then((res) => {
          if (res.responseCode === ERR_OK) {
            this.$emit('goodsListData', [res.productList, this.goodsListParams])
            if (res.productList.total === 0) {
              this.$message('抱歉，未搜索出符合条件的商品信息！')
            }
            this.searchState = false
          } else {
            this.$message(res.responseCode + ':' + res.message)
            this.searchState = false
          }
        }).catch((err) => {
          console.log(err)
          this.searchState = false
        })
      } else {
        // 已选择／排除商品列表请求
        this.searchState = true
        excludeGoods(this.goodsListParams).then((res) => {
          if (res.responseCode === ERR_OK) {
            this.$emit('goodsListData', [res.productList, this.goodsListParams])
            if (res.productList.total === 0) {
              this.$message('抱歉，未搜索出符合条件的商品信息！')
            }
            this.searchState = false
          } else {
            this.$message(res.responseCode + ':' + res.message)
            this.searchState = false
          }
        }).catch((err) => {
          console.log(err)
          this.searchState = false
        })
      }
    },

    /* 商户名称联想 */
    querySearchMall (val, cb) {
      this.baseSearchMallName(val)
      let results = val ? this.providerList.filter(this.createFilter(this.providerList, val)) : this.providerList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },

    /* 商品名称联想 */
    querySearchGoods (val, cb) {
      this.baseSearchGoodsName(val)
      let results = val ? this.productName.filter(this.createFilter(this.productName, val)) : this.productName
      // 调用 callback 返回建议列表的数据
      cb(results)
    },

    /* 商户名称联想基础方法 */
    baseSearchMallName (val) {
      if (val !== '') {
        mallNameSearch(val).then((res) => {
          if (res.responseCode === ERR_OK) {
            for (let k in res.providerList) {
              this.providerList[k] = {}
              this.providerList[k].value = res.providerList[k]
            }
          } else {
            this.$message(res.responseCode + ':' + res.message)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },

    /* 商品名称联想基础方法 */
    baseSearchGoodsName (val) {
      if (val !== '') {
        goodsNameSearch(val).then((res) => {
          if (res.responseCode === ERR_OK) {
            for (let k in res.productList) {
              this.productName[k] = {}
              this.productName[k].value = res.productList[k]
            }
          } else {
            this.$message(res.responseCode + ':' + res.message)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },

    /* 搜索结果前端过滤 */
    createFilter (data, queryString) {
      return (data) => {
        return (data.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },

    /* 类目选择 */
    selectedLevel (val) {
      this.goodsListParams.firstCatalogId = val['0']
      this.goodsListParams.secondCatalogId = val['1']
      this.goodsListParams.thirdCatalogId = val['2']
    },

    /* tab选项卡切换清空历史数据 */
    tabsClean () {
      this.goodsListParams = {
        firstCatalogId: '',
        merchantName: '',
        pageNum: 1,
        pageSize: this.defaultPageSize,
        productName: '',
        productStatus: '',
        secondCatalogId: '',
        skuid: '',
        thirdCatalogId: ''
      }
      // 传值给子组件choseCategory,目的为清空
      this.reset === true ? this.reset = false : this.reset = true
    },

    /* 导入成功之后实时更新已选择／排除商品数量 */
    uploadResult (val) {
      if (val === 'success') {
        this.creatLinkGoodsList(this.couponId)
      }
    },

    /* 已成功导入已选择／排除商品全部数据基础请求 */
    creatLinkGoodsList (id) {
      this.goodsListParams = {
        couponTemplateId: id,
        merchantName: '',
        productName: '',
        skuid: '',
        productStatus: '',
        firstCatalogId: '',
        secondCatalogId: '',
        thirdCatalogId: '',
        pageNum: 1,
        pageSize: this.defaultPageSize,
        optType: this.activeTab ? 2 : 1
      }
      excludeGoods(this.goodsListParams).then((res) => {
        if (res.responseCode === ERR_OK) {
          this.$emit('uploadNumber', res.productList.total)
        } else {
          this.$message(res.responseCode + ':' + res.message)
        }
      }).catch((err) => {
        console.log(err)
      })
    }

  }

}
</script>
<style rel="stylesheet/scss" lang="scss">
@import '../../../../styles/coupon/exclude.scss';
</style>
