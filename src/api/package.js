import request from '@/utils/request'

export function getpackageList(params) {
  return request({
    url: 'package/packageList', // 打包(同步)列表
    method: 'get',
    params
  })
}

export function PostCreatePackage(data) {
  return request({
    url: 'package/createPackage', //  表单打包
    method: 'post',
    data
  })
}
