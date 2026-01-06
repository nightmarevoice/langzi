import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Button, 
  Space, 
  Input, 
  Select,
  Form,
  Steps,
  Row,
  Col,
  Radio,
  Checkbox,
  DatePicker,
  TimePicker,
  InputNumber,
  Upload,
  message,
  Alert,
  Divider,
  Tag,
  Typography
} from 'antd'
import { 
  UploadOutlined,
  PlayCircleOutlined
} from '@ant-design/icons'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { UploadFile } from 'antd/es/upload/interface'
import dayjs, { Dayjs } from 'dayjs'

const { Option } = Select
const { TextArea } = Input
const { Title, Text } = Typography
const { RangePicker } = TimePicker

interface FormData {
  // 基本信息
  taskName: string
  taskDescription: string
  taskType: string
  businessLine: string
  
  // 名单选择
  listSource: string
  existingListId?: string
  crmConditions?: any
  uploadFile?: UploadFile[]
  deduplicationRule: string[]
  
  // 话术/对话策略
  flowId?: string
  llmTemplateId?: string
  enableInterrupt: boolean
  
  // 拨打策略
  callTimeRange: {
    weekdays: string[]
    weekend: string[]
    timeSlots: [Dayjs, Dayjs][]
  }
  maxCallCount: number
  callInterval: number
  concurrencyLimit: number
  
  // 预览数据
  previewData?: any
}

const VisitTaskForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const cloneId = searchParams.get('clone')
  const isEdit = !!id
  const isClone = !!cloneId
  
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  
  // 步骤配置
  const steps = [
    {
      title: '基本信息',
      description: '填写任务基本信息'
    },
    {
      title: '名单选择',
      description: '选择目标客户名单'
    },
    {
      title: '话术/对话策略',
      description: '配置对话流程和模板'
    },
    {
      title: '拨打策略',
      description: '设置拨打规则和限制'
    },
    {
      title: '预览 & 验证',
      description: '预览配置并验证'
    }
  ]

  // 任务类型选项
  const taskTypeOptions = [
    { label: '售后回访', value: '售后回访' },
    { label: '新客欢迎', value: '新客欢迎' },
    { label: '促销触达', value: '促销触达' },
    { label: '满意度调研', value: '满意度调研' },
    { label: '催付提醒', value: '催付提醒' }
  ]
  
  // 业务线选项
  const businessLineOptions = ['美肤护理', '医美项目', '其他']
  
  // 名单来源选项
  const listSourceOptions = [
    { label: '选择已有名单', value: 'existing' },
    { label: '从 CRM 条件筛选', value: 'crm' },
    { label: '上传 Excel', value: 'upload' }
  ]
  
  // 去重规则选项
  const deduplicationOptions = [
    { label: '按手机号去重', value: 'phone' },
    { label: '按用户ID去重', value: 'userId' }
  ]
  
  // 对话流程选项（模拟数据）
  const flowOptions = [
    { label: '标准回访流程', value: 'flow1' },
    { label: '满意度调研流程', value: 'flow2' },
    { label: '促销触达流程', value: 'flow3' }
  ]
  
  // LLM模板选项（模拟数据）
  const llmTemplateOptions = [
    { label: '温和友好型', value: 'template1' },
    { label: '专业严谨型', value: 'template2' },
    { label: '活泼亲切型', value: 'template3' }
  ]

  // 初始化表单数据
  useEffect(() => {
    if (isEdit || isClone) {
      // 这里应该从API获取数据
      form.setFieldsValue({
        taskName: isClone ? '售后回访-2025年1月-副本' : '售后回访-2025年1月',
        taskDescription: '对1月份购买产品的客户进行售后回访',
        taskType: '售后回访',
        businessLine: '美肤护理',
        listSource: 'existing',
        deduplicationRule: ['phone'],
        enableInterrupt: true,
        maxCallCount: 3,
        callInterval: 24,
        concurrencyLimit: 10
      })
    }
  }, [id, cloneId, isEdit, isClone, form])

  // 下一步
  const handleNext = async () => {
    try {
      // 验证当前步骤的表单
      const fields = getStepFields(currentStep)
      await form.validateFields(fields)
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 上一步
  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  // 获取当前步骤需要验证的字段
  const getStepFields = (step: number): (string | string[])[] => {
    const fieldMap: Record<number, (string | string[])[]> = {
      0: ['taskName', 'taskType', 'businessLine'],
      1: ['listSource', 'deduplicationRule'],
      2: ['flowId', 'llmTemplateId'],
      3: ['maxCallCount', 'callInterval', 'concurrencyLimit', ['callTimeRange', 'weekdays'], ['callTimeRange', 'timeSlots']]
    }
    return fieldMap[step] || []
  }

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      // 这里应该调用API保存数据
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      message.success(isEdit ? '任务更新成功' : '任务创建成功')
      navigate('/visit/task-list')
    } catch (error) {
      console.error('Submit failed:', error)
      message.error('提交失败，请检查表单')
    } finally {
      setLoading(false)
    }
  }

  // 预览数据生成
  const generatePreviewData = () => {
    const values = form.getFieldsValue()
    return {
      taskName: values.taskName,
      taskType: values.taskType,
      businessLine: values.businessLine,
      listSource: values.listSource,
      estimatedCount: 1000, // 模拟数据
      callTimeRange: values.callTimeRange,
      maxCallCount: values.maxCallCount,
      callInterval: values.callInterval,
      concurrencyLimit: values.concurrencyLimit
    }
  }

  // 步骤1: 基本信息
  const renderBasicInfo = () => (
    <Card title="基本信息">
      <Form.Item
        label="任务名称"
        name="taskName"
        rules={[{ required: true, message: '请输入任务名称' }]}
      >
        <Input placeholder="请输入任务名称" />
      </Form.Item>
      
      <Form.Item
        label="任务说明"
        name="taskDescription"
      >
        <TextArea 
          rows={4} 
          placeholder="请输入任务说明（可选）"
        />
      </Form.Item>
      
      <Form.Item
        label="任务类型"
        name="taskType"
        rules={[{ required: true, message: '请选择任务类型' }]}
      >
        <Radio.Group>
          {taskTypeOptions.map(option => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      
      <Form.Item
        label="所属业务线/项目"
        name="businessLine"
        rules={[{ required: true, message: '请选择业务线' }]}
      >
        <Select placeholder="请选择业务线">
          {businessLineOptions.map(line => (
            <Option key={line} value={line}>{line}</Option>
          ))}
        </Select>
      </Form.Item>
    </Card>
  )

  // 步骤2: 名单选择
  const renderListSelection = () => {
    const listSource = Form.useWatch('listSource', form)
    
    return (
      <Card title="名单选择">
        <Form.Item
          label="名单来源"
          name="listSource"
          rules={[{ required: true, message: '请选择名单来源' }]}
        >
          <Radio.Group>
            {listSourceOptions.map(option => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        
        {listSource === 'existing' && (
          <Form.Item
            label="选择已有名单"
            name="existingListId"
            rules={[{ required: true, message: '请选择名单' }]}
          >
            <Select placeholder="请选择已有名单">
              <Option value="list1">售后回访名单-2025年1月</Option>
              <Option value="list2">新客名单-2025年1月</Option>
              <Option value="list3">促销名单-春季活动</Option>
            </Select>
          </Form.Item>
        )}
        
        {listSource === 'crm' && (
          <Form.Item
            label="CRM筛选条件"
            name="crmConditions"
            rules={[{ required: true, message: '请设置筛选条件' }]}
          >
            <Card size="small" style={{ background: '#f5f5f5' }}>
              <Text type="secondary">
                这里应该是一个复杂的筛选条件配置器
                <br />
                可以设置：购买时间、产品类型、客户标签等条件
              </Text>
            </Card>
          </Form.Item>
        )}
        
        {listSource === 'upload' && (
          <Form.Item
            label="上传Excel文件"
            name="uploadFile"
            rules={[{ required: true, message: '请上传Excel文件' }]}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e
              }
              return e?.fileList
            }}
          >
            <Upload
              beforeUpload={() => false}
              accept=".xlsx,.xls"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>
        )}
        
        <Form.Item
          label="去重规则"
          name="deduplicationRule"
          rules={[{ required: true, message: '请选择去重规则' }]}
        >
          <Checkbox.Group>
            {deduplicationOptions.map(option => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Card>
    )
  }

  // 步骤3: 话术/对话策略
  const renderDialogueStrategy = () => (
    <Card title="话术/对话策略">
      <Form.Item
        label="选择对话流程"
        name="flowId"
        rules={[{ required: true, message: '请选择对话流程' }]}
        tooltip="从回访策略配置中选择一个对话流程"
      >
        <Select placeholder="请选择对话流程">
          {flowOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item
        label="选择LLM模板"
        name="llmTemplateId"
        rules={[{ required: true, message: '请选择LLM模板' }]}
        tooltip="选择对话的AI模板风格"
      >
        <Select placeholder="请选择LLM模板">
          {llmTemplateOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item
        label="强打断优先"
        name="enableInterrupt"
        valuePropName="checked"
        tooltip="开启后，用户说话时立即终止AI播报"
      >
        <Checkbox>开启强打断优先</Checkbox>
      </Form.Item>
    </Card>
  )

  // 步骤4: 拨打策略
  const renderCallStrategy = () => (
    <Card title="拨打策略">
      <Form.Item
        label="工作日"
        name={['callTimeRange', 'weekdays']}
        rules={[{ required: true, message: '请选择工作日' }]}
      >
        <Checkbox.Group>
          <Checkbox value="mon">周一</Checkbox>
          <Checkbox value="tue">周二</Checkbox>
          <Checkbox value="wed">周三</Checkbox>
          <Checkbox value="thu">周四</Checkbox>
          <Checkbox value="fri">周五</Checkbox>
        </Checkbox.Group>
      </Form.Item>
      
      <Form.Item
        label="周末"
        name={['callTimeRange', 'weekend']}
      >
        <Checkbox.Group>
          <Checkbox value="sat">周六</Checkbox>
          <Checkbox value="sun">周日</Checkbox>
        </Checkbox.Group>
      </Form.Item>
      
      <Form.Item
        label="小时段"
        name={['callTimeRange', 'timeSlots']}
        rules={[{ required: true, message: '请选择小时段' }]}
      >
        <RangePicker
          format="HH:mm"
          placeholder={['开始时间', '结束时间']}
          style={{ width: '100%' }}
        />
      </Form.Item>
      
      <Form.Item
        label="单用户拨打次数上限"
        name="maxCallCount"
        rules={[{ required: true, message: '请输入拨打次数上限' }]}
        tooltip="每个用户最多拨打几次"
      >
        <InputNumber min={1} max={10} style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item
        label="拨打间隔（小时）"
        name="callInterval"
        rules={[{ required: true, message: '请输入拨打间隔' }]}
        tooltip="每次拨打之间的最小间隔时间"
      >
        <InputNumber min={1} max={168} style={{ width: '100%' }} addonAfter="小时" />
      </Form.Item>
      
      <Form.Item
        label="并发上限"
        name="concurrencyLimit"
        rules={[{ required: true, message: '请输入并发上限' }]}
        tooltip="每分钟最多拨打的数量"
      >
        <InputNumber min={1} max={100} style={{ width: '100%' }} addonAfter="次/分钟" />
      </Form.Item>
    </Card>
  )

  // 步骤5: 预览 & 验证
  const renderPreview = () => {
    const previewData = generatePreviewData()
    
    return (
      <Card title="预览 & 验证">
        <Alert
          message="请仔细检查以下配置，确认无误后提交"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        <Title level={4}>任务基本信息</Title>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Text strong>任务名称：</Text>
            <Text>{previewData.taskName}</Text>
          </Col>
          <Col span={12}>
            <Text strong>任务类型：</Text>
            <Tag color="blue">{previewData.taskType}</Tag>
          </Col>
          <Col span={12} style={{ marginTop: 16 }}>
            <Text strong>业务线：</Text>
            <Text>{previewData.businessLine}</Text>
          </Col>
          <Col span={12} style={{ marginTop: 16 }}>
            <Text strong>名单来源：</Text>
            <Text>{listSourceOptions.find(o => o.value === previewData.listSource)?.label}</Text>
          </Col>
        </Row>
        
        <Divider />
        
        <Title level={4}>拨打规则摘要</Title>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Text strong>拨打次数上限：</Text>
            <Text>{previewData.maxCallCount} 次</Text>
          </Col>
          <Col span={8}>
            <Text strong>拨打间隔：</Text>
            <Text>{previewData.callInterval} 小时</Text>
          </Col>
          <Col span={8}>
            <Text strong>并发上限：</Text>
            <Text>{previewData.concurrencyLimit} 次/分钟</Text>
          </Col>
        </Row>
        
        <Divider />
        
        <Title level={4}>名单规模预测</Title>
        <Alert
          message={`预计目标客户数：${previewData.estimatedCount} 人`}
          type="success"
          style={{ marginBottom: 24 }}
        />
        
        <Divider />
        
        <Title level={4}>风险提示</Title>
        <Alert
          message="配置检查通过"
          description="所有配置项已正确填写，可以提交任务"
          type="success"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        <Divider />
        
        <Title level={4}>模拟回访流程</Title>
        <Card size="small" style={{ background: '#f5f5f5', marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Tag color="blue">AI</Tag>
              <Text>您好，我是XX美肤中心的AI助手，想对您进行一个简短的售后回访...</Text>
            </div>
            <div>
              <Tag color="green">用户</Tag>
              <Text>好的，你说吧</Text>
            </div>
            <div>
              <Tag color="blue">AI</Tag>
              <Text>请问您对我们上次的服务还满意吗？</Text>
            </div>
          </Space>
        </Card>
        <Button icon={<PlayCircleOutlined />} type="dashed">
          试听语音
        </Button>
      </Card>
    )
  }

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo()
      case 1:
        return renderListSelection()
      case 2:
        return renderDialogueStrategy()
      case 3:
        return renderCallStrategy()
      case 4:
        return renderPreview()
      default:
        return null
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />
        
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            enableInterrupt: true,
            maxCallCount: 3,
            callInterval: 24,
            concurrencyLimit: 10
          }}
        >
          {renderStepContent()}
        </Form>
        
        <div style={{ marginTop: 32, textAlign: 'right' }}>
          <Space>
            {currentStep > 0 && (
              <Button onClick={handlePrev}>上一步</Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button type="primary" onClick={handleNext}>
                下一步
              </Button>
            ) : (
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                {isEdit ? '更新任务' : '创建任务'}
              </Button>
            )}
            <Button onClick={() => navigate('/visit/task-list')}>
              取消
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  )
}

export default VisitTaskForm

