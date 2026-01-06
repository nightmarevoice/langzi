import React from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { menuItems } from '../config/routes'

const { Sider } = Layout

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 如果是报告详情页，过滤掉报告菜单项
  const getFilteredMenuItems = () => {
    if (location.pathname.includes('/customer/report/detail/')) {
      return menuItems.map(item => {
        // 如果是客户管理菜单且有子菜单，过滤掉报告菜单项
        if (item.key === '/customer' && 'children' in item && item.children) {
          const filteredChildren = item.children.filter(child => child.key !== '/customer/report')
          // 如果过滤后还有子菜单，返回过滤后的菜单；否则返回原菜单（保留客户列表）
          if (filteredChildren.length > 0) {
            return {
              ...item,
              children: filteredChildren
            }
          }
        }
        return item
      })
    }
    return menuItems
  }

  return (
    <Sider 
      width={200} 
      style={{ 
        background: '#fff',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1001
      }}
    >
      <div style={{ 
        padding: '10px',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: '#fff',
      }}>
        <div style={{ 
          width: 40, 
          height: 40, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="20" fill="#1AD299" opacity="0.1"/>
            <path d="M24 12L30 20H18L24 12Z" fill="#1AD299"/>
            <path d="M18 20L24 28L30 20" stroke="#1AD299" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M24 28V36" stroke="#1AD299" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ 
          fontWeight: 600,
          fontSize: 16,
          color: '#2c3e50',
          lineHeight: 1.2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          朗姿医美管理系统
        </div>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: '100%', borderRight: 0 }}
        items={getFilteredMenuItems()}
        onClick={({ key }: { key: string }) => navigate(key)}
      />
    </Sider>
  )
}

export default Sidebar
