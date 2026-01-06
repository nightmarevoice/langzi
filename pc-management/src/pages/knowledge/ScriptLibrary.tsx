import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  InputNumber,
  Modal,
  Form,
  Select,
  Tag,
  message,
  Popconfirm,
  Divider,
  Row,
  Col,
  Tabs,
  Switch,
  Radio,
  Alert,
  Tooltip,
  Badge
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SafetyOutlined,
  BulbOutlined,
  LinkOutlined,
  CopyOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input

// 意图类型
type IntentType = 'question' | 'complaint' | 'consultation' | 'purchase' | 'other'

// 话术状态
type ScriptStatus = 'enabled' | 'disabled'

// 安全级别
type SafetyLevel = 'high' | 'medium' | 'low'

// 意图接口
interface Intent {
  id: string
  name: string // 意图名称
  keywords: string[] // 关键词列表（用于匹配用户问题）
  examples: string[] // 示例问题（如"能根治吗？"）
  category: string // 意图分类
  type: IntentType
  priority: number // 优先级（数字越大优先级越高）
  createdAt: string
  updatedAt: string
}

// 话术模版接口
interface ScriptTemplate {
  id: string
  title: string // 话术标题
  intentId: string // 关联的意图ID
  intentName?: string // 意图名称（用于显示）
  content: string // 话术内容（支持变量，如 {userName}, {productName}）
  variables?: string[] // 支持的变量列表
  style: {
    tone: 'professional' | 'friendly' | 'warm' | 'formal' | 'casual' // 语气风格
    sentencePattern: 'direct' | 'indirect' | 'question' | 'suggestion' // 句式习惯
    length: 'short' | 'medium' | 'long' // 回答长度
  }
  safety: {
    level: SafetyLevel // 安全级别
    boundaries: string[] // 安全边界规则（禁止使用的词汇、表达等）
    warnings?: string[] // 警告提示
  }
  status: ScriptStatus
  usageCount?: number // 使用次数
  createdAt: string
  updatedAt: string
}


const ScriptLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'intent' | 'script'>('intent')
  const [intents, setIntents] = useState<Intent[]>([])
  const [scripts, setScripts] = useState<ScriptTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [intentModalVisible, setIntentModalVisible] = useState(false)
  const [scriptModalVisible, setScriptModalVisible] = useState(false)
  const [mappingModalVisible, setMappingModalVisible] = useState(false)
  const [editingIntent, setEditingIntent] = useState<Intent | null>(null)
  const [editingScript, setEditingScript] = useState<ScriptTemplate | null>(null)
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null)
  const [intentForm] = Form.useForm()
  const [scriptForm] = Form.useForm()

  // Mock数据
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setIntents([
        {
          id: 'intent1',
          name: '根治询问',
          keywords: ['根治', '彻底', '完全', '永久'],
          examples: ['能根治吗？', '可以彻底解决吗？', '会不会复发？'],
          category: '治疗效果',
          type: 'question',
          priority: 10,
          createdAt: '2025-01-01 10:00:00',
          updatedAt: '2025-01-10 15:30:00'
        },
        {
          id: 'intent2',
          name: '产品咨询',
          keywords: ['产品', '效果', '成分', '使用'],
          examples: ['这个产品怎么样？', '适合什么肤质？', '有什么成分？'],
          category: '产品咨询',
          type: 'consultation',
          priority: 8,
          createdAt: '2025-01-02 09:00:00',
          updatedAt: '2025-01-08 11:20:00'
        },
        {
          id: 'intent3',
          name: '价格询问',
          keywords: ['价格', '多少钱', '优惠', '折扣'],
          examples: ['这个多少钱？', '有优惠吗？', '什么时候打折？'],
          category: '价格咨询',
          type: 'purchase',
          priority: 7,
          createdAt: '2025-01-03 14:00:00',
          updatedAt: '2025-01-05 16:00:00'
        },
        {
          id: 'intent4',
          name: '过敏投诉',
          keywords: ['过敏', '红肿', '刺激', '不适'],
          examples: ['用了之后过敏了', '皮肤红肿怎么办？', '有刺激感'],
          category: '投诉处理',
          type: 'complaint',
          priority: 9,
          createdAt: '2025-01-04 10:00:00',
          updatedAt: '2025-01-06 14:00:00'
        }
      ])

      setScripts([
        {
          id: 'script1',
          title: '根治询问-专业回答',
          intentId: 'intent1',
          intentName: '根治询问',
          content: '关于您的问题，我们需要客观地说明：{productName} 是针对 {problemType} 问题设计的专业产品，通过科学配方和持续使用，可以有效改善相关症状。每个人的皮肤状况和恢复能力不同，建议您坚持使用并配合正确的护肤方法，同时定期进行皮肤检测以跟踪改善效果。',
          variables: ['productName', 'problemType'],
          style: {
            tone: 'professional',
            sentencePattern: 'direct',
            length: 'medium'
          },
          safety: {
            level: 'high',
            boundaries: ['根治', '彻底', '永久', '100%', '保证'],
            warnings: ['避免使用绝对化表述', '不得承诺治疗效果']
          },
          status: 'enabled',
          usageCount: 156,
          createdAt: '2025-01-01 10:00:00',
          updatedAt: '2025-01-10 15:30:00'
        },
        {
          id: 'script2',
          title: '根治询问-温和回答',
          intentId: 'intent1',
          intentName: '根治询问',
          content: '我理解您的关切。{productName} 是一款经过科学验证的产品，可以帮助改善 {problemType} 问题。皮肤护理是一个持续的过程，建议您按照产品说明坚持使用，同时保持良好的生活习惯，这样能获得更好的效果。',
          variables: ['productName', 'problemType'],
          style: {
            tone: 'warm',
            sentencePattern: 'indirect',
            length: 'medium'
          },
          safety: {
            level: 'high',
            boundaries: ['根治', '彻底', '永久', '100%', '保证'],
            warnings: ['避免使用绝对化表述']
          },
          status: 'enabled',
          usageCount: 89,
          createdAt: '2025-01-01 11:00:00',
          updatedAt: '2025-01-09 14:20:00'
        },
        {
          id: 'script3',
          title: '产品咨询-专业介绍',
          intentId: 'intent2',
          intentName: '产品咨询',
          content: '{productName} 是一款专为 {skinType} 肤质设计的产品，主要成分包括 {ingredients}。它能够 {benefits}，建议 {usageMethod}。',
          variables: ['productName', 'skinType', 'ingredients', 'benefits', 'usageMethod'],
          style: {
            tone: 'professional',
            sentencePattern: 'direct',
            length: 'short'
          },
          safety: {
            level: 'medium',
            boundaries: ['绝对', '一定', '必须'],
            warnings: []
          },
          status: 'enabled',
          usageCount: 234,
          createdAt: '2025-01-02 09:00:00',
          updatedAt: '2025-01-08 11:20:00'
        }
      ])
      setLoading(false)
    }, 500)
  }, [])

  // 意图表格列
  const intentColumns: ColumnsType<Intent> = [
    {
      title: '意图名称',
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: IntentType) => {
        const typeMap = {
          question: { text: '问题', color: 'blue' },
          complaint: { text: '投诉', color: 'red' },
          consultation: { text: '咨询', color: 'green' },
          purchase: { text: '购买', color: 'orange' },
          other: { text: '其他', color: 'default' }
        }
        const config = typeMap[type]
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: '关键词',
      dataIndex: 'keywords',
      key: 'keywords',
      width: 200,
      render: (keywords: string[]) => (
        <Space size={[0, 8]} wrap>
          {keywords.map(keyword => (
            <Tag key={keyword}>{keyword}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '示例问题',
      dataIndex: 'examples',
      key: 'examples',
      width: 250,
      ellipsis: true,
      render: (examples: string[]) => (
        <Tooltip title={examples.join('；')}>
          {examples.slice(0, 2).join('；')}
          {examples.length > 2 && '...'}
        </Tooltip>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      sorter: (a, b) => b.priority - a.priority
    },
    {
      title: '关联话术',
      key: 'scriptCount',
      width: 100,
      render: (_, record: Intent) => {
        const count = scripts.filter(s => s.intentId === record.id).length
        return (
          <Button
            type="link"
            onClick={() => handleViewMapping(record)}
            icon={<LinkOutlined />}
          >
            {count} 个
          </Button>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record: Intent) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditIntent(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个意图吗？"
            onConfirm={() => handleDeleteIntent(record.id)}
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

  // 话术表格列
  const scriptColumns: ColumnsType<ScriptTemplate> = [
    {
      title: '话术标题',
      dataIndex: 'title',
      key: 'title',
      width: 200
    },
    {
      title: '关联意图',
      dataIndex: 'intentName',
      key: 'intentName',
      width: 150
    },
    {
      title: '语气风格',
      key: 'tone',
      width: 120,
      render: (_, record: ScriptTemplate) => {
        const toneMap = {
          professional: { text: '专业', color: 'blue' },
          friendly: { text: '友好', color: 'green' },
          warm: { text: '温暖', color: 'orange' },
          formal: { text: '正式', color: 'purple' },
          casual: { text: '随意', color: 'default' }
        }
        const config = toneMap[record.style.tone]
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: '句式习惯',
      key: 'sentencePattern',
      width: 120,
      render: (_, record: ScriptTemplate) => {
        const patternMap = {
          direct: '直接',
          indirect: '间接',
          question: '疑问',
          suggestion: '建议'
        }
        return <span>{patternMap[record.style.sentencePattern]}</span>
      }
    },
    {
      title: '安全级别',
      key: 'safetyLevel',
      width: 120,
      render: (_, record: ScriptTemplate) => {
        const levelMap = {
          high: { text: '高', color: 'red' },
          medium: { text: '中', color: 'orange' },
          low: { text: '低', color: 'green' }
        }
        const config = levelMap[record.safety.level]
        return (
          <Badge
            status={config.color as any}
            text={config.text}
          />
        )
      }
    },
    {
      title: '使用次数',
      dataIndex: 'usageCount',
      key: 'usageCount',
      width: 100,
      sorter: (a, b) => (b.usageCount || 0) - (a.usageCount || 0),
      render: (count: number) => count || 0
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ScriptStatus, record: ScriptTemplate) => (
        <Switch
          checked={status === 'enabled'}
          onChange={(checked) => handleScriptStatusChange(record.id, checked)}
          checkedChildren="启用"
          unCheckedChildren="停用"
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record: ScriptTemplate) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewScript(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditScript(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<CopyOutlined />}
            onClick={() => handleCopyScript(record)}
          >
            复制
          </Button>
          <Popconfirm
            title="确定要删除这个话术吗？"
            onConfirm={() => handleDeleteScript(record.id)}
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

  // 过滤后的数据
  const filteredIntents = React.useMemo(() => {
    if (!searchText.trim()) {
      return intents
    }
    const lowerSearch = searchText.toLowerCase()
    return intents.filter(intent =>
      intent.name.toLowerCase().includes(lowerSearch) ||
      intent.keywords.some(k => k.toLowerCase().includes(lowerSearch)) ||
      intent.examples.some(e => e.toLowerCase().includes(lowerSearch))
    )
  }, [intents, searchText])

  const filteredScripts = React.useMemo(() => {
    if (!searchText.trim()) {
      return scripts
    }
    const lowerSearch = searchText.toLowerCase()
    return scripts.filter(script =>
      script.title.toLowerCase().includes(lowerSearch) ||
      script.intentName?.toLowerCase().includes(lowerSearch) ||
      script.content.toLowerCase().includes(lowerSearch)
    )
  }, [scripts, searchText])

  // 处理意图编辑
  const handleEditIntent = (intent?: Intent) => {
    if (intent) {
      setEditingIntent(intent)
      intentForm.setFieldsValue({
        ...intent,
        keywords: intent.keywords.join('\n'),
        examples: intent.examples.join('\n')
      })
    } else {
      setEditingIntent(null)
      intentForm.resetFields()
    }
    setIntentModalVisible(true)
  }

  // 处理意图删除
  const handleDeleteIntent = (id: string) => {
    setIntents(intents.filter(i => i.id !== id))
    // 同时删除关联的话术
    setScripts(scripts.filter(s => s.intentId !== id))
    message.success('删除成功')
  }

  // 处理意图保存
  const handleSaveIntent = async () => {
    try {
      const values = await intentForm.validateFields()
      const keywords = values.keywords.split('\n').filter((k: string) => k.trim())
      const examples = values.examples.split('\n').filter((e: string) => e.trim())

      if (editingIntent) {
        setIntents(intents.map(i =>
          i.id === editingIntent.id
            ? {
                ...i,
                ...values,
                keywords,
                examples,
                updatedAt: new Date().toISOString()
              }
            : i
        ))
        message.success('更新成功')
      } else {
        const newIntent: Intent = {
          id: `intent_${Date.now()}`,
          ...values,
          keywords,
          examples,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setIntents([...intents, newIntent])
        message.success('创建成功')
      }
      setIntentModalVisible(false)
      intentForm.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 处理话术编辑
  const handleEditScript = (script?: ScriptTemplate) => {
    if (script) {
      setEditingScript(script)
      scriptForm.setFieldsValue({
        ...script,
        tone: script.style.tone,
        sentencePattern: script.style.sentencePattern,
        length: script.style.length,
        safetyLevel: script.safety.level,
        boundaries: script.safety.boundaries.join('\n'),
        warnings: script.safety.warnings?.join('\n') || ''
      })
    } else {
      setEditingScript(null)
      scriptForm.resetFields()
    }
    setScriptModalVisible(true)
  }

  // 处理话术查看
  const handleViewScript = (script: ScriptTemplate) => {
    handleEditScript(script)
    // 可以设置为只读模式
  }

  // 处理话术复制
  const handleCopyScript = (script: ScriptTemplate) => {
    const newScript: ScriptTemplate = {
      ...script,
      id: `script_${Date.now()}`,
      title: `${script.title} (副本)`,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setScripts([...scripts, newScript])
    message.success('复制成功')
  }

  // 处理话术删除
  const handleDeleteScript = (id: string) => {
    setScripts(scripts.filter(s => s.id !== id))
    message.success('删除成功')
  }

  // 处理话术状态切换
  const handleScriptStatusChange = (id: string, enabled: boolean) => {
    setScripts(scripts.map(s =>
      s.id === id ? { ...s, status: enabled ? 'enabled' : 'disabled' } : s
    ))
    message.success(enabled ? '话术已启用' : '话术已停用')
  }

  // 处理话术保存
  const handleSaveScript = async () => {
    try {
      const values = await scriptForm.validateFields()
      const intent = intents.find(i => i.id === values.intentId)

      const boundaries = values.boundaries.split('\n').filter((b: string) => b.trim())
      const warnings = values.warnings ? values.warnings.split('\n').filter((w: string) => w.trim()) : []

      const scriptData: ScriptTemplate = {
        id: editingScript?.id || `script_${Date.now()}`,
        title: values.title,
        intentId: values.intentId,
        intentName: intent?.name,
        content: values.content,
        variables: extractVariables(values.content),
        style: {
          tone: values.tone,
          sentencePattern: values.sentencePattern,
          length: values.length
        },
        safety: {
          level: values.safetyLevel,
          boundaries,
          warnings: warnings.length > 0 ? warnings : undefined
        },
        status: values.status ? 'enabled' : 'disabled',
        usageCount: editingScript?.usageCount || 0,
        createdAt: editingScript?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (editingScript) {
        setScripts(scripts.map(s => s.id === editingScript.id ? scriptData : s))
        message.success('更新成功')
      } else {
        setScripts([...scripts, scriptData])
        message.success('创建成功')
      }
      setScriptModalVisible(false)
      scriptForm.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 提取变量（从内容中提取 {variableName} 格式的变量）
  const extractVariables = (content: string): string[] => {
    const regex = /\{(\w+)\}/g
    const matches = content.matchAll(regex)
    const variables = new Set<string>()
    for (const match of matches) {
      variables.add(match[1])
    }
    return Array.from(variables)
  }

  // 处理查看映射关系
  const handleViewMapping = (intent: Intent) => {
    setSelectedIntent(intent)
    setMappingModalVisible(true)
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder="搜索意图名称、关键词或话术标题"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Space>
          <Space>
            {activeTab === 'intent' && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleEditIntent()}>
                新建意图
              </Button>
            )}
            {activeTab === 'script' && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleEditScript()}>
                新建话术
              </Button>
            )}
          </Space>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key as 'intent' | 'script')
            setSearchText('')
          }}
        >
          <TabPane
            tab={
              <span>
                <BulbOutlined />
                意图管理
              </span>
            }
            key="intent"
          />
          <TabPane
            tab={
              <span>
                <FileTextOutlined />
                话术模版
              </span>
            }
            key="script"
          />
        </Tabs>

        {activeTab === 'intent' ? (
          <Table
            columns={intentColumns}
            dataSource={filteredIntents}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1400 }}
            pagination={{
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 个意图`
            }}
          />
        ) : (
          <Table
            columns={scriptColumns}
            dataSource={filteredScripts}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1400 }}
            pagination={{
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 个话术模版`
            }}
          />
        )}
      </Card>

      {/* 意图编辑弹窗 */}
      <Modal
        title={editingIntent ? '编辑意图' : '新建意图'}
        open={intentModalVisible}
        onCancel={() => {
          setIntentModalVisible(false)
          intentForm.resetFields()
        }}
        onOk={handleSaveIntent}
        width={700}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={intentForm} layout="vertical">
          <Form.Item
            label="意图名称"
            name="name"
            rules={[{ required: true, message: '请输入意图名称' }]}
          >
            <Input placeholder="例如：根治询问" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="分类"
                name="category"
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <Input placeholder="例如：治疗效果" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="类型"
                name="type"
                rules={[{ required: true, message: '请选择类型' }]}
              >
                <Select>
                  <Option value="question">问题</Option>
                  <Option value="complaint">投诉</Option>
                  <Option value="consultation">咨询</Option>
                  <Option value="purchase">购买</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="关键词"
            name="keywords"
            rules={[{ required: true, message: '请输入关键词' }]}
            tooltip="每行一个关键词，用于匹配用户问题"
            extra="每行输入一个关键词，例如：根治、彻底、完全"
          >
            <TextArea
              rows={4}
              placeholder="根治&#10;彻底&#10;完全&#10;永久"
            />
          </Form.Item>

          <Form.Item
            label="示例问题"
            name="examples"
            rules={[{ required: true, message: '请输入示例问题' }]}
            tooltip="用户可能提出的问题示例，用于训练和测试"
            extra="每行输入一个示例问题，例如：能根治吗？"
          >
            <TextArea
              rows={4}
              placeholder="能根治吗？&#10;可以彻底解决吗？&#10;会不会复发？"
            />
          </Form.Item>

          <Form.Item
            label="优先级"
            name="priority"
            rules={[{ required: true, message: '请输入优先级' }]}
            tooltip="数字越大优先级越高，匹配时优先使用高优先级的意图"
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 话术编辑弹窗 */}
      <Modal
        title={editingScript ? '编辑话术模版' : '新建话术模版'}
        open={scriptModalVisible}
        onCancel={() => {
          setScriptModalVisible(false)
          scriptForm.resetFields()
        }}
        onOk={handleSaveScript}
        width={900}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={scriptForm} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="话术标题"
                name="title"
                rules={[{ required: true, message: '请输入话术标题' }]}
              >
                <Input placeholder="例如：根治询问-专业回答" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="状态"
                name="status"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="启用" unCheckedChildren="停用" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="关联意图"
            name="intentId"
            rules={[{ required: true, message: '请选择关联意图' }]}
            tooltip="选择此话术模版对应的用户意图"
          >
            <Select placeholder="请选择意图">
              {intents.map(intent => (
                <Option key={intent.id} value={intent.id}>
                  {intent.name} ({intent.category})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="话术内容"
            name="content"
            rules={[{ required: true, message: '请输入话术内容' }]}
            tooltip="支持使用变量，格式：{variableName}，例如：{userName}、{productName}"
            extra="使用 {变量名} 格式插入动态变量，例如：{userName}、{productName}、{problemType}"
          >
            <TextArea
              rows={6}
              placeholder="请输入话术内容，支持变量：{userName}、{productName} 等"
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Divider orientation="left">回答风格</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="语气风格"
                name="tone"
                rules={[{ required: true, message: '请选择语气风格' }]}
              >
                <Select>
                  <Option value="professional">专业</Option>
                  <Option value="friendly">友好</Option>
                  <Option value="warm">温暖</Option>
                  <Option value="formal">正式</Option>
                  <Option value="casual">随意</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="句式习惯"
                name="sentencePattern"
                rules={[{ required: true, message: '请选择句式习惯' }]}
              >
                <Select>
                  <Option value="direct">直接</Option>
                  <Option value="indirect">间接</Option>
                  <Option value="question">疑问</Option>
                  <Option value="suggestion">建议</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="回答长度"
                name="length"
                rules={[{ required: true, message: '请选择回答长度' }]}
              >
                <Select>
                  <Option value="short">简短</Option>
                  <Option value="medium">中等</Option>
                  <Option value="long">详细</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            <SafetyOutlined /> 安全边界
          </Divider>

          <Form.Item
            label="安全级别"
            name="safetyLevel"
            rules={[{ required: true, message: '请选择安全级别' }]}
          >
            <Radio.Group>
              <Radio value="high">
                <Badge status="error" text="高" /> 高风险场景，需要严格限制
              </Radio>
              <Radio value="medium">
                <Badge status="warning" text="中" /> 中等风险，需要谨慎表达
              </Radio>
              <Radio value="low">
                <Badge status="success" text="低" /> 低风险，常规表达即可
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="禁止使用的词汇/表达"
            name="boundaries"
            tooltip="每行一个，话术内容中不得包含这些词汇"
            extra="每行输入一个禁止使用的词汇或表达，例如：根治、彻底、永久、100%、保证"
          >
            <TextArea
              rows={4}
              placeholder="根治&#10;彻底&#10;永久&#10;100%&#10;保证"
            />
          </Form.Item>

          <Form.Item
            label="警告提示"
            name="warnings"
            tooltip="使用此话术时的注意事项"
            extra="每行输入一个警告提示，用于提醒使用此话术的注意事项"
          >
            <TextArea
              rows={3}
              placeholder="避免使用绝对化表述&#10;不得承诺治疗效果"
            />
          </Form.Item>

          {scriptForm.getFieldValue('content') && (
            <Alert
              message="检测到的变量"
              description={
                <Space wrap>
                  {extractVariables(scriptForm.getFieldValue('content')).map(variable => (
                    <Tag key={variable} color="blue">{`{${variable}}`}</Tag>
                  ))}
                  {extractVariables(scriptForm.getFieldValue('content')).length === 0 && (
                    <span style={{ color: '#999' }}>未检测到变量</span>
                  )}
                </Space>
              }
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </Form>
      </Modal>

      {/* 意图到话术映射弹窗 */}
      <Modal
        title={`意图"${selectedIntent?.name}"的话术映射`}
        open={mappingModalVisible}
        onCancel={() => {
          setMappingModalVisible(false)
          setSelectedIntent(null)
        }}
        footer={[
          <Button key="close" onClick={() => {
            setMappingModalVisible(false)
            setSelectedIntent(null)
          }}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedIntent && (
          <div>
            <Alert
              message="意图信息"
              description={
                <div>
                  <p><strong>名称：</strong>{selectedIntent.name}</p>
                  <p><strong>分类：</strong>{selectedIntent.category}</p>
                  <p><strong>示例问题：</strong>{selectedIntent.examples.join('；')}</p>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Table
              columns={[
                {
                  title: '话术标题',
                  dataIndex: 'title',
                  key: 'title'
                },
                {
                  title: '语气风格',
                  key: 'tone',
                  render: (_, record: ScriptTemplate) => {
                    const toneMap = {
                      professional: '专业',
                      friendly: '友好',
                      warm: '温暖',
                      formal: '正式',
                      casual: '随意'
                    }
                    return <Tag>{toneMap[record.style.tone]}</Tag>
                  }
                },
                {
                  title: '安全级别',
                  key: 'safetyLevel',
                  render: (_, record: ScriptTemplate) => {
                    const levelMap = {
                      high: { text: '高', color: 'red' },
                      medium: { text: '中', color: 'orange' },
                      low: { text: '低', color: 'green' }
                    }
                    const config = levelMap[record.safety.level]
                    return <Badge status={config.color as any} text={config.text} />
                  }
                },
                {
                  title: '使用次数',
                  dataIndex: 'usageCount',
                  key: 'usageCount',
                  render: (count: number) => count || 0
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: ScriptStatus) => (
                    <Tag color={status === 'enabled' ? 'green' : 'default'}>
                      {status === 'enabled' ? '启用' : '停用'}
                    </Tag>
                  )
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (_, record: ScriptTemplate) => (
                    <Space>
                      <Button
                        type="link"
                        onClick={() => {
                          setMappingModalVisible(false)
                          handleEditScript(record)
                        }}
                      >
                        编辑
                      </Button>
                    </Space>
                  )
                }
              ]}
              dataSource={scripts.filter(s => s.intentId === selectedIntent.id)}
              rowKey="id"
              pagination={false}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ScriptLibrary
