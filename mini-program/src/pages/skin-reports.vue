<template>
  <div class="skin-reports-container">
    <!-- 顶部栏 -->
    <div class="header">
      <!-- 左侧占位，保持标题居中 -->
      <div class="header-left">
        <button class="back-btn" @click="handleBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      </div>
      <!-- 标题居中 -->
      <h1 class="header-title">皮肤报告</h1>
      <!-- 右侧胶囊按钮 -->
      <div class="capsule-container">
        <button class="capsule-btn" @click="handleMore">
          <!-- 三点菜单图标（横向） -->
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <circle cx="18" cy="12" r="1.5" fill="currentColor"/>
          </svg>
        </button>
        <div class="capsule-divider"></div>
        <button class="capsule-btn">
          <!-- 圆环套圆图标 -->
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
            <circle cx="9" cy="9" r="2" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 筛选条 -->
    <div class="filter-bar">
      <div class="filter-item" :class="{ active: activeFilter === 'date' }" @click="handleFilterClick('date')">
        <span>按日期</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="filter-item" :class="{ active: activeFilter === 'store' }" @click="handleFilterClick('store')">
        <span>按门店</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="filter-item" :class="{ active: activeFilter === 'problem' }" @click="handleFilterClick('problem')">
        <span>按问题</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- 筛选下拉面板 -->
    <div v-if="showDateFilter || showStoreFilter || showProblemFilter" class="filter-panel">
      <!-- 日期筛选 -->
      <div v-if="showDateFilter" class="filter-options">
        <div 
          v-for="option in dateOptions" 
          :key="option.value"
          class="filter-option"
          :class="{ active: selectedDate === option.value }"
          @click="handleDateSelect(option.value)"
        >
          {{ option.label }}
        </div>
      </div>

      <!-- 门店筛选 -->
      <div v-if="showStoreFilter" class="filter-options">
        <div 
          v-for="option in storeOptions" 
          :key="option.value"
          class="filter-option"
          :class="{ active: selectedStore === option.value }"
          @click="handleStoreSelect(option.value)"
        >
          {{ option.label }}
        </div>
      </div>

      <!-- 问题类型筛选 -->
      <div v-if="showProblemFilter" class="filter-options">
        <div 
          v-for="option in problemOptions" 
          :key="option.value"
          class="filter-option"
          :class="{ active: selectedProblem === option.value }"
          @click="handleProblemSelect(option.value)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>

    <!-- 报告列表 -->
    <div class="reports-wrapper">
      <div class="reports-list">
        <div 
          v-for="report in filteredReports" 
          :key="report.id"
          class="report-item"
          @click="handleReportClick(report)"
        >
          <!-- 左侧图片 -->
          <div  class="report-image-content" style="display: flex;" >
            <div class="report-image">
              <img :src="report.image" :alt="report.date" @error="handleImageError" />
              <!-- 基准标记 -->
              <div v-if="report.isBaseline" class="baseline-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
                <span>基准</span>
              </div>
            </div>

          <!-- 右侧内容 -->
            <div class="report-content">
              <!-- 日期和基准标记 -->
              <div class="report-header">
                <div class="report-date">{{ formatDate(report.date) }}</div>
                <div class="report-actions" @click.stop>
                  <button 
                    v-if="!report.isBaseline"
                    class="action-btn baseline-btn"
                    @click="handleSetBaseline(report.id)"
                  >
                    设为基准
                  </button>
                  <button 
                    v-else
                    class="action-btn cancel-baseline-btn"
                    @click="handleCancelBaseline(report.id)"
                  >
                    取消基准
                  </button>
                </div>
              </div>

                <!-- 标签 -->
              <div class="report-tags">
                <span 
                  v-for="tag in report.tags" 
                  :key="tag"
                  class="report-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
             <!-- 重点皮肤问题 -->
         
          </div>
          <div class="report-problems">
            <div class="problems-description"><strong>重点问题：</strong>{{ report.problemsDescription }}</div>
          </div>
          
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredReports.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>暂无报告数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()


