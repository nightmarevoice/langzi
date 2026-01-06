<template>
  <div class="photo-analysis-container">
    <!-- 顶部标题栏 -->
    <div class="header">
      <div class="header-left">
        <button @click="goHome" class="home-btn" aria-label="返回首页">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 11L12 3L21 11V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 21V12h6v9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <button @click="handleBack" class="back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
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

    <!-- 主要内容区域 -->
    <div class="content-area">
      <!-- 照片显示区域 -->
      <div class="photo-display">
        <div class="photo-wrapper" :class="{ 'scanning': isScanning }">
          <img v-if="photoUrl" :src="photoUrl" alt="待分析照片" class="photo-image" />
          <!-- 扫描线动画 -->
          <div v-if="isScanning" class="scan-line"></div>
          <!-- 扫描光效 -->
          <div v-if="isScanning" class="scan-glow"></div>
        </div>
      </div>

      <!-- 分析步骤展示 -->
      <div class="analysis-steps" v-if="!hasError">
        <div 
          v-for="(step, index) in analysisSteps" 
          :key="index"
          class="step-item"
          :class="{ 
            'active': currentStepIndex === index,
            'completed': currentStepIndex > index 
          }"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-content">
            <div class="step-text">{{ step.text }}</div>
            <div v-if="currentStepIndex === index" class="step-loading">
              <span class="loading-dot"></span>
              <span class="loading-dot"></span>
              <span class="loading-dot"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 温馨提示 -->
      <div class="tip-message" v-if="!hasError">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>通常需要 3 秒，请勿关闭页面</span>
      </div>

      <!-- 错误提示 -->
      <div class="error-message" v-if="hasError">
        <div class="error-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="error-text">{{ errorMessage }}</div>
        <button @click="handleRetry" class="retry-btn">重新提交</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 照片URL（从路由参数获取）
const photoUrl = ref(route.query.photo || '')

// 分析状态
const isScanning = ref(true)
const hasError = ref(false)
const errorMessage = ref('')
const currentStepIndex = ref(0)

// 分析步骤
const analysisSteps = ref([
  { text: '分析肤色与纹理…' },
  { text: '检测痘痘/色斑…' },
  { text: '生成报告建议…' }
])

// 步骤切换定时器
let stepTimer = null
let analysisTimer = null

// 返回上一页
const handleBack = () => {
  router.back()
}

// 更多选项
const handleMore = () => {
  console.log('更多选项')
}

// 返回首页
const goHome = () => {
  router.push({ path: '/' })
}

// 开始分析流程
const startAnalysis = async () => {
  isScanning.value = true
  hasError.value = false
  errorMessage.value = ''
  currentStepIndex.value = 0

  // 清理之前的定时器
  if (stepTimer) {
    clearTimeout(stepTimer)
    stepTimer = null
  }
  if (analysisTimer) clearTimeout(analysisTimer)

  // 模拟步骤切换（每个步骤1.5秒，逐步执行）
  const nextStep = () => {
    if (currentStepIndex.value < analysisSteps.value.length - 1) {
      currentStepIndex.value++
      stepTimer = setTimeout(nextStep, 1500)
    } else {
      // 所有步骤完成，开始API调用
      stepTimer = null
      performAnalysis()
    }
  }

  // 开始执行第一步
  stepTimer = setTimeout(nextStep, 1500)
}

// 执行API调用分析
const performAnalysis = async () => {
  try {
    await simulateAPICall()
    // 分析成功
    completeAnalysis()
  } catch (error) {
    // 分析失败
    handleAnalysisError(error)
  }
}

// 模拟API调用
const simulateAPICall = () => {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟（1-2秒）
    const delay = 1000 

    // 10%概率模拟失败（用于测试）
    const shouldFail = false

    analysisTimer = setTimeout(() => {
      if (shouldFail) {
        // 随机选择错误类型
        const errorTypes = [
          { message: '网络错误，请检查网络连接后重试', type: 'network' },
          { message: '识别失败，请重新拍摄照片', type: 'recognition' },
          { message: '服务器繁忙，请稍后重试', type: 'server' }
        ]
        const error = errorTypes[Math.floor(Math.random() * errorTypes.length)]
        reject(error)
      } else {
        resolve()
      }
    }, delay)
  })
}

