'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
// vueLoaderConfig 配置文件
const vueLoaderConfig = require('./vue-loader.conf')

// 合并参数获取文件地址
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

// eslint的检验规则
{{#lint}}const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
}){{/lint}}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: { // 入口配置
    app: './src/main.js' // 默认配置入口
  },
  output: { // 输出配置
    path: config.build.assetsRoot, // 输出路径
    filename: '[name].js', // [name] 文件名 [hash]hash值
    publicPath: process.env.NODE_ENV === 'production' // 根据环境获取路径
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: { // 解析配置
    extensions: ['.js', '.vue', '.json'],
    alias: {
      {{#if_eq build "standalone"}}
      'vue$': 'vue/dist/vue.esm.js',
      {{/if_eq}}
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {{#lint}}
      // 是否编译前进行eslint检查
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {{/lint}}
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // 包含src文件夹 test文件夹 和dev-server的client文件夹 需要babel-loader转换
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      { // 图片资源loader
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          // [ext]不改变原有文件后缀
          // [hash:7]7位hash值
          // 路径在img下
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          // 路径在media下
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      { // 字体loader
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: { // node配置
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
