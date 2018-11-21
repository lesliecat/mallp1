<template>
  <div>
    <el-dialog
      title="编辑商户"
      :visible.sync="editMallDialog"
      width="66%"
      :before-close="handleClose">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="选择商户" name="first"></el-tab-pane>
        <el-tab-pane :label="'已选择商户'+'('+selectedNum+')'" name="second"></el-tab-pane>
        <div class="continer">
          <mall-search
            :activeName="activeName"
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
            :activeName="activeName"
            :isShowPage="isShowPage">
            <div slot="listButtons">
              <el-button
                class="btn"
                type="primary"
                size="mini"
                v-if="activeName==='first'"
                v-show="isShowRelationshipBtn"
                @click="addMall"
                :loading="loadingState">
                添加商户
              </el-button>
              <el-button
                class="btn"
                type="primary"
                size="mini"
                v-if="activeName==='second'"
                v-show="isShowRelationshipBtn"
                @click="delSelect"
                :loading="loadingState">
                删除
              </el-button>
            </div>
          </mall-list>
        </div>
        <!-- 中间内容区结束 -->
      </el-tabs>
      <div class="closeBtn">
        <el-button type="primary" @click="handleClose" size="mini">关闭</el-button>
      </div>
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
    editRuleData: {
      type: Object
    }
  },
  components: {
    mallSearch,
    mallList
  },
  mounted () {
  },
  data () {
    return {
      editMallDialog: false,
      value: '',
      multipleSelection: [],
      activeName: 'first',
      input: '',
      isShowSendIn: true,
      listData: [],
      pageSize: 10,
      currentPage: 1,
      couponTemplateId: '',
      refresh: 1,
      pageTotal: 0,
      uploadType: '3',
      isShowPage: false,
      selectedNum: 0,
      loadingState: false,
      queryAgain: 1
    }
  },
  created () {
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
  methods: {
    handleClose () {
      this.activeName = 'second'
      this.pageTotal = 0
      this.editMallDialog = false
    },
    handleClick (tab, event) {
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
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
    addMall () {
      // 建立关系
      let rangeIdlist = []
      for (let k in this.selectList) {
        rangeIdlist.push(this.selectList[k].merchantId)
      }
      let params = {
        couponTemplateId: this.couponTemplateId,
        optType: 1,
        rangeIdList: rangeIdlist.join(','),
        rangeType: 1
      }
      if (params.rangeIdList.length !== 0) {
        this.loadingState = true
        choiceExclude(params).then(res => {
          this.querySecondForm()
          this.$message(res.message)
          this.queryAgain += 1
          this.loadingState = false
        }).catch(_ => {})
      } else {
        this.$message('请选择需要添加的选项')
      }
    },
    delSelect () {
      // 删除关系
      let rangeIdlist = []
      for (let k in this.selectList) {
        rangeIdlist.push(this.selectList[k].merchantId)
      }
      let params = {
        couponTemplateId: this.couponTemplateId,
        optType: 1,
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
    querySecondForm () {
      let params = {
        couponTemplateId: this.couponTemplateId,
        merchantId: '',
        merchantName: '',
        optType: 1,
        pageNum: 1,
        pageSize: this.pageSize
      }
      excludeMall(params).then(res => {
        if (res.responseCode === ERR_OK) {
          this.selectedNum = res.merchantList.total
        }
      }).catch(_ => {})
    },
    selectedNumFunc (val) {
      this.selectedNum = val
    }
  },
  watch: {
    editRuleData: {
      deep: true,
      handler (newval) {
        if (newval.ruleType === '1') {
          this.editMallDialog = true
          this.activeName = 'first'
          this.listData = []
          this.couponTemplateId = newval.id
          this.querySecondForm()
        }
      }
    },
    activeName: {
      deep: true,
      handler (newval) {
        this.listData = []
        this.pageTotal = 0
        this.isShowPage = false
        this.currentPage = 1
      }
    }
  }
}
</script>

<style lang="scss">
  .fr{
    float:right
  }
  .center{
    text-align: center
  }
</style>
