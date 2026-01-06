import React, { useState } from 'react'
import { Card, Row, Col, Table, Space, Tag, Select, Input, Button, Descriptions } from 'antd'
import {
  SearchOutlined,
  ProfileOutlined,
  WarningOutlined,
  PhoneOutlined,
  UserOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Option } = Select

type TicketType = '预约意向' | '高危复查' | '客诉'
type TicketStatus = '未处理' | '处理中' | '已完成'
type TicketSource = 'AI 管家' | '线下' | '其他渠道'

interface TicketItem {
  id: string
  userName: string
  project: string
  createTime: string
  type: TicketType
  status: TicketStatus
  source: TicketSource
  intentionLevel?: '高' | '中' | '低'
  riskLevel?: '高' | '中' | '低'
  summary: string
  suggestion: string
  assignee?: string
}

const mockTickets: TicketItem[] = [
  {
    id: 'T20250101',
    userName: '张美丽',
    project: '眼综合手术',
    createTime: '2025-01-10 10:30',
    type: '预约意向',
    status: '未处理',
    source: 'AI 管家',
    intentionLevel: '高',
    summary: '多次咨询术后恢复与费用，AI 判断为高意向预约',
    suggestion: '优先电话联系，确认术式方案与排期，强调术后护理服务',
    assignee: '王顾问'
  },
  {
    id: 'T20250102',
    userName: '李先生',
    project: '鼻整形复查',
    createTime: '2025-01-10 09:50',
    type: '高危复查',
    status: '处理中',
    source: 'AI 管家',
    riskLevel: '高',
    summary: '用户多次反馈“疼痛明显、呼吸不顺”，AI 标记为高危',
    suggestion: '建议医生尽快电话沟通，必要时安排线下面诊',
    assignee: '李医生'
  },
  {
    id: 'T20250103',
    userName: '王女士',
    project: '皮肤管理项目',
    createTime: '2025-01-09 16:20',
    type: '客诉',
    status: '未处理',
    source: '线下',
    riskLevel: '中',
    summary: '对等待时间不满，认为排队时间过长',
    suggestion: '客服致电安抚情绪，解释原因，可酌情补偿护理项目',
    assignee: '客服 A'
  }
]

