import request from '@/utils/request'

export function getProductList(params) {
  return request({
    url: 'product/productList', // 商品列表
    method: 'get',
    params
  })
}

export function PostCreateProduct(data) {
  return request({
    url: 'product/createProduct', // 添加商品
    method: 'post',
    data
  })
}
export function PostmodifyProduct(data) {
  return request({
    url: 'product/modifyProduct', // 修改商品信息
    method: 'post',
    data
  })
}
export function getproductTemplateList(params) {
  return request({
    url: 'product/productTemplateList', // 商品模板列表
    method: 'get',
    params
  })
}

export function PostCreateProductTemplate(data) {
  return request({
    url: 'product/createProductTemplate', // 添加商品模板
    method: 'post',
    data
  })
}

export function PostModifyProductTemplate(data) {
  return request({
    url: 'product/modifyProductTemplate', // 修改商品模板
    method: 'post',
    data
  })
}
