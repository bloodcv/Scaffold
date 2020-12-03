#! /usr/bin/env node

process.env.NODE_PATH = __dirname + '/../node_modules'
import command = require('commander')
import * as path from 'path'

const res = (command: string) =>
	path.resolve(__dirname, '../commands/', command)

command.version('1.0.0')

command.usage('<command>')

command
	.command('init')
	.description('Generate a new my project')
	.alias('i')
	.action(() => {
		require(res('init'))
	})

command.parse(process.argv)

if (!command.args || !command.args.length) {
	command.help()
}
