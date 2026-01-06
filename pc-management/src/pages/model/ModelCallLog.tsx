import React from 'react'
import { Card, Table, Button, Space, Input, DatePicker, Select, Tag } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker
const { Option } = Select

interface ModelCallLogRecord {
  id: string
  time: string
  caller: string
  modelName: string
  provider: string
  scene: string
  requestId: string
  latencyMs: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
  status: '成功' | '失败'
  errorMessage?: string
}

const mockData: ModelCallLogRecord[] = [
  {
    id: '1',
    time: '2025-01-10 10:23:45',
    caller: '智能客服 - 会话中心',
    modelName: 'gpt-4.1-mini',
    provider: 'OpenAI',
    scene: '客服对话回复',
    requestId: 'req_20250110102345001',
    latencyMs: 1230,
    inputTokens: 820,
    outputTokens: 210,
    totalTokens: 1030,
    status: '成功',
    errorMessage: ''
  },
  {
    id: '2',
    time: '2025-01-10 10:20:11',
    caller: 'AI测肤报告生成',
    modelName: 'gpt-4.1',
    provider: 'OpenAI',
    scene: '测肤报告文案生成',
    requestId: 'req_20250110102011002',
    latencyMs: 2310,
    inputTokens: 1520,
    outputTokens: 640,
    totalTokens: 2160,
    status: '成功',
    errorMessage: ''
  },
  {
    id: '3',
    time: '2025-01-10 10:18:03',
    caller: '智能客服 - 会话中心',
    modelName: 'gpt-4.1-mini',
    provider: 'OpenAI',
    scene: '客服对话回复',
    requestId: 'req_20250110101803003',
    latencyMs: 5200,
    inputTokens: 600,
    outputTokens: 0,
    totalTokens: 600,
    status: '失败',
    errorMessage: '上游模型超时（HTTP 504）'
  }
]

const ModelCallLog: React.FC = () => {
  const columns = [
    {
      title: '调用时间',
      dataIndex: 'time',
      key: 'time',
      width: 180
    },
    {
      title: '调用方',
      dataIndex: 'caller',
      key: 'caller',
      width: 200
    },
    {
      title: '业务场景',
      dataIndex: 'scene',
      key: 'scene',
      width: 180
    },
    {
      title: '模型名称',
      dataIndex: 'modelName',
      key: 'modelName',
      width: 140
    },
    {
      title: '模型服务商',
      dataIndex: 'provider',
      key: 'provider',
      width: 140
    },
    {
      title: '请求 ID',
      dataIndex: 'requestId',
      key: 'requestId',
      width: 230,
      ellipsis: true
    },
    {
      title: '耗时 (ms)',
      dataIndex: 'latencyMs',
      key: 'latencyMs',
      width: 110,
      sorter: (a: ModelCallLogRecord, b: ModelCallLogRecord) => a.latencyMs - b.latencyMs
    },
    {
      title: 'Token 统计',
      key: 'tokens',
      width: 180,
      render: (_: any, record: ModelCallLogRecord) => (
        <span>
          入参 {record.inputTokens} / 出参 {record.outputTokens} / 总计 {record.totalTokens}
        </span>
      )
    },
    {
      title: '调用状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ModelCallLogRecord['status']) => (
        <Tag color={status === '成功' ? 'success' : 'error'}>{status}</Tag>
      )
    },
    {
      title: '错误信息',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      ellipsis: true
    }
  ]

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索请求 ID / 调用方 / 错误信息"
              prefix={<SearchOutlined />}
              style={{ width: 260 }}
            />
            <Select placeholder="模型名称" style={{ width: 180 }} allowClear>
              <Option value="gpt-4.1-mini">gpt-4.1-mini</Option>
              <Option value="gpt-4.1">gpt-4.1</Option>
            </Select>
            <Select placeholder="模型服务商" style={{ width: 160 }} allowClear>
              <Option value="OpenAI">OpenAI</Option>
              <Option value="AzureOpenAI">Azure OpenAI</Option>
              <Option value="Other">其他</Option>
            </Select>
            <Select placeholder="调用状态" style={{ width: 140 }} allowClear>
              <Option value="success">成功</Option>
              <Option value="fail">失败</Option>
            </Select>
            <RangePicker showTime />
            <Button type="primary">搜索</Button>
            <Button icon={<ReloadOutlined />}>重置</Button>
          </Space>
        </div>
        <Table<ModelCallLogRecord>
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          scroll={{ x: 1300 }}
        />
      </Card>
    </div>
  )
}

export default ModelCallLog


