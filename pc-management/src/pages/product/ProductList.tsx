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
  Modal,
  Form,
  InputNumber,
  Popconfirm,
  Tooltip
} from 'antd'
import { 
  PlusOutlined, 
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  TagOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { productApi } from '../../services/api'
import type { Product, CreateProductRequest, UpdateProductRequest } from '../../types'

const { Option } = Select
const { TextArea } = Input

// 功效标签选项
const effectTagOptions = ['祛痘', '控油', '美白', '抗衰', '保湿', '清洁', '舒缓', '修护', '紧致', '淡斑']

// 适用肤质选项
const skinTypeOptions = ['油性', '干性', '混合性', '敏感肌', '中性']

// 皮肤问题标签选项（与客户管理中的问题标签保持一致）
const problemTagOptions = ['痤疮', '色斑', '敏感', '抗衰', '细纹', '清洁', '红血丝', '泛红', '皱纹', '松弛', '美白', '控油']

interface ProductFormData {
  name: string
  brand: string
  effectTags: string[]
  skinTypes: string[]
  priceRange: {
    min: number
    max: number
  }
  salesLink: string
  problemTags: string[]
}

const ProductList: React.FC = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>()
  const [selectedEffectTag, setSelectedEffectTag] = useState<string | undefined>()
  const [selectedSkinType, setSelectedSkinType] = useState<string | undefined>()
  const [selectedProblemTag, setSelectedProblemTag] = useState<string | undefined>()
  const [filteredData, setFilteredData] = useState<Product[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form] = Form.useForm()

  // 获取商品列表
  const fetchProducts = async () => {
    setLoading(true)
    try {
      // TODO: 调用真实 API
      // const response = await productApi.getList({
      //   search: searchText,
      //   brand: selectedBrand,
      //   effectTag: selectedEffectTag,
      //   skinType: selectedSkinType,
      //   problemTag: selectedProblemTag
      // })
      // setProducts(response.items)
      // setFilteredData(response.items)

      // 模拟数据
      const mockProducts: Product[] = [
        {
          id: '1',
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
        },
        {
          id: '2',
          name: '美白面霜',
          brand: '品牌B',
          effectTags: ['美白', '淡斑'],
          skinTypes: ['干性', '中性'],
          priceRange: { min: 299, max: 399 },
          salesLink: 'https://example.com/product/2',
          status: 'active',
          problemTags: ['色斑', '美白'],
          createdAt: '2025-01-14T10:00:00Z',
          updatedAt: '2025-01-14T10:00:00Z'
        },
        {
          id: '3',
          name: '抗衰精华',
          brand: '品牌C',
          effectTags: ['抗衰', '紧致'],
          skinTypes: ['干性', '中性', '敏感肌'],
          priceRange: { min: 499, max: 599 },
          salesLink: 'https://example.com/product/3',
          status: 'active',
          problemTags: ['抗衰', '皱纹', '松弛'],
          createdAt: '2025-01-13T10:00:00Z',
          updatedAt: '2025-01-13T10:00:00Z'
        }
      ]
      setProducts(mockProducts)
      setFilteredData(mockProducts)
    } catch (error) {
      message.error('获取商品列表失败')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // 过滤数据
  useEffect(() => {
    let filtered = [...products]

    if (searchText) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    if (selectedBrand) {
      filtered = filtered.filter(item => item.brand === selectedBrand)
    }

    if (selectedEffectTag) {
      filtered = filtered.filter(item => item.effectTags.includes(selectedEffectTag))
    }

    if (selectedSkinType) {
      filtered = filtered.filter(item => item.skinTypes.includes(selectedSkinType))
    }

    if (selectedProblemTag) {
      filtered = filtered.filter(item => item.problemTags.includes(selectedProblemTag))
    }

    setFilteredData(filtered)
  }, [searchText, selectedBrand, selectedEffectTag, selectedSkinType, selectedProblemTag, products])

  const handleSearch = () => {
    // 搜索逻辑已在 useEffect 中处理
  }

  const handleViewDetail = (record: Product) => {
    navigate(`/product/detail/${record.id}`)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: Product) => {
    setEditingProduct(record)
    form.setFieldsValue({
      name: record.name,
      brand: record.brand,
      effectTags: record.effectTags,
      skinTypes: record.skinTypes,
      priceRange: record.priceRange,
      salesLink: record.salesLink,
      problemTags: record.problemTags
    })
    setIsModalVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      // TODO: 调用真实 API
      // await productApi.delete(id)
      message.success('删除成功')
      fetchProducts()
    } catch (error) {
      message.error('删除失败')
      console.error(error)
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      if (editingProduct) {
        // 更新商品
        // TODO: 调用真实 API
        // await productApi.update(editingProduct.id, values as UpdateProductRequest)
        message.success('更新成功')
      } else {
        // 创建商品
        // TODO: 调用真实 API
        // await productApi.create(values as CreateProductRequest)
        message.success('创建成功')
      }
      setIsModalVisible(false)
      form.resetFields()
      fetchProducts()
    } catch (error) {
      console.error('表单验证失败', error)
    }
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setEditingProduct(null)
  }

  // 获取所有品牌列表（用于筛选）
  const brands = Array.from(new Set(products.map(p => p.brand)))

  const columns: ColumnsType<Product> = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
    },
    {
      title: '功效标签',
      dataIndex: 'effectTags',
      key: 'effectTags',
      width: 200,
      render: (tags: string[]) => (
        <Space wrap>
          {tags.map(tag => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '适用肤质',
      dataIndex: 'skinTypes',
      key: 'skinTypes',
      width: 150,
      render: (types: string[]) => (
        <Space wrap>
          {types.map(type => (
            <Tag key={type} color="green">{type}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '价格区间',
      key: 'priceRange',
      width: 150,
      render: (_, record) => (
        <span>¥{record.priceRange.min} - ¥{record.priceRange.max}</span>
      ),
    },
    {
      title: '销售链接',
      dataIndex: 'salesLink',
      key: 'salesLink',
      width: 200,
      render: (link: string) => (
        <Tooltip title={link}>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <LinkOutlined /> 查看链接
          </a>
        </Tooltip>
      ),
    },
    {
      title: '关联问题标签',
      dataIndex: 'problemTags',
      key: 'problemTags',
      width: 200,
      render: (tags: string[]) => (
        <Space wrap>
          {tags.map(tag => (
            <Tag key={tag} color="orange" icon={<TagOutlined />}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetail(record)}
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
            title="确定要删除这个商品吗？"
            onConfirm={() => handleDelete(record.id)}
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

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Input
                placeholder="搜索商品名称/品牌"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="选择品牌"
                style={{ width: '100%' }}
                value={selectedBrand}
                onChange={setSelectedBrand}
                allowClear
              >
                {brands.map(brand => (
                  <Option key={brand} value={brand}>{brand}</Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="选择功效标签"
                style={{ width: '100%' }}
                value={selectedEffectTag}
                onChange={setSelectedEffectTag}
                allowClear
              >
                {effectTagOptions.map(tag => (
                  <Option key={tag} value={tag}>{tag}</Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="选择适用肤质"
                style={{ width: '100%' }}
                value={selectedSkinType}
                onChange={setSelectedSkinType}
                allowClear
              >
                {skinTypeOptions.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="选择问题标签"
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
            <Col span={2}>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
            </Col>
          </Row>
        </div>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增商品
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 新增/编辑商品弹窗 */}
      <Modal
        title={editingProduct ? '编辑商品' : '新增商品'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            effectTags: [],
            skinTypes: [],
            problemTags: [],
            priceRange: { min: 0, max: 0 }
          }}
        >
          <Form.Item
            name="name"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item
            name="brand"
            label="品牌"
            rules={[{ required: true, message: '请输入品牌' }]}
          >
            <Input placeholder="请输入品牌" />
          </Form.Item>
          <Form.Item
            name="effectTags"
            label="功效标签"
            rules={[{ required: true, message: '请选择至少一个功效标签' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择功效标签"
              allowClear
            >
              {effectTagOptions.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="skinTypes"
            label="适用肤质"
            rules={[{ required: true, message: '请选择至少一个适用肤质' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择适用肤质"
              allowClear
            >
              {skinTypeOptions.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['priceRange', 'min']}
                label="最低价格"
                rules={[{ required: true, message: '请输入最低价格' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="最低价格"
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['priceRange', 'max']}
                label="最高价格"
                rules={[{ required: true, message: '请输入最高价格' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="最高价格"
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="salesLink"
            label="销售链接"
            rules={[
              { required: true, message: '请输入销售链接' },
              { type: 'url', message: '请输入有效的URL' }
            ]}
          >
            <Input placeholder="https://example.com/product/xxx" />
          </Form.Item>
          <Form.Item
            name="problemTags"
            label="关联皮肤问题标签"
            tooltip="用于商品推荐功能，当客户有对应问题时，可以推荐此商品"
          >
            <Select
              mode="multiple"
              placeholder="请选择关联的问题标签"
              allowClear
            >
              {problemTagOptions.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductList
