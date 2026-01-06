import React, { useState, useEffect } from 'react'
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
  Upload,
  Image,
  Tabs,
  InputNumber,
  Switch,
  Radio
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  PictureOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile } from 'antd/es/upload/interface'

const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs

// 内容类型
type ContentType = '资讯' | '建议' | '产品'

// 内容状态
type ContentStatus = 'enabled' | 'disabled'

// 护理时段
type CarePeriod = 'morning' | 'evening' | 'weekly'

// 推送内容接口
interface PushContent {
  id: string
  type: ContentType
  name: string
  status: ContentStatus
  createdAt: string
  updatedAt: string
  // 资讯内容特有字段
  title?: string
  coverImage?: string
  content?: string
  tags?: string[] // 问题/肤质标签
  // 建议内容特有字段
  carePlan?: {
    morning?: string // 早间护理方案
    evening?: string // 晚间护理方案
    weekly?: string // 每周护理方案
  }
  targetAudience?: {
    skinTypes?: string[] // 适用肤质
    problemTags?: string[] // 适用问题标签
  }
  // 产品内容特有字段
  productIds?: string[] // 商品ID列表（SKU或套餐）
  productProblemTags?: { [key: string]: string[] } // 商品与问题标签的关联 {productId: [tags]}
}

const PushContentManage: React.FC = () => {
  const [contents, setContents] = useState<PushContent[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState<ContentType>('资讯')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingContent, setEditingContent] = useState<PushContent | null>(null)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // Mock数据
  useEffect(() => {
    setLoading(true)
    // 模拟API调用
    setTimeout(() => {
      setContents([
        {
          id: '1',
          type: '资讯',
          name: '春季护肤攻略',
          status: 'enabled',
          title: '春季护肤攻略：如何应对换季敏感问题',
          coverImage: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=300&fit=crop',
          content: '春季是皮肤最容易出现敏感问题的季节...',
          tags: ['敏感', '换季', '干性'],
          createdAt: '2025-01-01 10:00:00',
          updatedAt: '2025-01-10 15:30:00'
        },
        {
          id: '2',
          type: '资讯',
          name: '抗衰老新趋势',
          status: 'enabled',
          title: '抗衰老新趋势：早C晚A护肤法详解',
          coverImage: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=300&fit=crop',
          content: '早C晚A是近年来非常流行的护肤方法...',
          tags: ['抗衰老', '油性', '混合性'],
          createdAt: '2025-01-02 09:00:00',
          updatedAt: '2025-01-08 11:20:00'
        },
        {
          id: '3',
          type: '建议',
          name: '痘痘肌护理方案',
          status: 'enabled',
          carePlan: {
            morning: '洁面 → 控油爽肤水 → 祛痘精华 → 防晒',
            evening: '卸妆 → 洁面 → 控油爽肤水 → 祛痘精华 → 保湿乳液',
            weekly: '每周使用1-2次清洁面膜，避免过度清洁'
          },
          targetAudience: {
            skinTypes: ['油性', '混合性'],
            problemTags: ['痘痘', '毛孔']
          },
          createdAt: '2025-01-03 14:00:00',
          updatedAt: '2025-01-05 16:00:00'
        },
        {
          id: '4',
          type: '建议',
          name: '敏感肌修护方案',
          status: 'enabled',
          carePlan: {
            morning: '温和洁面 → 舒缓爽肤水 → 修护精华 → 物理防晒',
            evening: '温和卸妆 → 温和洁面 → 舒缓爽肤水 → 修护精华 → 修护面霜',
            weekly: '每周使用1次温和修护面膜，避免使用去角质产品'
          },
          targetAudience: {
            skinTypes: ['敏感性'],
            problemTags: ['敏感', '红血丝']
          },
          createdAt: '2025-01-04 10:00:00',
          updatedAt: '2025-01-06 14:00:00'
        },
        {
          id: '5',
          type: '产品',
          name: '控油祛痘产品组',
          status: 'enabled',
          productIds: ['product1', 'product2', 'product3'],
          productProblemTags: {
            product1: ['痘痘', '出油'],
            product2: ['痘痘', '毛孔'],
            product3: ['出油', '暗沉']
          },
          createdAt: '2025-01-05 11:00:00',
          updatedAt: '2025-01-07 15:00:00'
        },
        {
          id: '6',
          type: '产品',
          name: '美白淡斑套餐',
          status: 'disabled',
          productIds: ['product4', 'product5'],
          productProblemTags: {
            product4: ['色斑', '暗沉'],
            product5: ['暗沉', '肤色不均']
          },
          createdAt: '2025-01-06 09:00:00',
          updatedAt: '2025-01-08 10:00:00'
        }
      ])
      setLoading(false)
    }, 500)
  }, [])

  // 表格列定义
  const getColumns = (): ColumnsType<PushContent> => {
    const baseColumns: ColumnsType<PushContent> = [
      {
        title: '内容名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        ellipsis: true
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 100,
        render: (type: ContentType) => {
          const colorMap = {
            '资讯': 'blue',
            '建议': 'green',
            '产品': 'orange'
          }
          return <Tag color={colorMap[type]}>{type}</Tag>
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status: ContentStatus, record: PushContent) => (
          <Switch
            checked={status === 'enabled'}
            onChange={(checked) => handleStatusChange(record.id, checked)}
            checkedChildren="启用"
            unCheckedChildren="停用"
          />
        )
      },
      {
        title: '操作',
        key: 'action',
        width: 200,
        fixed: 'right',
        render: (_, record: PushContent) => (
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
              title="确定要删除这条内容吗？"
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

    // 根据类型添加特定列
    if (activeTab === '资讯') {
      return [
        ...baseColumns,
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
          width: 250,
          ellipsis: true
        },
        {
          title: '封面图',
          dataIndex: 'coverImage',
          key: 'coverImage',
          width: 120,
          render: (url: string) => url ? (
            <Image
              src={url}
              alt="封面"
              width={80}
              height={60}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview={false}
            />
          ) : '-'
        },
        {
          title: '标签',
          dataIndex: 'tags',
          key: 'tags',
          width: 200,
          render: (tags: string[]) => tags && tags.length > 0 ? (
            <Space size={[0, 8]} wrap>
              {tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
          ) : '-'
        }
      ]
    } else if (activeTab === '建议') {
      return [
        ...baseColumns,
        {
          title: '适用肤质',
          key: 'skinTypes',
          width: 150,
          render: (_, record: PushContent) => {
            const skinTypes = record.targetAudience?.skinTypes || []
            return skinTypes.length > 0 ? (
              <Space size={[0, 8]} wrap>
                {skinTypes.map(type => (
                  <Tag key={type}>{type}</Tag>
                ))}
              </Space>
            ) : '-'
          }
        },
        {
          title: '适用问题',
          key: 'problemTags',
          width: 150,
          render: (_, record: PushContent) => {
            const problemTags = record.targetAudience?.problemTags || []
            return problemTags.length > 0 ? (
              <Space size={[0, 8]} wrap>
                {problemTags.map(tag => (
                  <Tag key={tag} color="orange">{tag}</Tag>
                ))}
              </Space>
            ) : '-'
          }
        },
        {
          title: '护理方案',
          key: 'carePlan',
          width: 300,
          ellipsis: true,
          render: (_, record: PushContent) => {
            const plan = record.carePlan
            if (!plan) return '-'
            const parts: string[] = []
            if (plan.morning) parts.push('早：' + plan.morning.substring(0, 20) + '...')
            if (plan.evening) parts.push('晚：' + plan.evening.substring(0, 20) + '...')
            if (plan.weekly) parts.push('周：' + plan.weekly.substring(0, 20) + '...')
            return parts.join('；') || '-'
          }
        }
      ]
    } else {
      return [
        ...baseColumns,
        {
          title: '商品数量',
          key: 'productCount',
          width: 100,
          render: (_, record: PushContent) => {
            const count = record.productIds?.length || 0
            return <span>{count} 个</span>
          }
        },
        {
          title: '关联问题标签',
          key: 'problemTags',
          width: 250,
          ellipsis: true,
          render: (_, record: PushContent) => {
            const tags = record.productProblemTags
            if (!tags) return '-'
            const allTags = new Set<string>()
            Object.values(tags).forEach(tagList => {
              tagList.forEach(tag => allTags.add(tag))
            })
            return Array.from(allTags).length > 0 ? (
              <Space size={[0, 8]} wrap>
                {Array.from(allTags).map(tag => (
                  <Tag key={tag} color="purple">{tag}</Tag>
                ))}
              </Space>
            ) : '-'
          }
        }
      ]
    }
  }

  // 过滤后的数据
  const filteredContents = contents.filter(content =>
    content.type === activeTab &&
    (content.name.toLowerCase().includes(searchText.toLowerCase()) ||
     (content.type === '资讯' && content.title?.toLowerCase().includes(searchText.toLowerCase())))
  )

  // 处理状态切换
  const handleStatusChange = (id: string, enabled: boolean) => {
    setContents(contents.map(content =>
      content.id === id ? { ...content, status: enabled ? 'enabled' : 'disabled' } : content
    ))
    message.success(enabled ? '内容已启用' : '内容已停用')
  }

  // 处理新建
  const handleCreate = () => {
    setEditingContent(null)
    form.resetFields()
    setFileList([])
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (content: PushContent) => {
    setEditingContent(content)
    
    // 设置表单初始值
    const formValues: any = {
      type: content.type,
      name: content.name,
      status: content.status === 'enabled'
    }

    if (content.type === '资讯') {
      formValues.title = content.title
      formValues.content = content.content
      formValues.tags = content.tags
      if (content.coverImage) {
        setFileList([{
          uid: '-1',
          name: 'cover.jpg',
          status: 'done',
          url: content.coverImage
        }])
      }
    } else if (content.type === '建议') {
      formValues.morning = content.carePlan?.morning
      formValues.evening = content.carePlan?.evening
      formValues.weekly = content.carePlan?.weekly
      formValues.skinTypes = content.targetAudience?.skinTypes
      formValues.problemTags = content.targetAudience?.problemTags
    } else if (content.type === '产品') {
      formValues.productIds = content.productIds
      // 处理商品与问题标签的关联
      const productTags: { productId: string; tags: string[] }[] = []
      if (content.productProblemTags) {
        Object.entries(content.productProblemTags).forEach(([productId, tags]) => {
          productTags.push({ productId, tags })
        })
      }
      formValues.productTags = productTags
    }

    form.setFieldsValue(formValues)
    setModalVisible(true)
  }

  // 处理查看
  const handleView = (content: PushContent) => {
    handleEdit(content)
    // 可以设置表单为只读模式
  }

  // 处理删除
  const handleDelete = (id: string) => {
    setContents(contents.filter(content => content.id !== id))
    message.success('删除成功')
  }

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      
      let contentData: PushContent

      if (values.type === '资讯') {
        contentData = {
          id: editingContent?.id || `content_${Date.now()}`,
          type: '资讯',
          name: values.name,
          status: values.status ? 'enabled' : 'disabled',
          title: values.title,
          content: values.content,
          tags: values.tags,
          coverImage: fileList.length > 0 && fileList[0].url ? fileList[0].url : fileList[0]?.response?.url,
          createdAt: editingContent?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      } else if (values.type === '建议') {
        contentData = {
          id: editingContent?.id || `content_${Date.now()}`,
          type: '建议',
          name: values.name,
          status: values.status ? 'enabled' : 'disabled',
          carePlan: {
            morning: values.morning,
            evening: values.evening,
            weekly: values.weekly
          },
          targetAudience: {
            skinTypes: values.skinTypes,
            problemTags: values.problemTags
          },
          createdAt: editingContent?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      } else {
        // 处理产品内容
        const productProblemTags: { [key: string]: string[] } = {}
        if (values.productTags && Array.isArray(values.productTags)) {
          values.productTags.forEach((item: { productId: string; tags: string[] }) => {
            if (item.productId && item.tags && item.tags.length > 0) {
              productProblemTags[item.productId] = item.tags
            }
          })
        }
        contentData = {
          id: editingContent?.id || `content_${Date.now()}`,
          type: '产品',
          name: values.name,
          status: values.status ? 'enabled' : 'disabled',
          productIds: values.productIds || [],
          productProblemTags: Object.keys(productProblemTags).length > 0 ? productProblemTags : undefined,
          createdAt: editingContent?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }

      if (editingContent) {
        setContents(contents.map(content => content.id === editingContent.id ? contentData : content))
        message.success('更新成功')
      } else {
        setContents([...contents, contentData])
        message.success('创建成功')
      }

      setModalVisible(false)
      form.resetFields()
      setFileList([])
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 图片上传配置
  const uploadProps = {
    listType: 'picture-card' as const,
    fileList,
    onChange: ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
      setFileList(newFileList)
    },
    beforeUpload: () => {
      return false // 阻止自动上传，实际项目中需要实现上传逻辑
    },
    maxCount: 1,
    accept: 'image/*'
  }

  // 渲染表单内容（根据类型）
  const renderFormContent = () => {
    const contentType = form.getFieldValue('type') || activeTab

    if (contentType === '资讯') {
      return (
        <>
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入资讯标题" />
          </Form.Item>

          <Form.Item
            label="封面图"
            name="coverImage"
            extra="建议尺寸：750x500px，支持 JPG、PNG 格式"
          >
            <Upload {...uploadProps}>
              {fileList.length < 1 && (
                <div>
                  <PictureOutlined />
                  <div style={{ marginTop: 8 }}>上传封面</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="正文"
            name="content"
            rules={[{ required: true, message: '请输入正文内容' }]}
          >
            <TextArea
              rows={6}
              placeholder="请输入资讯正文内容"
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Form.Item
            label="标签"
            name="tags"
            tooltip="选择针对的问题或肤质标签，用于内容分类和匹配"
          >
            <Select
              mode="multiple"
              placeholder="请选择标签"
              allowClear
            >
              <Option value="痘痘">痘痘</Option>
              <Option value="色斑">色斑</Option>
              <Option value="暗沉">暗沉</Option>
              <Option value="毛孔">毛孔</Option>
              <Option value="敏感">敏感</Option>
              <Option value="红血丝">红血丝</Option>
              <Option value="干燥">干燥</Option>
              <Option value="油性">油性</Option>
              <Option value="干性">干性</Option>
              <Option value="混合性">混合性</Option>
              <Option value="敏感性">敏感性</Option>
              <Option value="中性">中性</Option>
              <Option value="换季">换季</Option>
              <Option value="抗衰老">抗衰老</Option>
            </Select>
          </Form.Item>
        </>
      )
    } else if (contentType === '建议') {
      return (
        <>
          <Divider orientation="left">护理方案</Divider>
          
          <Form.Item
            label="早间护理方案"
            name="morning"
            rules={[{ required: true, message: '请输入早间护理方案' }]}
            tooltip="描述用户早上应该进行的护肤步骤"
          >
            <TextArea
              rows={3}
              placeholder="例如：洁面 → 爽肤水 → 精华 → 乳液 → 防晒"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            label="晚间护理方案"
            name="evening"
            rules={[{ required: true, message: '请输入晚间护理方案' }]}
            tooltip="描述用户晚上应该进行的护肤步骤"
          >
            <TextArea
              rows={3}
              placeholder="例如：卸妆 → 洁面 → 爽肤水 → 精华 → 面霜"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            label="每周护理方案"
            name="weekly"
            tooltip="描述用户每周应该进行的特殊护理"
          >
            <TextArea
              rows={3}
              placeholder="例如：每周使用1-2次面膜，每周去角质1次"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Divider orientation="left">适用人群条件</Divider>

          <Form.Item
            label="适用肤质"
            name="skinTypes"
            tooltip="选择此护理方案适用的肤质类型"
          >
            <Select
              mode="multiple"
              placeholder="请选择适用肤质"
              allowClear
            >
              <Option value="油性">油性</Option>
              <Option value="干性">干性</Option>
              <Option value="混合性">混合性</Option>
              <Option value="敏感性">敏感性</Option>
              <Option value="中性">中性</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="适用问题标签"
            name="problemTags"
            tooltip="选择此护理方案针对的皮肤问题"
          >
            <Select
              mode="multiple"
              placeholder="请选择适用问题标签"
              allowClear
            >
              <Option value="痘痘">痘痘</Option>
              <Option value="色斑">色斑</Option>
              <Option value="暗沉">暗沉</Option>
              <Option value="毛孔">毛孔</Option>
              <Option value="敏感">敏感</Option>
              <Option value="红血丝">红血丝</Option>
              <Option value="黑眼圈">黑眼圈</Option>
              <Option value="干燥">干燥</Option>
            </Select>
          </Form.Item>
        </>
      )
    } else {
      return (
        <>
          <Form.Item
            label="选择商品"
            name="productIds"
            rules={[{ required: true, message: '请至少选择一个商品' }]}
            tooltip="从商品库中选择 SKU 或套餐"
          >
            <Select
              mode="multiple"
              placeholder="请选择商品（SKU/套餐）"
              style={{ width: '100%' }}
            >
              <Option value="product1">控油洁面乳 - SKU001</Option>
              <Option value="product2">祛痘精华 - SKU002</Option>
              <Option value="product3">控油爽肤水 - SKU003</Option>
              <Option value="product4">美白精华 - SKU004</Option>
              <Option value="product5">淡斑精华 - SKU005</Option>
              <Option value="product6">敏感肌修护套装 - 套餐001</Option>
              <Option value="product7">控油祛痘套装 - 套餐002</Option>
              <Option value="product8">美白淡斑套装 - 套餐003</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="商品与问题标签关联"
            name="productTags"
            tooltip="为每个商品关联对应的问题标签，用于精准推送"
          >
            <Form.List name="productTags">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16} style={{ marginBottom: 16 }}>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          name={[name, 'productId']}
                          rules={[{ required: true, message: '请选择商品' }]}
                        >
                          <Select placeholder="选择商品">
                            {form.getFieldValue('productIds')?.map((pid: string) => (
                              <Option key={pid} value={pid}>
                                {pid === 'product1' ? '控油洁面乳' :
                                 pid === 'product2' ? '祛痘精华' :
                                 pid === 'product3' ? '控油爽肤水' :
                                 pid === 'product4' ? '美白精华' :
                                 pid === 'product5' ? '淡斑精华' :
                                 pid === 'product6' ? '敏感肌修护套装' :
                                 pid === 'product7' ? '控油祛痘套装' :
                                 pid === 'product8' ? '美白淡斑套装' : pid}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'tags']}
                          rules={[{ required: true, message: '请选择问题标签' }]}
                        >
                          <Select
                            mode="multiple"
                            placeholder="选择问题标签"
                            allowClear
                          >
                            <Option value="痘痘">痘痘</Option>
                            <Option value="色斑">色斑</Option>
                            <Option value="暗沉">暗沉</Option>
                            <Option value="毛孔">毛孔</Option>
                            <Option value="敏感">敏感</Option>
                            <Option value="红血丝">红血丝</Option>
                            <Option value="出油">出油</Option>
                            <Option value="肤色不均">肤色不均</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button
                          type="link"
                          danger
                          onClick={() => remove(name)}
                        >
                          删除
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      添加商品标签关联
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        </>
      )
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder="搜索内容名称"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建内容
          </Button>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key as ContentType)
            setSearchText('')
          }}
        >
          <TabPane tab="资讯" key="资讯" />
          <TabPane tab="建议" key="建议" />
          <TabPane tab="产品" key="产品" />
        </Tabs>

        <Table
          columns={getColumns()}
          dataSource={filteredContents}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条内容`
          }}
        />
      </Card>

      {/* 内容编辑弹窗 */}
      <Modal
        title={editingContent ? '编辑推送内容' : '新建推送内容'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
          setFileList([])
        }}
        onOk={handleSave}
        width={800}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: activeTab,
            status: true
          }}
        >
          <Form.Item
            label="内容类型"
            name="type"
            rules={[{ required: true, message: '请选择内容类型' }]}
          >
            <Radio.Group>
              <Radio value="资讯">资讯</Radio>
              <Radio value="建议">建议</Radio>
              <Radio value="产品">产品</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="内容名称"
            name="name"
            rules={[{ required: true, message: '请输入内容名称' }]}
          >
            <Input placeholder="请输入内容名称" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="停用" />
          </Form.Item>

          <Divider />

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.type !== currentValues.type
            }
          >
            {() => renderFormContent()}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PushContentManage
