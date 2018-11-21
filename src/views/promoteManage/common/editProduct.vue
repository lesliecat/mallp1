<template>
  <div>
    <el-dialog title="编辑商品"
      :visible.sync="eidtDialog"
      :before-close="closePop">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="选择商品" name="first"></el-tab-pane>
        <el-tab-pane :label="'已选择商品'+' ( '+ choiceGoodsDataNumber +' ) '" name="second"></el-tab-pane>
        <!-- 中间内容区开始 -->
        <div class="continer">
          <product-search :activeName="activeName"
                          :couponId="editRuleData.id"
                          @goodsListData="goodsListData"
                          :defaultPageSize="defaultPageSize"
                          @uploadNumber="uploadNumber">
          </product-search>
          <product-list :goodsData="(activeName==='first') ? goodsData : choiceGoodsData"
                        :activeName="activeName" :couponId="editRuleData.id"
                        :goodsListParams="goodsListParams"
                        @totalNumber="totalNumber"
                        @activePageSize="activePageSize">
          </product-list>
        </div>
        <!-- 中间内容区结束 -->
        <div class="closeButton">
          <el-button type="primary" @click="closePop"  size="mini" style="">关闭</el-button>
        </div>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import productSearch from './excludes/productSearch.vue'
import productList from './excludes/productList.vue'
import {
  excludeGoods,
  ERR_OK
} from 'api/promoteManage/coupon/index'
export default {
  props: {
    editRuleData: {
      type: Object
    }
  },
  data () {
    return {
      activeName: 'first',
      eidtDialog: false,
      goodsData: {
        'list': []
      },
      goodsListParams: {},
      choiceGoodsData: {
        'list': []
      },
      choiceGoodsDataNumber: 0,
      defaultPageSize: 10
    }
  },
  watch: {
    editRuleData: {
      deep: true,
      handler (newval) {
        if (newval.ruleType === '2') {
          this.eidtDialog = true
          // 点击时需要请求全部已选择的商品数据
          this.choiceGoodsList()
        }
      }
    },
    activeName () {
      if (this.activeName === 'second') {
        this.choiceGoodsList()
      }
    }
  },
  components: {
    productSearch,
    productList
  },
  methods: {
    /* tab选项卡切换 */
    handleClick (tab) {
      this.activeName = tab.name
      if (this.activeName === 'first') {
        this.goodsData = {
          'list': []
        }
        this.tabsClean()
      } else if (this.activeName === 'second') {
        this.tabsClean()
      }
    },

    /* 清空已经传递过来的参数 */
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
    },

    /* 获取商品列表数据 */
    goodsListData (data) {
      if (this.activeName === 'first') {
        this.goodsData = data['0']
      } else if (this.activeName === 'second') {
        this.choiceGoodsData = data['0']
        // this.choiceGoodsDataNumber = this.choiceGoodsData.total
      }
      this.goodsListParams = data['1']
    },

    /* 获取当前选中的页码条数 */
    activePageSize (val) {
      this.defaultPageSize = val
    },

    /* 已选择商品列表基础请求(页面初始化过程中展示全部数据) */
    choiceGoodsList () {
      this.goodsListParams.couponTemplateId = this.editRuleData.id
      this.goodsListParams.optType = 1
      this.goodsListParams.pageNum = 1
      this.goodsListParams.pageSize = this.defaultPageSize
      excludeGoods(this.goodsListParams).then((res) => {
        if (res.responseCode === ERR_OK) {
          this.choiceGoodsData = res.productList
          this.choiceGoodsDataNumber = this.choiceGoodsData.total
        } else {
          this.$message(res.responseCode + ':' + res.message)
        }
      }).catch((err) => {
        console.log(err)
      })
    },

    /* 实时更新已选择的商品数量 */
    totalNumber (num) {
      this.choiceGoodsDataNumber = num
    },

    /* 关闭对话框并清空数据 */
    closePop () {
      this.eidtDialog = !this.eidtDialog
      this.defaultPageSize = 10
      if (this.activeName === 'first') {
        this.goodsData = {
          'list': []
        }
      }
    },

    /* 批量导入成功后，实时更新已排除商品数量 */
    uploadNumber (num) {
      this.choiceGoodsDataNumber = num
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss">
@import '../../../styles/coupon/exclude.scss';
</style>
