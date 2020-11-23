import request from '@/utils/request'

export function getLandingList(params) {
  return request({
    url: 'landing/landingList', // 落地页列表
    method: 'get',
    params
  })
}

export function PostCreateLanding(data) {
  return request({
    url: 'landing/createLanding', // 创建落地页
    method: 'post',
    data
  })
}

export function PostModifyLanding(data) {
  return request({
    url: 'landing/modifyLanding', // 修改落地页
    method: 'post',
    data
  })
}
