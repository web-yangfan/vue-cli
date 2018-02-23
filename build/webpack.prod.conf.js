'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')

// webpack 配置合并插件
// https://github.com/survivejs/webpack-merge
const merge = require('webpack-merge')

const baseWebpackConfig = require('./webpack.base.conf')

// webpack 复制文件和文件夹的插件
// https://github.com/kevlened/copy-webpack-plugin
const CopyWebpackPlugin = require('copy-webpack-plugin')

// 自动生成 html 并且注入到 .html 文件中的插件
// https://github.com/ampedandwired/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 提取css的插件
// https://github.com/webpack-contrib/extract-text-webpack-plugin
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// webpack 优化压缩和优化 css 的插件
// https://github.com/NMFR/optimize-css-assets-webpack-plugin
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

// 插件压缩
// https://github.com/webpack-contrib/uglifyjs-webpack-plugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// 获取环境变量
const env = require('../config/prod.env')

/* 合并webapck 基础配置*/
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  /*
* devServer选项 是否生成，以及如何生成 Source Map。
* http://www.css88.com/doc/webpack2/configuration/devtool/
* */
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    // 编译输出的静态资源路径
    path: config.build.assetsRoot,
    // 编译输出的文件名
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // 没有指定输出名的文件输出的文件名
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // definePlugin 定义环境变量
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // 压缩 js
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    // 提取 css
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // 压缩提取出来的 css
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // 将 index.html 作为入口，注入 html 代码后生成 index.html文件
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    // 复制静态资源
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})
 // 开启 gzip 的情况时，给 webpack plugins添加 compression-webpack-plugin 插件
if (config.build.productionGzip) {
  // webpack 压缩插件
  // https://github.com/webpack-contrib/compression-webpack-plugin
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}
// 开启包分析的情况时， 给 webpack plugins添加 webpack-bundle-analyzer 插件
if (config.build.bundleAnalyzerReport) {
  // https://github.com/th0r/webpack-bundle-analyzer
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
