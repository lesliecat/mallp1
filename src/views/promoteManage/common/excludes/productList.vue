<template>
  <div class="list">
      <el-table
        ref="multipleTable"
        :data="goodsListData.list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
          <el-table-column
          type="selection"
          :selectable="selectable">
          </el-table-column>
          <el-table-column
            label="SkuId"
            prop="productId">
          </el-table-column>
          <el-table-column
            prop="merchantName"
            label="商户名称">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="商品名称">
          </el-table-column>
          <el-table-column
            prop="productPrice"
            label="商品价格">
          </el-table-column>
          <el-table-column
            prop="catalogName"
            label="类目">
          </el-table-column>
          <el-table-column
            prop="productStatus"
            label="商品状态">
          </el-table-column>
          <el-table-column
            v-if="false"
            prop="isSelected"
            label="选择／排除" >
          </el-table-column>
        </el-table>
        <div class="block listButtonGroups" v-if="goodsLen>0">
          <div class="fl-l">
            <el-button type="primary" size="mini" v-if="activeTab==='first'" @click="excludeProduct" :loading="excludeState">排除商品</el-button>
            <el-button type="primary" size="mini" v-if="(activeTab==='second')||(activeName==='second')" @click="deleteGoods" :loading="deleteState">删除</el-button>
            <el-button type="primary" size="mini" v-if="activeName==='first'" @click="addGoods" :loading="addState">批量添加商品</el-button>
          </div>
          <div class="fl-r">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="goodsParams.pageNum"
              :page-sizes="pageSize"
              :page-size="goodsParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="goodsListData.total">
            </el-pagination>
          </div>
          <div class="clear"></div>
       </div>
  </div>
