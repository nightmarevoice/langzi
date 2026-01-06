<template>
  <div class="consultation-container">
    <!-- 顶部栏 -->
    <div class="header">
      <div class="header-left"></div>
      <h1 class="header-title">咨询</h1>
      <div class="header-right">
        <button @click="handleMore" class="more-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <circle cx="18" cy="12" r="1.5" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="content">
      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索问题或关键词"
            class="search-input"
          />
        </div>
      </div>

      <!-- 分类标签 -->
      <div class="category-section">
        <div class="category-tabs">
          <div
            v-for="category in categories"
            :key="category.id"
            @click="activeCategory = category.id"
            class="category-tab"
            :class="{ active: activeCategory === category.id }"
          >
            {{ category.name }}
          </div>
        </div>
      </div>

      <!-- 问题列表 -->
      <div class="questions-section">
        <div class="questions-list">
          <div
            v-for="question in filteredQuestions"
            :key="question.id"
            @click="handleQuestionClick(question)"
            class="question-item"
          >
            <div class="question-content">
              <h3 class="question-title">{{ question.title }}</h3>
              <p class="question-desc">{{ question.description }}</p>
              <div class="question-meta">
                <span class="question-category">{{ question.category }}</span>
                <span class="question-views">{{ question.views }}次浏览</span>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 底部咨询入口 -->
      <div class="consult-entry">
        <div class="consult-card">
          <div class="consult-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="9" r="1" fill="currentColor"/>
              <circle cx="12" cy="9" r="1" fill="currentColor"/>
              <circle cx="15" cy="9" r="1" fill="currentColor"/>
              <path d="M9 12H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="consult-info">
            <h3 class="consult-title">在线咨询</h3>
            <p class="consult-desc">专业美容顾问为您答疑解惑</p>
          </div>
          <button @click="handleOnlineConsult" class="consult-btn">
            立即咨询
          </button>
        </div>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <TabBar />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '../components/TabBar.vue'

const router = useRouter()

// 搜索关键词
const searchQuery = ref('')

// 活跃分类
const activeCategory = ref('all')

// 分类数据
const categories = reactive([
  { id: 'all', name: '全部' },
  { id: 'skin-care', name: '护肤' },
  { id: 'beauty', name: '美容' },
  { id: 'treatment', name: '治疗' },
  { id: 'product', name: '产品' }
])

// 问题数据
const questions = reactive([
  {
    id: 1,
    title: '如何正确清洁面部？',
    description: '面部清洁是护肤的第一步，正确的清洁方法能有效去除污垢和多余油脂...',
    category: '护肤',
    categoryId: 'skin-care',
    views: 1250
  },
  {
    id: 2,
    title: '玻尿酸填充的注意事项',
    description: '玻尿酸填充是一种常见的美容治疗项目，在选择和术后护理方面需要注意...',
    category: '美容',
    categoryId: 'beauty',
    views: 890
  },
  {
    id: 3,
    title: '痘痘肌肤的日常护理',
    description: '痘痘肌肤需要特别的护理方式，避免使用油性产品，保持皮肤清洁...',
    category: '护肤',
    categoryId: 'skin-care',
    views: 1560
  },
  {
    id: 4,
    title: '热玛吉治疗的适应症',
    description: '热玛吉是一种非侵入性抗衰治疗，适用于面部松弛、皱纹等问题...',
    category: '治疗',
    categoryId: 'treatment',
    views: 720
  },
  {
    id: 5,
    title: '医美产品选择指南',
    description: '选择医美产品需要考虑肤质、功效、安全性等多个因素...',
    category: '产品',
    categoryId: 'product',
    views: 980
  },
  {
    id: 6,
    title: '抗衰老护肤品推荐',
    description: '随着年龄增长，皮肤需要更多的营养补充，抗衰老产品能有效改善...',
    category: '护肤',
    categoryId: 'skin-care',
    views: 1340
  },
  {
    id: 7,
    title: '激光祛斑的治疗周期',
    description: '激光祛斑通常需要多次治疗，间隔时间根据斑点类型和治疗效果而定...',
    category: '治疗',
    categoryId: 'treatment',
    views: 650
  },
  {
    id: 8,
    title: '敏感肌肤的美容建议',
    description: '敏感肌肤在选择美容项目时需要特别谨慎，避免刺激性强的治疗...',
    category: '美容',
    categoryId: 'beauty',
    views: 780
  }
])

// 过滤问题列表
const filteredQuestions = computed(() => {
  let filtered = questions

  // 按分类过滤
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(q => q.categoryId === activeCategory.value)
  }

  // 按搜索关键词过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(q =>
      q.title.toLowerCase().includes(query) ||
      q.description.toLowerCase().includes(query) ||
      q.category.toLowerCase().includes(query)
    )
  }

  return filtered
})