// 筛选状态
const showDateFilter = ref(false)
const showStoreFilter = ref(false)
const showProblemFilter = ref(false)
const selectedDate = ref('all')
const selectedStore = ref('all')
const selectedProblem = ref('all')

// 计算当前激活的筛选
const activeFilter = computed(() => {
  if (selectedDate.value !== 'all') return 'date'
  if (selectedStore.value !== 'all') return 'store'
  if (selectedProblem.value !== 'all') return 'problem'
  return null
})

// 筛选选项
const dateOptions = [
  { label: '全部', value: 'all' },
  { label: '最近一周', value: 'week' },
  { label: '最近一月', value: 'month' },
  { label: '最近三月', value: 'quarter' },
  { label: '最近一年', value: 'year' }
]

const storeOptions = [
  { label: '全部', value: 'all' },
  { label: '滨江路美肤管理中心', value: 'binjiang' },
  { label: '市中心旗舰店', value: 'downtown' },
  { label: '万达广场店', value: 'wanda' }
]

const problemOptions = [
  { label: '全部', value: 'all' },
  { label: '毛孔粗大', value: 'pore' },
  { label: '痘痘严重', value: 'acne' },
  { label: '色斑', value: 'spot' },
  { label: '敏感', value: 'sensitive' },
  { label: '干燥', value: 'dry' },
  { label: '出油', value: 'oil' },
  { label: '细纹', value: 'wrinkle' },
  { label: '暗沉', value: 'dull' }
]

// 根据皮肤问题标签获取对应的卡通图片
const getProblemImage = (tags) => {
  // 根据标签匹配对应的卡通图片
  // 使用皮肤问题相关的卡通插画图片
  // 每个皮肤问题类型对应不同的卡通图片
  const imageMap = {
    '毛孔粗大': 'https://img2.baidu.com/it/u=550286887,1101568460&fm=253&app=138&f=JPEG?w=500&h=667',
    '痘痘严重': 'https://img1.baidu.com/it/u=2492565795,4203955268&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=599',
    '色斑': 'https://img0.baidu.com/it/u=2197827152,1468794467&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=667',
    '干燥': 'https://img0.baidu.com/it/u=3728421449,3584020173&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=506',
    '敏感': 'https://img0.baidu.com/it/u=1161123516,870514069&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=656',
    '出油': 'https://img2.baidu.com/it/u=1902744697,577537823&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=654',
    '细纹': 'https://img0.baidu.com/it/u=3310266031,2351477444&fm=253&app=138&f=JPEG?w=500&h=666',
    '暗沉': 'https://img1.baidu.com/it/u=3128917222,3868755445&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=520'
  }
  
  // 优先使用第一个标签的图片
  if (tags && tags.length > 0 && imageMap[tags[0]]) {
    return imageMap[tags[0]]
  }
  // 如果第一个标签没有匹配，尝试第二个标签
  if (tags && tags.length > 1 && imageMap[tags[1]]) {
    return imageMap[tags[1]]
  }
  // 默认图片
  return 'https://img.freepik.com/free-vector/cute-girl-skincare-cartoon-illustration_1308-100901.jpg?w=200&h=240&fit=crop'
}

