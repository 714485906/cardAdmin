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
