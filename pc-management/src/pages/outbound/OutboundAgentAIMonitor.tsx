import React, { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Space,
  Typography,
  Statistic,
  Progress
} from 'antd'
import {
  UserOutlined,
  RobotOutlined,
  PhoneOutlined,
  DashboardOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

interface Agent {
  id: string
  name: string
  status: '空闲' | '通话中' | '离线'
  skillGroup: string
  currentTask?: string
  currentCallNumber?: string
}

interface AIInstance {
  id: string
  name: string
  type: 'AI外呼机器人' | 'AI客服'
  onlineSessions: number
  maxSessions: number
  cpuUsage: number
  memoryUsage: number
}

const OutboundAgentAIMonitor: React.FC = () => {
  const [agents] = useState<Agent[]>([
    {
      id: 'a1',
      name: '张婷',
      status: '通话中',
      skillGroup: '外呼-满意度回访',
      currentTask: '满意度回访-昨日测肤用户',
      currentCallNumber: '138****1234'
    },
    {
      id: 'a2',
      name: '李强',
      status: '空闲',
      skillGroup: '外呼-活动邀约'
    },
    {
      id: 'a3',
      name: '王珊',
      status: '空闲',
      skillGroup: '外呼-高价值客户'
    },
    {
      id: 'a4',
      name: '陈浩',
      status: '离线',
      skillGroup: '客服-投诉处理'
    }
  ])

  const [aiInstances] = useState<AIInstance[]>([
    {
      id: 'ai1',
      name: '外呼机器人-满意度',
      type: 'AI外呼机器人',
      onlineSessions: 32,
      maxSessions: 80,
      cpuUsage: 42,
      memoryUsage: 61
    },
    {
      id: 'ai2',
      name: '外呼机器人-活动邀约',
      type: 'AI外呼机器人',
      onlineSessions: 18,
      maxSessions: 60,
      cpuUsage: 35,
      memoryUsage: 48
    },
    {
      id: 'ai3',
      name: 'AI 客服-售后支持',
      type: 'AI客服',
      onlineSessions: 12,
      maxSessions: 40,
      cpuUsage: 28,
      memoryUsage: 39
    }
  ])

  const totalOnlineAgents = agents.filter(a => a.status !== '离线').length
  const totalBusyAgents = agents.filter(a => a.status === '通话中').length
  const totalAISessions = aiInstances.reduce((sum, i) => sum + i.onlineSessions, 0)
  const totalAICapacity = aiInstances.reduce((sum, i) => sum + i.maxSessions, 0)

  const agentColumns = [
    {
      title: '坐席姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: Agent['status']) => {
        if (status === '通话中') return <Tag color="green">通话中</Tag>
        if (status === '空闲') return <Tag color="blue">空闲</Tag>
        return <Tag>离线</Tag>
      }
    },
    {
      title: '技能组',
      dataIndex: 'skillGroup',
      key: 'skillGroup'
    },
    {
      title: '当前通话',
      key: 'current',
      render: (_: any, record: Agent) =>
        record.currentTask ? (
          <Space direction="vertical">
            <Text>{record.currentTask}</Text>
            {record.currentCallNumber && (
              <Space>
                <PhoneOutlined />
                <Text type="secondary">{record.currentCallNumber}</Text>
              </Space>
            )}
          </Space>
        ) : (
          <Text type="secondary">-</Text>
        )
    }
  ]

  const aiColumns = [
    {
      title: '实例名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <RobotOutlined />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: AIInstance['type']) =>
        type === 'AI外呼机器人' ? (
          <Tag color="purple">AI 外呼机器人</Tag>
        ) : (
          <Tag color="cyan">AI 客服</Tag>
        )
    },
    {
      title: '在线会话',
      key: 'sessions',
      render: (_: any, record: AIInstance) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Text>
              {record.onlineSessions} / {record.maxSessions}
            </Text>
            <Tag color={record.onlineSessions / record.maxSessions > 0.7 ? 'red' : 'blue'}>
              {(record.onlineSessions / record.maxSessions * 100).toFixed(0)}%
            </Tag>
          </Space>
          <Progress
            percent={Number(
              ((record.onlineSessions / record.maxSessions) * 100).toFixed(0)
            )}
            size="small"
            showInfo={false}
          />
        </Space>
      )
    },
    {
      title: '资源占用',
      key: 'resource',
      render: (_: any, record: AIInstance) => (
        <Space direction="vertical" style={{ width: 160 }}>
          <Space>
            <Text type="secondary">CPU</Text>
            <Text>{record.cpuUsage}%</Text>
          </Space>
          <Progress percent={record.cpuUsage} size="small" />
          <Space>
            <Text type="secondary">内存</Text>
            <Text>{record.memoryUsage}%</Text>
          </Space>
          <Progress percent={record.memoryUsage} size="small" />
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        在线坐席 / AI 实例监控
      </Title>
      <Text type="secondary">
        统一观察人工坐席与 AI 实例的实时占用，辅助外呼调度与“AI + 人工” 协同。
      </Text>

      <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线人工坐席"
              value={totalOnlineAgents}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="通话中坐席"
              value={totalBusyAgents}
              prefix={<PhoneOutlined style={{ color: '#52c41a' }} />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="AI 会话占用"
              value={totalAISessions}
              prefix={<RobotOutlined style={{ color: '#722ed1' }} />}
              suffix="会话"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="AI 总容量"
              value={totalAICapacity}
              prefix={<DashboardOutlined style={{ color: '#fa8c16' }} />}
              suffix="会话"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="人工坐席状态">
            <Table<Agent> rowKey="id" columns={agentColumns} dataSource={agents} pagination={false} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="AI 实例占用情况">
            <Table<AIInstance>
              rowKey="id"
              columns={aiColumns}
              dataSource={aiInstances}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OutboundAgentAIMonitor


