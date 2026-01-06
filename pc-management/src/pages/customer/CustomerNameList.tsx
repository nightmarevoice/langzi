import React from 'react'
import { Card, Table, Button, Space, Input } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'

const CustomerNameList: React.FC = () => {
  const columns = [
    {
      title: '名单名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '客户数量',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link">查看</Button>
          <Button type="link">编辑</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      ),
    },
  ]

  const data: any[] = []

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder="搜索名单名称"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Button type="primary">搜索</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />}>
            新建名单
          </Button>
        </div>
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>
    </div>
  )
}

export default CustomerNameList

