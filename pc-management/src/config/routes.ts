import React, { ReactNode } from 'react'
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  CustomerServiceOutlined,
  BookOutlined,
  SettingOutlined,
  ExperimentOutlined,
  PhoneOutlined,
  RobotOutlined
} from '@ant-design/icons'
import { RouteObject } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import ProtectedRoute from '../components/ProtectedRoute'
import MainLayout from '../layouts/MainLayout'

// 导入页面组件
import ButlerDashboard from '../pages/butler/ButlerDashboard.tsx'
import ButlerConversation from '../pages/butler/ButlerConversation.tsx'
import ButlerCustomerArchive from '../pages/butler/ButlerCustomerArchive.tsx'
import ButlerTicketList from '../pages/butler/ButlerTicketList.tsx'
import CustomerList from '../pages/customer/CustomerList'
import CustomerDetail from '../pages/customer/CustomerDetail'
import CustomerReportManage from '../pages/customer/CustomerReportManage.tsx'
import CustomerReportDetail from '../pages/customer/CustomerReportDetail.tsx'
import VisitTaskList from '../pages/visit/VisitTaskList.tsx'
import VisitTaskForm from '../pages/visit/VisitTaskForm.tsx'
import VisitStrategyConfig from '../pages/visit/VisitStrategyConfig.tsx'
import ProductList from '../pages/product/ProductList.tsx'
import ProductDetail from '../pages/product/ProductDetail.tsx'
import OrderList from '../pages/product/OrderList.tsx'
import ConversationCenter from '../pages/customer-service/ConversationCenter.tsx'
import PushRuleManage from '../pages/customer-service/PushRuleManage.tsx'
import PushContentManage from '../pages/customer-service/PushContentManage.tsx'
import CustomerServiceReport from '../pages/customer-service/CustomerServiceReport.tsx'
import SkinKnowledgeBase from '../pages/knowledge/SkinKnowledgeBase'
import ScriptLibrary from '../pages/knowledge/ScriptLibrary'
import StyleToneLibrary from '../pages/knowledge/StyleToneLibrary.tsx'
import QALibrary from '../pages/knowledge/QALibrary'
import QuestionIntentLibrary from '../pages/knowledge/QuestionIntentLibrary.tsx'
import UserManage from '../pages/organization/UserManage.tsx'
import RoleManage from '../pages/organization/RoleManage.tsx'
import SystemConfig from '../pages/organization/SystemConfig.tsx'
import SystemLog from '../pages/organization/SystemLog.tsx'
import AuditLog from '../pages/organization/AuditLog.tsx'
import ModelParameterConfig from '../pages/model/ModelParameterConfig'
import ModelPromptConfig from '../pages/model/ModelPromptConfig.tsx'
import ModelCallLog from '../pages/model/ModelCallLog'
import ModelCallStats from '../pages/model/ModelCallStats'
import OutboundChannelConfig from '../pages/outbound/OutboundChannelConfig'
import OutboundRealtimeMonitor from '../pages/outbound/OutboundRealtimeMonitor'
import OutboundAgentAIMonitor from '../pages/outbound/OutboundAgentAIMonitor'

export interface RouteConfig {
  key: string
  path: string
  label: string
  icon?: ReactNode
  component?: React.ComponentType
  children?: RouteConfig[]
}

