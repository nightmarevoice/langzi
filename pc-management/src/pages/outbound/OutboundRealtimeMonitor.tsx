import React, { useEffect, useState } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Button,
  Space,
  Typography,
  Badge,
  message
} from 'antd'
import {
  PhoneOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  PauseCircleOutlined,
  StopOutlined,
  UserSwitchOutlined
} from '@ant-design/icons'
import { Heatmap } from '@ant-design/charts'
import type { HeatmapConfig } from '@ant-design/charts'

const { Title, Text } = Typography

interface ActiveCall {
  id: string
  customerNumber: string
  taskName: string
  durationSeconds: number
  currentNode: string
  interrupted: boolean
  status: 'queue' | 'ringing' | 'in_call'
}

interface HeatmapPoint {
  hour: string
  day: string
  value: number
}

const initialCalls: ActiveCall[] = [
  {
    id: 'c1',
    customerNumber: '138****1234',
    taskName: '满意度回访-昨日测肤用户',
    durationSeconds: 95,
    currentNode: '问满意度',
    interrupted: false,
    status: 'in_call'
  },
  {
    id: 'c2',
    customerNumber: '186****5678',
    taskName: '新品活动邀约',
    durationSeconds: 40,
    currentNode: '介绍活动权益',
    interrupted: true,
    status: 'in_call'
  },
  {
    id: 'c3',
    customerNumber: '139****8888',
    taskName: '复购提醒-高价值客户',
    durationSeconds: 15,
    currentNode: '开场问候',
    interrupted: false,
    status: 'ringing'
  },
  {
    id: 'c4',
    customerNumber: '137****2222',
    taskName: '投诉关怀回访',
    durationSeconds: 0,
    currentNode: '排队中',
    interrupted: false,
    status: 'queue'
  }
]

