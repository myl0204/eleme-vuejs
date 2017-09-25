# seller

> 仿ele商家页面，基于Vue.js

## [项目地址](https://myl0204.github.io/eleme-vuejs) (使用手机浏览器打开，或者使用chrome开发者模式)

或者

## 手机扫码：
![手机扫一扫](https://raw.githubusercontent.com/myl0204/eleme-vuejs/master/pics/1506338480.png)


## Build Setup

``` bash
# install dependencies
# 安装依赖
npm install

# serve with hot reload at localhost:8080
# 建立一个拥有热重载功能的本地服务
npm run dev

# build for production with minification
# 打包项目并压缩
npm run build

# serve at localhost:3000
# 建立静态服务，必须提前进行过打包操作
npm run prod
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 涉及技术

* [Vue2](https://github.com/vuejs)
  * [vue-cli](https://github.com/vuejs/vue-cli) (官方vue脚手架)
  
  * [vue-router](https://github.com/vuejs/vue-router) (官方路由)

  * vue-resource(https://github.com/pagekit/vue-resource) (ajax插件，用以进行http请求)

  * 其他：eventBus(处理非父子组件通信)， transition(处理过渡效果) 等


* [better-scroll](https://github.com/ustbhuangyi/better-scroll) (滚动支持)

* [sass](https://github.com/sass/sass) (css预处理器，本项目使用.scss)

* [webpack](https://github.com/webpack/webpack) (你懂的，打包工具)

## 待完善细节

要做就要做到最好。
限于能力，以下交互效果未能和最新版(Android V7.2)Eleme APP一致。

* 商品列表中，当商品数量变为0时，动画于原版不符

* 商品详情页中，当商品数量变为0时，动画与原版不符

* UI相关（无对应PSD文件）
