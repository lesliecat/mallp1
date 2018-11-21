import LRU from 'lru-cache'

export const catalogTreeCache = LRU({
  max: 1000,
  maxAge: 1000 * 60 * 30 // 30min 服务器缓存详情内容
})

export const configPriceListCache = LRU({
  max: 1000,
  maxAge: 1000 * 60 * 30 // 30min 服务器缓存详情内容
})

export const levelCatalogCache = LRU({
  max: 1000,
  maxAge: 1000 * 60 * 30 // 30min 服务器缓存详情内容
})

export const catalogBrandCache = LRU({
  max: 1000,
  maxAge: 1000 * 60 * 30 // 30min 服务器缓存详情内容
})

export const catalogDetailCache = LRU({
  max: 1000,
  maxAge: 1000 * 60 * 30 // 30min 服务器缓存详情内容
})
/*
//'lru-cache'的使用方法
var LRU = require("lru-cache")
  , options = { max: 500
              , length: function (n, key) { return n * 2 + key.length }
              , dispose: function (key, n) { n.close() }
              , maxAge: 1000 * 60 * 60 }
  , cache = LRU(options)
  , otherCache = LRU(50) // sets just the max size

cache.set("key", "value")
cache.get("key")    // "value"

// non-string keys ARE fully supported
var someObject = {}
cache.set(someObject, 'a value')
cache.set('[object Object]', 'a different value')
assert.equal(cache.get(someObject), 'a value')
cache.reset()    // empty the cache
*/
