import React from 'react'
import { Card, Form, Input, Button, Space, Switch, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

const SystemConfig: React.FC = () => {
  const [form] = Form.useForm()

  const handleSubmit = (values: any) => {
    console.log('保存配置:', values)
    message.success('配置保存成功')
  }

  return (
    <div>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            systemName: '客户管理系统',
            systemLogo: '',
            enableNotification: true,
            enableAudit: true,
            sessionTimeout: 30,
          }}
        >
          <Form.Item
            label="系统名称"
            name="systemName"
            rules={[{ required: true, message: '请输入系统名称' }]}
          >
            <Input placeholder="请输入系统名称" />
          </Form.Item>

          <Form.Item
            label="系统Logo"
            name="systemLogo"
          >
            <Input placeholder="请输入Logo URL" />
          </Form.Item>

          <Form.Item
            label="启用通知"
            name="enableNotification"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="启用审计日志"
            name="enableAudit"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="会话超时时间（分钟）"
            name="sessionTimeout"
            rules={[{ required: true, message: '请输入会话超时时间' }]}
          >
            <Input type="number" placeholder="请输入会话超时时间" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存配置
              </Button>
              <Button onClick={() => form.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default SystemConfig

