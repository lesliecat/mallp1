<template>
  <div class="list">
      <el-table
        ref="multipleTable"
        :data="listData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
          <el-table-column
          type="selection"
          :selectable="isSelected">
          </el-table-column>
          <el-table-column
            label="商户Id"
            prop="merchantId">
          </el-table-column>
          <el-table-column
            prop="merchantName"
            label="商户名称">
          </el-table-column>
        </el-table>
        <div class="listButtonGroups">
          <slot name="listButtons"></slot>
        </div>
        <div class="block pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageTotal"
            v-if="isShowPage"
            v-show="isShowRelationshipBtn">
          </el-pagination>
        </div>
  </div>
</template>
<script>
export default {
  props: {
    listData: {
      type: Array
    },
    couponTemplateId: {
      type: String
    },
    pageTotal: {
      type: Number
    },
    isShowPage: {
      type: Boolean
    }
  },
  data () {
    return {
      multipleSelection: [],
      pageSizes: [10, 25, 50, 100],
      pageSize: 10,
      currentPage: 1,
      total: 1
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
    /* 获取选中的商户值或者已排除的商户值 */
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.$emit('selectList', this.multipleSelection)
    },
    handleSizeChange (val) {
      this.$emit('pageSize', val)
      this.pageSize = val
      /* 向后端发送请求重新请求列表数据 */
    },
    handleCurrentChange (val) {
      /* 向后端发送请求重新请求列表数据 */
      this.$emit('currentPage', val)
    },
    isSelected (row, index) {
      return row.isSelected === 0 ? 1 : 0
    }
  },
  watch: {
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  @import '../../../../styles/coupon/exclude.scss';
</style>
