<template>
  <div class="questionnaire-container">
    <!-- 顶部标题栏（带胶囊按钮） -->
    <div class="header px-3 py-2">
      <button @click="handleBack" class="back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="header-title">皮肤调查问卷</h1>
      <!-- 微信小程序胶囊按钮 -->
      <div class="capsule-container">
        <button class="capsule-btn" @click="handleMore">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <circle cx="18" cy="12" r="1.5" fill="currentColor"/>
          </svg>
        </button>
        <div class="capsule-divider"></div>
        <button class="capsule-btn">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
            <circle cx="9" cy="9" r="2" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 问卷内容 -->
    <div class="questionnaire-content">
      <!-- 进度条 -->
      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <div class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</div>
      </div>

      <!-- 当前题目 -->
      <div class="question-card" v-if="currentQuestion">
        <div class="question-header">
          <h2 class="question-title">{{ currentQuestion.title }}</h2>
          <p v-if="currentQuestion.subtitle" class="question-subtitle">{{ currentQuestion.subtitle }}</p>
        </div>

        <div class="question-body">
          <!-- 单选题 -->
          <div v-if="currentQuestion.type === 'single'" class="option-group">
            <button 
              v-for="option in currentQuestion.options" 
              :key="option"
              class="option-btn"
              :class="{ active: formData[currentQuestion.key] === option }"
              @click="handleSingleSelect(currentQuestion.key, option)"
            >
              {{ option }}
            </button>
          </div>

          <!-- 多选题 -->
          <div v-if="currentQuestion.type === 'multiple'" class="option-group multi-select">
            <button 
              v-for="option in currentQuestion.options" 
              :key="option"
              class="option-btn"
              :class="{ active: formData[currentQuestion.key].includes(option) }"
              @click="handleMultipleSelect(currentQuestion.key, option)"
            >
              {{ option }}
            </button>
          </div>

          <!-- 文本输入 -->
          <div v-if="currentQuestion.type === 'text'" class="text-input-group">
            <textarea 
              v-model="formData[currentQuestion.key]"
              class="textarea-input"
              :placeholder="currentQuestion.placeholder || '请输入...'"
              rows="4"
            ></textarea>
          </div>
        </div>

        <!-- 导航按钮 -->
        <div class="navigation-buttons">
          <button 
            v-if="currentIndex > 0"
            @click="goToPrevious" 
            class="nav-btn prev-btn"
          >
            上一题
          </button>
          <button 
            v-if="currentIndex < questions.length - 1"
            @click="goToNext" 
            class="nav-btn next-btn"
            :class="{ disabled: !canGoNext }"
            :disabled="!canGoNext"
          >
            下一题
          </button>
          <button 
            v-if="currentIndex === filteredQuestions.length - 1"
            @click="handleSubmit" 
            class="nav-btn submit-btn"
            :class="{ disabled: !canSubmit }"
            :disabled="!canSubmit"
          >
            提交问卷
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 当前题目索引
const currentIndex = ref(0)

// 表单数据
const formData = ref({
  age: '',
  gender: '',
  skinType: '',
  concerns: [],
  schedule: '',
  diet: '',
  makeup: '',
  sunProtection: '',
  hasAllergy: '',
  allergyDetails: '',
  pregnancy: ''
})

