#! /usr/bin/env node
import fs from 'fs-extra'
import command = require('commander')
import * as path from 'path'

process.env.NODE_PATH = __dirname + '/../node_modules'

const res = (command: string) =>
  path.resolve(__dirname, '../commands/', command)

// 获取脚本版本信息 -v --version
command.version(
  JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../package.json')).toString()
  ).version,
  '-v, --version'
)

// 信息的首行提示
command.usage('<command>')

// 引入cli命令
command
  .command('cli <name>')
  .description('Generate a new my project')
  .alias('i')
  .action((name: string) => {
    // 引入cli命令入口文件并执行
    require(res('cli/index'))(name)
  })

// 引入qtest命令
command
  .command('qtest')
  .description('command test')
  .alias('qt')
  .action(() => {
    // 引入qtest命令入口文件并执行
    require(res('qtest/index'))
  })

/*
.parse的第一个参数是要解析的字符串数组，也可以省略参数而使用process.argv。
如果参数遵循与 node 不同的约定，可以在第二个参数中传递from选项：
'node': 默认值，argv[0]是应用，argv[1]是要跑的脚本，后续为用户参数；
'electron': argv[1]根据 electron 应用是否打包而变化；
'user': 来自用户的所有参数。
 */
command.parse(process.argv)

// 没有键入命令时 展示help信息提示
if (!command.args || !command.args.length) {
  command.help()
}
