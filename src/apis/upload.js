/**
 *  dtu
 */
import req from '@/utils/request'

//文件上传
export const upload = params => req.post('/upload', params)

export const ip = 'http://192.168.0.200:2221/upload'
export const imgIp = 'http://192.168.0.200:2221/image?url='

// 新增图标
export const addIcon = params => req.post('/deviceTypeIcon/add', params)
// 删除一个图标
export const deletedIcon = params => req.get('deviceTypeIcon/deleted', params)
// 查询所有图标
export const listIcon = params => req.post('/deviceTypeIcon/list', params)
// 修改一个图标
export const updateIcon = params => req.post('/deviceTypeIcon/update', params)
// 分组查询所有图标
export const listNormalIcons = params => req.post('deviceTypeIcon/listNormalIcons', params)
