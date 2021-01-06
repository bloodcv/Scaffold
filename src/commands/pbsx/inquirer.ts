import inquirer from 'inquirer'

export const portInquire: SayaSpace.InitInquire[] = [
  {
    type: 'input',
    message: '请输入端口号:',
    name: 'servePort',
    validate: (val: string): string | boolean => {
      if (val.match(/^[0-9]*$/g)) {
        // 校验只能是数字
        return true
      }
      return '请输入数字'
    }
  }
]

export const proInquire: SayaSpace.InitInquire[] = [
  {
    type: 'list',
    message: '请选择要发布的小程序',
    name: 'proName',
    choices: [
      // choices里可以有分隔符
      new inquirer.Separator(`*** 选项 ***`),
      'store-mina'
      // 可以是对象，name就是显示的字符串
      /* {
        name: 'store-?',
        disabled: '待开发'
      } */
    ]
  }
]

// 环境，版本号，描述
export const pbInfoInquire: SayaSpace.InitInquire[] = [
  {
    type: 'list',
    message: '请选择发布环境',
    name: 'pbEnv',
    choices: [
      // choices里可以有分隔符
      new inquirer.Separator(`*** 选项 ***`),
      'dev',
      'rc',
      'prod'
    ]
  },
  {
    type: 'input',
    message: '请输入版本号:',
    name: 'pbVersion',
    validate: (val: string): string | boolean => {
      if (val.match(/^([0-9]+\.)+[0-9]+$/g)) {
        // 校验位数
        return true
      }
      return '格式有误，示例：3.0.1; 4.5'
    }
  },
  {
    type: 'input',
    message: '请输入描述:',
    name: 'pbDesc',
    validate: (val: string): string | boolean => {
      if (val.match(/^\S+.*\S+$/g)) {
        // 校验位数
        return true
      }
      return '描述不能为空，不能空格结尾'
    }
  }
]

export const checkBranchInquire: SayaSpace.InitInquire[] = [
  {
    type: 'confirm',
    message: '确认发布分支?(Y:提交/N:重选)',
    name: 'checkBranch',
    default: true
  }
]

export const checkInfoInquire: SayaSpace.InitInquire[] = [
  {
    type: 'confirm',
    message: '确认提交?(Y:提交/N:重填)',
    name: 'checkInfo',
    default: true
  }
]
