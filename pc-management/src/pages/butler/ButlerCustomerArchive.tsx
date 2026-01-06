import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Tag, Space, Tabs, Descriptions, Table, Input, Select } from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  StarOutlined,
  EnvironmentOutlined,
  TagOutlined,
  ProfileOutlined,
  SolutionOutlined,
  GiftOutlined,
  MessageOutlined,
  SearchOutlined,
  TeamOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useParams } from 'react-router-dom'

const { Option } = Select

interface Customer {
  id: string
  name: string
  nickname: string
  phone: string
  city: string
  ageRange: string
  customerType: '新客' | '老客'
  tags: string[]
  lastInteractionTime: string
}

interface ProjectRecord {
  id: string
  name: string
  date: string
  store: string
  doctor: string
  stage: string
}

interface SessionTicketRecord {
  id: string
  type: string
  channel: string
  summary: string
  operator: string
  time: string
}

interface MarketingRecord {
  id: string
  campaign: string
  channel: string
  action: string
  benefit: string
  time: string
}

interface CustomerArchive {
  id: string
  name: string
  nickname: string
  phone: string
  city: string
  district: string
  ageRange: string
  gender: string
  occupation: string
  customerType: '新客' | '老客'
  tags: string[]
  skinType: string
  mainConcern: string
  sensitivityHistory: string
  notes: string
  behaviorTags: string[]
  projects: ProjectRecord[]
  sessions: SessionTicketRecord[]
  marketing: MarketingRecord[]
}

// Mock 客户列表数据
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: '张美丽',
    nickname: '小美同学',
    phone: '138****8888',
    city: '上海',
    ageRange: '25-30 岁',
    customerType: '老客',
    tags: ['重点跟进', '眼综合术后', '高意向'],
    lastInteractionTime: '2025-01-10 10:35'
  },
  {
    id: '2',
    name: '李先生',
    nickname: '李先生',
    phone: '139****6666',
    city: '北京',
    ageRange: '30-35 岁',
    customerType: '新客',
    tags: ['高危复查', '鼻整形术后'],
    lastInteractionTime: '2025-01-10 09:50'
  },
  {
    id: '3',
    name: '王女士',
    nickname: '小王',
    phone: '137****9999',
    city: '广州',
    ageRange: '28-32 岁',
    customerType: '老客',
    tags: ['皮肤管理', '高意向'],
    lastInteractionTime: '2025-01-09 16:20'
  },
  {
    id: '4',
    name: '周小姐',
    nickname: '周周',
    phone: '136****5555',
    city: '深圳',
    ageRange: '22-25 岁',
    customerType: '新客',
    tags: ['咨询中', '高意向'],
    lastInteractionTime: '2025-01-08 14:30'
  }
]

