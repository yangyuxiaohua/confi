/**
 *  cad 地图
 */
import req from '@/utils/request'
// 给楼层图绑定一个设备位置
export const addFloorDevice = params => req.post('/cad/addFloorDevice', params)
// 给楼层图删除一个设备位置
export const deletedFloorDevice = params => req.post('/cad/deletedFloorDevice', params)
// 查询指定楼层所有设备位置(包含设备名称)
export const listFloorDevice = params => req.post('/cad/listFloorDevice', params)
// 给楼层图更新一个设备位置
export const updateFloorDevice = params => req.post('/cad/updateFloorDevice', params)