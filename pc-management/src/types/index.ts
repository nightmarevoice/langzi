// API Key 类型定义
export interface ApiKey {
  id: string
  name: string
  description: string
  key: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface CreateApiKeyRequest {
  name: string
  description: string
}

export interface UpdateApiKeyRequest {
  name?: string
  description?: string
  status?: 'active' | 'inactive'
}

// 流程配置类型定义
export interface Workflow {
  id: string
  name: string
  description: string
  type: 'proprietary' | 'proprietary->general'
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface CreateWorkflowRequest {
  name: string
  description: string
  type: 'proprietary' | 'proprietary->general'
}

export interface UpdateWorkflowRequest {
  name?: string
  description?: string
  type?: 'proprietary' | 'proprietary->general'
  status?: 'active' | 'inactive'
}

// Prompt 配置类型定义
export interface Prompt {
  id: string
  title: string
  system_prompt?: string
  user_prompt?: string
  model_type: 'proprietary' | 'general'
  created_at: string
  updated_at: string
}

export interface CreatePromptRequest {
  title: string
  system_prompt?: string
  user_prompt?: string
  model_type: 'proprietary' | 'general'
}

export interface UpdatePromptRequest {
  title?: string
  system_prompt?: string
  user_prompt?: string
  model_type?: 'proprietary' | 'general'
}

// 模型参数配置类型定义
export interface ModelParameter {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  defaultValue: any
  modelType: 'proprietary' | 'general'
  description: string
  required: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
    enum?: any[]
  }
  createdAt: string
}

export interface CreateModelParameterRequest {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  defaultValue: any
  modelType: 'proprietary' | 'general'
  description: string
  required: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
    enum?: any[]
  }
}

export interface UpdateModelParameterRequest {
  name?: string
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object'
  defaultValue?: any
  modelType?: 'proprietary' | 'general'
  description?: string
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
    enum?: any[]
  }
}

// LLM Provider 配置类型定义
export interface ModelConfiguration {
  name: string
  max_input_tokens: number
  supports_function_calling: boolean
}

export interface LLMProvider {
  id: number
  name: string
  provider: string
  api_key?: string
  api_base?: string
  api_version?: string
  custom_config?: Record<string, string>
  default_model_name: string
  fast_default_model_name?: string
  deployment_name?: string
  default_vision_model?: string
  model_configurations?: ModelConfiguration[]
  category: string
  is_default_provider?: boolean
  is_default_vision_provider?: boolean
  created_at: string
  updated_at: string
}

export interface CreateLLMProviderRequest {
  name: string
  provider: string
  api_key?: string
  api_base?: string
  api_version?: string
  custom_config?: Record<string, string>
  default_model_name: string
  fast_default_model_name?: string
  deployment_name?: string
  default_vision_model?: string
  model_configurations?: ModelConfiguration[]
  category: string
  is_default_provider?: boolean
  is_default_vision_provider?: boolean
}

export interface UpdateLLMProviderRequest {
  name?: string
  provider?: string
  api_key?: string
  api_base?: string
  api_version?: string
  custom_config?: Record<string, string>
  default_model_name?: string
  fast_default_model_name?: string
  deployment_name?: string
  default_vision_model?: string
  model_configurations?: ModelConfiguration[]
  category?: string
  is_default_provider?: boolean
  is_default_vision_provider?: boolean
}

// 通用响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

export interface PaginatedData<T = any> {
  items: T[]
  total: number
  page: number
  page_size: number
}

export interface PaginatedResponse<T = any> {
  code: number
  message: string
  data: PaginatedData<T>
}

// 为了兼容axios拦截器，添加一个扩展接口
export interface PaginatedResponseData<T = any> extends PaginatedData<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

// 敏感词配置类型定义
export interface SensitiveWordGroup {
  id: string
  name: string
  description?: string
  words: string[]  // 敏感词列表
  created_at: string
  updated_at: string
}

export interface CreateSensitiveWordGroupRequest {
  name: string
  description?: string
  words: string[]
}

export interface UpdateSensitiveWordGroupRequest {
  name?: string
  description?: string
  words?: string[]
}

// 商品相关类型定义
export interface Product {
  id: string
  name: string
  brand: string
  effectTags: string[] // 功效标签：祛痘、控油、美白等
  skinTypes: string[] // 适用肤质：油性、干性、混合性、敏感肌等
  priceRange: {
    min: number
    max: number
  }
  salesLink: string // 销售链接
  status: 'active' | 'inactive' // 状态
  problemTags: string[] // 关联的皮肤问题标签
  createdAt: string
  updatedAt: string
}

export interface SKU {
  id: string
  productId: string
  name: string
  price: number
  images: string[] // 图片列表
  description: string // 图文介绍
  ingredients: string // 成分说明
  precautions: string // 注意事项
  stock: number // 库存
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface ProductProblemTagMapping {
  id: string
  productId: string
  problemTag: string // 皮肤问题标签：痤疮、色斑、敏感等
  priority: number // 优先级，数字越小优先级越高
  createdAt: string
}

export interface CreateProductRequest {
  name: string
  brand: string
  effectTags: string[]
  skinTypes: string[]
  priceRange: {
    min: number
    max: number
  }
  salesLink: string
  problemTags?: string[]
}

export interface UpdateProductRequest {
  name?: string
  brand?: string
  effectTags?: string[]
  skinTypes?: string[]
  priceRange?: {
    min: number
    max: number
  }
  salesLink?: string
  status?: 'active' | 'inactive'
  problemTags?: string[]
}

export interface CreateSKURequest {
  productId: string
  name: string
  price: number
  images: string[]
  description: string
  ingredients: string
  precautions: string
  stock?: number
}

export interface UpdateSKURequest {
  name?: string
  price?: number
  images?: string[]
  description?: string
  ingredients?: string
  precautions?: string
  stock?: number
  status?: 'active' | 'inactive'
}
