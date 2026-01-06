import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Space, Tag } from 'antd'
import { Column, Line, Pie } from '@ant-design/charts'
import type { ColumnConfig, LineConfig, PieConfig } from '@ant-design/charts'
import dayjs from 'dayjs'

interface ModelDailyCall {
  date: string
  model: string
  calls: number
  tokens: number
}

interface ModelCategoryShare {
  category: string
  value: number
}

interface ModelTokenShare {
  model: string
  value: number
}

const ModelCallStats: React.FC = () => {
  const [weekCallTrend, setWeekCallTrend] = useState<ModelDailyCall[]>([])
  const [weekTokenTrend, setWeekTokenTrend] = useState<ModelDailyCall[]>([])
  const [categoryShare, setCategoryShare] = useState<ModelCategoryShare[]>([])
  const [monthModelTokenShare, setMonthModelTokenShare] = useState<ModelTokenShare[]>([])

  const [summary, setSummary] = useState({
    weekTotalCalls: 0,
    weekTotalTokens: 0,
    monthTotalTokens: 0
  })

  useEffect(() => {
    // 模拟静态数据，后续可替换为接口
    const models = [
      { name: 'gpt-4.1-mini', category: '会话类' },
      { name: 'gpt-4.1', category: '推理类' },
      { name: 'embedding-3-large', category: '向量嵌入' },
      { name: 'claude-3.5-sonnet', category: '推理类' }
    ]

    const weekCalls: ModelDailyCall[] = []
    const weekTokens: ModelDailyCall[] = []

    // 近 7 天按模型生成调用量 / token 量
    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day').format('MM-DD')
      models.forEach(m => {
        const baseCalls =
          m.name === 'gpt-4.1-mini'
            ? 800
            : m.name === 'gpt-4.1'
            ? 320
            : m.name === 'embedding-3-large'
            ? 260
            : 180
        const calls = Math.floor(baseCalls * (0.7 + Math.random() * 0.6))
        const avgTokensPerCall =
          m.name === 'embedding-3-large' ? 900 : m.name === 'gpt-4.1-mini' ? 650 : 1200
        const tokens = calls * avgTokensPerCall

        weekCalls.push({
          date,
          model: m.name,
          calls,
          tokens
        })
        weekTokens.push({
          date,
          model: m.name,
          calls,
          tokens
        })
      })
    }

    setWeekCallTrend(weekCalls)
    setWeekTokenTrend(weekTokens)

    const weekTotalCalls = weekCalls.reduce((sum, item) => sum + item.calls, 0)
    const weekTotalTokens = weekTokens.reduce((sum, item) => sum + item.tokens, 0)

    // 模型分类占比（按调用次数）
    const categoryMap: Record<string, number> = {}
    weekCalls.forEach(item => {
      const model = models.find(m => m.name === item.model)
      if (!model) return
      categoryMap[model.category] = (categoryMap[model.category] || 0) + item.calls
    })
    const categoryData: ModelCategoryShare[] = Object.keys(categoryMap).map(key => ({
      category: key,
      value: categoryMap[key]
    }))
    setCategoryShare(categoryData)

    // 各个模型近一个月 token 占比（按模型聚合）
    const monthModelMap: Record<string, number> = {}
    for (let d = 29; d >= 0; d--) {
      models.forEach(m => {
        const baseTokens =
          m.name === 'gpt-4.1-mini'
            ? 600000
            : m.name === 'gpt-4.1'
            ? 450000
            : m.name === 'embedding-3-large'
            ? 380000
            : 260000
        const tokens = Math.floor(baseTokens * (0.85 + Math.random() * 0.3))
        monthModelMap[m.name] = (monthModelMap[m.name] || 0) + tokens
      })
    }
    const monthData: ModelTokenShare[] = Object.keys(monthModelMap).map(key => ({
      model: key,
      value: monthModelMap[key]
    }))
    const monthTotalTokens = monthData.reduce((sum, item) => sum + item.value, 0)
    setMonthModelTokenShare(monthData)

    setSummary({
      weekTotalCalls,
      weekTotalTokens,
      monthTotalTokens
    })
  }, [])

  const weekCallConfig: ColumnConfig = {
    data: weekCallTrend,
    xField: 'date',
    yField: 'calls',
    seriesField: 'model',
    isStack: true,
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.model,
        value: `${datum.calls}次`
      })
    },
    yAxis: {
      label: {
        formatter: (text: string) => `${text}次`
      }
    },
    legend: {
      position: 'top'
    }
  }

  const weekTokenConfig: LineConfig = {
    data: weekTokenTrend,
    xField: 'date',
    yField: 'tokens',
    seriesField: 'model',
    smooth: true,
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.model,
        value: `${datum.tokens.toLocaleString()} Tokens`
      })
    },
    yAxis: {
      label: {
        formatter: (text: string) => `${Number(text) / 1000}k`
      }
    },
    legend: {
      position: 'top'
    }
  }

  const categoryPieConfig: PieConfig = {
    data: categoryShare,
    angleField: 'value',
    colorField: 'category',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{percentage}',
      style: {
        fontSize: 14
      }
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.category,
        value: `${datum.value}次`
      })
    }
  }

  const monthTokenPieConfig: PieConfig = {
    data: monthModelTokenShare,
    angleField: 'value',
    colorField: 'model',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{percentage}',
      style: {
        fontSize: 14
      }
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.model,
        value: `${datum.value.toLocaleString()} Tokens`
      })
    }
  }

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>模型调用统计</h2>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="近一周模型总调用次数"
              value={summary.weekTotalCalls}
              suffix="次"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="近一周模型总 Token 消耗"
              value={summary.weekTotalTokens}
              valueRender={node => (
                <Space>
                  {node}
                  <Tag color="blue">
                    {(summary.weekTotalTokens / 1000000).toFixed(2)} M Tokens
                  </Tag>
                </Space>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="近一月模型总 Token 消耗"
              value={summary.monthTotalTokens}
              valueRender={node => (
                <Space>
                  {node}
                  <Tag color="purple">
                    {(summary.monthTotalTokens / 1000000).toFixed(2)} M Tokens
                  </Tag>
                </Space>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="近一周模型调用次数（按日统计）">
            <Column {...weekCallConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="模型调用分类占比（按调用次数）">
            <Pie {...categoryPieConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card title="近一周 Token 消耗趋势（按模型分组）">
            <Line {...weekTokenConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="各模型近一月 Token 消耗占比">
            <Pie {...monthTokenPieConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ModelCallStats


