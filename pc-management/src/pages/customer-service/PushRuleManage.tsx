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
  Switch,
  InputNumber,
  TimePicker,
  Tag,
  message,
  Popconfirm,
  Divider,
  Row,
  Col,
  Radio,
  DatePicker
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Option } = Select
const { RangePicker } = DatePicker

// 规则类型
type RuleType = '资讯' | '建议' | '产品'

// 规则状态
type RuleStatus = 'enabled' | 'disabled'

// 触发时机类型
type TriggerType = 'schedule' | 'event'

// 事件类型
type EventType = 'after_skin_test' | 'after_consultation'

// 推送规则接口
interface PushRule {
  id: string
  name: string
  type: RuleType
  status: RuleStatus
  triggerCount: number // 最近触发量
  // 人群条件
  skinTypes?: string[] // 肤质
  problemTags?: string[] // 主问题标签
  activeTimeRange?: { start: number; end: number } // 最近活跃时间（天数）
  viewedContentTypes?: string[] // 是否看过某类内容
  // 触发时机
  triggerType: TriggerType
  scheduleTime?: string // 定时推送时间（HH:mm）
  eventType?: EventType
  eventDelay?: number // 事件触发延迟天数
  // 推送内容
  contentIds: string[] // 绑定的内容ID列表
  // 频率限制
  maxPerDay?: number // 每天最多几条
  themeInterval?: number // 同一主题之间的间隔天数
  createdAt: string
  updatedAt: string
}

