import request from '@/utils/request'

export function getcostList(params) {
  return request({
    url: 'statistics/costList', // 投放成本列表
    method: 'get',
    params
  })
}

export function getCostCount(params) {
  return request({
    url: 'statistics/getCostCount', // 成本统计
    method: 'get',
    params
  })
}

export function getOrderCount(params) {
  return request({
    url: 'statistics/getOrderCount', // 单量统计
    method: 'get',
    params
  })
}

export function PostSubmitCost(data) {
  return request({
    url: 'statistics/submitCost', // 投放成本列表
    method: 'POST',
    data
  })
}

export function getRollbackCost(params) {
  return request({
    url: 'statistics/rollbackCost', // 撤回投放成本
    method: 'get',
    params
  })
}

