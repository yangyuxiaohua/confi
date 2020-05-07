/**
 *  单位站点
 */
import req from '@/utils/request'
// 添加一个业主单位站点
export const addFactorySite = params => req.post('/addFactorySite',params)

// 删除一个业主单位站点
export const deletedFactorySite = params => req.get('/deletedFactorySite',params)

// 查询一个业主单位下的站点
export const getListFactorySite = params =>req.post('/listFactorySite',params)

// 修改一个业主单位站点
export const updateFactorySite = params =>req.post('/updateFactorySite',params)
// 分页查询一个业主单位下的站点
export const pageFactorySite = params =>req.post('/pageFactorySite',params)