// 更多操作
const handleMore = () => {
  if (typeof wx !== 'undefined' && wx.showActionSheet) {
    wx.showActionSheet({
      itemList: ['意见反馈', '帮助中心', '关于我们'],
      success: (res) => {
        const selectedIndex = res.tapIndex
        if (selectedIndex === 0) {
          handleFeedback()
        } else if (selectedIndex === 1) {
          handleHelp()
        } else if (selectedIndex === 2) {
          handleAbout()
        }
      }
    })
  } else {
    // 浏览器环境下的处理
    const selectedIndex = parseInt(prompt('选择操作：\n0. 意见反馈\n1. 帮助中心\n2. 关于我们\n请输入数字：'))
    if (!isNaN(selectedIndex)) {
      if (selectedIndex === 0) {
        handleFeedback()
      } else if (selectedIndex === 1) {
        handleHelp()
      } else if (selectedIndex === 2) {
        handleAbout()
      }
    }
  }
}

// 意见反馈
const handleFeedback = () => {
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({
      title: '意见反馈页面开发中',
      icon: 'none',
      duration: 2000
    })
  } else {
    // 浏览器环境下的处理
    alert('意见反馈页面开发中')
  }
}

// 帮助中心
const handleHelp = () => {
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({
      title: '帮助中心页面开发中',
      icon: 'none',
      duration: 2000
    })
  } else {
    // 浏览器环境下的处理
    alert('帮助中心页面开发中')
  }
}

// 关于我们
const handleAbout = () => {
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({
      title: '关于我们页面开发中',
      icon: 'none',
      duration: 2000
    })
  } else {
    // 浏览器环境下的处理
    alert('关于我们页面开发中')
  }
}

// 点击问题
const handleQuestionClick = (question) => {
  // 增加浏览量
  question.views += 1

  // 跳转到问题详情页（这里先用toast代替）
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({
      title: '问题详情页面开发中',
      icon: 'none',
      duration: 2000
    })
  } else {
    // 浏览器环境下的处理
    alert('问题详情页面开发中')
  }
}

// 在线咨询
const handleOnlineConsult = () => {
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({
      title: '在线咨询功能开发中',
      icon: 'none',
      duration: 2000
    })
  } else {
    // 浏览器环境下的处理
    alert('在线咨询功能开发中')
  }
}
</script>

<style scoped>
.consultation-container {
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

/* 顶部栏 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-left {
  width: 32px;
}

.header-right {
  width: 32px;
}

.more-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333;
  padding: 0;
}

/* 主体内容 */
.content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

/* 搜索区域 */
.search-section {
  padding: 16px 24px 12px;
  background-color: #fff;
  margin-bottom: 12px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-radius: 20px;
}

.search-bar svg {
  color: #999;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;
}

.search-input::placeholder {
  color: #999;
}

/* 分类标签 */
.category-section {
  background-color: #fff;
  margin-bottom: 12px;
}

.category-tabs {
  display: flex;
  padding: 16px 24px 12px;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  flex-shrink: 0;
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #666;
  font-size: 14px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.category-tab.active {
  background-color: #1AD299;
  color: white;
}

/* 问题列表 */
.questions-section {
  background-color: #fff;
  margin-bottom: 12px;
}

.questions-list {
  padding: 0 24px;
}

.question-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.question-item:last-child {
  border-bottom: none;
}

.question-item:active {
  background-color: #f9fafb;
}

.question-content {
  flex: 1;
  min-width: 0;
}

.question-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.question-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.question-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.question-category {
  font-size: 12px;
  color: #1AD299;
  background-color: #f0f9ff;
  padding: 2px 8px;
  border-radius: 8px;
}

.question-views {
  font-size: 12px;
  color: #999;
}

.arrow-icon {
  color: #ccc;
  flex-shrink: 0;
  margin-left: 8px;
}

/* 底部咨询入口 */
.consult-entry {
  padding: 24px;
}

.consult-card {
  background: linear-gradient(135deg, #1AD299 0%, #15b889 100%);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.consult-icon {
  width: 48px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.consult-info {
  flex: 1;
  min-width: 0;
}

.consult-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.consult-desc {
  font-size: 12px;
  margin: 0;
  opacity: 0.9;
}

.consult-btn {
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.consult-btn:active {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(0.98);
}

/* 微信小程序适配 */
@media screen and (max-width: 375px) {
  .consultation-container {
    width: 100vw;
    max-width: 100vw;
    min-width: 100vw;
  }
}
</style>
