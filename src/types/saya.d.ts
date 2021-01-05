declare namespace SayaSpace {
  interface InitInquire {
    type: string
    name: string
    message: string
    default?: string
    choices?: any[]
    validate?: (val: string) => string | boolean
  }
  interface InitAnswer {
    description: string
    author: string
    version: string
  }
}
