interface Answers {
	'Project name': string
	description: string
	author: string
	'language type': string
}

const url =
	'direct:http://dev.kiwiinc.net/kiwi-team/mesh-backend-project-configs'
const branchNodeConf = '#node-conf'
const branchTypescriptConf = '#ts-conf'
const branchPythonConf = '#py-conf'

export { Answers, url, branchNodeConf, branchTypescriptConf, branchPythonConf }
