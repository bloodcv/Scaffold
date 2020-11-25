module.exports = {
  root: true, // 此项是用来告诉eslint找当前配置文件不能往父级查找
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended', // 此项是用来配置标准的js风格，就是说写代码的时候要规范的写，如果你使用vs-code我觉得应该可以避免出错
    '@vue/prettier'
  ],
  // 此项是用来指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
  parserOptions: {
    // 此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
    parser: 'babel-eslint'
  },
  // 下面这个配置是用来规范html的
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'indent': [2, 2], // 缩进2
    'comma-dangle': 1, // 对象字面量项尾不能有逗号
    'new-cap': 0, // 函数名首行大写必须使用new方式调用，首行小写必须用不带new方式调用
    'no-console': 1,// 禁止使用console
    'no-extra-semi': 1, // 禁止多余的冒号
    'no-new': 0, // 禁止在使用new构造一个实例后不赋值
    'no-undef': 1, // 不能有未定义的变量
    'quote-props': 0, // 属性名不限制
    'space-before-function-paren': [2, 'never'], // 函数定义时括号前面要不要有空格
    'semi': [2, 'never'], // 语句强制分号结尾
    'no-unused-expressions': 'off', // 禁止无用的表达式
    'generator-star-spacing': 'off', // 生成器函数*的前后空格
  }
}
