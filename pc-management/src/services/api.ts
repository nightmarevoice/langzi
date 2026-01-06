import axios from 'axios'
import type {
  ApiResponse,
  PaginatedResponse,
  PaginatedData,
  ApiKey,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  Workflow,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  Prompt,
  CreatePromptRequest,
  UpdatePromptRequest,
  ModelParameter,
  CreateModelParameterRequest,
  UpdateModelParameterRequest,
  LLMProvider,
  CreateLLMProviderRequest,
  UpdateLLMProviderRequest,
  SensitiveWordGroup,
  CreateSensitiveWordGroupRequest,
  UpdateSensitiveWordGroupRequest,
  Product,
  SKU,
  CreateProductRequest,
  UpdateProductRequest,
  CreateSKURequest,
  UpdateSKURequest
} from '../types'

const api = axios.create({
  baseURL: '/api',
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      // 如果没有 token，尝试从 workflow_ctl_api_key 读取（用于 ChatTestPage）
      const workflowApiKey = localStorage.getItem('workflow_ctl_api_key')
      if (workflowApiKey) {
        config.headers.Authorization = workflowApiKey.trim()
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// API Key 相关接口
export const apiKeyApi = {
  // 获取API Key列表
  getList: (params?: { page?: number; page_size?: number; search?: string }) =>
    api.get<PaginatedResponse<ApiKey>>('/apikeys/list', { params }),

  // 获取单个API Key
  getById: (id: string) =>
    api.get<ApiResponse<ApiKey>>('/apikeys/get', { params: { apikey_id: id } }),

  // 创建API Key
  create: (data: CreateApiKeyRequest) =>
    api.post<ApiResponse<ApiKey>>('/apikeys/create', data),

  // 更新API Key
  update: (id: string, data: UpdateApiKeyRequest) =>
    api.put<ApiResponse<ApiKey>>('/apikeys/update', data, { params: { apikey_id: id } }),

  // 删除API Key
  delete: (id: string) =>
    api.delete<ApiResponse<void>>('/apikeys/delete', { params: { apikey_id: id } }),

  // 获取统计信息
  getStats: () =>
    api.get<ApiResponse<{ total_count: number }>>('/apikeys/stats'),
}

// 流程配置相关接口
export const workflowApi = {
  // 获取流程列表
  getList: (params?: { page?: number; page_size?: number; search?: string; type?: string }) =>
    api.get('/workflows/list', { params }) as Promise<PaginatedData<Workflow>>,

  // 获取单个流程
  getById: (id: string) =>
    api.get<ApiResponse<Workflow>>('/workflows/get', { params: { workflow_id: id } }),

  // 创建流程
  create: (data: CreateWorkflowRequest) =>
    api.post<ApiResponse<Workflow>>('/workflows/create', data),

  // 更新流程
  update: (id: string, data: UpdateWorkflowRequest) =>
    api.put<ApiResponse<Workflow>>('/workflows/update', data, { params: { workflow_id: id } }),

  // 删除流程
  delete: (id: string) =>
    api.delete<ApiResponse<void>>('/workflows/delete', { params: { workflow_id: id } }),

  // 获取统计信息
  getStats: () =>
    api.get<ApiResponse<{ total_count: number }>>('/workflows/stats'),
}

// Prompt 配置相关接口
export const promptApi = {
  // 获取Prompt列表
  getList: (params?: { page?: number; page_size?: number; search?: string; modelType?: string }) =>
    api.get('/prompts/list', { params }) as Promise<PaginatedData<Prompt>>,

  // 获取单个Prompt
  getById: (id: string) =>
    api.get<ApiResponse<Prompt>>('/prompts/get', { params: { prompt_id: id } }),

  // 创建Prompt
  create: (data: CreatePromptRequest) =>
    api.post<ApiResponse<Prompt>>('/prompts/create', data),

  // 更新Prompt
  update: (id: string, data: UpdatePromptRequest) =>
    api.put<ApiResponse<Prompt>>('/prompts/update', data, { params: { prompt_id: id } }),

  // 删除Prompt
  delete: (id: string) =>
    api.delete<ApiResponse<void>>('/prompts/delete', { params: { prompt_id: id } }),

  // 获取统计信息
  getStats: () =>
    api.get<ApiResponse<{ total_count: number }>>('/prompts/stats'),
}

// 模型参数配置相关接口
export const modelParameterApi = {
  // 获取模型参数列表
  getList: (params?: { page?: number; page_size?: number; search?: string; modelType?: string }) =>
    api.get<PaginatedResponse<ModelParameter>>('/model-parameters/list', { params }),

  // 获取单个模型参数
  getById: (id: string) =>
    api.get<ApiResponse<ModelParameter>>('/model-parameters/get', { params: { parameter_id: id } }),

  // 创建模型参数
  create: (data: CreateModelParameterRequest) =>
    api.post<ApiResponse<ModelParameter>>('/model-parameters/create', data),

  // 更新模型参数
  update: (id: string, data: UpdateModelParameterRequest) =>
    api.put<ApiResponse<ModelParameter>>('/model-parameters/update', data, { params: { parameter_id: id } }),

  // 删除模型参数
  delete: (id: string) =>
    api.delete<ApiResponse<void>>('/model-parameters/delete', { params: { parameter_id: id } }),

  // 获取统计信息
  getStats: () =>
    api.get<ApiResponse<{ total_count: number }>>('/model-parameters/stats'),
}

// LLM Provider 配置相关接口
export const llmProviderApi = {
  // 获取LLM Provider列表
  getList: (params?: { page?: number; page_size?: number; search?: string; provider?: string }) =>
    api.get('/llm-providers/list', { params }) as Promise<PaginatedData<LLMProvider>>,

  // 获取单个LLM Provider
  getById: (id: number) =>
    api.get<ApiResponse<LLMProvider>>('/llm-providers/get', { params: { provider_id: id } }),

  // 创建LLM Provider
  create: (data: CreateLLMProviderRequest) =>
    api.post<ApiResponse<LLMProvider>>('/llm-providers/create', data),

  // 更新LLM Provider
  update: (id: number, data: UpdateLLMProviderRequest) =>
    api.put<ApiResponse<LLMProvider>>('/llm-providers/update', data, { params: { provider_id: id } }),

  // 删除LLM Provider
  delete: (id: number) =>
    api.delete<ApiResponse<void>>('/llm-providers/delete', { params: { provider_id: id } }),
}

// 日志相关接口
export const logApi = {
  // 获取日志
  getLogs: (lines?: number) =>
    api.get<ApiResponse<{ content: string; line_count: number; lines: number }>>('/chat/logs', { params: { lines } }),

  // 获取日志统计（行数）
  getStats: () =>
    api.get<ApiResponse<{ content: string; line_count: number; lines: number }>>('/chat/logs', { params: { lines: 1 } }).then((res: any) => ({
      ...res,
      data: { total_count: res.data?.line_count || 0 }
    })) as Promise<ApiResponse<{ total_count: number }>>,

  // 获取最近7天的 token 消耗统计
  getTokenStats: () =>
    api.get<ApiResponse<any>>('/chat/stats'),
}

// 聊天日志相关接口
export const chatLogApi = {
  // 获取聊天日志列表
  getList: (params?: { skip?: number; limit?: number }) =>
    api.get('/chat-logs/', { params }) as Promise<{ total: number; items: any[] }>,
}

// 敏感词配置相关接口
export const sensitiveWordApi = {
  // 获取敏感词组列表
  getList: (params?: { page?: number; page_size?: number; search?: string }) =>
    api.get('/sensitive-words/list', { params }) as Promise<PaginatedData<SensitiveWordGroup>>,

  // 获取单个敏感词组
  getById: (id: string) =>
    api.get<ApiResponse<SensitiveWordGroup>>('/sensitive-words/get', { params: { group_id: id } }),

  // 创建敏感词组
  create: (data: CreateSensitiveWordGroupRequest) =>
    api.post<ApiResponse<SensitiveWordGroup>>('/sensitive-words/create', data),

  // 更新敏感词组
  update: (id: string, data: UpdateSensitiveWordGroupRequest) =>
    api.put<ApiResponse<SensitiveWordGroup>>('/sensitive-words/update', data, { params: { group_id: id } }),

  // 删除敏感词组
  delete: (id: string) =>
    api.delete<ApiResponse<void>>('/sensitive-words/delete', { params: { group_id: id } }),

  // 获取统计信息
  getStats: () =>
    api.get<ApiResponse<{ total_count: number }>>('/sensitive-words/stats'),
}

// 商品相关接口
export const productApi = {
  // 获取商品列表
  getList: (params?: { 
    page?: number
    page_size?: number
    search?: string
    brand?: string
    effectTag?: string
    skinType?: string
    problemTag?: string
    status?: 'active' | 'inactive'
  }) =>
    api.get('/products/list', { params }) as Promise<PaginatedData<Product>>,

  // 获取单个商品
  getById: (id: string) =>
    api.get<ApiResponse<Product>>('/products/get', { params: { product_id: id } }),

  // 创建商品
  create: (data: CreateProductRequest) =>
    api.post<ApiResponse<Product>>('/products/create', data),

  // 更新商品
  update: (id: string, data: UpdateProductRequest) =>
    api.put<ApiResponse<Product>>('/products/update', data, { params: { product_id: id } }),

  // 删除商品
  delete: (id: string) =>
    api.delete<ApiResponse<void>>('/products/delete', { params: { product_id: id } }),

  // 获取商品的 SKU 列表
  getSKUs: (productId: string) =>
    api.get<ApiResponse<SKU[]>>('/products/skus', { params: { product_id: productId } }),

  // 更新商品的问题标签映射
  updateProblemTags: (productId: string, problemTags: string[]) =>
    api.put<ApiResponse<void>>('/products/problem-tags', { problemTags }, { params: { product_id: productId } }),

  // 根据问题标签获取推荐商品
  getByProblemTag: (problemTag: string) =>
    api.get<ApiResponse<Product[]>>('/products/by-problem-tag', { params: { problem_tag: problemTag } }),
}

// SKU 相关接口
export const skuApi = {
  // 获取 SKU 列表
  getList: (params?: { 
    page?: number
    page_size?: number
    productId?: string
    status?: 'active' | 'inactive'
  }) =>
    api.get('/skus/list', { params }) as Promise<PaginatedData<SKU>>,

  // 获取单个 SKU
  getById: (id: string) =>
    api.get<ApiResponse<SKU>>('/skus/get', { params: { sku_id: id } }),

  // 创建 SKU
  create: (data: CreateSKURequest) =>
    api.post<ApiResponse<SKU>>('/skus/create', data),

  // 更新 SKU
  update: (id: string, data: UpdateSKURequest) =>
    api.put<ApiResponse<SKU>>('/skus/update', data, { params: { sku_id: id } }),

  // 删除 SKU
  delete: (id: string) =>
    api.delete<ApiResponse<void>>('/skus/delete', { params: { sku_id: id } }),
}

export default api