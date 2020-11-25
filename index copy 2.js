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
program.version(JSON.parse(content).version, '-v, --version')
	.command('init <name>')
	.action((name) => {
		if (!fs.existsSync(name)) {
			inquirer.prompt([
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
			]).then((answers) => {
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
			})
		} else {
			// 错误提示项目已存在，避免覆盖原有项目
			console.log(symbols.error, chalk.red('项目已存在'));
		}
	})
program.parse(process.argv);

const runProject = () => {

}