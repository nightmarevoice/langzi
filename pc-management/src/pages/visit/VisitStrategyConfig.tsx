import React, { useState, useEffect } from 'react'
import {
  Card,
  List,
  Button,
  Space,
  Input,
  Form,
  InputNumber,
  Switch,
  TimePicker,
  Select,
  Tag,
  Divider,
  message,
  Row,
  Col,
  Radio,
  Checkbox,
  Typography,
  Empty,
  Popconfirm
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'

const { Option } = Select
const { TextArea } = Input
const { Text, Title } = Typography
const { CheckboxGroup } = Checkbox

interface Strategy {
  id: string
  name: string
  businessLine: string
  scenario: string
  status: 'active' | 'inactive'
  // 频次控制
  frequencyControl: {
    global: {
      enabled: boolean
      maxCallsPerDay: number
      maxCallsPerWeek: number
    }
    perTask: {
      enabled: boolean
      maxCallsPerTask: number
      intervalHours: number
    }
  }
  // 拨打时段
  timeSlot: {
    enabled: boolean
    type: 'whitelist' | 'blacklist'
    slots: Array<{
      start: string
      end: string
      weekdays: number[]
    }>
  }
  // 优先级策略
  priority: {
    enabled: boolean
    rules: Array<{
      type: 'high_value' | 'complaint' | 'vip' | 'custom'
      name: string
      weight: number
    }>
  }
  // 重呼策略
  retry: {
    enabled: boolean
    noAnswerRetry: {
      enabled: boolean
      retryAfterHours: number
      maxRetries: number
    }
    busyRetry: {
      enabled: boolean
      retryAfterHours: number
      maxRetries: number
    }
    rejectedRetry: {
      enabled: boolean
      retryAfterHours: number
      maxRetries: number
    }
  }
  createTime: string
  updateTime: string
}

const VisitStrategyConfig: React.FC = () => {
  const [form] = Form.useForm()
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)
  const [searchText, setSearchText] = useState('')
  const [businessLineFilter, setBusinessLineFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)

  // Mock 数据
  useEffect(() => {
    const mockStrategies: Strategy[] = [
      {
        id: '1',
        name: '高价值客户回访策略',
        businessLine: 'AI测肤',
        scenario: '产品推荐',
        status: 'active',
        frequencyControl: {
          global: {
            enabled: true,
            maxCallsPerDay: 3,
            maxCallsPerWeek: 10
          },
          perTask: {
            enabled: true,
            maxCallsPerTask: 2,
            intervalHours: 24
          }
        },
        timeSlot: {
          enabled: true,
          type: 'blacklist',
          slots: [
            {
              start: '21:00',
              end: '09:00',
              weekdays: [0, 1, 2, 3, 4, 5, 6]
            }
          ]
        },
        priority: {
          enabled: true,
          rules: [
            {
              type: 'high_value',
              name: '高价值客户',
              weight: 10
            },
            {
              type: 'vip',
              name: 'VIP客户',
              weight: 8
            }
          ]
        },
        retry: {
          enabled: true,
          noAnswerRetry: {
            enabled: true,
            retryAfterHours: 2,
            maxRetries: 3
          },
          busyRetry: {
            enabled: true,
            retryAfterHours: 1,
            maxRetries: 2
          },
          rejectedRetry: {
            enabled: false,
            retryAfterHours: 24,
            maxRetries: 1
          }
        },
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-15 14:30:00'
      },
      {
        id: '2',
        name: '投诉处理回访策略',
        businessLine: '客户服务',
        scenario: '投诉跟进',
        status: 'active',
        frequencyControl: {
          global: {
            enabled: true,
            maxCallsPerDay: 5,
            maxCallsPerWeek: 20
          },
          perTask: {
            enabled: true,
            maxCallsPerTask: 3,
            intervalHours: 12
          }
        },
        timeSlot: {
          enabled: true,
          type: 'whitelist',
          slots: [
            {
              start: '09:00',
              end: '18:00',
              weekdays: [1, 2, 3, 4, 5]
            }
          ]
        },
        priority: {
          enabled: true,
          rules: [
            {
              type: 'complaint',
              name: '投诉用户',
              weight: 10
            }
          ]
        },
        retry: {
          enabled: true,
          noAnswerRetry: {
            enabled: true,
            retryAfterHours: 1,
            maxRetries: 5
          },
          busyRetry: {
            enabled: true,
            retryAfterHours: 0.5,
            maxRetries: 3
          },
          rejectedRetry: {
            enabled: true,
            retryAfterHours: 2,
            maxRetries: 3
          }
        },
        createTime: '2024-01-05 09:00:00',
        updateTime: '2024-01-10 16:20:00'
      },
      {
        id: '3',
        name: '常规回访策略',
        businessLine: 'AI测肤',
        scenario: '满意度调查',
        status: 'active',
        frequencyControl: {
          global: {
            enabled: true,
            maxCallsPerDay: 2,
            maxCallsPerWeek: 5
          },
          perTask: {
            enabled: true,
            maxCallsPerTask: 1,
            intervalHours: 48
          }
        },
        timeSlot: {
          enabled: true,
          type: 'blacklist',
          slots: [
            {
              start: '22:00',
              end: '08:00',
              weekdays: [0, 1, 2, 3, 4, 5, 6]
            },
            {
              start: '12:00',
              end: '14:00',
              weekdays: [1, 2, 3, 4, 5]
            }
          ]
        },
        priority: {
          enabled: false,
          rules: []
        },
        retry: {
          enabled: true,
          noAnswerRetry: {
            enabled: true,
            retryAfterHours: 24,
            maxRetries: 2
          },
          busyRetry: {
            enabled: false,
            retryAfterHours: 12,
            maxRetries: 1
          },
          rejectedRetry: {
            enabled: false,
            retryAfterHours: 48,
            maxRetries: 1
          }
        },
        createTime: '2024-01-08 11:00:00',
        updateTime: '2024-01-12 10:15:00'
      }
    ]
    setStrategies(mockStrategies)
  }, [])

  // 过滤策略列表
  const filteredStrategies = strategies.filter(strategy => {
    const matchSearch = !searchText || strategy.name.toLowerCase().includes(searchText.toLowerCase())
    const matchBusinessLine = businessLineFilter === 'all' || strategy.businessLine === businessLineFilter
    return matchSearch && matchBusinessLine
  })

  // 业务线选项
  const businessLines = Array.from(new Set(strategies.map(s => s.businessLine)))

  // 选择策略
  const handleSelectStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy)
    form.setFieldsValue({
      name: strategy.name,
      businessLine: strategy.businessLine,
      scenario: strategy.scenario,
      status: strategy.status,
      // 频次控制
      'frequencyControl.global.enabled': strategy.frequencyControl.global.enabled,
      'frequencyControl.global.maxCallsPerDay': strategy.frequencyControl.global.maxCallsPerDay,
      'frequencyControl.global.maxCallsPerWeek': strategy.frequencyControl.global.maxCallsPerWeek,
      'frequencyControl.perTask.enabled': strategy.frequencyControl.perTask.enabled,
      'frequencyControl.perTask.maxCallsPerTask': strategy.frequencyControl.perTask.maxCallsPerTask,
      'frequencyControl.perTask.intervalHours': strategy.frequencyControl.perTask.intervalHours,
      // 拨打时段
      'timeSlot.enabled': strategy.timeSlot.enabled,
      'timeSlot.type': strategy.timeSlot.type,
      // 优先级策略
      'priority.enabled': strategy.priority.enabled,
      // 重呼策略
      'retry.enabled': strategy.retry.enabled,
      'retry.noAnswerRetry.enabled': strategy.retry.noAnswerRetry.enabled,
      'retry.noAnswerRetry.retryAfterHours': strategy.retry.noAnswerRetry.retryAfterHours,
      'retry.noAnswerRetry.maxRetries': strategy.retry.noAnswerRetry.maxRetries,
      'retry.busyRetry.enabled': strategy.retry.busyRetry.enabled,
      'retry.busyRetry.retryAfterHours': strategy.retry.busyRetry.retryAfterHours,
      'retry.busyRetry.maxRetries': strategy.retry.busyRetry.maxRetries,
      'retry.rejectedRetry.enabled': strategy.retry.rejectedRetry.enabled,
      'retry.rejectedRetry.retryAfterHours': strategy.retry.rejectedRetry.retryAfterHours,
      'retry.rejectedRetry.maxRetries': strategy.retry.rejectedRetry.maxRetries
    })
  }

  // 新建策略
  const handleNewStrategy = () => {
    setSelectedStrategy(null)
    form.resetFields()
    form.setFieldsValue({
      status: 'active',
      'frequencyControl.global.enabled': true,
      'frequencyControl.perTask.enabled': true,
      'timeSlot.enabled': true,
      'timeSlot.type': 'blacklist',
      'priority.enabled': false,
      'retry.enabled': true,
      'retry.noAnswerRetry.enabled': true,
      'retry.busyRetry.enabled': true,
      'retry.rejectedRetry.enabled': false
    })
  }

  // 保存策略
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (selectedStrategy) {
        // 更新
        setStrategies(prev => prev.map(s => 
          s.id === selectedStrategy.id 
            ? { ...s, ...values, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }
            : s
        ))
        message.success('策略更新成功')
      } else {
        // 新建
        const newStrategy: Strategy = {
          id: Date.now().toString(),
          ...values,
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
        setStrategies(prev => [...prev, newStrategy])
        setSelectedStrategy(newStrategy)
        message.success('策略创建成功')
      }
      
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('保存失败:', error)
    }
  }

  // 删除策略
  const handleDelete = (strategyId: string) => {
    setStrategies(prev => prev.filter(s => s.id !== strategyId))
    if (selectedStrategy?.id === strategyId) {
      setSelectedStrategy(null)
      form.resetFields()
    }
    message.success('策略删除成功')
  }

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 64px)', display: 'flex', gap: '16px' }}>
      {/* 左侧：策略列表 */}
      <Card
        title="策略列表"
        style={{ width: '400px', flexShrink: 0 }}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleNewStrategy}>
            新建
          </Button>
        }
      >
        <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
          <Input
            placeholder="搜索策略名称"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select
            style={{ width: '100%' }}
            value={businessLineFilter}
            onChange={setBusinessLineFilter}
          >
            <Option value="all">全部业务线</Option>
            {businessLines.map(line => (
              <Option key={line} value={line}>{line}</Option>
            ))}
          </Select>
        </Space>

        <List
          dataSource={filteredStrategies}
          renderItem={(strategy) => (
            <List.Item
              style={{
                cursor: 'pointer',
                backgroundColor: selectedStrategy?.id === strategy.id ? '#e6f7ff' : 'transparent',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '8px',
                border: selectedStrategy?.id === strategy.id ? '1px solid #1890ff' : '1px solid #f0f0f0'
              }}
              onClick={() => handleSelectStrategy(strategy)}
              actions={[
                <Popconfirm
                  title="确定删除此策略吗？"
                  onConfirm={() => handleDelete(strategy.id)}
                  key="delete"
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Text strong>{strategy.name}</Text>
                    <Tag color={strategy.status === 'active' ? 'green' : 'default'}>
                      {strategy.status === 'active' ? '启用' : '禁用'}
                    </Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size={0}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      业务线：{strategy.businessLine} | 场景：{strategy.scenario}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      更新：{strategy.updateTime}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 右侧：策略详情编辑表单 */}
      <Card
        title={selectedStrategy ? '编辑策略' : '新建策略'}
        style={{ flex: 1 }}
        extra={
          selectedStrategy && (
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => handleSelectStrategy(selectedStrategy)}>
                重置
              </Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={loading}>
                保存
              </Button>
            </Space>
          )
        }
      >
        {!selectedStrategy && !form.getFieldValue('name') ? (
          <Empty description="请从左侧选择策略或点击新建按钮创建新策略" />
        ) : (
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              status: 'active',
              'frequencyControl.global.enabled': true,
              'frequencyControl.perTask.enabled': true,
              'timeSlot.enabled': true,
              'timeSlot.type': 'blacklist',
              'priority.enabled': false,
              'retry.enabled': true,
              'retry.noAnswerRetry.enabled': true,
              'retry.busyRetry.enabled': true,
              'retry.rejectedRetry.enabled': false
            }}
          >
            {/* 基本信息 */}
            <Card type="inner" title="基本信息" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="策略名称"
                    rules={[{ required: true, message: '请输入策略名称' }]}
                  >
                    <Input placeholder="请输入策略名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="businessLine"
                    label="业务线"
                    rules={[{ required: true, message: '请选择业务线' }]}
                  >
                    <Select placeholder="请选择业务线">
                      <Option value="AI测肤">AI测肤</Option>
                      <Option value="客户服务">客户服务</Option>
                      <Option value="商品推荐">商品推荐</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="scenario"
                    label="应用场景"
                    rules={[{ required: true, message: '请输入应用场景' }]}
                  >
                    <Input placeholder="例如：产品推荐、投诉跟进" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="状态"
                    rules={[{ required: true, message: '请选择状态' }]}
                  >
                    <Select>
                      <Option value="active">启用</Option>
                      <Option value="inactive">禁用</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 频次控制策略 */}
            <Card type="inner" title="频次控制策略" style={{ marginBottom: 16 }}>
              <Form.Item label="全局频次控制">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form.Item
                    name={['frequencyControl', 'global', 'enabled']}
                    valuePropName="checked"
                    style={{ marginBottom: 0 }}
                  >
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.frequencyControl?.global?.enabled !== currentValues.frequencyControl?.global?.enabled
                    }
                  >
                    {({ getFieldValue }) =>
                      getFieldValue(['frequencyControl', 'global', 'enabled']) ? (
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={['frequencyControl', 'global', 'maxCallsPerDay']}
                              label="每日最大拨打次数"
                              rules={[{ required: true, message: '请输入每日最大拨打次数' }]}
                            >
                              <InputNumber min={1} max={100} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['frequencyControl', 'global', 'maxCallsPerWeek']}
                              label="每周最大拨打次数"
                              rules={[{ required: true, message: '请输入每周最大拨打次数' }]}
                            >
                              <InputNumber min={1} max={500} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                        </Row>
                      ) : null
                    }
                  </Form.Item>
                </Space>
              </Form.Item>

              <Divider />

              <Form.Item label="每任务频次控制">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form.Item
                    name={['frequencyControl', 'perTask', 'enabled']}
                    valuePropName="checked"
                    style={{ marginBottom: 0 }}
                  >
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.frequencyControl?.perTask?.enabled !== currentValues.frequencyControl?.perTask?.enabled
                    }
                  >
                    {({ getFieldValue }) =>
                      getFieldValue(['frequencyControl', 'perTask', 'enabled']) ? (
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={['frequencyControl', 'perTask', 'maxCallsPerTask']}
                              label="每任务最大拨打次数"
                              rules={[{ required: true, message: '请输入每任务最大拨打次数' }]}
                            >
                              <InputNumber min={1} max={50} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['frequencyControl', 'perTask', 'intervalHours']}
                              label="拨打间隔（小时）"
                              rules={[{ required: true, message: '请输入拨打间隔' }]}
                            >
                              <InputNumber min={1} max={168} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                        </Row>
                      ) : null
                    }
                  </Form.Item>
                </Space>
              </Form.Item>
            </Card>

            {/* 拨打时段黑白名单 */}
            <Card type="inner" title="拨打时段控制" style={{ marginBottom: 16 }}>
              <Form.Item label="启用时段控制">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form.Item
                    name={['timeSlot', 'enabled']}
                    valuePropName="checked"
                    style={{ marginBottom: 0 }}
                  >
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.timeSlot?.enabled !== currentValues.timeSlot?.enabled
                    }
                  >
                    {({ getFieldValue }) =>
                      getFieldValue(['timeSlot', 'enabled']) ? (
                        <>
                          <Form.Item
                            name={['timeSlot', 'type']}
                            label="名单类型"
                            rules={[{ required: true, message: '请选择名单类型' }]}
                          >
                            <Radio.Group>
                              <Radio value="whitelist">白名单（仅允许时段）</Radio>
                              <Radio value="blacklist">黑名单（禁止时段）</Radio>
                            </Radio.Group>
                          </Form.Item>
                          <Form.Item
                            label="时段配置"
                            tooltip="例如：禁止 21:00-09:00 拨打"
                          >
                            <Text type="secondary">
                              当前配置：{getFieldValue(['timeSlot', 'type']) === 'blacklist' ? '禁止' : '允许'} 21:00-09:00 拨打（全天）
                            </Text>
                            <br />
                            <Button type="link" size="small" style={{ padding: 0, marginTop: 8 }}>
                              配置时段规则
                            </Button>
                          </Form.Item>
                        </>
                      ) : null
                    }
                  </Form.Item>
                </Space>
              </Form.Item>
            </Card>

            {/* 优先级策略 */}
            <Card type="inner" title="优先级策略" style={{ marginBottom: 16 }}>
              <Form.Item label="启用优先级策略">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form.Item
                    name={['priority', 'enabled']}
                    valuePropName="checked"
                    style={{ marginBottom: 0 }}
                  >
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.priority?.enabled !== currentValues.priority?.enabled
                    }
                  >
                    {({ getFieldValue }) =>
                      getFieldValue(['priority', 'enabled']) ? (
                        <div>
                          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                            优先级规则（权重越高，优先级越高）
                          </Text>
                          {selectedStrategy?.priority?.rules?.map((rule, index) => (
                            <Tag key={index} color="blue" style={{ marginBottom: 8 }}>
                              {rule.name} (权重: {rule.weight})
                            </Tag>
                          ))}
                          <br />
                          <Button type="link" size="small" style={{ padding: 0, marginTop: 8 }}>
                            配置优先级规则
                          </Button>
                        </div>
                      ) : (
                        <Text type="secondary">禁用后，所有客户按默认顺序处理</Text>
                      )
                    }
                  </Form.Item>
                </Space>
              </Form.Item>
            </Card>

            {/* 重呼策略 */}
            <Card type="inner" title="重呼策略">
              <Form.Item label="启用重呼策略">
                <Form.Item
                  name={['retry', 'enabled']}
                  valuePropName="checked"
                  style={{ marginBottom: 16 }}
                >
                  <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                </Form.Item>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.retry?.enabled !== currentValues.retry?.enabled
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue(['retry', 'enabled']) ? (
                    <>
                      <Divider orientation="left">无人接听</Divider>
                      <Form.Item label="启用无人接听重呼">
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Form.Item
                            name={['retry', 'noAnswerRetry', 'enabled']}
                            valuePropName="checked"
                            style={{ marginBottom: 0 }}
                          >
                            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                          </Form.Item>
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) =>
                              prevValues.retry?.noAnswerRetry?.enabled !== currentValues.retry?.noAnswerRetry?.enabled
                            }
                          >
                            {({ getFieldValue }) =>
                              getFieldValue(['retry', 'noAnswerRetry', 'enabled']) ? (
                                <Row gutter={16}>
                                  <Col span={12}>
                                    <Form.Item
                                      name={['retry', 'noAnswerRetry', 'retryAfterHours']}
                                      label="X 小时后再拨"
                                      rules={[{ required: true, message: '请输入重呼间隔' }]}
                                    >
                                      <InputNumber min={0.5} max={168} step={0.5} style={{ width: '100%' }} />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item
                                      name={['retry', 'noAnswerRetry', 'maxRetries']}
                                      label="最大重呼次数"
                                      rules={[{ required: true, message: '请输入最大重呼次数' }]}
                                    >
                                      <InputNumber min={1} max={10} style={{ width: '100%' }} />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              ) : null
                            }
                          </Form.Item>
                        </Space>
                      </Form.Item>

                      <Divider orientation="left">占线</Divider>
                      <Form.Item label="启用占线重呼">
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Form.Item
                            name={['retry', 'busyRetry', 'enabled']}
                            valuePropName="checked"
                            style={{ marginBottom: 0 }}
                          >
                            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                          </Form.Item>
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) =>
                              prevValues.retry?.busyRetry?.enabled !== currentValues.retry?.busyRetry?.enabled
                            }
                          >
                            {({ getFieldValue }) =>
                              getFieldValue(['retry', 'busyRetry', 'enabled']) ? (
                                <Row gutter={16}>
                                  <Col span={12}>
                                    <Form.Item
                                      name={['retry', 'busyRetry', 'retryAfterHours']}
                                      label="X 小时后再拨"
                                      rules={[{ required: true, message: '请输入重呼间隔' }]}
                                    >
                                      <InputNumber min={0.5} max={168} step={0.5} style={{ width: '100%' }} />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item
                                      name={['retry', 'busyRetry', 'maxRetries']}
                                      label="最大重呼次数"
                                      rules={[{ required: true, message: '请输入最大重呼次数' }]}
                                    >
                                      <InputNumber min={1} max={10} style={{ width: '100%' }} />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              ) : null
                            }
                          </Form.Item>
                        </Space>
                      </Form.Item>

                      <Divider orientation="left">拒接</Divider>
                      <Form.Item label="启用拒接重呼">
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Form.Item
                            name={['retry', 'rejectedRetry', 'enabled']}
                            valuePropName="checked"
                            style={{ marginBottom: 0 }}
                          >
                            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                          </Form.Item>
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) =>
                              prevValues.retry?.rejectedRetry?.enabled !== currentValues.retry?.rejectedRetry?.enabled
                            }
                          >
                            {({ getFieldValue }) =>
                              getFieldValue(['retry', 'rejectedRetry', 'enabled']) ? (
                                <Row gutter={16}>
                                  <Col span={12}>
                                    <Form.Item
                                      name={['retry', 'rejectedRetry', 'retryAfterHours']}
                                      label="X 小时后再拨"
                                      rules={[{ required: true, message: '请输入重呼间隔' }]}
                                    >
                                      <InputNumber min={0.5} max={168} step={0.5} style={{ width: '100%' }} />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item
                                      name={['retry', 'rejectedRetry', 'maxRetries']}
                                      label="最大重呼次数"
                                      rules={[{ required: true, message: '请输入最大重呼次数' }]}
                                    >
                                      <InputNumber min={1} max={10} style={{ width: '100%' }} />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              ) : null
                            }
                          </Form.Item>
                        </Space>
                      </Form.Item>
                    </>
                  ) : (
                    <Text type="secondary">禁用后，将不进行任何重呼</Text>
                  )
                }
              </Form.Item>
            </Card>

            {!selectedStrategy && (
              <div style={{ textAlign: 'right', marginTop: 24 }}>
                <Space>
                  <Button onClick={() => form.resetFields()}>重置</Button>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={loading}>
                    保存
                  </Button>
                </Space>
              </div>
            )}
          </Form>
        )}
      </Card>
    </div>
  )
}

export default VisitStrategyConfig
