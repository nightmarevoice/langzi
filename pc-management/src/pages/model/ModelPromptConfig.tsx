import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Form,
  Select,
  Modal,
  message,
  Popconfirm,
  Alert,
  Row,
  Col,
  Tooltip,
  Switch,
  Badge
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Option } = Select
const { TextArea } = Input

// 模型提示词配置接口
interface ModelPrompt {
  id: string
  name: string // 提示词名称
  scene: string // 使用场景，如：客服问答、皮肤报告解读等
  type: 'system' | 'user' // 提示词类型：系统提示词 / 用户提示词
  modelName: string // 关联模型
  prompt: string // 提示词模版内容
  variables?: string[] // 支持的变量列表
  language?: 'zh' | 'en' | 'mixed' // 语言
  enabled: boolean // 是否启用
  version: string // 版本号
  description?: string // 说明
  createdAt: string
  updatedAt: string
}

const ModelPromptConfig: React.FC = () => {
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [prompts, setPrompts] = useState<ModelPrompt[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<ModelPrompt | null>(null)
  const [searchText, setSearchText] = useState('')
  const [sceneFilter, setSceneFilter] = useState<string | undefined>()
  const [typeFilter, setTypeFilter] = useState<'system' | 'user' | undefined>()

  // 加载Mock数据
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockData: ModelPrompt[] = [
        {
          id: 'prompt001',
          name: '客服问答（通用）',
          scene: '智能客服问答',
          type: 'system',
          modelName: 'GPT-4',
          prompt:
            '你是一名专业的皮肤顾问，需要根据客户的提问，结合皮肤知识库和问答语料库，给出耐心、专业且符合中国用户表达习惯的回答。回答需包含：1）对问题的理解；2）可能的原因或原理；3）具体可执行的建议；4）如有需要，可建议进行AI皮肤检测或线下就诊。',
          variables: ['customerName', 'skinProblem', 'productName'],
          language: 'zh',
          enabled: true,
          version: 'v1.0',
          description: '用于智能客服通用问答场景的系统提示词。',
          createdAt: '2025-01-10 10:00:00',
          updatedAt: '2025-01-10 10:00:00'
        },
        {
          id: 'prompt002',
          name: '皮肤报告解读',
          scene: '皮肤检测报告解读',
          type: 'system',
          modelName: 'GPT-4',
          prompt:
            '你是一名资深皮肤科顾问，需要根据AI皮肤检测结果，为用户生成通俗易懂的皮肤报告解读。请按以下结构输出：1）整体肤质总结；2）各维度（如水分、油脂、敏感度、色斑等）的情况说明；3）日常护理建议；4）可选择的产品或服务建议。用词温和，避免夸大效果，不得给出超出护肤范畴的医疗诊断。',
          variables: ['customerName', 'reportSummary', 'scoreItems'],
          language: 'zh',
          enabled: true,
          version: 'v1.0',
          description: '用于生成皮肤检测报告解读内容的提示词。',
          createdAt: '2025-01-09 15:30:00',
          updatedAt: '2025-01-09 15:30:00'
        },
        {
          id: 'prompt003',
          name: '营销文案生成（参考模版）',
          scene: '营销活动推荐',
          type: 'user',
          modelName: 'GPT-4',
          prompt:
            '你是一名美妆品牌的内容运营，需要根据给定的活动信息和产品卖点，生成简短的营销文案。要求：1）语气自然友好，适合小红书/朋友圈风格；2）不得夸大宣传或做出不符合广告法的承诺（如“根治”“永久有效”等）；3）适当结合护肤知识点，突出专业但不过度专业。',
          variables: ['campaignName', 'productHighlights', 'targetAudience'],
          language: 'zh',
          enabled: false,
          version: 'v0.9',
          description: '用于生成营销文案的提示词模版，默认未启用。',
          createdAt: '2025-01-08 09:20:00',
          updatedAt: '2025-01-08 09:20:00'
        }
      ]
      setPrompts(mockData)
      setLoading(false)
    }, 400)
  }, [])

  // 过滤后的数据
  const filteredPrompts = prompts.filter(item => {
    const matchScene = sceneFilter ? item.scene === sceneFilter : true
    const matchType = typeFilter ? item.type === typeFilter : true
    if (!searchText.trim()) return matchScene
    const lower = searchText.toLowerCase()
    return (
      matchScene &&
      matchType &&
      (item.name.toLowerCase().includes(lower) ||
        item.scene.toLowerCase().includes(lower) ||
        item.modelName.toLowerCase().includes(lower) ||
        item.prompt.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower))
    )
  })

  // 表格列
  const columns: ColumnsType<ModelPrompt> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (text, record) => (
        <Space>
          <FileTextOutlined />
          <span>{text}</span>
          {record.enabled ? (
            <Badge status="success" text="启用" />
          ) : (
            <Badge status="default" text="停用" />
          )}
        </Space>
      )
    },
    {
      title: '使用场景',
      dataIndex: 'scene',
      key: 'scene',
      width: 180,
      render: (scene) => <Tag color="blue">{scene}</Tag>
    },
    {
      title: '提示词类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: 'system' | 'user') =>
        type === 'system' ? (
          <Tag color="purple">系统提示词</Tag>
        ) : (
          <Tag color="gold">用户提示词</Tag>
        )
    },
    {
      title: '关联模型',
      dataIndex: 'modelName',
      key: 'modelName',
      width: 140
    },
    {
      title: '语言',
      dataIndex: 'language',
      key: 'language',
      width: 90,
      render: (lang) => {
        const map: Record<string, { text: string; color: string }> = {
          zh: { text: '中文', color: 'green' },
          en: { text: '英文', color: 'blue' },
          mixed: { text: '中英混合', color: 'purple' }
        }
        const info = map[lang || 'zh']
        return <Tag color={info.color}>{info.text}</Tag>
      }
    },
    {
      title: '变量',
      dataIndex: 'variables',
      key: 'variables',
      width: 200,
      render: (vars?: string[]) =>
        vars && vars.length > 0 ? (
          <Space size={[0, 8]} wrap>
            {vars.slice(0, 3).map((v, i) => (
              <Tag key={i} color="cyan">
                {'{'}
                {v}
                {'}'}
              </Tag>
            ))}
            {vars.length > 3 && <Tag>+{vars.length - 3}</Tag>}
          </Space>
        ) : (
          <span>-</span>
        )
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 170
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
            title="确定要删除这个提示词配置吗？"
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

  // 编辑
  const handleEdit = (prompt: ModelPrompt) => {
        setEditingPrompt(prompt)
        modalForm.setFieldsValue({
          ...prompt,
          variables: prompt.variables?.join(',') || ''
        })
    setModalVisible(true)
  }

  // 新增
  const handleAdd = () => {
        setEditingPrompt(null)
        modalForm.resetFields()
        modalForm.setFieldsValue({
          type: 'system',
          language: 'zh',
          enabled: true,
          version: 'v1.0'
        })
    setModalVisible(true)
  }

  // 删除
  const handleDelete = (id: string) => {
    setPrompts(prompts.filter(item => item.id !== id))
    message.success('删除成功')
  }

  // 保存
  const handleSave = async () => {
    try {
      const values = await modalForm.validateFields()
      const newItem: ModelPrompt = {
        id: editingPrompt?.id || `prompt${Date.now()}`,
        name: values.name,
        scene: values.scene,
        type: values.type,
        modelName: values.modelName,
        prompt: values.prompt,
        variables: values.variables
          ? values.variables.split(',').map((v: string) => v.trim()).filter(Boolean)
          : [],
        language: values.language,
        enabled: values.enabled,
        version: values.version,
        description: values.description,
        createdAt: editingPrompt?.createdAt || new Date().toLocaleString('zh-CN'),
        updatedAt: new Date().toLocaleString('zh-CN')
      }

      if (editingPrompt) {
        setPrompts(prompts.map(item => (item.id === editingPrompt.id ? newItem : item)))
        message.success('更新成功')
      } else {
        setPrompts([...prompts, newItem])
        message.success('创建成功')
      }

      setModalVisible(false)
      modalForm.resetFields()
      setEditingPrompt(null)
    } catch (e) {
      console.error('Validation failed:', e)
    }
  }

  // 保存全局配置（占位）
  const handleGlobalSave = async () => {
    try {
      const values = await form.validateFields()
      console.log('保存提示词全局配置:', values)
      message.success('提示词全局配置保存成功')
    } catch (e) {
      console.error('Validation failed:', e)
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Alert
          message="模型提示词配置"
          description="配置不同业务场景下的模型系统提示词，规范AI回复风格、边界和安全规则。可结合知识库、话术库和问答语料库一起使用。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="inline"
          onFinish={handleGlobalSave}
          initialValues={{
            defaultModelName: 'GPT-4',
            defaultLanguage: 'zh',
            enableSafetyCheck: true
          }}
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            label="默认模型"
            name="defaultModelName"
          >
            <Input placeholder="例如：GPT-4" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item
            label="默认语言"
            name="defaultLanguage"
          >
            <Select style={{ width: 140 }}>
              <Option value="zh">中文</Option>
              <Option value="en">英文</Option>
              <Option value="mixed">中英混合</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="启用安全检查"
            name="enableSafetyCheck"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
              保存全局配置
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}
        >
          <Space>
            <Input
              placeholder="搜索名称、场景、模型或内容"
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 320 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="使用场景"
              allowClear
              style={{ width: 200 }}
              value={sceneFilter}
              onChange={setSceneFilter}
            >
              <Option value="智能客服问答">智能客服问答</Option>
              <Option value="皮肤检测报告解读">皮肤检测报告解读</Option>
              <Option value="营销活动推荐">营销活动推荐</Option>
            </Select>
            <Select
              placeholder="提示词类型"
              allowClear
              style={{ width: 160 }}
              value={typeFilter}
              onChange={setTypeFilter}
            >
              <Option value="system">系统提示词</Option>
              <Option value="user">用户提示词</Option>
            </Select>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增提示词
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredPrompts}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条提示词配置`,
            pageSizeOptions: ['10', '20', '50']
          }}
        />
      </Card>

      {/* 编辑 / 新增弹窗 */}
      <Modal
        title={editingPrompt ? '编辑提示词配置' : '新增提示词配置'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => {
          setModalVisible(false)
          modalForm.resetFields()
          setEditingPrompt(null)
        }}
        width={900}
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
                label="提示词类型"
                name="type"
                rules={[{ required: true, message: '请选择提示词类型' }]}
              >
                <Select>
                  <Option value="system">系统提示词</Option>
                  <Option value="user">用户提示词</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="提示词名称"
                name="name"
                rules={[{ required: true, message: '请输入提示词名称' }]}
              >
                <Input placeholder="例如：客服问答（通用）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="使用场景"
                name="scene"
                rules={[{ required: true, message: '请选择使用场景' }]}
              >
                <Select placeholder="选择使用场景">
                  <Option value="智能客服问答">智能客服问答</Option>
                  <Option value="皮肤检测报告解读">皮肤检测报告解读</Option>
                  <Option value="营销活动推荐">营销活动推荐</Option>
                  <Option value="其他场景">其他场景</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="关联模型名称"
                name="modelName"
                rules={[{ required: true, message: '请输入关联模型名称' }]}
              >
                <Input placeholder="例如：GPT-4 / Claude-3" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="语言"
                name="language"
              >
                <Select>
                  <Option value="zh">中文</Option>
                  <Option value="en">英文</Option>
                  <Option value="mixed">中英混合</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="变量（逗号分隔）"
                name="variables"
                extra="例如：customerName,skinProblem,productName"
              >
                <Input placeholder="输入提示词中使用的变量名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="版本号"
                    name="version"
                  >
                    <Input placeholder="例如：v1.0" />
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
            </Col>
          </Row>

          <Form.Item
            label={
              <Space>
                <span>提示词模版内容</span>
                <Tooltip title="可作为系统提示词或前置说明，用于约束模型角色、风格和边界。">
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            }
            name="prompt"
            rules={[{ required: true, message: '请输入提示词内容' }]}
          >
            <TextArea
              rows={8}
              placeholder="编写用于该场景的提示词模版，例如：你是一名专业的皮肤顾问，需要根据客户问题给出专业且易懂的建议..."
            />
          </Form.Item>

          <Form.Item
            label="说明"
            name="description"
          >
            <TextArea
              rows={3}
              placeholder="补充说明该提示词的使用注意事项、适用范围等"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ModelPromptConfig


