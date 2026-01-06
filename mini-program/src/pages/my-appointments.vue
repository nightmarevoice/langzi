<template>
  <div class="appointments-container">
    <!-- 顶部栏 -->
    <div class="header">
      <div class="header-left">
        <button class="back-btn" @click="handleBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      </div>
      <h1 class="header-title">我的预约</h1>
      <div class="capsule-container">
        <button class="capsule-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <circle cx="18" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </button>
        <div class="capsule-divider"></div>
        <button class="capsule-btn">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="2" fill="none" />
            <circle cx="9" cy="9" r="2" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="content">
      <!-- 顶部筛选 -->
      <div class="px-6 pt-4 pb-3 bg-white">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-base font-semibold text-gray-900">行程概览</h2>
          <span class="text-xs text-gray-400">术前 · 术中 · 术后 一目了然</span>
        </div>
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            v-for="item in filters"
            :key="item.key"
            class="filter-pill"
            :class="activeFilter === item.key ? 'filter-pill-active' : ''"
            @click="activeFilter = item.key"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <!-- 时间线 + 卡片列表 -->
      <div class="flex-1 overflow-y-auto px-6 py-4">
        <div v-if="filteredAppointments.length" class="timeline">
          <div
            v-for="(item, index) in filteredAppointments"
            :key="item.id"
            class="timeline-item"
          >
            <!-- 时间线轴 -->
            <div class="timeline-axis">
              <div
                class="timeline-dot"
                :class="{
                  'dot-upcoming': item.status === 'upcoming',
                  'dot-completed': item.status === 'completed',
                  'dot-pending': item.status === 'pending',
                  'dot-cancelled': item.status === 'cancelled'
                }"
              ></div>
              <div
                v-if="index !== filteredAppointments.length - 1"
                class="timeline-line"
              ></div>
            </div>

            <!-- 卡片内容 -->
            <div class="timeline-card">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-400">{{ item.phaseLabel }}</span>
                  <span class="text-xs text-gray-300">•</span>
                  <span class="text-xs text-gray-400">{{ item.dateText }}</span>
                </div>
                <span
                  class="status-tag"
                  :class="{
                    'status-upcoming': item.status === 'upcoming',
                    'status-completed': item.status === 'completed',
                    'status-pending': item.status === 'pending',
                    'status-cancelled': item.status === 'cancelled'
                  }"
                >
                  {{ item.statusLabel }}
                </span>
              </div>

              <h3 class="text-sm font-semibold text-gray-900 mb-1">
                {{ item.projectName }}
              </h3>
              <p class="text-xs text-gray-500 mb-2">
                {{ item.storeName }} · {{ item.timeRange }}
              </p>

              <div class="flex flex-wrap gap-2 mt-2">
                <button
                  v-if="item.showPreNotice"
                  class="action-btn"
                  @click="handlePreNotice(item)"
                >
                  查看术前注意事项
                </button>
                <button
                  v-if="item.showPostCare"
                  class="action-btn"
                  @click="handlePostCare(item)"
                >
                  查看术后护理
                </button>
                <button
                  v-if="item.status === 'upcoming' || item.status === 'pending'"
                  class="action-btn danger"
                  @click="handleReschedule(item)"
                >
                  取消预约 / 改期
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="pt-10 pb-6 flex flex-col items-center text-center text-gray-400 text-xs">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="mb-3"
          >
            <rect x="10" y="14" width="44" height="38" rx="6" stroke="#E5E7EB" stroke-width="2" />
            <path d="M10 22H54" stroke="#E5E7EB" stroke-width="2" />
            <circle cx="22" cy="30" r="3" fill="#E5E7EB" />
            <circle cx="32" cy="38" r="3" fill="#E5E7EB" />
            <circle cx="42" cy="30" r="3" fill="#E5E7EB" />
          </svg>
          <p>暂时还没有预约记录</p>
          <p>可以先与顾问沟通，定制个人方案</p>
        </div>

        <!-- 底部 CTA -->
        <div class="mt-6 mb-4">
          <div class="bg-white rounded-2xl p-4 shadow-sm">
            <p class="text-xs text-gray-500 mb-3">
              想继续规划后续项目，或对术后护理有疑问，可以随时联系顾问或 AI 管家。
            </p>
            <div class="flex gap-3">
              <button class="w-full primary-cta" @click="handleRebook">
                再次预约
              </button>
              <button class="w-full secondary-cta" @click="handleAskAI">
                咨询 AI 管家
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部导航栏 -->
      <TabBar />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '../components/TabBar.vue'

const router = useRouter()

