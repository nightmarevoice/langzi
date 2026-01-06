import React from 'react'
import { Card, Table, Button, Space, Input, DatePicker, Select } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker
const { Option } = Select

const SystemLog: React.FC = () => {
  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 120,
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '操作模块',
      dataIndex: 'module',
      key: 'module',
      width: 150,
    },
    {
      title: '操作内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <span style={{ color: status === '成功' ? '#52c41a' : '#ff4d4f' }}>
          {status}
        </span>
      ),
    },
  ]

  const data: any[] = []

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索操作内容"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
            <Select placeholder="操作类型" style={{ width: 150 }} allowClear>
              <Option value="create">新增</Option>
              <Option value="update">修改</Option>
              <Option value="delete">删除</Option>
              <Option value="query">查询</Option>
            </Select>
            <Select placeholder="操作模块" style={{ width: 150 }} allowClear>
              <Option value="user">用户管理</Option>
              <Option value="role">角色管理</Option>
              <Option value="customer">客户管理</Option>
              <Option value="product">商品管理</Option>
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

export default SystemLog