// 问题列表
const questions = ref([
  {
    key: 'age',
    title: '您的年龄段是？',
    subtitle: '',
    type: 'single',
    options: ['18-25岁', '26-30岁', '31-35岁', '36-40岁', '41-45岁', '46岁以上'],
    required: true
  },
  {
    key: 'gender',
    title: '您的性别是？',
    subtitle: '',
    type: 'single',
    options: ['男', '女'],
    required: true
  },
  {
    key: 'skinType',
    title: '您认为自己的肤质是？',
    subtitle: '',
    type: 'single',
    options: ['干性', '油性', '混合性', '敏感性'],
    required: true
  },
  {
    key: 'concerns',
    title: '您的主要困扰是？',
    subtitle: '可多选',
    type: 'multiple',
    options: ['痘痘', '毛孔', '色斑', '细纹', '黑头', '松弛', '暗沉', '红血丝'],
    required: true
  },
  {
    key: 'schedule',
    title: '您的作息习惯是？',
    subtitle: '',
    type: 'single',
    options: ['规律作息（22:00-23:00）', '偶尔熬夜（23:00-1:00）', '经常熬夜（1:00以后）'],
    required: true
  },
  {
    key: 'diet',
    title: '您的饮食习惯是？',
    subtitle: '',
    type: 'single',
    options: ['清淡饮食', '正常饮食', '偏油腻', '偏辛辣'],
    required: true
  },
  {
    key: 'makeup',
    title: '您是否常化妆？',
    subtitle: '',
    type: 'single',
    options: ['从不化妆', '偶尔化妆', '经常化妆', '每天化妆'],
    required: true
  },
  {
    key: 'sunProtection',
    title: '您的防晒程度是？',
    subtitle: '',
    type: 'single',
    options: ['从不防晒', '偶尔防晒', '经常防晒', '每天防晒'],
    required: true
  },
  {
    key: 'hasAllergy',
    title: '您是否对某些成分过敏？',
    subtitle: '',
    type: 'single',
    options: ['是', '否', '不确定'],
    required: true
  },
  {
    key: 'allergyDetails',
    title: '请说明过敏成分',
    subtitle: '选填',
    type: 'text',
    placeholder: '请输入您对哪些成分过敏...',
    required: false,
    condition: (formData) => formData.hasAllergy === '是'
  },
  {
    key: 'pregnancy',
    title: '您是否处于妊娠期？',
    subtitle: '可选',
    type: 'single',
    options: ['是', '否', '不便透露'],
    required: false
  }
])

// 过滤后的问题列表（根据条件显示）
const filteredQuestions = computed(() => {
  return questions.value.filter((question, index) => {
    // 如果问题有条件，检查条件
    if (question.condition) {
      return question.condition(formData.value)
    }
    return true
  })
})

// 当前题目
const currentQuestion = computed(() => {
  return filteredQuestions.value[currentIndex.value]
})

// 进度百分比
const progressPercentage = computed(() => {
  return ((currentIndex.value + 1) / filteredQuestions.value.length) * 100
})

// 是否可以进入下一题
const canGoNext = computed(() => {
  if (!currentQuestion.value) return false
  
  const key = currentQuestion.value.key
  const value = formData.value[key]
  
  if (currentQuestion.value.required) {
    if (currentQuestion.value.type === 'multiple') {
      return Array.isArray(value) && value.length > 0
    }
    return value !== '' && value !== null && value !== undefined
  }
  
  return true
})

// 是否可以提交
const canSubmit = computed(() => {
  // 检查所有必填问题是否已回答
  return filteredQuestions.value.every(question => {
    if (!question.required) return true
    
    const key = question.key
    const value = formData.value[key]
    
    if (question.type === 'multiple') {
      return Array.isArray(value) && value.length > 0
    }
    
    return value !== '' && value !== null && value !== undefined
  })
})

// 处理单选题
const handleSingleSelect = (key, value) => {
  formData.value[key] = value
  
  // 如果选择"否"或"不确定"，清空过敏详情
  if (key === 'hasAllergy' && value !== '是') {
    formData.value.allergyDetails = ''
  }
  
  // 自动进入下一题（延迟一下让用户看到选择效果）
  if (canGoNext.value && currentIndex.value < filteredQuestions.value.length - 1) {
    setTimeout(() => {
      if (canGoNext.value) {
        goToNext()
      }
    }, 400)
  }
}

// 处理多选题
const handleMultipleSelect = (key, value) => {
  const index = formData.value[key].indexOf(value)
  if (index > -1) {
    formData.value[key].splice(index, 1)
  } else {
    formData.value[key].push(value)
  }
}

// 监听问题变化，自动调整索引
watch(() => filteredQuestions.value.length, (newLength, oldLength) => {
  // 如果当前索引超出范围，调整到最后一个
  if (currentIndex.value >= newLength) {
    currentIndex.value = Math.max(0, newLength - 1)
  }
})

// 监听当前题目，确保索引有效
watch(() => currentIndex.value, (newIndex) => {
  if (newIndex >= filteredQuestions.value.length) {
    currentIndex.value = Math.max(0, filteredQuestions.value.length - 1)
  }
})

// 上一题
const goToPrevious = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// 下一题
const goToNext = () => {
  if (!canGoNext.value) {
    return
  }
  
  if (currentIndex.value < filteredQuestions.value.length - 1) {
    currentIndex.value++
  }
}