const filters = [
  { key: 'all', label: '全部' },
  { key: 'upcoming', label: '未到店' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' }
]

const activeFilter = ref('all')

// 模拟预约+行程数据，覆盖术前-术中-术后全路径
const appointments = ref([
  {
    id: 1,
    phaseLabel: '术前 · 初诊评估',
    projectName: '面部年轻化综合方案 · 初诊咨询',
    storeName: '滨江路美肤管理中心',
    dateText: '2025-01-18 周六',
    timeRange: '10:00 - 10:40',
    status: 'pending', // 待确认
    statusLabel: '待确认',
    showPreNotice: true,
    showPostCare: false
  },
  {
    id: 2,
    phaseLabel: '术中 · 到店治疗',
    projectName: '水光针+光子嫩肤联合治疗',
    storeName: '滨江路美肤管理中心',
    dateText: '2025-01-20 周一',
    timeRange: '14:00 - 15:30',
    status: 'upcoming', // 预计/正常
    statusLabel: '预计到店',
    showPreNotice: true,
    showPostCare: true
  },
  {
    id: 3,
    phaseLabel: '术后 · 复查随访',
    projectName: '术后复查 & 护理指导',
    storeName: '滨江路美肤管理中心',
    dateText: '2025-01-27 周一',
    timeRange: '16:00 - 16:30',
    status: 'completed',
    statusLabel: '已完成',
    showPreNotice: false,
    showPostCare: true
  },
  {
    id: 4,
    phaseLabel: '术中 · 到店治疗',
    projectName: '鼻整形术 · 手术日',
    storeName: '城西旗舰院区',
    dateText: '2024-12-30 周一',
    timeRange: '09:00 - 12:00',
    status: 'cancelled',
    statusLabel: '已取消',
    showPreNotice: true,
    showPostCare: false
  }
])

const filteredAppointments = computed(() => {
  if (activeFilter.value === 'all') return appointments.value
  return appointments.value.filter(item => item.status === activeFilter.value)
})

const handlePreNotice = item => {
  console.log('查看术前注意事项', item)
  // TODO: 跳转到术前注意事项详情页
}

const handlePostCare = item => {
  console.log('查看术后护理', item)
  // TODO: 跳转到术后护理指南页
}

const handleReschedule = item => {
  console.log('取消预约 / 改期', item)
  // TODO: 打开改期/取消预约弹窗
}
const handleBack = () => {
  router.push({ path: '/' })
}
const handleRebook = () => {
  // 这里示例跳到测肤入口，由测评后再进入预约
  router.push('/skin-test')
}

const handleAskAI = () => {
  router.push('/customer-service')
}
</script>

<style scoped>
.appointments-container {
  width: 100%;
  max-width: 375px;
  min-width: 375px;
  height: 100vh;
  margin: 0 auto;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
  position: relative;
}

.header-left {
  width: 87px;
  flex-shrink: 0;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.capsule-container {
  display: flex;
  align-items: center;
  height: 32px;
  min-width: 87px;
  width: 87px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  padding: 0 6px;
  box-sizing: border-box;
  flex-shrink: 0;
  justify-content: space-between;
}

.capsule-btn {
  flex: 1;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.55);
  padding: 0;
}

.capsule-divider {
  width: 2px;
  height: 16px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 2px;
  flex-shrink: 0;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.filter-pill {
  white-space: nowrap;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  color: #6b7280;
  background-color: #f3f4f6;
  border: none;
}

.filter-pill-active {
  background-color: #e0f2fe;
  color: #0284c7;
}

.timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
}

.timeline-item + .timeline-item {
  margin-top: 12px;
}

.timeline-axis {
  position: relative;
  width: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 2px solid #e5e7eb;
  background-color: #fff;
  margin-top: 6px;
}

.dot-upcoming {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.dot-completed {
  border-color: #9ca3af;
  background-color: #f3f4f6;
}

.dot-pending {
  border-color: #f97316;
  background-color: #fff7ed;
}

.dot-cancelled {
  border-color: #d1d5db;
  background-color: #f9fafb;
}

.timeline-line {
  flex: 1;
  width: 2px;
  background: linear-gradient(to bottom, #e5e7eb, #e5e7eb);
  margin-top: 2px;
  margin-bottom: 4px;
}

.timeline-card {
  flex: 1;
  margin-left: 8px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 10px 12px 10px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
}

.status-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
}

.status-upcoming {
  background-color: #e0f2fe;
  color: #0369a1;
}

.status-completed {
  background-color: #f3f4f6;
  color: #6b7280;
}

.status-pending {
  background-color: #ffedd5;
  color: #c05621;
}

.status-cancelled {
  background-color: #f9fafb;
  color: #9ca3af;
}

.action-btn {
  font-size: 11px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  color: #4b5563;
}

.action-btn.danger {
  border-color: #fecaca;
  color: #b91c1c;
  background-color: #fef2f2;
}

.primary-cta {
  height: 40px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}

.secondary-cta {
  height: 40px;
  border-radius: 999px;
  border: 1px solid #22c55e;
  background-color: #ecfdf3;
  color: #16a34a;
  font-size: 14px;
  font-weight: 500;
}

@media screen and (max-width: 375px) {
  .appointments-container {
    width: 100vw;
    max-width: 100vw;
    min-width: 100vw;
  }
}
</style>


