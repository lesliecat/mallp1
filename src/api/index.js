import {
  fetchCatalogTree,
  fetchBrandList,
  fetchProductList,
  fetchDeleteConfig,
  fetchNodeOrder,
  fetchUploadImg,
  fetchConfigPriceList,
  fetchLevelCatalog,
  fetchCatalogBrand,
  updateConfigPrice,
  fetchDetail,
  fetchDeleteDetail,
  fetchAddDetail,
  fetchEditDetail,
  updateBrand,
  fetchAddTab,
  fetchEditTab,
  fetchPublish,
  fetchRepublish,
  fetchAllTemplate,
  fetchTabsTree,

  fetchQuerySingleContentConfig,
  fetchSubmitContentConfig,
  fetchAlterContentConfig,
  fetchDeleteContentConfig,
  fetchUpdateContentQueues,
  fetchQueryTabListBackend,

  fetchChoosedBrandImg,
  fetchChoosedProductImg,
  fetchChoosedCatalogImg
} from './ajax.js'

import {
  catalogTreeCache,
  configPriceListCache,
  catalogBrandCache,
  catalogDetailCache
} from './cache.js'

// 接口请求成功标识码
export const ERR_OK = '000'

// 接口缓存
export function getData (cacheStore, fetch, key) {
  return new Promise((resolve, reject) => {
    // let cache = cacheStore.get(key.length === 1 ? `${key[0]}` : `${key[0]}/${key[1]}`)
    let cacheKey = ''
    for (let i = 0; i < key.length; i++) {
      if (typeof key[i] === 'object') { // key[i] is Array or object
        cacheKey += '/' + i + '/'
        for (let item in key[i]) {
          if (key[i][item]) {
            let thisKey = '|' + item + '_' + key[i][item]
            cacheKey += thisKey
          }
        }
      } else { // key[i] is string
        cacheKey += '/' + i + '/'
        let thisKey = '/' + i + '/' + key[i]
        cacheKey += thisKey
      }
    }

    let cache = cacheStore.get(cacheKey)
    if (cache) {
      resolve(cache)
    } else {
      fetch(...key).then(res => {
        cacheStore.set(cacheKey, res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    }
  })
}

// 接口不缓存
export function getNoCacheData (fetch, key) {
  return new Promise((resolve, reject) => {
    fetch(...key).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 获取目录Tree
export function getCatalogTree () {
  return getNoCacheData(fetchCatalogTree, [])
}

// 获取品牌
export function getBrandList (query) {
  return getNoCacheData(fetchBrandList, [query])
}

// 获取商品
export function getProductList (query) {
  return getNoCacheData(fetchProductList, [query])
}

// 获取模版
export function getAllTemplate () {
  return getNoCacheData(fetchAllTemplate, [])
}

// 删除通用配置
export function deleteConfig (id) {
  return getData(catalogTreeCache, fetchDeleteConfig, [id])
}

// 调整节点顺序
export function changeNodeOrder (nodeId) {
  return getNoCacheData(fetchNodeOrder, [nodeId])
}

export function uploadImg (image) {
  return getNoCacheData(fetchUploadImg, [image])
}

// 查询价格区间
export function getConfigPriceList (para) {
  return getNoCacheData(fetchConfigPriceList, [para])
}

// 更新价格区间
export function updateConfigPriceById (para) {
  return getData(configPriceListCache, updateConfigPrice, [para])
}

// 查询类目列表
export function queryLevelCatalog () {
  return getNoCacheData(fetchLevelCatalog, [])
}

// 查询品牌
export function queryCatalogBrand (para) {
  return getNoCacheData(fetchCatalogBrand, [para])
}

// 更新品牌展示优先级
export function UpdateBrandPri (para) {
  return getData(catalogBrandCache, updateBrand, [para])
}

// 编辑查询联级详情
export function queryDetail (nodeId) {
  return getNoCacheData(fetchDetail, [nodeId])
}

// 删除属性配置
export function deleteDetail (id) {
  return getNoCacheData(fetchDeleteDetail, [id])
}

// 添加属性配置
export function addDetail (params) {
  return getData(catalogDetailCache, fetchAddDetail, [params])
}

// 修改属性配置
export function editDetail (params) {
  return getNoCacheData(fetchEditDetail, [params])
}

// 查询tab选项卡树形菜单
export function getTabsTree (rootId) {
  return getNoCacheData(fetchTabsTree, [rootId])
}

// 添加tab选项
export function addTab (params) {
  return getNoCacheData(fetchAddTab, [params])
}

// 修改tab选项名称
export function editTab (params) {
  return getNoCacheData(fetchEditTab, [params])
}

// 发布请求
export function publishNode (params) {
  return getNoCacheData(fetchPublish, [params])
}

// 撤销发布请求
export function republishNode (params) {
  return getNoCacheData(fetchRepublish, [params])
}

// 内容配置查询节点信息
export function querySingleContentConfig (nodeId) {
  return getNoCacheData(fetchQuerySingleContentConfig, [nodeId])
}

// 内容配置保存节点
export function submitContentConfig (params) {
  return getNoCacheData(fetchSubmitContentConfig, [params])
}

// 内容配置修改节点
export function alterContentConfig (params) {
  return getNoCacheData(fetchAlterContentConfig, [params])
}

// 内容配置删除节点
export function deleteContentConfig (id) {
  return getNoCacheData(fetchDeleteContentConfig, [id])
}

// 内容配置调整节点顺序
export function updateContentQueues (ids) {
  return getNoCacheData(fetchUpdateContentQueues, [ids])
}

// tab_list树结构
export function queryTabListBackend () {
  return getNoCacheData(fetchQueryTabListBackend, [])
}

// 查询品牌对应图片
export function queryBrandImg (brandId) {
  return getNoCacheData(fetchChoosedBrandImg, [brandId])
}

// 查询商品对应图片
export function queryProductImg (productId) {
  return getNoCacheData(fetchChoosedProductImg, [productId])
}

// 查询品牌对应图片
export function queryCatalogImg (catalogId) {
  return getNoCacheData(fetchChoosedCatalogImg, [catalogId])
}
