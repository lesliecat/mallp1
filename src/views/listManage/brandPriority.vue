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
        prop="thi_name"
        label="三级类目">
      </el-table-column>
      <el-table-column
        prop="sec_name"
        label="二级类目">
      </el-table-column>
      <el-table-column
        prop="fir_name"
        label="一级类目">
      </el-table-column>
      <el-table-column
        prop="brand_name"
        label="品牌">
      </el-table-column>
      <el-table-column
        prop="brand_pri"
        label="展示优先级">
        <template slot-scope="scope">
          {{scope.row.brand_pri}}
          <span class="dpy-rig-bot">
            <a
              @click="handleEdit(scope.row.brand_id,scope.row.brand_pri,scope.row.fir_id,scope.row.sec_id,scope.row.thi_id,scope.$index,scope.row.updateDate)">
              <i class="el-icon-edit"></i>
            </a>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="brand_pri_auto"
        label="计算优先级">
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
  </div>
</template>
<script>
import { queryCatalogBrand, queryLevelCatalog, UpdateBrandPri, ERR_OK } from 'api'

export default {
  name: 'priceRange',
  data () {
    return {
      tableData: [],
      // 类目筛选下拉列表
      firstCategoryList: [],
      secondCategoryList: [],
      thirdCategoryList: [],
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
          if (response.responseCode === ERR_OK) {
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
      let queryCatalogBrandPara = {
        firCatalogId: this.firstCategory,
        secCatalogId: this.secondCategory,
        thiCatalogId: this.thirdCategory,
        pageSize: this.pageSize,
        pageNum: this.currentPage
      }
      queryCatalogBrand(queryCatalogBrandPara)
        .then(response => {
          if (response.responseCode === ERR_OK) {
            this.tableData = []
            if (response.responseCode === ERR_OK) {
              this.tableData = response.pageList.list
              this.dataTotal = response.pageList.total
            } else {
              this.$message(response.responseMsg)
            }
          } else {
            this.$message(response.responseMsg)
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
    handleEdit (brandId, val, firId, secId, thiId, index, updateDate) {
      this.$prompt('展示优先级', '编辑展示优先级', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[1-9][0-9]*$|^0$/,
        inputValue: val,
        inputErrorMessage: '必填且必须是0或0以上的整数'
      }).then(({ value }) => {
        let UpdateBrandPriPara = {
          fir_id: firId,
          sec_id: secId,
          thi_id: thiId,
          brand_id: brandId,
          brand_pri: value,
          updateDate: updateDate
        }
        UpdateBrandPri(UpdateBrandPriPara)
          .then(response => {
            if (response.responseCode === ERR_OK) {
              this.fetchData()
            } else {
              this.$message(response.responseMsg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }).catch(() => {})
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

.list-complete-item {
  cursor: pointer;
  position: relative;
  padding: 20px 6px 6px 6px;
  float: left;
  margin-bottom: 10px;
}
</style>
