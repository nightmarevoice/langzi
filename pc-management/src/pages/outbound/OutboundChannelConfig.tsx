import React, { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Space,
  Switch,
  InputNumber,
  Form,
  Select,
  message,
  Divider,
  Typography,
  Modal,
  Progress
} from 'antd'
import {
  PlusOutlined,
  ThunderboltOutlined,
  PhoneOutlined,
  SoundOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

interface OutboundLine {
  id: string
  name: string
  vendor: string
  numberPoolSize: number
  concurrentLimit: number
  status: 'active' | 'inactive'
}

interface DisplayNumber {
  id: string
  name: string
  type: '本地号码' | '400号码'
  number: string
  isDefault: boolean
  status: 'active' | 'inactive'
}

const OutboundChannelConfig: React.FC = () => {
  const [lines] = useState<OutboundLine[]>([
    {
      id: '1',
      name: '主线路-杭州机房',
      vendor: '阿里云语音',
      numberPoolSize: 200,
      concurrentLimit: 80,
      status: 'active'
    },
    {
      id: '2',
      name: '备用线路-上海机房',
      vendor: '腾讯云语音',
      numberPoolSize: 100,
      concurrentLimit: 40,
      status: 'active'
    },
    {
      id: '3',
      name: '外包供应商-广东',
      vendor: '某运营商外包',
      numberPoolSize: 50,
      concurrentLimit: 20,
      status: 'inactive'
    }
  ])

  const [displayNumbers] = useState<DisplayNumber[]>([
    {
      id: 'n1',
      name: '全国统一客服热线',
      type: '400号码',
      number: '400-888-1234',
      isDefault: true,
      status: 'active'
    },
    {
      id: 'n2',
      name: '杭州本地外显',
      type: '本地号码',
      number: '0571-88886666',
      isDefault: false,
      status: 'active'
    },
    {
      id: 'n3',
      name: '活动专用线路',
      type: '本地号码',
      number: '0571-99990000',
      isDefault: false,
      status: 'inactive'
    }
  ])

  const [recordingEnabled, setRecordingEnabled] = useState(true)
  const [retentionDays, setRetentionDays] = useState<number>(30)

  const [pressureVisible, setPressureVisible] = useState(false)
  const [pressureRunning, setPressureRunning] = useState(false)
  const [pressureProgress, setPressureProgress] = useState(0)
  const [pressureResult, setPressureResult] = useState<string | null>(null)

  const [form] = Form.useForm()

  const handleSaveRecordingConfig = () => {
    const mode = recordingEnabled ? '开启' : '关闭'
    message.success(`已保存录音配置：${mode}录音，保留 ${retentionDays} 天`)
  }

  const startPressureTest = () => {
    setPressureVisible(true)
    setPressureRunning(true)
    setPressureProgress(0)
    setPressureResult(null)

    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setPressureRunning(false)
        setPressureResult('压测完成：在 60 秒内稳定支撑 120 路并发通话，平均 ASR 延迟 280ms。')
      }
      setPressureProgress(progress)
    }, 300)
  }

  const lineColumns = [
    {
      title: '线路名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: '供应商',
      dataIndex: 'vendor',
      key: 'vendor'
    },
    {
      title: '号码池规模',
      dataIndex: 'numberPoolSize',
      key: 'numberPoolSize',
      render: (value: number) => `${value} 个号码`
    },
    {
      title: '并发上限',
      dataIndex: 'concurrentLimit',
      key: 'concurrentLimit',
      render: (value: number) => `${value} 路`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: OutboundLine['status']) =>
        status === 'active' ? <Tag color="green">启用</Tag> : <Tag color="default">停用</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link">编辑</Button>
          <Button type="link" danger>
            停用
          </Button>
        </Space>
      )
    }
  ]

  const numberColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '外显类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: DisplayNumber['type']) =>
        type === '400号码' ? <Tag color="blue">400 号码</Tag> : <Tag color="cyan">本地号码</Tag>
    },
    {
      title: '外显号码',
      dataIndex: 'number',
      key: 'number'
    },
    {
      title: '是否默认',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (val: boolean) => (val ? <Tag color="gold">默认</Tag> : '-')
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: DisplayNumber['status']) =>
        status === 'active' ? <Tag color="green">启用</Tag> : <Tag color="default">停用</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link">设为默认</Button>
          <Button type="link">编辑</Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        外呼通道 & 供应商配置
      </Title>
      <Text type="secondary">
        配置外呼线路、供应商和外显号码策略，统一管理并发能力与通话录音策略。
      </Text>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card
            title={
              <Space>
                <PhoneOutlined />
                <span>线路 / 供应商列表</span>
              </Space>
            }
            extra={
              <Button type="primary" icon={<PlusOutlined />}>
                新增线路
              </Button>
            }
          >
            <Table<OutboundLine>
              rowKey="id"
              columns={lineColumns}
              dataSource={lines}
              pagination={false}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title={
              <Space>
                <SoundOutlined />
                <span>通话录音配置</span>
              </Space>
            }
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                recordingEnabled,
                retentionDays
              }}
            >
              <Form.Item label="通话录音开关" name="recordingEnabled">
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  checked={recordingEnabled}
                  onChange={checked => setRecordingEnabled(checked)}
                />
              </Form.Item>
              <Form.Item label="录音保留时长（天）">
                <InputNumber
                  min={7}
                  max={365}
                  value={retentionDays}
                  onChange={value => setRetentionDays(value || 7)}
                  style={{ width: '100%' }}
                />
                <Text type="secondary">建议 30~180 天，根据合规要求调整。</Text>
              </Form.Item>
              <Form.Item label="录音存储区域">
                <Select defaultValue="cn-hangzhou">
                  <Option value="cn-hangzhou">华东 1（杭州）</Option>
                  <Option value="cn-shanghai">华东 2（上海）</Option>
                  <Option value="cn-shenzhen">华南 1（深圳）</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" onClick={handleSaveRecordingConfig}>
                    保存配置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card
            title="外显号码配置"
            extra={
              <Button type="primary" icon={<PlusOutlined />}>
                新增外显号码
              </Button>
            }
          >
            <Table<DisplayNumber>
              rowKey="id"
              columns={numberColumns}
              dataSource={displayNumbers}
              pagination={false}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title={
              <Space>
                <ThunderboltOutlined />
                <span>压测并发能力</span>
              </Space>
            }
            extra={
              <Button type="primary" onClick={startPressureTest} disabled={pressureRunning}>
                一键压测
              </Button>
            }
          >
            <Text>
              用于在低峰期对当前外呼通道做压测，评估可承载并发上限，建议在业务低谷时段执行。
            </Text>
            <Divider />
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <Text type="secondary">目标并发：</Text>
                <Tag color="blue">120 路</Tag>
              </Space>
              <Space>
                <Text type="secondary">压测时长：</Text>
                <Tag>60 秒</Tag>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        open={pressureVisible}
        title="压测进行中"
        footer={
          <Button onClick={() => setPressureVisible(false)} disabled={pressureRunning}>
            关闭
          </Button>
        }
        onCancel={() => !pressureRunning && setPressureVisible(false)}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>正在发起压测呼叫，请勿在业务高峰时段频繁使用该功能。</Text>
          <Progress percent={pressureProgress} status={pressureRunning ? 'active' : 'normal'} />
          {pressureResult && (
            <Card size="small" type="inner" title="压测结果">
              <Text>{pressureResult}</Text>
            </Card>
          )}
        </Space>
      </Modal>
    </div>
  )
}

export default OutboundChannelConfig


