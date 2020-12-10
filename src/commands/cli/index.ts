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

// name是要创建的项目名称
module.exports = (name: string) => {
	// 项目存在
	if (fs.existsSync(name)) {
		hasPro(name)
	} else {
		// 项目不存在
		runProject(name)
	}
}
