'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 友好错误信息提示插件  https://www.npmjs.com/package/friendly-errors-webpack-plugin
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// 端口查找 https://www.npmjs.com/package/portfinder 在默认端口被使用时，自动查找下一个端口号
const portfinder = require('portfinder')

const HOST = process.env.HOST  // 域名
const PORT = process.env.PORT && Number(process.env.PORT) // 端口号 从process.env中获取

// 合并基础webpack配置
const devWebpackConfig = merge(baseWebpackConfig, {
  module: { // 添加样式loaders配置
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool, // 是否打开开发工具

  // these devServer options should be customized in /config/index.js
  devServer: { // 开发本地服务器设置
    clientLogLevel: 'warning', // 输出log日志级别
    historyApiFallback: { // history模式下回调
      rewrites: [ // 找不到404页面跳转
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true, // 是否热更新
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true, // 是否压缩
    host: HOST || config.dev.host, // 设置主域名
    port: PORT || config.dev.port, // 设置端口号
    open: config.dev.autoOpenBrowser, // 是否自动打开浏览器
    overlay: config.dev.errorOverlay // 是否显示全部的错误信息在浏览器中
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,  // 公共资源路径
    proxy: config.dev.proxyTable, // 是否代理
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: { // 监控配置  代码热更新刷新评率
      poll: config.dev.poll,
    }
  },
  plugins: [
    // 定义变量插件
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // 热更新插件
    new webpack.HotModuleReplacementPlugin(),
    // 热更新之后在console中显示正确的文件名
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    // webpack.NoErrorsPlugin() is an optional plugin that tells the reloader to not reload if there is an error. The error is simply printed in the console, and the page does not reload. If you do not have this plugin enabled and you have an error, a red screen of death is thrown.
    // 发生错误时，不更新当前显示页面
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
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

// 模块导出内容 Promise
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {   //启动成功提示
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors // 错误处理通知
        ? utils.createNotifierCallback()
        : undefined
      }))
     // 返回最后的dev环境webpack配置
      resolve(devWebpackConfig)
    }
  })
})
