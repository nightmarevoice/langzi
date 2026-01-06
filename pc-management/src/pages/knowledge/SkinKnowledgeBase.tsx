import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Input, 
  Tree,
  Modal,
  Form,
  Input as AntInput,
  message,
  Tag,
  Badge,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  Select
} from 'antd'
import { 
  PlusOutlined, 
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { DataNode } from 'antd/es/tree'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'

interface KnowledgeItem {
  id: string
  title: string
  category: string
  categoryPath: string[]
  questionTags: string[]
  standardAnswer: string
  precautions: string
  contraindications: string
  lastUpdatedBy: string
  lastUpdatedAt: string
  hitCount: number
  vectorSynced: boolean
  vectorSyncTime?: string
}

// 分类树数据
const categoryTreeData: DataNode[] = [
  {
    title: '痤疮',
    key: 'acne',
    children: [
      { title: '轻度痤疮', key: 'acne-mild' },
      { title: '中度痤疮', key: 'acne-moderate' },
      { title: '重度痤疮', key: 'acne-severe' },
      { title: '闭口粉刺', key: 'acne-closed-comedones' },
      { title: '黑头粉刺', key: 'acne-blackheads' },
    ]
  },
  {
    title: '色斑',
    key: 'pigmentation',
    children: [
      { title: '雀斑', key: 'pigmentation-freckles' },
      { title: '黄褐斑', key: 'pigmentation-melasma' },
      { title: '晒斑', key: 'pigmentation-sunspots' },
      { title: '老年斑', key: 'pigmentation-age-spots' },
    ]
  },
  {
    title: '抗衰',
    key: 'anti-aging',
    children: [
      { title: '细纹', key: 'anti-aging-fine-lines' },
      { title: '皱纹', key: 'anti-aging-wrinkles' },
      { title: '松弛', key: 'anti-aging-sagging' },
      { title: '法令纹', key: 'anti-aging-nasolabial' },
    ]
  },
  {
    title: '敏感',
    key: 'sensitive',
    children: [
      { title: '敏感肌', key: 'sensitive-skin' },
      { title: '红血丝', key: 'sensitive-redness' },
      { title: '泛红', key: 'sensitive-flushing' },
      { title: '刺痛', key: 'sensitive-stinging' },
    ]
  },
  {
    title: '清洁',
    key: 'cleansing',
    children: [
      { title: '洁面', key: 'cleansing-face-wash' },
      { title: '去角质', key: 'cleansing-exfoliation' },
      { title: '深层清洁', key: 'cleansing-deep' },
    ]
  },
  {
    title: '防晒',
    key: 'sunscreen',
    children: [
      { title: '日常防晒', key: 'sunscreen-daily' },
      { title: '户外防晒', key: 'sunscreen-outdoor' },
      { title: '敏感肌防晒', key: 'sunscreen-sensitive' },
    ]
  },
]

// 获取分类路径
const getCategoryPath = (key: string): string[] => {
  for (const category of categoryTreeData) {
    if (category.key === key) {
      return [category.title as string]
    }
    if (category.children) {
      for (const child of category.children) {
        if (child.key === key) {
          return [category.title as string, child.title as string]
        }
      }
    }
  }
  return []
}

// 获取分类标题
const getCategoryTitle = (key: string): string => {
  for (const category of categoryTreeData) {
    if (category.key === key) {
      return category.title as string
    }
    if (category.children) {
      for (const child of category.children) {
        if (child.key === key) {
          return child.title as string
        }
      }
    }
  }
  return ''
}

const SkinKnowledgeBase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null)
  const [form] = Form.useForm()

  // 模拟数据
  const mockData: KnowledgeItem[] = [
    {
      id: '1',
      title: '如何治疗轻度痤疮？',
      category: 'acne-mild',
      categoryPath: ['痤疮', '轻度痤疮'],
      questionTags: ['痘痘', '粉刺', '轻度'],
      standardAnswer: '轻度痤疮主要表现为少量粉刺和丘疹。建议使用含有水杨酸或果酸的洁面产品，保持皮肤清洁。可以使用含有维A酸或过氧化苯甲酰的外用药膏。注意饮食清淡，避免高糖高脂食物。',
      precautions: '使用维A酸类产品时，初期可能出现轻微脱皮和干燥，属于正常现象。建议从低浓度开始，逐步建立耐受。使用期间需要严格防晒。',
      contraindications: '孕妇、哺乳期妇女禁用维A酸类产品。对水杨酸过敏者慎用。',
      lastUpdatedBy: '张医生',
      lastUpdatedAt: '2024-01-15 10:30:00',
      hitCount: 156,
      vectorSynced: true,
      vectorSyncTime: '2024-01-15 10:35:00'
    },
    {
      id: '2',
      title: '色斑如何预防和淡化？',
      category: 'pigmentation',
      categoryPath: ['色斑'],
      questionTags: ['色斑', '美白', '淡斑'],
      standardAnswer: '色斑的预防和淡化需要多管齐下：1. 严格防晒，使用SPF30+的防晒霜，每2小时补涂；2. 使用含有烟酰胺、维生素C、熊果苷等美白成分的护肤品；3. 避免过度摩擦和刺激皮肤；4. 保持规律作息，避免熬夜。',
      precautions: '美白产品需要持续使用至少3-6个月才能看到明显效果。使用期间注意保湿，避免皮肤干燥。',
      contraindications: '对烟酰胺不耐受者可能出现泛红、刺痛等反应，建议先做皮肤测试。',
      lastUpdatedBy: '李医生',
      lastUpdatedAt: '2024-01-14 14:20:00',
      hitCount: 203,
      vectorSynced: true,
      vectorSyncTime: '2024-01-14 14:25:00'
    },
    {
      id: '3',
      title: '敏感肌如何选择护肤品？',
      category: 'sensitive-skin',
      categoryPath: ['敏感', '敏感肌'],
      questionTags: ['敏感肌', '护肤品', '选择'],
      standardAnswer: '敏感肌选择护肤品应遵循以下原则：1. 选择成分简单、无香精、无酒精的产品；2. 优先选择专为敏感肌设计的温和配方；3. 使用前先做皮肤测试；4. 避免频繁更换护肤品；5. 选择含有神经酰胺、角鲨烷等修复成分的产品。',
      precautions: '敏感肌护肤要循序渐进，不要急于求成。如果出现不适，立即停用并咨询医生。',
      contraindications: '避免使用含有果酸、水杨酸、维A酸等刺激性成分的产品。避免使用去角质产品。',
      lastUpdatedBy: '王医生',
      lastUpdatedAt: '2024-01-13 09:15:00',
      hitCount: 312,
      vectorSynced: false
    },
  ]

  const [dataSource, setDataSource] = useState<KnowledgeItem[]>(mockData)

  // 问题标签选项
  const questionTagOptions = [
    '痘痘', '粉刺', '轻度', '中度', '重度', '色斑', '美白', '淡斑',
    '敏感肌', '护肤品', '选择', '抗衰', '细纹', '皱纹', '清洁', '防晒',
    '红血丝', '泛红', '刺痛', '洁面', '去角质'
  ]

  // 过滤数据
  useEffect(() => {
    let filtered = [...mockData]
    
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.title.includes(searchText) ||
        item.standardAnswer.includes(searchText) ||
        item.questionTags.some(tag => tag.includes(searchText))
      )
    }
    
    setDataSource(filtered)
  }, [selectedCategory, searchText])

  const handleCategorySelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      setSelectedCategory(selectedKeys[0] as string)
    } else {
      setSelectedCategory('')
    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: KnowledgeItem) => {
    setEditingItem(record)
    form.setFieldsValue({
      title: record.title,
      category: record.category,
      questionTags: record.questionTags,
      standardAnswer: record.standardAnswer,
      precautions: record.precautions,
      contraindications: record.contraindications,
    })
    setModalVisible(true)
  }

  const handleDelete = (record: KnowledgeItem) => {
    setDataSource(dataSource.filter(item => item.id !== record.id))
    message.success('删除成功')
  }

  const handleSyncVector = (record: KnowledgeItem) => {
    setLoading(true)
    // 模拟同步到向量索引
    setTimeout(() => {
      const newData = dataSource.map(item => 
        item.id === record.id 
          ? { 
              ...item, 
              vectorSynced: true, 
              vectorSyncTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
            } 
          : item
      )
      setDataSource(newData)
      setLoading(false)
      message.success('已同步到向量索引')
    }, 1000)
  }

  const handleBatchSync = () => {
    const unsyncedItems = dataSource.filter(item => !item.vectorSynced)
    if (unsyncedItems.length === 0) {
      message.info('所有知识条目已同步')
      return
    }
    
    setLoading(true)
    setTimeout(() => {
      const newData = dataSource.map(item => 
        !item.vectorSynced
          ? { 
              ...item, 
              vectorSynced: true, 
              vectorSyncTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
            } 
          : item
      )
      setDataSource(newData)
      setLoading(false)
      message.success(`已同步 ${unsyncedItems.length} 条知识到向量索引`)
    }, 1500)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
      
      if (editingItem) {
        // 更新
        const newData = dataSource.map(item => 
          item.id === editingItem.id
            ? {
                ...item,
                ...values,
                categoryPath: getCategoryPath(values.category),
                lastUpdatedBy: '当前用户', // 实际应从登录信息获取
                lastUpdatedAt: now,
                vectorSynced: false, // 更新后需要重新同步
                vectorSyncTime: undefined
              }
            : item
        )
        setDataSource(newData)
        message.success('更新成功')
      } else {
        // 新增
        const newItem: KnowledgeItem = {
          id: Date.now().toString(),
          ...values,
          categoryPath: getCategoryPath(values.category),
          lastUpdatedBy: '当前用户',
          lastUpdatedAt: now,
          hitCount: 0,
          vectorSynced: false
        }
        setDataSource([...dataSource, newItem])
        message.success('新增成功')
      }
      
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const handleModalCancel = () => {
    setModalVisible(false)
    form.resetFields()
    setEditingItem(null)
  }

  const columns: ColumnsType<KnowledgeItem> = [
    {
      title: '标题/问题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'categoryPath',
      key: 'category',
      width: 150,
      render: (path: string[]) => (
        <Tag color="blue">{path.join(' / ')}</Tag>
      ),
    },
    {
      title: '适用问题标签',
      dataIndex: 'questionTags',
      key: 'questionTags',
      width: 200,
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags.map(tag => (
            <Tag key={tag} color="cyan">{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '最后更新',
      key: 'lastUpdated',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{record.lastUpdatedBy}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {record.lastUpdatedAt}
          </div>
        </div>
      ),
    },
    {
      title: '命中次数',
      dataIndex: 'hitCount',
      key: 'hitCount',
      width: 100,
      sorter: (a, b) => a.hitCount - b.hitCount,
      render: (count: number) => (
        <Badge count={count} showZero style={{ backgroundColor: '#52c41a' }} />
      ),
    },
    {
      title: '向量状态',
      key: 'vectorStatus',
      width: 120,
      render: (_, record) => (
        <div>
          {record.vectorSynced ? (
            <Tooltip title={`同步时间: ${record.vectorSyncTime}`}>
              <Tag icon={<CheckCircleOutlined />} color="success">
                已同步
              </Tag>
            </Tooltip>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="error">
              未同步
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {!record.vectorSynced && (
            <Button 
              type="link" 
              icon={<SyncOutlined />} 
              onClick={() => handleSyncVector(record)}
              loading={loading}
            >
              同步
            </Button>
          )}
          <Popconfirm
            title="确定要删除这条知识吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const unsyncedCount = dataSource.filter(item => !item.vectorSynced).length

  return (
    <div>
      <Row gutter={16}>
        {/* 左侧分类树 */}
        <Col span={6}>
          <Card 
            title="知识分类" 
            size="small"
            style={{ height: 'calc(100vh - 120px)' }}
            bodyStyle={{ padding: '12px', overflow: 'auto', maxHeight: 'calc(100vh - 180px)' }}
          >
            <Tree
              treeData={categoryTreeData}
              onSelect={handleCategorySelect}
              selectedKeys={selectedCategory ? [selectedCategory] : []}
              defaultExpandAll
              showLine={{ showLeafIcon: false }}
            />
          </Card>
        </Col>

        {/* 右侧内容区 */}
        <Col span={18}>
      <Card>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Input
                  placeholder="搜索知识标题、内容或标签"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
                {selectedCategory && (
                  <Tag 
                    closable 
                    onClose={() => setSelectedCategory('')}
                    color="blue"
                  >
                    {getCategoryTitle(selectedCategory)}
                  </Tag>
                )}
          </Space>
              <Space>
                {unsyncedCount > 0 && (
                  <Button 
                    icon={<ReloadOutlined />}
                    onClick={handleBatchSync}
                    loading={loading}
                  >
                    批量同步 ({unsyncedCount})
                  </Button>
                )}
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增知识
          </Button>
              </Space>
        </div>

            <Table
              columns={columns}
              dataSource={dataSource}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
              scroll={{ x: 1200 }}
            />
      </Card>
        </Col>
      </Row>

      {/* 编辑/新增弹窗 */}
      <Modal
        title={editingItem ? '编辑知识条目' : '新增知识条目'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            questionTags: [],
          }}
        >
          <Form.Item
            name="title"
            label="问题/标题"
            rules={[{ required: true, message: '请输入问题/标题' }]}
          >
            <AntInput placeholder="请输入问题或标题" />
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Tree
              treeData={categoryTreeData}
              onSelect={(selectedKeys) => {
                if (selectedKeys.length > 0) {
                  form.setFieldValue('category', selectedKeys[0])
                }
              }}
              selectedKeys={form.getFieldValue('category') ? [form.getFieldValue('category')] : []}
              defaultExpandAll
              showLine={{ showLeafIcon: false }}
            />
          </Form.Item>

          <Form.Item
            name="questionTags"
            label="适用问题标签"
            rules={[{ required: true, message: '请至少选择一个标签', type: 'array', min: 1 }]}
          >
            <Select
              mode="tags"
              placeholder="输入或选择标签，按回车确认"
              options={questionTagOptions.map(tag => ({ label: tag, value: tag }))}
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Form.Item
            name="standardAnswer"
            label="标准答案"
            rules={[{ required: true, message: '请输入标准答案' }]}
          >
            <TextArea
              rows={6}
              placeholder="请输入标准答案（长文本）"
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Form.Item
            name="precautions"
            label="注意事项"
          >
            <TextArea
              rows={3}
              placeholder="请输入注意事项"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            name="contraindications"
            label="禁忌"
          >
            <TextArea
              rows={3}
              placeholder="请输入禁忌事项"
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SkinKnowledgeBase
