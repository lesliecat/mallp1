<template>
  <div class="banner">
    <div class="select-area">
      <el-select
        v-model="firstCategory" filterable clearable placeholder="请选择一级分类" @change="getSecondCatgoryList">
        <el-option
          v-for="item in firstCategoryList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select
        v-model="secondCategory" filterable clearable placeholder="请选择二级分类" @change="getThirdCatgoryList">
        <el-option
          v-for="item in secondCategoryList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select
        v-model="thirdCategory" filterable clearable placeholder="请选择三级分类">
        <el-option
          v-for="item in thirdCategoryList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" @click="fetchData()" icon="el-icon-search">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      border>
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        prop="thiCatalogName"
        label="三级类目">
      </el-table-column>
      <el-table-column
        prop="secCatalogName"
        label="二级类目">
      </el-table-column>
      <el-table-column
        prop="firCatalogName"
        label="一级类目">
      </el-table-column>
      <el-table-column
        width="350px"
        label="价格区间">
        <template slot-scope="scope">
          <el-tag
            style="margin-left:25px"
            :disable-transitions="false">
            {{scope.row.priceZone1Start}}-{{scope.row.priceZone1End}}
          </el-tag>
          <el-tag
            style="margin-right:25px"
            type="info">
            {{scope.row.priceZone1Percent}}%
          </el-tag>
          <br/>
          <el-tag
            style="margin-left:25px"
            :disable-transitions="false">
            {{scope.row.priceZone2Start}}-{{scope.row.priceZone2End}}
          </el-tag>
          <el-tag
            style="margin-right:25px"
            type="info">
            {{scope.row.priceZone2Percent}}%
          </el-tag>
          <br/>
          <el-tag
            style="margin-left:25px"
            :disable-transitions="false">
            {{scope.row.priceZone3Start}}-{{scope.row.priceZone3End}}
          </el-tag>
          <el-tag
            style="margin-right:25px"
            type="info">
            {{scope.row.priceZone3Percent}}%
          </el-tag>
          <span class="dpy-rig-bot">
            <a
              @click="handleEdit(scope.$index,scope.row.recommendPriceConfigId)">
              <i class="el-icon-edit"></i>
            </a>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否人工">
        <template slot-scope="scopes">
          <el-switch
            v-model="scopes.row.isAuto"
            active-value="1"
            inactive-value="0"
            active-text="是"
            inactive-text="否"
            @change="handelIsAuto(scopes.row.isAuto,scopes.row.recommendPriceConfigId,scopes.row.updatedDate)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="isShow"
        label="是否展示">
        <template slot-scope="scopes">
          <el-switch
            v-model="scopes.row.isShow"
            active-value="1"
            inactive-value="0"
            active-text="是"
            inactive-text="否"
            @change="handelIsShow(scopes.row.isShow,scopes.row.recommendPriceConfigId,scopes.row.updatedDate)">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 25, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="dataTotal">
    </el-pagination>
    <el-dialog
      title="编辑价格区间"
      :visible.sync="editDialogVisible"
      width="42%"
      @close="editDialogVisible = false">
      <el-form
        label-width="70px" v-model="priceRangeEditList" style="text-align:center">
        <div class="list-complete-item" v-for="(item, index) in priceRangeEditList" :key="index">
          <el-col :span="8">
            <el-form-item
              prop="from"
              label="From">
              <el-input type="number" v-model.number="item.from"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              prop="to"
              label="To">
              <el-input type="number" v-model.number="item.to"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="百分比">
              <el-input v-model="item.percent"></el-input>
            </el-form-item>
          </el-col>
          <el-alert
            v-if="item.isShow"
            style="width:94%;margin:0 3%"
            :title="item.content"
            type="error"
            show-icon
            :closable="false">
          </el-alert>
        </div>
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmEdit()">
          确 定
        </el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getConfigPriceList,
  queryLevelCatalog,
  updateConfigPriceById
} from 'api'

