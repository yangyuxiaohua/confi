/**
 *  区域列表接口
 */

import req from '@/utils/request'

// 按照用户主键 - 查询业主单位区域列表
export const listSelfFactoryRegionalByUserId = params => req.get ('/regional/listSelfFactoryRegionalByUserId',params)
// 超级管理员 - 查询区域列表
export const listRegional = params => req.get ('/regional/listRegional',params)
// 按照用户主键和系统标识 - 查询业主单位区域列表
export const listSelfFactoryRegionalByUserSystem = params => req.get ('/regional/listSelfFactoryRegionalByUserSystem',params)

