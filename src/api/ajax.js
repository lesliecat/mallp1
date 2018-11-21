import axios from 'axios'
import store from '../store'
import element from 'element-ui'

const URL = process.env.BASE_API
const URI_PRE = '/credit/paces-emall-admin/emp/admin'
const loginTimeoutErr = '100401'
let BASE_URL = URL + URI_PRE

// 总的请求数据的函数
function fetchData (option) {
  return new Promise((resolve, reject) => {
    axios(option).then(res => {
      if (res.data) {
        res = res.data
        if ((res.responseCode === loginTimeoutErr) || (res.code === loginTimeoutErr)) {
          element.Message(res.message)
          store.dispatch('LogOut')
        }
        resolve(res) // 返回服务器传回的全部数据，包括status和message
      } else {
        reject(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

// 获取目录Tree
export function fetchCatalogTree () {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/queryTreeConfigNew.do',
    params: {}
  }
  return fetchData(option)
}

// 获取品牌
export function fetchBrandList (query) {
  let option = {
    method: 'get',
    url: BASE_URL + '/brand/chooseBrand.do',
    params: {
      brandNameOrId: query
    }
  }
  return fetchData(option)
}

// 获取商品
export function fetchProductList (query) {
  let option = {
    method: 'get',
    url: BASE_URL + '/brand/ChooseProduct.do',
    params: {
      productNameOrId: query
    }
  }
  return fetchData(option)
}

// 获取模版
export function fetchAllTemplate () {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/queryAllTemplate.do',
    params: {}
  }
  return fetchData(option)
}

// 删除通用配置
export function fetchDeleteConfig (id) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/deleteConfig.do',
    params: {
      id: id
    }
  }
  return fetchData(option)
}

// 调整节点顺序
export function fetchNodeOrder (nodeId) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/updateQueues.do',
    params: {
      nodeId: nodeId
    }
  }
  return fetchData(option)
}

// 上传图片
export function fetchUploadImg (formData) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/uploadImg.do',
    headers: {'Content-Type': 'multipart/form-data'},
    data: formData
  }
  return fetchData(option)
}

// 获取价格区间数据
export function fetchConfigPriceList (para) {
  let option = {
    method: 'post',
    url: BASE_URL + '/price/getConfigPriceList.do',
    params: para
  }
  return fetchData(option)
}

// 更新价格区间
export function updateConfigPrice (para) {
  let option = {
    method: 'post',
    url: BASE_URL + '/price/updateConfigPriceById.do',
    params: para
  }
  return fetchData(option)
}

// 获取一级二级三级目录
export function fetchLevelCatalog () {
  let option = {
    method: 'get',
    url: BASE_URL + '/brand/queryLevelCatalog.do',
    params: {}
  }
  return fetchData(option)
}

// 获取品牌优先级
export function fetchCatalogBrand (para) {
  let option = {
    method: 'post',
    url: BASE_URL + '/brand/queryCatalogBrand.do',
    params: para
  }
  return fetchData(option)
}

// 更新品牌展示优先级
export function updateBrand (para) {
  let option = {
    method: 'post',
    url: BASE_URL + '/brand/UpdateBrandPri.do',
    params: para
  }
  return fetchData(option)
}

// 编辑查询联级详情
export function fetchDetail (nodeId) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/querySingleConfig.do',
    params: {
      nodeId: nodeId
    }
  }
  return fetchData(option)
}

// 删除属性配置详情
export function fetchDeleteDetail (id) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/deleteConfig.do',
    params: {
      id: id
    }
  }
  return fetchData(option)
}

// 添加属性配置详情
export function fetchAddDetail (params) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/submitConfig.do',
    params: params
  }
  return fetchData(option)
}

// 修改编辑配置详情
export function fetchEditDetail (params) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/alterConfig.do',
    params: params
  }
  return fetchData(option)
}

// 查询tab选项卡树形菜单
export function fetchTabsTree (rootId) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/queryContentTree.do',
    params: {
      templateId: rootId
    }

  }
  return fetchData(option)
}

// 添加tab选项
export function fetchAddTab (params) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/addTemplate.do',
    params: params
  }
  return fetchData(option)
}

// 修改tab选项名称
export function fetchEditTab (params) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/alterContentConfig.do',
    params: params
  }
  return fetchData(option)
}

// 发布请求
export function fetchPublish (params) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/publicContentConfig.do',
    params: params
  }
  return fetchData(option)
}

// 取消发布请求
export function fetchRepublish (params) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/cancelAllSave.do',
    params: params
  }
  return fetchData(option)
}

// 内容配置查询节点信息
export function fetchQuerySingleContentConfig (nodeId) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/querySingleContentConfig.do',
    params: {
      nodeId: nodeId
    }
  }
  return fetchData(option)
}

// 内容配置保存节点
export function fetchSubmitContentConfig (params) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/submitContentConfig.do',
    params: params
  }
  return fetchData(option)
}

// 内容配置修改节点
export function fetchAlterContentConfig (params) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/alterContentConfig.do',
    params: params
  }
  return fetchData(option)
}

// 内容配置删除节点
export function fetchDeleteContentConfig (id) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/deleteContentConfig.do',
    params: {
      nodeId: id
    }
  }
  return fetchData(option)
}

// 内容配置调整节点顺序
export function fetchUpdateContentQueues (nodeIds) {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/updateContentQueues.do',
    params: {
      nodeId: nodeIds
    }
  }
  return fetchData(option)
}

// tab_list树结构
export function fetchQueryTabListBackend () {
  let option = {
    method: 'post',
    url: BASE_URL + '/config/queryTabListBackend.do',
    params: {}
  }
  return fetchData(option)
}

// 查询品牌对应图片
export function fetchChoosedBrandImg (brandId) {
  let option = {
    method: 'post',
    url: BASE_URL + '/brand/choosedBrandImg.do',
    params: {
      brandId: brandId
    }
  }
  return fetchData(option)
}

// 查询商品对应图片
export function fetchChoosedProductImg (productId) {
  let option = {
    method: 'post',
    url: BASE_URL + '/brand/choosedProductImg.do',
    params: {
      productId: productId
    }
  }
  return fetchData(option)
}

// 查询类目对应图片
export function fetchChoosedCatalogImg (catalogId) {
  let option = {
    method: 'post',
    url: BASE_URL + '/brand/choosedCatalogImg.do',
    params: {
      catalogId: catalogId
    }
  }
  return fetchData(option)
}
