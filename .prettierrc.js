module.exports = {
	// 换行长度，默认80
	// 出于代码的可读性，我们不推荐（单行）超过80个字符的coding方式。
	printWidth: 80,
	// tab缩进大小,默认为2
	tabWidth: 2,
	// 使用tab缩进，默认false
	useTabs: true,
	// 每行末尾自动添加分号, 默认true
	semi: false,
	// 字符串使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
	singleQuote: true,
	// 行尾逗号,默认none,可选 none|es5|all
	// es5 包括es5中的数组、对象
	// all 包括函数对象等所有可选
	TrailingCooma: 'all',
	// 对象中的空格 默认true
	// true: { foo: bar }
	// false: {foo: bar}
	bracketSpacing: true,
	// 箭头函数参数括号 默认avoid 可选 avoid| always
	// avoid 能省略括号的时候就省略 例如x => x
	// always 总是有括号
	arrowParens: 'avoid',
	// 末尾不需要逗号
	trailingComma: 'none'
}
