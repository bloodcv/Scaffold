// 程序主逻辑文件

import * as chalk from "chalk";
import command = require("commander");
import download = require("download-git-repo");
import * as fs from "fs";
import * as inquirer from "inquirer";
import ora = require("ora");
import * as path from "path";

import { branchNodeConf, branchPythonConf, branchTypescriptConf, url, Answers } from "../config/setting";

const spinner = ora("Downloading please wait......");
const option: string = command.parse(process.argv).args[0];
const defaultName: string = typeof option === "string" ? option : "My-project";
const questionList: any[] = [
    {
        type: "input",
        name: "Project name",
        message: "Project name",
        default: defaultName,
        filter(val: string): string {
          return val.trim();
        },
        validate(val: string): any {
          const validate = (val.trim().split(" ")).length === 1;
          return validate || "Project name is not allowed to have spaces ";
        },
        transformer(val: string): string {
          return chalk.default(val);
        }
    },
    {
        type: "input",
        name: "description",
        message: "Project description",
        default: "My project",
        validate(val: string): boolean {
          return true;
        },
        transformer(val: string): string {
          return chalk.default(val);
        }
      },
    {
        type: "input",
        name: "author",
        message: "Author",
        default: "project author",
        validate(val: string): boolean {
          return true;
        },
        transformer(val: string): string {
          return chalk.default(val);
        }
      },
    {
        type: "list",
        name: "language type",
        message: "language type",
        choices: [
            "Nodejs",
            "Typescript",
            "Python"
        ],
        default: "nodejs",
        filter: function(val: string): string {
            return val.toLowerCase();
        }
    }
];

// ts的泛型(重点了解)
inquirer.prompt<Answers>(questionList).then(answers => {
    const answer = answers["Project name"];
    const type = answers["language type"];
    if (type === "nodejs") {
        spinner.start();
        download(url + branchNodeConf, answer,  { clone: true }, (err) => {
          if (err) {
              spinner.stop();
              console.log(err);
          } else {
              spinner.stop();
              console.log(chalk.default("项目初始化成功"));
          }
      });
      } else if (type === "typescript") {
        spinner.start();
        download(url + branchTypescriptConf, answer, { clone: true }, (err) => {
          if (err) {
              spinner.stop();
              console.log(err);
          } else {
              spinner.stop();
              console.log(chalk.default("项目初始化成功"));
          }
      });
      } else {
        spinner.start();
        download(url + branchPythonConf, answer, { clone: true }, (err) => {
          if (err) {
              spinner.stop();
              console.log(err);
          } else {
              spinner.stop();
              console.log(chalk.default("项目初始化成功"));
          }
      });
      }
  });