'use strict' // JavaScript的严格模式
// Terminal string styling done right 终端输出样式修改工具 https://www.npmjs.com/package/chalk
const chalk = require('chalk')
// The semantic versioner for npm 版本号管理工具  https://www.npmjs.com/package/semver
const semver = require('semver')
// 项目配置
const packageConfig = require('../package.json')
// Unix shell commands for Node.js
const shell = require('shelljs')

// 获取执行命令行命令字符串并截取空格
function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}

// 需要的版本信息
const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),  // node的版本号
    versionRequirement: packageConfig.engines.node // 需要的node版本号
  }
]

// 是否包含npm
if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'), // 获取当前npm版本
    versionRequirement: packageConfig.engines.npm // 需要的npm版本
  })
}

// 导出module.exports
module.exports = function () {
  const warnings = []

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]
    // 判断当前版本是否满足要求
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    process.exit(1) // 版本不正确，退出程序执行
  }
}