export const routeConfig: RouteConfig[] = [
  {
    key: '/dashboard',
    path: '/dashboard',
    label: 'AI测肤运营总览',
    icon: React.createElement(DashboardOutlined),
    component: Dashboard
  },
  //智能管家
  {
    key: '/butler',
    path: '/butler',
    label: '智能管家',
    icon: React.createElement(RobotOutlined),
    children: [
      {
        key: '/butler/overview',
        path: '/butler/overview',
        label: '管家总览',
        component: ButlerDashboard
      },
      {
        key: '/butler/conversation',
        path: '/butler/conversation',
        label: '管家会话',
        component: ButlerConversation
      },
      {
        key: '/butler/customer-archive',
        path: '/butler/customer-archive',
        label: '服务客户档案',
        component: ButlerCustomerArchive
      },
      {
        key: '/butler/tickets',
        path: '/butler/tickets',
        label: '管家工单',
        component: ButlerTicketList
      }
    ]
  },
  {
    key: '/customer',
    path: '/customer',
    label: '客户管理',
    icon: React.createElement(TeamOutlined),
    children: [
      {
        key: '/customer/list',
        path: '/customer/list',
        label: '客户列表',
        component: CustomerList
      },
      {
        key: '/customer/report',
        path: '/customer/report',
        label: '客户报告管理',
        component: CustomerReportManage
      }
    ]
  },
  {
    key: '/visit',
    path: '/visit',
    label: '回访任务',
    icon: React.createElement(FileTextOutlined),
    children: [
      {
        key: '/visit/task-list',
        path: '/visit/task-list',
        label: '任务列表',
        component: VisitTaskList
      },
      {
        key: '/visit/strategy-config',
        path: '/visit/strategy-config',
        label: '回访策略配置',
        component: VisitStrategyConfig
      }
    ]
  },
  {
    key: '/product',
    path: '/product',
    label: '商品管理',
    icon: React.createElement(ShoppingOutlined),
    children: [
      {
        key: '/product/list',
        path: '/product/list',
        label: '商品列表',
        component: ProductList
      },
      {
        key: '/product/order',
        path: '/product/order',
        label: '订单管理',
        component: OrderList
      }
    ]
  },
  {
    key: '/customer-service',
    path: '/customer-service',
    label: '智能客服管理',
    icon: React.createElement(CustomerServiceOutlined),
    children: [
      {
        key: '/customer-service/conversation-center',
        path: '/customer-service/conversation-center',
        label: '会话中心',
        component: ConversationCenter
      },
      {
        key: '/customer-service/push-rule',
        path: '/customer-service/push-rule',
        label: '推送规则管理',
        component: PushRuleManage
      },
      {
        key: '/customer-service/push-content',
        path: '/customer-service/push-content',
        label: '推送内容管理',
        component: PushContentManage
      }
    ]
  },
  {
    key: '/knowledge',
    path: '/knowledge',
    label: '知识库管理',
    icon: React.createElement(BookOutlined),
    children: [
      {
        key: '/knowledge/skin',
        path: '/knowledge/skin',
        label: '皮肤知识库',
        component: SkinKnowledgeBase
      },
      //问题意图库
      {
        key: '/knowledge/intent',
        path: '/knowledge/intent',
        label: '问题意图库',
        component: QuestionIntentLibrary
      },
      {
        key: '/knowledge/script',
        path: '/knowledge/script',
        label: '话术库',
        component: ScriptLibrary
      },
      {
        key: '/knowledge/style',
        path: '/knowledge/style',
        label: '风格语气库',
        component: StyleToneLibrary
      },
      {
        key: '/knowledge/qa',
        path: '/knowledge/qa',
        label: '问答语料库',
        component: QALibrary
      }
    ]
  },
  // 模型配置管理
  {
    key: '/model',
    path: '/model',
    label: '模型管理',
    icon: React.createElement(ExperimentOutlined),
    children: [
      {
        key: '/model/stats',
        path: '/model/stats',
        label: '模型调用统计',
        component: ModelCallStats
      },
      {
        key: '/model/parameter',
        path: '/model/parameter',
        label: '模型参数配置',
        component: ModelParameterConfig
      },
      {
        key: '/model/prompt',
        path: '/model/prompt',
        label: '模型提示词配置',
        component: ModelPromptConfig
      }
    ]
  },
  //外呼管理
  {
    key: '/outbound',
    path: '/outbound',
    label: '外呼管理',
    icon: React.createElement(PhoneOutlined),
    children: [
      {
        key: '/outbound/channel',
        path: '/outbound/channel',
        label: '外呼通道管理',
        component: OutboundChannelConfig
      },
      {
        key: '/outbound/realtime',
        path: '/outbound/realtime',
        label: '实时外呼监控',
        component: OutboundRealtimeMonitor
      },
      {
        key: '/outbound/online-monitor',
        path: '/outbound/online-monitor',
        label: '在线坐席/AI监控',
        component: OutboundAgentAIMonitor
      }
    ]
  },
  {
    key: '/organization',
    path: '/organization',
    label: '组织管理',
    icon: React.createElement(SettingOutlined),
    children: [
      {
        key: '/organization/user',
        path: '/organization/user',
        label: '用户管理',
        component: UserManage
      },
      {
        key: '/organization/role',
        path: '/organization/role',
        label: '角色管理',
        component: RoleManage
      },
      {
        key: '/organization/config',
        path: '/organization/config',
        label: '系统配置',
        component: SystemConfig
      },
      {
        key: '/organization/system-log',
        path: '/organization/system-log',
        label: '系统日志',
        component: SystemLog
      },
      {
        key: '/organization/audit-log',
        path: '/organization/audit-log',
        label: '审计日志',
        component: AuditLog
      }
    ]
  },
  //系统日志
  {
    key: '/system-log',
    path: '/system-log',
    label: '系统日志',
    icon: React.createElement(FileTextOutlined),
    children: [
      {
        key: '/organization/system-log',
        path: '/organization/system-log',
        label: '系统日志',
        component: SystemLog
      },
      {
        key: '/organization/audit-log',
        path: '/organization/audit-log',
        label: '审计日志',
        component: AuditLog
      },
      // 模型调用日志
      {
        key: '/system-log/model-call',
        path: '/system-log/model-call',
        label: '模型调用日志',
        component: ModelCallLog
      }
    ]
  }
]

