"use strict";
/* 引入 node path模块*/
const path = require('path')

/* 引入配置文件 */
const utils = require('./utils')
const config = require('../config')

// webpack 基础配置
const baseWebpackConfig = require('./webpack.base.conf')

const webpack = require('webpack')

// webpack 配置合并插件
// https://github.com/survivejs/webpack-merge
const merge = require('webpack-merge')

// webpack 复制文件和文件夹的插件
// https://github.com/kevlened/copy-webpack-plugin
const CopyWebpackPlugin = require('copy-webpack-plugin')

// 自动生成 html 并且注入到 .html 文件中的插件
// https://github.com/ampedandwired/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

// webpack 错误信息提示插件
// https://github.com/geowarin/friendly-errors-webpack-plugin
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

/*
* https://github.com/indexzero/node-portfinder
* 查看当前端口是否可以用，如果不可以，就换一个端口：
* 设置 portfinder.basePort确定端口起始端口值
* 例子：设置 portfinder.basePort = 3000，如果3000端口不可以用，那么就会使用 3001
* */
const portfinder = require('portfinder')

/*
* 获取node HOST 和 PORT
* 在设置 devServer的时候判断，如果值为undefined就使用配置文件的host和PORT
* */
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)



/* 合并webapck 基础配置*/
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    // 设置loader 配置
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // https://doc.webpack-china.org/configuration/devtool/#src/components/Sidebar/Sidebar.jsx
  // 是否生成Source Map
  devtool: config.dev.devtool,

  /*
  * devServer选项：是否生成，以及如何生成 Source Map。 可以在 /config/index.js 定制
  * http://www.css88.com/doc/webpack2/configuration/devtool/
  * */
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    // definePlugin 定义环境变量
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // HotModule 插件在页面进行变更的时候只会重绘对应的页面模块，不会重绘整个 html 文件
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // 将 index.html 作为入口，注入 html 代码后生成 index.html 文件
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // 复制静态资源
    // https://github.com/kevlened/copy-webpack-plugin
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

/*
*  返回一个Promise对象
*  因为需要使用 portfinder 检查端口是否可以使用，然后在执行webpack Server
* */
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  // 检查端口是否可用
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // webpack 错误信息提示插件
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))
      // 启动webpack Server
      resolve(devWebpackConfig)
    }
  })
})