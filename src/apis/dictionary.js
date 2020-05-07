/**
 *  字典
 */
import req from '@/utils/request'
// 添加一个字典
export const addDictionary = params => req.post('/dictionary/addDictionary', params)
// 删除一个字典
export const deletedDictionary = params => req.get('/dictionary/deletedDictionary', params)
// 开启一个字典
export const enableDictionary = params => req.get('/dictionary/enableDictionary', params)
// 关闭一个字典
export const unableDictionary = params => req.get('/dictionary/unableDictionary', params)
// 查询一批字典
export const listDictionary = params => req.post('/dictionary/listDictionary', params)
// 更新一个字典
export const updateDictionary = params => req.post('/dictionary/updateDictionary', params)
