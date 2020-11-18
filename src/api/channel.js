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
