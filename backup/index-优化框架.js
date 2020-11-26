#!/usr/bin/env node
const shell = require('shelljs');
const fs = require('fs-extra');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const content = fs.readFileSync('template/package.json').toString();

const runProject = async (name) => {
	try {
		const answers = await inquirer.prompt([
			{
				type: 'input',
				name: 'description',
				message: '请输入项目描述'
			},
			{
				type: 'input',
				name: 'author',
				message: '请输入作者名称'
			},
			{
				type: 'input',
				message: '请输入版本号',
				name: 'version',
				default: "1.0.0"
			}
		])
		initProject(name, answers);
	} catch (err) {
		console.log(symbols.error, chalk.red(`*** 运行出错 ***: ${err}`));
	}
}

const installAct = async (name) => {
	try {
		const installAnswers = await inquirer.prompt([{
			type: "confirm",
			message: `是否执行install?`,
			name: "install",
		}])
		if (installAnswers.install) {
			try {
				const answers = await inquirer.prompt([{
					type: 'list',
					message: '请选择执行方式:',
					name: 'type',
					choices: [
						'npm',
						'cnpm',
						'yarn'
					]
				}])
				shell.cd(name)
				shell.exec('ls')
				let code = answers.type;
				if (answers.type === 'npm' || answers.type === 'cnpm') {
					code += ' install'
				}
				if (shell.exec(code).code !== 0) {
					console.log(symbols.error, chalk.red(`*** 运行出错 ***`));
					shell.exit(1);
				} else {
					shell.cd('..');
				}
			} catch (err) {
				console.log(symbols.error, chalk.red(`*** 运行出错 ***: ${err}`));
			}
		}
	} catch (err) {
		console.log(symbols.error, chalk.red(`*** 运行出错 ***: ${err}`));
	}
}

const initProject = (name, answers) => {
	const spinner = ora(`正在创建 ${name}...`);
	spinner.start();
	// 从git拉取模版项目
	download('https://github.com:bloodcv/Scaffold#vue3', name, { clone: true }, (err) => {
		if (err) {
			spinner.fail();
			console.log(symbols.error, chalk.red(`*** 运行出错 ***: ${err}`));
		} else {
			const fileName = `${name}/package-init.json`;
			const meta = { name, ...answers }
			if (fs.existsSync(fileName)) { // 初始化package-init存在
				const content = fs.readFileSync(fileName).toString();
				const result = handlebars.compile(content)(meta);
				// 初始化package-init覆盖package
				console.log(`${name}/package.json`)
				fs.copy(fileName, `${name}/package.json`)
					.then(() => {
						// 修改package
						try {
							fs.writeFileSync(`${name}/package.json`, result)
							// 删除package-init
							fs.remove(fileName)
								.then(() => {
									spinner.succeed();
									console.log(symbols.success, chalk.green('项目初始化完成'));
									// 是否执行install
									installAct(name);
								})
						} catch (err) {
							spinner.fail('*** 创建失败 ***');
							console.error(err)
						}
					}).catch(err => {
						spinner.fail('*** 创建失败 ***');
						console.error(err)
					});
			} else {  // 初始化package-init不存在
				spinner.fail('*** 创建失败 ***');
				console.log(symbols.error, chalk.red(`*** 创建失败 ***`));
			}
		}
	})
}

program.version(JSON.parse(content).version, '-v, --version')
	.command('init <name>')
	.action(async (name) => {
		// 项目存在
		if (fs.existsSync(name)) {
			try {
				const answers = await inquirer.prompt([{
					type: "confirm",
					message: `是否删除项目 ${name} 并重建?`,
					name: "reCreate",
					prefix: "项目已存在"
				}])
				// 删除项目并重建
				if (answers.reCreate) {
					fs.remove(`${name}`)
						.then(() => {
							console.log(symbols.success, chalk.blue('*** 删除完成 ***'));
							runProject(name);
						})
						.catch(err => console.log(symbols.error, chalk.red(`*** 删除失败 ***: ${err}`)));
				} else {
					console.log(symbols.success, chalk.blue('*** 已退出 ***'));
				}
			} catch (err) {
				console.log(symbols.error, chalk.red(`*** 运行出错 ***: ${err}`));
			}
		} else { // 项目不存在
			runProject(name);
		}
	})
program.parse(process.argv);

