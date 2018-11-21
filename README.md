# 后台管理端平台

[![vue](https://img.shields.io/badge/vue-2.5.9-brightgreen.svg)](https://github.com/vuejs/vue)
[![element-ui](https://img.shields.io/badge/element--ui-2.0.7-brightgreen.svg)](https://github.com/ElemeFE/element)
[![Build Status](https://travis-ci.org/PanJiaChen/vue-element-admin.svg?branch=master)](https://travis-ci.org/PanJiaChen/vue-element-admin)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/github/release/PanJiaChen/vue-element-admin.svg)]()

**注意：该项目目前使用 element-ui@2.0.0+版本，所以最低兼容 Vue 2.5.0**

## 前序准备

你的本地环境需要安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。我们的技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) 和 [element-ui](https://github.com/ElemeFE/element)，提前了解和学习这些知识会对使用本项目有很大的帮助。

**该项目不支持低版本游览器(如 ie)**

## 功能

* 登录/注销
* 多环境发布
* 动态侧边栏（支持多级路由）
* 动态面包屑
* 快捷导航(标签页 支持右键操作)
* Screenfull 全屏
* 列表拖拽
* Svg Sprite 图标
* Dashboard
* 本地 mock 数据
* 401/404 错误页面
* 错误日志

## 开发

```bash
    # 克隆项目
    git clone http://git-ma.paic.com.cn/mall/mallp.git

    # 安装依赖
    npm install

    //or # 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
    npm install --registry=https://registry.npm.taobao.org

    # 本地开发 开启服务
    npm run dev（http://localhost:9527）
```

## 发布

```bash
    # 发布测试环境 带webpack analyzer
    npm run build:sit

    # 构建生成环境
    npm run build:prod
```

更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/#/)

## 目录结构

```shell
├── build                      // 构建相关
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filters                // 全局 filter
│   ├── icons                  // 项目所有 svg icons
│   ├── lang                   // 国际化 language
│   ├── mock                   // 项目mock 模拟数据
│   ├── router                 // 路由
│   ├── store                  // 全局 store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── vendor                 // 公用vendor
│   ├── views                   // view
│   ├── App.vue                // 入口页面
│   ├── main.js                // 入口 加载组件 初始化等
│   └── permission.js          // 权限管理
├── static                     // 第三方不打包资源
│   └── sm2                    // 密码加密
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json
```