// 返回上一页
const handleBack = () => {
  if (currentIndex.value > 0) {
    goToPrevious()
  } else {
    router.back()
  }
}

// 更多选项
const handleMore = () => {
  console.log('更多选项')
}

// 提交问卷
const handleSubmit = () => {
  if (!canSubmit.value) {
    return
  }

  // 获取从localStorage存储的图片数据
  const imageData = localStorage.getItem('tempPhotoForAnalysis')
  
  // 将问卷数据存储到本地存储或传递给下一个页面
  const questionnaireData = {
    ...formData.value,
    timestamp: new Date().toISOString()
  }

  // 清理临时存储的图片数据
  localStorage.removeItem('tempPhotoForAnalysis')

  // 跳转到分析页面，携带问卷数据和图片
  router.push({
    name: 'PhotoAnalysis',
    query: {
      photo: imageData,
      questionnaire: JSON.stringify(questionnaireData)
    }
  })
}
</script>

<style scoped>
.questionnaire-container {
  width: 100%;
  max-width: 375px;
  min-width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
}

/* 顶部标题栏 */
.header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 375px;
  z-index: 99999;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 6px;
  padding-right: 6px;
  padding-left: 16px;
  padding-bottom: 0;
  background: #ffffff;
  backdrop-filter: blur(10px);
  padding:12px 16px;
}

.back-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  box-sizing: border-box;
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* 微信小程序胶囊按钮 */
.capsule-container {
  display: flex;
  align-items: center;
  height: 32px;
  min-width: 87px;
  width: 87px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 0 6px;
  box-sizing: border-box;
  flex-shrink: 0;
  transition: background 0.2s;
  justify-content: space-between;
}

.capsule-container:active {
  background: rgba(0, 0, 0, 0.1);
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
  color: #333;
  padding: 0;
  min-width: 0;
  transition: none;
}

.capsule-divider {
  width: 1px;
  height: 16px;
  background: rgba(0, 0, 0, 0.15);
  margin: 0 2px;
  flex-shrink: 0;
}

/* 问卷内容 */
.questionnaire-content {
  flex: 1;
  padding: 60px 16px 20px;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* 进度条 */
.progress-section {
  margin-bottom: 24px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e8e8e8;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1AD299 0%, #17C088 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 12px;
  color: #999;
}

/* 题目卡片 */
.question-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  padding: 0 24px;
  min-height: 400px;
}

.question-header {
  margin-bottom: 32px;
}

.question-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.question-subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.question-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 200px;
}

/* 选项组 */
.option-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-group.multi-select {
  flex-direction: row;
  flex-wrap: wrap;
}

.option-btn {
  padding: 14px 20px;
  background: #fff;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
  text-align: center;
  font-weight: 500;
}

.option-btn:hover {
  background: #e8e8e8;
  border-color: #d0d0d0;
}

.option-btn.active {
  background: #1AD299;
  border-color: #1AD299;
  color: white;
  transform: scale(1.02);
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
/* 文本输入 */
.text-input-group {
  width: 100%;
}

.textarea-input {
  width: 100%;
  padding: 14px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 15px;
  color: #333;
  resize: none;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1.6;
  transition: border-color 0.2s;
}

.textarea-input:focus {
  outline: none;
  border-color: #1AD299;
}

.textarea-input::placeholder {
  color: #999;
}

/* 导航按钮 */
.navigation-buttons {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.nav-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
}

.prev-btn {
  background: #f5f5f5;
  color: #666;
}

.prev-btn:active {
  background: #e8e8e8;
  transform: scale(0.98);
}

.next-btn,
.submit-btn {
  background: #1AD299;
  color: white;
}

.next-btn:active:not(.disabled),
.submit-btn:active:not(.disabled) {
  background: #17C088;
  transform: scale(0.98);
}

.nav-btn.disabled {
  background: #e8e8e8;
  color: #999;
  cursor: not-allowed;
  opacity: 0.6;
}

/* 微信小程序375px适配 */
@media screen and (max-width: 375px) {
  .questionnaire-container {
    width: 100vw;
    max-width: 100vw;
    min-width: 100vw;
  }
  
  .header {
    width: 100vw;
    max-width: 100vw;
    left: 0;
    transform: none;
  }
  
  .questionnaire-content {
    width: 100%;
  }
  
  .question-card {
    min-height: calc(100vh - 120px);
  }
}
</style>
