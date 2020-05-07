/**
 *  百度地图
 */
import req from '@/utils/request'
// 添加一个站点位置
export const addArea = params => req.post('/area/addArea', params)
// 删除一个站点位置
export const deletedArea = params => req.post('/area/deletedArea', params)
// 修改一个站点位置
export const updateArea = params => req.post('/area/updateArea', params)
// 添加一块分区
export const addAreaBuild = params => req.post('/area/building/addAreaBuild', params)
// 删除一块分区
export const deletedAreaBuild = params => req.post('/area/building/deletedAreaBuild', params)
// 修改一块分区
export const updateAreaBuild = params => req.post('/area/building/updateAreaBuild', params)
// 添加一栋楼
export const addBuild = params => req.post('/building/addBuild', params)
// 删除一栋楼
export const deletedBuild = params => req.post('/building/deletedBuild', params)
// 修改一栋楼
export const updateBuild = params => req.post('/building/updateBuild', params)
// 添加一层楼
export const addFloor = params => req.post('/floor/addFloor', params)
// 删除一层楼
export const deletedFloor = params => req.post('/floor/deletedFloor', params)
// 修改一层楼
export const updateFloor = params => req.post('/floor/updateFloor', params)
