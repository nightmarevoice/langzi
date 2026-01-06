import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Space, Tag, Button, List, Progress } from 'antd'
import {
  MessageOutlined,
  PhoneOutlined,
  UserSwitchOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  ArrowUpOutlined
} from '@ant-design/icons'
import { Line, Column } from '@ant-design/charts'
import type { LineConfig, ColumnConfig } from '@ant-design/charts'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

interface ButlerMetrics {
  todayConversations: number
  validConsultations: number
  intentionOrders: number
  careTouched: number
  careReplyRate: number
  highRiskAlerts: number
}

interface TrendPoint {
  date: string
  value: number
}

interface QuestionStat {
  question: string
  count: number
}

interface FunnelStep {
  stage: string
  value: number
}

const ButlerDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState<ButlerMetrics | null>(null)
  const [trendData, setTrendData] = useState<TrendPoint[]>([])
  const [questionData, setQuestionData] = useState<QuestionStat[]>([])
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([])

  useEffect(() => {
    // 模拟加载数据
    const todayConversations = 320 + Math.floor(Math.random() * 80)
    const validConsultations = Math.floor(todayConversations * (0.6 + Math.random() * 0.15))
    const intentionOrders = Math.floor(validConsultations * (0.25 + Math.random() * 0.1))
    const careTouched = 150 + Math.floor(Math.random() * 50)
    const careReplyRate = 65 + Math.floor(Math.random() * 15)
    const highRiskAlerts = 5 + Math.floor(Math.random() * 8)

    setMetrics({
      todayConversations,
      validConsultations,
      intentionOrders,
      careTouched,
      careReplyRate,
      highRiskAlerts
    })

    // 7 日会话趋势
    const base = todayConversations
    const trend: TrendPoint[] = []
    let current = base
    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day')
      const variation = 1 + (Math.random() - 0.5) * 0.3
      current = Math.round(current * variation)
      trend.push({
        date: date.format('MM-DD'),
        value: current
      })
    }
    setTrendData(trend)

    // 热门问题 Top N
    setQuestionData([
      { question: '术后多久可以洗脸？', count: 86 },
      { question: '肿胀一般持续几天？', count: 72 },
      { question: '需要复查几次？', count: 55 },
      { question: '可以正常上班吗？', count: 41 },
      { question: '会留疤吗？', count: 36 }
    ])

    // 活动转化“伪漏斗”（用柱状图表现）
    const reach = 1200 + Math.floor(Math.random() * 400)
    const click = Math.floor(reach * (0.45 + Math.random() * 0.1))
    const intention = Math.floor(click * (0.35 + Math.random() * 0.1))
    const order = Math.floor(intention * (0.5 + Math.random() * 0.1))

    setFunnelData([
      { stage: '触达人数', value: reach },
      { stage: '活动点击', value: click },
      { stage: '提交意向', value: intention },
      { stage: '完成预约', value: order }
    ])
  }, [])

  const trendConfig: LineConfig = {
    data: trendData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    color: '#1890ff',
    point: { size: 4, shape: 'circle' },
    yAxis: {
      label: {
        formatter: (text: string) => `${text} 次`
      }
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '会话数',
        value: `${datum.value} 次`
      })
    }
  }

  const questionConfig: ColumnConfig = {
    data: questionData,
    xField: 'question',
    yField: 'count',
    color: '#13c2c2',
    columnStyle: { radius: [4, 4, 0, 0] },
    xAxis: {
      label: {
        autoRotate: true
      }
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '提问次数',
        value: `${datum.count} 次`
      })
    }
  }

  const funnelConfig: ColumnConfig = {
    data: funnelData,
    xField: 'stage',
    yField: 'value',
    color: '#faad14',
    columnStyle: { radius: [4, 4, 0, 0] },
    label: {
      position: 'top',
      formatter: (datum: any) => ``
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.stage,
        value: `${datum.value}`
      })
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col flex="auto">
          <h2 style={{ marginBottom: 24 }}>AI 管家运营总览</h2>
        </Col>
        <Col>
          <Tag color="blue">今日总览</Tag>
        </Col>
      </Row>

      {/* KPI 卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="今日会话数"
              value={metrics?.todayConversations ?? 0}
              prefix={<MessageOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
              suffix=" 次"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="有效咨询数"
              value={metrics?.validConsultations ?? 0}
              prefix={<PhoneOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
              suffix=" 次"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="预约意向数"
              value={metrics?.intentionOrders ?? 0}
              prefix={<UserSwitchOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
              suffix=" 单"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="术后关怀触达人数"
              value={metrics?.careTouched ?? 0}
              prefix={<ThunderboltOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
              suffix=" 人"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="术后关怀回复率"
              value={metrics?.careReplyRate ?? 0}
              prefix={<ArrowUpOutlined style={{ color: '#13c2c2' }} />}
              valueStyle={{ color: '#13c2c2' }}
              suffix="%"
            />
            <div style={{ marginTop: 8 }}>
              <Progress
                percent={metrics?.careReplyRate ?? 0}
                size="small"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="高危预警数量"
              value={metrics?.highRiskAlerts ?? 0}
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
              suffix=" 单"
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="red">需人工关注</Tag>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 左侧：趋势 & 热门问题 & 活动转化 */}
        <Col xs={24} lg={18}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="会话时间趋势（最近 7 天）" bodyStyle={{ height: 320 }}>
                {trendData.length > 0 ? (
                  <Line {...trendConfig} height={260} />
                ) : (
                  <div
                    style={{
                      height: 260,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999'
                    }}
                  >
                    暂无数据
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="热门问题 Top N" bodyStyle={{ height: 320 }}>
                {questionData.length > 0 ? (
                  <Column {...questionConfig} height={260} />
                ) : (
                  <div
                    style={{
                      height: 260,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999'
                    }}
                  >
                    暂无数据
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="活动点击 / 转化" bodyStyle={{ height: 320 }}>
                {funnelData.length > 0 ? (
                  <Column {...funnelConfig} height={260} />
                ) : (
                  <div
                    style={{
                      height: 260,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999'
                    }}
                  >
                    暂无数据
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </Col>

        {/* 右侧：快速入口 & 高危列表 */}
        <Col xs={24} lg={6}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card title="快速入口">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  block
                  onClick={() => navigate('/butler/conversation')}
                >
                  打开管家会话中心
                </Button>
                <Button
                  block
                  onClick={() => navigate('/butler/tickets')}
                >
                  查看意向 / 工单列表
                </Button>
                <Button
                  block
                  danger
                  onClick={() => navigate('/butler/tickets')}
                >
                  高危预警列表
                </Button>
              </Space>
            </Card>

            <Card
              title={
                <Space>
                  <WarningOutlined style={{ color: '#ff4d4f' }} />
                  <span>今日高危预警</span>
                </Space>
              }
            >
              <List
                size="small"
                dataSource={[
                  {
                    name: '王小姐',
                    tag: '术后不适',
                    time: '10:12',
                    level: '高危'
                  },
                  {
                    name: '李先生',
                    tag: '投诉',
                    time: '09:45',
                    level: '高危'
                  },
                  {
                    name: '周女士',
                    tag: '异常疼痛',
                    time: '09:20',
                    level: '中危'
                  }
                ]}
                renderItem={item => (
                  <List.Item>
                    <Space direction="vertical" size={2} style={{ width: '100%' }}>
                      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                        <span>{item.name}</span>
                        <span style={{ fontSize: 12, color: '#999' }}>{item.time}</span>
                      </Space>
                      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                        <Tag color="orange">{item.tag}</Tag>
                        <Tag color={item.level === '高危' ? 'red' : 'gold'}>
                          {item.level}
                        </Tag>
                      </Space>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  )
}

export default ButlerDashboard


