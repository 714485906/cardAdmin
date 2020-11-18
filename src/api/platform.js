import request from '@/utils/request'

export function getPlatformList(params) {
  return request({
    url: 'platform/platformList', // 平台列表
    method: 'get',
    params
  })
}

export function PostCreatePlatform(data) {
  return request({
    url: 'platform/createPlatform', // 创建平台
    method: 'post',
    data
  })
}

export function PostModifyPlatform(data) {
  return request({
    url: 'platform/modifyPlatform', // 修改平台
    method: 'post',
    data
  })
}