// Mock 客户档案数据（根据客户ID返回不同数据）
const getCustomerArchive = (customerId: string): CustomerArchive | null => {
  const archives: Record<string, CustomerArchive> = {
    '1': {
      id: '1',
      name: '张美丽',
      nickname: '小美同学',
      phone: '138****8888',
      city: '上海',
      district: '浦东新区',
      ageRange: '25-30 岁',
      gender: '女',
      occupation: '新媒体运营',
      customerType: '老客',
      tags: ['重点跟进', '眼综合术后', '高意向'],
      skinType: '混合偏油',
      mainConcern: '眼部年轻化、痘印淡化',
      sensitivityHistory: '偶发性敏感',
      notes: '对自然效果要求高，接受度较高',
      behaviorTags: ['术后护理关注度高', '偏好自然风格', '愿意接受长期方案'],
      projects: [
        {
          id: '1',
          name: '眼综合手术',
          date: '2024-12-20',
          store: '朗姿旗舰院区',
          doctor: '李医生',
          stage: '术后 7 天'
        },
        {
          id: '2',
          name: '皮肤焕肤项目',
          date: '2024-08-10',
          store: '朗姿皮肤中心',
          doctor: '王医生',
          stage: '已完成'
        }
      ],
      sessions: [
        {
          id: '1',
          type: 'AI 会话',
          channel: '小程序',
          summary: '咨询术后肿胀恢复时间，AI 已给出护理建议',
          operator: 'AI 管家',
          time: '2025-01-10 10:35'
        },
        {
          id: '2',
          type: '人工工单',
          channel: '电话回访',
          summary: '术后 3 天随访，确认疼痛和恢复情况，建议按时复查',
          operator: '张护士',
          time: '2025-01-09 16:20'
        }
      ],
      marketing: [
        {
          id: '1',
          campaign: '元旦焕新活动',
          channel: '短信',
          action: '点击活动链接',
          benefit: '500 元抵扣券',
          time: '2024-12-28 09:15'
        },
        {
          id: '2',
          campaign: '术后关怀礼包',
          channel: '小程序推送',
          action: '领取护理礼包',
          benefit: '医用敷料赠送',
          time: '2024-12-22 18:05'
        }
      ]
    },
    '2': {
      id: '2',
      name: '李先生',
      nickname: '李先生',
      phone: '139****6666',
      city: '北京',
      district: '朝阳区',
      ageRange: '30-35 岁',
      gender: '男',
      occupation: 'IT工程师',
      customerType: '新客',
      tags: ['高危复查', '鼻整形术后'],
      skinType: '油性',
      mainConcern: '鼻部整形、术后恢复',
      sensitivityHistory: '无',
      notes: '术后恢复期，需要重点关注',
      behaviorTags: ['术后恢复关注度高', '需要专业指导'],
      projects: [
        {
          id: '1',
          name: '鼻整形手术',
          date: '2024-12-15',
          store: '朗姿北京院区',
          doctor: '刘医生',
          stage: '术后 25 天'
        }
      ],
      sessions: [
        {
          id: '1',
          type: 'AI 会话',
          channel: '小程序',
          summary: '反馈疼痛明显、呼吸不顺，AI 标记为高危',
          operator: 'AI 管家',
          time: '2025-01-10 09:50'
        }
      ],
      marketing: []
    },
    '3': {
      id: '3',
      name: '王女士',
      nickname: '小王',
      phone: '137****9999',
      city: '广州',
      district: '天河区',
      ageRange: '28-32 岁',
      gender: '女',
      occupation: '教师',
      customerType: '老客',
      tags: ['皮肤管理', '高意向'],
      skinType: '混合性',
      mainConcern: '抗衰、紧致',
      sensitivityHistory: '无',
      notes: '对产品效果要求高',
      behaviorTags: ['关注产品效果', '愿意尝试新项目'],
      projects: [
        {
          id: '1',
          name: '皮肤管理项目',
          date: '2024-11-20',
          store: '朗姿广州院区',
          doctor: '陈医生',
          stage: '进行中'
        }
      ],
      sessions: [
        {
          id: '1',
          type: 'AI 会话',
          channel: '小程序',
          summary: '咨询抗衰项目效果和价格',
          operator: 'AI 管家',
          time: '2025-01-09 16:20'
        }
      ],
      marketing: [
        {
          id: '1',
          campaign: '抗衰活动',
          channel: '小程序推送',
          action: '查看活动详情',
          benefit: '8折优惠',
          time: '2025-01-05 10:00'
        }
      ]
    },
    '4': {
      id: '4',
      name: '周小姐',
      nickname: '周周',
      phone: '136****5555',
      city: '深圳',
      district: '南山区',
      ageRange: '22-25 岁',
      gender: '女',
      occupation: '设计师',
      customerType: '新客',
      tags: ['咨询中', '高意向'],
      skinType: '敏感肌',
      mainConcern: '敏感肌护理、祛痘',
      sensitivityHistory: '经常性敏感',
      notes: '需要温和产品',
      behaviorTags: ['关注产品安全性', '价格敏感'],
      projects: [],
      sessions: [
        {
          id: '1',
          type: 'AI 会话',
          channel: '小程序',
          summary: '咨询敏感肌护理方案',
          operator: 'AI 管家',
          time: '2025-01-08 14:30'
        }
      ],
      marketing: []
    }
  }
  return archives[customerId] || null
}

