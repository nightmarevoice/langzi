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
  Tooltip,
  DatePicker,
  Popconfirm,
  Checkbox
} from 'antd'
import { 
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  CopyOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  DownloadOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import dayjs, { Dayjs } from 'dayjs'

const { Option } = Select
const { RangePicker } = DatePicker

interface VisitTask {
  id: string
  taskName: string
  taskType: string
  status: string
  targetCount: number
  calledCount: number
  connectRate: number
  effectiveRate: number
  creator: string
  createTime: string
  planStartTime: string
  planEndTime: string
  businessLine: string
}

// 模拟数据
const mockTasks: VisitTask[] = [
  {
    id: '1',
    taskName: '售后回访-2025年1月',
    taskType: '售后回访',
    status: '运行中',
    targetCount: 1000,
    calledCount: 650,
    connectRate: 72.5,
    effectiveRate: 58.3,
    creator: '张三',
    createTime: '2025-01-10 10:00:00',
    planStartTime: '2025-01-15 09:00:00',
    planEndTime: '2025-01-31 18:00:00',
    businessLine: '美肤护理'
  },
  {
    id: '2',
    taskName: '满意度调研-Q1',
    taskType: '满意度',
    status: '运行中',
    targetCount: 500,
    calledCount: 320,
    connectRate: 68.0,
    effectiveRate: 55.2,
    creator: '李四',
    createTime: '2025-01-08 14:30:00',
    planStartTime: '2025-01-12 09:00:00',
    planEndTime: '2025-01-30 18:00:00',
    businessLine: '医美项目'
  },
  {
    id: '3',
    taskName: '催付提醒-订单未支付',
    taskType: '催付',
    status: '暂停',
    targetCount: 200,
    calledCount: 80,
    connectRate: 45.0,
    effectiveRate: 35.0,
    creator: '王五',
    createTime: '2025-01-05 11:20:00',
    planStartTime: '2025-01-10 09:00:00',
    planEndTime: '2025-01-20 18:00:00',
    businessLine: '美肤护理'
  },
  {
    id: '4',
    taskName: '新客欢迎-首次体验',
    taskType: '新客欢迎',
    status: '未开始',
    targetCount: 300,
    calledCount: 0,
    connectRate: 0,
    effectiveRate: 0,
    creator: '赵六',
    createTime: '2025-01-12 16:45:00',
    planStartTime: '2025-01-20 09:00:00',
    planEndTime: '2025-02-05 18:00:00',
    businessLine: '医美项目'
  },
  {
    id: '5',
    taskName: '促销触达-春季活动',
    taskType: '促销触达',
    status: '结束',
    targetCount: 800,
    calledCount: 800,
    connectRate: 75.5,
    effectiveRate: 62.8,
    creator: '孙七',
    createTime: '2024-12-28 10:15:00',
    planStartTime: '2025-01-01 09:00:00',
    planEndTime: '2025-01-10 18:00:00',
    businessLine: '美肤护理'
  }
]

const VisitTaskList: React.FC = () => {
  const navigate = useNavigate()
  const [filteredData, setFilteredData] = useState<VisitTask[]>(mockTasks)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)
  
  // 搜索和筛选状态
  const [searchText, setSearchText] = useState('')
  const [taskType, setTaskType] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [businessLine, setBusinessLine] = useState<string>('')
  const [timeRange, setTimeRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)

  // 任务类型选项
  const taskTypeOptions = ['售后回访', '满意度', '催付', '新客欢迎', '促销触达']
  
  // 状态选项
  const statusOptions = ['未开始', '运行中', '暂停', '结束']
  
  // 业务线选项
  const businessLineOptions = ['美肤护理', '医美项目', '其他']

  // 过滤数据
  useEffect(() => {
    let filtered = [...mockTasks]
    
    // 任务名称搜索
    if (searchText) {
      filtered = filtered.filter(item => 
        item.taskName.includes(searchText)
      )
    }
    
    // 任务类型筛选
    if (taskType) {
      filtered = filtered.filter(item => item.taskType === taskType)
    }
    
    // 状态筛选
    if (status) {
      filtered = filtered.filter(item => item.status === status)
    }
    
    // 业务线筛选
    if (businessLine) {
      filtered = filtered.filter(item => item.businessLine === businessLine)
    }
    
    // 时间范围筛选
    if (timeRange && timeRange[0] && timeRange[1]) {
      filtered = filtered.filter(item => {
        const createTime = dayjs(item.createTime)
        return createTime.isAfter(timeRange[0]!.subtract(1, 'day')) && 
               createTime.isBefore(timeRange[1]!.add(1, 'day'))
      })
    }
    
    setFilteredData(filtered)
  }, [searchText, taskType, status, businessLine, timeRange])

  const handleSearch = () => {
    // 搜索逻辑已在 useEffect 中处理
  }

  const handleReset = () => {
    setSearchText('')
    setTaskType('')
    setStatus('')
    setBusinessLine('')
    setTimeRange(null)
  }

  const handleViewDetail = (record: VisitTask) => {
    navigate(`/visit/task-detail/${record.id}`)
  }

  const handleEdit = (record: VisitTask) => {
    navigate(`/visit/task-form/${record.id}`)
  }

  const handlePause = (record: VisitTask) => {
    message.success(`任务 "${record.taskName}" 已暂停`)
    // 这里应该调用API更新状态
  }

  const handleStart = (record: VisitTask) => {
    message.success(`任务 "${record.taskName}" 已启动`)
    // 这里应该调用API更新状态
  }

  const handleClone = (record: VisitTask) => {
    message.success(`任务 "${record.taskName}" 已克隆`)
    navigate(`/visit/task-form?clone=${record.id}`)
  }

  const handleClose = (record: VisitTask) => {
    message.success(`任务 "${record.taskName}" 已关闭`)
    // 这里应该调用API更新状态
  }

  const handleBatchPause = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要操作的任务')
      return
    }
    message.success(`已批量暂停 ${selectedRowKeys.length} 个任务`)
    setSelectedRowKeys([])
  }

  const handleBatchEnd = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要操作的任务')
      return
    }
    message.success(`已批量结束 ${selectedRowKeys.length} 个任务`)
    setSelectedRowKeys([])
  }

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要操作的任务')
      return
    }
    message.success(`已批量删除 ${selectedRowKeys.length} 个任务`)
    setSelectedRowKeys([])
  }

  const handleExport = () => {
    setLoading(true)
    // 模拟导出
    setTimeout(() => {
      const csvContent = [
        ['任务名称', '任务类型', '状态', '目标客户数', '已呼叫数', '接通率', '有效通话率', '创建人', '创建时间', '计划开始时间', '计划结束时间', '业务线'],
        ...filteredData.map(task => [
          task.taskName,
          task.taskType,
          task.status,
          task.targetCount.toString(),
          task.calledCount.toString(),
          `${task.connectRate}%`,
          `${task.effectiveRate}%`,
          task.creator,
          task.createTime,
          task.planStartTime,
          task.planEndTime,
          task.businessLine
        ])
      ].map(row => row.join(',')).join('\n')
      
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `任务列表_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setLoading(false)
      message.success('导出成功')
    }, 500)
  }

  const handleCreate = () => {
    navigate('/visit/task-form')
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys)
    },
  }

  const columns: ColumnsType<VisitTask> = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 200,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
      width: 120,
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          '售后回访': 'blue',
          '满意度': 'green',
          '催付': 'orange',
          '新客欢迎': 'cyan',
          '促销触达': 'purple'
        }
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          '未开始': 'default',
          '运行中': 'processing',
          '暂停': 'warning',
          '结束': 'success'
        }
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>
      }
    },
    {
      title: '目标客户数',
      dataIndex: 'targetCount',
      key: 'targetCount',
      width: 120,
      align: 'right',
    },
    {
      title: '已呼叫数',
      dataIndex: 'calledCount',
      key: 'calledCount',
      width: 120,
      align: 'right',
    },
    {
      title: '接通率',
      dataIndex: 'connectRate',
      key: 'connectRate',
      width: 100,
      align: 'right',
      render: (rate: number) => `${rate}%`
    },
    {
      title: '有效通话率',
      dataIndex: 'effectiveRate',
      key: 'effectiveRate',
      width: 120,
      align: 'right',
      render: (rate: number) => `${rate}%`
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '计划开始时间',
      dataIndex: 'planStartTime',
      key: 'planStartTime',
      width: 180,
    },
    {
      title: '计划结束时间',
      dataIndex: 'planEndTime',
      key: 'planEndTime',
      width: 180,
    },
    {
      title: '业务线',
      dataIndex: 'businessLine',
      key: 'businessLine',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap>
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record)}
              size="small"
            >
              查看
            </Button>
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
              size="small"
            >
              编辑
            </Button>
          </Tooltip>
          {record.status === '运行中' ? (
            <Tooltip title="暂停">
              <Popconfirm
                title="确定要暂停此任务吗？"
                onConfirm={() => handlePause(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="link" 
                  icon={<PauseCircleOutlined />} 
                  size="small"
                  danger
                >
                  暂停
                </Button>
              </Popconfirm>
            </Tooltip>
          ) : record.status === '暂停' || record.status === '未开始' ? (
            <Tooltip title="启动">
              <Button 
                type="link" 
                icon={<PlayCircleOutlined />} 
                onClick={() => handleStart(record)}
                size="small"
              >
                启动
              </Button>
            </Tooltip>
          ) : null}
          <Tooltip title="克隆">
            <Button 
              type="link" 
              icon={<CopyOutlined />} 
              onClick={() => handleClone(record)}
              size="small"
            >
              克隆
            </Button>
          </Tooltip>
          {record.status !== '结束' && (
            <Tooltip title="关闭">
              <Popconfirm
                title="确定要关闭此任务吗？关闭后无法恢复。"
                onConfirm={() => handleClose(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="link" 
                  icon={<CloseCircleOutlined />} 
                  size="small"
                  danger
                >
                  关闭
                </Button>
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        {/* 顶部：搜索 + 筛选 */}
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Input
                placeholder="搜索任务名称"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="任务类型"
                style={{ width: '100%' }}
                value={taskType}
                onChange={setTaskType}
                allowClear
              >
                {taskTypeOptions.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="状态"
                style={{ width: '100%' }}
                value={status}
                onChange={setStatus}
                allowClear
              >
                {statusOptions.map(s => (
                  <Option key={s} value={s}>{s}</Option>
                ))}
              </Select>
            </Col>
            
            <Col span={6}>
              <RangePicker
                style={{ width: '100%' }}
                value={timeRange}
                onChange={setTimeRange}
                placeholder={['开始时间', '结束时间']}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={handleReset}>重置</Button>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  搜索
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* 批量操作 & 快捷入口 */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            {selectedRowKeys.length > 0 && (
              <>
                <Popconfirm
                  title={`确定要批量暂停选中的 ${selectedRowKeys.length} 个任务吗？`}
                  onConfirm={handleBatchPause}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button icon={<PauseCircleOutlined />}>批量暂停</Button>
                </Popconfirm>
                <Popconfirm
                  title={`确定要批量结束选中的 ${selectedRowKeys.length} 个任务吗？`}
                  onConfirm={handleBatchEnd}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button icon={<CloseCircleOutlined />}>批量结束</Button>
                </Popconfirm>
                <Popconfirm
                  title={`确定要批量删除选中的 ${selectedRowKeys.length} 个任务吗？此操作不可恢复。`}
                  onConfirm={handleBatchDelete}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button icon={<DeleteOutlined />} danger>批量删除</Button>
                </Popconfirm>
              </>
            )}
          </Space>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreate}
            >
              新建任务
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleExport}
              loading={loading}
            >
              导出
            </Button>
          </Space>
        </div>
        
        {/* 任务表格 */}
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          rowSelection={rowSelection}
          scroll={{ x: 1800 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  )
}

export default VisitTaskList
