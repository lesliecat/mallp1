import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  {
    path: '/authredirect',
    component: _import('login/authredirect'),
    hidden: true
  },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true }
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: _import('dashboard/index'),
  //       name: 'dashboard',
  //       meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
  //     }
  //   ]
  // }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: 'index',
    meta: {
      role: ['admin-general'],
      title: 'dashboard',
      icon: 'dashboard'
    },
    children: [
      {
        path: 'index',
        component: _import('classifyManage/configPage'),
        name: 'index',
        meta: {
          title: 'index'
        }
      },
      {
        path: 'homeNav',
        component: _import('classifyManage/configPage'),
        name: 'homeNav',
        meta: {
          title: 'homeNav'
        }
      },
      {
        path: 'tabsTemplate',
        component: _import('classifyManage/configPage'),
        name: 'tabsTemplate',
        meta: {
          title: 'tabsTemplate'
        }
      }
    ]
  },
  {
    path: '/classifyManage',
    component: Layout,
    redirect: 'noredirect',
    name: 'classifyManage',
    meta: {
      role: ['admin-general'],
      title: 'classifyManage',
      icon: 'component'
    },
    children: [
      {
        path: 'catalog',
        component: _import('classifyManage/configPage'),
        name: 'catalog',
        meta: {
          title: 'catalog'
        }
      },
      {
        path: 'tabs',
        component: _import('classifyManage/configPage'),
        name: 'tabs',
        meta: {
          title: 'tabs'
        }
      },
      {
        path: 'activity',
        component: _import('classifyManage/configPage'),
        name: 'activity',
        meta: {
          title: 'activity'
        }
      },
      {
        path: 'fuelcard',
        component: _import('classifyManage/configPage'),
        name: 'fuelcard',
        meta: {
          title: 'fuelcard'
        }
      },
      {
        path: 'newbornZone',
        component: _import('classifyManage/configPage'),
        name: 'newbornZone',
        meta: {
          title: 'newbornZone'
        }
      }
    ]
  },
  {
    path: '/listManage',
    component: Layout,
    redirect: 'noredirect',
    name: 'listManage',
    meta: {
      role: ['admin-general'],
      title: 'listManage',
      icon: 'form'
    },
    children: [
      {
        path: 'priceRange',
        component: _import('listManage/priceRange'),
        name: 'priceRange',
        meta: {
          title: 'priceRange'
        }
      },
      {
        path: 'brandPriority',
        component: _import('listManage/brandPriority'),
        name: 'brandPriority',
        meta: {
          title: 'brandPriority'
        }
      }
    ]
  },
  {
    path: '/promoteManage',
    component: Layout,
    redirect: 'coupon',
    name: 'promoteManage',
    meta: {
      role: ['admin-coupon'],
      title: 'promoteManage',
      icon: 'form'
    },
    children: [
      {
        path: 'coupon',
        component: _import('promoteManage/coupon'),
        name: 'coupon',
        meta: {
          title: 'coupon',
          icon: 'star'
        }
      }
      // {
      //   path: 'intelligentActivity',
      //   component: _import('promoteManage/intelligentActivity'),
      //   name: 'intelligentActivity',
      //   meta: {
      //     title: 'intelligentActivity'
      //   }
      // },
      // {
      //   path: 'couponDirectional',
      //   component: _import('promoteManage/couponDirectional'),
      //   name: 'couponDirectional',
      //   meta: {
      //     title: 'couponDirectional'
      //   }
      // }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
