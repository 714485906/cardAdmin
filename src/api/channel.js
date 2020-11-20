import request from '@/utils/request'

export function getChannelList(params) {
  return request({
    url: 'channel/channelList', // 渠道列表
    method: 'get',
    params
  })
}

export function PostcreateChannel(data) {
  return request({
    url: 'channel/createChannel', // 创建渠道
    method: 'post',
    data
  })
}
export function PostModifyChannel(data) {
  return request({
    url: 'channel/modifyChannel', // 修改渠道
    method: 'post',
    data
  })
}
export function getgetAccounts(params) {
  return request({
    url: 'channel/getAccounts', // 渠道账号列表
    method: 'get',
    params
  })
}

export function PostCreateAccount(data) {
  return request({
    url: 'channel/createAccount', // 创建渠道账号
    method: 'post',
    data
  })
}

export function PostModifyAccount(data) {
  return request({
    url: 'channel/modifyAccount', // 创建渠道账号
    method: 'post',
    data
  })
}
