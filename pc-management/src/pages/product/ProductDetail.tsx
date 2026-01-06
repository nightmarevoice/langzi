import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Button, 
  Space, 
  Tag,
  message,
  Row,
  Col,
  Descriptions,
  Image,
  Tabs,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Divider
} from 'antd'
import { 
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LinkOutlined,
  TagOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { productApi, skuApi } from '../../services/api'
import type { Product, SKU, CreateSKURequest, UpdateSKURequest } from '../../types'

const { TextArea } = Input
const { TabPane } = Tabs

const ProductDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [skus, setSkus] = useState<SKU[]>([])
  const [loading, setLoading] = useState(false)
  const [isSKUModalVisible, setIsSKUModalVisible] = useState(false)
  const [editingSKU, setEditingSKU] = useState<SKU | null>(null)
  const [form] = Form.useForm()

  // 获取商品详情
  const fetchProduct = async () => {
    if (!id) return
    setLoading(true)
    try {
      // TODO: 调用真实 API
      // const response = await productApi.getById(id)
      // setProduct(response.data)

      // 模拟数据
      const mockProduct: Product = {
        id: id,
        name: '祛痘精华液',
        brand: '品牌A',
        effectTags: ['祛痘', '控油'],
        skinTypes: ['油性', '混合性'],
        priceRange: { min: 199, max: 299 },
        salesLink: 'https://example.com/product/1',
        status: 'active',
        problemTags: ['痤疮', '控油'],
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      }
      setProduct(mockProduct)
    } catch (error) {
      message.error('获取商品详情失败')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // 获取 SKU 列表
  const fetchSKUs = async () => {
    if (!id) return
    try {
      // TODO: 调用真实 API
      // const response = await productApi.getSKUs(id)
      // setSkus(response.data || [])

      // 模拟数据
      const mockSKUs: SKU[] = [
        {
          id: '1',
          productId: id,
          name: '祛痘精华液 30ml',
          price: 199,
          images: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300'],
          description: '这是一款专为油性和混合性肌肤设计的祛痘精华液。采用温和配方，有效控制油脂分泌，减少痘痘生成。',
          ingredients: '水、甘油、烟酰胺、水杨酸、茶树提取物、透明质酸',
          precautions: '1. 首次使用前请做皮肤测试\n2. 避免接触眼部\n3. 如有不适请立即停用\n4. 建议晚间使用',
          stock: 100,
          status: 'active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        },
        {
          id: '2',
          productId: id,
          name: '祛痘精华液 50ml',
          price: 299,
          images: ['https://via.placeholder.com/300'],
          description: '大容量装，适合长期使用。',
          ingredients: '水、甘油、烟酰胺、水杨酸、茶树提取物、透明质酸',
          precautions: '1. 首次使用前请做皮肤测试\n2. 避免接触眼部\n3. 如有不适请立即停用\n4. 建议晚间使用',
          stock: 50,
          status: 'active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ]
      setSkus(mockSKUs)
    } catch (error) {
      message.error('获取 SKU 列表失败')
      console.error(error)
    }
  }

  useEffect(() => {
    fetchProduct()
    fetchSKUs()
  }, [id])

  const handleAddSKU = () => {
    setEditingSKU(null)
    form.resetFields()
    form.setFieldsValue({ productId: id })
    setIsSKUModalVisible(true)
  }

  const handleEditSKU = (sku: SKU) => {
    setEditingSKU(sku)
    form.setFieldsValue({
      name: sku.name,
      price: sku.price,
      images: sku.images.join('\n'),
      description: sku.description,
      ingredients: sku.ingredients,
      precautions: sku.precautions,
      stock: sku.stock
    })
    setIsSKUModalVisible(true)
  }

  const handleDeleteSKU = async (skuId: string) => {
    try {
      // TODO: 调用真实 API
      // await skuApi.delete(skuId)
      message.success('删除成功')
      fetchSKUs()
    } catch (error) {
      message.error('删除失败')
      console.error(error)
    }
  }

  const handleSKUModalOk = async () => {
    try {
      const values = await form.validateFields()
      const skuData = {
        ...values,
        images: values.images ? values.images.split('\n').filter((url: string) => url.trim()) : []
      }

      if (editingSKU) {
        // 更新 SKU
        // TODO: 调用真实 API
        // await skuApi.update(editingSKU.id, skuData as UpdateSKURequest)
        message.success('更新成功')
      } else {
        // 创建 SKU
        // TODO: 调用真实 API
        // await skuApi.create({ ...skuData, productId: id! } as CreateSKURequest)
        message.success('创建成功')
      }
      setIsSKUModalVisible(false)
      form.resetFields()
      setEditingSKU(null)
      fetchSKUs()
    } catch (error) {
      console.error('表单验证失败', error)
    }
  }

  const handleSKUModalCancel = () => {
    setIsSKUModalVisible(false)
    form.resetFields()
    setEditingSKU(null)
  }

  const skuColumns = [
    {
      title: 'SKU 名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price}`,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SKU) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEditSKU(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个 SKU 吗？"
            onConfirm={() => handleDeleteSKU(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  if (!product) {
    return <div>加载中...</div>
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/product/list')}
          >
            返回列表
          </Button>
        </div>

        <Descriptions title="商品基本信息" bordered column={2}>
          <Descriptions.Item label="商品名称">{product.name}</Descriptions.Item>
          <Descriptions.Item label="品牌">{product.brand}</Descriptions.Item>
          <Descriptions.Item label="功效标签">
            <Space wrap>
              {product.effectTags.map(tag => (
                <Tag key={tag} color="blue">{tag}</Tag>
              ))}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="适用肤质">
            <Space wrap>
              {product.skinTypes.map(type => (
                <Tag key={type} color="green">{type}</Tag>
              ))}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="价格区间">
            ¥{product.priceRange.min} - ¥{product.priceRange.max}
          </Descriptions.Item>
          <Descriptions.Item label="销售链接">
            <a href={product.salesLink} target="_blank" rel="noopener noreferrer">
              <LinkOutlined /> 查看链接
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="关联问题标签">
            <Space wrap>
              {product.problemTags.map(tag => (
                <Tag key={tag} color="orange" icon={<TagOutlined />}>{tag}</Tag>
              ))}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={product.status === 'active' ? 'green' : 'red'}>
              {product.status === 'active' ? '启用' : '禁用'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Tabs defaultActiveKey="skus">
          <TabPane tab="SKU 列表" key="skus">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSKU}>
                新增 SKU
              </Button>
            </div>
            <Table
              columns={skuColumns}
              dataSource={skus}
              rowKey="id"
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* SKU 详情展示 */}
      {skus.length > 0 && (
        <Card title="SKU 详情" style={{ marginTop: 16 }}>
          {skus.map(sku => (
            <Card
              key={sku.id}
              title={sku.name}
              style={{ marginBottom: 16 }}
              extra={
                <Space>
                  <Tag>¥{sku.price}</Tag>
                  <Tag>库存: {sku.stock}</Tag>
                  <Tag color={sku.status === 'active' ? 'green' : 'red'}>
                    {sku.status === 'active' ? '启用' : '禁用'}
                  </Tag>
                </Space>
              }
            >
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <h4>商品图片</h4>
                    <Image.PreviewGroup>
                      {sku.images.map((img, index) => (
                        <Image
                          key={index}
                          width={200}
                          src={img}
                          style={{ marginRight: 8, marginBottom: 8 }}
                        />
                      ))}
                    </Image.PreviewGroup>
                  </div>
                </Col>
                <Col span={12}>
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="SKU 名称">{sku.name}</Descriptions.Item>
                    <Descriptions.Item label="价格">¥{sku.price}</Descriptions.Item>
                    <Descriptions.Item label="库存">{sku.stock}</Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <Divider />
              <div style={{ marginBottom: 16 }}>
                <h4>图文介绍</h4>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                  {sku.description}
                </div>
              </div>
              <Divider />
              <div style={{ marginBottom: 16 }}>
                <h4>成分说明</h4>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                  {sku.ingredients}
                </div>
              </div>
              <Divider />
              <div>
                <h4>注意事项</h4>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                  {sku.precautions}
                </div>
              </div>
            </Card>
          ))}
        </Card>
      )}

      {/* 新增/编辑 SKU 弹窗 */}
      <Modal
        title={editingSKU ? '编辑 SKU' : '新增 SKU'}
        open={isSKUModalVisible}
        onOk={handleSKUModalOk}
        onCancel={handleSKUModalCancel}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="SKU 名称"
            rules={[{ required: true, message: '请输入 SKU 名称' }]}
          >
            <Input placeholder="请输入 SKU 名称" />
          </Form.Item>
          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入价格"
              min={0}
              precision={2}
            />
          </Form.Item>
          <Form.Item
            name="stock"
            label="库存"
            rules={[{ required: true, message: '请输入库存' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入库存"
              min={0}
            />
          </Form.Item>
          <Form.Item
            name="images"
            label="商品图片（每行一个URL）"
            tooltip="每行输入一个图片URL，支持多张图片"
          >
            <TextArea
              rows={4}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="图文介绍"
            rules={[{ required: true, message: '请输入图文介绍' }]}
          >
            <TextArea
              rows={6}
              placeholder="请输入商品的详细图文介绍"
            />
          </Form.Item>
          <Form.Item
            name="ingredients"
            label="成分说明"
            rules={[{ required: true, message: '请输入成分说明' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入成分说明，多个成分用逗号或换行分隔"
            />
          </Form.Item>
          <Form.Item
            name="precautions"
            label="注意事项"
            rules={[{ required: true, message: '请输入注意事项' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入注意事项，每行一条"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductDetail

