#!/usr/bin/env node
import { getProject } from './methods'

module.exports = () => {
  // 获取要发布的小程序项目名称
  getProject()
}
