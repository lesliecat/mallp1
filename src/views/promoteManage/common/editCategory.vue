<template>
  <div class="edit-category">
    <el-dialog title="编辑类目" :visible.sync="dialogCategoryVisible" width="72%">
      <el-tabs v-model="activeName">
        <el-tab-pane label="选择类目" name="first"></el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label">{{selectedLabelName}}</span>
        </el-tab-pane>
      </el-tabs>

      <div class="top-wrapper">
        <el-form
          class="oprator-condition"
          :model="form"
          size="small"
          label-width="80px">
          <choseCategory
            :span="24"
            :reset="isFirstShow"
            @selectedLevel="selectedLevel">
          </choseCategory>
        </el-form>
        <div class="oprator-wrapper">
          <el-button
            type="primary"
            size="mini"
            :disabled="addDisabled"
            @click="deleteOrAppendCategory"
            :loading='loading'
            v-if="isFirstShow">
            <i class="el-icon-plus"></i>
            添加
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="queryExcludeCatalogList"
            :loading='loadingSearch'
            v-if="!isFirstShow">
            <i class="el-icon-search"></i>
            搜索
          </el-button>
          <upload
            :uploadType="uploadType"
            v-if="isFirstShow"
            @uploadResult="uploadSuccess"
            :templateId="editRuleData.id">
          </upload>
          <download
            v-if="isFirstShow"
            :downloadType="downloadType">
          </download>
        </div>
      </div>

      <el-table
        v-if="!isFirstShow"
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          prop="firstCatalogName"
          label="一级类目">
        </el-table-column>
        <el-table-column
          prop="secondCatalogName"
          label="二级类目">
        </el-table-column>
        <el-table-column
          prop="thirdCatalogName"
          label="三级类目"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div class="bottom-wrapper" v-if="isTableShow">
        <div class="top">
          <el-button
            type="primary"
            size="mini"
            :disabled="noSelection"
            @click="deleteOrAppendCategory()">
            删除类目
          </el-button>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="pageSizes"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
        <div class="bottom">
          <el-button class="bottom-close-btn" type="primary" size="mini" @click="dialogCategoryVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  querySelectedOrExcludeCatalogList,
  choiceExclude,
  unchoiceExclude,
  ERR_OK
} from 'api/promoteManage/coupon/index'
import choseCategory from './choseCategory'
import upload from './upload'
import download from './download'
// 模版类型为类目
const ruleType = ['3', '4', '5']
// 操作类型
const optType = 1
export default {
  props: {
    editRuleData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      loadingSearch: false,
      currentLevel: 0,
      activeName: 'first',
      form: {
        firstLevel: '',
        secondLevel: '',
        thirdLevel: ''
      },
      dialogCategoryVisible: false,
      selectedLevelId: [],
      pageSizes: 10,
      downloadType: 3,
      uploadType: '5',
      currentPage: 1,
      total: 0,
      list: [],
      multipleSelection: []
    }
  },
  components: {
    choseCategory,
    upload,
    download
  },
  computed: {
    isFirstShow () {
      return this.activeName === 'first'
    },
    addDisabled () {
      return !this.currentLevel > 0
    },
    isTableShow () {
      return this.list.length > 0 && this.activeName === 'second'
    },
    selectedLabelName () {
      return `已选择类目(${this.total})`
    },
    noSelection () {
      return this.multipleSelection.length <= 0
    }

  },
  watch: {
    editRuleData (newVal) {
      if (ruleType.indexOf(newVal.ruleType) > -1) {
        this.dialogCategoryVisible = true
        this.queryExcludeCatalogList()
      }
    },
    activeName (newVal) {
      this.selectedLevelId = []
      this.currentLevel = 0
    }
  },
  methods: {
    handleSelectionChange (sel) {
      this.multipleSelection = sel
    },
    handleSizeChange (val) {
      this.pageSizes = val
      this.queryExcludeCatalogList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.queryExcludeCatalogList()
    },
    queryExcludeCatalogList () {
      this.loadingSearch = true
      const param = {
        couponTemplateId: this.editRuleData.id,
        optType: optType,
        firstCatalogId: this.selectedLevelId[0],
        secondCatalogId: this.selectedLevelId[1],
        thirdCatalogId: this.selectedLevelId[2],
        pageSize: this.pageSizes,
        pageNum: this.currentPage
      }
      querySelectedOrExcludeCatalogList(param).then((res) => {
        this.loadingSearch = false
        if (res.responseCode === ERR_OK) {
          this.list = res.catalogList.list
          this.total = res.catalogList.total
          if (this.activeName !== 'first') {
            if (this.total === 0) {
              this.$message('暂无相关数据')
            }
          }
        } else {
          this.$message(res.message)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getRangeIdList (arr, name) {
      let rangeIdListArr = []
      for (var i in arr) {
        rangeIdListArr.push(arr[i][`${name}`])
      }
      return rangeIdListArr
    },
    deleteOrAppendCategory () {
      this.loading = true
      let rangeIdList = []
      if (this.activeName === 'first') {
        rangeIdList.push(this.selectedLevelId[this.currentLevel - 1])
      } else {
        for (const i in this.multipleSelection) {
          if (this.multipleSelection[i].thirdCatalogId !== '') {
            rangeIdList.push(this.multipleSelection[i].thirdCatalogId)
          } else if (this.multipleSelection[i].secondCatalogId !== '') {
            rangeIdList.push(this.multipleSelection[i].secondCatalogId)
          } else {
            rangeIdList.push(this.multipleSelection[i].firstCatalogId)
          }
        }
      }

      const params = {
        couponTemplateId: this.editRuleData.id,
        optType: optType,
        rangeType: this.currentLevel + 2,
        rangeIdList: rangeIdList.join(',')
      }
      if (this.activeName === 'first') { // 建立关系
        choiceExclude(params).then((res) => {
          this.loading = false
          if (res.responseCode === ERR_OK) {
            this.selectedLevelId = []
            this.queryExcludeCatalogList()
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          } else {
            this.$message(res.message)
          }
        }).catch((err) => {
          console.log(err)
        })
      } else { // 删除关系
        params.rangeType = 0 // 删除关系0混合
        unchoiceExclude(params).then((res) => {
          this.loading = false
          if (res.responseCode === ERR_OK) {
            this.queryExcludeCatalogList()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message(res.message)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    uploadSuccess (val) {
      if (val) {
        this.queryExcludeCatalogList()
      }
    },
    selectedLevel (val) {
      this.selectedLevelId = val
      const cacheArr = []
      for (var i = 0; i < val.length; i++) {
        if (val[i] !== '') {
          cacheArr.push(val[i])
        }
      }
      this.currentLevel = cacheArr.length
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.el-dialog__header{
  border-bottom: 1px solid #e4e7ed;
}
.edit-category{
  .el-table__header-wrapper{
    border-top: 1px solid #e4e7ed;
  }
}
.top-wrapper{
  padding: 10px 0 20px;
  .oprator-wrapper{
    text-align: right;
  }
}
.bottom-wrapper{
  .top{
    padding: 20px 0;
    border-bottom: 1px solid #e4e7ed;
    overflow: hidden;
    .el-pagination{
      display: inline-block;
      float: right;
      margin-top: 0;
    }
  }
  .bottom{
    padding-top: 20px;
    text-align: right;
  }
}
</style>
