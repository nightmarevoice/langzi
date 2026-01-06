import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Input,
  DatePicker,
  Select,
  Tag,
  Button,
  Space,
  List,
  Avatar,
  Badge,
  Divider,
  Modal,
  Form,
  message,
  Empty,
  Tooltip,
  Popover
} from 'antd'
import {
  SearchOutlined,
  RobotOutlined,
  UserOutlined,
  MessageOutlined,
  TagOutlined,
  WarningOutlined,
  CustomerServiceOutlined,
  FileAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SkinOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import type { RangePickerProps } from 'antd/es/date-picker'
import dayjs, { Dayjs } from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select
const { TextArea } = Input

// 会话列表项接口
interface ConversationItem {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  lastMessage: string
  lastReplyTime: string
  channel: '小程序' | '活动入口'
  tags: string[]
  isAI: boolean
  isHuman: boolean
  status: 'active' | 'closed'
  riskLevel?: 'high' | 'medium' | 'low'
}

// 对话消息接口
interface Message {
  id: string
  type: 'user' | 'ai' | 'human'
  content: string
  timestamp: string
  knowledgeItems?: KnowledgeItem[]
  isMarked?: boolean
  markType?: string
}

// 知识条目接口
interface KnowledgeItem {
  id: string
  title: string
  content: string
  source: string
  relevance: number
}

// 用户信息接口
interface UserProfile {
  id: string
  name: string
  avatar?: string
  skinType: string
  mainProblems: string[]
  recentPush?: {
    id: string
    title: string
    time: string
  }
  recentReport?: {
    id: string
    title: string
    time: string
    score: number
  }
}

// 模拟数据
const mockConversations: ConversationItem[] = [
  {
    id: '1',
    userId: 'user1',
    userName: '张美丽',
    lastMessage: '我的皮肤最近总是长痘痘，怎么办？',
    lastReplyTime: '2025-01-15 14:30:00',
    channel: '小程序',
    tags: ['产品咨询'],
    isAI: true,
    isHuman: false,
    status: 'active',
    riskLevel: 'low'
  },
  {
    id: '2',
    userId: 'user2',
    userName: '李小花',
    lastMessage: '我的脸上有很多色斑，有什么办法可以淡化吗？',
    lastReplyTime: '2025-01-15 14:25:00',
    channel: '小程序',
    tags: ['产品咨询'],
    isAI: true,
    isHuman: false,
    status: 'active',
    riskLevel: 'low'
  },
  {
    id: '3',
    userId: 'user3',
    userName: '王芳',
    lastMessage: '敏感肌可以用什么护肤品？我的皮肤很容易过敏',
    lastReplyTime: '2025-01-15 14:20:00',
    channel: '活动入口',
    tags: ['产品咨询'],
    isAI: true,
    isHuman: false,
    status: 'active',
    riskLevel: 'low'
  },
  {
    id: '4',
    userId: 'user4',
    userName: '赵敏',
    lastMessage: '我的皮肤很干燥，总是起皮，有什么好的保湿方法？',
    lastReplyTime: '2025-01-15 14:15:00',
    channel: '小程序',
    tags: ['产品咨询'],
    isAI: true,
    isHuman: false,
    status: 'active',
    riskLevel: 'low'
  },
  {
    id: '5',
    userId: 'user5',
    userName: '陈静',
    lastMessage: '谢谢你的建议，我会试试的',
    lastReplyTime: '2025-01-15 14:10:00',
    channel: '小程序',
    tags: [],
    isAI: true,
    isHuman: false,
    status: 'closed',
    riskLevel: 'low'
  },
  {
    id: '6',
    userId: 'user6',
    userName: '刘雨',
    lastMessage: '我的黑眼圈很严重，有什么办法改善吗？',
    lastReplyTime: '2025-01-15 14:05:00',
    channel: '小程序',
    tags: ['产品咨询'],
    isAI: true,
    isHuman: false,
    status: 'active',
    riskLevel: 'low'
  },
  {
    id: '7',
    userId: 'user7',
    userName: '周婷',
    lastMessage: '毛孔粗大怎么办？有什么产品可以收缩毛孔？',
    lastReplyTime: '2025-01-15 14:00:00',
    channel: '活动入口',
    tags: ['产品咨询'],
    isAI: true,
    isHuman: false,
    status: 'active',
    riskLevel: 'low'
  }
]

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      type: 'user',
      content: '我的皮肤最近总是长痘痘，怎么办？',
      timestamp: '2025-01-15 14:25:00'
    },
    {
      id: 'm2',
      type: 'ai',
      content: '根据您的描述，建议您先了解痘痘的成因。通常痘痘与皮脂分泌过多、毛囊堵塞、细菌感染等因素有关。建议您：1. 保持面部清洁，使用温和的洁面产品；2. 避免用手挤压痘痘；3. 注意饮食，少吃辛辣油腻食物；4. 可以尝试使用含有水杨酸或果酸的产品。',
      timestamp: '2025-01-15 14:26:00',
      knowledgeItems: [
        {
          id: 'k1',
          title: '痘痘成因与护理',
          content: '痘痘主要由皮脂分泌过多、毛囊堵塞引起。日常护理应注重清洁、控油和抗炎，避免过度清洁导致皮肤屏障受损。',
          source: '皮肤知识库',
          relevance: 0.95
        },
        {
          id: 'k2',
          title: '温和洁面产品推荐',
          content: '适合痘痘肌的洁面产品应选择温和无刺激、pH值接近皮肤的弱酸性产品，避免使用含皂基的强碱性洁面。',
          source: '产品知识库',
          relevance: 0.88
        }
      ]
    },
    {
      id: 'm3',
      type: 'user',
      content: '有没有推荐的产品？',
      timestamp: '2025-01-15 14:28:00'
    },
    {
      id: 'm4',
      type: 'ai',
      content: '根据您的肤质，我推荐以下产品：1. 温和洁面乳 - 适合敏感痘痘肌；2. 水杨酸精华 - 帮助疏通毛孔；3. 舒缓保湿霜 - 修复受损肌肤。您可以点击查看产品详情。',
      timestamp: '2025-01-15 14:30:00',
      knowledgeItems: [
        {
          id: 'k3',
          title: '痘痘肌产品推荐',
          content: '针对痘痘肌，推荐使用温和洁面、水杨酸精华和舒缓保湿产品，建立完整的护肤流程。',
          source: '产品知识库',
          relevance: 0.92
        }
      ]
    }
  ],
  '2': [
    {
      id: 'm5',
      type: 'user',
      content: '我的脸上有很多色斑，有什么办法可以淡化吗？',
      timestamp: '2025-01-15 14:20:00'
    },
    {
      id: 'm6',
      type: 'ai',
      content: '色斑的形成与紫外线、内分泌、遗传等因素有关。建议您：1. 严格防晒，每天使用SPF30+的防晒霜；2. 使用含有维生素C、烟酰胺、熊果苷等美白成分的产品；3. 定期进行皮肤检测，了解色斑类型；4. 保持良好的作息和饮食习惯。',
      timestamp: '2025-01-15 14:22:00',
      knowledgeItems: [
        {
          id: 'k4',
          title: '色斑成因与淡化方法',
          content: '色斑主要由黑色素沉积形成，可通过防晒、使用美白成分产品、激光治疗等方式改善。',
          source: '皮肤知识库',
          relevance: 0.93
        },
        {
          id: 'k5',
          title: '美白精华推荐',
          content: '含有维生素C、烟酰胺、熊果苷等成分的美白精华，可有效抑制黑色素生成，淡化色斑。',
          source: '产品知识库',
          relevance: 0.90
        }
      ]
    },
    {
      id: 'm7',
      type: 'user',
      content: '需要多长时间才能看到效果？',
      timestamp: '2025-01-15 14:23:00'
    },
    {
      id: 'm8',
      type: 'ai',
      content: '色斑淡化是一个循序渐进的过程，通常需要3-6个月才能看到明显效果。建议您坚持使用，并配合防晒措施。如果色斑较严重，建议咨询专业皮肤科医生，考虑医美治疗。',
      timestamp: '2025-01-15 14:25:00',
      knowledgeItems: [
        {
          id: 'k6',
          title: '色斑治疗周期',
          content: '色斑淡化需要时间，通常3-6个月可见效果，需要坚持使用并配合防晒。',
          source: '皮肤知识库',
          relevance: 0.87
        }
      ]
    }
  ],
  '3': [
    {
      id: 'm9',
      type: 'user',
      content: '敏感肌可以用什么护肤品？我的皮肤很容易过敏',
      timestamp: '2025-01-15 14:15:00'
    },
    {
      id: 'm10',
      type: 'ai',
      content: '敏感肌需要特别温和的护理。建议您：1. 选择无香料、无酒精、无防腐剂的护肤品；2. 使用含有神经酰胺、角鲨烷等修复成分的产品；3. 避免使用去角质产品；4. 先做皮肤测试，确认无过敏反应再使用。',
      timestamp: '2025-01-15 14:17:00',
      knowledgeItems: [
        {
          id: 'k7',
          title: '敏感肌护理要点',
          content: '敏感肌应选择温和、无刺激的护肤品，注重修复皮肤屏障，避免过度清洁和去角质。',
          source: '皮肤知识库',
          relevance: 0.94
        },
        {
          id: 'k8',
          title: '敏感肌产品推荐',
          content: '适合敏感肌的产品应含有神经酰胺、角鲨烷等修复成分，无香料、无酒精、无防腐剂。',
          source: '产品知识库',
          relevance: 0.91
        }
      ]
    }
  ],
  '4': [
    {
      id: 'm11',
      type: 'user',
      content: '我的皮肤很干燥，总是起皮，有什么好的保湿方法？',
      timestamp: '2025-01-15 14:10:00'
    },
    {
      id: 'm12',
      type: 'ai',
      content: '干燥起皮说明皮肤屏障受损，需要加强保湿和修复。建议您：1. 使用温和的洁面产品，避免过度清洁；2. 选择含有透明质酸、甘油、神经酰胺等保湿成分的产品；3. 定期使用补水面膜；4. 保持室内湿度，多喝水；5. 使用面霜锁住水分。',
      timestamp: '2025-01-15 14:12:00',
      knowledgeItems: [
        {
          id: 'k9',
          title: '干燥肌护理方法',
          content: '干燥肌需要加强保湿，使用含有透明质酸、甘油等保湿成分的产品，并注意锁水。',
          source: '皮肤知识库',
          relevance: 0.96
        },
        {
          id: 'k10',
          title: '保湿产品推荐',
          content: '适合干燥肌的产品应含有透明质酸、甘油、神经酰胺等强效保湿成分。',
          source: '产品知识库',
          relevance: 0.89
        }
      ]
    },
    {
      id: 'm13',
      type: 'user',
      content: '可以推荐一些具体的产品吗？',
      timestamp: '2025-01-15 14:13:00'
    },
    {
      id: 'm14',
      type: 'ai',
      content: '根据您的需求，我推荐：1. 温和洁面乳 - 清洁不紧绷；2. 透明质酸精华 - 深层补水；3. 神经酰胺面霜 - 修复屏障并锁水；4. 补水面膜 - 每周2-3次。您可以查看产品详情页面了解更多信息。',
      timestamp: '2025-01-15 14:15:00',
      knowledgeItems: [
        {
          id: 'k11',
          title: '干燥肌产品组合',
          content: '针对干燥肌，推荐温和洁面、透明质酸精华、神经酰胺面霜和补水面膜的完整护肤流程。',
          source: '产品知识库',
          relevance: 0.93
        }
      ]
    }
  ],
  '5': [
    {
      id: 'm15',
      type: 'user',
      content: '我的黑眼圈很严重，有什么办法改善吗？',
      timestamp: '2025-01-15 14:05:00'
    },
    {
      id: 'm16',
      type: 'ai',
      content: '黑眼圈的形成与遗传、熬夜、血液循环不良等因素有关。建议您：1. 保证充足睡眠，避免熬夜；2. 使用含有咖啡因、维生素K的眼霜；3. 适当按摩眼部，促进血液循环；4. 注意防晒，避免色素沉着；5. 如果情况严重，可考虑医美治疗。',
      timestamp: '2025-01-15 14:07:00',
      knowledgeItems: [
        {
          id: 'k12',
          title: '黑眼圈改善方法',
          content: '黑眼圈可通过改善作息、使用眼霜、按摩等方式改善，严重者可考虑医美治疗。',
          source: '皮肤知识库',
          relevance: 0.92
        },
        {
          id: 'k13',
          title: '眼霜推荐',
          content: '含有咖啡因、维生素K等成分的眼霜可有效改善黑眼圈，促进眼部血液循环。',
          source: '产品知识库',
          relevance: 0.88
        }
      ]
    },
    {
      id: 'm17',
      type: 'user',
      content: '谢谢你的建议，我会试试的',
      timestamp: '2025-01-15 14:10:00'
    }
  ],
  '6': [
    {
      id: 'm18',
      type: 'user',
      content: '我的黑眼圈很严重，有什么办法改善吗？',
      timestamp: '2025-01-15 14:00:00'
    },
    {
      id: 'm19',
      type: 'ai',
      content: '黑眼圈的形成与遗传、熬夜、血液循环不良等因素有关。建议您：1. 保证充足睡眠，避免熬夜；2. 使用含有咖啡因、维生素K的眼霜；3. 适当按摩眼部，促进血液循环；4. 注意防晒，避免色素沉着。',
      timestamp: '2025-01-15 14:02:00',
      knowledgeItems: [
        {
          id: 'k14',
          title: '黑眼圈改善方法',
          content: '黑眼圈可通过改善作息、使用眼霜、按摩等方式改善。',
          source: '皮肤知识库',
          relevance: 0.92
        }
      ]
    }
  ],
  '7': [
    {
      id: 'm20',
      type: 'user',
      content: '毛孔粗大怎么办？有什么产品可以收缩毛孔？',
      timestamp: '2025-01-15 13:55:00'
    },
    {
      id: 'm21',
      type: 'ai',
      content: '毛孔粗大与油脂分泌、皮肤老化、清洁不当等因素有关。建议您：1. 做好清洁工作，定期使用清洁面膜；2. 使用含有水杨酸、果酸、视黄醇等成分的产品；3. 注意控油，保持水油平衡；4. 做好防晒，延缓皮肤老化；5. 严重者可考虑医美治疗如点阵激光。',
      timestamp: '2025-01-15 13:57:00',
      knowledgeItems: [
        {
          id: 'k15',
          title: '毛孔粗大改善方法',
          content: '毛孔粗大可通过清洁、控油、使用酸类产品和医美治疗等方式改善。',
          source: '皮肤知识库',
          relevance: 0.94
        },
        {
          id: 'k16',
          title: '收缩毛孔产品推荐',
          content: '含有水杨酸、果酸、视黄醇等成分的产品可有效改善毛孔粗大问题。',
          source: '产品知识库',
          relevance: 0.90
        }
      ]
    },
    {
      id: 'm22',
      type: 'user',
      content: '使用这些产品会不会让皮肤变敏感？',
      timestamp: '2025-01-15 14:00:00'
    },
    {
      id: 'm23',
      type: 'ai',
      content: '如果使用不当，确实可能导致皮肤敏感。建议您：1. 从低浓度开始，逐步建立耐受；2. 不要同时使用多种酸类产品；3. 使用后注意保湿和防晒；4. 如果出现不适，立即停用；5. 建议先咨询专业皮肤科医生。',
      timestamp: '2025-01-15 14:02:00',
      knowledgeItems: [
        {
          id: 'k17',
          title: '酸类产品使用注意事项',
          content: '使用酸类产品需从低浓度开始，建立耐受，注意保湿防晒，避免过度使用。',
          source: '皮肤知识库',
          relevance: 0.91
        }
      ]
    }
  ]
}

