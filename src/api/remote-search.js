import request from '@/utils/request'

// export function searchUser(name) {
//   return request({
//     url: '/vue-element-admin/search/user',
//     method: 'get',
//     params: { name }
//   })
// }
//
export function transactionList(query) { // 单量统计
  return request({
    url: 'statistics/getOrderCount',
    method: 'get',
    params: query
  })
}

export function getOrderCountByHour(params) {
  return request({
    url: 'statistics/getOrderCountByHour', // 按小时统计单量
    method: 'get',
    params
  })
}

export function getOrderCountByDay(params) {
  return request({
    url: 'statistics/getOrderCountByDay', //按天统计单量
    method: 'get',
    params
  })
}
