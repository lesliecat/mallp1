<template>
  <div class="main-wrapper" ref="mainWrapper">
    <div class="tree-out-wrapper">
      <nodeTree
        :trees = 'trees'
        :expanded = "expanded"
        @handleNodeClick = "handleNodeClick"
        @editTopNode = "editTopNode"
        @cancelAlter = "cancelAlter"
        @publish = "publish"
        @getRootId = 'getRootId'
        @addTopNode = "addTopNode">
      </nodeTree>
    </div>
    <div class="content-out-wrapper">
      <menus   :nodeChilds="nodeChilds"
               :subIssort="nodeSubIssort"
               :getRootId="rootId"
               @dragEnd="dragEnd"
               @addItem="addItem"
               @deleteItem="deleteItem"
               @editItem="editItem"
               @showNodeChildren="showNodeChildren">
       </menus>
      <transition name="slide-fade">
        <nodeContent v-if="showNodeEdit" :isEdit="true" :parentLimit="parentLimit" :parentId="parentNodeId" :nodeId="selectedId" @editSuccess="editSuccessFunc" @closeDetails="closeDetails" @sendState="getSendState"></nodeContent>
      </transition>
      <transition name="slide-fade">
        <nodeContent v-if="showNodeAdd" :parentLimit="parentLimit" :parentId="parentNodeId" :newQueues="queue" @editSuccess="editSuccessFunc" @closeDetails="closeDetails" @sendState="getSendState"></nodeContent>
      </transition>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import nodeContent from './common/nodeContent'
import menus from './common/menus'
import nodeTree from './common/nodeTree'
import { deleteContentConfig, updateContentQueues, querySingleContentConfig, getTabsTree, addTab, editTab, publishNode, republishNode } from 'api'
import { Loading } from 'element-ui'
const ERR_OK1 = '0'
const ERR_OK2 = '000'

