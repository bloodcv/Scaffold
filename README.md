# Scaffold

### 脚手架项目

- ##### npm 下是脚手架脚本
- ##### 其他对应分支下是相应的模版
- ##### 各分支说明

| 分支 | 描述 | 包含 |
| - | - | - |
| master | 主分支 | - |
| npm | js脚手架脚本 | cli |
| npmts | ts脚手架脚本 | cli、qtest |
| vue3 | vue3项目模版 | vue3项目模版 |
| pbsx | ts-小程序发布脚本 | cli、qtest、pbsx |

---

### npmts 基础架构

    ```
    ├─ .vscode
    │  └─ settings.json
    ├─ src (ts代码文件)
    │  ├─ bin (程序入口文件)
    │  │  └─ main.ts
    │  ├─ commands (程序逻辑文件)
    │  │  ├─ cli (脚本名)
    │  │  │  ├─ index.ts (脚本主执行文件)
    │  │  │  ├─ inquirer.ts (脚本命令行询问声明文件)
    │  │  │  └─ methods.ts (脚本内使用方法)
    │  │  └─ ... (脚本名)
    │  │     └─ index.ts (脚本主执行文件)
    │  │     └─ inquirer.ts (脚本命令行询问声明文件)
    │  │     └─ methods.ts  (脚本内使用方法)
    │  ├─ config (项目共用变量)
    │  │  └─ setting.ts
    │  └─ types (存储声明文件)
    │     ├─ **.d.ts
    │     └─ types.d.ts
    ├─ .editorconfig
    ├─ .eslintignore
    ├─ .eslintrc.js
    ├─ .gitignore
    ├─ .prettierrc.js
    ├─ package.json
    ├─ tsconfig.json
    ├─ tslint.json
    └─ yarn.lock
    ├─ README.md
    ```
---

### 提交类型

| 提交类型 | 别名 | 描述               |
| -------- | ---- | ------------------ |
| feat     | f    | 添加新功能         |
| fix      | x    | 错误修复           |
| style    | s    | 样式修改、格式化等 |
| refactor | r    | 代码重构相关       |
| perf     | p    | 性能优化相关       |
| test     | t    | 测试相关           |
| docs     | d    | 文档相关           |
| merge    | mg   | 分支合并           |
| revert   | rv   | 分支还原           |
| build    | b    | 项目构建相关       |
| chore    | c    | 与构建配置相关     |
| other    | o    | 其他修改           |

---
