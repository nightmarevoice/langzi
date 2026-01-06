import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

const { Title, Text } = Typography

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      // TODO: 调用后端登录API
      console.log('登录信息:', values)
      
      // 模拟登录验证
      if (values.username === 'admin' && values.password === 'admin123') {
        message.success('登录成功')
        // 保存登录状态到本地存储
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('username', values.username)
        
        // 跳转到仪表盘
        navigate('/')
      } else {
        message.error('用户名或密码错误')
      }
    } catch (error) {
      message.error('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>
      {/* 左侧背景区域 - 60% */}
      <div className={styles.loginLeft}>
        <div className={styles.leftBackground}>
          <div className={styles.imageGallery}>
            <div className={styles.imageItem} style={{ top: '3%', left: '2%', '--rotate': '-15deg' } as React.CSSProperties}>
              <img 
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="美容产品"
              />
            </div>
            <div className={styles.imageItem} style={{ top: '12%', left: '18%', '--rotate': '12deg' } as React.CSSProperties}>
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="医美护理"
              />
            </div>
            <div className={styles.imageItem} style={{ top: '8%', left: '35%', '--rotate': '-10deg' } as React.CSSProperties}>
              <img 
                src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="护肤精华"
              />
            </div>
            
            <div className={styles.imageItem} style={{ top: '35%', left: '25%', '--rotate': '-11deg' } as React.CSSProperties}>
              <img 
                src="https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="肌肤护理"
              />
            </div>
            <div className={styles.imageItem} style={{ top: '22%', left: '42%', '--rotate': '9deg' } as React.CSSProperties}>
              <img 
                src="https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="美容仪器"
              />
            </div>
            <div className={styles.imageItem} style={{ top: '52%', left: '8%', '--rotate': '-13deg' } as React.CSSProperties}>
              <img 
                src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="面部护理"
              />
            </div>
            <div className={styles.imageItem} style={{ top: '58%', left: '30%', '--rotate': '11deg' } as React.CSSProperties}>
              <img 
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="护肤套装"
              />
            </div>
            <div className={styles.imageItem} style={{ bottom: '18%', left: '20', '--rotate': '-8deg' } as React.CSSProperties}>
              <img 
                src="https://images.unsplash.com/photo-1612817288484-6f916006741a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="美容产品"
              />
            </div>
            <div className={styles.imageItem} style={{ bottom: '8%', left: '60%', '--rotate': '13deg' } as React.CSSProperties}>
              <img 
                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="专业护理"
              />
            </div>
          </div>
          <div className={styles.animatedBg}></div>
          <div className={styles.animatedBg2}></div>
          <div className={styles.animatedBg3}></div>
          <div className={styles.leftOverlay}></div>
        </div>
      </div>
      
      {/* 右侧登录区域 - 40% */}
      <div className={styles.loginRight}>
        <Card 
          className={styles.loginCard}
          bodyStyle={{ padding: '36px 32px' }}
        >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className={styles.loginLogo}>
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="20" fill="#1AD299" opacity="0.1"/>
              <path d="M24 12L30 20H18L24 12Z" fill="#1AD299"/>
              <path d="M18 20L24 28L30 20" stroke="#1AD299" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M24 28V36" stroke="#1AD299" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          
          <Title level={2} style={{ 
            margin: '20px 0 8px 0', 
            color: '#2c3e50',
            fontWeight: 600,
            fontSize: 24
          }}>
            朗姿医美管理系统
          </Title>
          
          <Text type="secondary" style={{ 
            fontSize: 14, 
            color: '#7f8c8d',
            display: 'block',
            marginTop: 8,
            lineHeight: 1.6
          }}>
           
            为医美机构提供全方位的数字化管理解决方案
          </Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#1AD299' }} />}
              placeholder="请输入用户名"
              style={{
                borderRadius: '8px',
                borderColor: '#e8e8e8',
                height: '48px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1AD299' }} />}
              placeholder="请输入密码"
              style={{
                borderRadius: '8px',
                borderColor: '#e8e8e8',
                height: '48px'
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: '48px',
                fontSize: '16px',
                fontWeight: 500,
                borderRadius: '8px',
                background: '#1AD299',
                border: 'none',
                color: '#fff',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#149a73'
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(26, 210, 153, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1AD299'
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.loginTip}>
          <Text type="secondary" style={{ fontSize: 12, color: '#95a5a6' }}>
            默认账号: admin / admin123
          </Text>
        </div>
        </Card>
      </div>
    </div>
  )
}

export default Login
