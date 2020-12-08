#!/usr/bin/env node
import fs from 'fs-extra'
// import program from 'commander'
import { hasPro, runProject } from './methods'

/* program
	.version(
		JSON.parse(fs.readFileSync('package.json').toString()).version,
		'-v, --version'
	)
	.command('init <name>')
	.action(async name => {

	})
program.parse(process.argv) */

module.exports = (name: string) => {
	// 项目存在
	if (fs.existsSync(name)) {
		hasPro(name)
	} else {
		// 项目不存在
		runProject(name)
	}
}
