import React from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

const { Content } = Layout

const BlankLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content 
        style={{ 
          padding: '24px',
          background: '#f0f2f5',
          minHeight: '100vh',
          overflow: 'auto'
        }}
      >
        <div className="bg-white p-6 rounded-lg shadow-sm" style={{ minHeight: 'calc(100vh - 48px)' }}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  )
}

export default BlankLayout

