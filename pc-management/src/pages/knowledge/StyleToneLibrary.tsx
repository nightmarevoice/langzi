import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
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
  InputNumber,
  Tooltip,
  Badge,
  Alert
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  LinkOutlined,
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input

// 句子长度类型
type SentenceLength = 'short' | 'medium' | 'long' | 'custom'

// 风格预设接口
interface StylePreset {
  id: string
  name: string // 风格名称，如"专业医生风"、"闺蜜聊天风"
  description?: string // 风格描述
  exampleAnswers: string[] // 示例回答语气样本
  rules: {
    sentenceLength: {
      type: SentenceLength
      minWords?: number // 自定义最小字数
      maxWords?: number // 自定义最大字数
    }
    allowEmoji: boolean // 是否允许使用表情符号
    forbiddenWords: string[] // 禁用词列表
    sensitiveReplacements: Array<{
      original: string // 原始敏感表达
      replacement: string // 替换后的表达
    }>
  }
  status: 'enabled' | 'disabled'
  usageCount?: number // 使用次数
  createdAt: string
  updatedAt: string
}

// 渠道类型
type ChannelType = 'marketing' | 'customer_service' | 'consultation' | 'sales' | 'other'

// 活动类型
type ActivityType = 'promotion' | 'campaign' | 'event' | 'normal'

// 绑定配置接口
interface StyleBinding {
  id: string
  channel: ChannelType // 渠道
  channelName: string // 渠道名称
  activityType?: ActivityType // 活动类型（可选）
  activityName?: string // 活动名称（可选）
  styleId: string // 绑定的风格ID
  styleName: string // 风格名称（用于显示）
  priority: number // 优先级（数字越大优先级越高）
  status: 'enabled' | 'disabled'
  createdAt: string
  updatedAt: string
}

const StyleToneLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'preset' | 'binding'>('preset')
  const [presets, setPresets] = useState<StylePreset[]>([])
  const [bindings, setBindings] = useState<StyleBinding[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [presetModalVisible, setPresetModalVisible] = useState(false)
  const [bindingModalVisible, setBindingModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editingPreset, setEditingPreset] = useState<StylePreset | null>(null)
  const [editingBinding, setEditingBinding] = useState<StyleBinding | null>(null)
  const [viewingPreset, setViewingPreset] = useState<StylePreset | null>(null)
  const [presetForm] = Form.useForm()
  const [bindingForm] = Form.useForm()

  // Mock数据
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setPresets([
        {
          id: 'preset1',
          name: '专业医生风',
          description: '专业、严谨、权威的医疗咨询风格',
          exampleAnswers: [
            '根据您的描述，建议您先进行皮肤检测，以便我们为您提供更精准的诊疗方案。',
            '从医学角度来看，这个问题需要综合考虑多个因素，包括您的肤质、使用历史等。',
            '基于临床经验，我们建议您采用分阶段治疗方案，这样可以更好地控制风险。'
          ],
          rules: {
            sentenceLength: {
              type: 'medium',
              minWords: 20,
              maxWords: 50
            },
            allowEmoji: false,
            forbiddenWords: ['根治', '彻底', '永久', '100%', '保证', '绝对'],
            sensitiveReplacements: [
              { original: '根治', replacement: '有效改善' },
              { original: '彻底解决', replacement: '显著改善' },
              { original: '保证', replacement: '建议' }
            ]
          },
          status: 'enabled',
          usageCount: 234,
          createdAt: '2025-01-01 10:00:00',
          updatedAt: '2025-01-10 15:30:00'
        },
        {
          id: 'preset2',
          name: '闺蜜聊天风',
          description: '亲切、友好、轻松的聊天风格',
          exampleAnswers: [
            '哎呀，这个问题我也遇到过呢！😊 其实不用太担心，慢慢来就好~',
            '姐妹，我懂你的感受！这个产品我用过，效果还不错哦，你可以试试看~',
            '哈哈，这个问题问得好！让我来给你分享一下我的经验吧~'
          ],
          rules: {
            sentenceLength: {
              type: 'short',
              minWords: 10,
              maxWords: 30
            },
            allowEmoji: true,
            forbiddenWords: ['根治', '彻底', '永久'],
            sensitiveReplacements: [
              { original: '根治', replacement: '改善' },
              { original: '彻底', replacement: '很好地' }
            ]
          },
          status: 'enabled',
          usageCount: 156,
          createdAt: '2025-01-02 09:00:00',
          updatedAt: '2025-01-08 11:20:00'
        },
        {
          id: 'preset3',
          name: '营销活动风',
          description: '活泼、热情、有感染力的营销风格',
          exampleAnswers: [
            '🎉 限时优惠活动正在进行中！现在购买可享受超值折扣，机会难得，不要错过哦！',
            '这款产品深受用户喜爱，好评如潮！现在下单还有精美礼品相送~',
            '新用户专享福利来啦！首次购买享受特别优惠，快来体验吧！'
          ],
          rules: {
            sentenceLength: {
              type: 'medium',
              minWords: 15,
              maxWords: 40
            },
            allowEmoji: true,
            forbiddenWords: ['根治', '彻底', '永久', '保证'],
            sensitiveReplacements: [
              { original: '根治', replacement: '有效改善' },
              { original: '保证', replacement: '推荐' }
            ]
          },
          status: 'enabled',
          usageCount: 189,
          createdAt: '2025-01-03 14:00:00',
          updatedAt: '2025-01-05 16:00:00'
        },
        {
          id: 'preset4',
          name: '普通客服风',
          description: '专业、礼貌、标准化的客服风格',
          exampleAnswers: [
            '您好，感谢您的咨询。关于您的问题，我为您详细说明一下。',
            '根据您的需求，我为您推荐以下方案，您可以参考一下。',
            '如果您还有其他疑问，欢迎随时联系我们，我们会竭诚为您服务。'
          ],
          rules: {
            sentenceLength: {
              type: 'medium',
              minWords: 20,
              maxWords: 50
            },
            allowEmoji: false,
            forbiddenWords: ['根治', '彻底', '永久', '100%', '保证'],
            sensitiveReplacements: [
              { original: '根治', replacement: '有效改善' },
              { original: '彻底', replacement: '显著' },
              { original: '保证', replacement: '建议' }
            ]
          },
          status: 'enabled',
          usageCount: 567,
          createdAt: '2025-01-04 10:00:00',
          updatedAt: '2025-01-06 14:00:00'
        }
      ])

      setBindings([
        {
          id: 'binding1',
          channel: 'marketing',
          channelName: '营销渠道',
          activityType: 'promotion',
          activityName: '限时促销活动',
          styleId: 'preset3',
          styleName: '营销活动风',
          priority: 10,
          status: 'enabled',
          createdAt: '2025-01-01 10:00:00',
          updatedAt: '2025-01-10 15:30:00'
        },
        {
          id: 'binding2',
          channel: 'customer_service',
          channelName: '客服渠道',
          activityType: 'normal',
          activityName: '普通客服',
          styleId: 'preset4',
          styleName: '普通客服风',
          priority: 8,
          status: 'enabled',
          createdAt: '2025-01-02 09:00:00',
          updatedAt: '2025-01-08 11:20:00'
        },
        {
          id: 'binding3',
          channel: 'consultation',
          channelName: '咨询渠道',
          activityType: 'normal',
          activityName: '医疗咨询',
          styleId: 'preset1',
          styleName: '专业医生风',
          priority: 9,
          status: 'enabled',
          createdAt: '2025-01-03 14:00:00',
          updatedAt: '2025-01-05 16:00:00'
        }
      ])
      setLoading(false)
    }, 500)
  }, [])

  // 过滤后的数据
  const filteredPresets = React.useMemo(() => {
    if (!searchText.trim()) {
      return presets
    }
    const lowerSearch = searchText.toLowerCase()
    return presets.filter(preset =>
      preset.name.toLowerCase().includes(lowerSearch) ||
      preset.description?.toLowerCase().includes(lowerSearch) ||
      preset.exampleAnswers.some(e => e.toLowerCase().includes(lowerSearch))
    )
  }, [presets, searchText])

  const filteredBindings = React.useMemo(() => {
    if (!searchText.trim()) {
      return bindings
    }
    const lowerSearch = searchText.toLowerCase()
    return bindings.filter(binding =>
      binding.channelName.toLowerCase().includes(lowerSearch) ||
      binding.activityName?.toLowerCase().includes(lowerSearch) ||
      binding.styleName.toLowerCase().includes(lowerSearch)
    )
  }, [bindings, searchText])

  // 风格预设表格列
  const presetColumns: ColumnsType<StylePreset> = [
    {
      title: '风格名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text, record) => (
        <Space>
          <span>{text}</span>
          {record.status === 'enabled' && (
            <Badge status="success" text="启用" />
          )}
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true
    },
    {
      title: '规则配置',
      key: 'rules',
      width: 250,
      render: (_, record) => (
        <Space direction="vertical" size="small" style={{ fontSize: '12px' }}>
          <div>
            <Tag color="blue">长度: {record.rules.sentenceLength.type === 'custom' 
              ? `${record.rules.sentenceLength.minWords}-${record.rules.sentenceLength.maxWords}字`
              : record.rules.sentenceLength.type === 'short' ? '短句'
              : record.rules.sentenceLength.type === 'medium' ? '中句'
              : '长句'}</Tag>
          </div>
          <div>
            <Tag color={record.rules.allowEmoji ? 'green' : 'default'}>
              表情: {record.rules.allowEmoji ? '允许' : '禁止'}
            </Tag>
            <Tag color="orange">禁用词: {record.rules.forbiddenWords.length}个</Tag>
          </div>
        </Space>
      )
    },
    {
      title: '示例样本',
      key: 'examples',
      width: 200,
      render: (_, record) => (
        <Tooltip
          title={
            <div>
              {record.exampleAnswers.slice(0, 2).map((example, idx) => (
                <div key={idx} style={{ marginBottom: 8, maxWidth: 300 }}>
                  {example}
                </div>
              ))}
              {record.exampleAnswers.length > 2 && (
                <div>...还有 {record.exampleAnswers.length - 2} 个示例</div>
              )}
            </div>
          }
        >
          <Button type="link" icon={<FileTextOutlined />} size="small">
            查看示例 ({record.exampleAnswers.length})
          </Button>
        </Tooltip>
      )
    },
    {
      title: '使用次数',
      dataIndex: 'usageCount',
      key: 'usageCount',
      width: 100,
      render: (count) => count || 0
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
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewPreset(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditPreset(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个风格预设吗？"
            onConfirm={() => handleDeletePreset(record.id)}
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

  // 绑定配置表格列
  const bindingColumns: ColumnsType<StyleBinding> = [
    {
      title: '渠道',
      dataIndex: 'channelName',
      key: 'channelName',
      width: 120,
      render: (text, record) => (
        <Tag color="blue">{text}</Tag>
      )
    },
    {
      title: '活动类型',
      dataIndex: 'activityName',
      key: 'activityName',
      width: 150,
      render: (text, record) => (
        <Space>
          {text && <Tag color="purple">{text}</Tag>}
          {record.activityType && (
            <Tag color="cyan">{record.activityType === 'promotion' ? '促销'
              : record.activityType === 'campaign' ? '活动'
              : record.activityType === 'event' ? '事件'
              : '普通'}</Tag>
          )}
        </Space>
      )
    },
    {
      title: '绑定风格',
      dataIndex: 'styleName',
      key: 'styleName',
      width: 150,
      render: (text) => (
        <Tag color="green">{text}</Tag>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => (
        <Badge count={priority} style={{ backgroundColor: '#52c41a' }} />
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'enabled' ? 'success' : 'default'}>
          {status === 'enabled' ? '启用' : '禁用'}
        </Tag>
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
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditBinding(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个绑定配置吗？"
            onConfirm={() => handleDeleteBinding(record.id)}
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

  // 处理查看风格预设
  const handleViewPreset = (preset: StylePreset) => {
    setViewingPreset(preset)
    setViewModalVisible(true)
  }

  // 处理编辑风格预设
  const handleEditPreset = (preset?: StylePreset) => {
    if (preset) {
      setEditingPreset(preset)
      presetForm.setFieldsValue({
        ...preset,
        sentenceLengthType: preset.rules.sentenceLength.type,
        minWords: preset.rules.sentenceLength.minWords,
        maxWords: preset.rules.sentenceLength.maxWords,
        allowEmoji: preset.rules.allowEmoji,
        forbiddenWords: preset.rules.forbiddenWords.join('\n'),
        sensitiveReplacements: preset.rules.sensitiveReplacements.map(r => 
          `${r.original} => ${r.replacement}`
        ).join('\n')
      })
    } else {
      setEditingPreset(null)
      presetForm.resetFields()
    }
    setPresetModalVisible(true)
  }

  // 处理删除风格预设
  const handleDeletePreset = (id: string) => {
    setPresets(presets.filter(p => p.id !== id))
    message.success('删除成功')
  }

  // 处理保存风格预设
  const handleSavePreset = async () => {
    try {
      const values = await presetForm.validateFields()
      
      const rules = {
        sentenceLength: {
          type: values.sentenceLengthType,
          minWords: values.sentenceLengthType === 'custom' ? values.minWords : undefined,
          maxWords: values.sentenceLengthType === 'custom' ? values.maxWords : undefined
        },
        allowEmoji: values.allowEmoji,
        forbiddenWords: values.forbiddenWords
          ? values.forbiddenWords.split('\n').filter(w => w.trim())
          : [],
        sensitiveReplacements: values.sensitiveReplacements
          ? values.sensitiveReplacements.split('\n')
              .filter(r => r.trim())
              .map(r => {
                const parts = r.split('=>').map(s => s.trim())
                return {
                  original: parts[0],
                  replacement: parts[1] || parts[0]
                }
              })
          : []
      }

      const presetData: StylePreset = {
        id: editingPreset?.id || `preset${Date.now()}`,
        name: values.name,
        description: values.description,
        exampleAnswers: values.exampleAnswers
          ? values.exampleAnswers.split('\n').filter(e => e.trim())
          : [],
        rules,
        status: values.status || 'enabled',
        usageCount: editingPreset?.usageCount || 0,
        createdAt: editingPreset?.createdAt || new Date().toLocaleString('zh-CN'),
        updatedAt: new Date().toLocaleString('zh-CN')
      }

      if (editingPreset) {
        setPresets(presets.map(p => p.id === editingPreset.id ? presetData : p))
        message.success('更新成功')
      } else {
        setPresets([...presets, presetData])
        message.success('创建成功')
      }

      setPresetModalVisible(false)
      presetForm.resetFields()
      setEditingPreset(null)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 处理编辑绑定配置
  const handleEditBinding = (binding?: StyleBinding) => {
    if (binding) {
      setEditingBinding(binding)
      bindingForm.setFieldsValue(binding)
    } else {
      setEditingBinding(null)
      bindingForm.resetFields()
    }
    setBindingModalVisible(true)
  }

  // 处理删除绑定配置
  const handleDeleteBinding = (id: string) => {
    setBindings(bindings.filter(b => b.id !== id))
    message.success('删除成功')
  }

  // 处理保存绑定配置
  const handleSaveBinding = async () => {
    try {
      const values = await bindingForm.validateFields()
      
      const style = presets.find(p => p.id === values.styleId)
      
      const bindingData: StyleBinding = {
        id: editingBinding?.id || `binding${Date.now()}`,
        channel: values.channel,
        channelName: values.channel === 'marketing' ? '营销渠道'
          : values.channel === 'customer_service' ? '客服渠道'
          : values.channel === 'consultation' ? '咨询渠道'
          : values.channel === 'sales' ? '销售渠道'
          : '其他渠道',
        activityType: values.activityType,
        activityName: values.activityName,
        styleId: values.styleId,
        styleName: style?.name || '',
        priority: values.priority,
        status: values.status || 'enabled',
        createdAt: editingBinding?.createdAt || new Date().toLocaleString('zh-CN'),
        updatedAt: new Date().toLocaleString('zh-CN')
      }

      if (editingBinding) {
        setBindings(bindings.map(b => b.id === editingBinding.id ? bindingData : b))
        message.success('更新成功')
      } else {
        setBindings([...bindings, bindingData])
        message.success('创建成功')
      }

      setBindingModalVisible(false)
      bindingForm.resetFields()
      setEditingBinding(null)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Alert
            message="风格语气库"
            description="控制整体回答风格，一处配置，多处复用。可以配置风格预设、规则配置和渠道绑定。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        </div>

        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as 'preset' | 'binding')}>
          <TabPane tab="风格预设" key="preset">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Space>
                <Input
                  placeholder="搜索风格名称、描述或示例"
                  prefix={<SearchOutlined />}
                  style={{ width: 300 }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleEditPreset()}
              >
                新增风格预设
              </Button>
            </div>

            <Table
              columns={presetColumns}
              dataSource={filteredPresets}
              rowKey="id"
              loading={loading}
              scroll={{ x: 1200 }}
              pagination={{
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 个风格预设`
              }}
            />
          </TabPane>

          <TabPane tab="渠道绑定" key="binding">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Space>
                <Input
                  placeholder="搜索渠道、活动或风格名称"
                  prefix={<SearchOutlined />}
                  style={{ width: 300 }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleEditBinding()}
              >
                新增绑定配置
              </Button>
            </div>

            <Table
              columns={bindingColumns}
              dataSource={filteredBindings}
              rowKey="id"
              loading={loading}
              scroll={{ x: 1000 }}
              pagination={{
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 个绑定配置`
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 风格预设编辑弹窗 */}
      <Modal
        title={editingPreset ? '编辑风格预设' : '新建风格预设'}
        open={presetModalVisible}
        onOk={handleSavePreset}
        onCancel={() => {
          setPresetModalVisible(false)
          presetForm.resetFields()
          setEditingPreset(null)
        }}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={presetForm}
          layout="vertical"
          initialValues={{
            sentenceLengthType: 'medium',
            allowEmoji: false,
            status: 'enabled'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="风格名称"
                name="name"
                rules={[{ required: true, message: '请输入风格名称' }]}
              >
                <Input placeholder="如：专业医生风、闺蜜聊天风" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="状态"
                name="status"
              >
                <Select>
                  <Option value="enabled">启用</Option>
                  <Option value="disabled">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="风格描述"
            name="description"
          >
            <TextArea
              rows={2}
              placeholder="描述这个风格的特点和适用场景"
            />
          </Form.Item>

          <Form.Item
            label="示例回答语气样本"
            name="exampleAnswers"
            rules={[{ required: true, message: '请输入至少一个示例回答' }]}
            extra="每行一个示例，用于展示这个风格的语气特点"
          >
            <TextArea
              rows={4}
              placeholder="每行输入一个示例回答，例如：&#10;根据您的描述，建议您先进行皮肤检测...&#10;从医学角度来看，这个问题需要综合考虑..."
            />
          </Form.Item>

          <Divider orientation="left">规则配置</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="句子长度"
                name="sentenceLengthType"
                rules={[{ required: true, message: '请选择句子长度类型' }]}
              >
                <Select>
                  <Option value="short">短句（10-30字）</Option>
                  <Option value="medium">中句（20-50字）</Option>
                  <Option value="long">长句（50-100字）</Option>
                  <Option value="custom">自定义</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="允许使用表情符号"
                name="allowEmoji"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.sentenceLengthType !== currentValues.sentenceLengthType
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('sentenceLengthType') === 'custom' ? (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="最小字数"
                      name="minWords"
                      rules={[{ required: true, message: '请输入最小字数' }]}
                    >
                      <InputNumber min={1} max={1000} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="最大字数"
                      name="maxWords"
                      rules={[{ required: true, message: '请输入最大字数' }]}
                    >
                      <InputNumber min={1} max={1000} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null
            }
          </Form.Item>

          <Form.Item
            label="禁用词列表"
            name="forbiddenWords"
            extra="每行一个禁用词，这些词汇在生成回答时将被禁止使用"
          >
            <TextArea
              rows={3}
              placeholder="每行输入一个禁用词，例如：&#10;根治&#10;彻底&#10;永久&#10;100%&#10;保证"
            />
          </Form.Item>

          <Form.Item
            label="敏感表达替换规则"
            name="sensitiveReplacements"
            extra="每行一个替换规则，格式：原始表达 => 替换表达"
          >
            <TextArea
              rows={3}
              placeholder="每行输入一个替换规则，例如：&#10;根治 => 有效改善&#10;彻底解决 => 显著改善&#10;保证 => 建议"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 绑定配置编辑弹窗 */}
      <Modal
        title={editingBinding ? '编辑绑定配置' : '新建绑定配置'}
        open={bindingModalVisible}
        onOk={handleSaveBinding}
        onCancel={() => {
          setBindingModalVisible(false)
          bindingForm.resetFields()
          setEditingBinding(null)
        }}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={bindingForm}
          layout="vertical"
          initialValues={{
            status: 'enabled',
            priority: 5
          }}
        >
          <Form.Item
            label="渠道"
            name="channel"
            rules={[{ required: true, message: '请选择渠道' }]}
          >
            <Select placeholder="选择渠道">
              <Option value="marketing">营销渠道</Option>
              <Option value="customer_service">客服渠道</Option>
              <Option value="consultation">咨询渠道</Option>
              <Option value="sales">销售渠道</Option>
              <Option value="other">其他渠道</Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="活动类型"
                name="activityType"
              >
                <Select placeholder="选择活动类型（可选）">
                  <Option value="promotion">促销</Option>
                  <Option value="campaign">活动</Option>
                  <Option value="event">事件</Option>
                  <Option value="normal">普通</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="活动名称"
                name="activityName"
              >
                <Input placeholder="输入活动名称（可选）" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="绑定风格"
            name="styleId"
            rules={[{ required: true, message: '请选择要绑定的风格' }]}
          >
            <Select placeholder="选择风格预设">
              {presets.filter(p => p.status === 'enabled').map(preset => (
                <Option key={preset.id} value={preset.id}>
                  {preset.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="优先级"
                name="priority"
                rules={[{ required: true, message: '请输入优先级' }]}
                extra="数字越大优先级越高"
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="状态"
                name="status"
              >
                <Select>
                  <Option value="enabled">启用</Option>
                  <Option value="disabled">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 查看风格预设详情弹窗 */}
      <Modal
        title="风格预设详情"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false)
          setViewingPreset(null)
        }}
        width={800}
        footer={[
          <Button key="edit" type="primary" onClick={() => {
            setViewModalVisible(false)
            if (viewingPreset) {
              handleEditPreset(viewingPreset)
            }
          }}>
            编辑
          </Button>,
          <Button key="close" onClick={() => {
            setViewModalVisible(false)
            setViewingPreset(null)
          }}>
            关闭
          </Button>
        ]}
      >
        {viewingPreset && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <div><strong>风格名称：</strong>{viewingPreset.name}</div>
              </Col>
              <Col span={12}>
                <div>
                  <strong>状态：</strong>
                  <Tag color={viewingPreset.status === 'enabled' ? 'success' : 'default'}>
                    {viewingPreset.status === 'enabled' ? '启用' : '禁用'}
                  </Tag>
                </div>
              </Col>
            </Row>

            {viewingPreset.description && (
              <div style={{ marginBottom: 16 }}>
                <strong>描述：</strong>{viewingPreset.description}
              </div>
            )}

            <Divider orientation="left">示例回答语气样本</Divider>
            <div style={{ marginBottom: 16 }}>
              {viewingPreset.exampleAnswers.map((example, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    marginBottom: '8px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {example}
                </div>
              ))}
            </div>

            <Divider orientation="left">规则配置</Divider>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <div>
                  <strong>句子长度：</strong>
                  <Tag color="blue">
                    {viewingPreset.rules.sentenceLength.type === 'custom'
                      ? `${viewingPreset.rules.sentenceLength.minWords}-${viewingPreset.rules.sentenceLength.maxWords}字`
                      : viewingPreset.rules.sentenceLength.type === 'short' ? '短句'
                      : viewingPreset.rules.sentenceLength.type === 'medium' ? '中句'
                      : '长句'}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <strong>表情符号：</strong>
                  <Tag color={viewingPreset.rules.allowEmoji ? 'green' : 'default'}>
                    {viewingPreset.rules.allowEmoji ? '允许' : '禁止'}
                  </Tag>
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <strong>禁用词列表：</strong>
              <div style={{ marginTop: 8 }}>
                {viewingPreset.rules.forbiddenWords.length > 0 ? (
                  viewingPreset.rules.forbiddenWords.map((word, idx) => (
                    <Tag key={idx} color="red" style={{ marginBottom: 4 }}>
                      {word}
                    </Tag>
                  ))
                ) : (
                  <span style={{ color: '#999' }}>无</span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <strong>敏感表达替换规则：</strong>
              <div style={{ marginTop: 8 }}>
                {viewingPreset.rules.sensitiveReplacements.length > 0 ? (
                  viewingPreset.rules.sensitiveReplacements.map((rule, idx) => (
                    <div key={idx} style={{ marginBottom: 4 }}>
                      <Tag color="orange">{rule.original}</Tag>
                      <span style={{ margin: '0 8px' }}>→</span>
                      <Tag color="green">{rule.replacement}</Tag>
                    </div>
                  ))
                ) : (
                  <span style={{ color: '#999' }}>无</span>
                )}
              </div>
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <div><strong>使用次数：</strong>{viewingPreset.usageCount || 0}</div>
              </Col>
              <Col span={12}>
                <div><strong>更新时间：</strong>{viewingPreset.updatedAt}</div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default StyleToneLibrary
