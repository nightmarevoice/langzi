import request from '@/utils/request'

/**
 * 示例 API 接口
 */

// 获取用户信息
export function getUserInfo(userId) {
  return request({
    url: `/user/${userId}`,
    method: 'get'
  })
}

// 用户登录
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 获取列表数据
export function getList(params) {
  return request({
    url: '/list',
    method: 'get',
    params
  })
}

// 提交表单
export function submitForm(data) {
  return request({
    url: '/form/submit',
    method: 'post',
    data
  })
}

// 上传文件
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url: '/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

