/**
 *  单 位
 */

import req from '@/utils/request'

// 新增单位
export const addFactory = params => req.post('/factory/addFactory', params)
// 查询一个单位
export const getFactory = params => req.get('/factory/getFactory', params)
// 根据系统查询一批单位
export const getFactoryList = params => req.post('/factory/listFactory', params)
//修改单位
export const updateFactory = params => req.post('/factory/updateFactory',params)
//删除单位
export const deleteFactory = params => req.get('/factory/deletedFactory', params)
//新增区域
export const addFactorySite = params => req.post('/addFactorySite',params)
// 分页根据系统查询一批单位
export const pageFactory = params => req.post('/factory/pageFactory',params)
