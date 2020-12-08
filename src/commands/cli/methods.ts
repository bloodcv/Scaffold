import fs from 'fs-extra'
import shell from 'shelljs'
import download from 'download-git-repo'
import handlebars from 'handlebars'
import inquirer from 'inquirer'
import ora from 'ora'
import chalk from 'chalk'
import symbols from 'log-symbols'
import { initInquire } from './inquirer'

const installAct = async (name: string): Promise<any> => {
	try {
		const installAnswers = await inquirer.prompt([
			{
				type: 'confirm',
				message: `是否执行install?`,
				name: 'install'
			}
		])
		if (installAnswers.install) {
			try {
				const answers = await inquirer.prompt([
					{
						type: 'list',
						message: '请选择执行方式:',
						name: 'type',
						choices: ['npm', 'cnpm', 'yarn']
					}
				])
				shell.cd(name)
				shell.exec('ls')
				let code = answers.type
				if (answers.type === 'npm' || answers.type === 'cnpm') {
					code += ' install'
				}
				if (shell.exec(code).code !== 0) {
					console.log(symbols.error, chalk.red(`*** 运行出错 ***`))
					shell.exit(1)
				} else {
					// shell.cd('..')
				}
			} catch (err) {
				console.log(symbols.error, chalk.red(`*** 运行出错 ***: ${err}`))
			}
		}
	} catch (err) {
		console.log(symbols.error, chalk.red(`*** 运行出错 ***: ${err}`))
	}
}

const initProject = (name: string, answers: SayaSpace.InitAnswer): void => {
	const spinner = ora(`正在创建 ${name}...`)
	spinner.start()
	// 从git拉取模版项目
	download(
		'https://github.com:bloodcv/Scaffold#vue3',
		name,
		{ clone: true },
		err => {
			if (err) {
				spinner.fail()
				console.log(symbols.error, chalk.red(`*** 运行出错 ***: ${err}`))
			} else {
				const fileName = `${name}/package-init.json`
				const meta = { name, ...answers }
				if (fs.existsSync(fileName)) {
					// 初始化package-init存在
					const content = fs.readFileSync(fileName).toString()
					const result = handlebars.compile(content)(meta)
					// 初始化package-init覆盖package
					fs.copy(fileName, `${name}/package.json`)
						.then(() => {
							// 修改package
							try {
								fs.writeFileSync(`${name}/package.json`, result)
								// 删除package-init
								fs.remove(fileName).then(() => {
									spinner.succeed()
									console.log(symbols.success, chalk.green('项目初始化完成'))
									// 是否执行install
									installAct(name)
								})
							} catch (err) {
								spinner.fail('*** 创建失败 ***')
								console.error(err)
							}
						})
						.catch(err => {
							spinner.fail('*** 创建失败 ***')
							console.error(err)
						})
				} else {
					// 初始化package-init不存在
					spinner.fail('*** 创建失败 ***')
					console.log(symbols.error, chalk.red(`*** 创建失败 ***`))
				}
			}
		}
	)
}

// 项目不存在则运行创建
export const runProject = async (name: string): Promise<any> => {
	try {
		const answers = await inquirer.prompt<SayaSpace.InitAnswer>(initInquire)
		initProject(name, answers)
	} catch (err) {
		console.log(symbols.error, chalk.red(`*** 运行出错 ***: ${err}`))
	}
}

// 项目存在的时候
export const hasPro = async (name: string): Promise<any> => {
	try {
		const answers = await inquirer.prompt([
			{
				type: 'confirm',
				message: `是否删除项目 ${name} 并重建?`,
				name: 'reCreate',
				prefix: '项目已存在'
			}
		])
		// 删除项目并重建
		if (answers.reCreate) {
			fs.remove(`${name}`)
				.then(() => {
					console.log(symbols.success, chalk.blue('*** 删除完成 ***'))
					runProject(name)
				})
				.catch(err =>
					console.log(symbols.error, chalk.red(`*** 删除失败 ***: ${err}`))
				)
		} else {
			console.log(symbols.success, chalk.blue('*** 已退出 ***'))
		}
	} catch (err) {
		console.log(symbols.error, chalk.red(`*** 运行出错 ***: ${err}`))
	}
}
