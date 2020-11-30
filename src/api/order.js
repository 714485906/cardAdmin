import request from '@/utils/request'

// 角色服务
export function getorderList(params) {
  return request({
    url: 'order/orderList', // 获取角色列表
    method: 'get',
    params
  })
}