const mockUserProfiles: Record<string, UserProfile> = {
  'user1': {
    id: 'user1',
    name: '张美丽',
    skinType: '混合性',
    mainProblems: ['痤疮', '色斑'],
    recentPush: {
      id: 'push1',
      title: '春季护肤指南',
      time: '2025-01-10 10:00:00'
    },
    recentReport: {
      id: 'report1',
      title: 'AI测肤分析报告',
      time: '2025-01-12 14:30:00',
      score: 82
    }
  },
  'user2': {
    id: 'user2',
    name: '李小花',
    skinType: '混合性',
    mainProblems: ['色斑', '暗沉'],
    recentPush: {
      id: 'push2',
      title: '美白淡斑护理建议',
      time: '2025-01-08 09:00:00'
    },
    recentReport: {
      id: 'report2',
      title: 'AI测肤分析报告',
      time: '2025-01-11 16:20:00',
      score: 75
    }
  },
  'user3': {
    id: 'user3',
    name: '王芳',
    skinType: '敏感性',
    mainProblems: ['敏感', '红血丝'],
    recentPush: {
      id: 'push3',
      title: '敏感肌护理建议',
      time: '2025-01-09 11:00:00'
    },
    recentReport: {
      id: 'report3',
      title: 'AI测肤分析报告',
      time: '2025-01-13 10:15:00',
      score: 68
    }
  },
  'user4': {
    id: 'user4',
    name: '赵敏',
    skinType: '干性',
    mainProblems: ['干燥', '起皮'],
    recentPush: {
      id: 'push4',
      title: '干燥肌保湿指南',
      time: '2025-01-07 14:30:00'
    },
    recentReport: {
      id: 'report4',
      title: 'AI测肤分析报告',
      time: '2025-01-14 09:45:00',
      score: 70
    }
  },
  'user5': {
    id: 'user5',
    name: '陈静',
    skinType: '混合性',
    mainProblems: ['黑眼圈', '细纹'],
    recentPush: {
      id: 'push5',
      title: '眼部护理建议',
      time: '2025-01-06 15:00:00'
    }
  },
  'user6': {
    id: 'user6',
    name: '刘雨',
    skinType: '混合性',
    mainProblems: ['黑眼圈', '眼袋'],
    recentReport: {
      id: 'report6',
      title: 'AI测肤分析报告',
      time: '2025-01-10 13:20:00',
      score: 78
    }
  },
  'user7': {
    id: 'user7',
    name: '周婷',
    skinType: '油性',
    mainProblems: ['毛孔粗大', '出油'],
    recentPush: {
      id: 'push7',
      title: '控油收缩毛孔指南',
      time: '2025-01-05 10:00:00'
    },
    recentReport: {
      id: 'report7',
      title: 'AI测肤分析报告',
      time: '2025-01-09 15:30:00',
      score: 80
    }
  }
}

