import axios from 'axios'
import store from '@/store'
import element from 'element-ui'

const URL = process.env.BASE_API
const URI_PRE = '/credit/paces-emall-admin/emp/admin/coupon/'
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

// 批量导入
export function fetchImportTemplate (params) {
  let option = {
    method: 'post',
    url: BASE_URL + 'couponBatchImport.do',
    headers: {'Content-Type': 'multipart/form-data'},
    data: params
  }
  return fetchData(option)
}

// 模版下载
export function fetchDownloadTemplate (type) {
  let option = {
    method: 'post',
    url: BASE_URL + 'downloadTemplate.do',
    params: {
      id: type
    }
  }
  return fetchData(option)
}

// 保存/新增优惠券接口
export function saveCoupon (params) {
  let option = {
    url: BASE_URL + 'saveCouponsTemplate.do',
    method: 'post',
    params: params
  }
  return fetchData(option)
}

// 查询优惠券接口
export function queryCoupon (params) {
  let option = {
    url: BASE_URL + 'queryCouponsTemplateList.do',
    method: 'post',
    params: params
  }
  return fetchData(option)
}

// 修改优惠券接口
export function updateCoupon (params) {
  let option = {
    url: BASE_URL + 'updateCouponsTemplate.do',
    method: 'post',
    params: params
  }
  return fetchData(option)
}

// 通过ID查看优惠券接口
export function viewCoupon (id) {
  let option = {
    url: BASE_URL + 'queryCouponsTemplateId.do',
    method: 'post',
    params: {
      couponTemplateId: id
    }
  }
  return fetchData(option)
}

// 模版已选择/排除类目查询
export function fetchQuerySelectedOrExcludeCatalogList (params) {
  let option = {
    method: 'post',
    url: BASE_URL + 'querySelectedOrExcludeCatalogList.do',
    params: params
  }
  return fetchData(option)
}

// 启用/禁用优惠券接口
export function updateCouponState (id, status) {
  let option = {
    url: BASE_URL + 'updateCouponsTemplateState.do',
    method: 'post',
    params: {
      couponTemplateId: id,
      status: status
    }
  }
  return fetchData(option)
}

// 删除优惠券接口
export function deleteCoupon (id, status) {
  let option = {
    url: BASE_URL + 'deleteCouponsTemplate.do',
    method: 'post',
    params: {
      couponTemplateId: id,
      status: status
    }
  }
  return fetchData(option)
}

// 券码数量管理
export function addCouponNum (id, num, updatedDate) {
  let option = {
    url: BASE_URL + 'addCouponNum.do',
    method: 'post',
    params: {
      couponTemplateId: id,
      addNum: num,
      updatedDate: updatedDate
    }
  }
  return fetchData(option)
}

// 商品联想
export function fetchgoodsName (name) {
  let option = {
    method: 'post',
    url: BASE_URL + 'productAssociate.do',
    params: {
      productName: name
    }
  }
  return fetchData(option)
}

// 商户联想
export function fetchMallName (name) {
  let option = {
    method: 'post',
    url: BASE_URL + 'providerAssociate.do',
    params: {
      providerName: name
    }
  }
  return fetchData(option)
}

// 商品列表（分页）查询（不含选择和排他）
export function fetchGoodsList (params) {
  let option = {
    method: 'post',
    url: BASE_URL + 'queryPrdList.do',
    params: params
  }
  return fetchData(option)
}

// 商户列表（分页）查询（不含选择和排他）
export function fetchMallList (params) {
  let option = {
    method: 'post',
    url: BASE_URL + 'queryMerchantList.do',
    params: params
  }
  return fetchData(option)
}

// 排除／选择商品列表查询（分页）（optType传1，查询的是‘编辑商品’中的‘已选择商品’；optType传2，查询的是‘排除商品’中的‘已排除商品’；）
export function fetchexcludeGoods (params) {
  let option = {
    method: 'post',
    url: BASE_URL + 'querySelectedOrExcludePrdList.do',
    params: params
  }
  return fetchData(option)
}

// 排除／选择商户列表查询（分页）（optType传1，查询的是‘编辑商户’中的‘已选择商户’；optType传2，查询的是‘排除商户’中的‘已排除商户’；）
export function fetchexcludeMall (params) {
  let option = {
    method: 'post',
    url: BASE_URL + 'querySelectedOrExcludeMerchantList.do',
    params: params
  }
  return fetchData(option)
}

// 选择商品、商户和类目（建立关系）
export function fetchChoiceExclude (params) {
  let option = {
    method: 'post',
    url: BASE_URL + 'creatLink.do',
    params: params
  }
  return fetchData(option)
}

// 选择商品、商户和类目（解除关系）
export function fetchUnchoiceExclude (params) {
  let option = {
    method: 'post',
    url: BASE_URL + 'destoryLink.do',
    params: params
  }
  return fetchData(option)
}
