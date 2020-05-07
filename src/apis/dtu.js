/**
 *  dtu
 */
import req from '@/utils/request'
//获取dtu列表
export const getDtuList = params => req.post('/iot/device/listIotDevices', params)
// 新建
export const addDtu = params => req.post('/iot/device/addDeviceConfig', params)
//修改
export const modifyDtu = params => req.post('/iot/device/updateDeviceConfig', params)
//删除dtu配置
export const deleteDtu = params => req.get('/iot/device/deletedDeviceConfig', params)