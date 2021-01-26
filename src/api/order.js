import request from '@/utils/request'

export function getorderList(params) {
  return request({
    url: 'order/orderList', // 订单列表
    method: 'get',
    params
  })
}

export function getOrderDetails(params) {
  return request({
    url: 'order/getOrderDetails', // 获取订单详情
    method: 'get',
    params
  })
}

export function getOrder(params) {
  return request({
    url: 'order/getOrder', // 查询单个订单
    method: 'get',
    params
  })
}
