import fs from 'fs-extra'
import shell from 'shelljs'
import symbols from 'log-symbols'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'
import * as path from 'path'

import { portInquire, proInquire, pbInfoInquire } from './inquirer'

// 包位置
const sayaPosition = path.resolve(__dirname, '../../')
// 定位shell命令至包位置
const toSaya = `cd ${path.resolve(__dirname, '../../')}`
// 小程序cli命令目录
// const XCli = '/Applications/wechatwebdevtools.app/Contents/MacOS/./cli'
// 微信开发者工具服务端口号
let servePort: string
// 要发布的项目名称
let proName: string
// 要发布的git分支名称
let publishBranchName: string
let publishInfo: PbsxSpace.publishInfo = {
  pbEnv: '',
  pbVersion: '',
  pbDesc: ''
}

// 获取要发布的信息：环境，版本号，描述 并 向用户确认 环境，版本号，描述，appid
export const getPublishInfo = async (): Promise<void> => {
  try {
    const pbInfoAnswers = await inquirer.prompt(pbInfoInquire)
    publishInfo = { ...publishInfo, ...pbInfoAnswers }
    // 向用户确认发布信息
    shell.echo(
      `您在分支 ${publishBranchName} 的发布信息如下:\n发布环境: ${publishInfo.pbEnv}\n版本号: ${publishInfo.pbVersion}\n发布描述: ${publishInfo.pbDesc}\n`
    )
    // todo
    // 映射appid在上面一行确认信息中增加
    // 询问是否确定
    // 确定则进入发布流程
    // 不确定则重新执行getPublishInfo
  } catch (err) {
    console.log(symbols.error, chalk.red(`*** 运行出错 ***:\n ${err}\n`))
  }
}

// 切换至要发布的分支
export const checkoutBranch = async (): Promise<void> => {
  const spinner = ora(`分支 ${publishBranchName} 准备中...\n`)
  spinner.start()
  const checkoutCommand = `${toSaya}/${proName};git checkout ${publishBranchName}`
  if (shell.exec(checkoutCommand, { silent: true }).code !== 0) {
    spinner.fail(`*** 分支 ${publishBranchName} 准备失败 ***\n`)
    shell.exit(1)
  }
  spinner.succeed(`*** 分支 ${publishBranchName} 准备成功 ***\n`)
  // 获取要发布的信息：环境，版本号，描述 并 向用户确认 环境，版本号，描述，appid
  getPublishInfo()
}

// 获取github的分支名列表以供选择
export const getGitBranch = async (): Promise<void> => {
  const spinner = ora(`获取最新分支loading...\n`)
  spinner.start()
  // 更新分支信息
  shell.exec(`${toSaya}/${proName};git remote update origin --prune`, {
    silent: true
  })
  // 获取分支列表
  const branchStr: string = shell
    .exec(`${toSaya}/${proName};git branch -r`, { silent: true })
    .trim()
    .toString()
  spinner.succeed('*** 获取最新分支成功 ***')
  const branchArr = branchStr
    .split('origin/')
    .slice(3)
    .map((item, idx) => item.replace('\n', '').trim())
  // 获取要发布的分支
  try {
    const publishBranchAnswers = await inquirer.prompt([
      {
        type: 'list',
        message: '请选择要发布的分支',
        name: 'publishBranch',
        choices: [
          // choices里可以有分隔符
          new inquirer.Separator(`*** 选项 ***`),
          ...branchArr
        ]
      }
    ])
    publishBranchName = publishBranchAnswers.publishBranch
    // 切换至要发布的分支
    checkoutBranch()
  } catch (err) {
    console.log(symbols.error, chalk.red(`*** 运行出错 ***:\n ${err}\n`))
  }
}

// git拉取要发布的小程序
export const getProByGit = async (): Promise<void> => {
  const spinner = ora(`loading...\n`)
  spinner.start()
  const getStoreMina = `${toSaya};git clone git@gitlab.jiliguala.com:h5/mina/store-mina.git`
  if (shell.exec(getStoreMina, { silent: true }).code !== 0) {
    spinner.fail(`*** 无法获取项目：${proName} ***:\n`)
    shell.exit(1)
  }
  spinner.succeed('*** 初始化成功 ***')
  // 获取github的分支名列表以供选择
  getGitBranch()
}

// 获取要发布的小程序项目名称
export const getProject = async (): Promise<void> => {
  try {
    const proNameAnswers = await inquirer.prompt(proInquire)
    proName = proNameAnswers.proName
    // git拉取要发布的小程序
    // 检查是否存在小程序项目文件夹
    const proFile = `${sayaPosition}/${proName}`
    if (fs.existsSync(proFile)) {
      // 存在项目，先删后拉
      fs.remove(`${proFile}`)
        .then(() => {
          getProByGit()
        })
        .catch(err =>
          console.log(symbols.error, chalk.red(`*** 运行出错 ***:\n ${err}\n`))
        )
    } else {
      // 不存在 直接拉取
      getProByGit()
    }
  } catch (err) {
    console.log(symbols.error, chalk.red(`*** 运行出错 ***:\n ${err}\n`))
  }
}

/* 询问开发者工具服务端口号 */
export const getServePort = async (): Promise<void> => {
  shell.echo(
    `请打开微信开发者工具-->设置-->安全设置-->服务端口, 并记下端口号\n`
  )
  try {
    // 获取服务端口号
    /* const portAnswers = await inquirer.prompt(portInquire)
    servePort = portAnswers.servePort */
    // 选择要发布的小程序
    getProject()
  } catch (err) {
    console.log(symbols.error, chalk.red(`*** 运行出错 ***:\n ${err}\n`))
  }
}

/* 打开微信开发者工具 */
export const openWechatDev = (): void => {
  /* const spinner = ora(`即将打开微信开发者工具...\n`)
  spinner.start()
  const openWechatDev = `${XCli} open`
  if (shell.exec(openWechatDev).code !== 0) {
    spinner.fail('*** 打开微信开发者工具失败 ***')
    shell.exit(1)
  }
  spinner.succeed('*** 打开微信开发者工具成功 ***') */
  getServePort()
}
