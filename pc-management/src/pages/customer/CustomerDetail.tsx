import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag,
  Row,
  Col,
  Statistic
} from 'antd'
import { 
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  SkinOutlined,
  TagOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useParams } from 'react-router-dom'

interface CustomerInfo {
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
  registerTime: string
  avatar?: string
}

interface ServiceTask {
  id: string
  type: string
  title: string
  status: string
  priority: string
  assignee: string
  createTime: string
  dueTime: string
  description: string
}

interface HistoryService {
  id: string
  type: string
  title: string
  serviceTime: string
  operator: string
  result: string
  notes: string
}

interface TestInfo {
  id: string
  testTime: string
  skinScore: number
  moisture: number
  oil: number
  elasticity: number
  problemTags: string[]
  recommendations: string[]
}

interface Report {
  id: string
  reportTime: string
  reportType: string
  title: string
  summary: string
  downloadUrl?: string
}

interface Product {
  id: string
  name: string
  image: string
  price: number
  quantity: number
  orderTime: string
  orderStatus: string
  totalAmount: number
}

// 模拟数据
const mockCustomerInfo: CustomerInfo = {
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
  registerTime: '2024-10-15 10:20:00'
}

const mockServiceTasks: ServiceTask[] = [
  {
    id: '1',
    type: '回访',
    title: '痤疮治疗回访',
    status: '进行中',
    priority: '高',
    assignee: '李医生',
    createTime: '2025-01-15 09:00:00',
    dueTime: '2025-01-20 18:00:00',
    description: '跟进客户使用祛痘产品的效果，了解皮肤改善情况'
  },
  {
    id: '2',
    type: '咨询',
    title: '色斑问题咨询',
    status: '待处理',
    priority: '中',
    assignee: '王顾问',
    createTime: '2025-01-14 14:30:00',
    dueTime: '2025-01-18 18:00:00',
    description: '客户咨询淡斑产品的使用方法和注意事项'
  }
]

const mockHistoryServices: HistoryService[] = [
  {
    id: '1',
    type: '回访',
    title: '抗衰产品使用回访',
    serviceTime: '2025-01-10 15:30:00',
    operator: '李医生',
    result: '已完成',
    notes: '客户反馈产品使用效果良好，皮肤紧致度有所提升'
  },
  {
    id: '2',
    type: '咨询',
    title: '敏感肌护理咨询',
    serviceTime: '2025-01-08 10:20:00',
    operator: '王顾问',
    result: '已完成',
    notes: '为客户推荐了适合敏感肌的温和护理产品'
  },
  {
    id: '3',
    type: '回访',
    title: '测肤报告解读',
    serviceTime: '2025-01-05 16:00:00',
    operator: '张顾问',
    result: '已完成',
    notes: '详细解读了测肤报告，提供了个性化护肤建议'
  }
]

const mockCurrentTestInfo: TestInfo = {
  id: '1',
  testTime: '2025-01-15 14:30:00',
  skinScore: 85,
  moisture: 78,
  oil: 65,
  elasticity: 72,
  problemTags: ['轻度痤疮', '色斑', '敏感'],
  recommendations: [
    '使用温和洁面产品，避免过度清洁',
    '加强保湿，使用适合敏感肌的保湿产品',
    '注意防晒，使用SPF30+的防晒霜',
    '定期使用淡斑精华，注意成分温和性'
  ]
}

const mockHistoryTests: TestInfo[] = [
  {
    id: '1',
    testTime: '2025-01-15 14:30:00',
    skinScore: 85,
    moisture: 78,
    oil: 65,
    elasticity: 72,
    problemTags: ['轻度痤疮', '色斑', '敏感'],
    recommendations: []
  },
  {
    id: '2',
    testTime: '2025-01-10 10:20:00',
    skinScore: 82,
    moisture: 75,
    oil: 68,
    elasticity: 70,
    problemTags: ['轻度痤疮', '色斑'],
    recommendations: []
  },
  {
    id: '3',
    testTime: '2025-01-05 15:45:00',
    skinScore: 80,
    moisture: 72,
    oil: 70,
    elasticity: 68,
    problemTags: ['中度痤疮', '色斑', '敏感'],
    recommendations: []
  },
  {
    id: '4',
    testTime: '2024-12-28 11:30:00',
    skinScore: 78,
    moisture: 70,
    oil: 72,
    elasticity: 65,
    problemTags: ['中度痤疮', '色斑'],
    recommendations: []
  },
  {
    id: '5',
    testTime: '2024-12-20 14:00:00',
    skinScore: 75,
    moisture: 68,
    oil: 75,
    elasticity: 63,
    problemTags: ['中度痤疮', '色斑', '敏感'],
    recommendations: []
  }
]

