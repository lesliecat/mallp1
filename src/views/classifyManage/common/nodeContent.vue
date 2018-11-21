<template>
<div class="node" >
  <el-form
    class="node__form"
    ref="nodeForm"
    :model="node"
    size="small"
    label-width="140px"
    :status-icon="true"
    :rules="rules"
    :validate-on-rule-change="false">
    <el-row :gutter="10">
      <el-col :md="12" v-show="isEdit">
        <el-form-item label="节点ID">
          <span>{{node.nodeId}}</span>
        </el-form-item>
      </el-col>
      <el-col :md="isEdit ? 12 : 24">
        <el-form-item label="中文名称" prop="nodeChineseName">
          <el-input v-model="node.nodeChineseName"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-form-item label="节点描述">
        <el-input type="textarea" v-model="node.nodeDesc"></el-input>
      </el-form-item>
    </el-row>

    <el-row :gutter="10">
      <el-col :md="12">
        <el-form-item label="显示顺序">
          <span>{{node.queues}}</span>
        </el-form-item>
      </el-col>
      <el-col :md="12">
        <el-form-item label="是否公开">
          <el-switch v-model="node.isVisible"></el-switch>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :md="12">
        <el-form-item label="节点类型">
          <el-select v-model="node.nodeType" @change="handleTypeChange">
            <el-option
              v-for="type in nodeTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="12">
        <el-form-item label="链接类型">
          <el-select v-model="node.hrefType" @change="handleHrefTypeChange">
            <el-option
              v-for="type in hrefTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-show="control.hrefValueAble">
      <el-form-item label="链接值" prop="hrefValue">
        <el-input
          v-model="node.hrefValue"
          placeholder="请输入内容"
          :disabled="!control.hrefValueAble"
          @focus="handleHrefValueFocus"
        ></el-input>
      </el-form-item>
    </el-row>

    <el-row :gutter="10">
      <el-form-item label="图片" prop="pictureLocalPath" :show-message="showPicMessage">
        <div class="pic-wrapper">
          <img class="pic-img" :src="node.pictureLocalPath" alt="">
          <input class="pic-input" id="pic-input" ref="picInput" type="file" @change="handleChangePic">
          <label class="pic-label" for="pic-input">
            <i class="el-icon-plus"></i>
          </label>
        </div>
      </el-form-item>
      <el-form-item>
        <p class="pic-desc" v-if="hasPicLimit">
          要求: 宽{{picLimit.subPicwidth}}, 高{{picLimit.subPicheight}}, 大小{{picLimit.subPicMax}}
        </p>
        <p class="pic-desc" v-show="showPicDesc">
          已上传图片
          <span v-show="picInfo.width">宽: {{picInfo.width}}PX,</span>
          <span v-show="picInfo.height">高: {{picInfo.height}}PX,</span>
          大小: {{picInfo.size}}KB
        </p>
      </el-form-item>
    </el-row>

    <el-row :gutter="10">
      <el-col :lg="12">
        <el-form-item label="显示文字" prop="lable">
          <el-input v-model="node.lable"></el-input>
        </el-form-item>
      </el-col>
      <el-col :lg="12" v-show="control.hrefAble">
        <el-form-item label="节点URL" prop="href">
          <el-input v-model="node.href" :disabled="!control.hrefAble"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="10" v-if="isEdit">
      <el-col :md="12">
        <el-form-item label="子节点是否排序类型">
          <el-switch v-model="node.subIssort" disabled></el-switch>
        </el-form-item>
      </el-col>
      <el-col :md="12">
        <el-form-item label="子节点是否有图片">
          <el-switch v-model="node.subHasPic" disabled></el-switch>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="10" v-if="isEdit">
      <el-col :md="12" :lg="8">
        <el-form-item label="子节点图片宽" prop="subPicwidth">
          <el-input v-model="node.subPicwidth" :disabled="!node.subHasPic"></el-input>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="8">
        <el-form-item label="子节点图片高" prop="subPicheight">
          <el-input v-model="node.subPicheight" :disabled="!node.subHasPic"></el-input>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="8">
        <el-form-item label="子节点图片大小(kb)" prop="subPicMax">
          <el-input v-model="node.subPicMax" :disabled="!node.subHasPic"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="10" v-if="isEdit">
      <el-col :md="12">
        <el-form-item label="创建人">
          <span>{{fullNode.createdBy}}</span>
        </el-form-item>
      </el-col>
      <el-col :md="12">
        <el-form-item label="创建时间">
          <span>{{fullNode.createdDate}}</span>
        </el-form-item>
      </el-col>
      <el-col :md="12">
        <el-form-item label="修改人">
          <span>{{fullNode.updatedBy}}</span>
        </el-form-item>
      </el-col>
      <el-col :md="12">
        <el-form-item label="修改时间">
          <span>{{fullNode.updatedDate}}</span>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-form-item>
        <el-button type="primary" @click="showDialog('save')">保存</el-button>
        <el-button v-if="isEdit" type="warning" @click="showDialog('reset')">重置</el-button>
        <el-button v-if="isEdit && !node.isDeletable" type="danger" @click="showDialog('delete')">删除</el-button>
        <el-button v-if="!isEdit" type="primary" @click="cancelAddNode">取消</el-button>
      </el-form-item>
    </el-row>
  </el-form>

  <el-dialog title="提示" :visible.sync="promptDialog.visible" width="30%">
    <span>{{promptDialog.title}}</span>
    <div slot="footer">
      <el-button @click="promptDialog.visible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="promptDialogConfirm" size="small">确 定</el-button>
    </div>
  </el-dialog>

  <!-- 这块也许可以优化 -->
  <el-dialog :title="hrefValueDialog.title" :visible.sync="hrefValueDialog.visible">
    <!-- 当链接类型为商品时 -->
    <el-select
      v-show="hrefType === '1'"
      v-model="productValue"
      clearable filterable remote
      placeholder="请输入关键词"
      :remote-method="getProductOrBrand"
      value-key="id">
      <el-option
        v-for="item in productList"
        :key="item.id"
        :label="item.name"
        :value="item">
      </el-option>
    </el-select>
    <!-- 当链接类型为品牌时 -->
    <el-select
      v-show="hrefType === '3'"
      v-model="brandValue"
      clearable filterable remote
      placeholder="请输入关键词"
      :remote-method="getProductOrBrand"
      value-key="id">
      <el-option
        v-for="item in brandList"
        :key="item.id"
        :label="item.name"
        :value="item">
      </el-option>
    </el-select>
    <!-- 当链接类型为类目时 -->
    <el-cascader
      v-show="hrefType === '2'"
      placeholder="请输入关键词"
      :options="catalogList"
      :props="catalogProps"
      :show-all-levels="false"
      v-model="catalogValue"
      filterable
      clearable
    ></el-cascader>
    <!-- 当链接类型为模版时 -->
    <el-cascader
      v-show="hrefType === '5'"
      placeholder="请输入关键词"
      :options="templateList"
      :props="templateProps"
      :show-all-levels="false"
      v-model="templateValue"
      filterable
      clearable
    ></el-cascader>
    <div slot="footer">
      <el-button @click="hrefValueDialog.visible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="hrefValueDialogConfirm" size="small">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  querySingleContentConfig,
  alterContentConfig,
  submitContentConfig,
  deleteContentConfig,
  uploadImg,
  getProductList,
  getBrandList,
  queryLevelCatalog,
  getAllTemplate,
  queryBrandImg,
  queryProductImg,
  queryCatalogImg,
  ERR_OK
} from 'api/index'

import { debounce } from 'utils/index'
import { validateURL } from 'utils/validate'

// 显示文本必传时nodeType值
const labelRequiredArr = ['4', '5', '6', '7']
// 图片必传时nodeType值
const picRequiredArr = ['2', '3', '6', '7']
// 节点URL必传时nodeType值
const hrefRequiredArr = ['3', '5', '7']
// 链接值输入框可输入时hrefType值
const hrefValueAbleArr = ['1', '2', '3', '5']
// 需要查询图片hrefType值
const needQueryImgArr = ['1', '2', '3']
// node 中需要将 boolean 类型转换成 '1' 或 '0' 的数组 (true -> '1', false -> '0')
// isDeletable 0可以删除， 1不可删除 (变量名语义不对啊, 对应着是否不可删除)
const nodeParseArr = ['isDeletable', 'isVisible', 'subHasPic', 'subIssort']

const MAX_IMAGE_SIZE = 100

export default {
  props: {
    // 是否编辑模式
    isEdit: {
      type: Boolean,
      default: false
    },
    // 编辑模式时需传递
    nodeId: {
      type: String
    },
    parentId: {
      type: String
    },
    parentLimit: {
      type: Object
    },
    newQueues: {
      type: Number
    }
  },
  data () {
    return {
      productValue: {},
      productList: [],
      brandValue: {},
      brandList: [],
      catalogList: [],
      catalogProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      catalogValue: [],
      templateList: [],
      templateProps: {
        value: 'nodeId',
        label: 'nodeChineseName',
        children: 'childrens'
      },
      templateValue: [],
      // 保存初始节点
      originalNode: {},
      // 保存请求数据后的节点信息 结构与node一致
      dataNode: {},
      // 后台返回节点
      fullNode: {},
      // 需要发送的节点
      node: {
        href: '',
        hrefName: '',
        hrefType: '4',
        hrefValue: '',
        isDeletable: false,
        isVisible: true,
        lable: '',
        nodeChineseName: '',
        nodeDesc: '',
        nodeId: '',
        nodeType: '0',
        parentNodeId: '',
        pictureAbsolutePath: '',
        pictureLocalPath: '',
        picturePath: '',
        queues: '',
        subHasPic: false,
        subIssort: false,
        subPicMax: '',
        subPicheight: '',
        subPicwidth: '',
        title: '',
        updatedDate: ''
      },
      // 节点类型
      nodeTypes: [
        { value: '0', label: '纯节点' },
        { value: '2', label: '纯图片' },
        { value: '3', label: '图链' },
        { value: '4', label: '文字' },
        { value: '5', label: '文链' },
        { value: '6', label: '图文' },
        { value: '7', label: '图文链' }
      ],
      // 链接类型
      hrefTypes: [
        { value: '1', label: '商品' },
        { value: '2', label: '类目' },
        { value: '3', label: '品牌' },
        { value: '4', label: '普通' },
        { value: '5', label: '模版' }
      ],
      baseRule: {
        picRequired: false,
        labelRequired: false,
        hrefRequired: false,
        hrefValueRequired: false
      },
      control: {
        hrefValueAble: false,
        hrefAble: false
      },
      isValid: false,
      promptDialog: {
        title: '确定删除吗？',
        visible: false,
        // 'save' 提交, 'reset'重置, 'delete'删除
        type: 'save'
      },
      hrefValueDialog: {
        title: '',
        visible: false
      },
      picInfo: {
        width: '',
        height: '',
        size: ''
      }
    }
  },
  computed: {
    hrefType () {
      return this.node.hrefType
    },
    picSrc () {
      return this.node.pictureLocalPath
    },
    showPicDesc () {
      return this.node.pictureLocalPath && this.picInfo.size
    },
    showPicMessage () {
      return this.baseRule.picRequired && !this.node.pictureLocalPath.length
    },
    // 是否有父节点图片限制
    hasPicLimit () {
      const arr = Object.keys(this.parentLimit)
      if (arr.length) {
        for (const i of arr) {
          if (this.parentLimit[i]) {
            return true
          }
        }
      }
      return false
    },
    picLimit () {
      if (this.hasPicLimit) {
        const ret = {}
        const arr = Object.keys(this.parentLimit)
        for (const i of arr) {
          if (i === 'subPicMax') {
            ret[i] = this.parentLimit[i] ? this.parentLimit[i] + 'KB' : '无'
          } else {
            ret[i] = this.parentLimit[i] ? (this.parentLimit[i] + 'PX') : '无'
          }
        }
        return ret
      }
    },
    rules () {
      const validateUrl = (rule, value, callback) => {
        if (this.control.hrefAble && (value + '').length !== 0 && !validateURL(value)) {
          callback(new Error('链接地址不合法'))
        } else {
          callback()
        }
      }
      const validateSubPicMax = (rule, value, callback) => {
        if (value === '' || (/^(0|[1-9]\d?|100)$/.test(+value) && value.length <= 3)) {
          callback()
        } else {
          callback(new Error('请输入0-100的整数'))
        }
      }
      return {
        nodeChineseName: [
          { required: true, message: '请输入中文名称', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在12字以内', trigger: 'blur' }
        ],
        pictureLocalPath: [
          {
            required: this.baseRule.picRequired,
            message: '请上传图片',
            trigger: 'blur'
          }
        ],
        lable: [
          {
            required: this.baseRule.labelRequired,
            message: '请输入显示文字',
            trigger: 'change'
          },
          { min: 1, max: 100, message: '长度在100字以内', trigger: 'blur' }
        ],
        href: [
          {
            required: this.baseRule.hrefRequired,
            message: '请输入URL'
          },
          { validator: validateUrl }
        ],
        hrefValue: [
          {
            required: this.baseRule.hrefValueRequired,
            message: '请输入值',
            trigger: 'change'
          }
        ],
        subPicwidth: [
          { required: false, max: 5, message: '最多5位', trigger: 'change' }
        ],
        subPicheight: [
          { required: false, max: 5, message: '最多5位', trigger: 'change' }
        ],
        subPicMax: [
          { required: false, validator: validateSubPicMax, trigger: 'change' }
        ]
      }
    },
    // 根据链接类型值返回对应的方法 查询商品或者品牌
    getProductOrBrandFunc () {
      return this.hrefType === '1' ? getProductList : getBrandList
    }
  },
  methods: {
    handleChangePic (event) {
      const img = this.$refs.picInput.files[0]
      if (!img) {
        return
      }
      if (!(img.type && img.type.indexOf('image') === 0)) {
        this.$message('请上传图片格式')
        return
      }
      const reader = new FileReader()
      reader.readAsDataURL(img)
      reader.onload = e => {
        const image = new Image()
        image.src = e.target.result
        image.onload = () => {
          // 图片大小 单位 KB
          const imgSize = img.size / 1024
          if (imgSize > MAX_IMAGE_SIZE) {
            this.$message(`上传图片不能超过${MAX_IMAGE_SIZE}KB`)
            return
          }
          if (this.hasPicLimit) {
            // 有父节点图片限制
            // 字符串格式转为数字
            const subPicwidth = +this.parentLimit.subPicwidth
            const subPicheight = +this.parentLimit.subPicheight
            // 图片大小为空则默认最大值
            const subPicMax = this.parentLimit.subPicMax ? +this.parentLimit.subPicMax : MAX_IMAGE_SIZE
            if (
              image.width === subPicwidth &&
              image.height === subPicheight &&
              imgSize <= subPicMax
            ) {
              // 先展示，点击保存按钮时才上传
              this.node.pictureAbsolutePath = image.src
              this.node.pictureLocalPath = image.src
              this.picInfo.size = imgSize.toFixed(2)
            } else {
              this.$message(
                `请上传宽${subPicwidth}px, 高${subPicheight}px, 不大于${subPicMax}kb的图片！`
              )
              this.$refs.picInput.value = ''
            }
          } else {
            // 没有父节点图片限制
            this.node.pictureAbsolutePath = image.src
            this.node.pictureLocalPath = image.src
            this.picInfo.size = imgSize.toFixed(2)
          }
        }
      }
    },
    upImg (img) {
      const formData = new FormData()
      formData.append('fileImage', img)
      return new Promise((resolve, reject) => {
        uploadImg(formData).then(res => {
          if (res.responseCode === ERR_OK) {
            this.node.pictureAbsolutePath = res.pictureAbsolutePath
            this.node.pictureLocalPath = res.pictureLocalPath
            this.node.picturePath = res.picturePath
            resolve()
          } else {
            this.$message({
              type: 'error',
              message: res.message,
              showClose: true
            })
          }
        }).catch(err => {
          this.$message(err)
        })
      })
    },
    queryImg () {
      if (needQueryImgArr.indexOf(this.hrefType) === -1) {
        return
      }
      const queryOfType = {
        '1': queryProductImg,
        '2': queryCatalogImg,
        '3': queryBrandImg
      }
      const _queryImg = queryOfType[this.hrefType]
      _queryImg(this.node.hrefValue).then(res => {
        if (res.responseCode === ERR_OK) {
          if (res.img) {
            this.node.pictureAbsolutePath = res.img.pictureAbsolutePath
            this.node.pictureLocalPath = res.img.pictureLocalPath
            this.node.picturePath = res.img.picturePath
            this.picInfo.size = res.img.pictureWeight
          } else {
            this.$message('图片不存在')
            this.node.pictureAbsolutePath = ''
            this.node.pictureLocalPath = ''
            this.node.picturePath = ''
            this.picInfo.size = ''
          }
        }
      }).catch(err => {
        this.$message(err)
      })
    },
    // 查询节点
    queryNode () {
      querySingleContentConfig(this.nodeId).then(res => {
        // 此处成功状态码竟然不是 '000'
        if (res.responseCode === '0') {
          // 节点hrefType为空时默认设置为4(普通)
          if (res.data.hrefType === '') {
            res.data.hrefType = '4'
          }
          this.fullNode = res.data
          for (const item in this.node) {
            this.node[item] = res.data[item]
          }
          for (const item of nodeParseArr) {
            // '1' -> true  '0' -> false
            this.node[item] = this.node[item] === '1'
          }
          // 把node复制一份，重置需要
          this.dataNode = { ...this.node }
          this.picInfo.size = res.data.size
          this.handleRequiredAndAble()
        }
      })
    },
    refresh () {
      this.productValue = {}
      this.brandValue = {}
      this.catalogValue = []
      this.templateValue = []
      if (this.nodeId) {
        this.queryNode()
      }
    },
    handleRequiredAndAble () {
      const hrefType = this.hrefType
      this.control.hrefAble = hrefType === '4'
      this.control.hrefValueAble = hrefValueAbleArr.indexOf(hrefType) !== -1
      this.baseRule.hrefValueRequired = hrefType !== '4'
      const requiredObj = {
        labelRequired: labelRequiredArr,
        picRequired: picRequiredArr,
        hrefRequired: hrefRequiredArr
      }
      for (const i in requiredObj) {
        this.baseRule[i] = requiredObj[i].indexOf(this.node.nodeType) !== -1
      }
      if (hrefType !== '4') {
        // this.baseRule.labelRequired = false
        // this.baseRule.picRequired = false
        this.baseRule.hrefRequired = false
        // return
      }
    },
    clearPartNodeInfo () {
      this.node.hrefValue = ''
      this.node.lable = ''
      this.node.href = ''
      this.node.pictureAbsolutePath = ''
      this.node.pictureLocalPath = ''
      this.node.picturePath = ''
    },
    handleTypeChange () {
      this.clearPartNodeInfo()
      this.handleRequiredAndAble()
    },
    handleHrefTypeChange () {
      this.handleTypeChange()
      this.$refs.picInput.value = ''
    },
    handleHrefValueFocus () {
      const titleOfType = {
        '1': '请选择商品',
        '2': '请选择类目',
        '3': '请选择品牌',
        '5': '请选择模版'
      }
      this.hrefValueDialog.title = titleOfType[this.hrefType]
      this.hrefValueDialog.visible = true
    },
    hrefValueDialogConfirm () {
      const hrefType = this.hrefType
      let hrefValue
      let lable
      if (hrefType === '1') {
        hrefValue = this.productValue.id
        lable = this.productValue.name
      } else if (hrefType === '3') {
        hrefValue = this.brandValue.id
        lable = this.brandValue.name
        this.node.hrefName = lable
      } else if (hrefType === '2') {
        const ret = this.catalogValue
        const len = ret.length
        hrefValue = len ? ret[len - 1].id : ''
        lable = len ? ret[len - 1].name : ''
      } else if (hrefType === '5') {
        const ret = this.templateValue
        const len = ret.length
        hrefValue = len ? ret[len - 1].nodeId : ''
        lable = len ? ret[len - 1].nodeChineseName : ''
      }
      this.hrefValueDialog.visible = false
      this.node.hrefValue = hrefValue
      this.node.lable = lable
      this.queryImg()
    },
    // 提交节点
    saveNode () {
      const node = { ...this.node }
      for (const item of nodeParseArr) {
        node[item] = node[item] ? '1' : '0'
      }
      node.title = node.lable
      const sendParams = {
        name: this.isEdit ? 'edit' : 'add',
        params: node
      }
      if (this.isEdit) {
        // 编辑节点
        alterContentConfig(node).then(res => {
          if (res.responseCode === ERR_OK) {
            this.$emit('editSuccess', sendParams)
            this.$message({
              type: 'success',
              message: '修改成功',
              showClose: true
            })
          }
        })
      } else {
        // 添加节点
        submitContentConfig(node).then(res => {
          if (res.responseCode === ERR_OK) {
            sendParams.params.nodeId = res.id
            sendParams.size = this.picInfo.size
            this.$emit('editSuccess', sendParams)
            this.$message({
              type: 'success',
              message: '保存成功',
              showClose: true
            })
          }
        })
      }
    },
    // 保存表单
    saveForm () {
      const img = this.$refs.picInput.files[0]
      if (img) {
        this.upImg(img).then(() => { this.saveNode() })
      } else {
        this.saveNode()
      }
    },
    // 重置表单
    resetForm () {
      this.node = { ...this.dataNode }
      this.handleRequiredAndAble()
    },
    // 删除节点
    deleteNode () {
      deleteContentConfig(this.node.nodeId).then(res => {
        if (res.responseCode === ERR_OK) {
          this.$emit('closeDetails', this.node.queues)
          this.$message({
            type: 'success',
            message: res.responseMsg,
            showClose: true
          })
        }
      })
    },
    // 取消添加节点
    cancelAddNode () {
      this.$emit('closeDetails', 'add')
    },
    // 查询商品、品牌方法
    getProductOrBrand (key) {
      // 防抖
      debounce(() => {
        this.getProductOrBrandFunc(key).then(res => {
          if (res.responseCode === ERR_OK) {
            if (this.hrefType === '1') {
              this.productList = res.json
            } else {
              this.brandList = res.json
            }
          }
        })
      }, 300)()
    },
    // 获得类目列表
    getCatalogList () {
      queryLevelCatalog().then(res => {
        if (res.responseCode === ERR_OK) {
          this.catalogList = this.normalizeCascaderData(
            res.json,
            'children',
            'id',
            'name'
          )
        } else {
          this.$message({
            type: 'warning',
            message: res.responseMsg,
            showClose: true
          })
        }
      }).catch(err => {
        this.$message(err)
      })
    },
    // 获得模版列表
    getTemplateList () {
      getAllTemplate().then(res => {
        if (res.responseCode === ERR_OK) {
          this.templateList = this.normalizeCascaderData(
            res.templates,
            'childrens',
            'nodeId',
            'nodeChineseName'
          )
        } else {
          this.$message({
            type: 'warning',
            message: res.message,
            showClose: true
          })
        }
      }).catch(err => {
        this.$message(err)
      })
    },
    normalizeCascaderData (arr, childrenName, valueName, labelName) {
      for (let i = 0; i < arr.length; i++) {
        const value = arr[i][valueName]
        arr[i][valueName] = {}
        arr[i][valueName][valueName] = value
        arr[i][valueName][labelName] = arr[i][labelName]
        if (arr[i][childrenName]) {
          this.normalizeCascaderData(arr[i][childrenName], childrenName, valueName, labelName)
        }
      }
      // 去除空数组开始
      for (const i in arr) {
        let firstVal = arr[i]
        if (JSON.stringify(firstVal.children) === '[]' || firstVal.children === undefined) {
          delete arr[i].children
        } else {
          for (const j in firstVal.children) {
            let secondVal = firstVal.children[j]
            if (JSON.stringify(secondVal.children) === '[]' || secondVal.children === undefined) {
              delete firstVal.children[j].children
            }
          }
        }
      }
      // 去除空数组结束
      return arr
    },
    showDialog (type) {
      const titleOfType = {
        save: '确定保存吗？',
        reset: '确定重置吗？',
        delete: '确定删除吗？'
      }
      if (type === 'save') {
        this.$refs.nodeForm.validate(valid => {
          this.isValid = valid
        })
      }
      if (type === 'save' && !this.isValid) {
        this.$message({
          type: 'warning',
          message: '请按提示将表单填写完整！',
          showClose: true
        })
        return
      }
      this.promptDialog.title = titleOfType[type]
      this.promptDialog.type = type
      this.promptDialog.visible = true
    },
    promptDialogConfirm () {
      this.promptDialog.visible = false
      const type = this.promptDialog.type
      if (type === 'save') {
        this.saveForm()
      } else if (type === 'reset') {
        this.resetForm()
      } else if (type === 'delete') {
        this.deleteNode()
      }
    }
  },
  created () {
    this.originalNode = { ...this.node }
    if (!this.isEdit) {
      this.node.parentNodeId = this.parentId
      this.node.queues = this.newQueues
    }
    this.refresh()
  },
  watch: {
    node: {
      deep: true,
      handler (newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.dataNode)) {
          this.$emit('sendState', '不可发布')
        } else {
          this.$emit('sendState', '可以发布')
        }
      }
    },
    nodeId () {
      this.refresh()
    },
    hrefType (newVal, oldVal) {
      // 根据链接类型值获取类目和模版数据
      if (newVal === '2' && !this.catalogList.length) {
        this.getCatalogList()
      }
      if (newVal === '5' && !this.templateList.length) {
        this.getTemplateList()
      }
    },
    picSrc (newVal) {
      if (newVal.length) {
        const img = new Image()
        img.src = newVal
        img.onload = () => {
          this.picInfo.width = img.width
          this.picInfo.height = img.height
        }
        img.onerror = () => {
          this.$message('图片无法加载')
          this.picInfo.width = ''
          this.picInfo.height = ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.node {
  padding: 10px;
}
.el-select,
.el-cascader {
  width: 100%;
}
.pic-wrapper {
  position: relative;
  width: 300px;
  margin-left: 5px;
  max-width: 100%;
  height: 178px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  .pic-img {
    width: 100%;
    height: 100%;
  }
  .pic-input {
    display: none;
  }
  .pic-label {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    font-size: 30px;
    line-height: 178px;
    text-align: center;
    color: #eee;
    cursor: pointer;
    .el-icon-plus {
      display: none;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.5);
      .el-icon-plus {
        display: inline;
        color: #fff;
      }
    }
  }
  &.disabled {
    cursor: not-allowed;
    .pic-label {
      background: #e4e7ed;
      pointer-events: none;
      .el-icon-plus {
        display: none;
      }
    }
  }
}
.pic-desc {
  color: #666;
  font-size: 14px;
  line-height: 20px;
  margin: 10px 0 0;
}
</style>

<style lang="scss">
.node {
  label {
    font-weight: normal;
  }
}
</style>
