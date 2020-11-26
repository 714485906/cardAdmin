import request from '@/utils/request'

// 角色服务
export function getapplyList(params) {
  return request({
    url: 'apply/applyList', // 获取表单列表
    method: 'get',
    params
  })
}
