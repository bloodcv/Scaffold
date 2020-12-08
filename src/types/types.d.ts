declare module 'download-git-repo' {
	namespace download {
		interface Options {
			clone: boolean
		}
	}
	function download(
		direct: string,
		targeName: string,
		options: download.Options,
		callback: (err: Error) => void
	): void
	export = download
}

declare namespace UserSrch {
	interface Answers {
		'Project name': string
		description: string
		author: string
		'language type': string
	}
}
