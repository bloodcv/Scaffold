import fs from 'fs-extra'
import shell from 'shelljs'
import symbols from 'log-symbols'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'
import moment from 'moment'
import * as path from 'path'

import {
  // portInquire,
  proInquire,
  pbInfoInquire,
  checkInfoInquire,
  checkBranchInquire
} from './inquirer'

// 包位置
const sayaPosition = path.resolve(__dirname, '../../')
// 定位shell命令至包位置
const toSaya = `cd ${path.resolve(__dirname, '../../')}`
// 小程序cli命令目录
const XCli = '/Applications/wechatwebdevtools.app/Contents/MacOS/./cli'
// 微信开发者工具服务端口号
// let servePort: string
// 要发布的项目名称
let proName: string
// 要发布的git分支名称
let publishBranchName: string
let publishInfo: PbsxSpace.publishInfo = {
  pbEnv: '',
  pbVersion: '',
  pbDesc: ''
}
const appidObj: PbsxSpace.appidObj = {
  dev: 'wx18f8075163853984',
  fat: 'wx18f8075163853984',
  rc: 'wx8f94c312514f740e',
  prod: 'wx8f94c312514f740e'
}
// 要发布环境对应的appid
let appid: string

// 创建logger
const logger = new console.Console(
  fs.createWriteStream(`${sayaPosition}/log/pbsx.log`, {
    flags: 'a',
    encoding: 'utf8'
  })
)

// 接入小程序cli发布
export const publishSmallx = async (): Promise<void> => {
  const spinner = ora(`${publishInfo.pbEnv}环境发布中...\n`)
  spinner.start()
  const pbCommand = `${XCli} upload --project ${sayaPosition}/${proName} -v ${publishInfo.pbVersion} -d ${publishInfo.pbDesc}`
  if (shell.exec(pbCommand, { silent: true }).code !== 0) {
    spinner.fail(`*** 发布失败 ***\n`)
    shell.exit(1)
  }
  spinner.succeed(`*** ${publishInfo.pbEnv}环境发布成功 ***\n`)
  // 记录日志
  const logInfo = `### ${moment().format('YYYY-MM-DD HH:mm:ss')}
  - 发布环境: ${publishInfo.pbEnv}
  - appid: ${appid}
  - 发布版本: ${publishInfo.pbVersion}
  - 发布描述: ${publishInfo.pbDesc}
  `
  logger.log(logInfo)
  console.log(
    symbols.info,
    chalk.green(`进入文件查看日志: ${sayaPosition}/log/pbsx.log\n`)
  )
}

// 根据发布信息修改文件内容
export const editFile = async (): Promise<void> => {
  const spinner = ora(`发布信息准备中...\n`)
  spinner.start()
  if (proName === 'store-mina') {
    // 修改config.js中第一行的环境变量
    const editEnvCommand = `sed -i '' "1s/'.*'/'${publishInfo.pbEnv}'/g" ${sayaPosition}/${proName}/config.js`
    if (shell.exec(editEnvCommand, { silent: true }).code !== 0) {
      spinner.fail(`*** 发布信息准备失败 ***\n`)
      shell.exit(1)
    }
    // 修改project.config.json中第36行的appid
    const editAppidCommand = `sed -i '' '36s/"wx.*"/"${appid}"/g' ${sayaPosition}/${proName}/project.config.json`
    if (shell.exec(editAppidCommand, { silent: true }).code !== 0) {
      spinner.fail(`*** 发布信息准备失败 ***\n`)
      shell.exit(1)
    }
    spinner.succeed(`*** 发布信息准备成功 ***\n`)
    // 接入小程序cli发布
    publishSmallx()
  } else {
    spinner.fail(`*** 发布信息准备失败，不存在该项目 ***\n`)
  }
}

// 获取要发布的信息：环境，版本号，描述 并 向用户确认 环境，版本号，描述，appid
export const getPublishInfo = async (): Promise<void> => {
  try {
    const pbInfoAnswers = await inquirer.prompt(pbInfoInquire)
    publishInfo = { ...publishInfo, ...pbInfoAnswers }
    // 向用户确认发布信息
    // 映射appid在确认信息中增加
    appid = appidObj[publishInfo.pbEnv]
    /* shell.echo(
      `您在分支 ${publishBranchName} 的发布信息如下:\n
      发布环境: ${publishInfo.pbEnv}\n
      appid: ${appid}\n
      版本号: ${publishInfo.pbVersion}\n
      发布描述: ${publishInfo.pbDesc}\n`
    ) */
    console.log(
      symbols.info,
      chalk.green(
        `您在分支 ${publishBranchName} 的发布信息如下:\n
        发布环境: ${publishInfo.pbEnv}\n
        appid: ${appid}\n
        版本号: ${publishInfo.pbVersion}\n
        发布描述: ${publishInfo.pbDesc}\n`
      )
    )
    // 询问是否确定
    try {
      const checkInfoAnswers = await inquirer.prompt(checkInfoInquire)
      const { checkInfo } = checkInfoAnswers
      if (checkInfo) {
        // 根据发布信息修改文件内容
        editFile()
      } else {
        // 重新输入发布信息
        getPublishInfo()
      }
    } catch (err) {
      console.log(symbols.error, chalk.red(`*** 运行出错 ***:\n ${err}\n`))
    }
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

// 询问分支选择
export const getSecBranch = async (branchArr: any[]): Promise<void> => {
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
    // 确认发布分支
    try {
      console.log(
        symbols.info,
        chalk.green(`发布分支为: ${publishBranchName}\n`)
      )
      const checkBranchAnswers = await inquirer.prompt(checkBranchInquire)
      const { checkBranch } = checkBranchAnswers
      if (checkBranch) {
        // 切换至要发布的分支
        checkoutBranch()
      } else {
        // 重新询问分支选择
        getSecBranch(branchArr)
      }
    } catch (err) {
      console.log(symbols.error, chalk.red(`*** 运行出错 ***:\n ${err}\n`))
    }
  } catch (err) {
    console.log(symbols.error, chalk.red(`*** 运行出错 ***:\n ${err}\n`))
  }
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
  // 询问分支选择
  getSecBranch(branchArr)
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
  const file = `${sayaPosition}/log/pbsx.log`
  fs.ensureFileSync(file)
  shell.echo(`请打开微信开发者工具服务端口：设置-->安全设置-->服务端口\n`)
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
/* export const getServePort = async (): Promise<void> => {
  shell.echo(
    `请打开微信开发者工具-->设置-->安全设置-->服务端口, 并记下端口号\n`
  )
  try {
    // 获取服务端口号
    const portAnswers = await inquirer.prompt(portInquire)
    servePort = portAnswers.servePort
    // 选择要发布的小程序
    getProject()
  } catch (err) {
    console.log(symbols.error, chalk.red(`*** 运行出错 ***:\n ${err}\n`))
  }
} */

/* 打开微信开发者工具 */
/* export const openWechatDev = async (): Promise<void> => {
  const spinner = ora(`即将打开微信开发者工具...\n`)
  spinner.start()
  const openWechatDev = `${XCli} open`
  if (shell.exec(openWechatDev).code !== 0) {
    spinner.fail('*** 打开微信开发者工具失败 ***')
    shell.exit(1)
  }
  spinner.succeed('*** 打开微信开发者工具成功 ***')
  getServePort()
} */
