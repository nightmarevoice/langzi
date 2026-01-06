import React, { useState, useEffect, useMemo } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Select,
  Tag,
  message,
  Popconfirm,
  Divider,
  Row,
  Col,
  Badge,
  Tooltip,
  Alert,
  Tabs
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  CustomerServiceOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs

// 问答数据接口
interface QAData {
  id: string
  question: string // 客户问题
  answer: string // 服务人员回答
  category: string // 分类
  tags?: string[] // 标签
  source: 'customer' | 'service' // 来源：客户提问或服务人员主动回答
  customerName?: string // 客户名称（可选）
  serviceName?: string // 服务人员名称（可选）
  sessionId?: string // 会话ID
  quality?: 'excellent' | 'good' | 'normal' | 'poor' // 质量评级
  usageCount?: number // 使用次数
  createTime: string
  updateTime?: string
}

const QALibrary: React.FC = () => {
  const [qaData, setQaData] = useState<QAData[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [modalVisible, setModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editingQA, setEditingQA] = useState<QAData | null>(null)
  const [viewingQA, setViewingQA] = useState<QAData | null>(null)
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState<'all' | 'customer' | 'service'>('all')

  // Mock数据 - 客户和服务人员的问答数据
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockData: QAData[] = [
        // 皮肤问题咨询类
        {
          id: 'qa001',
          question: '我的皮肤最近总是长痘痘，怎么办？',
          answer: '您好，长痘痘的原因有很多，可能是内分泌失调、清洁不当或者使用了不适合的护肤品。建议您先进行皮肤检测，了解您的具体肤质和问题，然后我们可以为您推荐合适的治疗方案。平时注意保持面部清洁，避免用手挤压痘痘。',
          category: '皮肤问题',
          tags: ['痘痘', '皮肤护理', '治疗方案'],
          source: 'customer',
          customerName: '张女士',
          serviceName: '李医生',
          quality: 'excellent',
          usageCount: 45,
          createTime: '2025-01-15 10:30:00',
          updateTime: '2025-01-15 10:30:00'
        },
        {
          id: 'qa002',
          question: '我的皮肤很敏感，容易过敏，有什么推荐的护肤品吗？',
          answer: '敏感肌确实需要特别护理。建议您选择温和、无刺激的护肤品，避免含有酒精、香精等成分。我们推荐使用专为敏感肌设计的温和洁面产品和保湿霜。可以先进行皮肤检测，我们会根据您的检测结果为您推荐最适合的产品。',
          category: '皮肤问题',
          tags: ['敏感肌', '过敏', '护肤品推荐'],
          source: 'customer',
          customerName: '王女士',
          serviceName: '陈医生',
          quality: 'good',
          usageCount: 32,
          createTime: '2025-01-14 14:20:00',
          updateTime: '2025-01-14 14:20:00'
        },
        {
          id: 'qa003',
          question: '我脸上有很多斑点，能去掉吗？',
          answer: '斑点问题可以通过多种方式改善。首先需要了解您斑点的类型（雀斑、晒斑、黄褐斑等），不同类型的斑点治疗方案不同。建议您先进行专业的皮肤检测，我们会根据检测结果为您制定个性化的治疗方案，包括日常护理建议和可能的医美方案。',
          category: '皮肤问题',
          tags: ['斑点', '美白', '医美'],
          source: 'customer',
          customerName: '刘女士',
          serviceName: '李医生',
          quality: 'excellent',
          usageCount: 28,
          createTime: '2025-01-13 16:45:00',
          updateTime: '2025-01-13 16:45:00'
        },
        {
          id: 'qa004',
          question: '我的皮肤很干燥，用什么产品比较好？',
          answer: '干燥皮肤需要加强保湿。建议您使用温和的洁面产品，避免过度清洁，然后使用含有透明质酸、神经酰胺等保湿成分的精华和面霜。同时要注意多喝水，保持室内湿度。我们有多款针对干性皮肤的护理产品，您可以根据皮肤检测结果选择最适合的。',
          category: '皮肤问题',
          tags: ['干燥', '保湿', '护肤品'],
          source: 'customer',
          customerName: '赵女士',
          serviceName: '王医生',
          quality: 'good',
          usageCount: 38,
          createTime: '2025-01-12 11:15:00',
          updateTime: '2025-01-12 11:15:00'
        },
        // 产品咨询类
        {
          id: 'qa005',
          question: '你们的产品安全吗？有没有副作用？',
          answer: '我们的产品都经过严格的质量检测和安全认证，成分温和，适合大多数肤质使用。但每个人的肤质不同，建议您在使用新产品前先进行皮肤检测，并在耳后或手臂内侧做过敏测试。如果出现不适，请立即停用并咨询专业医生。',
          category: '产品咨询',
          tags: ['产品安全', '副作用', '过敏测试'],
          source: 'customer',
          customerName: '孙女士',
          serviceName: '陈医生',
          quality: 'excellent',
          usageCount: 52,
          createTime: '2025-01-11 09:30:00',
          updateTime: '2025-01-11 09:30:00'
        },
        {
          id: 'qa006',
          question: '这个产品适合什么年龄使用？',
          answer: '我们的产品主要针对18-50岁的用户，但具体选择还要看您的肤质和需求。不同年龄段皮肤状态不同，建议您先进行皮肤检测，我们会根据您的年龄、肤质和具体问题为您推荐最适合的产品。',
          category: '产品咨询',
          tags: ['年龄', '适用人群', '产品推荐'],
          source: 'customer',
          customerName: '周女士',
          serviceName: '李医生',
          quality: 'good',
          usageCount: 25,
          createTime: '2025-01-10 15:20:00',
          updateTime: '2025-01-10 15:20:00'
        },
        {
          id: 'qa007',
          question: '产品多久能看到效果？',
          answer: '护肤是一个循序渐进的过程，通常需要坚持使用2-4周才能看到明显效果。具体见效时间因人而异，取决于您的肤质、使用方法和产品类型。建议您按照正确的方法坚持使用，并定期进行皮肤检测来跟踪改善情况。',
          category: '产品咨询',
          tags: ['效果', '使用周期', '见效时间'],
          source: 'customer',
          customerName: '吴女士',
          serviceName: '王医生',
          quality: 'good',
          usageCount: 41,
          createTime: '2025-01-09 13:45:00',
          updateTime: '2025-01-09 13:45:00'
        },
        // 服务人员主动回答
        {
          id: 'qa008',
          question: '您好，欢迎咨询！',
          answer: '您好！我是您的专属皮肤顾问，很高兴为您服务。我可以帮您解答关于皮肤护理、产品使用、治疗方案等方面的问题。如果您还没有进行过皮肤检测，我建议您先进行一次专业的检测，这样我们可以更准确地了解您的肤质和需求，为您提供更精准的建议。',
          category: '服务引导',
          tags: ['欢迎', '服务介绍', '皮肤检测'],
          source: 'service',
          serviceName: '李医生',
          quality: 'excellent',
          usageCount: 156,
          createTime: '2025-01-08 10:00:00',
          updateTime: '2025-01-08 10:00:00'
        },
        {
          id: 'qa009',
          question: '您最近皮肤状态怎么样？',
          answer: '感谢您的关心！为了更好地为您服务，建议您定期进行皮肤检测，这样可以及时了解皮肤状态的变化。如果您的皮肤最近出现了新的问题，比如长痘、过敏、干燥等，请告诉我具体情况，我会为您提供专业的建议和解决方案。',
          category: '服务引导',
          tags: ['皮肤状态', '定期检测', '问题咨询'],
          source: 'service',
          serviceName: '陈医生',
          quality: 'good',
          usageCount: 89,
          createTime: '2025-01-07 14:30:00',
          updateTime: '2025-01-07 14:30:00'
        },
        // 使用指导类
        {
          id: 'qa010',
          question: '这个产品怎么使用？',
          answer: '使用前请先清洁面部，然后取适量产品均匀涂抹于面部，轻轻按摩至吸收。建议早晚各使用一次，使用后可以配合使用保湿霜。如果您的皮肤比较敏感，建议先在耳后测试，确认无不适后再使用。具体使用方法也可以参考产品说明书。',
          category: '使用指导',
          tags: ['使用方法', '使用步骤', '注意事项'],
          source: 'customer',
          customerName: '郑女士',
          serviceName: '王医生',
          quality: 'excellent',
          usageCount: 67,
          createTime: '2025-01-06 11:20:00',
          updateTime: '2025-01-06 11:20:00'
        },
        {
          id: 'qa011',
          question: '可以和其他产品一起使用吗？',
          answer: '可以，但需要注意使用顺序和成分搭配。建议按照洁面-精华-乳液-面霜的顺序使用，避免同时使用功能相似的产品。如果您的产品中含有酸类成分（如A酸、水杨酸等），建议与其他产品间隔使用，避免过度刺激。如有疑问，可以咨询我们的专业顾问。',
          category: '使用指导',
          tags: ['产品搭配', '使用顺序', '成分搭配'],
          source: 'customer',
          customerName: '钱女士',
          serviceName: '李医生',
          quality: 'good',
          usageCount: 34,
          createTime: '2025-01-05 16:10:00',
          updateTime: '2025-01-05 16:10:00'
        },
        // 价格咨询类
        {
          id: 'qa012',
          question: '这个产品多少钱？',
          answer: '我们的产品价格根据不同类型和规格有所不同。目前我们有多款产品可供选择，价格从几十元到几百元不等。建议您先进行皮肤检测，我们会根据您的需求推荐最适合的产品。另外，我们经常有优惠活动，新用户还有专享折扣，您可以关注我们的活动信息。',
          category: '价格咨询',
          tags: ['价格', '优惠', '折扣'],
          source: 'customer',
          customerName: '冯女士',
          serviceName: '陈医生',
          quality: 'good',
          usageCount: 73,
          createTime: '2025-01-04 10:50:00',
          updateTime: '2025-01-04 10:50:00'
        },
        {
          id: 'qa013',
          question: '有没有优惠活动？',
          answer: '我们经常会有各种优惠活动，包括新用户专享折扣、满减活动、会员积分等。建议您关注我们的官方渠道，及时了解最新活动信息。另外，如果您是我们的会员，还可以享受会员专享价格和积分兑换等福利。',
          category: '价格咨询',
          tags: ['优惠活动', '会员', '折扣'],
          source: 'customer',
          customerName: '陈女士',
          serviceName: '王医生',
          quality: 'good',
          usageCount: 58,
          createTime: '2025-01-03 14:25:00',
          updateTime: '2025-01-03 14:25:00'
        },
        // 售后问题类
        {
          id: 'qa014',
          question: '产品不满意可以退货吗？',
          answer: '我们支持7天无理由退货服务。如果您对产品不满意，可以在收到产品后7天内申请退货。退货时请保持产品包装完整，未开封使用。具体退货流程可以联系我们的客服，我们会为您提供详细的指导。',
          category: '售后服务',
          tags: ['退货', '退款', '售后服务'],
          source: 'customer',
          customerName: '褚女士',
          serviceName: '李医生',
          quality: 'excellent',
          usageCount: 29,
          createTime: '2025-01-02 09:15:00',
          updateTime: '2025-01-02 09:15:00'
        },
        {
          id: 'qa015',
          question: '产品用后过敏了怎么办？',
          answer: '非常抱歉给您带来不适。如果使用产品后出现过敏反应，请立即停用产品，并用清水清洗。如果症状严重，请及时就医。同时，请保留产品包装和购买凭证，联系我们的客服，我们会为您处理退货或换货，并承担相应责任。',
          category: '售后服务',
          tags: ['过敏', '售后处理', '医疗建议'],
          source: 'customer',
          customerName: '卫女士',
          serviceName: '陈医生',
          quality: 'excellent',
          usageCount: 18,
          createTime: '2025-01-01 11:40:00',
          updateTime: '2025-01-01 11:40:00'
        },
        // 皮肤检测相关
        {
          id: 'qa016',
          question: '皮肤检测是怎么做的？',
          answer: '我们的皮肤检测是通过专业的AI技术，分析您上传的照片来评估您的肤质状况。检测包括肤质类型、水分含量、油脂分泌、敏感度、色素沉着等多个维度。整个过程简单快捷，只需几分钟就能完成，检测结果会为您提供详细的皮肤分析报告和个性化护理建议。',
          category: '皮肤检测',
          tags: ['皮肤检测', 'AI检测', '肤质分析'],
          source: 'customer',
          customerName: '蒋女士',
          serviceName: '王医生',
          quality: 'excellent',
          usageCount: 92,
          createTime: '2024-12-31 15:30:00',
          updateTime: '2024-12-31 15:30:00'
        },
        {
          id: 'qa017',
          question: '检测结果准确吗？',
          answer: '我们的AI皮肤检测技术经过大量数据训练和验证，准确率较高。但需要注意的是，检测结果仅供参考，不能完全替代专业医生的诊断。如果您的皮肤问题比较严重，建议您咨询专业皮肤科医生。我们会根据检测结果为您提供建议，但最终的治疗方案还需要结合实际情况。',
          category: '皮肤检测',
          tags: ['检测准确性', 'AI技术', '专业建议'],
          source: 'customer',
          customerName: '沈女士',
          serviceName: '李医生',
          quality: 'excellent',
          usageCount: 64,
          createTime: '2024-12-30 10:20:00',
          updateTime: '2024-12-30 10:20:00'
        },
        // 更多客户问题
        {
          id: 'qa018',
          question: '我怀孕了，能用这些产品吗？',
          answer: '孕期使用护肤品需要特别谨慎。建议您选择成分简单、温和、无刺激的产品，避免使用含有A酸、水杨酸、视黄醇等成分的产品。最好咨询您的产科医生或皮肤科医生，根据您的具体情况选择合适的产品。我们也有一些专为孕妇设计的温和产品，您可以了解一下。',
          category: '特殊人群',
          tags: ['孕妇', '安全使用', '成分选择'],
          source: 'customer',
          customerName: '韩女士',
          serviceName: '陈医生',
          quality: 'excellent',
          usageCount: 21,
          createTime: '2024-12-29 13:50:00',
          updateTime: '2024-12-29 13:50:00'
        },
        {
          id: 'qa019',
          question: '多久做一次皮肤检测比较好？',
          answer: '建议您每月进行一次皮肤检测，这样可以及时了解皮肤状态的变化。如果您的皮肤正在接受治疗或使用新产品，可以适当增加检测频率，比如每两周一次。定期检测有助于跟踪皮肤改善情况，及时调整护理方案。',
          category: '皮肤检测',
          tags: ['检测频率', '定期检测', '跟踪改善'],
          source: 'customer',
          customerName: '杨女士',
          serviceName: '王医生',
          quality: 'good',
          usageCount: 47,
          createTime: '2024-12-28 16:00:00',
          updateTime: '2024-12-28 16:00:00'
        },
        {
          id: 'qa020',
          question: '你们有实体店吗？',
          answer: '我们目前主要是线上服务，您可以通过我们的平台进行皮肤检测、产品咨询和购买。我们与多家线下医疗机构和美容院有合作，如果您需要线下服务，我们可以为您推荐附近的合作机构。另外，我们的产品也可以通过线上渠道购买，支持全国配送。',
          category: '服务咨询',
          tags: ['实体店', '线下服务', '配送'],
          source: 'customer',
          customerName: '朱女士',
          serviceName: '李医生',
          quality: 'good',
          usageCount: 35,
          createTime: '2024-12-27 11:30:00',
          updateTime: '2024-12-27 11:30:00'
        }
      ]
      setQaData(mockData)
      setLoading(false)
    }, 500)
  }, [])

  // 获取所有分类
  const categories = useMemo(() => {
    const cats = new Set(qaData.map(item => item.category))
    return Array.from(cats)
  }, [qaData])

  // 过滤数据
  const filteredData = useMemo(() => {
    let filtered = qaData

    // 按来源过滤
    if (activeTab === 'customer') {
      filtered = filtered.filter(item => item.source === 'customer')
    } else if (activeTab === 'service') {
      filtered = filtered.filter(item => item.source === 'service')
    }

    // 按分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // 按搜索文本过滤
    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase()
      filtered = filtered.filter(item =>
        item.question.toLowerCase().includes(lowerSearch) ||
        item.answer.toLowerCase().includes(lowerSearch) ||
        item.category.toLowerCase().includes(lowerSearch) ||
        item.tags?.some(tag => tag.toLowerCase().includes(lowerSearch))
      )
    }

    return filtered
  }, [qaData, activeTab, selectedCategory, searchText])

  // 表格列定义
  const columns: ColumnsType<QAData> = [
    {
      title: '问题',
      dataIndex: 'question',
      key: 'question',
      width: 250,
      ellipsis: {
        showTitle: false
      },
      render: (text, record) => (
        <Tooltip placement="topLeft" title={text}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {record.source === 'customer' ? (
              <UserOutlined style={{ color: '#1890ff' }} />
            ) : (
              <CustomerServiceOutlined style={{ color: '#52c41a' }} />
            )}
            <span>{text}</span>
          </div>
        </Tooltip>
      )
    },
    {
      title: '答案',
      dataIndex: 'answer',
      key: 'answer',
      width: 350,
      ellipsis: {
        showTitle: false
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => <Tag color="blue">{category}</Tag>
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags) => (
        <Space size={[0, 8]} wrap>
          {tags?.slice(0, 2).map((tag, idx) => (
            <Tag key={idx} color="cyan">{tag}</Tag>
          ))}
          {tags && tags.length > 2 && (
            <Tag color="default">+{tags.length - 2}</Tag>
          )}
        </Space>
      )
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source, record) => (
        <Space>
          {source === 'customer' ? (
            <>
              <UserOutlined style={{ color: '#1890ff' }} />
              <span>客户</span>
            </>
          ) : (
            <>
              <CustomerServiceOutlined style={{ color: '#52c41a' }} />
              <span>服务</span>
            </>
          )}
        </Space>
      )
    },
    {
      title: '质量',
      dataIndex: 'quality',
      key: 'quality',
      width: 100,
      render: (quality) => {
        const qualityMap = {
          excellent: { text: '优秀', color: 'success' },
          good: { text: '良好', color: 'processing' },
          normal: { text: '一般', color: 'default' },
          poor: { text: '较差', color: 'error' }
        }
        const qualityInfo = qualityMap[quality || 'normal']
        return <Badge status={qualityInfo.color as any} text={qualityInfo.text} />
      }
    },
    {
      title: '使用次数',
      dataIndex: 'usageCount',
      key: 'usageCount',
      width: 100,
      render: (count) => count || 0
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条问答吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // 处理查看
  const handleView = (qa: QAData) => {
    setViewingQA(qa)
    setViewModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (qa?: QAData) => {
    if (qa) {
      setEditingQA(qa)
      form.setFieldsValue({
        ...qa,
        tags: qa.tags?.join(',')
      })
    } else {
      setEditingQA(null)
      form.resetFields()
      form.setFieldsValue({
        source: 'customer',
        category: '皮肤问题',
        quality: 'good'
      })
    }
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    setQaData(qaData.filter(item => item.id !== id))
    message.success('删除成功')
  }

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      
      const qaItem: QAData = {
        id: editingQA?.id || `qa${Date.now()}`,
        question: values.question,
        answer: values.answer,
        category: values.category,
        tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        source: values.source,
        customerName: values.customerName,
        serviceName: values.serviceName,
        quality: values.quality,
        usageCount: editingQA?.usageCount || 0,
        createTime: editingQA?.createTime || new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN')
      }

      if (editingQA) {
        setQaData(qaData.map(item => item.id === editingQA.id ? qaItem : item))
        message.success('更新成功')
      } else {
        setQaData([...qaData, qaItem])
        message.success('创建成功')
      }

      setModalVisible(false)
      form.resetFields()
      setEditingQA(null)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Alert
            message="问答语料库"
            description="管理客户和服务人员的问答数据，用于训练AI模型和提供智能客服支持。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'all' | 'customer' | 'service')}
          style={{ marginBottom: 16 }}
        >
          <TabPane tab="全部问答" key="all" />
          <TabPane tab="客户提问" key="customer" />
          <TabPane tab="服务回答" key="service" />
        </Tabs>

        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space>
            <Input
              placeholder="搜索问题、答案、分类或标签"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <Select
              style={{ width: 150 }}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="选择分类"
            >
              <Option value="all">全部分类</Option>
              {categories.map(cat => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleEdit()}
          >
            新增问答
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条问答数据`,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
        />
      </Card>

      {/* 编辑/新增弹窗 */}
      <Modal
        title={editingQA ? '编辑问答' : '新增问答'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
          setEditingQA(null)
        }}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            source: 'customer',
            category: '皮肤问题',
            quality: 'good'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="来源"
                name="source"
                rules={[{ required: true, message: '请选择来源' }]}
              >
                <Select>
                  <Option value="customer">客户提问</Option>
                  <Option value="service">服务回答</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="分类"
                name="category"
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <Select>
                  <Option value="皮肤问题">皮肤问题</Option>
                  <Option value="产品咨询">产品咨询</Option>
                  <Option value="使用指导">使用指导</Option>
                  <Option value="价格咨询">价格咨询</Option>
                  <Option value="售后服务">售后服务</Option>
                  <Option value="皮肤检测">皮肤检测</Option>
                  <Option value="服务引导">服务引导</Option>
                  <Option value="特殊人群">特殊人群</Option>
                  <Option value="服务咨询">服务咨询</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="问题"
            name="question"
            rules={[{ required: true, message: '请输入问题' }]}
          >
            <TextArea
              rows={3}
              placeholder="输入客户问题或服务人员的问题引导"
            />
          </Form.Item>

          <Form.Item
            label="答案"
            name="answer"
            rules={[{ required: true, message: '请输入答案' }]}
          >
            <TextArea
              rows={5}
              placeholder="输入服务人员的回答内容"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="客户名称"
                name="customerName"
              >
                <Input placeholder="可选" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="服务人员名称"
                name="serviceName"
              >
                <Input placeholder="可选" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="标签"
                name="tags"
                extra="多个标签用逗号分隔"
              >
                <Input placeholder="例如：痘痘,皮肤护理,治疗方案" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="质量评级"
                name="quality"
              >
                <Select>
                  <Option value="excellent">优秀</Option>
                  <Option value="good">良好</Option>
                  <Option value="normal">一般</Option>
                  <Option value="poor">较差</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal
        title="问答详情"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false)
          setViewingQA(null)
        }}
        width={800}
        footer={[
          <Button key="edit" type="primary" onClick={() => {
            setViewModalVisible(false)
            if (viewingQA) {
              handleEdit(viewingQA)
            }
          }}>
            编辑
          </Button>,
          <Button key="close" onClick={() => {
            setViewModalVisible(false)
            setViewingQA(null)
          }}>
            关闭
          </Button>
        ]}
      >
        {viewingQA && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <div>
                  <strong>来源：</strong>
                  <Tag color={viewingQA.source === 'customer' ? 'blue' : 'green'} style={{ marginLeft: 8 }}>
                    {viewingQA.source === 'customer' ? '客户提问' : '服务回答'}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <strong>分类：</strong>
                  <Tag color="blue" style={{ marginLeft: 8 }}>{viewingQA.category}</Tag>
                </div>
              </Col>
            </Row>

            <Divider orientation="left">问题</Divider>
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              whiteSpace: 'pre-wrap'
            }}>
              {viewingQA.question}
            </div>

            <Divider orientation="left">答案</Divider>
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#f0f9ff',
              borderRadius: '4px',
              whiteSpace: 'pre-wrap'
            }}>
              {viewingQA.answer}
            </div>

            {viewingQA.tags && viewingQA.tags.length > 0 && (
              <>
                <Divider orientation="left">标签</Divider>
                <div style={{ marginBottom: 16 }}>
                  <Space wrap>
                    {viewingQA.tags.map((tag, idx) => (
                      <Tag key={idx} color="cyan">{tag}</Tag>
                    ))}
                  </Space>
                </div>
              </>
            )}

            <Row gutter={16}>
              <Col span={8}>
                <div><strong>质量评级：</strong>
                  <Badge
                    status={
                      viewingQA.quality === 'excellent' ? 'success'
                      : viewingQA.quality === 'good' ? 'processing'
                      : viewingQA.quality === 'poor' ? 'error'
                      : 'default'
                    }
                    text={
                      viewingQA.quality === 'excellent' ? '优秀'
                      : viewingQA.quality === 'good' ? '良好'
                      : viewingQA.quality === 'poor' ? '较差'
                      : '一般'
                    }
                    style={{ marginLeft: 8 }}
                  />
                </div>
              </Col>
              <Col span={8}>
                <div><strong>使用次数：</strong>{viewingQA.usageCount || 0}</div>
              </Col>
              <Col span={8}>
                <div><strong>创建时间：</strong>{viewingQA.createTime}</div>
              </Col>
            </Row>

            {(viewingQA.customerName || viewingQA.serviceName) && (
              <Row gutter={16} style={{ marginTop: 16 }}>
                {viewingQA.customerName && (
                  <Col span={12}>
                    <div><strong>客户名称：</strong>{viewingQA.customerName}</div>
                  </Col>
                )}
                {viewingQA.serviceName && (
                  <Col span={12}>
                    <div><strong>服务人员：</strong>{viewingQA.serviceName}</div>
                  </Col>
                )}
              </Row>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default QALibrary
