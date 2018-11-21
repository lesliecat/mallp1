<template>
  <div :class="['list-wrapper', { 'has-bottom-border' : hasBottomBorder }]">
    <draggable class="drag-gable" v-model="filterNodeChilds" :options="{ghostClass: 'ghost'}">
      <div class="list-item" v-for="(item, index) in filterNodeChilds !== null ?filterNodeChilds.slice(0,limitNumber): []"  @click="editNode(item, index)" @dblclick="showNodeChilds(item)" :key="index">
        <div class="icon-wrapper" title="左右拖拽排序，双击展示子节点">
          <img :src="item.pictureLocalPath" :onError="defaultImg">
          <div class="delete" v-if="item.isDeletable==='0'" @click.stop="deleteNode(item, index)">
            <i class="el-icon-delete"></i>
          </div>
        </div>
        <p class="txt">{{item.nodeChineseName}}</p>
      </div>
    </draggable>
    <div class="list-item add-list-item" v-if="subIssort==='1'"  @click="addNode">
      <div class="icon-wrapper">
        <i class="el-icon-plus"></i>
      </div>
      <p class="txt">添加</p>
    </div>
    <div class="clear"></div>
    <div class="moreContent" v-show="(nodeChilds !== null) ? (nodeChilds.length > 7) : false">
        <span @click="loadMore()" :class="{'more':moreState}">more</span>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  props: {
    nodeChilds: {
      type: Array,
      default: () => []
    },
    subIssort: {
      type: String,
      default: ''
    },
    getRootId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      moreState: false,
      limitNumber: '',
      defaultImg: 'this.src="' + require('../images/defaultGoodsImg.png') + '"'
    }
  },
  components: {
    draggable
  },
  computed: {
    filterNodeChilds: {
      get: function () {
        return this.nodeChilds
      },
      set: function (value) {
        if (this.getRootId !== 'home_bottom') {
          this.$emit('dragEnd', value)
        }
      }
    },
    hasBottomBorder () {
      return this.nodeChilds.length > 0 || this.subIssort === '1'
    }
  },
  methods: {
    shiftArr (val) {
      if (val.childs === null) {
        val.childs = []
      }
    },
    /* 添加节点 */
    addNode () {
      this.$emit('addItem')
    },
    /* 删除节点 */
    deleteNode (item, index) {
      this.$emit('deleteItem', [item, index])
    },
    /* 编辑节点 */
    editNode (item, index) {
      this.$emit('editItem', [item, index])
    },
    /* 双击展示子节点 */
    showNodeChilds (item) {
      this.shiftArr(item)
      this.$emit('showNodeChildren', item)
    },
    /* 点击more文字显示全部节点子项 */
    loadMore () {
      if (!this.moreState) {
        this.limitNumber = 7
      } else {
        this.limitNumber = this.nodeChilds.length || 0
      }
      this.moreState = !this.moreState
    }
  },
  watch: {
    nodeChilds () {
      if (this.nodeChilds !== null) {
        this.limitNumber = this.nodeChilds.length || 0
      } else {
        this.limitNumber = 0
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.list-wrapper {
  padding-top: 10px;
  padding-left: 10px;
  border-bottom: none;
  &.has-bottom-border {
    border-bottom: 2px solid #eee;
  }
  .drag-gable {
    display: inline;
  }
  .list-item {
    display: inline-block;
    text-align: center;
    vertical-align: top;
    margin-right: 1.5%;
    width: 10%;
    .icon-wrapper {
      position: relative;
      min-height: 102px;
      line-height: 102px;
      width: 100%;
      box-sizing: content-box;
      border-radius: 4px;
      border: 1px solid #eee;
      img {
        width: 100%;
        display: inline-block;
        vertical-align: middle;
      }
      .delete {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: none;
        cursor: pointer;
        .el-icon-delete {
          display: none;
        }
        &:hover .el-icon-delete {
          display: inline;
        }
      }
    }
    .txt {
      font-size: 14px;
      width: 100%;
      overflow: hidden;
      height: 32px;
    }
  }
  .ghost {
    .el-icon-delete {
      display: none !important;
    }
  }
  .add-list-item {
    .el-icon-plus {
      font-size: 30px;
      color: #eee;
    }
  }
  .moreContent {
    text-align: center;
    span {
      cursor: pointer;
      width: 70px;
      font-size: 16px;
      color: #00c081;
      display: inline-block;
      margin-bottom: 10px;
      background: url('./../images/less.png')no-repeat right 2px;
      background-size: 16px 16px;
      &.more {
        background: url('./../images/more.png')no-repeat right 2px;
      }
    }
  }
}
</style>