const ConversationCenter: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [conversations, setConversations] = useState<ConversationItem[]>(mockConversations)
  const [filteredConversations, setFilteredConversations] = useState<ConversationItem[]>(mockConversations)
  const [messages, setMessages] = useState<Message[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  
  // 过滤条件
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)
  const [channelFilter, setChannelFilter] = useState<string>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  
  // 模态框状态
  const [transferModalVisible, setTransferModalVisible] = useState(false)
  const [ticketModalVisible, setTicketModalVisible] = useState(false)
  const [markModalVisible, setMarkModalVisible] = useState(false)
  const [transferForm] = Form.useForm()
  const [ticketForm] = Form.useForm()
  const [markForm] = Form.useForm()

  // 选择会话
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
    const conversation = conversations.find(c => c.id === conversationId)
    if (conversation) {
      setMessages(mockMessages[conversationId] || [])
      setUserProfile(mockUserProfiles[conversation.userId] || null)
    }
  }

  // 过滤会话
  useEffect(() => {
    let filtered = [...conversations]

    // 时间范围过滤
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(conv => {
        const convTime = dayjs(conv.lastReplyTime)
        return convTime.isAfter(dateRange[0]!) && convTime.isBefore(dateRange[1]!.add(1, 'day'))
      })
    }

    // 渠道过滤
    if (channelFilter !== 'all') {
      filtered = filtered.filter(conv => conv.channel === channelFilter)
    }

    // 标签过滤
    if (tagFilter !== 'all') {
      filtered = filtered.filter(conv => conv.tags.includes(tagFilter))
    }

    // 关键词搜索
    if (searchKeyword) {
      filtered = filtered.filter(conv =>
        conv.userName.includes(searchKeyword) ||
        conv.lastMessage.includes(searchKeyword)
      )
    }

    setFilteredConversations(filtered)
  }, [conversations, dateRange, channelFilter, tagFilter, searchKeyword])

  // 转人工
  const handleTransferToHuman = () => {
    setTransferModalVisible(true)
  }

  const handleTransferSubmit = async (values: any) => {
    // TODO: 调用API转人工
    message.success('已转接人工客服')
    setTransferModalVisible(false)
    transferForm.resetFields()
    
    // 更新会话状态
    if (selectedConversation) {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversation
            ? { ...conv, isAI: false, isHuman: true }
            : conv
        )
      )
    }
  }

  // 创建工单
  const handleCreateTicket = () => {
    setTicketModalVisible(true)
  }

  const handleTicketSubmit = async (values: any) => {
    // TODO: 调用API创建工单
    message.success('工单创建成功')
    setTicketModalVisible(false)
    ticketForm.resetFields()
  }

  // 标记会话
  const handleMarkConversation = () => {
    setMarkModalVisible(true)
  }

  const handleMarkSubmit = async (values: any) => {
    // TODO: 调用API标记会话
    message.success('标记成功')
    setMarkModalVisible(false)
    markForm.resetFields()
    
    // 更新消息标记
    if (selectedConversation && messages.length > 0) {
      setMessages(prev =>
        prev.map(msg => ({ ...msg, isMarked: true, markType: values.markType }))
      )
    }
  }

  // 获取风险等级颜色
  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'high':
        return 'red'
      case 'medium':
        return 'orange'
      case 'low':
        return 'green'
      default:
        return 'default'
    }
  }

  // 获取风险等级文本
  const getRiskText = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'high':
        return '高风险'
      case 'medium':
        return '中风险'
      case 'low':
        return '低风险'
      default:
        return ''
    }
  }

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ marginBottom: 16 }}>会话中心</h1>
      
      <Row gutter={16} style={{ flex: 1, overflow: 'hidden' }}>
        {/* 左侧会话列表 */}
        <Col span={6} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Card
            title="会话列表"
            size="small"
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            bodyStyle={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '12px' }}
          >
            {/* 过滤条件 */}
            <div style={{ marginBottom: 12 }}>
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <RangePicker
                  style={{ width: '100%' }}
                  size="small"
                  value={dateRange}
                  onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null] | null)}
                  showTime
                  format="YYYY-MM-DD HH:mm"
                />
                <Select
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="渠道"
                  value={channelFilter}
                  onChange={setChannelFilter}
                >
                  <Option value="all">全部渠道</Option>
                  <Option value="小程序">小程序</Option>
                  <Option value="活动入口">活动入口</Option>
                </Select>
                <Select
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="标签"
                  value={tagFilter}
                  onChange={setTagFilter}
                >
                  <Option value="all">全部标签</Option>
                  <Option value="投诉">投诉</Option>
                  <Option value="产品咨询">产品咨询</Option>
                  <Option value="异常">异常</Option>
                </Select>
                <Input
                  placeholder="搜索用户名或消息"
                  prefix={<SearchOutlined />}
                  size="small"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </Space>
            </div>

            {/* 会话列表 */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              <List
                dataSource={filteredConversations}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      cursor: 'pointer',
                      padding: '12px',
                      backgroundColor: selectedConversation === item.id ? '#e6f7ff' : 'transparent',
                      borderLeft: selectedConversation === item.id ? '3px solid #1890ff' : '3px solid transparent',
                      marginBottom: 8,
                      borderRadius: 4
                    }}
                    onClick={() => handleSelectConversation(item.id)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge
                          dot
                          color={item.status === 'active' ? '#52c41a' : '#d9d9d9'}
                        >
                          <Avatar icon={<UserOutlined />} src={item.userAvatar} />
                        </Badge>
                      }
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 14, fontWeight: 500 }}>{item.userName}</span>
                          <div>
                            {item.isAI && <Tag color="blue" style={{ fontSize: '11px' }}>AI</Tag>}
                            {item.isHuman && <Tag color="green" style={{ fontSize: '11px' }}>人工</Tag>}
                            {item.riskLevel && (
                              <Tag color={getRiskColor(item.riskLevel)} style={{ fontSize: '11px' }}>
                                {getRiskText(item.riskLevel)}
                              </Tag>
                            )}
                          </div>
                        </div>
                      }
                      description={
                        <div>
                          <div style={{ fontSize: 12, color: '#666', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.lastMessage}
                          </div>
                          <div style={{ fontSize: 11, color: '#999' }}>
                            {item.lastReplyTime}
                          </div>
                          <div style={{ marginTop: 4 }}>
                            <Space size={[0, 4]} wrap>
                              {item.tags.map(tag => (
                                <Tag key={tag} color="orange" style={{ fontSize: '11px' }}>{tag}</Tag>
                              ))}
                            </Space>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>

        {/* 中间对话详情 */}
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Card
            title={
              selectedConversation ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>对话详情</span>
                  <Space>
                    <Button size="small" icon={<TagOutlined />} onClick={handleMarkConversation}>
                      标记
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      icon={<CustomerServiceOutlined />}
                      onClick={handleTransferToHuman}
                      disabled={conversations.find(c => c.id === selectedConversation)?.isHuman}
                    >
                      转人工
                    </Button>
                    <Button size="small" icon={<FileAddOutlined />} onClick={handleCreateTicket}>
                      创建工单
                    </Button>
                  </Space>
                </div>
              ) : (
                '对话详情'
              )
            }
            size="small"
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            bodyStyle={{ flex: 1, overflow: 'auto', padding: '16px' }}
          >
            {selectedConversation && messages.length > 0 ? (
              <div>
                {messages.map((message, index) => (
                  <div key={message.id} style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: 8
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '70%',
                          padding: '12px 16px',
                          borderRadius: 8,
                          backgroundColor:
                            message.type === 'user'
                              ? '#1890ff'
                              : message.type === 'ai'
                              ? '#f0f0f0'
                              : '#e6f7ff',
                          color: message.type === 'user' ? '#fff' : '#000'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                          {message.type === 'ai' && <RobotOutlined style={{ marginRight: 4 }} />}
                          {message.type === 'human' && <UserOutlined style={{ marginRight: 4 }} />}
                          <span style={{ fontSize: 12, fontWeight: 500 }}>
                            {message.type === 'user'
                              ? '用户'
                              : message.type === 'ai'
                              ? 'AI助手'
                              : '人工客服'}
                          </span>
                          <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.7 }}>
                            {message.timestamp}
                          </span>
                        </div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
                        
                        {/* 知识条目展示 */}
                        {message.knowledgeItems && message.knowledgeItems.length > 0 && (
                          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>AI 命中知识：</div>
                            {message.knowledgeItems.map(knowledge => (
                              <Popover
                                key={knowledge.id}
                                title={knowledge.title}
                                content={
                                  <div>
                                    <div style={{ marginBottom: 8 }}>{knowledge.content}</div>
                                    <div style={{ fontSize: 12, color: '#999' }}>
                                      来源：{knowledge.source} | 相关度：{(knowledge.relevance * 100).toFixed(0)}%
                                    </div>
                                  </div>
                                }
                              >
                                <Tag
                                  color="blue"
                                  style={{ cursor: 'pointer', marginBottom: 4 }}
                                >
                                  {knowledge.title}
                                </Tag>
                              </Popover>
                            ))}
                          </div>
                        )}
                        
                        {/* 标记信息 */}
                        {message.isMarked && message.markType && (
                          <div style={{ marginTop: 8 }}>
                            <Tag color="red" icon={<WarningOutlined />}>
                              {message.markType}
                            </Tag>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < messages.length - 1 && <Divider style={{ margin: '8px 0' }} />}
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="请选择会话查看对话详情" />
            )}
          </Card>
        </Col>

        {/* 右侧用户信息栏 */}
        <Col span={6} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Card
            title="用户信息"
            size="small"
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            bodyStyle={{ flex: 1, overflow: 'auto', padding: '16px' }}
          >
            {userProfile ? (
              <div>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Avatar size={64} icon={<UserOutlined />} />
                  <div style={{ marginTop: 8, fontSize: 16, fontWeight: 500 }}>
                    {userProfile.name}
                  </div>
                </div>

                <Divider />

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                    <SkinOutlined style={{ marginRight: 4 }} />
                    用户画像
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ color: '#999' }}>肤质：</span>
                    <Tag color="blue">{userProfile.skinType}</Tag>
                  </div>
                  <div>
                    <span style={{ color: '#999' }}>主要问题：</span>
                    <div style={{ marginTop: 4 }}>
                      <Space size={[0, 4]} wrap>
                        {userProfile.mainProblems.map(problem => (
                          <Tag key={problem} color="orange">{problem}</Tag>
                        ))}
                      </Space>
                    </div>
                  </div>
                </div>

                <Divider />

                {userProfile.recentPush && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                      <MessageOutlined style={{ marginRight: 4 }} />
                      最近推送
                    </div>
                    <div style={{ padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                        {userProfile.recentPush.title}
                      </div>
                      <div style={{ fontSize: 11, color: '#999' }}>
                        {userProfile.recentPush.time}
                      </div>
                    </div>
                  </div>
                )}

                {userProfile.recentReport && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                      <FileTextOutlined style={{ marginRight: 4 }} />
                      最近测肤报告
                    </div>
                    <div style={{ padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                        {userProfile.recentReport.title}
                      </div>
                      <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>
                        {userProfile.recentReport.time}
                      </div>
                      <div>
                        <span style={{ fontSize: 12, color: '#999' }}>评分：</span>
                        <Tag color={userProfile.recentReport.score >= 80 ? 'success' : 'warning'}>
                          {userProfile.recentReport.score}分
                        </Tag>
                      </div>
                      <Button
                        type="link"
                        size="small"
                        style={{ padding: 0, marginTop: 4 }}
                        onClick={() => {
                          window.open(`/customer/report/detail/${userProfile.recentReport!.id}`, '_blank')
                        }}
                      >
                        查看详情
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Empty description="请选择会话查看用户信息" />
            )}
          </Card>
        </Col>
      </Row>

      {/* 转人工模态框 */}
      <Modal
        title="转人工客服"
        open={transferModalVisible}
        onCancel={() => {
          setTransferModalVisible(false)
          transferForm.resetFields()
        }}
        onOk={() => transferForm.submit()}
      >
        <Form
          form={transferForm}
          onFinish={handleTransferSubmit}
          layout="vertical"
        >
          <Form.Item
            name="reason"
            label="转接原因"
            rules={[{ required: true, message: '请输入转接原因' }]}
          >
            <TextArea rows={4} placeholder="请说明转接原因" />
          </Form.Item>
          <Form.Item
            name="priority"
            label="优先级"
            initialValue="normal"
          >
            <Select>
              <Option value="low">低</Option>
              <Option value="normal">中</Option>
              <Option value="high">高</Option>
              <Option value="urgent">紧急</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 创建工单模态框 */}
      <Modal
        title="创建跟进工单"
        open={ticketModalVisible}
        onCancel={() => {
          setTicketModalVisible(false)
          ticketForm.resetFields()
        }}
        onOk={() => ticketForm.submit()}
      >
        <Form
          form={ticketForm}
          onFinish={handleTicketSubmit}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="工单标题"
            rules={[{ required: true, message: '请输入工单标题' }]}
          >
            <Input placeholder="请输入工单标题" />
          </Form.Item>
          <Form.Item
            name="type"
            label="工单类型"
            rules={[{ required: true, message: '请选择工单类型' }]}
          >
            <Select placeholder="请选择工单类型">
              <Option value="运营">运营</Option>
              <Option value="医生">医生</Option>
              <Option value="技术">技术</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="工单描述"
            rules={[{ required: true, message: '请输入工单描述' }]}
          >
            <TextArea rows={4} placeholder="请详细描述需要跟进的事项" />
          </Form.Item>
          <Form.Item
            name="priority"
            label="优先级"
            initialValue="normal"
          >
            <Select>
              <Option value="low">低</Option>
              <Option value="normal">中</Option>
              <Option value="high">高</Option>
              <Option value="urgent">紧急</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 标记模态框 */}
      <Modal
        title="标记会话"
        open={markModalVisible}
        onCancel={() => {
          setMarkModalVisible(false)
          markForm.resetFields()
        }}
        onOk={() => markForm.submit()}
      >
        <Form
          form={markForm}
          onFinish={handleMarkSubmit}
          layout="vertical"
        >
          <Form.Item
            name="markType"
            label="问题类型"
            rules={[{ required: true, message: '请选择问题类型' }]}
          >
            <Select placeholder="请选择问题类型">
              <Option value="投诉">投诉</Option>
              <Option value="产品咨询">产品咨询</Option>
              <Option value="异常">异常</Option>
              <Option value="高风险">高风险</Option>
              <Option value="质检不通过">质检不通过</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="tags"
            label="添加标签"
          >
            <Select mode="tags" placeholder="输入标签后按回车添加">
              <Option value="投诉">投诉</Option>
              <Option value="产品咨询">产品咨询</Option>
              <Option value="异常">异常</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="notes"
            label="备注"
          >
            <TextArea rows={3} placeholder="可添加备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ConversationCenter