const OutboundRealtimeMonitor: React.FC = () => {
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>(initialCalls)
  const [selectedCall, setSelectedCall] = useState<ActiveCall | null>(initialCalls[0])

  const [currentCalls, setCurrentCalls] = useState(12)
  const [queueSize, setQueueSize] = useState(5)
  const [avgAnswerTime, setAvgAnswerTime] = useState(18)

  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([])

  useEffect(() => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    const data: HeatmapPoint[] = []
    days.forEach(day => {
      for (let h = 9; h <= 21; h++) {
        const hourLabel = `${h}:00`
        let base =
          h >= 10 && h <= 12
            ? 60
            : h >= 14 && h <= 16
            ? 90
            : h >= 19 && h <= 21
            ? 70
            : 30
        if (day === '周六' || day === '周日') {
          base *= 0.6
        }
        const value = Math.round(base * (0.6 + Math.random() * 0.8))
        data.push({
          hour: hourLabel,
          day,
          value
        })
      }
    })
    setHeatmapData(data)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCalls(prev =>
        prev.map(call =>
          call.status === 'in_call'
            ? { ...call, durationSeconds: call.durationSeconds + 3 }
            : call
        )
      )

      setCurrentCalls(prev => {
        const delta = Math.round((Math.random() - 0.5) * 2)
        return Math.max(0, prev + delta)
      })
      setQueueSize(prev => {
        const delta = Math.round((Math.random() - 0.5) * 2)
        return Math.max(0, prev + delta)
      })
      setAvgAnswerTime(prev => {
        const delta = (Math.random() - 0.5) * 2
        return Math.max(5, Math.min(40, Number((prev + delta).toFixed(1))))
      })
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleForceHangup = (call: ActiveCall) => {
    message.success(`已强制挂断与 ${call.customerNumber} 的通话`)
    setActiveCalls(prev => prev.filter(c => c.id !== call.id))
    if (selectedCall?.id === call.id) {
      setSelectedCall(null)
    }
  }

  const handleInsertHuman = (call: ActiveCall) => {
    message.success(`已为任务【${call.taskName}】插入人工坐席`)
  }

  const handleMute = (call: ActiveCall) => {
    message.success(`已对通话 ${call.customerNumber} 进行静音操作（示意）`)
  }

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const heatmapConfig: HeatmapConfig = {
    data: heatmapData,
    xField: 'hour',
    yField: 'day',
    colorField: 'value',
    color: ['#e6f7ff', '#bae7ff', '#69c0ff', '#1890ff', '#0050b3'],
    xAxis: {
      label: {
        autoHide: true
      }
    },
    yAxis: {
      label: {
        autoRotate: false
      }
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '外呼量',
        value: `${datum.value} 通`
      })
    }
  }

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        实时外呼监控（通话墙）
      </Title>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="当前通话数"
              value={currentCalls}
              prefix={<PhoneOutlined style={{ color: '#1890ff' }} />}
              suffix="路"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="排队数"
              value={queueSize}
              prefix={<TeamOutlined style={{ color: '#faad14' }} />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="平均接通时间"
              value={avgAnswerTime}
              prefix={<ClockCircleOutlined style={{ color: '#52c41a' }} />}
              suffix="秒"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="活跃通话列表"
            extra={<Text type="secondary">方块视图展示当前通话状态，可即时操作</Text>}
          >
            <Row gutter={[12, 12]}>
              {activeCalls.map(call => (
                <Col span={12} key={call.id}>
                  <Card
                    hoverable
                    onClick={() => setSelectedCall(call)}
                    style={{
                      borderColor: selectedCall?.id === call.id ? '#1890ff' : undefined
                    }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                        <Space>
                          <Badge
                            status={
                              call.status === 'in_call'
                                ? 'success'
                                : call.status === 'ringing'
                                ? 'processing'
                                : 'warning'
                            }
                          />
                          <Text strong>{call.customerNumber}</Text>
                        </Space>
                        <Tag color="blue">{call.taskName}</Tag>
                      </Space>
                      <Space>
                        <Tag icon={<ClockCircleOutlined />} color="default">
                          已通话 {formatDuration(call.durationSeconds)}
                        </Tag>
                        <Tag color="purple">{call.currentNode}</Tag>
                        {call.interrupted && <Tag color="red">被打断中</Tag>}
                      </Space>
                      <Space>
                        <Button
                          size="small"
                          danger
                          icon={<StopOutlined />}
                          onClick={e => {
                            e.stopPropagation()
                            handleForceHangup(call)
                          }}
                        >
                          强制挂断
                        </Button>
                        <Button
                          size="small"
                          icon={<UserSwitchOutlined />}
                          onClick={e => {
                            e.stopPropagation()
                            handleInsertHuman(call)
                          }}
                        >
                          插入人工
                        </Button>
                        <Button
                          size="small"
                          icon={<PauseCircleOutlined />}
                          onClick={e => {
                            e.stopPropagation()
                            handleMute(call)
                          }}
                        >
                          静音
                        </Button>
                      </Space>
                    </Space>
                  </Card>
                </Col>
              ))}
              {activeCalls.length === 0 && (
                <Col span={24}>
                  <Text type="secondary">当前暂无活跃通话。</Text>
                </Col>
              )}
            </Row>
          </Card>

          <Card title="外呼热力图（按时间段呼叫峰值）" style={{ marginTop: 16 }}>
            <Heatmap {...heatmapConfig} style={{ height: 280 }} />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="通话详情" style={{ height: '100%' }}>
            {selectedCall ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <PhoneOutlined />
                  <Text strong>{selectedCall.customerNumber}</Text>
                </Space>
                <Space>
                  <Text type="secondary">任务名称：</Text>
                  <Text>{selectedCall.taskName}</Text>
                </Space>
                <Space>
                  <Text type="secondary">已通话时长：</Text>
                  <Text>{formatDuration(selectedCall.durationSeconds)}</Text>
                </Space>
                <Space>
                  <Text type="secondary">当前节点：</Text>
                  <Tag color="purple">{selectedCall.currentNode}</Tag>
                </Space>
                <Space>
                  <Text type="secondary">是否被打断：</Text>
                  {selectedCall.interrupted ? (
                    <Tag color="red">是</Tag>
                  ) : (
                    <Tag color="green">否</Tag>
                  )}
                </Space>
                <Space style={{ marginTop: 12 }}>
                  <Button
                    danger
                    icon={<StopOutlined />}
                    onClick={() => handleForceHangup(selectedCall)}
                  >
                    强制挂断
                  </Button>
                  <Button
                    icon={<UserSwitchOutlined />}
                    onClick={() => handleInsertHuman(selectedCall)}
                  >
                    插入人工
                  </Button>
                  <Button icon={<PauseCircleOutlined />} onClick={() => handleMute(selectedCall)}>
                    静音
                  </Button>
                </Space>
              </Space>
            ) : (
              <Text type="secondary">请选择左侧任一通话查看详情。</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OutboundRealtimeMonitor


