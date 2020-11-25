#!/usr/bin/env node
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
			}
		])
		initProject(name, answers);
	} catch (err) {
		console.log(symbols.error, chalk.red(`*** 运行出错 ***: ${err}`));
	}
}

const initProject = (name, answers) => {
	const spinner = ora(`正在创建 ${name}...`);
	spinner.start();
	const fileName = `${name}/package.json`;
	const meta = {name, ...answers}
	const result = handlebars.compile(content)(meta);
	fs.copy('template/package.json', `${name}/package.json`)
	.then(() => fs.writeFileSync(fileName, result))
	.catch(err => console.error(err))
	spinner.succeed(`创建 ${name} 成功`);
	console.log(symbols.success, chalk.green('项目初始化完成'));	
}

program.version(JSON.parse(content).version, '-v, --version')
	.command('init <name>')
	.action(async (name) => {
		// 项目存在
		if(fs.existsSync(name)) {
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