// 报告数据（模拟数据）
const reports = ref([
  {
    id: 1,
    date: '2024-01-15',
    image: getProblemImage(['毛孔粗大', '痘痘严重']),
    tags: ['毛孔粗大', '痘痘严重'],
    store: 'binjiang',
    problems: ['pore', 'acne'],
    problemsDescription: '检测到T区毛孔明显粗大，鼻翼两侧毛孔直径约0.3mm，超出正常范围。面部存在多处炎性痘痘，主要集中在额头和下巴区域，建议使用控油和抗炎产品。',
    isBaseline: true
  },
  {
    id: 2,
    date: '2024-01-10',
    image: getProblemImage(['色斑', '干燥']),
    tags: ['色斑', '干燥'],
    store: 'downtown',
    problems: ['spot', 'dry'],
    problemsDescription: '面部检测到多处色素沉着，主要集中在颧骨和鼻梁区域，色斑面积约占总面积的8%。皮肤水分含量偏低，脸颊区域水分值仅为35%，建议加强保湿和防晒。',
    isBaseline: false
  },
  {
    id: 3,
    date: '2024-01-05',
    image: getProblemImage(['敏感', '出油']),
    tags: ['敏感', '出油'],
    store: 'wanda',
    problems: ['sensitive', 'oil'],
    problemsDescription: '皮肤屏障功能较弱，脸颊区域出现轻微泛红，敏感度评分较高。T区油脂分泌旺盛，出油量超出正常值30%，建议使用温和的控油产品，避免过度清洁。',
    isBaseline: false
  },
  {
    id: 4,
    date: '2023-12-28',
    image: getProblemImage(['毛孔粗大', '色斑']),
    tags: ['毛孔粗大', '色斑'],
    store: 'binjiang',
    problems: ['pore', 'spot'],
    problemsDescription: '鼻翼和脸颊区域毛孔较为明显，毛孔粗大程度中等。检测到少量色斑，主要分布在颧骨上方，建议定期使用美白精华和做好防晒工作。',
    isBaseline: false
  },
  {
    id: 5,
    date: '2023-12-20',
    image: getProblemImage(['痘痘严重', '干燥']),
    tags: ['痘痘严重', '干燥'],
    store: 'downtown',
    problems: ['acne', 'dry'],
    problemsDescription: '面部痘痘问题较为严重，检测到15处炎性痘痘，主要集中在额头、下巴和脸颊区域。同时皮肤干燥，水分含量不足，建议先处理炎症，再加强保湿护理。',
    isBaseline: false
  },
  {
    id: 6,
    date: '2023-12-15',
    image: getProblemImage(['细纹', '暗沉']),
    tags: ['细纹', '暗沉'],
    store: 'wanda',
    problems: ['wrinkle', 'dull'],
    problemsDescription: '眼部周围出现轻微细纹，眼角区域细纹较为明显。整体肤色偏暗沉，亮度值偏低，建议使用抗衰老精华和提亮产品，注意眼部护理。',
    isBaseline: false
  }
])

