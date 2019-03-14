'use strict' // Javascript的严格模式
require('./check-versions')() //立即执行版本检测

process.env.NODE_ENV = 'production' // 设置运行正式环境

const ora = require('ora') // Elegant terminal spinner 优雅的终端spinner https://www.npmjs.com/package/ora
const rm = require('rimraf') // The UNIX command rm -rf for node. https://www.npmjs.com/package/rimraf
const path = require('path') // The path module provides utilities for working with file and directory paths. 文件和文件夹处理工具 https://nodejs.org/docs/latest/api/path.html
// Terminal string styling done right 终端输出样式修改工具 https://www.npmjs.com/package/chalk
const chalk = require('chalk')
// webpack
const webpack = require('webpack')
// 全局配置文件
const config = require('../config')
// webpack配置文件
const webpackConfig = require('./webpack.prod.conf')

// 终端输出文字提示
const spinner = ora('building for production...')
spinner.start()

// 删除生产环境资源root文件夹
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err // 如果删除文件错误，则抛出err
  // 执行webpack打包
  webpack(webpackConfig, (err, stats) => {
    spinner.stop() // 停止终端spinner
    if (err) throw err // 如果执行webpack打包错误，则抛出错误
    // 程序标准输出
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // if you are using ts-loader, setting this to true will make typescript errors show up during build
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      // 终端红色错误提示输出
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    // 终端青色成功提示输出
    console.log(chalk.cyan('  Build complete.\n'))
    // 终端黄色提示输出
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
