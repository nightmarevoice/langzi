import React, { useState, useMemo } from 'react'
import { Layout, Breadcrumb, Avatar, Dropdown, Space, message, Badge, Popover, List, Typography, Divider } from 'antd'
import { 
  UserOutlined, 
  LogoutOutlined, 
  BellOutlined, 
  NotificationOutlined, 
  MailOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { routeConfig } from '../config/routes'

const { Text } = Typography

const { Header: AntHeader } = Layout

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const username = localStorage.getItem('username') || 'Admin'
  
  // 模拟未读消息数量
  const [messageCount, setMessageCount] = useState(3)
  const [notificationCount, setNotificationCount] = useState(5)
  const [mailCount, setMailCount] = useState(2)
  const [taskCount, setTaskCount] = useState(1)

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('username')
    message.success('已退出登录')
    navigate('/login')
  }

  const items: MenuProps['items'] = [
    {
      key: 'user',
      label: `当前用户: ${username}`,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  // 消息列表内容
  const messageContent = (
    <div style={{ width: 320, maxHeight: 400, overflowY: 'auto' }}>
      <div style={{ padding: '8px 16px', fontWeight: 'bold', borderBottom: '1px solid #f0f0f0' }}>
        消息通知
      </div>
      <List
        size="small"
        dataSource={[
          { id: 1, title: '系统更新通知', time: '2分钟前', read: false },
          { id: 2, title: '新任务待处理', time: '10分钟前', read: false },
          { id: 3, title: '流程审批提醒', time: '1小时前', read: false },
        ]}
        renderItem={(item) => (
          <List.Item 
            style={{ cursor: 'pointer', padding: '12px 16px' }}
            onClick={() => {
              message.info(`查看: ${item.title}`)
              setMessageCount(Math.max(0, messageCount - 1))
            }}
          >
            <List.Item.Meta
              title={<Text strong={!item.read}>{item.title}</Text>}
              description={<Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>}
            />
          </List.Item>
        )}
      />
      <Divider style={{ margin: 0 }} />
      <div style={{ padding: '8px 16px', textAlign: 'center', cursor: 'pointer' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>查看全部消息</Text>
      </div>
    </div>
  )

  // 通知列表内容
  const notificationContent = (
    <div style={{ width: 320, maxHeight: 400, overflowY: 'auto' }}>
      <div style={{ padding: '8px 16px', fontWeight: 'bold', borderBottom: '1px solid #f0f0f0' }}>
        系统通知
      </div>
      <List
        size="small"
        dataSource={[
          { id: 1, title: '数据备份完成', time: '5分钟前' },
          { id: 2, title: '安全扫描通过', time: '30分钟前' },
          { id: 3, title: '系统维护计划', time: '2小时前' },
        ]}
        renderItem={(item) => (
          <List.Item 
            style={{ cursor: 'pointer', padding: '12px 16px' }}
            onClick={() => {
              message.info(`查看: ${item.title}`)
              setNotificationCount(Math.max(0, notificationCount - 1))
            }}
          >
            <List.Item.Meta
              title={<Text>{item.title}</Text>}
              description={<Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>}
            />
          </List.Item>
        )}
      />
      <Divider style={{ margin: 0 }} />
      <div style={{ padding: '8px 16px', textAlign: 'center', cursor: 'pointer' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>查看全部通知</Text>
      </div>
    </div>
  )

  // 邮件列表内容
  const mailContent = (
    <div style={{ width: 320, maxHeight: 400, overflowY: 'auto' }}>
      <div style={{ padding: '8px 16px', fontWeight: 'bold', borderBottom: '1px solid #f0f0f0' }}>
        邮件消息
      </div>
      <List
        size="small"
        dataSource={[
          { id: 1, title: '重要：项目进度报告', time: '1小时前' },
          { id: 2, title: '会议邀请', time: '3小时前' },
        ]}
        renderItem={(item) => (
          <List.Item 
            style={{ cursor: 'pointer', padding: '12px 16px' }}
            onClick={() => {
              message.info(`查看: ${item.title}`)
              setMailCount(Math.max(0, mailCount - 1))
            }}
          >
            <List.Item.Meta
              title={<Text>{item.title}</Text>}
              description={<Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>}
            />
          </List.Item>
        )}
      />
      <Divider style={{ margin: 0 }} />
      <div style={{ padding: '8px 16px', textAlign: 'center', cursor: 'pointer' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>查看全部邮件</Text>
      </div>
    </div>
  )

  // 任务列表内容
  const taskContent = (
    <div style={{ width: 320, maxHeight: 400, overflowY: 'auto' }}>
      <div style={{ padding: '8px 16px', fontWeight: 'bold', borderBottom: '1px solid #f0f0f0' }}>
        待办任务
      </div>
      <List
        size="small"
        dataSource={[
          { id: 1, title: '审核用户申请', time: '今天', priority: 'high' },
        ]}
        renderItem={(item) => (
          <List.Item 
            style={{ cursor: 'pointer', padding: '12px 16px' }}
            onClick={() => {
              message.info(`查看: ${item.title}`)
              setTaskCount(Math.max(0, taskCount - 1))
            }}
          >
            <List.Item.Meta
              title={<Text strong>{item.title}</Text>}
              description={<Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>}
            />
          </List.Item>
        )}
      />
      <Divider style={{ margin: 0 }} />
      <div style={{ padding: '8px 16px', textAlign: 'center', cursor: 'pointer' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>查看全部任务</Text>
      </div>
    </div>
  )

  // 根据当前路径获取面包屑路径
  const breadcrumbItems = useMemo(() => {
    const currentPath = location.pathname
    const items: { title: string }[] = []

    // 处理特殊路径（详情页、表单页等）
    if (currentPath.includes('/customer/detail/')) {
      items.push({ title: '客户管理' })
      items.push({ title: '客户详情' })
      return items
    }
    if (currentPath.includes('/customer/report/detail/')) {
      items.push({ title: '客户管理' })
      items.push({ title: '客户报告管理' })
      items.push({ title: '报告详情' })
      return items
    }
    if (currentPath.includes('/product/detail/')) {
      items.push({ title: '商品管理' })
      items.push({ title: '商品详情' })
      return items
    }
    if (currentPath.includes('/visit/task-form')) {
      items.push({ title: '回访任务' })
      items.push({ title: '任务表单' })
      return items
    }
    if (currentPath.includes('/visit/task-detail/')) {
      items.push({ title: '回访任务' })
      items.push({ title: '任务详情' })
      return items
    }

    // 遍历路由配置，查找匹配的路由
    for (const route of routeConfig) {
      // 检查是否是直接匹配（一级菜单）
      if (route.path === currentPath || currentPath.startsWith(route.path + '/')) {
        // 如果是一级菜单且有子菜单
        if (route.children && route.children.length > 0) {
          items.push({ title: route.label })
          
          // 查找匹配的子菜单
          let foundChild = false
          for (const child of route.children) {
            // 精确匹配或路径前缀匹配
            if (child.path === currentPath || 
                (currentPath.startsWith(child.path + '/') && child.path !== route.path)) {
              items.push({ title: child.label })
              foundChild = true
              break
            }
          }
          
          // 如果没有找到精确匹配的子菜单，但路径匹配一级菜单，显示一级菜单
          if (!foundChild && route.path !== currentPath) {
            // 可能是详情页或其他子路径，已经在上面处理了
          }
        } else {
          // 一级菜单，没有子菜单（如 Dashboard）
          items.push({ title: route.label })
        }
        break
      }
    }

    // 如果没有找到匹配的路由，显示默认
    if (items.length === 0) {
      if (currentPath === '/' || currentPath === '') {
        items.push({ title: 'AI测肤运营总览' })
      } else {
        items.push({ title: '首页' })
      }
    }

    return items
  }, [location.pathname])

  return (
    <AntHeader style={{ 
      position: 'fixed',
      top: 0,
      right: 0,
      left: 200,
      zIndex: 1000,
      padding: '0 24px', 
      background: '#fff', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      borderBottom: '1px solid #f0f0f0',
      height: 64,
      lineHeight: '64px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <Breadcrumb>
        {breadcrumbItems.map((item, index) => (
          <Breadcrumb.Item key={index}>{item.title}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
      <Space size="large">
        {/* 消息通知 */}
        <Popover 
          content={messageContent} 
          title={null}
          trigger="click"
          placement="bottomRight"
          overlayStyle={{ padding: 0 }}
        >
          <Badge count={messageCount} size="small" offset={[-2, 2]}>
            <BellOutlined 
              style={{ 
                fontSize: 20, 
                color: '#666', 
                cursor: 'pointer',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1AD299'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
            />
          </Badge>
        </Popover>

        {/* 系统通知 */}
        <Popover 
          content={notificationContent} 
          title={null}
          trigger="click"
          placement="bottomRight"
          overlayStyle={{ padding: 0 }}
        >
          <Badge count={notificationCount} size="small" offset={[-2, 2]}>
            <NotificationOutlined 
              style={{ 
                fontSize: 20, 
                color: '#666', 
                cursor: 'pointer',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1AD299'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
            />
          </Badge>
        </Popover>

        {/* 邮件消息 */}
        <Popover 
          content={mailContent} 
          title={null}
          trigger="click"
          placement="bottomRight"
          overlayStyle={{ padding: 0 }}
        >
          <Badge count={mailCount} size="small" offset={[-2, 2]}>
            <MailOutlined 
              style={{ 
                fontSize: 20, 
                color: '#666', 
                cursor: 'pointer',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1AD299'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
            />
          </Badge>
        </Popover>

        {/* 任务提醒 */}
        <Popover 
          content={taskContent} 
          title={null}
          trigger="click"
          placement="bottomRight"
          overlayStyle={{ padding: 0 }}
        >
          <Badge count={taskCount} size="small" offset={[-2, 2]}>
            <CheckCircleOutlined 
              style={{ 
                fontSize: 20, 
                color: '#666', 
                cursor: 'pointer',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1AD299'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
            />
          </Badge>
        </Popover>

        {/* 用户头像 */}
        <Dropdown menu={{ items }} placement="bottomRight">
          <Avatar 
            icon={<UserOutlined />} 
            style={{ cursor: 'pointer' }}
          />
        </Dropdown>
      </Space>
    </AntHeader>
  )
}

export default Header
