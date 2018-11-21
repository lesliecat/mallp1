<template>
  <div>
    <el-col :span="span">
      <el-form-item label="类目">
        <el-select
          v-model="firstLevelCatalog"
          filterable
          clearable
          size="small"
          placeholder="请选择一级类目"
          @change="getSecondLevelList">
          <el-option
            v-for="item in firstCatalogList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select
          v-model="secondLevelCatalog"
          filterable
          clearable
          size="small"
          placeholder="请选择二级类目"
          @change="getThirdLevelList">
          <el-option
            v-for="item in secondCatalogList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select
          v-model="thirdLevelCatalog"
          filterable
          clearable
          size="small"
          placeholder="请选择三级类目"
          @change="getALLSelected">
          <el-option
            v-for="item in thirdCatalogList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
  </div>
</template>
<script>
import {queryLevelCatalog, ERR_OK} from 'api/index'

export default {
  props: {
    reset: {
      type: Boolean
    },
    span: {
      type: Number,
      default: 24,
      required: true
    }
  },
  data () {
    return {
      firstLevelCatalog: '',
      secondLevelCatalog: '',
      thirdLevelCatalog: '',
      firstCatalogList: [],
      secondCatalogList: [],
      thirdCatalogList: []
    }
  },
  watch: {
    reset (newVal, oldVal) {
      this.firstLevelCatalog = ''
      this.secondLevelCatalog = ''
      this.thirdLevelCatalog = ''
    }
  },
  computed: {
    selectedLevel () {
      return [this.firstLevelCatalog, this.secondLevelCatalog, this.thirdLevelCatalog]
    }
  },
  created () {
    this.fetchLevelCatalog()
  },
  methods: {
    // 获取类目
    fetchLevelCatalog () {
      queryLevelCatalog().then((res) => {
        if (res.responseCode === ERR_OK) {
          this.firstCatalogList = res.json
        } else {
          this.$message(res.responseMsg)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // getLowerLevelList (arr, id, level) {
    //   if (level === 'firstLevel') {
    //     this.secondLevelCatalog = ''
    //     this.thirdLevelCatalog = ''
    //   } else {
    //     this.thirdLevelCatalog = ''
    //   }
    //   console.log('5')
    //   this.$emit('selectedLevel', this.selectedLevel)
    //   for (var i = 0; i < arr.length; i++) {
    //     if (arr[i].id === id) {
    //       return arr[i].children
    //     }
    //   }
    // },
    getSecondLevelList () {
      this.secondLevelCatalog = ''
      this.thirdLevelCatalog = ''
      this.$emit('selectedLevel', this.selectedLevel)
      for (var i = 0; i < this.firstCatalogList.length; i++) {
        if (this.firstCatalogList[i].id === this.firstLevelCatalog) {
          this.secondCatalogList = this.firstCatalogList[i].children
          return
        }
      }
    },
    getThirdLevelList () {
      this.thirdLevelCatalog = ''
      this.$emit('selectedLevel', this.selectedLevel)
      for (var i = 0; i < this.secondCatalogList.length; i++) {
        if (this.secondCatalogList[i].id === this.secondLevelCatalog) {
          this.thirdCatalogList = this.secondCatalogList[i].children
          return
        }
      }
    },
    getALLSelected () {
      this.$emit('selectedLevel', this.selectedLevel)
    }
  }
}
</script>
<style>

</style>
