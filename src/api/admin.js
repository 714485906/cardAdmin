import request from '@/utils/request'

export function getRoleList(params) {
  return request({
    url: 'role/roleList', // 获取角色列表
    method: 'get',
    params
  })
}
export function getgetPrivileges(params) {
  return request({
    url: 'role/getPrivileges', // 获取权限列表
    method: 'get',
    params
  })
}

export function getCreateRole(data) {
  return request({
    url: 'role/createRole', // 添加角色
    method: 'post',
    data
  })
}
export function getModifyRole(data) {
  return request({
    url: 'role/modifyRole', // 修改
    method: 'post',
    data
  })
}

export function getDeleteRole(id) {
  return request({
    url: 'role/deleteRole?roleId=' + id, // 删除角色
    method: 'delete'
  })
}
