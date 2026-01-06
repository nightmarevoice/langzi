<template>
  <div class="tab-bar">
    <div class="tab-bar-content">
      <div 
        @click="handleTabChange('home')"
        class="tab-item"
        :class="{ active: activeTab === 'home' }"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="tab-label">首页</span>
      </div>
      <div
        @click="handleTabChange('skin')"
        class="tab-item"
        :class="{ active: activeTab === 'skin' }"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>
        <span class="tab-label">测肤</span>
      </div>
      <div
        @click="handleTabChange('consultation')"
        class="tab-item"
        :class="{ active: activeTab === 'consultation' }"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="9" cy="9" r="1" fill="currentColor"/>
          <circle cx="12" cy="9" r="1" fill="currentColor"/>
          <circle cx="15" cy="9" r="1" fill="currentColor"/>
          <path d="M9 12H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="tab-label">咨询</span>
      </div>
      <div
        @click="handleTabChange('mine')"
        class="tab-item"
        :class="{ active: activeTab === 'mine' }"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="tab-label">我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 根据当前路由计算激活的标签
const activeTab = computed(() => {
  const path = route.path
  if (path === '/' || path.startsWith('/index')) {
    return 'home'
  } else if (path === '/skin-test' || path.startsWith('/skin-test')) {
    return 'skin'
  } else if (path === '/consultation' || path.startsWith('/consultation')) {
    return 'consultation'
  } else if (path === '/my' || path.startsWith('/my')) {
    return 'mine'
  }
  return 'home'
})

// Tab 切换处理
const handleTabChange = (tab) => {
  if (tab === 'skin') {
    router.push({ name: 'SkinTest' })
  } else if (tab === 'home') {
    router.push({ name: 'Index' })
  } else if (tab === 'consultation') {
    router.push({ name: 'Consultation' })
  } else if (tab === 'mine') {
    router.push({ name: 'My' })
  }
}
</script>

<style scoped>
.tab-bar {
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-top: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.tab-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 0;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 24px;
  cursor: pointer;
  transition: opacity 0.2s;
  color: #999;
}

.tab-item:active {
  opacity: 0.7;
}

.tab-item.active {
  color: #1AD299;
}

.tab-item svg {
  transition: color 0.2s;
}

.tab-label {
  font-size: 12px;
  transition: color 0.2s;
}

.tab-item.active .tab-label {
  font-weight: 500;
}

/* 小屏幕适配 */
@media screen and (max-width: 375px) {
  .tab-bar {
    width: 100%;
  }
}
</style>

