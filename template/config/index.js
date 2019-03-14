'use strict'
// Template version: {{ template_version }}
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static', // 静态资源地址
    assetsPublicPath: '/', // 资源公共地址
    proxyTable: {},

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false, //是否自动打开浏览器
    errorOverlay: true, // 展示错误信息
    notifyOnErrors: true, // 错误通知
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions- 通过传递 true 开启 polling，或者指定毫秒为单位进行轮询 // Check for changes every second

    // {{#lint}}// Use Eslint Loader?
    // // If true, your code will be linted during bundling and
    // // linting errors and warnings will be shown in the console.
    // useEslint: true,
    // // If true, eslint errors and warnings will also be shown in the error overlay
    // // in the browser.
    // showEslintErrorsInOverlay: false,
    // {{/lint}}

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true // Simple CSS Sourcemap configuration for CSS, Less, Stylus and Sass 开启css的资源映射表
  },

  build: {
    // Template for index.html
    //  __dirname: Node Global Objects (__dirname __filename exports module require() )
    index: path.resolve(__dirname, '../dist/index.html'), // 输出的html文件路径

    // Paths resolve：获取绝对路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static', // 生产环境的静态资源路径
    assetsPublicPath: '/', // root路径

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false, // 压缩
    productionGzipExtensions: ['js', 'css'], // 压缩匹配的后缀文件

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
