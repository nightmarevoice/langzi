import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Alert, Tag, Space, Spin } from 'antd'
import { 
  SkinOutlined, 
  FileTextOutlined, 
  MessageOutlined, 
  ShoppingOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { Column, Line, Bar } from '@ant-design/charts'
import type { LineConfig, ColumnConfig, BarConfig } from '@ant-design/charts'
import dayjs from 'dayjs'

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true)
  
  // 核心指标数据
  const [metrics, setMetrics] = useState({
    todayTests: 0,
    weekTests: 0,
    validReports: 0,
    qaConsultations: 0,
    productClicks: 0,
    productConversions: 0,
    conversionRate: 0,
    passRate: 0, // 通过质检率
  })

  // 测肤量趋势数据（最近7天）
  const [trendData, setTrendData] = useState<any[]>([])
  
  // 皮肤问题占比数据
  const [problemData, setProblemData] = useState<any[]>([])
  
  // 高危病例数
  const [highRiskCount, setHighRiskCount] = useState(0)

  // 模拟数据加载
  useEffect(() => {
    setLoading(true)
    
    // 模拟异步加载
    setTimeout(() => {
      // 生成合理的核心指标数据
      const todayTests = Math.floor(Math.random() * 500) + 800 // 800-1300之间
      const validReports = Math.floor(todayTests * 0.85) // 有效报告约为测肤次数的85%
      const passRate = (validReports / todayTests) * 100
      
      // 本周测肤次数 = 今日 * 7 + 一些波动
      const weekTests = todayTests * 7 + Math.floor(Math.random() * 1000) - 500
      
      // Q&A咨询次数约为测肤次数的25-35%
      const qaConsultations = Math.floor(todayTests * (0.25 + Math.random() * 0.1))
      
      // 商品推荐点击约为测肤次数的60-80%
      const productClicks = Math.floor(todayTests * (0.6 + Math.random() * 0.2))
      
      // 商品转化数约为点击的10-20%
      const productConversions = Math.floor(productClicks * (0.1 + Math.random() * 0.1))
      
      // 转化率
      const conversionRate = productClicks > 0 ? (productConversions / productClicks) * 100 : 0

      setMetrics({
        todayTests,
        weekTests,
        validReports,
        qaConsultations,
        productClicks,
        productConversions,
        conversionRate: Number(conversionRate.toFixed(2)),
        passRate: Number(passRate.toFixed(1)),
      })

      // 生成最近7天的趋势数据（更贴近真实波动）
      const dates: string[] = []
      const values: number[] = []
      let baseValue = todayTests
      
      for (let i = 6; i >= 0; i--) {
        const date = dayjs().subtract(i, 'day')
        dates.push(date.format('MM-DD'))
        // 每天的数据在基础值上下波动20%
        const variation = (Math.random() - 0.5) * 0.4 // -20% 到 +20%
        const value = Math.floor(baseValue * (1 + variation))
        values.push(value)
        baseValue = value // 下一天基于前一天的值
      }
      
      setTrendData(
        dates.map((date, index) => ({
          date,
          value: values[index],
        }))
      )

      // 生成皮肤问题占比数据（总和为100%）
      const problems = [
        { type: '痘痘', baseValue: 32 },
        { type: '色斑', baseValue: 25 },
        { type: '毛孔粗大', baseValue: 18 },
        { type: '黑头', baseValue: 12 },
        { type: '敏感', baseValue: 8 },
        { type: '其他', baseValue: 5 },
      ]
      
      // 添加一些随机波动，但保持总和接近100
      const adjustedProblems = problems.map((p, index) => {
        const variation = index < problems.length - 1 
          ? (Math.random() - 0.5) * 2 // ±1%
          : 0 // 最后一项用于调整总和
        return {
          type: p.type,
          value: Math.max(1, Math.round(p.baseValue + variation)),
        }
      })
      
      // 调整最后一项使总和为100
      const currentSum = adjustedProblems.slice(0, -1).reduce((sum, p) => sum + p.value, 0)
      adjustedProblems[adjustedProblems.length - 1].value = Math.max(1, 100 - currentSum)
      
      setProblemData(adjustedProblems)

      // 高危病例数约为有效报告数的2-5%
      setHighRiskCount(Math.floor(validReports * (0.02 + Math.random() * 0.03)))
      
      setLoading(false)
    }, 500)
  }, [])

  // 趋势图配置
  const trendConfig: LineConfig = {
    data: trendData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    point: {
      size: 4,
      shape: 'circle',
    },
    color: '#1890ff',
    label: {
      style: {
        fill: '#666',
        fontSize: 12,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: '测肤次数', value: `${datum.value}次` }
      },
    },
    yAxis: {
      label: {
        formatter: (text: string) => `${text}次`,
      },
    },
  }

  // 皮肤问题占比条形图配置
  const barConfig: BarConfig = {
    data: problemData,
    xField: 'value',
    yField: 'type',
    seriesField: 'type',
    color: ['#ff4d4f', '#ff7a45', '#ffa940', '#ffc53d', '#ffec3d', '#bae637'],
    label: {
      position: 'right',
      formatter: (datum: any) => ``,
      style: {
        fontSize: 12,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.type, value: `` }
      },
    },
    legend: false,
    barStyle: {
      radius: [0, 4, 4, 0],
    },
  }

  // 皮肤问题占比柱状图配置
  const columnConfig: ColumnConfig = {
    data: problemData,
    xField: 'type',
    yField: 'value',
    color: '#1890ff',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'top',
      formatter: (datum: any) => ``,
      style: {
        fill: '#666',
        fontSize: 12,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.type, value: `` }
      },
    },
    yAxis: {
      label: {
        formatter: (text: string) => `${text}%`,
      },
    },
  }

  if (loading) {
    return (
      <div style={{ 
        padding: '24px', 
        background: '#f0f2f5', 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>
        AI测肤运营总览
      </h1>

      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
              title="今日测肤次数"
              value={metrics.todayTests}
              prefix={<SkinOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
              suffix="次"
              />
            </Card>
          </Col>
        <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
              title="本周测肤次数"
              value={metrics.weekTests}
              prefix={<SkinOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              suffix="次"
              />
            </Card>
          </Col>
        <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
              title="有效报告数"
              value={metrics.validReports}
              prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
              suffix="份"
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
              通过质检率: {metrics.passRate}%
            </div>
            </Card>
          </Col>
        <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
              title="Q&A 咨询次数"
              value={metrics.qaConsultations}
              prefix={<MessageOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
              suffix="次"
              />
            </Card>
          </Col>
        </Row>

      {/* 商品推荐指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="商品推荐点击"
              value={metrics.productClicks}
              prefix={<ShoppingOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
              suffix="次"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="商品转化数"
              value={metrics.productConversions}
              prefix={<CheckCircleOutlined style={{ color: '#eb2f96' }} />}
              valueStyle={{ color: '#eb2f96' }}
              suffix="单"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="转化率"
              value={metrics.conversionRate}
              prefix={
                metrics.conversionRate > 15 ? (
                  <ArrowUpOutlined style={{ color: '#52c41a' }} />
                ) : (
                  <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
                )
              }
              valueStyle={{ 
                color: metrics.conversionRate > 15 ? '#52c41a' : '#ff4d4f' 
              }}
              suffix="%"
              precision={2}
            />
          </Card>
        </Col>
      </Row>
      
      {/* 高危/特殊病例提示 */}
      {highRiskCount > 0 && (
        <Alert
          message={
          <Space>
              <WarningOutlined />
              <span>需要人工医生复核的报告</span>
              <Tag color="error" style={{ fontSize: '16px', padding: '4px 12px' }}>
                {highRiskCount} 份
              </Tag>
          </Space>
        }
          description="检测到高危或特殊病例，建议尽快安排医生复核"
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
          action={
            <a href="#" style={{ color: '#fa8c16' }}>
              查看详情
            </a>
          }
        />
      )}

      {/* 趋势图和占比图 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="测肤量趋势（最近7天）" style={{ minHeight: '400px' }}>
            {trendData.length > 0 ? (
              <Line {...trendConfig} height={320} />
            ) : (
              <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                暂无数据
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="各皮肤问题占比" style={{ minHeight: '400px' }}>
            {problemData.length > 0 ? (
              <Bar {...barConfig} height={320} />
            ) : (
              <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                暂无数据
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 皮肤问题占比柱状图 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24}>
          <Card title="各皮肤问题占比（柱状图）" style={{ minHeight: '350px' }}>
            {problemData.length > 0 ? (
              <Column {...columnConfig} height={280} />
            ) : (
              <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                暂无数据
              </div>
            )}
      </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
