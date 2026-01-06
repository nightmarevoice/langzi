import React, { useState, useMemo } from 'react'
import { Card, Table, Button, Space, Input, Tag, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface OrderItem {
  id: string
  orderNo: string
  customerName: string
  productName: string
  amount: number
  status: '待支付' | '已支付' | '已发货' | '已完成' | '已取消'
  createTime: string
}

const OrderList: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Mock 数据
  const mockData: OrderItem[] = [
    {
      id: '1',
      orderNo: 'ORD20240101001',
      customerName: '张三',
      productName: '兰蔻小黑瓶精华',
      amount: 1280,
      status: '已支付',
      createTime: '2024-01-01 10:30:00'
    },
    {
      id: '2',
      orderNo: 'ORD20240101002',
      customerName: '李四',
      productName: '雅诗兰黛小棕瓶',
      amount: 980,
      status: '待支付',
      createTime: '2024-01-01 11:15:00'
    },
    {
      id: '3',
      orderNo: 'ORD20240101003',
      customerName: '王五',
      productName: 'SK-II神仙水',
      amount: 1580,
      status: '已发货',
      createTime: '2024-01-01 14:20:00'
    },
    {
      id: '4',
      orderNo: 'ORD20240101004',
      customerName: '赵六',
      productName: '资生堂红腰子精华',
      amount: 1180,
      status: '已完成',
      createTime: '2024-01-02 09:45:00'
    },
    {
      id: '5',
      orderNo: 'ORD20240101005',
      customerName: '孙七',
      productName: '海蓝之谜面霜',
      amount: 2680,
      status: '已支付',
      createTime: '2024-01-02 15:30:00'
    },
    {
      id: '6',
      orderNo: 'ORD20240101006',
      customerName: '周八',
      productName: '娇兰复原蜜',
      amount: 1380,
      status: '已取消',
      createTime: '2024-01-03 08:20:00'
    },
    {
      id: '7',
      orderNo: 'ORD20240101007',
      customerName: '吴九',
      productName: 'CPB光采精华',
      amount: 1880,
      status: '待支付',
      createTime: '2024-01-03 16:10:00'
    },
    {
      id: '8',
      orderNo: 'ORD20240101008',
      customerName: '郑十',
      productName: '赫莲娜黑绷带面霜',
      amount: 3280,
      status: '已发货',
      createTime: '2024-01-04 10:00:00'
    },
    {
      id: '9',
      orderNo: 'ORD20240101009',
      customerName: '钱一',
      productName: '黛珂紫苏水',
      amount: 680,
      status: '已完成',
      createTime: '2024-01-04 13:25:00'
    },
    {
      id: '10',
      orderNo: 'ORD20240101010',
      customerName: '陈二',
      productName: '雪花秀润燥精华',
      amount: 880,
      status: '已支付',
      createTime: '2024-01-05 09:15:00'
    },
    {
      id: '11',
      orderNo: 'ORD20240101011',
      customerName: '林三',
      productName: '悦木之源菌菇水',
      amount: 320,
      status: '待支付',
      createTime: '2024-01-05 14:40:00'
    },
    {
      id: '12',
      orderNo: 'ORD20240101012',
      customerName: '黄四',
      productName: '科颜氏金盏花水',
      amount: 420,
      status: '已发货',
      createTime: '2024-01-06 11:20:00'
    }
  ]

  const columns: ColumnsType<OrderItem> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
    },
    {
      title: '客户姓名',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 120,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
    },
    {
      title: '订单金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          '待支付': 'orange',
          '已支付': 'green',
          '已发货': 'blue',
          '已完成': 'green',
          '已取消': 'red'
        }
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>
      },
      filters: [
        { text: '待支付', value: '待支付' },
        { text: '已支付', value: '已支付' },
        { text: '已发货', value: '已发货' },
        { text: '已完成', value: '已完成' },
        { text: '已取消', value: '已取消' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleView(record)}>查看</Button>
          {record.status === '待支付' && (
            <Button type="link" onClick={() => handleProcess(record)}>处理</Button>
          )}
        </Space>
      ),
    },
  ]

  // 筛选和搜索
  const filteredData = useMemo(() => {
    let result = mockData

    // 状态筛选
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter)
    }

    // 搜索筛选
    if (searchText) {
      result = result.filter(item => 
        item.orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerName.includes(searchText)
      )
    }

    return result
  }, [searchText, statusFilter])

  const handleView = (record: OrderItem) => {
    console.log('查看订单:', record)
    // TODO: 跳转到订单详情页
  }

  const handleProcess = (record: OrderItem) => {
    console.log('处理订单:', record)
    // TODO: 处理订单逻辑
  }

  const handleSearch = () => {
    // 搜索逻辑已在 useMemo 中处理
  }

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
          <Select
              style={{ width: 150 }}
              placeholder="订单状态"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
            >
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="待支付">待支付</Select.Option>
              <Select.Option value="已支付">已支付</Select.Option>
              <Select.Option value="已发货">已发货</Select.Option>
              <Select.Option value="已完成">已完成</Select.Option>
              <Select.Option value="已取消">已取消</Select.Option>
            </Select>
            <Input
              placeholder="搜索订单号或客户姓名"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Button type="primary" onClick={handleSearch}>搜索</Button>
           
          </Space>
        </div>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条订单`,
          }}
        />
      </Card>
    </div>
  )
}

export default OrderList

