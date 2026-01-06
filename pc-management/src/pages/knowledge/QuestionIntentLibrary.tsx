import React, { useEffect, useState } from 'react'
import {
  Card,
  Table,
  Space,
  Input,
  Select,
  Tag,
  Tooltip,
  Badge,
  Row,
  Col,
  Typography
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Paragraph, Text } = Typography
const { Option } = Select

// 问题意图状态
type IntentStatus = 'enabled' | 'disabled'

// 问题类型
type IntentCategory =
  | 'all'
  | 'treatment'
  | 'product'
  | 'price'
  | 'complaint'
  | 'guide'
  | 'usage'

// 问题意图数据结构
interface QuestionIntent {
  id: string
  name: string // 意图名称，如“根治询问”
  category: IntentCategory // 业务分类
  categoryLabel: string // 分类展示文案
  coreQuestionType: string // 核心问题类型，如“治疗效果”“产品咨询”
  tags: string[] // 关键词/标签
  exampleQuestions: string[] // 示例问法
  mappedScriptCount: number // 关联话术数
  mappedQACount: number // 关联问答语料数
  priority: number // 优先级
  status: IntentStatus // 是否启用
  createdAt: string
  updatedAt: string
}

const QuestionIntentLibrary: React.FC = () => {
  const [allIntents, setAllIntents] = useState<QuestionIntent[]>([])
  const [dataSource, setDataSource] = useState<QuestionIntent[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<IntentCategory>('all')

  // Mock 数据：问题意图列表
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockIntents: QuestionIntent[] = [
        {
          id: 'intent1',
          name: '根治询问',
          category: 'treatment',
          categoryLabel: '治疗效果',
          coreQuestionType: '能不能根治 / 会不会复发',
          tags: ['根治', '彻底', '复发', '治好'],
          exampleQuestions: ['这个能根治吗？', '会不会复发？', '效果能保持多久？'],
          mappedScriptCount: 3,
          mappedQACount: 8,
          priority: 10,
          status: 'enabled',
          createdAt: '2025-01-01 10:00:00',
          updatedAt: '2025-01-10 15:30:00'
        },
        {
          id: 'intent2',
          name: '产品安全与过敏',
          category: 'product',
          categoryLabel: '产品咨询',
          coreQuestionType: '是否安全 / 会不会过敏',
          tags: ['安全', '过敏', '副作用', '敏感肌'],
          exampleQuestions: ['这个产品安全吗？', '敏感肌可以用吗？', '会不会过敏？'],
          mappedScriptCount: 4,
          mappedQACount: 12,
          priority: 9,
          status: 'enabled',
          createdAt: '2025-01-02 09:00:00',
          updatedAt: '2025-01-09 11:20:00'
        },
        {
          id: 'intent3',
          name: '使用方法与步骤',
          category: 'usage',
          categoryLabel: '使用指导',
          coreQuestionType: '怎么用 / 先后顺序',
          tags: ['使用方法', '步骤', '搭配', '使用频次'],
          exampleQuestions: ['这个怎么用？', '一天用几次？', '能和其他产品一起用吗？'],
          mappedScriptCount: 5,
          mappedQACount: 15,
          priority: 8,
          status: 'enabled',
          createdAt: '2025-01-03 14:00:00',
          updatedAt: '2025-01-08 16:00:00'
        },
        {
          id: 'intent4',
          name: '价格与优惠',
          category: 'price',
          categoryLabel: '价格咨询',
          coreQuestionType: '多少钱 / 有没有优惠',
          tags: ['价格', '多少钱', '优惠', '折扣'],
          exampleQuestions: ['这个多少钱？', '有没有优惠活动？', '会员价是多少？'],
          mappedScriptCount: 2,
          mappedQACount: 6,
          priority: 7,
          status: 'enabled',
          createdAt: '2025-01-04 10:00:00',
          updatedAt: '2025-01-07 14:00:00'
        },
        {
          id: 'intent5',
          name: '过敏与不良反应投诉',
          category: 'complaint',
          categoryLabel: '投诉处理',
          coreQuestionType: '使用后不适 / 过敏红肿',
          tags: ['过敏', '红肿', '刺痛', '不适'],
          exampleQuestions: ['用了之后过敏了怎么办？', '皮肤红肿很严重', '用了刺痛是正常的吗？'],
          mappedScriptCount: 3,
          mappedQACount: 9,
          priority: 9,
          status: 'enabled',
          createdAt: '2025-01-05 11:00:00',
          updatedAt: '2025-01-06 18:20:00'
        },
        {
          id: 'intent6',
          name: '服务引导与欢迎语',
          category: 'guide',
          categoryLabel: '服务引导',
          coreQuestionType: '欢迎 / 检测引导 / 开场白',
          tags: ['欢迎语', '皮肤检测', '服务介绍'],
          exampleQuestions: ['您好，欢迎咨询', '先帮您做一个皮肤检测好吗？'],
          mappedScriptCount: 4,
          mappedQACount: 10,
          priority: 6,
          status: 'enabled',
          createdAt: '2025-01-06 09:30:00',
          updatedAt: '2025-01-06 09:30:00'
        },
        {
          id: 'intent7',
          name: '老客复购与关怀',
          category: 'product',
          categoryLabel: '产品咨询',
          coreQuestionType: '复购关怀 / 使用反馈',
          tags: ['回访', '复购', '使用反馈'],
          exampleQuestions: ['上次买的产品用得怎么样？', '需要给您复购一套吗？'],
          mappedScriptCount: 3,
          mappedQACount: 5,
          priority: 5,
          status: 'disabled',
          createdAt: '2025-01-07 13:15:00',
          updatedAt: '2025-01-09 10:05:00'
        }
      ]

      setAllIntents(mockIntents)
      setDataSource(mockIntents)
      setLoading(false)
    }, 400)
  }, [])

  // 根据筛选和搜索过滤数据
  useEffect(() => {
    let list = [...allIntents]

    if (selectedCategory !== 'all') {
      list = list.filter(item => item.category === selectedCategory)
    }

    if (searchText.trim()) {
      const keyword = searchText.trim()
      list = list.filter(
        item =>
          item.name.includes(keyword) ||
          item.coreQuestionType.includes(keyword) ||
          item.tags.some(tag => tag.includes(keyword)) ||
          item.exampleQuestions.some(q => q.includes(keyword))
      )
    }

    setDataSource(list)
  }, [allIntents, selectedCategory, searchText])

  const columns: ColumnsType<QuestionIntent> = [
    {
      title: '意图名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (text: string, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.coreQuestionType}
          </Text>
        </Space>
      )
    },
    {
      title: '业务分类',
      dataIndex: 'categoryLabel',
      key: 'categoryLabel',
      width: 120,
      render: (_, record) => {
        const colorMap: Record<IntentCategory, string> = {
          all: 'default',
          treatment: 'blue',
          product: 'green',
          price: 'orange',
          complaint: 'red',
          guide: 'purple',
          usage: 'cyan'
        }
        return <Tag color={colorMap[record.category]}>{record.categoryLabel}</Tag>
      }
    },
    {
      title: '关键词 / 标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 260,
      render: (tags: string[]) => (
        <Space size={[4, 4]} wrap>
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '示例问法',
      dataIndex: 'exampleQuestions',
      key: 'exampleQuestions',
      width: 280,
      ellipsis: true,
      render: (examples: string[]) => {
        const fullText = examples.join('；')
        const shortText = examples.slice(0, 2).join('；') + (examples.length > 2 ? '...' : '')
        return (
          <Tooltip title={fullText}>
            <span>{shortText}</span>
          </Tooltip>
        )
      }
    },
    {
      title: '关联资源',
      key: 'resources',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Badge status="processing" />
          <Text type="secondary">
            话术 {record.mappedScriptCount} 条 / 问答 {record.mappedQACount} 条
          </Text>
        </Space>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 90,
      sorter: (a, b) => b.priority - a.priority
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: IntentStatus) =>
        status === 'enabled' ? (
          <Tag color="success">已启用</Tag>
        ) : (
          <Tag color="default">已停用</Tag>
        )
    },
    {
      title: '最近更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180
    }
  ]

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ marginBottom: 4 }}>
            问题意图库
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            统一管理客户常见问题的“意图”标签，用于驱动智能问答、话术推荐和意图路由。
          </Paragraph>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Input
            allowClear
            placeholder="搜索意图名称 / 关键词 / 示例问法"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <Space>
            <Text type="secondary">业务分类：</Text>
            <Select<IntentCategory>
              value={selectedCategory}
              style={{ width: 180 }}
              onChange={value => setSelectedCategory(value)}
            >
              <Option value="all">全部</Option>
              <Option value="treatment">治疗效果</Option>
              <Option value="product">产品咨询</Option>
              <Option value="price">价格咨询</Option>
              <Option value="complaint">投诉处理</Option>
              <Option value="guide">服务引导</Option>
              <Option value="usage">使用指导</Option>
            </Select>
          </Space>
        </Col>
      </Row>

      <Table<QuestionIntent>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize: 10,
          showSizeChanger: false
        }}
        scroll={{ x: 1100 }}
      />
    </Card>
  )
}

export default QuestionIntentLibrary
