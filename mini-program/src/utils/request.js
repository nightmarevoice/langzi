// uniapp 请求封装
const request = (options) => {
  return new Promise((resolve, reject) => {
    // 默认配置
    const defaultOptions = {
      timeout: 10000,
      header: {
        'Content-Type': 'application/json'
      }
    }

    // 合并配置
    const config = { ...defaultOptions, ...options }

    // 添加基础URL
    if (!config.url.startsWith('http')) {
      config.url = (process.env.VUE_APP_API_BASE_URL || 'https://api.example.com') + config.url
    }

    // 添加 token
    const token = uni.getStorageSync('token')
    if (token) {
      config.header = {
        ...config.header,
        'Authorization': `Bearer ${token}`
      }
    }

    // 发送请求
    uni.request({
      ...config,
      success: (res) => {
        const { statusCode, data } = res

        if (statusCode >= 200 && statusCode < 300) {
          // 根据实际业务调整
          if (data.code !== 200) {
            console.error('接口错误：', data.message)
            reject(new Error(data.message || '请求失败'))
            return
          }

          resolve(data)
        } else {
          // HTTP 错误处理
          switch (statusCode) {
            case 401:
              console.log('未授权，请登录')
              uni.navigateTo({ url: '/pages/login' })
              break
            case 403:
              console.log('拒绝访问')
              break
            case 404:
              console.log('请求的资源不存在')
              break
            case 500:
              console.log('服务器错误')
              break
            default:
              console.log('网络错误')
          }
          reject(new Error(`HTTP ${statusCode} 错误`))
        }
      },
      fail: (err) => {
        console.error('请求失败：', err)
        reject(err)
      }
    })
  })
}

// 便捷方法
request.get = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  })
}

request.post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

request.put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

request.delete = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  })
}

export default request

