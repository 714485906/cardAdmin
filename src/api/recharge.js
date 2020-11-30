import request from '@/utils/request'

export function getRechargeList(params) {
  return request({
    url: 'recharge/rechargeList', // 充值明细列表
    method: 'get',
    params
  })
}

export function PostCreateRecharge(data) {
  return request({
    url: 'recharge/createRecharge', // 添加充值明细
    method: 'post',
    data
  })
}
