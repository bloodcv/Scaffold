#!/usr/bin/env node
import { openWechatDev } from './methods'

// name是要创建的项目名称
module.exports = () => {
  /* 打开微信开发者工具 */
  openWechatDev()
}
