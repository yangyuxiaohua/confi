/**
 *  设备
 */
import req from '@/utils/request'
// 添加单个设备
export const addEquipment = params=>req.post('/device/addDevice',params)
// 删除单个设备
export const deleteEquipment = params=>req.get('/device/deletedDevice',params)
// 修改单个设备
export const updateEquipment = params=>req.post('/device/updatedDevice',params)
//按照 用户授权站点 和 系统 查询 一批设备（系统级接口）
export const getListDeviceBySites = params=>req.post('/device/listDeviceBySites',params)
// 按照单位主键 或 系统 查询 一批设备（超级管理员接口）
export const getListDevices = params=>req.post('/device/listDevices',params)
// 分页按照单位主键 或 系统 查询 一批设备（超级管理员接口）
export const pageDevices = params=>req.post('/device/pageDevices',params)