import React from 'react'
import { Card, Table, DatePicker, Button, Space } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker

const CustomerServiceReport: React.FC = () => {
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '咨询量',
      dataIndex: 'consultCount',
      key: 'consultCount',
    },
    {
      title: '解决量',
      dataIndex: 'solveCount',
      key: 'solveCount',
    },
    {
      title: '解决率',
      dataIndex: 'solveRate',
      key: 'solveRate',
    },
    {
      title: '平均响应时间',
      dataIndex: 'avgResponseTime',
      key: 'avgResponseTime',
    },
  ]

  const data: any[] = []

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <RangePicker />
            <Button type="primary">查询</Button>
          </Space>
          <Button type="primary" icon={<DownloadOutlined />}>
            导出报表
          </Button>
        </div>
        <Table columns={columns} dataSource={data} rowKey="date" />
      </Card>
    </div>
  )
}

export default CustomerServiceReport

