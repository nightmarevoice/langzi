import React, { useState, useEffect } from 'react'
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Switch,
  message,
  Table,
  Tag,
  Popconfirm,
  Modal,
  Select,
  Divider,
  Alert,
  Row,
  Col,
  Tooltip,
  Badge
} from 'antd'
import {
  SaveOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SettingOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Option } = Select
const { TextArea } = Input

// 模型参数配置接口
interface ModelParameter {
  id: string
  modelName: string // 模型名称
  modelType: 'chat' | 'embedding' | 'image' | 'other' // 模型类型
  provider: string // 提供商（如：OpenAI, Anthropic, 自研等）
  apiKey?: string // API密钥（加密存储）
  baseUrl: string // API基础URL
  temperature: number // 温度参数（0-2）
  maxTokens: number // 最大token数
  topP: number // Top-p采样
  frequencyPenalty: number // 频率惩罚
  presencePenalty: number // 存在惩罚
  timeout: number // 超时时间（秒）
  retryCount: number // 重试次数
  enabled: boolean // 是否启用
  description?: string // 描述
  createdAt: string
  updatedAt: string
}

const ModelParameterConfig: React.FC = () => {
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [parameters, setParameters] = useState<ModelParameter[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingParam, setEditingParam] = useState<ModelParameter | null>(null)

  // 加载数据
  useEffect(() => {
    loadParameters()
  }, [])

  const loadParameters = () => {
    setLoading(true)
    setTimeout(() => {
      const mockData: ModelParameter[] = [
        {
          id: 'param001',
          modelName: 'GPT-4',
          modelType: 'chat',
          provider: 'OpenAI',
          baseUrl: 'https://api.openai.com/v1',
          temperature: 0.7,
          maxTokens: 2000,
          topP: 1.0,
          frequencyPenalty: 0.0,
          presencePenalty: 0.0,
          timeout: 30,
          retryCount: 3,
          enabled: true,
          description: '主要对话模型，用于智能客服',
          createdAt: '2025-01-15 10:00:00',
          updatedAt: '2025-01-15 10:00:00'
        },
        {
          id: 'param002',
          modelName: 'Claude-3',
          modelType: 'chat',
          provider: 'Anthropic',
          baseUrl: 'https://api.anthropic.com/v1',
          temperature: 0.8,
          maxTokens: 1500,
          topP: 0.95,
          frequencyPenalty: 0.0,
          presencePenalty: 0.0,
          timeout: 30,
          retryCount: 3,
          enabled: true,
          description: '备用对话模型',
          createdAt: '2025-01-14 14:00:00',
          updatedAt: '2025-01-14 14:00:00'
        },
        {
          id: 'param003',
          modelName: 'text-embedding-ada-002',
          modelType: 'embedding',
          provider: 'OpenAI',
          baseUrl: 'https://api.openai.com/v1',
          temperature: 0,
          maxTokens: 8191,
          topP: 1.0,
          frequencyPenalty: 0.0,
          presencePenalty: 0.0,
          timeout: 20,
          retryCount: 2,
          enabled: true,
          description: '文本嵌入模型，用于语义搜索',
          createdAt: '2025-01-13 09:00:00',
          updatedAt: '2025-01-13 09:00:00'
        }
      ]
      setParameters(mockData)
      setLoading(false)
    }, 500)
  }

  // 表格列定义
  const columns: ColumnsType<ModelParameter> = [
    {
      title: '模型名称',
      dataIndex: 'modelName',
      key: 'modelName',
      width: 150,
      render: (text, record) => (
        <Space>
          <span>{text}</span>
          {record.enabled ? (
            <Badge status="success" text="启用" />
          ) : (
            <Badge status="default" text="禁用" />
          )}
        </Space>
      )
    },
    {
      title: '模型类型',
      dataIndex: 'modelType',
      key: 'modelType',
      width: 120,
      render: (type) => {
        const typeMap = {
          chat: { text: '对话', color: 'blue' },
          embedding: { text: '嵌入', color: 'green' },
          image: { text: '图像', color: 'purple' },
          other: { text: '其他', color: 'default' }
        }
        const info = typeMap[type] || typeMap.other
        return <Tag color={info.color}>{info.text}</Tag>
      }
    },
    {
      title: '提供商',
      dataIndex: 'provider',
      key: 'provider',
      width: 120
    },
    {
      title: 'API地址',
      dataIndex: 'baseUrl',
      key: 'baseUrl',
      width: 200,
      ellipsis: {
        showTitle: false
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '温度',
      dataIndex: 'temperature',
      key: 'temperature',
      width: 80
    },
    {
      title: '最大Token',
      dataIndex: 'maxTokens',
      key: 'maxTokens',
      width: 100
    },
    {
      title: '超时(秒)',
      dataIndex: 'timeout',
      key: 'timeout',
      width: 100
    },
    {
      title: '重试次数',
      dataIndex: 'retryCount',
      key: 'retryCount',
      width: 100
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <span>{text || '-'}</span>
        </Tooltip>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个模型配置吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // 处理编辑
  const handleEdit = (param: ModelParameter) => {
    setEditingParam(param)
    modalForm.setFieldsValue({
      ...param,
      apiKey: param.apiKey ? '******' : undefined
    })
    setModalVisible(true)
  }

  // 处理新增
  const handleAdd = () => {
    setEditingParam(null)
    modalForm.resetFields()
    modalForm.setFieldsValue({
      modelType: 'chat',
      temperature: 0.7,
      maxTokens: 2000,
      topP: 1.0,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      timeout: 30,
      retryCount: 3,
      enabled: true
    })
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    setParameters(parameters.filter(item => item.id !== id))
    message.success('删除成功')
  }

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await modalForm.validateFields()
      
      const param: ModelParameter = {
        id: editingParam?.id || `param${Date.now()}`,
        modelName: values.modelName,
        modelType: values.modelType,
        provider: values.provider,
        apiKey: values.apiKey && values.apiKey !== '******' ? values.apiKey : editingParam?.apiKey,
        baseUrl: values.baseUrl,
        temperature: values.temperature,
        maxTokens: values.maxTokens,
        topP: values.topP,
        frequencyPenalty: values.frequencyPenalty,
        presencePenalty: values.presencePenalty,
        timeout: values.timeout,
        retryCount: values.retryCount,
        enabled: values.enabled,
        description: values.description,
        createdAt: editingParam?.createdAt || new Date().toLocaleString('zh-CN'),
        updatedAt: new Date().toLocaleString('zh-CN')
      }

      if (editingParam) {
        setParameters(parameters.map(item => item.id === editingParam.id ? param : item))
        message.success('更新成功')
      } else {
        setParameters([...parameters, param])
        message.success('创建成功')
      }

      setModalVisible(false)
      modalForm.resetFields()
      setEditingParam(null)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 处理全局配置保存
  const handleGlobalSave = async () => {
    try {
      const values = await form.validateFields()
      console.log('保存全局配置:', values)
      message.success('全局配置保存成功')
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Alert
          message="模型参数配置"
          description="配置AI模型的基础参数，包括温度、最大token数、超时时间等。这些参数会影响模型的生成效果和响应速度。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Divider orientation="left">全局默认配置</Divider>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleGlobalSave}
          initialValues={{
            defaultTemperature: 0.7,
            defaultMaxTokens: 2000,
            defaultTimeout: 30,
            defaultRetryCount: 3,
            enableAutoRetry: true,
            enableRateLimit: true
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="默认温度"
                name="defaultTemperature"
                tooltip="控制输出的随机性，值越大越随机"
              >
                <InputNumber
                  min={0}
                  max={2}
                  step={0.1}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="默认最大Token数"
                name="defaultMaxTokens"
                tooltip="单次请求的最大token数"
              >
                <InputNumber
                  min={1}
                  max={100000}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="默认超时时间(秒)"
                name="defaultTimeout"
                tooltip="API请求的超时时间"
              >
                <InputNumber
                  min={1}
                  max={300}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="默认重试次数"
                name="defaultRetryCount"
                tooltip="请求失败时的重试次数"
              >
                <InputNumber
                  min={0}
                  max={10}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="启用自动重试"
                name="enableAutoRetry"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="启用速率限制"
                name="enableRateLimit"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleGlobalSave}>
              保存全局配置
            </Button>
          </Form.Item>
        </Form>

        <Divider orientation="left">模型配置列表</Divider>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadParameters}>
              刷新
            </Button>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增模型配置
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={parameters}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个模型配置`,
            pageSizeOptions: ['10', '20', '50']
          }}
        />
      </Card>

      {/* 编辑/新增弹窗 */}
      <Modal
        title={editingParam ? '编辑模型配置' : '新增模型配置'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => {
          setModalVisible(false)
          modalForm.resetFields()
          setEditingParam(null)
        }}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={modalForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="模型名称"
                name="modelName"
                rules={[{ required: true, message: '请输入模型名称' }]}
              >
                <Input placeholder="例如：GPT-4" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="模型类型"
                name="modelType"
                rules={[{ required: true, message: '请选择模型类型' }]}
              >
                <Select>
                  <Option value="chat">对话模型</Option>
                  <Option value="embedding">嵌入模型</Option>
                  <Option value="image">图像模型</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="提供商"
                name="provider"
                rules={[{ required: true, message: '请输入提供商' }]}
              >
                <Input placeholder="例如：OpenAI, Anthropic" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="API密钥"
                name="apiKey"
                tooltip="留空则不修改现有密钥"
              >
                <Input.Password placeholder="输入新的API密钥" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="API基础URL"
            name="baseUrl"
            rules={[{ required: true, message: '请输入API基础URL' }]}
          >
            <Input placeholder="例如：https://api.openai.com/v1" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="温度 (Temperature)"
                name="temperature"
                rules={[{ required: true, message: '请输入温度值' }]}
                tooltip="控制输出的随机性，0-2之间"
              >
                <InputNumber
                  min={0}
                  max={2}
                  step={0.1}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="最大Token数"
                name="maxTokens"
                rules={[{ required: true, message: '请输入最大Token数' }]}
              >
                <InputNumber
                  min={1}
                  max={100000}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Top-p"
                name="topP"
                rules={[{ required: true, message: '请输入Top-p值' }]}
                tooltip="核采样参数，0-1之间"
              >
                <InputNumber
                  min={0}
                  max={1}
                  step={0.05}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="频率惩罚"
                name="frequencyPenalty"
                rules={[{ required: true, message: '请输入频率惩罚值' }]}
                tooltip="-2.0到2.0之间"
              >
                <InputNumber
                  min={-2}
                  max={2}
                  step={0.1}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="存在惩罚"
                name="presencePenalty"
                rules={[{ required: true, message: '请输入存在惩罚值' }]}
                tooltip="-2.0到2.0之间"
              >
                <InputNumber
                  min={-2}
                  max={2}
                  step={0.1}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="超时时间(秒)"
                name="timeout"
                rules={[{ required: true, message: '请输入超时时间' }]}
              >
                <InputNumber
                  min={1}
                  max={300}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="重试次数"
                name="retryCount"
                rules={[{ required: true, message: '请输入重试次数' }]}
              >
                <InputNumber
                  min={0}
                  max={10}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="是否启用"
                name="enabled"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="描述"
            name="description"
          >
            <TextArea
              rows={3}
              placeholder="输入模型配置的描述信息"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ModelParameterConfig