const ButlerTicketList: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<TicketType | undefined>()
  const [statusFilter, setStatusFilter] = useState<TicketStatus | undefined>()
  const [sourceFilter, setSourceFilter] = useState<TicketSource | undefined>()
  const [keyword, setKeyword] = useState('')
  const [selected, setSelected] = useState<TicketItem | null>(mockTickets[0] || null)

  const filteredData = mockTickets.filter(item => {
    if (typeFilter && item.type !== typeFilter) return false
    if (statusFilter && item.status !== statusFilter) return false
    if (sourceFilter && item.source !== sourceFilter) return false
    if (
      keyword &&
      !(
        item.userName.includes(keyword) ||
        item.project.includes(keyword) ||
        item.id.includes(keyword)
      )
    ) {
      return false
    }
    return true
  })

  const columns: ColumnsType<TicketItem> = [
    {
      title: '工单号',
      dataIndex: 'id',
      key: 'id',
      width: 140
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      width: 100
    },
    {
      title: '项目',
      dataIndex: 'project',
      key: 'project'
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      key: 'type',
      width: 110,
      render: (type: TicketType) => {
        const colorMap: Record<TicketType, string> = {
          预约意向: 'blue',
          高危复查: 'red',
          客诉: 'orange'
        }
        return <Tag color={colorMap[type]}>{type}</Tag>
      }
    },
    {
      title: '意向 / 风险',
      key: 'level',
      width: 120,
      render: (_, record) => (
        <Space size={4}>
          {record.intentionLevel && (
            <Tag
              color={
                record.intentionLevel === '高'
                  ? 'magenta'
                  : record.intentionLevel === '中'
                  ? 'cyan'
                  : 'default'
              }
            >
              意向 {record.intentionLevel}
            </Tag>
          )}
          {record.riskLevel && (
            <Tag
              color={
                record.riskLevel === '高'
                  ? 'red'
                  : record.riskLevel === '中'
                  ? 'gold'
                  : 'green'
              }
            >
              风险 {record.riskLevel}
            </Tag>
          )}
        </Space>
      )
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 110
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: TicketStatus) => {
        const colorMap: Record<TicketStatus, string> = {
          未处理: 'default',
          处理中: 'processing',
          已完成: 'success'
        }
        return <Tag color={colorMap[status]}>{status}</Tag>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        {/* 左侧列表 */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <ProfileOutlined />
                <span>管家工单列表</span>
              </Space>
            }
          >
            <Row gutter={12} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Input
                  placeholder="搜索用户名 / 项目 / 工单号"
                  prefix={<SearchOutlined />}
                  allowClear
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                />
              </Col>
              <Col span={6}>
                <Select
                  allowClear
                  placeholder="任务类型"
                  style={{ width: '100%' }}
                  value={typeFilter}
                  onChange={value => setTypeFilter(value as TicketType | undefined)}
                >
                  <Option value="预约意向">预约意向</Option>
                  <Option value="高危复查">高危复查</Option>
                  <Option value="客诉">客诉</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Select
                  allowClear
                  placeholder="状态"
                  style={{ width: '100%' }}
                  value={statusFilter}
                  onChange={value => setStatusFilter(value as TicketStatus | undefined)}
                >
                  <Option value="未处理">未处理</Option>
                  <Option value="处理中">处理中</Option>
                  <Option value="已完成">已完成</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Select
                  allowClear
                  placeholder="来源"
                  style={{ width: '100%' }}
                  value={sourceFilter}
                  onChange={value => setSourceFilter(value as TicketSource | undefined)}
                >
                  <Option value="AI 管家">AI 管家</Option>
                  <Option value="线下">线下</Option>
                  <Option value="其他渠道">其他渠道</Option>
                </Select>
              </Col>
            </Row>

            <Table
              rowKey="id"
              columns={columns}
              dataSource={filteredData}
              size="small"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条任务`
              }}
              onRow={record => ({
                onClick: () => setSelected(record),
                style: {
                  cursor: 'pointer'
                }
              })}
            />
          </Card>
        </Col>

        {/* 右侧详情 */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <WarningOutlined />
                <span>任务详情</span>
              </Space>
            }
            extra={
              selected && (
                <Space>
                  <Button size="small" type="primary">
                    标记完成
                  </Button>
                  <Button size="small">添加备注</Button>
                </Space>
              )
            }
          >
            {selected ? (
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Descriptions
                  bordered
                  size="small"
                  column={1}
                  title={
                    <Space>
                      <UserOutlined />
                      <span>{selected.userName}</span>
                    </Space>
                  }
                >
                  <Descriptions.Item label="项目">{selected.project}</Descriptions.Item>
                  <Descriptions.Item label="工单号">{selected.id}</Descriptions.Item>
                  <Descriptions.Item label="任务类型">
                    <Tag>{selected.type}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Tag>{selected.status}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="来源">{selected.source}</Descriptions.Item>
                  <Descriptions.Item label="意向等级">
                    {selected.intentionLevel ? (
                      <Tag color="magenta">{selected.intentionLevel}</Tag>
                    ) : (
                      '-'
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="风险等级">
                    {selected.riskLevel ? (
                      <Tag color="red">{selected.riskLevel}</Tag>
                    ) : (
                      '-'
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="当前负责人">
                    {selected.assignee || '未分配'}
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    <Space>
                      <CalendarOutlined />
                      <span>{selected.createTime}</span>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>

                <Card
                  size="small"
                  title="任务描述（AI 自动总结）"
                  bordered={false}
                  style={{ background: '#fafafa' }}
                >
                  <p style={{ marginBottom: 0 }}>{selected.summary}</p>
                </Card>

                <Card
                  size="small"
                  title="推荐处理话术 / 建议"
                  bordered={false}
                  style={{ background: '#fafafa' }}
                >
                  <p style={{ marginBottom: 0 }}>{selected.suggestion}</p>
                </Card>

                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Button icon={<PhoneOutlined />}>拨打电话</Button>
                  <Button>分配给客服 / 医生</Button>
                </Space>
              </Space>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#999' }}>
                请选择左侧列表中的一条任务查看详情
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ButlerTicketList


