import React, { useState } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Input, 
  DatePicker, 
  Select, 
  Tag,
  message
} from 'antd'
import { 
  SearchOutlined, 
  EyeOutlined, 
  DownloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { Dayjs } from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select

interface ReportRecord {
  id: string
  userId: string
  userName: string
  phone: string
  lastTestTime: string
  problemTags: string[]
  isRead: boolean
  needsReview: boolean
  reportId: string
}

const CustomerReportManage: React.FC = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  // 模拟数据
  const mockData: ReportRecord[] = [
    {
      id: '1',
      userId: 'user001',
      userName: '张美丽',
      phone: '138****8888',
      lastTestTime: '2024-01-15 14:30:00',
      problemTags: ['痘痘', '黑头', '毛孔粗大'],
      isRead: true,
      needsReview: false,
      reportId: 'report001'
    },
    {
      id: '2',
      userId: 'user002',
      userName: '李优雅',
      phone: '139****9999',
      lastTestTime: '2024-01-14 10:20:00',
      problemTags: ['敏感肌', '红血丝'],
      isRead: false,
      needsReview: true,
      reportId: 'report002'
    },
    {
      id: '3',
      userId: 'user003',
      userName: '王青春',
      phone: '137****7777',
      lastTestTime: '2024-01-13 16:45:00',
      problemTags: ['暗沉', '色斑', '细纹'],
      isRead: true,
      needsReview: false,
      reportId: 'report003'
    },
    {
      id: '4',
      userId: 'user004',
      userName: '赵清新',
      phone: '136****6666',
      lastTestTime: '2024-01-12 09:15:00',
      problemTags: ['痘痘', '敏感肌'],
      isRead: false,
      needsReview: false,
      reportId: 'report004'
    },
    {
      id: '5',
      userId: 'user005',
      userName: '陈自然',
      phone: '135****5555',
      lastTestTime: '2024-01-11 11:30:00',
      problemTags: ['黑头', '毛孔粗大', '出油'],
      isRead: true,
      needsReview: true,
      reportId: 'report005'
    }
  ]

  const [dataSource, setDataSource] = useState<ReportRecord[]>(mockData)

  // 所有问题标签选项
  const problemTagOptions = ['痘痘', '黑头', '毛孔粗大', '敏感肌', '红血丝', '暗沉', '色斑', '细纹', '出油']

  const handleSearch = () => {
    setLoading(true)
    // 模拟搜索过滤
    setTimeout(() => {
      let filtered = [...mockData]
      
      if (searchText) {
        filtered = filtered.filter(item => 
          item.userName.includes(searchText) || 
          item.phone.includes(searchText.replace(/\*/g, ''))
        )
      }
      
      if (dateRange && dateRange[0] && dateRange[1]) {
        filtered = filtered.filter(item => {
          const testTime = dayjs(item.lastTestTime)
          return testTime.isAfter(dateRange[0]!) && testTime.isBefore(dateRange[1]!.add(1, 'day'))
        })
      }
      
      if (selectedTag) {
        filtered = filtered.filter(item => item.problemTags.includes(selectedTag))
      }
      
      setDataSource(filtered)
      setLoading(false)
    }, 300)
  }

  const handleReset = () => {
    setSearchText('')
    setDateRange(null)
    setSelectedTag(undefined)
    setDataSource(mockData)
  }

  const handleViewDetail = (record: ReportRecord) => {
    navigate(`/customer/report/detail/${record.reportId}`, { 
      state: { userId: record.userId, userName: record.userName }
    })
  }

  const handleMarkReview = (record: ReportRecord) => {
    const newData = dataSource.map(item => 
      item.id === record.id ? { ...item, needsReview: !item.needsReview } : item
    )
    setDataSource(newData)
    message.success(record.needsReview ? '已取消复查标记' : '已标记为需要医生复查')
  }

  const handleExport = () => {
    message.success('导出功能开发中...')
  }

  const columns: ColumnsType<ReportRecord> = [
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '最近一次测肤时间',
      dataIndex: 'lastTestTime',
      key: 'lastTestTime',
      width: 180,
      sorter: (a, b) => dayjs(a.lastTestTime).unix() - dayjs(b.lastTestTime).unix(),
    },
    {
      title: '问题标签',
      dataIndex: 'problemTags',
      key: 'problemTags',
      width: 200,
      render: (tags: string[]) => (
        <Space size={[0, 8]} wrap>
          {tags.map(tag => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '是否已阅读',
      dataIndex: 'isRead',
      key: 'isRead',
      width: 120,
      render: (isRead: boolean) => (
        <Tag color={isRead ? 'green' : 'default'}>
          {isRead ? '已阅读' : '未阅读'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_: any, record: ReportRecord) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看报告详情
          </Button>
          <Button 
            type="link" 
            icon={record.needsReview ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
            onClick={() => handleMarkReview(record)}
          >
            {record.needsReview ? '取消复查' : '标记复查'}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space size="middle" wrap>
            <Input
              placeholder="搜索用户手机号或昵称"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              style={{ width: 300 }}
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null] | null)}
            />
            <Select
              placeholder="主要问题标签"
              style={{ width: 150 }}
              allowClear
              value={selectedTag}
              onChange={(value) => setSelectedTag(value)}
            >
              {problemTagOptions.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
            </Select>
            <Button type="primary" onClick={handleSearch} loading={loading}>
              搜索
            </Button>
            <Button onClick={handleReset}>重置</Button>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleExport}
            >
              导出数据
            </Button>
          </Space>
        </div>
        <Table 
          columns={columns} 
          dataSource={dataSource} 
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  )
}

export default CustomerReportManage