// 扁平化路由配置，用于生成路由
const flattenRoutes = (routes: RouteConfig[]): RouteConfig[] => {
  const result: RouteConfig[] = []
  routes.forEach(route => {
    if (route.component) {
      result.push(route)
    }
    if (route.children) {
      result.push(...flattenRoutes(route.children))
    }
  })
  return result
}

// 导出菜单项（用于Sidebar，支持嵌套）
export const menuItems = routeConfig.map(route => {
  if (route.children && route.children.length > 0) {
    return {
      key: route.key,
      icon: route.icon,
      label: route.label,
      children: route.children.map(child => ({
        key: child.key,
        label: child.label
      }))
    }
  }
  return {
    key: route.key,
    icon: route.icon,
    label: route.label
  }
})

// 导出路由配置（用于App.tsx）
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: React.createElement(Login)
  },
  {
    path: '/',
    element: React.createElement(ProtectedRoute, {
      children: React.createElement(MainLayout)
    }),
    children: [
      {
        path: '',
        element: React.createElement(Dashboard)
      },
      ...flattenRoutes(routeConfig).map(route => ({
        path: route.path.replace(/^\//, ''),
        element: route.component ? React.createElement(route.component) : null
      })).filter(route => route.element !== null),
      // 客户详情页
      {
        path: 'customer/detail/:id',
        element: React.createElement(CustomerDetail)
      },
      // 报告详情页使用 MainLayout（显示菜单和头部，但菜单中不显示报告菜单）
      {
        path: 'customer/report/detail/:reportId',
        element: React.createElement(CustomerReportDetail)
      },
      // 回访任务表单页
      {
        path: 'visit/task-form/:id?',
        element: React.createElement(VisitTaskForm)
      },
      // 回访任务详情页
      {
        path: 'visit/task-detail/:id',
        element: React.createElement(VisitTaskList) // 暂时使用列表页，后续可以创建详情页
      },
      // 商品详情页
      {
        path: 'product/detail/:id',
        element: React.createElement(ProductDetail)
      }
    ]
  }
]
