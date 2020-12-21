import request from '@/utils/request'

export function getapplyList(params) {
  return request({
    url: 'apply/applyList', // 获取表单列表
    method: 'get',
    params
  })
}

export function PostResetApply(data) {
  return request({
    url: 'apply/resetApply', // 二次分配
    method: 'post',
    data
  })
}

export function PostsubmitApply(data) {
  return request({
    url: 'apply/submitApply', // 批量操作
    method: 'post',
    data
  })
}

export function getPhones(params) {
  return request({
    url: 'apply/getPhones', // 获取可选号码
    method: 'get',
    params
  })
}

export function PostpreemptPhone(data) {
  return request({
    url: 'apply/preemptPhone', // 手动预占号码
    method: 'post',
    data
  })
}
