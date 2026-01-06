import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { MessageOutlined, UserOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'

const CustomerServiceDashboard: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>智能客服看板</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日咨询量"
              value={0}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线用户数"
              value={0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1AD299' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已解决问题"
              value={0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理问题"
              value={0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CustomerServiceDashboard

