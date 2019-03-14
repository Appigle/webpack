'use strict' // 严格模式
const path = require('path')
const utils = require('./utils') // 配置文件处理工具
const webpack = require('webpack')
const config = require('../config') // 全局配置参数
const merge = require('webpack-merge') // webpack-merge合并工具
const baseWebpackConfig = require('./webpack.base.conf') // 基础webpack配置
const CopyWebpackPlugin = require('copy-webpack-plugin') // Copies individual files or entire directories to the build directory. 用来复制静态资源到输出目录中
// HtmlWebpackPlugin插件的两个作用：
// 为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题
// 可以生成创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口
// 资料：https://www.cnblogs.com/zhanggf/p/8643650.html
const HtmlWebpackPlugin = require('html-webpack-plugin') // Plugin that simplifies creation of HTML files to serve your bundles 联系Html的插进 https://www.npmjs.com/package/html-webpack-plugin
// extract-text-webpack-plugin该插件的主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
// Extract text from a bundle, or bundles, into a separate file.
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// A Webpack plugin to optimize \ minimize CSS assets. https://www.npmjs.com/package/optimize-css-assets-webpack-plugin
// 用来压缩css样式文件
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// This plugin uses uglify-js to minify your JavaScript. https://www.npmjs.com/package/uglifyjs-webpack-plugin
// 用来压缩js文件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const env = {{#if_or unit e2e}}process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : {{/if_or}}require('../config/prod.env')

  // 合并base webpack的配置
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  // 是否开启开发工具
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot, // 输出路径
    filename: utils.assetsPath('js/[name].[chunkhash].js'), // 输出文件的地址和名称
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js') // 输出组件的名称和地址
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // 资料：https://segmentfault.com/a/1190000017217915
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // 压缩js配置
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
    // 分割 css文件到单独的文件
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true, // 必须为true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // 压缩css配置
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // html模板文件配置
    new HtmlWebpackPlugin({
      filename: {{#if_or unit e2e}}process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : {{/if_or}}config.build.index,
      template: 'index.html', // 模板路径
      inject: true, // 插入js的位置
      minify: {
        removeComments: true, // 是否移除注释
        collapseWhitespace: true, // 是否移除多余的空格
        removeAttributeQuotes: true // 是否移除属性的引号
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency' // 组件排序方式
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),

    // vendor manifest app 不同组件的分割输出 资料：https://www.cnblogs.com/myzy/p/8427782.html
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
    // 复制静态资源到输出目录中
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

// 生产环境压缩代码
if (config.build.productionGzip) {
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

// 打包分析报告
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