const ButlerCustomerArchive: React.FC = () => {
  const { id: routeCustomerId } = useParams<{ id?: string }>()
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    routeCustomerId || mockCustomers[0]?.id || ''
  )
  const [searchText, setSearchText] = useState('')
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>('')

  useEffect(() => {
    if (routeCustomerId) {
      setSelectedCustomerId(routeCustomerId)
    }
  }, [routeCustomerId])

  const selectedArchive = selectedCustomerId ? getCustomerArchive(selectedCustomerId) : null

  // 过滤客户列表
  const filteredCustomers = mockCustomers.filter(customer => {
    if (searchText && !customer.name.includes(searchText) && !customer.phone.includes(searchText) && !customer.nickname.includes(searchText)) {
      return false
    }
    if (customerTypeFilter && customer.customerType !== customerTypeFilter) {
      return false
    }
    return true
  })

  // 客户列表表格列
  const customerColumns: ColumnsType<Customer> = [
    {
      title: '客户姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (text: string) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 100
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 120
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: 80
    },
    {
      title: '客户类型',
      dataIndex: 'customerType',
      key: 'customerType',
      width: 100,
      render: (type: string) => (
        <Tag color={type === '老客' ? 'gold' : 'blue'}>
          <StarOutlined style={{ marginRight: 4 }} />
          {type}
        </Tag>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags.slice(0, 2).map(tag => (
            <Tag key={tag} color="blue" style={{ fontSize: 12 }}>
              {tag}
            </Tag>
          ))}
          {tags.length > 2 && <span style={{ color: '#999' }}>...</span>}
        </Space>
      )
    },
    {
      title: '最近交互',
      dataIndex: 'lastInteractionTime',
      key: 'lastInteractionTime',
      width: 160
    }
  ]
  const projectColumns: ColumnsType<ProjectRecord> = [
    { title: '项目名称', dataIndex: 'name', key: 'name' },
    { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: '门店', dataIndex: 'store', key: 'store', width: 160 },
    { title: '主刀医生', dataIndex: 'doctor', key: 'doctor', width: 120 },
    { title: '当前阶段', dataIndex: 'stage', key: 'stage', width: 120 }
  ]

  const sessionColumns: ColumnsType<SessionTicketRecord> = [
    { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
    { title: '入口/渠道', dataIndex: 'channel', key: 'channel', width: 120 },
    { title: '时间', dataIndex: 'time', key: 'time', width: 160 },
    { title: '服务人员 / AI', dataIndex: 'operator', key: 'operator', width: 140 },
    { title: '概要', dataIndex: 'summary', key: 'summary' }
  ]

  const marketingColumns: ColumnsType<MarketingRecord> = [
    { title: '活动名称', dataIndex: 'campaign', key: 'campaign', width: 160 },
    { title: '渠道', dataIndex: 'channel', key: 'channel', width: 120 },
    { title: '行为', dataIndex: 'action', key: 'action', width: 160 },
    { title: '优惠/权益', dataIndex: 'benefit', key: 'benefit', width: 180 },
    { title: '时间', dataIndex: 'time', key: 'time', width: 160 }
  ]

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        {/* 左侧：客户列表 */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <TeamOutlined />
                <span>服务客户列表</span>
              </Space>
            }
          >
            <Row gutter={12} style={{ marginBottom: 16 }}>
              <Col span={16}>
                <Input
                  placeholder="搜索客户姓名 / 手机号 / 昵称"
                  prefix={<SearchOutlined />}
                  allowClear
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
              </Col>
              <Col span={8}>
                <Select
                  allowClear
                  placeholder="客户类型"
                  style={{ width: '100%' }}
                  value={customerTypeFilter}
                  onChange={value => setCustomerTypeFilter(value)}
                >
                  <Option value="新客">新客</Option>
                  <Option value="老客">老客</Option>
                </Select>
              </Col>
            </Row>

            <Table
              rowKey="id"
              columns={customerColumns}
              dataSource={filteredCustomers}
              size="small"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: total => `共 ${total} 位客户`
              }}
              onRow={record => ({
                onClick: () => setSelectedCustomerId(record.id),
                style: {
                  cursor: 'pointer',
                  backgroundColor: selectedCustomerId === record.id ? '#e6f7ff' : 'transparent'
                }
              })}
            />
          </Card>
        </Col>

        {/* 右侧：客户档案详情 */}
        <Col xs={24} lg={14}>
          {selectedArchive ? (
            <Card>
              {/* 头部概要 */}
              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col flex="none">
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <UserOutlined style={{ fontSize: 28, color: '#1890ff' }} />
                  </div>
                </Col>
                <Col flex="auto">
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Space size={12}>
                      <span style={{ fontSize: 20, fontWeight: 600 }}>{selectedArchive.name}</span>
                      <span style={{ color: '#999' }}>（微信昵称：{selectedArchive.nickname}）</span>
                    </Space>
                    <Space size="middle" wrap>
                      <Space>
                        <PhoneOutlined />
                        <span>{selectedArchive.phone}</span>
                      </Space>
                      <Space>
                        <EnvironmentOutlined />
                        <span>{selectedArchive.city} · {selectedArchive.district}</span>
                      </Space>
                      <Space>
                        <ProfileOutlined />
                        <span>年龄段：{selectedArchive.ageRange}</span>
                      </Space>
                    </Space>
                    <Space size="middle" wrap>
                      <Space>
                        <StarOutlined style={{ color: '#faad14' }} />
                        <span>{selectedArchive.customerType}</span>
                      </Space>
                      {selectedArchive.tags.map(tag => (
                        <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                    </Space>
                  </Space>
                </Col>
              </Row>

              {/* Tabs 区域 */}
              <Tabs
                defaultActiveKey="basic"
                items={[
                  {
                    key: 'basic',
                    label: (
                      <span>
                        <UserOutlined />
                        基础信息
                      </span>
                    ),
                    children: (
                      <Row gutter={24}>
                        <Col span={12}>
                          <Descriptions column={1} title="基本档案" bordered size="small">
                            <Descriptions.Item label="性别">{selectedArchive.gender}</Descriptions.Item>
                            <Descriptions.Item label="年龄段">{selectedArchive.ageRange}</Descriptions.Item>
                            <Descriptions.Item label="城市">{selectedArchive.city}</Descriptions.Item>
                            <Descriptions.Item label="职业">{selectedArchive.occupation}</Descriptions.Item>
                          </Descriptions>
                        </Col>
                        <Col span={12}>
                          <Descriptions column={1} title="肌肤画像" bordered size="small">
                            <Descriptions.Item label="肤质">{selectedArchive.skinType}</Descriptions.Item>
                            <Descriptions.Item label="主要诉求">{selectedArchive.mainConcern}</Descriptions.Item>
                            <Descriptions.Item label="敏感史">{selectedArchive.sensitivityHistory}</Descriptions.Item>
                            <Descriptions.Item label="备注">{selectedArchive.notes}</Descriptions.Item>
                          </Descriptions>
                        </Col>
                        <Col span={24} style={{ marginTop: 16 }}>
                          <Space align="start">
                            <TagOutlined style={{ marginTop: 4 }} />
                            <Space size={[8, 8]} wrap>
                              {selectedArchive.behaviorTags.map(tag => (
                                <Tag key={tag} color="orange">{tag}</Tag>
                              ))}
                            </Space>
                          </Space>
                        </Col>
                      </Row>
                    )
                  },
                  {
                    key: 'project',
                    label: (
                      <span>
                        <SolutionOutlined />
                        项目 & 手术记录
                      </span>
                    ),
                    children: (
                      <div>
                        {selectedArchive.projects.length > 0 ? (
                          <Table
                            rowKey="id"
                            columns={projectColumns}
                            dataSource={selectedArchive.projects}
                            pagination={false}
                          />
                        ) : (
                          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                            暂无项目记录
                          </div>
                        )}
                      </div>
                    )
                  },
                  {
                    key: 'session',
                    label: (
                      <span>
                        <MessageOutlined />
                        会话 & 工单记录
                      </span>
                    ),
                    children: (
                      <div>
                        {selectedArchive.sessions.length > 0 ? (
                          <Table
                            rowKey="id"
                            columns={sessionColumns}
                            dataSource={selectedArchive.sessions}
                            pagination={false}
                          />
                        ) : (
                          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                            暂无会话记录
                          </div>
                        )}
                      </div>
                    )
                  },
                  {
                    key: 'marketing',
                    label: (
                      <span>
                        <GiftOutlined />
                        营销 & 优惠使用记录
                      </span>
                    ),
                    children: (
                      <div>
                        {selectedArchive.marketing.length > 0 ? (
                          <Table
                            rowKey="id"
                            columns={marketingColumns}
                            dataSource={selectedArchive.marketing}
                            pagination={false}
                          />
                        ) : (
                          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                            暂无营销记录
                          </div>
                        )}
                      </div>
                    )
                  }
                ]}
              />
            </Card>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
                <UserOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>请从左侧列表中选择一位客户查看档案详情</div>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default ButlerCustomerArchive


