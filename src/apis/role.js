/**
 *  角色
 */

import req from '@/utils/request'

// 查询所有公共模板角色（只包含enable的）
export const getRoles = params => req.post('/role/template/listPublicRoleOnlyEnable', params)
// 查询所有公共模板角色（包含unable的）
export const listPublicRoleIncludeUnable = params => req.post('/role/template/listPublicRoleIncludeUnable', params)