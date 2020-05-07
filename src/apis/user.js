/**
 *  用 户
 */

import req from '@/utils/request'

//添加用户
export const addUser = params => req.post ('/user/addUser',params,'json')
// 获取项目列表 查询 单个用户站点权限 （指定站点 和 指定单位） 授权
export const getProjects = params =>req.get('/user/listSelfAllSitesByFactory',params)

// 更新操作 -> 查询 单个用户 及 权限 （站点、角色）
export const getUserInfor = params =>req.get('/user/getUser',params)

// 分页查询用户
export const getlistUsers = params => req.post ('/user/pageUsers',params)

// 删除用户及（站点+角色）权限
export const deletedUser = params =>req.get('/user/deletedUser',params)

// 更新操作时 - 删除一个角色
export const deletedUserRole = params =>req.get('/user/deletedUserRole',params)
// 更新操作时 - 添加一个角色
export const addUserRole = params =>req.post('/user/addUserRole',params)
// 更新操作时 - 添加一个站点授权
export const addUserSite = params => req.post ('/user/addUserSite',params)
// 更新操作时 - 删除一个站点授权
export const deletedUserSite = params =>req.get('/user/deletedUserSite',params)
// 修改用户信息
export const updateUser = params => req.post ('/user/updateUser',params)

// 分页查询用户 -> 所属业主单位权限（指定单位）
export const pageSelfAllSitesByFactory = params =>req.get('/user/pageSelfAllSitesByFactory',params)