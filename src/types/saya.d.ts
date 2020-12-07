declare namespace SayaSpace {
	interface InitInquire {
		type: string
		name: string
		message: string
		default?: string
	}
	interface InitAnswer {
		description: string
		author: string
		version: string
	}
}