export default {
  data () {
    return {
      trees: [],
      defaultProps: {
        children: 'childs',
        label: 'nodeChineseName'
      },
      expanded: [], // 存放展开节点
      nodeChilds: [], // 存放节点子类
      nodeSubIssort: '', // 存放当前点击节点的顺序类型
      dragList: [],
      parentNodeId: '',
      parentLimit: {}, // 父节点图片限制
      showNodeEdit: false,
      showNodeAdd: false,
      selectedId: '',
      intervalTimer: null, // 定时器解决单双击事件并存问题
      queue: 1,
      editIndex: '',
      isShowList: true,
      publishState: '',
      hasEdit: '1',
      state: '修改',
      stash: [],
      addTabParams: {
        nodeName: '',
        templateId: 'template'
      },
      editTabParams: {
        nodeChineseName: '',
        nodeId: ''
      },
      rootId: '',
      isLastNode: false

    }
  },
  components: {
    draggable,
    nodeContent,
    menus,
    nodeTree
  },
  mounted () {
    this.resetWrapper()
  },
  methods: {
    getRootId (rootId) {
      this.rootId = rootId
      this.createdPageDefault()
    },
    shiftNull (val) {
      if (val === null) {
        val = []
      }
    },
    createdPageDefault () {
      this.showNodeEdit = false
      this.showNodeAdd = false
      let loadingInstance2 = Loading.service({
        fullscreen: true,
        text: '页面加载中，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(3, 3, 3, .5)'
      })
      getTabsTree(this.rootId)
        .then((res) => {
          if (res.responseCode === ERR_OK2) {
            this.trees = res.templates[0].childs
            this.stash = res.templates[0].childs[0].childs
            this.pageDefault(this.trees)
            this.parentLimitDefault(res.templates[0])
            loadingInstance2.close()
          } else {
            loadingInstance2.close()
            this.$message(res.message)
          }
        })
        .catch((err) => {
          loadingInstance2.close()
          this.$message(err)
        })
    },
    getTrees () { // 获取树形结构数据
      getTabsTree(this.rootId)
        .then((res) => {
          if (res.responseCode === ERR_OK2) {
            this.trees = res.templates[0].childs
            this.nodeChilds.push(0)
            this.nodeChilds.pop(0)
          } else {
            this.$message(res.message)
          }
        })
        .catch((err) => {
          this.$message(err)
        })
    },
    resetWrapper () { // 页面布局
      var winH = window.innerHeight
      this.$refs.mainWrapper.style['min-height'] = (winH - 85) + 'px'
    },
    pageDefault (defaultData) { // 页面初始化显示
      this.parentNodeId = defaultData[0].nodeId
      this.nodeChilds = defaultData[0].childs
      this.nodeSubIssort = defaultData[0].subIssort
      this.expanded[0] = defaultData[0].nodeId
    },
    parentLimitDefault (data) {
      this.parentLimit = {
        subPicMax: data.subPicMax,
        subPicheight: data.subPicheight,
        subPicwidth: data.subPicwidth
      }
    },
    handleNodeClick (data, node) {
      // 点击节点非icon时，只做展开不收缩
      node.expanded = true
      this.expanded[0] = data.nodeId
      this.nodeSubIssort = data.subIssort
      this.parentNodeId = data.nodeId
      this.showNodeAdd = false
      if (data.childs === null) {
        this.nodeChilds = []
      } else {
        this.nodeChilds = data.childs
      }
      if ((data.childs === null) || !data.childs.length) {
        // 无子节点
        this.isLastNode = true
        this.showNodeEdit = true
        this.selectedId = data.nodeId
        this.getParentLimit(data.parentNodeId)
      } else {
        this.isLastNode = false
        this.stash = data.childs
        this.showNodeEdit = false
        this.parentLimit = {
          subPicMax: data.subPicMax,
          subPicheight: data.subPicheight,
          subPicwidth: data.subPicwidth
        }
      }
    },
    getParentLimit (parentId) { // 通过parentId拿父节点图片限制
      querySingleContentConfig(parentId)
        .then((res) => {
          if (res.responseCode === ERR_OK1) {
            this.parentLimit = {
              subPicMax: res.data.subPicMax,
              subPicheight: res.data.subPicheight,
              subPicwidth: res.data.subPicwidth
            }
          } else {
            this.$message(res.message)
          }
        })
        .catch((err) => {
          this.$message(err)
        })
    },
    dragEnd (value) { // 拖拽排序
      this.nodeChilds = value
      this.showNodeEdit = false
      this.showNodeAdd = false
      this.dragList = []
      if (this.isLastNode === false) {
        this.stash = []
        for (var i = 0; i < this.nodeChilds.length; i++) {
          this.dragList.push(this.nodeChilds[i].nodeId)
          this.stash.push(this.nodeChilds[i])
        }
      } else {
        for (i = 0; i < this.stash.length; i++) {
          this.dragList.push(this.stash[i].nodeId)
        }
      }
      // this.stash = this.dragList
      updateContentQueues(this.dragList.join(',')) // 直接传递数组会导致参数异常
        .then((res) => {
          if (res.responseCode === ERR_OK2) {
            this.getTrees() // 重新拉取数据
          } else {
            this.$message(res.message)
          }
        })
        .catch((err) => {
          this.$message(err)
        })
    },
    editItem (arr) { // 编辑节点信息
      clearTimeout(this.intervalTimer) // 取消上次延时未执行的方法
      this.intervalTimer = setTimeout(() => {
        this.selectedId = arr['0'].nodeId
        this.showNodeEdit = true
        this.showNodeAdd = false
        this.editIndex = arr['1']
      }, 250)
    },
    showNodeChildren (item) {
      clearTimeout(this.intervalTimer)
      this.showNodeEdit = false
      if (item.childs.length !== 0 || JSON.stringify(item.childs) !== '[]') {
        this.nodeChilds = item.childs
        this.nodeSubIssort = item.subIssort
        this.parentNodeId = item.nodeId
      } else {
        this.$message('当前节点无子节点！')
      }
    },
    addItem () {
      this.showNodeEdit = false
      this.showNodeAdd = true
      this.queue = this.nodeChilds.length + 1

      this.getParentLimit(this.parentNodeId)
    },
    deleteItem (arr) { // 删除节点
      let nodeId = arr['0'].nodeId
      let index = arr['1']
      this.$confirm('确认删除此选项吗？')
        .then(() => {
          this.showNodeEdit = false
          this.showNodeAdd = false
          deleteContentConfig(nodeId)
            .then((res) => {
              if (res.responseCode === ERR_OK2) {
                this.nodeChilds.splice(index, 1) // 通过index删除
                this.dragEnd(this.nodeChilds)
                this.getTrees()
              } else {
                this.$message(res.message)
              }
            })
            .catch((err) => {
              this.$message(err)
            })
        })
        .catch(() => {
        })
    },
    editSuccessFunc (params) {
      this.shiftNull(this.nodeChilds)
      if (params.name === 'add') {
        this.showNodeAdd = false
        this.nodeChilds.push(params.params)
        this.publishState = '可以发布'
        this.limitNumber = this.nodeChilds.length
        this.getTrees()
      } else {
        this.showNodeEdit = false
        if (this.nodeChilds.length !== 0) {
          this.nodeChilds[this.editIndex] = params.params
        }
        this.getTrees()
        this.publishState = '可以发布'
      }
    },
    closeDetails (val) {
      if (val === 'add') {
        this.showNodeAdd = false
      } else {
        if (this.isLastNode) {
          this.stash.splice(val - 1, 1) // 通过index删除
        }
        this.nodeChilds.splice(val - 1, 1)
        this.showNodeEdit = false
        this.dragEnd(this.nodeChilds)
        this.getTrees()
      }
    },
    /* 确认添加顶级节点 */
    confirmAddNode (val) {
      this.addTabParams.nodeName = val
      addTab(this.addTabParams).then((res) => {
        if (res.responseCode === ERR_OK2) {
          this.$message('tab选项添加成功！')
          this.getTrees()
        } else {
          this.$message('tab选项添加失败:' + res.message)
        }
      }).catch((err) => {
        this.$message('请求tab选项接口发生错误:' + err.message)
      })
    },
    /* 添加节点弹窗 */
    addTopNode () {
      this.$prompt('请输入tab选项名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5a-zA-Z\d_]{2,20}$/,
        inputErrorMessage: '节点名称只能包含汉字、数字、下划线和大小写字母，长度为2-20个字符！'
      }).then(({value}) => {
        this.confirmAddNode(value)
      }).catch(() => {
        this.$message({
          message: '取消输入'
        })
      })
    },
    mapNodeType (nodeType) { // 树结构展示节点类型
      switch (nodeType) {
        case '0':
          return '(纯节点)'
        case '2':
          return '(纯图片)'
        case '3':
          return '(图链)'
        case '4':
          return '(文字)'
        case '5':
          return '(文链)'
        case '6':
          return '(图文)'
        case '7':
          return '(图文链)'
        default:
          return ''
      }
    },
    publish (store, data) {
      if (data.isUpdated === '0') {
        this.$confirm('当前已是最新状态,无法再次发布!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(() => {})
      } else {
        if (this.publishState === '不可发布') {
          this.$confirm('请先保存当前编辑内容再发布?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(() => {})
        } else {
          this.$confirm('建议将内容编辑完整并检查后再发布, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.publishOne(data.nodeId)
            })
            .catch(() => {})
        }
      }
    },
    cancelAlter (store, data) {
      // 如果状态为最新,就判断为无法撤回发布状态,修改状态就执行发布操作
      if (data.isUpdated === '1') {
        this.$confirm('撤销当前配置修改, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.republishOne(data.nodeId)
            this.showNodeEdit = false
            this.getTrees()
          })
          .catch(() => {})
      } else if (data.isUpdated === '0') {
        this.$confirm('现在已经是最新状态,无法撤回修改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(() => {})
      }
    },
    /* 确认修改顶级节点 */
    confirmEditNode (val, id) {
      this.editTabParams.nodeId = id
      this.editTabParams.nodeChineseName = val
      editTab(this.editTabParams).then((res) => {
        if (res.responseCode === ERR_OK2) {
          this.$message('编辑tab选项名称成功！')
          this.getTrees()
        } else {
          this.$message('编辑tab选项名称失败:' + res.message)
        }
      }).catch((err) => {
        this.$message('编辑tab选项名称发生错误:' + err.message)
      })
    },
    /* 修改节点弹窗 */
    editTopNode (val, id) {
      this.$prompt('修改顶级节点名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: val,
        inputPattern: /^[\u4e00-\u9fa5a-zA-Z\d_]{2,20}$/,
        inputErrorMessage: '节点名称只能包含汉字、数字、下划线和大小写字母，长度为2-20个字符！'
      }).then(({value}) => {
        this.confirmEditNode(value, id)
      }).catch(() => {})
    },
    // 子组件传来的是否发布状态
    getSendState (id) {
      this.publishState = id
    },
    publishOne (nodeId) {
      let loadingInstance = Loading.service({
        fullscreen: true,
        text: '正在发布中，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(3, 3, 3, .5)'
      })
      let rootObject = {
        rootId: nodeId
      }
      publishNode(rootObject)
        .then((res) => {
          if (res.responseCode === ERR_OK2) {
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close()
              this.getTrees()
              this.showNodeEdit = false
              this.showNodeAdd = false
            })
          } else {
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close()
            })
            this.$message({
              type: 'info',
              message: '发布失败!'
            })
          }
        })
    },
    republishOne (nodeId) {
      let rootObject = {
        rootId: nodeId
      }
      republishNode(rootObject)
        .then((res) => {
          if (res.responseCode === ERR_OK2) {
            setTimeout(() => {
              this.getTrees()
            }, 1000)
          }
        }).catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  @import '../../styles/indexLayout.scss'
</style>
