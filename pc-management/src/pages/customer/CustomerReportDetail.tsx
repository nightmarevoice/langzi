import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Button, 
  Space, 
  Row, 
  Col, 
  Descriptions, 
  Tag, 
  Input, 
  Select, 
  Table,
  Modal,
  message,
  Image,
  Divider,
  Rate,
  Tooltip
} from 'antd'
import { 
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'

const { TextArea } = Input
const { Option } = Select

interface ProblemResult {
  id: string
  problem: string
  score: number
  confidence: number
  level: '轻微' | '中等' | '严重'
  description: string
}

interface SkincareAdvice {
  id: string
  content: string
  type: 'routine' | 'product' | 'lifestyle'
}

interface ReportDetail {
  reportId: string
  userId: string
  userName: string
  phone: string
  testTime: string
  imageUrl: string
  problems: ProblemResult[]
  llmDescription: string
  skincareAdvices: SkincareAdvice[]
  doctorNotes: string
  status: 'pending' | 'approved' | 'review' | 'blocked'
}

const CustomerReportDetail: React.FC = () => {
  const navigate = useNavigate()
  const { reportId } = useParams<{ reportId: string }>()
  const location = useLocation()
  const [reportData, setReportData] = useState<ReportDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [editingProblem, setEditingProblem] = useState<string | null>(null)
  const [newAdvice, setNewAdvice] = useState('')
  const [adviceType, setAdviceType] = useState<'routine' | 'product' | 'lifestyle'>('routine')
  const [doctorNote, setDoctorNote] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)

  // 模拟数据
  const mockReportData: ReportDetail = {
    reportId: reportId || 'report001',
    userId: location.state?.userId || 'user001',
    userName: location.state?.userName || '张美丽',
    phone: '138****8888',
    testTime: '2024-01-15 14:30:00',
    imageUrl: 'https://via.placeholder.com/400x600?text=Skin+Test+Image',
    problems: [
      {
        id: 'p1',
        problem: '痘痘',
        score: 75,
        confidence: 0.92,
        level: '中等',
        description: '检测到面部有多个炎性痘痘，主要集中在T区和下巴区域'
      },
      {
        id: 'p2',
        problem: '黑头',
        score: 68,
        confidence: 0.88,
        level: '轻微',
        description: '鼻翼两侧存在少量黑头，毛孔轻微堵塞'
      },
      {
        id: 'p3',
        problem: '毛孔粗大',
        score: 82,
        confidence: 0.95,
        level: '严重',
        description: 'T区毛孔明显粗大，需要深层清洁和收缩护理'
      }
    ],
    llmDescription: '根据AI分析，您的皮肤主要存在痘痘、黑头和毛孔粗大等问题。建议采用温和的清洁产品，避免过度清洁导致皮肤屏障受损。同时注意控油和保湿的平衡，选择含有水杨酸或果酸成分的产品有助于改善毛孔问题。',
    skincareAdvices: [
      {
        id: 'a1',
        content: '每日早晚使用温和洁面产品，避免使用含皂基的强清洁产品',
        type: 'routine'
      },
      {
        id: 'a2',
        content: '建议使用含有水杨酸（BHA）的爽肤水，每周2-3次',
        type: 'product'
      },
      {
        id: 'a3',
        content: '保持充足睡眠，减少熬夜，有助于改善痘痘问题',
        type: 'lifestyle'
      }
    ],
    doctorNotes: '',
    status: 'pending'
  }

  useEffect(() => {
    // 模拟加载数据
    setLoading(true)
    setTimeout(() => {
      setReportData(mockReportData)
      setDoctorNote(mockReportData.doctorNotes)
      setLoading(false)
    }, 500)
  }, [reportId])

  const handleBack = () => {
    navigate('/customer/report')
  }

  const handleLevelChange = (problemId: string, level: '轻微' | '中等' | '严重') => {
    if (!reportData) return
    const updatedProblems = reportData.problems.map(p => 
      p.id === problemId ? { ...p, level } : p
    )
    setReportData({ ...reportData, problems: updatedProblems })
    message.success('问题等级已更新')
  }

  const handleAddAdvice = () => {
    if (!newAdvice.trim()) {
      message.warning('请输入建议内容')
      return
    }
    if (!reportData) return
    
    const newAdviceItem: SkincareAdvice = {
      id: `a${Date.now()}`,
      content: newAdvice,
      type: adviceType
    }
    
    setReportData({
      ...reportData,
      skincareAdvices: [...reportData.skincareAdvices, newAdviceItem]
    })
    setNewAdvice('')
    message.success('建议已添加')
  }

  const handleDeleteAdvice = (adviceId: string) => {
    if (!reportData) return
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条建议吗？',
      onOk: () => {
        setReportData({
          ...reportData,
          skincareAdvices: reportData.skincareAdvices.filter(a => a.id !== adviceId)
        })
        message.success('建议已删除')
      }
    })
  }

  const handleSaveDoctorNote = () => {
    if (!reportData) return
    setReportData({ ...reportData, doctorNotes: doctorNote })
    message.success('医生备注已保存')
  }

  const handleApprove = () => {
    if (!reportData) return
    Modal.confirm({
      title: '确认审核通过',
      content: '确定要审核通过这份报告吗？',
      onOk: () => {
        setReportData({ ...reportData, status: 'approved' })
        message.success('报告已审核通过')
      }
    })
  }

  const handleReview = () => {
    if (!reportData) return
    Modal.confirm({
      title: '标记需要复查',
      content: '确定要将此报告标记为需要医生复查吗？',
      onOk: () => {
        setReportData({ ...reportData, status: 'review' })
        message.success('已标记为需要复查')
      }
    })
  }

  const handleBlock = () => {
    if (!reportData) return
    Modal.confirm({
      title: '屏蔽报告',
      content: '确定要屏蔽此报告吗？屏蔽原因通常是图像质量差。',
      onOk: () => {
        setReportData({ ...reportData, status: 'blocked' })
        message.success('报告已屏蔽')
      }
    })
  }

  const problemColumns: ColumnsType<ProblemResult> = [
    {
      title: '问题',
      dataIndex: 'problem',
      key: 'problem',
      width: 120,
    },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      width: 100,
      render: (score: number) => (
        <span style={{ fontWeight: 'bold', color: score > 70 ? '#ff4d4f' : score > 50 ? '#faad14' : '#52c41a' }}>
          {score}
        </span>
      ),
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 120,
      render: (confidence: number) => `${(confidence * 100).toFixed(1)}%`,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 150,
      render: (level: string, record: ProblemResult) => (
        <Select
          value={level}
          style={{ width: 100 }}
          onChange={(value) => handleLevelChange(record.id, value)}
        >
          <Option value="轻微">轻微</Option>
          <Option value="中等">中等</Option>
          <Option value="严重">严重</Option>
        </Select>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <span>{text}</span>
        </Tooltip>
      ),
    },
  ]

  if (loading || !reportData) {
    return <div>加载中...</div>
  }

  return (
    <div>
      <Card>
       

        <Row gutter={24}>
          {/* 左侧：用户信息 + 原始图像 */}
          <Col span={6}>
            <Card title="用户信息" style={{ marginBottom: 16 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="用户名">{reportData.userName}</Descriptions.Item>
                <Descriptions.Item label="手机号">{reportData.phone}</Descriptions.Item>
                <Descriptions.Item label="测肤时间">{reportData.testTime}</Descriptions.Item>
                <Descriptions.Item label="报告状态">
                  <Tag color={
                    reportData.status === 'approved' ? 'green' :
                    reportData.status === 'review' ? 'orange' :
                    reportData.status === 'blocked' ? 'red' : 'default'
                  }>
                    {reportData.status === 'approved' ? '已审核' :
                     reportData.status === 'review' ? '需复查' :
                     reportData.status === 'blocked' ? '已屏蔽' : '待审核'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
            <Card title="原始图像">
              <Image
                src={reportData.imageUrl}
                alt="测肤图像"
                style={{ width: '100%', borderRadius: 8 }}
                preview
              />
            </Card>
          </Col>

          {/* 中间：AI 分析结果 */}
          <Col span={10}>
            <Card title="AI 分析结果" style={{ marginBottom: 16 }}>
              <Table
                columns={problemColumns}
                dataSource={reportData.problems}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: 'max-content' }}
              />
            </Card>

            <Card title="AI 生成描述" style={{ marginBottom: 16 }}>
              <p style={{ lineHeight: 1.8, color: '#666' }}>
                {reportData.llmDescription}
              </p>
            </Card>

            <Card title="护肤建议">
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {reportData.skincareAdvices.map(advice => (
                  <div key={advice.id} style={{ 
                    padding: '12px', 
                    background: '#f5f5f5', 
                    borderRadius: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <Tag color="blue" style={{ marginRight: 8 }}>
                        {advice.type === 'routine' ? '日常护理' :
                         advice.type === 'product' ? '产品推荐' : '生活方式'}
                      </Tag>
                      <span>{advice.content}</span>
                    </div>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => handleDeleteAdvice(advice.id)}
                    />
                  </div>
                ))}
              </Space>
            </Card>
          </Col>

          {/* 右侧：人工操作区 */}
          <Col span={8}>
            <Card title="人工操作区" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                  <h4>添加护肤建议</h4>
                  <Select
                    value={adviceType}
                    onChange={setAdviceType}
                    style={{ width: '100%', marginBottom: 8 }}
                  >
                    <Option value="routine">日常护理</Option>
                    <Option value="product">产品推荐</Option>
                    <Option value="lifestyle">生活方式</Option>
                  </Select>
                  <TextArea
                    rows={3}
                    placeholder="输入新的护肤建议"
                    value={newAdvice}
                    onChange={(e) => setNewAdvice(e.target.value)}
                    style={{ marginBottom: 8 }}
                  />
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleAddAdvice}
                    block
                  >
                    添加建议
                  </Button>
                </div>

                <Divider />

                <div>
                  <h4>医生备注</h4>
                  <TextArea
                    rows={6}
                    placeholder="添加医生备注信息..."
                    value={doctorNote}
                    onChange={(e) => setDoctorNote(e.target.value)}
                    style={{ marginBottom: 8 }}
                  />
                  <Button 
                    type="primary"
                    onClick={handleSaveDoctorNote}
                    block
                  >
                    保存备注
                  </Button>
                </div>
              </Space>
            </Card>

            <Card title="操作">
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleApprove}
                  block
                  size="large"
                >
                  审核通过
                </Button>
                <Button
                  icon={<ExclamationCircleOutlined />}
                  onClick={handleReview}
                  block
                  size="large"
                >
                  需要复查
                </Button>
                <Button
                  danger
                  icon={<StopOutlined />}
                  onClick={handleBlock}
                  block
                  size="large"
                >
                  屏蔽报告
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default CustomerReportDetail

