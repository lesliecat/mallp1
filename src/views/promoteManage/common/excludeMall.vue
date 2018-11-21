<template>
  <div>
    <el-dialog
      title="排除商户"
      :visible.sync="excludeMallPop"
      :before-close="handleClose">
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane label="选择排除商户" name="first">
        </el-tab-pane>
        <el-tab-pane :label="'已选择商户'+'('+selectedNum+')'" name="second">
        </el-tab-pane>
        <!-- 中间内容区开始 -->
        <mall-search
          :activeTab="activeTab"
          @listData="listDataFunc"
          @queryListData="queryListDataFunc"
          @selectedNum="selectedNumFunc"
          :pageSize="pageSize"
          :currentPage="currentPage"
          :couponTemplateId="couponTemplateId"
          :refresh="refresh"
          :uploadType="uploadType"
          :queryAgain="queryAgain">
        </mall-search>
        <mall-list
          :listData="listData"
          @pageSize="pageSizeFunc"
          @currentPage="currentPageFunc"
          @selectList="selectListFunc"
          :couponTemplateId="couponTemplateId"
          :pageTotal="pageTotal"
          :isShowPage="isShowPage">
          <div slot="listButtons">
            <el-button
              class="btn"
              type="primary"
              size="mini"
              v-if="activeTab==='first'"
              v-show="isShowRelationshipBtn"
              @click="excludeMall"
              :loading="loadingState">
              排除商户
            </el-button>
            <el-button
              class="btn"
              type="primary"
              size="mini"
              v-if="activeTab==='second'"
              v-show="isShowRelationshipBtn"
              @click="delSelect"
              :loading="loadingState">
              删除
            </el-button>
          </div>
        </mall-list>
        <!-- 中间内容区结束 -->
        <div class="closeBtn">
          <el-button type="primary" @click="handleClose" size="mini">关闭</el-button>
        </div>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import mallSearch from './excludes/mallSearch.vue'
import mallList from './excludes/mallList.vue'
import {
  choiceExclude,
  unchoiceExclude,
  excludeMall,
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
      activeTab: 'first',
      goodsNumber: 0,
      excludeMallPop: false,
      selectionId: [],
      multipleSelection: [],
      listData: [],
      pageSize: 10,
      currentPage: 1,
      couponTemplateId: '',
      refresh: 1,
      pageTotal: 1,
      uploadType: '4',
      isShowPage: false,
      selectedNum: '',
      loadingState: false,
      queryAgain: -1
    }
  },
  components: {
    mallSearch,
    mallList
  },
  computed: {
    isShowRelationshipBtn () {
      if (this.listData.length !== 0) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    excludeRuleData: {
      deep: true,
      handler (newval) {
        if (newval.ruleType === '1') {
          this.excludeMallPop = true
          this.activeTab = 'first'
          this.listData = []
          this.couponTemplateId = newval.id
          this.querySecondForm()
        }
      }
    },
    activeTab: {
      deep: true,
      handler (newval) {
        this.listData = []
        this.pageTotal = 0
        this.isShowPage = false
        this.currentPage = 1
      }
    }
  },
  methods: {
    handleClose () {
      this.activeName = 'second'
      this.pageTotal = 0
      this.excludeMallPop = false
    },
    /* tab选项卡切换 */
    handleClick (tab) {
      this.activeTab = tab.name
    },
    /* 删除商户 */
    deletExclude () {
    },
    /* 关闭对话框 */
    closePop (val) {
      this[val] = !this[val]
    },
    listDataFunc (val) {
      this.listData = val
    },
    pageSizeFunc (val) {
      this.pageSize = val
    },
    currentPageFunc (val) {
      this.currentPage = val
    },
    selectListFunc (val) {
      this.selectList = val
    },
    queryListDataFunc (val) {
      this.listData = val.list
      this.pageTotal = val.total
      if (val.list !== []) {
        this.isShowPage = true
      }
    },
    querySecondForm () {
      let params = {
        couponTemplateId: this.couponTemplateId,
        merchantId: '',
        merchantName: '',
        optType: 2,
        pageNum: 1,
        pageSize: this.pageSize
      }
      excludeMall(params).then(res => {
        if (res.responseCode === ERR_OK) {
          this.selectedNum = res.merchantList.total
        }
      }).catch(_ => {})
    },
    excludeMall () {
      // 排除建立关系
      let rangeIdlist = []
      for (let k in this.selectList) {
        rangeIdlist.push(this.selectList[k].merchantId)
      }
      let params = {
        couponTemplateId: this.couponTemplateId,
        optType: 2,
        rangeIdList: rangeIdlist.join(','),
        rangeType: 1
      }
      if (params.rangeIdList.length !== 0) {
        this.loadingState = true
        choiceExclude(params).then(res => {
          this.querySecondForm()
          this.$message(res.message)
          this.loadingState = false
          this.queryAgain -= 1
        }).catch(_ => {})
      } else {
        this.$message('请选择需要添加的选项')
      }
    },
    delSelect () {
      // 排除删除关系
      let rangeIdlist = []
      for (let k in this.selectList) {
        rangeIdlist.push(this.selectList[k].merchantId)
      }
      let params = {
        couponTemplateId: this.couponTemplateId,
        optType: 2,
        rangeIdList: rangeIdlist.join(','),
        rangeType: 1
      }
      this.loadingState = true
      unchoiceExclude(params).then(res => {
        if (res.responseCode === ERR_OK) {
          this.querySecondForm()
          this.refresh += 1
        }
        this.$message(res.message)
        this.loadingState = false
      }).catch(_ => {})
    },
    selectedNumFunc (val) {
      this.selectedNum = val
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import '../../../styles/coupon/exclude.scss';
</style>
