<template>
  <div class="treeWrapper">
    <el-tree
    :data="trees"
    :props="defaultProps"
    :highlight-current="true"
    node-key="nodeId"
    :default-expanded-keys="expanded"
    accordion
    @node-click="nodeClick"
    :render-content="renderContent">
    </el-tree>
    <div class="addnode">
        <el-button
        v-if="isShowAddTopNode"
        type="primary"
        plain
        @click="addOneTopNode"
        class="addRootId">添加顶级节点
        </el-button>
    </div>
  </div>
</template>

<script>
const rootIdMap = {
  index: 'home_index',
  catalog: 'recommend',
  tabs: 'template',
  tabsTemplate: 'tab_list',
  activity: 'activity',
  homeNav: 'home_bottom',
  newbornZone: 'new_activity2',
  fuelcard: 'fuelcard_activity'
}
const canAddTemplate = ['tabs', 'activity']
const mapNodeType = {
  '0': '(纯节点)',
  '2': '(纯图片)',
  '3': '(图链)',
  '4': '(文字)',
  '5': '(文链)',
  '6': '(图文)',
  '7': '(图文链)'
}

export default {
  props: {
    trees: {
      type: Array,
      default: () => []
    },
    expanded: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'childs',
        label: 'nodeChineseName'
      }
    }
  },
  watch: {
    '$route' (to, from) {
      this.isCanAddTemplate(to.name)
    }
  },
  created () {
    this.isCanAddTemplate(this.$route.name)
  },
  methods: {
    isCanAddTemplate (name) {
      let rootId
      for (var i in rootIdMap) {
        if (i === name) {
          rootId = rootIdMap[i]
        }
      }
      this.$emit('getRootId', rootId)
      if (canAddTemplate.indexOf(name) !== -1) {
        this.isShowEditName = true
        this.isShowAddTopNode = true
      } else {
        this.isShowEditName = false
        this.isShowAddTopNode = false
      }
    },
    // 节点点击事件
    nodeClick (data, node) {
      // 记录最后一次展开的节点的nodeId
      this.$emit('handleNodeClick', data, node)
    },
    // 组件需求，需要引入jsx
    renderContent (h, { node, data, store }) {
      if (node.level === 1) {
        return (
          <div class="tree-info">
            <div class="info">
              <span>{node.label}</span>
              <div class={node.expanded === true ? 'edit expanded' : 'edit'}>
                <span class={data.isUpdated === '1' ? 'noUpdated' : 'isUpdated'}>
                  {data.isUpdated === '1' ? '待发布' : '已发布'}
                </span>
                <i
                  class={
                    this.isShowEditName
                      ? 'icon el-icon-edit-outline'
                      : 'hideEditNameBtn'
                  }
                  title="修改名称"
                  on-click={e => this.editNodeName(node.label, data.nodeId, e)}
                />
                <i
                  class="icon el-icon-back"
                  title="撤销修改"
                  on-click={e => this.cancelEdit(store, data, e)}
                />
                <i
                  class="icon el-icon-upload"
                  title="发布"
                  on-click={e => this.publishThis(store, data, e)}
                />
              </div>
            </div>
            <span>{data.jsonId}</span>
          </div>
        )
      } else {
        return (
          <div class="tree-info">
            <span>{node.label}</span>
            <span>{mapNodeType[data.nodeType]}</span>
          </div>
        )
      }
    },
    // 修改节点弹窗
    editNodeName (val, id, e) {
      e.stopPropagation()
      this.$emit('editTopNode', val, id, e)
    },
    // 撤销修改
    cancelEdit (store, data, e) {
      e.stopPropagation()
      this.$emit('cancelAlter', store, data, e)
    },
    // 发布
    publishThis (store, data, e) {
      e.stopPropagation()
      this.$emit('publish', store, data, e)
    },
    // 添加节点弹窗
    addOneTopNode () {
      this.$emit('addTopNode')
    }
  }
}
</script>

<style lang="scss">
.hideEditNameBtn {
  display: none;
}
.treeWrapper {
  width: 100%;
  padding-top: 10px;
  color: #333;
  font-size: 14px;
  .addnode {
    position: fixed;
    bottom: 0;
    margin-left: 9%;
    .addRootId{
      background-color:#EE6363 !important;
      color:white !important;
    }
  }
}
.tree-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  &:hover {
    .edit {
      display: inline-block;
    }
  }
  .edit {
    &.expanded {
      display: inline-block;
    }
    .icon {
      margin-left: 5px;
      font-weight: 600;
      color: #409eff;
    }
    display: none;
    margin-left: 12px;
    .isUpdated {
      color: #409eff;
    }
    .noUpdated {
      color: #e6a23c;
    }
  }
}
</style>