// 完成分析
const completeAnalysis = () => {
  isScanning.value = false
  if (stepTimer) {
    clearTimeout(stepTimer)
    stepTimer = null
  }

  // 确保所有步骤都显示为完成
  currentStepIndex.value = analysisSteps.value.length

  // 延迟跳转到报告详情页面
  setTimeout(() => {
    router.push({
      name: 'ReportDetail',
      query: { id: '1' } // 使用模拟报告ID
    })
  }, 1000) // 0.5秒后跳转，给用户时间看到完成状态
}

// 处理分析错误
const handleAnalysisError = (error) => {
  hasError.value = true
  errorMessage.value = error.message || '分析失败，请重试'
  isScanning.value = false
  if (stepTimer) {
    clearTimeout(stepTimer)
    stepTimer = null
  }
  if (analysisTimer) clearTimeout(analysisTimer)
}

// 重试
const handleRetry = () => {
  startAnalysis()
}

// 组件挂载时开始分析
onMounted(() => {
  startAnalysis()
 
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (stepTimer) {
    clearTimeout(stepTimer)
    stepTimer = null
  }
  if (analysisTimer) clearTimeout(analysisTimer)
})
</script>

<style scoped>
.photo-analysis-container {
  width: 100%;
  max-width: 375px;
  min-width: 375px;
  height: 100vh;
  margin: 0 auto;
  background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
}

/* 顶部标题栏 */
.header {
  position: absolute;
  top: 5px;
  left: 0;
  right: 0;
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
}

.back-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  box-sizing: border-box;
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.5);
}

/* 微信小程序胶囊按钮 */
.capsule-container {
  display: flex;
  align-items: center;
  height: 32px;
  min-width: 87px;
  width: 87px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 16px;
  padding: 0 6px;
  box-sizing: border-box;
  flex-shrink: 0;
  transition: background 0.2s;
  justify-content: space-between;
}

.capsule-container:active {
  background: rgba(0, 0, 0, 0.85);
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
  color: #fff;
  padding: 0;
  min-width: 0;
  transition: none;
}

.capsule-divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 2px;
  flex-shrink: 0;
}

/* 主要内容区域 */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 16px 40px;
  gap: 32px;
  box-sizing: border-box;
}

/* 照片显示区域 */
.photo-display {
  width: 100%;
  max-width: 280px;
  aspect-ratio: 1;
  position: relative;
  box-sizing: border-box;
}

.photo-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 扫描线动画 */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    #1AD299 50%, 
    transparent 100%
  );
  animation: scanMove 2s linear infinite;
  z-index: 10;
  box-shadow: 0 0 10px rgba(26, 211, 153, 0.8);
}

@keyframes scanMove {
  0% {
    top: 0;
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

/* 扫描光效 */
.scan-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(26, 211, 153, 0.1) 0%,
    transparent 20%,
    transparent 80%,
    rgba(26, 211, 153, 0.1) 100%
  );
  animation: glowPulse 2s ease-in-out infinite;
  pointer-events: none;
  z-index: 5;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

/* 分析步骤 */
.analysis-steps {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  opacity: 0.4;
  transition: opacity 0.3s;
}

.step-item.active {
  opacity: 1;
}

.step-item.completed {
  opacity: 0.7;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
  transition: all 0.3s;
  box-sizing: border-box;
}

.step-item.active .step-number {
  background: #1AD299;
  border-color: #1AD299;
  color: #fff;
  box-shadow: 0 0 12px rgba(26, 211, 153, 0.5);
}

.step-item.completed .step-number {
  background: rgba(26, 211, 153, 0.3);
  border-color: #1AD299;
  color: #1AD299;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}

.step-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

.step-loading {
  display: flex;
  align-items: center;
  gap: 4px;
}

.loading-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1AD299;
  animation: dotBounce 1.4s ease-in-out infinite;
}

.loading-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotBounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* 温馨提示 */
.tip-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  box-sizing: border-box;
}

.tip-message svg {
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
}

/* 错误提示 */
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  box-sizing: border-box;
}

.error-icon {
  color: #ff6b6b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  line-height: 1.5;
}

.retry-btn {
  padding: 12px 32px;
  background: #1AD299;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
}

.retry-btn:active {
  transform: scale(0.95);
  background: #17C088;
}

/* 微信小程序375px适配 */
@media screen and (max-width: 375px) {
  .photo-analysis-container {
    width: 100vw;
    max-width: 100vw;
    min-width: 100vw;
  }
  
  .header {
    width: 100vw;
    max-width: 100vw;
  }
  
  .content-area {
    padding: 80px 12px 40px;
  }
  
  .photo-display {
    max-width: 260px;
  }
  
  .analysis-steps {
    max-width: 100%;
  }
}
</style>

