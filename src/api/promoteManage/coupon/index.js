import {
  fetchImportTemplate,
  fetchDownloadTemplate,
  fetchQuerySelectedOrExcludeCatalogList,
  fetchgoodsName,
  fetchMallName,
  fetchGoodsList,
  fetchMallList,
  fetchexcludeGoods,
  fetchexcludeMall,
  fetchChoiceExclude,
  fetchUnchoiceExclude
} from './ajax.js'

import {} from '../../cache.js'

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

// 批量导入
export function importTemplate (params) {
  return getNoCacheData(fetchImportTemplate, [params])
}

// 模版下载
export function downloadTemplate (type) {
  return getNoCacheData(fetchDownloadTemplate, [type])
}

// 模版已选择/排除类目查询
export function querySelectedOrExcludeCatalogList (params) {
  return getNoCacheData(fetchQuerySelectedOrExcludeCatalogList, [params])
}

// 商品联想
export function goodsNameSearch (name) {
  return getNoCacheData(fetchgoodsName, name)
}

// 商户联想
export function mallNameSearch (name) {
  return getNoCacheData(fetchMallName, name)
}

// 商品列表（分页）查询
export function goodsList (params) {
  return getNoCacheData(fetchGoodsList, [params])
}

// 商户列表（分页）查询
export function mallList (params) {
  return getNoCacheData(fetchMallList, [params])
}

// 排除／选择商品列表查询（分页）（optType传1，查询的是‘编辑商品’中的‘已选择商品’；optType传2，查询的是‘排除商品’中的‘已排除商品’；）
export function excludeGoods (params) {
  return getNoCacheData(fetchexcludeGoods, [params])
}

// 排除／选择商户列表查询（分页）（optType传1，查询的是‘编辑商户’中的‘已选择商户’；optType传2，查询的是‘排除商户’中的‘已排除商户’；）
export function excludeMall (params) {
  return getNoCacheData(fetchexcludeMall, [params])
}

// 选择商品、商户和类目（建立关系）
export function choiceExclude (params) {
  return getNoCacheData(fetchChoiceExclude, [params])
}

// 选择商品、商户和类目（解除关系）
export function unchoiceExclude (params) {
  return getNoCacheData(fetchUnchoiceExclude, [params])
}
