<template>
    <div>
          <el-dialog title="排除商品"
          :visible.sync="excludeGoodsPop"
          :before-close="closePop">
            <el-tabs v-model="excludeGoodsName" @tab-click="handleClick">
              <el-tab-pane label="选择排除商品" name="first">
              </el-tab-pane>
              <el-tab-pane :label="'已排除商品'+' ( '+ excludeGoodsDataNumber +' ) '" name="second">
              </el-tab-pane>
              <!-- 中间内容区开始 -->
                <div class="continer">
                  <product-search :activeTab="excludeGoodsName"
                                  :couponId="excludeRuleData.id"
                                  @goodsListData="goodsListData"
                                  :defaultPageSize="defaultPageSize"
                                  @uploadNumber="uploadNumber">
                  </product-search>
                  <product-list :goodsData="(excludeGoodsName==='first') ? goodsData : excludeGoodsData"
                                :activeTab="excludeGoodsName" :couponId="excludeRuleData.id"
                                :goodsListParams="goodsListParams"
                                @totalNumber="totalNumber"
                                @activePageSize="activePageSize">
                  </product-list>
                </div>
              <!-- 中间内容区结束 -->
              <div class="closeButton">
                <el-button type="primary" @click="closePop" size="mini">关闭</el-button>
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
    excludeRuleData: {
      type: Object
    }
  },
  data () {
    return {
      excludeGoodsName: 'first',
      excludeGoodsPop: false,
      goodsData: {
        'list': []
      },
      goodsListParams: {},
      excludeGoodsData: {
        'list': []
      },
      excludeGoodsDataNumber: 0,
      defaultPageSize: 10
    }
  },
  watch: {
    excludeRuleData: {
      deep: true,
      handler (newval) {
        if (newval.ruleType === '2') {
          this.excludeGoodsPop = true
          // 点击时需要请求全部已排除的商品数据
          this.excludeGoodsList()
        }
      }
    },
    excludeGoodsName () {
      if (this.excludeGoodsName === 'second') {
        this.excludeGoodsList()
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
      this.excludeGoodsName = tab.name
      if (this.excludeGoodsName === 'first') {
        this.goodsData = {
          'list': []
        }
        this.tabsClean()
      } else if (this.excludeGoodsName === 'second') {
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
      if (this.excludeGoodsName === 'first') {
        this.goodsData = data['0']
      } else if (this.excludeGoodsName === 'second') {
        this.excludeGoodsData = data['0']
        // this.excludeGoodsDataNumber = this.excludeGoodsData.total
      }
      this.goodsListParams = data['1']
    },

    /* 获取当前选中的页码条数 */
    activePageSize (val) {
      this.defaultPageSize = val
    },

    /* 已排除商品列表基础请求(页面初始化过程中展示全部数据) */
    excludeGoodsList () {
      this.goodsListParams.couponTemplateId = this.excludeRuleData.id
      this.goodsListParams.optType = 2
      this.goodsListParams.pageNum = 1
      this.goodsListParams.pageSize = this.defaultPageSize
      excludeGoods(this.goodsListParams).then((res) => {
        if (res.responseCode === ERR_OK) {
          this.excludeGoodsData = res.productList
          this.excludeGoodsDataNumber = this.excludeGoodsData.total
        } else {
          this.$message(res.responseCode + ':' + res.message)
        }
      }).catch((err) => {
        console.log(err)
      })
    },

    /* 实时更新已排除的商品数量 */
    totalNumber (num) {
      this.excludeGoodsDataNumber = num
    },

    /* 关闭对话框并清空数据 */
    closePop () {
      this.excludeGoodsPop = !this.excludeGoodsPop
      this.defaultPageSize = 10
      if (this.excludeGoodsName === 'first') {
        this.goodsData = {
          'list': []
        }
      }
    },

    /* 批量导入成功后，实时更新已排除商品数量 */
    uploadNumber (num) {
      this.excludeGoodsDataNumber = num
    }

  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import '../../../styles/coupon/exclude.scss';
</style>
