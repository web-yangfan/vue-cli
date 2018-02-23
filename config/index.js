"use strict";
const path = require('path')

module.exports = {
  dev: {
    /* 在webpack.base.conf.js 配置url-loader 设置路径使用 */
    assetsSubDirectory: 'static',
    /* output.publicPath 使用*/
    assetsPublicPath: '/',
    proxyTable: {},

    host: 'localhost',
    port: 3000, // 端口号
    autoOpenBrowser: false, // 是否自动打开浏览器
    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',
    errorOverlay: true,
    notifyOnErrors: true,
    // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    poll: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },
  build: {
    /* 编译输出路径 output.path 使用*/
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    /* output.publicPath 使用*/
    assetsPublicPath: '/',
    productionSourceMap: true
  }
}