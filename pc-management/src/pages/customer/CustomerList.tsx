import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Input, 
  Select,
  Tag,
  message,
  Row,
  Col,
  Tooltip
} from 'antd'
import { 
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

const { Option } = Select

interface Customer {
  id: string
  name: string
  nickname: string
  phone: string
  source: string
  age: number
  weight: number
  height: number
  gender: string
  skinType: string
  problemTags: string[]
  lastTestTime: string
  testCount: number
  registerTime: string
}

// 模拟数据
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: '张美丽',
    nickname: '小美',
    phone: '138****8888',
    source: '小程序',
    age: 28,
    weight: 55,
    height: 165,
    gender: '女',
    skinType: '混合性',
    problemTags: ['痤疮', '色斑', '敏感'],
    lastTestTime: '2025-01-15 14:30:00',
    testCount: 5,
    registerTime: '2024-10-15 10:20:00'
  },
  {
    id: '2',
    name: '李优雅',
    nickname: '优雅',
    phone: '139****9999',
    source: '门店',
    age: 32,
    weight: 58,
    height: 168,
    gender: '女',
    skinType: '干性',
    problemTags: ['抗衰', '细纹'],
    lastTestTime: '2025-01-14 16:20:00',
    testCount: 3,
    registerTime: '2024-09-20 11:15:00'
  },
  {
    id: '3',
    name: '王青春',
    nickname: '青春',
    phone: '137****7777',
    source: '小程序',
    age: 25,
    weight: 52,
    height: 162,
    gender: '女',
    skinType: '油性',
    problemTags: ['痤疮', '清洁'],
    lastTestTime: '2025-01-13 09:45:00',
    testCount: 8,
    registerTime: '2024-08-10 14:30:00'
  },
  {
    id: '4',
    name: '刘敏敏',
    nickname: '敏敏',
    phone: '136****6666',
    source: '小程序',
    age: 30,
    weight: 56,
    height: 166,
    gender: '女',
    skinType: '敏感肌',
    problemTags: ['敏感', '红血丝', '泛红'],
    lastTestTime: '2025-01-12 15:10:00',
    testCount: 4,
    registerTime: '2024-11-05 09:00:00'
  },
  {
    id: '5',
    name: '陈美白',
    nickname: '美白',
    phone: '135****5555',
    source: '门店',
    age: 35,
    weight: 60,
    height: 170,
    gender: '女',
    skinType: '中性',
    problemTags: ['色斑', '美白'],
    lastTestTime: '2025-01-11 10:30:00',
    testCount: 6,
    registerTime: '2024-07-15 16:20:00'
  },
  {
    id: '6',
    name: '赵抗衰',
    nickname: '抗衰',
    phone: '134****4444',
    source: '小程序',
    age: 40,
    weight: 62,
    height: 168,
    gender: '女',
    skinType: '干性',
    problemTags: ['抗衰', '皱纹', '松弛'],
    lastTestTime: '2025-01-10 11:20:00',
    testCount: 10,
    registerTime: '2024-06-01 13:45:00'
  },
  {
    id: '7',
    name: '孙清洁',
    nickname: '清洁',
    phone: '133****3333',
    source: '小程序',
    age: 22,
    weight: 50,
    height: 160,
    gender: '女',
    skinType: '油性',
    problemTags: ['痤疮', '清洁', '去角质'],
    lastTestTime: '2025-01-09 14:00:00',
    testCount: 2,
    registerTime: '2024-12-20 10:10:00'
  },
  {
    id: '8',
    name: '周防晒',
    nickname: '防晒',
    phone: '132****2222',
    source: '门店',
    age: 27,
    weight: 54,
    height: 164,
    gender: '女',
    skinType: '混合性',
    problemTags: ['色斑', '防晒'],
    lastTestTime: '2025-01-08 16:45:00',
    testCount: 7,
    registerTime: '2024-05-10 15:30:00'
  }
]

const CustomerList: React.FC = () => {
  const navigate = useNavigate()
  const [filteredData, setFilteredData] = useState<Customer[]>(mockCustomers)
  const [searchText, setSearchText] = useState('')
  const [selectedProblemTag, setSelectedProblemTag] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // 问题标签选项
  const problemTagOptions = [
    '痤疮', '色斑', '抗衰', '敏感', '清洁', '防晒', 
    '美白', '细纹', '皱纹', '红血丝', '泛红', '去角质'
  ]

  // 过滤数据
  useEffect(() => {
    let filtered = [...mockCustomers]
    
    // 搜索过滤（手机号或昵称）
    if (searchText) {
      filtered = filtered.filter(item => 
        item.phone.includes(searchText) ||
        item.nickname.includes(searchText) ||
        item.name.includes(searchText)
      )
    }
    
    // 问题标签过滤
    if (selectedProblemTag) {
      filtered = filtered.filter(item => 
        item.problemTags.includes(selectedProblemTag)
      )
    }
    
    setFilteredData(filtered)
  }, [searchText, selectedProblemTag])

  const handleSearch = () => {
    // 搜索逻辑已在 useEffect 中处理
  }

  const handleViewDetail = (record: Customer) => {
    navigate(`/customer/detail/${record.id}`)
  }

  const handleExport = () => {
    setLoading(true)
    // 模拟导出
    setTimeout(() => {
      const csvContent = [
        ['客户姓名', '昵称', '手机号', '来源', '年龄', '体重(kg)', '身高(cm)', '性别', '皮肤类型', '问题标签', '最近测肤时间', '测肤次数', '注册时间'],
        ...filteredData.map(customer => [
          customer.name,
          customer.nickname,
          customer.phone,
          customer.source,
          customer.age.toString(),
          customer.weight.toString(),
          customer.height.toString(),
          customer.gender,
          customer.skinType,
          customer.problemTags.join('、'),
          customer.lastTestTime,
          customer.testCount.toString(),
          customer.registerTime
        ])
      ].map(row => row.join(',')).join('\n')
      
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `客户列表_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setLoading(false)
      message.success('导出成功')
    }, 500)
  }

  const columns: ColumnsType<Customer> = [
    {
      title: '客户姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: 'left',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: '客户来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source: string) => (
        <Tag color={source === '小程序' ? 'blue' : 'green'}>{source}</Tag>
      ),
    },
    {
      title: '基础信息',
      key: 'basicInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <div>年龄: {record.age}岁 | 体重: {record.weight}kg | 身高: {record.height}cm</div>
          <div>性别: {record.gender} | 皮肤类型: {record.skinType}</div>
        </div>
      ),
    },
    {
      title: '测肤信息',
      key: 'testInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <div>最近测肤: {record.lastTestTime}</div>
          <div>测肤次数: {record.testCount}次</div>
        </div>
      ),
    },
    {
      title: '问题标签',
      dataIndex: 'problemTags',
      key: 'problemTags',
      width: 200,
      render: (tags: string[]) => (
        <Space size={[0, 8]} wrap>
          {tags.map(tag => (
            <Tag key={tag} color="orange">{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record)}
            >
              查看
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Input
                placeholder="搜索客户手机号/昵称"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="选择主要问题标签"
                style={{ width: '100%' }}
                value={selectedProblemTag}
                onChange={setSelectedProblemTag}
                allowClear
              >
                {problemTagOptions.map(tag => (
                  <Option key={tag} value={tag}>{tag}</Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <Button 
                type="default" 
                icon={<DownloadOutlined />} 
                onClick={handleExport}
                loading={loading}
              >
                导出数据
              </Button>
            </Col>
          </Row>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  )
}

export default CustomerList
