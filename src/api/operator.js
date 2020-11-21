import request from '@/utils/request'

export function getOperatorList(params) {
  return request({
    url: 'operator/operatorList', // 运营商列表
    method: 'get',
    params
  })
}
export function PostCreateOperator(data) {
  return request({
    url: 'operator/createOperator', // 创建运营商
    method: 'post',
    data
  })
}

export function PostModifyOperator(data) {
  return request({
    url: 'operator/modifyOperator', // 修改运营商
    method: 'post',
    data
  })
}

export function getGetTouches(params) {
  return request({
    url: 'operator/getTouches', // 触点码列表
    method: 'get',
    params
  })
}

export function PostcreateTouch(operatorId, data) {
  return request({
    url: 'operator/createTouch?operatorId=' + operatorId + '', // 创建触点码
    method: 'post',
    data
  })
}

export function PostModifyTouch(data) {
  return request({
    url: 'operator/modifyTouch', // 修改触点码
    method: 'post',
    data
  })
}

