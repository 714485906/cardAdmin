import request from '@/utils/request'

// 角色服务
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

export function getRolePrivilegeIds(params) {
  return request({
    url: 'role/getRolePrivilegeIds', // 根据roleId 获取权限列表
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
    url: 'role/modifyRole', // 修改角色
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

// 用户服务
export function getUserList(params) {
  return request({
    url: 'user/userList', // 获取用户列表
    method: 'get',
    params
  })
}
export function PostCreateUser(data) {
  return request({
    url: 'user/createUser', // 创建用户
    method: 'post',
    data
  })
}
export function PostModifyUser(data) {
  return request({
    url: 'user/modifyUser', // 修改用户资料
    method: 'post',
    data
  })
}
export function getGroupList(params) {
  return request({
    url: 'user/groupList', // 获取用户组
    method: 'get',
    params
  })
}
export function PostCreateGroup(name) {
  return request({
    url: 'user/createGroup?groupName=' + name, // 创建用户组
    method: 'post'
  })
}

export function getDeleteGroup(id) {
  return request({
    url: 'user/deleteGroup?groupId=' + id, // 删除用户组
    method: 'delete'
  })
}

export function PostModifyGroup(data) {
  return request({
    url: 'user/modifyGroup', // 编辑用户组
    method: 'post',
    data
  })
}
