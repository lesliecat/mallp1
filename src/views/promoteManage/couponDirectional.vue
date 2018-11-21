<template>
  <div>
    <editCategory></editCategory>
    <div class="handle-top">
        <el-form class="search-criteria" ref="form" :inline="true" :model="form" label-width="80px">
          <el-form-item label="发券时间">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.dateBefore"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.dateAfter"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="操作人">
            <el-input v-model="form.oprator"></el-input>
          </el-form-item>
        </el-form>

        <div class="oprator-wrapper">
          <el-button type="primary">
            <i class="el-icon-search"></i>
            查询
          </el-button>
          <el-button
            type="primary"
            @click="dialogFormVisible = true">
            单个用户发券
          </el-button>
          <el-button type="primary">批量导入</el-button>
        </div>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="模版ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="券名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="denomination"
        label="面额">
      </el-table-column>
      <el-table-column
        prop="date"
        label="发券时间">
      </el-table-column>
      <el-table-column
        prop="number"
        label="发券数量">
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="operator"
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="target"
        label="发券对象">
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>

    <el-dialog title="单个用户发券" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" label-width="96px">
        <el-form-item label="请输入用户号">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="请输入模版ID">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import editCategory from './common/editCategory'

export default {
  data () {
    return {
      form: {
        dateBefore: '',
        dateAfter: '',
        oprator: ''
      },

      tableData: [{
        id: '1122',
        name: '旺年好满99减10元',
        denomination: '99减10',
        date: '2018-02-01 10:00:56',
        number: '2',
        state: '已经发送',
        operator: '秦翠翠',
        target: '17521012733'
      }, {
        id: '1122',
        name: '旺年好满99减10元',
        denomination: '99减10',
        date: '2018-02-01 10:00:56',
        number: '2',
        state: '已经发送',
        operator: '秦翠翠',
        target: '17521012733'
      }],

      currentPage: 1,

      dialogFormVisible: false
    }
  },
  components: {
    editCategory
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .handle-top{
    padding-top: 20px;
  }
  .search-criteria{
    padding: 20px 10px 0 0;
    display: inline;
  }
  .oprator-wrapper{
    display: inline;
    padding-left: 12px;
  }
  .el-date-editor.el-input{
    width: auto;
  }
  .line{
    text-align: center
  }
</style>
