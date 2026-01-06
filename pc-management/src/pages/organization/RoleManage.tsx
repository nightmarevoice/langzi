import React from 'react'
import { Card, Table, Button, Space, Input } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'

const RoleManage: React.FC = () => {
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '权限数量',
      dataIndex: 'permissionCount',
      key: 'permissionCount',
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
          <Button type="link">权限配置</Button>
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
              placeholder="搜索角色名称"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Button type="primary">搜索</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />}>
            新增角色
          </Button>
        </div>
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>
    </div>
  )
}

export default RoleManage