// 筛选后的报告列表
const filteredReports = computed(() => {
  let result = [...reports.value]

  // 按日期筛选
  if (selectedDate.value !== 'all') {
    const now = new Date()
    const filterDate = new Date()
    
    switch (selectedDate.value) {
      case 'week':
        filterDate.setDate(now.getDate() - 7)
        break
      case 'month':
        filterDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1)
        break
    }
    
    result = result.filter(report => {
      const reportDate = new Date(report.date)
      return reportDate >= filterDate
    })
  }

  // 按门店筛选
  if (selectedStore.value !== 'all') {
    result = result.filter(report => report.store === selectedStore.value)
  }

  // 按问题类型筛选
  if (selectedProblem.value !== 'all') {
    result = result.filter(report => report.problems.includes(selectedProblem.value))
  }

  // 按日期倒序排列（最新的在前）
  return result.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const handleBack = () => {
  router.push({ path: '/' })
}

// 处理筛选按钮点击
const handleFilterClick = (type) => {
  // 关闭其他筛选面板
  if (type !== 'date') showDateFilter.value = false
  if (type !== 'store') showStoreFilter.value = false
  if (type !== 'problem') showProblemFilter.value = false
  
  // 切换当前筛选面板
  if (type === 'date') {
    showDateFilter.value = !showDateFilter.value
  } else if (type === 'store') {
    showStoreFilter.value = !showStoreFilter.value
  } else if (type === 'problem') {
    showProblemFilter.value = !showProblemFilter.value
  }
}

// 处理日期筛选
const handleDateSelect = (value) => {
  selectedDate.value = value
  showDateFilter.value = false
}

// 处理门店筛选
const handleStoreSelect = (value) => {
  selectedStore.value = value
  showStoreFilter.value = false
}

// 处理问题类型筛选
const handleProblemSelect = (value) => {
  selectedProblem.value = value
  showProblemFilter.value = false
}

// 图片加载错误处理
const handleImageError = (e) => {
  // 使用默认占位图
  e.target.src = 'https://via.placeholder.com/120x160/f0f0f0/999?text=No+Image'
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

// 设为基准
const handleSetBaseline = (reportId) => {
  // 取消其他基准
  reports.value.forEach(report => {
    if (report.isBaseline) {
      report.isBaseline = false
    }
  })
  // 设置新的基准
  const report = reports.value.find(r => r.id === reportId)
  if (report) {
    report.isBaseline = true
  }
}

// 取消基准
const handleCancelBaseline = (reportId) => {
  const report = reports.value.find(r => r.id === reportId)
  if (report) {
    report.isBaseline = false
  }
}

// 点击报告卡片
const handleReportClick = (report) => {
  router.push({
    name: 'ReportDetail',
    query: { id: report.id } // 使用模拟报告ID
  })
}

// 更多选项
const handleMore = () => {
  console.log('更多选项')
}

// 点击外部关闭筛选面板
const handleClickOutside = (event) => {
  if (!event.target.closest('.filter-bar') && !event.target.closest('.filter-panel')) {
    showDateFilter.value = false
    showStoreFilter.value = false
    showProblemFilter.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 微信小程序375px适配基础样式 */
.skin-reports-container {
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
  position: relative;
}

.header-left {
  width: 87px;
  flex-shrink: 0;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  text-align: center;
  flex: 1;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

/* 微信小程序胶囊按钮 */
.capsule-container {
  display: flex;
  align-items: center;
  height: 32px;
  min-width: 87px;
  width: 87px;
  background: #fff;
  border-radius: 16px;
  padding: 0 6px;
  box-sizing: border-box;
  flex-shrink: 0;
  border: 1px solid #e8e8e8;
}

.capsule-container:active {
  background: #f5f5f5;
}

.capsule-btn {
  flex: 1;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  color: #333;
  cursor: pointer;
}

.capsule-btn:active {
  opacity: 0.7;
}

.capsule-divider {
  width: 1px;
  height: 16px;
  background-color: #e8e8e8;
  margin: 0 4px;
}

/* 筛选条 */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: #f5f5f5;
  border-radius: 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-item:active {
  background-color: #e8e8e8;
}

.filter-item.active {
  background-color: #1AD299;
  color: #fff;
}

.filter-item svg {
  transition: transform 0.2s;
}

.filter-item.active svg {
  transform: rotate(180deg);
}

/* 筛选面板 */
.filter-panel {
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
  max-height: 200px;
  overflow-y: auto;
}

.filter-options {
  padding: 8px 0;
}

.filter-option {
  padding: 12px 24px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-option:active {
  background-color: #f5f5f5;
}

.filter-option.active {
  background-color: #E6F7F2;
  color: #1AD299;
  font-weight: 500;
}

/* 报告容器 */
.reports-wrapper {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 报告列表 */
.reports-list {
  padding: 16px 24px;
}

.report-item {
  
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.report-image-content{
  display: flex;
  gap: 16px;
}

.report-item:active {
  background-color: #f9fafb;
  transform: scale(0.98);
}

/* 左侧图片 */
.report-image {
  position: relative;
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.report-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.baseline-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px 6px;
  background-color: rgba(26, 210, 153, 0.95);
  color: #fff;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.baseline-badge svg {
  width: 10px;
  height: 10px;
}

/* 右侧内容 */
.report-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.report-date {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 重点皮肤问题 */
.report-problems {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top:8px;
}

.problems-title {
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

.problems-description {
  font-size: 13px;
  line-height: 1.6;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 标签 */
.report-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.report-tag {
  padding: 4px 12px;
  background-color: #F0F9F7;
  color: #1AD299;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 操作按钮 */
.report-actions {
  flex-shrink: 0;
}

.action-btn {
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.baseline-btn {
  background-color: #1AD299;
  color: #fff;
}

.baseline-btn:active {
  background-color: #17C088;
}

.cancel-baseline-btn {
  background-color: #f5f5f5;
  color: #666;
}

.cancel-baseline-btn:active {
  background-color: #e8e8e8;
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  color: #999;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
  color: #999;
}
</style>

