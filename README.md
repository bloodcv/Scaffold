# Scaffold
脚手架项目
npm下是脚手架脚本
其他对应分支下是相应的模版

### npmts 基础架构
- src	(ts代码文件)
	- bin	(程序入口文件)
		- main.js
	- commands	(程序逻辑文件)
		- init.js
	- config	(项目共用变量)
		- setting.ts
	- types	(存储声明文件)
		- downloads.d.ts

### 提交类型

| 提交类型 | 别名 | 描述 |
| ------ | --- | --- |
| feat   | f   | 添加新功能 |
| fix    | x   | 错误修复 |
| style  | s   | 样式修改、格式化等 |
| refactor | r | 代码重构相关 |
| perf   | p   | 性能优化相关 |
| test   | t   | 测试相关 |
| docs   | d   | 文档相关 |
| merge  | mg  | 分支合并 |
| revert | rv  | 分支还原 |
| build  | b   | 项目构建相关 |
| chore  | c   | 与构建配置相关 |
| other  | o   | 其他修改 |