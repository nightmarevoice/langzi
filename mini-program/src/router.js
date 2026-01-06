import { createRouter, createWebHashHistory } from 'vue-router'

// 页面组件懒加载
const Index = () => import('./pages/index.vue')
const SkinTest = () => import('./pages/skin-test.vue')
const My = () => import('./pages/my.vue')
const Login = () => import('./pages/login.vue')
const Consultation = () => import('./pages/consultation.vue')
const StoreSelection = () => import('./pages/store-selection.vue')
const MyAppointments = () => import('./pages/my-appointments.vue')
const BeautyNews = () => import('./pages/beauty-news.vue')
const ArticleDetail = () => import('./pages/article-detail.vue')
const CustomerService = () => import('./pages/customer-service.vue')
const PhotoAnalysis = () => import('./pages/photo-analysis.vue')
const SkinReports = () => import('./pages/skin-reports.vue')
const SkinQuestionnaire = () => import('./pages/skin-questionnaire.vue')
const ReportDetail = () => import('./pages/report-detail.vue')

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/skin-test',
    name: 'SkinTest',
    component: SkinTest
  },
  {
    path: '/my',
    name: 'My',
    component: My
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/consultation',
    name: 'Consultation',
    component: Consultation
  },
  {
    path: '/store-selection',
    name: 'StoreSelection',
    component: StoreSelection
  },
  {
    path: '/my-appointments',
    name: 'MyAppointments',
    component: MyAppointments
  },
  {
    path: '/beauty-news',
    name: 'BeautyNews',
    component: BeautyNews
  },
  {
    path: '/article-detail',
    name: 'ArticleDetail',
    component: ArticleDetail
  },
  {
    path: '/customer-service',
    name: 'CustomerService',
    component: CustomerService
  },
  {
    path: '/photo-analysis',
    name: 'PhotoAnalysis',
    component: PhotoAnalysis
  },
  {
    path: '/skin-reports',
    name: 'SkinReports',
    component: SkinReports
  },
  {
    path: '/skin-questionnaire',
    name: 'SkinQuestionnaire',
    component: SkinQuestionnaire
  },
  {
    path: '/report-detail',
    name: 'ReportDetail',
    component: ReportDetail
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
