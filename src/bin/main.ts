#! /usr/bin/env node
import fs from 'fs-extra'
import command = require('commander')
import * as path from 'path'

process.env.NODE_PATH = __dirname + '/../node_modules'

const res = (command: string) =>
	path.resolve(__dirname, '../commands/', command)

command.version(
	JSON.parse(fs.readFileSync('package.json').toString()).version,
	'-v, --version'
)

command.usage('<command>')

command
	.command('init <name>')
	.description('Generate a new my project')
	.alias('i')
	.action((name: string) => {
		require(res('cli/index'))(name)
	})

command
	.command('qtest')
	.description('command test')
	.alias('qt')
	.action(() => {
		require(res('qtest/index'))
	})

command.parse(process.argv)

if (!command.args || !command.args.length) {
	command.help()
}