const mockReports: Report[] = [
  {
    id: '1',
    reportTime: '2025-01-15 14:30:00',
    reportType: '测肤报告',
    title: 'AI测肤分析报告 - 2025-01-15',
    summary: '皮肤综合评分85分，主要问题：轻度痤疮、色斑、敏感。建议加强保湿和防晒。'
  },
  {
    id: '2',
    reportTime: '2025-01-10 10:20:00',
    reportType: '测肤报告',
    title: 'AI测肤分析报告 - 2025-01-10',
    summary: '皮肤综合评分82分，主要问题：轻度痤疮、色斑。皮肤状态有所改善。'
  },
  {
    id: '3',
    reportTime: '2025-01-05 15:45:00',
    reportType: '测肤报告',
    title: 'AI测肤分析报告 - 2025-01-05',
    summary: '皮肤综合评分80分，主要问题：中度痤疮、色斑、敏感。需要加强护理。'
  }
]

const mockProducts: Product[] = [
  {
    id: '1',
    name: '温和洁面乳',
    image: 'https://via.placeholder.com/80',
    price: 128,
    quantity: 2,
    orderTime: '2025-01-12 16:30:00',
    orderStatus: '已完成',
    totalAmount: 256
  },
  {
    id: '2',
    name: '淡斑精华液',
    image: 'https://via.placeholder.com/80',
    price: 298,
    quantity: 1,
    orderTime: '2025-01-08 10:20:00',
    orderStatus: '已完成',
    totalAmount: 298
  },
  {
    id: '3',
    name: '敏感肌专用保湿霜',
    image: 'https://via.placeholder.com/80',
    price: 198,
    quantity: 1,
    orderTime: '2024-12-25 14:15:00',
    orderStatus: '已完成',
    totalAmount: 198
  },
  {
    id: '4',
    name: 'SPF30+防晒霜',
    image: 'https://via.placeholder.com/80',
    price: 158,
    quantity: 2,
    orderTime: '2024-12-15 11:00:00',
    orderStatus: '已完成',
    totalAmount: 316
  }
]

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [customerInfo] = useState<CustomerInfo>(mockCustomerInfo)
  const [serviceTasks] = useState<ServiceTask[]>(mockServiceTasks)
  const [historyServices] = useState<HistoryService[]>(mockHistoryServices)
  const [currentTestInfo] = useState<TestInfo>(mockCurrentTestInfo)
  const [historyTests] = useState<TestInfo[]>(mockHistoryTests)
  const [reports] = useState<Report[]>(mockReports)
  const [products] = useState<Product[]>(mockProducts)

  useEffect(() => {
    // 根据 id 加载客户数据
    // 这里可以调用 API 获取数据
  }, [id])

  // 右侧紧凑表格列定义
  const serviceTaskCompactColumns: ColumnsType<ServiceTask> = [
    {
      title: '任务',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text: string, record: ServiceTask) => (
        <div>
          <Tag color="blue" style={{ marginRight: 4 }}>{record.type}</Tag>
          <span>{text}</span>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          '进行中': 'processing',
          '待处理': 'warning',
          '已完成': 'success',
          '已取消': 'default'
        }
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>
      }
    }
  ]

  // 右侧紧凑表格列定义
  const historyServiceCompactColumns: ColumnsType<HistoryService> = [
    {
      title: '服务',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text: string, record: HistoryService) => (
        <div>
          <Tag color="blue" style={{ marginRight: 4 }}>{record.type}</Tag>
          <span>{text}</span>
        </div>
      )
    },
    {
      title: '时间',
      dataIndex: 'serviceTime',
      key: 'serviceTime',
      width: 100,
      render: (time: string) => time.split(' ')[0]
    }
  ]

  const testColumns: ColumnsType<TestInfo> = [
    {
      title: '测肤时间',
      dataIndex: 'testTime',
      key: 'testTime',
      width: 180,
    },
    {
      title: '综合评分',
      dataIndex: 'skinScore',
      key: 'skinScore',
      width: 100,
      render: (score: number) => (
        <Tag color={score >= 80 ? 'success' : score >= 70 ? 'warning' : 'error'}>
          {score}分
        </Tag>
      )
    },
    {
      title: '水分',
      dataIndex: 'moisture',
      key: 'moisture',
      width: 80,
      render: (value: number) => `${value}%`
    },
    {
      title: '油分',
      dataIndex: 'oil',
      key: 'oil',
      width: 80,
      render: (value: number) => `${value}%`
    },
    {
      title: '弹性',
      dataIndex: 'elasticity',
      key: 'elasticity',
      width: 80,
      render: (value: number) => `${value}%`
    },
    {
      title: '问题标签',
      dataIndex: 'problemTags',
      key: 'problemTags',
      render: (tags: string[]) => (
        <Space size={[0, 8]} wrap>
          {tags.map(tag => (
            <Tag key={tag} color="orange">{tag}</Tag>
          ))}
        </Space>
      )
    }
  ]

  const reportColumns: ColumnsType<Report> = [
    {
      title: '报告时间',
      dataIndex: 'reportTime',
      key: 'reportTime',
      width: 180,
    },
    {
      title: '报告类型',
      dataIndex: 'reportType',
      key: 'reportType',
      width: 120,
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    {
      title: '报告标题',
      dataIndex: 'title',
      key: 'title',
      width: 250,
    },
    {
      title: '摘要',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button type="link" onClick={() => {
          // 查看报告详情
          window.open(`/customer/report/detail/${record.id}`, '_blank')
        }}>
          查看详情
        </Button>
      )
    }
  ]

  const productColumns: ColumnsType<Product> = [
    {
      title: '商品图片',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image: string) => (
        <img src={image} alt="商品" style={{ width: 80, height: 80, objectFit: 'cover' }} />
      )
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => `¥${price}`
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 100,
      render: (amount: number) => `¥${amount}`
    },
    {
      title: '下单时间',
      dataIndex: 'orderTime',
      key: 'orderTime',
      width: 180,
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 100,
      render: (status: string) => <Tag color="success">{status}</Tag>
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card title={<span><UserOutlined /> 客户信息与服务记录</span>} style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={16}>
            <div style={{ paddingRight: 16 }}>
              <div style={{ marginBottom: 20, fontSize: 18, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <UserOutlined style={{ marginRight: 8, fontSize: 20 }} />
                {customerInfo.name}
                <span style={{ marginLeft: 12, fontSize: 14, fontWeight: 'normal', color: '#999' }}>
                  ({customerInfo.nickname})
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <PhoneOutlined style={{ fontSize: 16, color: '#1890ff', marginRight: 8 }} />
                  <span style={{ marginRight: 8 }}>手机号：</span>
                  <span>{customerInfo.phone}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <IdcardOutlined style={{ fontSize: 16, color: '#1890ff', marginRight: 8 }} />
                  <span style={{ marginRight: 8 }}>客户来源：</span>
                  <Tag color={customerInfo.source === '小程序' ? 'blue' : 'green'}>
                    {customerInfo.source}
                  </Tag>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <UserOutlined style={{ fontSize: 16, color: '#1890ff', marginRight: 8 }} />
                  <span style={{ marginRight: 8 }}>年龄：</span>
                  <span>{customerInfo.age}岁</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  {customerInfo.gender === '女' ? (
                    <WomanOutlined style={{ fontSize: 16, color: '#ff4d4f', marginRight: 8 }} />
                  ) : (
                    <ManOutlined style={{ fontSize: 16, color: '#1890ff', marginRight: 8 }} />
                  )}
                  <span style={{ marginRight: 8 }}>性别：</span>
                  <span>{customerInfo.gender}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <UserOutlined style={{ fontSize: 16, color: '#1890ff', marginRight: 8 }} />
                  <span style={{ marginRight: 8 }}>体重：</span>
                  <span>{customerInfo.weight}kg</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <UserOutlined style={{ fontSize: 16, color: '#1890ff', marginRight: 8 }} />
                  <span style={{ marginRight: 8 }}>身高：</span>
                  <span>{customerInfo.height}cm</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <SkinOutlined style={{ fontSize: 16, color: '#1890ff', marginRight: 8 }} />
                  <span style={{ marginRight: 8 }}>皮肤类型：</span>
                  <span>{customerInfo.skinType}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <CalendarOutlined style={{ fontSize: 16, color: '#1890ff', marginRight: 8 }} />
                  <span style={{ marginRight: 8 }}>注册时间：</span>
                  <span>{customerInfo.registerTime}</span>
                </div>
              </div>
              
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-start' }}>
                <TagOutlined style={{ fontSize: 16, color: '#1890ff', marginRight: 8, marginTop: 4 }} />
                <div>
                  <div style={{ marginBottom: 8 }}>问题标签：</div>
                  <Space size={[0, 8]} wrap>
                    {customerInfo.problemTags.map(tag => (
                      <Tag key={tag} color="orange">{tag}</Tag>
                    ))}
                  </Space>
                </div>
              </div>
            </div>
          </Col>
          
          <Col span={8}>
            <div style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <ExperimentOutlined style={{ marginRight: 6 }} />
                  现阶段服务任务
                </div>
                <Table 
                  columns={serviceTaskCompactColumns} 
                  dataSource={serviceTasks} 
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                  size="small"
                />
              </div>
              
              <div>
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <FileTextOutlined style={{ marginRight: 6 }} />
                  历史服务记录
                </div>
                <Table 
                  columns={historyServiceCompactColumns} 
                  dataSource={historyServices} 
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                  size="small"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card title={<span><ExperimentOutlined /> 当前测肤信息</span>} style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic 
              title="综合评分" 
              value={currentTestInfo.skinScore} 
              suffix="分"
              valueStyle={{ color: currentTestInfo.skinScore >= 80 ? '#3f8600' : '#cf1322' }}
            />
          </Col>
          <Col span={6}>
            <Statistic title="水分" value={currentTestInfo.moisture} suffix="%" />
          </Col>
          <Col span={6}>
            <Statistic title="油分" value={currentTestInfo.oil} suffix="%" />
          </Col>
          <Col span={6}>
            <Statistic title="弹性" value={currentTestInfo.elasticity} suffix="%" />
          </Col>
        </Row>
        <div style={{ marginBottom: 16 }}>
          <strong>测肤时间：</strong>{currentTestInfo.testTime}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>问题标签：</strong>
          <Space size={[0, 8]} wrap style={{ marginLeft: 8 }}>
            {currentTestInfo.problemTags.map(tag => (
              <Tag key={tag} color="orange">{tag}</Tag>
            ))}
          </Space>
        </div>
        <div>
          <strong>护理建议：</strong>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            {currentTestInfo.recommendations.map((rec, index) => (
              <li key={index} style={{ marginBottom: 8 }}>{rec}</li>
            ))}
          </ul>
        </div>
      </Card>

      <Card title={<span><ExperimentOutlined /> 历史测肤记录</span>} style={{ marginBottom: 16 }}>
        <Table 
          columns={testColumns} 
          dataSource={historyTests} 
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Card title={<span><FileTextOutlined /> 历史报告</span>} style={{ marginBottom: 16 }}>
        <Table 
          columns={reportColumns} 
          dataSource={reports} 
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Card title={<span><ShoppingOutlined /> 购买商品记录</span>}>
        <Table 
          columns={productColumns} 
          dataSource={products} 
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 'max-content' }}
        />
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <strong>累计消费金额：</strong>
          <span style={{ fontSize: 20, color: '#ff4d4f', marginLeft: 8 }}>
            ¥{products.reduce((sum, p) => sum + p.totalAmount, 0)}
          </span>
        </div>
      </Card>
    </div>
  )
}

export default CustomerDetail