const PushRuleManage: React.FC = () => {
  const [rules, setRules] = useState<PushRule[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRule, setEditingRule] = useState<PushRule | null>(null)
  const [form] = Form.useForm()

  // Mock数据
  useEffect(() => {
    setLoading(true)
    // 模拟API调用
    setTimeout(() => {
      setRules([
        {
          id: '1',
          name: '测肤后护肤建议推送',
          type: '建议',
          status: 'enabled',
          triggerCount: 1250,
          skinTypes: ['油性', '混合性'],
          problemTags: ['痘痘', '毛孔'],
          triggerType: 'event',
          eventType: 'after_skin_test',
          eventDelay: 1,
          contentIds: ['content1', 'content2'],
          maxPerDay: 3,
          themeInterval: 7,
          createdAt: '2025-01-01 10:00:00',
          updatedAt: '2025-01-10 15:30:00'
        },
        {
          id: '2',
          name: '每日护肤资讯推送',
          type: '资讯',
          status: 'enabled',
          triggerCount: 890,
          skinTypes: ['干性', '敏感性'],
          triggerType: 'schedule',
          scheduleTime: '09:00',
          contentIds: ['content3'],
          maxPerDay: 1,
          createdAt: '2025-01-02 09:00:00',
          updatedAt: '2025-01-08 11:20:00'
        },
        {
          id: '3',
          name: '咨询后产品推荐',
          type: '产品',
          status: 'disabled',
          triggerCount: 450,
          problemTags: ['色斑', '暗沉'],
          triggerType: 'event',
          eventType: 'after_consultation',
          eventDelay: 3,
          contentIds: ['content4', 'content5', 'content6'],
          maxPerDay: 2,
          themeInterval: 14,
          createdAt: '2025-01-03 14:00:00',
          updatedAt: '2025-01-05 16:00:00'
        }
      ])
      setLoading(false)
    }, 500)
  }, [])

  // 表格列定义
  const columns: ColumnsType<PushRule> = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: RuleType) => {
        const colorMap = {
          '资讯': 'blue',
          '建议': 'green',
          '产品': 'orange'
        }
        return <Tag color={colorMap[type]}>{type}</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: RuleStatus, record: PushRule) => (
        <Switch
          checked={status === 'enabled'}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          checkedChildren="启用"
          unCheckedChildren="停用"
        />
      )
    },
    {
      title: '最近触发量',
      dataIndex: 'triggerCount',
      key: 'triggerCount',
      width: 120,
      sorter: (a, b) => a.triggerCount - b.triggerCount,
      render: (count: number) => (
        <span style={{ fontWeight: 500, color: '#1890ff' }}>{count}</span>
      )
    },
    {
      title: '触发时机',
      key: 'trigger',
      width: 200,
      render: (_, record: PushRule) => {
        if (record.triggerType === 'schedule') {
          return <span>定时推送：每天 {record.scheduleTime}</span>
        } else {
          const eventText = record.eventType === 'after_skin_test' ? '测肤完成后' : '咨询后'
          return <span>事件触发：{eventText} {record.eventDelay} 天</span>
        }
      }
    },
    {
      title: '人群条件',
      key: 'audience',
      width: 250,
      ellipsis: true,
      render: (_, record: PushRule) => {
        const conditions: string[] = []
        if (record.skinTypes && record.skinTypes.length > 0) {
          conditions.push(`肤质：${record.skinTypes.join('、')}`)
        }
        if (record.problemTags && record.problemTags.length > 0) {
          conditions.push(`问题：${record.problemTags.join('、')}`)
        }
        if (record.activeTimeRange) {
          conditions.push(`活跃：${record.activeTimeRange.start}-${record.activeTimeRange.end}天`)
        }
        return conditions.length > 0 ? conditions.join('；') : '无限制'
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record: PushRule) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条规则吗？"
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

  // 过滤后的数据
  const filteredRules = rules.filter(rule =>
    rule.name.toLowerCase().includes(searchText.toLowerCase())
  )

  // 处理状态切换
  const handleStatusChange = (id: string, enabled: boolean) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, status: enabled ? 'enabled' : 'disabled' } : rule
    ))
    message.success(enabled ? '规则已启用' : '规则已停用')
  }

  // 处理新建
  const handleCreate = () => {
    setEditingRule(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (rule: PushRule) => {
    setEditingRule(rule)
    // 设置表单初始值
    const formValues: any = {
      name: rule.name,
      type: rule.type,
      status: rule.status === 'enabled',
      triggerType: rule.triggerType,
      contentIds: rule.contentIds,
      maxPerDay: rule.maxPerDay,
      themeInterval: rule.themeInterval
    }

    // 人群条件
    if (rule.skinTypes) {
      formValues.skinTypes = rule.skinTypes
    }
    if (rule.problemTags) {
      formValues.problemTags = rule.problemTags
    }
    if (rule.activeTimeRange) {
      formValues.activeTimeRange = [
        dayjs().subtract(rule.activeTimeRange.end, 'day'),
        dayjs().subtract(rule.activeTimeRange.start, 'day')
      ]
    }
    if (rule.viewedContentTypes) {
      formValues.viewedContentTypes = rule.viewedContentTypes
    }

    // 触发时机
    if (rule.triggerType === 'schedule' && rule.scheduleTime) {
      const [hour, minute] = rule.scheduleTime.split(':')
      formValues.scheduleTime = dayjs().hour(parseInt(hour)).minute(parseInt(minute))
    }
    if (rule.triggerType === 'event') {
      formValues.eventType = rule.eventType
      formValues.eventDelay = rule.eventDelay
    }

    form.setFieldsValue(formValues)
    setModalVisible(true)
  }

  // 处理查看
  const handleView = (rule: PushRule) => {
    handleEdit(rule)
    // 可以设置表单为只读模式
  }

  // 处理删除
  const handleDelete = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id))
    message.success('删除成功')
  }

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      
      // 处理人群条件
      const activeTimeRange = values.activeTimeRange
        ? {
            start: dayjs().diff(values.activeTimeRange[0], 'day'),
            end: dayjs().diff(values.activeTimeRange[1], 'day')
          }
        : undefined

      // 处理触发时机
      const scheduleTime = values.triggerType === 'schedule' && values.scheduleTime
        ? values.scheduleTime.format('HH:mm')
        : undefined

      const ruleData: PushRule = {
        id: editingRule?.id || `rule_${Date.now()}`,
        name: values.name,
        type: values.type,
        status: values.status ? 'enabled' : 'disabled',
        triggerCount: editingRule?.triggerCount || 0,
        skinTypes: values.skinTypes,
        problemTags: values.problemTags,
        activeTimeRange,
        viewedContentTypes: values.viewedContentTypes,
        triggerType: values.triggerType,
        scheduleTime,
        eventType: values.eventType,
        eventDelay: values.eventDelay,
        contentIds: values.contentIds || [],
        maxPerDay: values.maxPerDay,
        themeInterval: values.themeInterval,
        createdAt: editingRule?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (editingRule) {
        setRules(rules.map(rule => rule.id === editingRule.id ? ruleData : rule))
        message.success('更新成功')
      } else {
        setRules([...rules, ruleData])
        message.success('创建成功')
      }

      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder="搜索规则名称"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建规则
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredRules}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条规则`
          }}
        />
      </Card>

      {/* 规则编辑弹窗 */}
      <Modal
        title={editingRule ? '编辑推送规则' : '新建推送规则'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        onOk={handleSave}
        width={900}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: true,
            triggerType: 'schedule',
            maxPerDay: 1,
            themeInterval: 7
          }}
        >
          {/* 基本信息 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="规则名称"
                name="name"
                rules={[{ required: true, message: '请输入规则名称' }]}
              >
                <Input placeholder="请输入规则名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="规则类型"
                name="type"
                rules={[{ required: true, message: '请选择规则类型' }]}
              >
                <Select placeholder="请选择规则类型">
                  <Option value="资讯">资讯</Option>
                  <Option value="建议">建议</Option>
                  <Option value="产品">产品</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="状态"
            name="status"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="停用" />
          </Form.Item>

          <Divider orientation="left">人群条件</Divider>

          {/* 人群条件 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="肤质"
                name="skinTypes"
                tooltip="选择目标用户的肤质类型，可多选"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择肤质类型"
                  allowClear
                >
                  <Option value="油性">油性</Option>
                  <Option value="干性">干性</Option>
                  <Option value="混合性">混合性</Option>
                  <Option value="敏感性">敏感性</Option>
                  <Option value="中性">中性</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="主问题标签"
                name="problemTags"
                tooltip="选择目标用户的主要皮肤问题，可多选"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择主问题标签"
                  allowClear
                >
                  <Option value="痘痘">痘痘</Option>
                  <Option value="色斑">色斑</Option>
                  <Option value="暗沉">暗沉</Option>
                  <Option value="毛孔">毛孔</Option>
                  <Option value="敏感">敏感</Option>
                  <Option value="红血丝">红血丝</Option>
                  <Option value="黑眼圈">黑眼圈</Option>
                  <Option value="干燥">干燥</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="最近活跃时间"
                name="activeTimeRange"
                tooltip="选择用户最近活跃的时间范围（天数）"
              >
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={['最早活跃天数', '最近活跃天数']}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="是否看过某类内容"
                name="viewedContentTypes"
                tooltip="选择用户是否看过特定类型的内容"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择内容类型"
                  allowClear
                >
                  <Option value="护肤知识">护肤知识</Option>
                  <Option value="产品介绍">产品介绍</Option>
                  <Option value="使用教程">使用教程</Option>
                  <Option value="案例分享">案例分享</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">触发时机</Divider>

          {/* 触发时机 */}
          <Form.Item
            label="触发方式"
            name="triggerType"
            rules={[{ required: true, message: '请选择触发方式' }]}
          >
            <Radio.Group>
              <Radio value="schedule">定时推送</Radio>
              <Radio value="event">事件触发</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.triggerType !== currentValues.triggerType
            }
          >
            {({ getFieldValue }) => {
              const triggerType = getFieldValue('triggerType')
              if (triggerType === 'schedule') {
                return (
                  <Form.Item
                    label="推送时间"
                    name="scheduleTime"
                    rules={[{ required: true, message: '请选择推送时间' }]}
                    tooltip="设置每天推送的具体时间"
                  >
                    <TimePicker
                      format="HH:mm"
                      style={{ width: '100%' }}
                      placeholder="请选择时间"
                    />
                  </Form.Item>
                )
              } else {
                return (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="事件类型"
                        name="eventType"
                        rules={[{ required: true, message: '请选择事件类型' }]}
                      >
                        <Select placeholder="请选择事件类型">
                          <Option value="after_skin_test">测肤完成后</Option>
                          <Option value="after_consultation">咨询后未再咨询</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="延迟天数"
                        name="eventDelay"
                        rules={[{ required: true, message: '请输入延迟天数' }]}
                        tooltip="事件发生后多少天触发推送"
                      >
                        <InputNumber
                          min={0}
                          max={30}
                          style={{ width: '100%' }}
                          placeholder="请输入天数"
                          addonAfter="天"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )
              }
            }}
          </Form.Item>

          <Divider orientation="left">推送内容绑定</Divider>

          {/* 推送内容绑定 */}
          <Form.Item
            label="绑定内容"
            name="contentIds"
            rules={[{ required: true, message: '请至少选择一个推送内容' }]}
            tooltip="可以选择一个或多个资讯/建议模板/商品组"
          >
            <Select
              mode="multiple"
              placeholder="请选择推送内容"
              style={{ width: '100%' }}
            >
              <Option value="content1">护肤知识：春季护肤要点</Option>
              <Option value="content2">建议模板：痘痘肌护理方案</Option>
              <Option value="content3">商品组：敏感肌专用套装</Option>
              <Option value="content4">资讯：最新护肤趋势</Option>
              <Option value="content5">建议模板：色斑淡化指南</Option>
              <Option value="content6">商品组：美白精华组合</Option>
            </Select>
          </Form.Item>

          <Divider orientation="left">频率限制</Divider>

          {/* 频率限制 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="每天最多推送"
                name="maxPerDay"
                rules={[{ required: true, message: '请输入每天最多推送条数' }]}
                tooltip="限制每天最多推送几条消息给同一用户"
              >
                <InputNumber
                  min={1}
                  max={10}
                  style={{ width: '100%' }}
                  placeholder="请输入数量"
                  addonAfter="条"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="同一主题间隔"
                name="themeInterval"
                rules={[{ required: true, message: '请输入间隔天数' }]}
                tooltip="同一主题内容之间的最小间隔天数"
              >
                <InputNumber
                  min={1}
                  max={30}
                  style={{ width: '100%' }}
                  placeholder="请输入天数"
                  addonAfter="天"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default PushRuleManage
