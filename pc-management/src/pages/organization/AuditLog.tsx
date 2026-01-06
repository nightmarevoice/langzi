import React from 'react'
import { Card, Table, Button, Space, Input, DatePicker, Select } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker
const { Option } = Select

const AuditLog: React.FC = () => {
  const columns = [
    {
      title: '审计时间',
      dataIndex: 'auditTime',
      key: 'auditTime',
      width: 180,
    },
    {
      title: '审计人',
      dataIndex: 'auditor',
      key: 'auditor',
      width: 120,
    },
    {
      title: '被审计对象',
      dataIndex: 'target',
      key: 'target',
      width: 150,
    },
    {
      title: '审计类型',
      dataIndex: 'auditType',
      key: 'auditType',
      width: 120,
    },
    {
      title: '审计内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '审计结果',
      dataIndex: 'result',
      key: 'result',
      width: 120,
      render: (result: string) => (
        <span style={{ color: result === '通过' ? '#52c41a' : '#ff4d4f' }}>
          {result}
        </span>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
  ]

  const data: any[] = []

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索审计内容"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
            <Select placeholder="审计类型" style={{ width: 150 }} allowClear>
              <Option value="login">登录审计</Option>
              <Option value="permission">权限审计</Option>
              <Option value="data">数据审计</Option>
              <Option value="operation">操作审计</Option>
            </Select>
            <Select placeholder="审计结果" style={{ width: 150 }} allowClear>
              <Option value="pass">通过</Option>
              <Option value="fail">不通过</Option>
            </Select>
            <RangePicker showTime />
            <Button type="primary">搜索</Button>
            <Button icon={<ReloadOutlined />}>重置</Button>
          </Space>
        </div>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  )
}

export default AuditLog

