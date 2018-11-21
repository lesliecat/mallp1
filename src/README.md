## 开发

```bash
    # 克隆项目
    git clone http://git-ma.paic.com.cn/mall/mallp.git

    # 安装依赖
    npm install

    //or # 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
    npm install --registry=https://registry.npm.taobao.org

    # 本地开发 开启服务
    npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
    # 发布测试环境 带webpack analyzer
    npm run build:sit-preview

    # 构建生成环境
    npm run build:prod
```

更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/#/)

## 目录结构

```shell
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
│   ├── views                  // view
│   ├── App.vue                // 入口页面
│   ├── errorLog.js			       // 错误日志
│   ├── main.js                // 入口 加载组件 初始化等
└───└── permission.js          // 权限管理
```