</template>
<script>
import {
  goodsList,
  excludeGoods,
  choiceExclude,
  unchoiceExclude,
  ERR_OK
} from 'api/promoteManage/coupon/index'
export default {
  props: {
    goodsListParams: {
      type: Object
    },
    goodsData: {
      type: Object
    },
    activeTab: {
      type: String
    },
    activeName: {
      type: String
    },
    couponId: {
      type: String
    }
  },
  watch: {
    goodsData () {
      this.goodsListData = this.goodsData
      this.goodsLen = !this.goodsListData.total ? 0 : this.goodsListData.total
    },
    goodsListParams () {
      this.goodsParams = this.goodsListParams
    }
  },
  data () {
    return {
      multipleSelection: [],
      pageSize: [10, 25, 50, 100],
      goodsParams: {},
      goodsLen: 0,
      goodsListData: {},
      productParams: {
        couponTemplateId: '',
        optType: 1,
        rangeIdList: [],
        rangeType: 2
      },
      choiceId: [],
      excludeId: [],
      unChoiceId: [],
      unExcludeId: [],
      excludeState: false,
      deleteState: false,
      addState: false,
      createLinkGoodsList: {},
      allProductId: ''
    }
  },
  computed: {
    tabTypes () {
      return this.activeTab === 'first' || this.activeName === 'first'
    },
    tabTypesOther () {
      return this.activeTab === 'second' || this.activeName === 'second'
    }
  },
  methods: {
    /* 每页显示条数请求 */
    handleSizeChange (val) {
      this.goodsParams.pageSize = val
      this.goodsListPage(this.goodsParams.pageSize, this.goodsParams.pageNum)
      // 把当前选中的每页条数返回出去
      this.$emit('activePageSize', this.goodsParams.pageSize)
    },
    /* 当前页请求 */
    handleCurrentChange (val) {
      this.goodsParams.pageNum = val
      this.goodsListPage(this.goodsParams.pageSize, this.goodsParams.pageNum)
    },

    /* 商品分页基础请求 */
    goodsListPage (number, currentPage) {
      this.goodsParams = {
        couponTemplateId: this.couponId,
        firstCatalogId: this.goodsListParams.firstCatalogId,
        merchantName: this.goodsListParams.merchantName,
        pageNum: !currentPage ? 1 : currentPage,
        pageSize: !number ? 10 : number,
        productName: this.goodsListParams.productName,
        productStatus: this.goodsListParams.productStatus,
        secondCatalogId: this.goodsListParams.secondCatalogId,
        skuid: this.goodsListParams.skuid,
        thirdCatalogId: this.goodsListParams.thirdCatalogId,
        optType: this.activeTab ? 2 : 1
      }
      if (this.tabTypes) {
        // 普通商品列表请求
        goodsList(this.goodsParams).then((res) => {
          if (res.responseCode === ERR_OK) {
            this.goodsListData = res.productList
          } else {
            this.$message(res.responseCode + ':' + res.message)
          }
        }).catch((err) => {
          console.log(err)
        })
      } else {
        excludeGoods(this.goodsParams).then((res) => {
          if (res.responseCode === ERR_OK) {
            this.goodsListData = res.productList
          } else {
            this.$message(res.responseCode + ':' + res.message)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },

    /* 已选择／排除商品数据请求 */
    creatLinkGoodsList () {
      this.goodsParams = {
        couponTemplateId: this.couponId,
        merchantName: this.tabTypes ? '' : this.goodsListParams.merchantName,
        productName: this.tabTypes ? '' : this.goodsListParams.productName,
        skuid: this.tabTypes ? '' : this.goodsListParams.skuid,
        productStatus: this.tabTypes ? '' : this.goodsListParams.productStatus,
        firstCatalogId: this.tabTypes ? '' : this.goodsListParams.firstCatalogId,
        secondCatalogId: this.tabTypes ? '' : this.goodsListParams.secondCatalogId,
        thirdCatalogId: this.tabTypes ? '' : this.goodsListParams.thirdCatalogId,
        optType: this.activeTab ? 2 : 1,
        pageNum: !this.goodsParams.pageNum ? 1 : this.goodsParams.pageNum,
        pageSize: !this.goodsParams.pageSize ? 10 : this.goodsParams.pageSize
      }
      excludeGoods(this.goodsParams).then((res) => {
        if (res.responseCode === ERR_OK) {
          if (this.tabTypesOther) {
            this.goodsListData = res.productList
            // 对筛选结果进行解绑关系时获取商品数量
            this.goodsLen = res.productList.total
          } else {
            this.goodsListPage(this.goodsParams.pageSize, this.goodsParams.pageNum)
          }
          // 获取全部的已排除／选择商品数量
          this.createLinkGoodsListAll()
        } else {
          this.$message(res.responseCode + ':' + res.message)
        }
      }).catch((err) => {
        console.log(err)
      })
    },

    /* 动态展示已选择／排除商品数量 */
    createLinkGoodsListAll () {
      let goodsParams = {
        couponTemplateId: this.couponId,
        merchantName: '',
        productName: '',
        skuid: '',
        productStatus: '',
        firstCatalogId: '',
        secondCatalogId: '',
        thirdCatalogId: '',
        pageNum: 1,
        pageSize: 10,
        optType: this.activeTab ? 2 : 1
      }
      excludeGoods(goodsParams).then((res) => {
        if (res.responseCode === ERR_OK) {
          this.$emit('totalNumber', res.productList.total)
        } else {
          this.$message(res.responseCode + ':' + res.message)
        }
      }).catch((err) => {
        console.log(err)
      })
    },

    /* 获取选中商品id值 */
    handleSelectionChange (val) {
      this.choiceId = []
      this.excludeId = []
      this.unChoiceId = []
      this.unExcludeId = []
      val.forEach((v) => {
        if (this.activeTab === 'first') {
          this.excludeId.push(v.productId)
        } else if (this.activeTab === 'second') {
          this.unExcludeId.push(v.productId)
        } else if (this.activeName === 'first') {
          this.choiceId.push(v.productId)
        } else if (this.activeName === 'second') {
          this.unChoiceId.push(v.productId)
        }
      })
    },

    /* 选择需要排除的商品 */
    excludeProduct () {
      this.baseGoodsChoice(this.couponId, this.excludeId, 2)
    },

    /* 删除已经选择/排除的商品 */
    deleteGoods () {
      if (this.activeName === 'second') {
        // 删除已选择的商品
        this.baseGoodsUnchoice(this.couponId, this.unChoiceId, 1)
      } else if (this.activeTab === 'second') {
        // 删除已排除的商品
        this.baseGoodsUnchoice(this.couponId, this.unExcludeId, 2)
      }
    },

    /* 批量添加商品 */
    addGoods () {
      this.baseGoodsChoice(this.couponId, this.choiceId, 1)
    },

    /* 添加／排除基础方法 */
    baseGoodsChoice (couponId, goodsId, types) {
      this.productParams.couponTemplateId = couponId
      this.productParams.rangeIdList = goodsId.join(',')
      this.productParams.optType = types
      if (!this.productParams.rangeIdList) {
        this.$message('商品ID的值不能为空！')
        return
      }
      this.excludeState = true
      this.addState = true
      choiceExclude(this.productParams).then((res) => {
        if (res.responseCode === ERR_OK) {
          this.$message(res.message)
          this.excludeState = false
          this.addState = false
          this.creatLinkGoodsList()
        } else {
          this.$message(res.responseCode + ':' + res.message)
          this.excludeState = false
          this.addState = false
        }
      }).catch((err) => {
        console.log(err)
        this.excludeState = false
        this.addState = false
      })
    },

    /* 删除已选择／排除基础方法 */
    baseGoodsUnchoice (couponId, goodsId, types) {
      this.productParams.couponTemplateId = couponId
      this.productParams.rangeIdList = goodsId.join(',')
      this.productParams.optType = types
      if (!this.productParams.rangeIdList) {
        this.$message('商品ID的值不能为空！')
        return
      }
      this.deleteState = true
      unchoiceExclude(this.productParams).then((res) => {
        if (res.responseCode === ERR_OK) {
          this.$message(res.message)
          this.deleteState = false
          this.creatLinkGoodsList()
        } else {
          this.$message(res.responseCode + ':' + res.message)
          this.deleteState = false
        }
      }).catch((err) => {
        console.log(err)
        this.deleteState = false
      })
    },

    /* 将已选择／排除商品数据与搜索出符合条件的商品数据进行比对，如果商品数据中存在这批数据，那么禁止用户点击 */
    selectable (row) {
      if (this.tabTypes) {
        if (row.isSelected === 1) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    }

  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import '../../../../styles/coupon/exclude.scss';
</style>