export default {
  name: 'priceRange',
  data () {
    return {
      tableData: [],
      // 编辑后弹窗中的价格区间呈现
      priceRangeEditList: [
        {
          from: '',
          to: '',
          percent: '',
          isShow: false,
          content: ''
        },
        {
          from: '',
          to: '',
          percent: '',
          isShow: false,
          content: ''
        },
        {
          from: '',
          to: '',
          percent: '',
          isShow: false,
          content: ''
        }
      ],
      // 类目筛选下拉列表
      firstCategoryList: [],
      secondCategoryList: [],
      thirdCategoryList: [],
      // 控制弹窗是否展示
      editDialogVisible: false,
      // 当前编辑的价格id
      currentConfigId: 0,
      currentIndex: '',
      // 筛选选择的类目
      firstCategory: '',
      secondCategory: '',
      thirdCategory: '',
      // 当前页码，分页使用
      currentPage: 1,
      // 数据总条数，分页使用
      dataTotal: 0,
      pageSize: 25
    }
  },
  created () {
    this.fetchCategoryData()
    this.fetchData()
  },
  methods: {
    initData () {
      // 类目筛选下拉列表
      this.firstCategoryList = []
      this.secondCategoryList = []
      this.thirdCategoryList = []
      // 筛选选择的类目
      this.firstCategory = ''
      this.secondCategory = ''
      this.thirdCategory = ''
      // 当前页码，分页使用
      this.currentPage = 1
      // 数据总条数，分页使用
      this.dataTotal = 0
      this.pageSize = 25
      this.fetchCategoryData()
      this.fetchData()
    },
    fetchCategoryData () {
      queryLevelCatalog()
        .then(response => {
          if (response.responseCode === '000') {
            this.firstCategoryList = response.json
          } else {
            this.$message(response.responseMsg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    fetchData () {
      let getConfigPriceListPara = {
        firCatalogId: this.firstCategory,
        secCatalogId: this.secondCategory,
        thiCatalogId: this.thirdCategory,
        pageSize: this.pageSize,
        pageNum: this.currentPage
      }
      getConfigPriceList(getConfigPriceListPara)
        .then(response => {
          if (response.responseCode === '0') {
            this.tableData = response.priceList.list
            this.dataTotal = response.priceList.total
          } else {
            this.$message(response.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getSecondCatgoryList () {
      this.secondCategory = ''
      this.thirdCategory = ''
      this.secondCategoryList = []
      this.thirdCategoryList = []
      this.firstCategoryList.forEach(item => {
        if (item.id === this.firstCategory) {
          this.secondCategoryList = item.children
        }
      })
    },
    getThirdCatgoryList () {
      this.thirdCategory = ''
      this.thirdCategoryList = []
      this.secondCategoryList.forEach(item => {
        if (item.id === this.secondCategory) {
          this.thirdCategoryList = item.children
        }
      })
    },
    handelIsAuto (isAuto, configId, updatedDate) {
      let updateConfigPriceByIdPara = {
        isAuto: isAuto,
        recommendPriceConfigId: configId,
        updatedDate: updatedDate
      }
      updateConfigPriceById(updateConfigPriceByIdPara)
        .then(response => {
          if (response.responseCode === '0') {
            this.fetchData()
          } else {
            this.$message(response.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handelIsShow (isShow, configId, updatedDate) {
      let updateConfigPriceByIdPara = {
        isShow: isShow,
        recommendPriceConfigId: configId,
        updatedDate: updatedDate
      }
      updateConfigPriceById(updateConfigPriceByIdPara)
        .then(response => {
          if (response.responseCode === '0') {
            this.fetchData()
          } else {
            this.$message(response.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleEdit (index, configId) {
      this.editDialogVisible = true
      this.priceRangeEditList[0].from = this.tableData[index].priceZone1Start
      this.priceRangeEditList[0].to = this.tableData[index].priceZone1End
      this.priceRangeEditList[0].percent = this.tableData[index].priceZone1Percent

      this.priceRangeEditList[1].from = this.tableData[index].priceZone2Start
      this.priceRangeEditList[1].to = this.tableData[index].priceZone2End
      this.priceRangeEditList[1].percent = this.tableData[index].priceZone2Percent

      this.priceRangeEditList[2].from = this.tableData[index].priceZone3Start
      this.priceRangeEditList[2].to = this.tableData[index].priceZone3End
      this.priceRangeEditList[2].percent = this.tableData[index].priceZone3Percent
      this.currentConfigId = configId
      this.currentIndex = index
      this.currentUpdatedDate = this.tableData[index].updatedDate
    },
    confirmEdit () {
      if (this.validatePara(this.priceRangeEditList)) {
        this.editDialogVisible = false
        let updateConfigPriceByIdPara = {
          priceZone1End: this.priceRangeEditList[0].to,
          priceZone1Percent: this.priceRangeEditList[0].percent,
          priceZone1Start: this.priceRangeEditList[0].from,
          priceZone2End: this.priceRangeEditList[1].to,
          priceZone2Percent: this.priceRangeEditList[1].percent,
          priceZone2Start: this.priceRangeEditList[1].from,
          priceZone3End: this.priceRangeEditList[2].to,
          priceZone3Percent: this.priceRangeEditList[2].percent,
          priceZone3Start: this.priceRangeEditList[2].from,
          recommendPriceConfigId: this.currentConfigId,
          updatedDate: this.currentUpdatedDate
        }
        updateConfigPriceById(updateConfigPriceByIdPara)
          .then(response => {
            if (response.responseCode === '0') {
              this.fetchData()
            } else {
              this.$message(response.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    validatePara (editList) {
      let flag = true
      editList.forEach(item => {
        item.isShow = false
        item.content = ''
        if (!item.from || !item.to) {
          item.isShow = true
          item.content = '价格区间必填'
          flag = false
        } else if (parseInt(item.from) >= parseInt(item.to)) {
          item.isShow = true
          item.content = '价格区间的左值必须小于右值'
          flag = false
        } else if (item.percent >= 100 || item.percent <= 0) {
          item.isShow = true
          item.content = '价格区间百分比必须介于0和100之间'
          flag = false
        } else if (isNaN(item.percent)) {
          item.isShow = true
          item.content = '价格区间必须是数字'
          flag = false
        } else if ((item.percent * 10) % 1 !== 0) {
          item.isShow = true
          item.content = '价格区间最多只能1位小数'
          flag = false
        }
      })
      if (editList[0].to !== editList[1].from) {
        editList[1].isShow = true
        editList[1].content = '价格区间左值必须和上一个区间的右值相同'
        flag = false
      }
      if (editList[1].to !== editList[2].from) {
        editList[2].isShow = true
        editList[2].content = '价格区间左值必须和上一个区间的右值相同'
        flag = false
      }
      return flag
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.fetchData()
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route () {
      this.initData()
    }
  },
  components: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.banner {
  padding: 20px 30px;
  h2 {
    padding-bottom: 10px;
    border-bottom: #eee solid 2px;
  }
  h3 {
    padding-bottom: 10px;
    border-bottom: #eee solid 1px;
  }
}

.select-area {
  margin-bottom: 30px;
}

.el-select {
  width: 20%;
  margin: 0 2% 0 0;
}

.el-tag {
  margin: 0 10px 10px 0;
}

.dpy-rig-bot {
  position: absolute;
  right: 10px;
  bottom: 0;
}

.el-pagination {
  text-align: center;
  margin-top: 50px;
}

.el-icon-edit {
  font-size: 18px;
}

.list-complete-item {
  cursor: pointer;
  position: relative;
  padding: 20px 6px 6px 6px;
  float: left;
  margin-bottom: 10px;
}
</style>
