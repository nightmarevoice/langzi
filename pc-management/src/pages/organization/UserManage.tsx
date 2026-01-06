import React from 'react'
import { Card, Table, Button, Space, Input } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'

const UserManage: React.FC = () => {
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === '启用' ? '#52c41a' : '#ff4d4f' }}>
          {status}
        </span>
      ),
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
              placeholder="搜索用户名或姓名"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Button type="primary">搜索</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />}>
            新增用户
          </Button>
        </div>
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>
    </div>
  )
}

export default UserManage

