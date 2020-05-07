/**
 * 资源
 */

import req from '@/utils/request'
// 1增加资源
export const addResource = params => req.post('/resource/addResource', params)
//获取资源类表
export const getResource = params =>req.post('/resource/listResourceIncludeUnable',params)
//删除一个资源
export const deleteResource = params =>req.post('/resource/deletedResource',params)
//修改资源
export const modifyResource = params => req.post('/resource/updateResource',params)
// 2获取账号列表
// export const getAccountList = params => req.get('/account/accountlist', params)