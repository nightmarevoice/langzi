<template>
  <div class="customer-service-container">
    <!-- 顶部栏 -->
    <div class="header">
      <button class="back-btn" @click="handleBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="header-title">客服咨询</h1>
      <div class="header-right">
        <!-- 胶囊按钮（关闭 + 更多） -->
        <div class="capsule-container">
          <!-- 关闭按钮 -->
          <button class="capsule-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
              <circle cx="18" cy="12" r="1.5" fill="currentColor"/>
            </svg>
          </button>
          <!-- 分隔线 -->
          <div class="capsule-divider"></div>
          <!-- 更多按钮 -->
          <button class="capsule-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 外圆环：直径10px，半径5px -->
              <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
              <!-- 内圆：直径3px，半径1.5px -->
              <circle cx="9" cy="9" r="2" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

   
    <!-- 消息列表 -->
    <div class="messages-container" ref="messagesContainer">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        class="message-wrapper"
        :class="{ 'user-message': message.type === 'user' || message.type === 'user-report', 'ai-message': message.type === 'ai', 'system-message': message.type === 'system' }"
      >
        <!-- 用户消息 -->
        <div v-if="message.type === 'user'" class="message user">
          <div class="avatar user-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div :class="{ 'message-content' : !message.image , 'image-content': message.image }">
            <div v-if="message.voice" class="voice-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 10V12C19 15.87 15.87 19 12 19M5 10V12C5 15.87 8.13 19 12 19M12 19V23M8 23H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>语音消息</span>
            </div>
            <p v-if="message.text && !message.voice">{{ message.text }}</p>
            <img v-if="message.image" :src="message.image" alt="用户上传" class="message-image" @click.stop="openImageViewer(message.image)" />
          </div>
          <div class="message-time">{{ formatTime(message.time) }}</div>
        </div>

        <!-- 用户皮肤报告卡片 -->
        <div v-if="message.type === 'user-report'" class="message user-report">
          <div class="avatar user-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="skin-report-card">
            <div class="card-header">
              <div class="card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                </svg>
              </div>
              <div class="card-title">
                <h4>皮肤测试报告</h4>
                <span class="card-time">{{ formatTime(message.time) }}</span>
              </div>
            </div>
            <div class="card-content">
              <div class="report-summary">
                <div class="summary-item">
                  <span class="label">肤质类型：</span>
                  <span class="value">{{ message.skinReport.skinType }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">综合评分：</span>
                  <span class="value score">{{ message.skinReport.score }}分</span>
                </div>
                <div class="summary-item">
                  <span class="label">主要问题：</span>
                  <span class="value">{{ message.skinReport.mainProblems.join('、') }}</span>
                </div>
              </div>
              <div class="radar-preview">
                <div class="radar-title">维度分析</div>
                <div class="radar-indicators">
                  <div v-for="(value, index) in message.skinReport.radarData" :key="index" class="indicator-item">
                    <span class="indicator-name">{{ ['水润度', '光泽度', '弹性', '紧致度', '细腻度', '均匀度'][index] }}</span>
                    <div class="indicator-bar">
                      <div class="indicator-fill" :style="{ width: value + '%' }"></div>
                    </div>
                    <span class="indicator-value">{{ value }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI消息 -->
        <div v-if="message.type === 'ai'" class="message ai">
          <div class="avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V3H13V9H21ZM14 10V12H22V10H14ZM14 14V16H22V14H14ZM14 18V20H22V18H14Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="message-content">
            <p>{{ message.text }}</p>
          </div>
          <div class="message-time">{{ formatTime(message.time) }}</div>
        </div>

        
      </div>
    </div>

    <!-- 自动气泡 -->
    <div class="auto-bubbles-container" v-if="currentBubbles.length > 0">
      <div class="auto-bubbles">
        <div
          v-for="(bubble, index) in currentBubbles"
          :key="index"
          @click="handleBubbleAction(bubble.action)"
          class="bubble-item"
        >
          {{ bubble.text }}
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-actions" v-if="showQuickActions">
      <div 
        v-for="(action, index) in quickActions" 
        :key="index"
        class="quick-action-item"
        @click="handleQuickAction(action)"
      >
        {{ action.label }}
      </div>
    </div>

    

    <!-- 底部输入区 -->
    <div class="input-area">
      <div class="input-toolbar">
        <button class="toolbar-btn" @click="handleImageUpload">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="toolbar-btn" @click="toggleVoiceInput">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 10V12C19 15.87 15.87 19 12 19M5 10V12C5 15.87 8.13 19 12 19M12 19V23M8 23H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="input-wrapper">
        <textarea
          v-model="inputText"
          class="input-text"
          placeholder="输入您的问题..."
          rows="1"
          @keydown.enter.exact.prevent="handleSend"
          @input="handleInput"
        ></textarea>
        <button 
          class="send-btn" 
          :disabled="!canSend"
          @click="handleSend"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 语音输入提示 -->
    <div v-if="isVoiceInput" class="voice-input-overlay" @click="toggleVoiceInput">
      <div class="voice-input-content">
        <div class="voice-icon" :class="{ recording: isRecording }">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 10V12C19 15.87 15.87 19 12 19M5 10V12C5 15.87 8.13 19 12 19M12 19V23M8 23H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="voice-text">{{ isRecording ? recordingText : '准备录音' }}</p>
        <p class="voice-hint">{{ isRecording ? '点击结束录音' : '点击开始录音' }}</p>
      </div>
    </div>

    <!-- 图片查看器 -->
    <div v-if="imageViewer.visible" class="image-viewer-overlay" @click="closeImageViewer">
      <div class="image-viewer-content">
        <button class="image-viewer-close" @click="closeImageViewer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <img :src="imageViewer.imageUrl" alt="查看图片" class="image-viewer-image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 报告摘要展开状态
const reportExpanded = ref(false)

// 消息列表
const messages = ref([
  {
    type: 'ai',
    text: '您好！我是AI护肤顾问，可以基于您的测肤报告为您提供专业的护肤建议。有什么问题可以随时问我哦~',
    time: new Date(),
    id: 'msg_1'
  }
])

// 当前用户测肤报告数据（模拟）
const currentSkinReport = ref({
  skinType: '混合性肌肤',
  mainProblems: ['T区出油严重', '毛孔粗大', '轻微色斑'],
  recommendations: ['控油保湿', '定期清洁', '防晒保护'],
  lastTestTime: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2小时前
})

// 生成详细的报告分析数据
const generateReportAnalysis = (skinReport) => {
  const analysis = {
    skinTypeAnalysis: {},
    dimensionAnalysis: {},
    problemAnalysis: {},
    careRecommendations: {},
    productRecommendations: {},
    improvementPlan: {}
  }

  // 1. 肤质类型分析
  analysis.skinTypeAnalysis = {
    primaryType: skinReport.skinTypes[0],
    secondaryType: skinReport.skinTypes[1] || null,
    characteristics: getSkinTypeCharacteristics(skinReport.skinTypes),
    dailyCareTips: getDailyCareTips(skinReport.skinTypes),
    seasonalAdjustments: getSeasonalAdjustments(skinReport.skinTypes)
  }

  // 2. 维度详细分析 [水润度, 光泽度, 弹性, 紧致度, 细腻度, 均匀度]
  analysis.dimensionAnalysis = {
    hydration: analyzeDimension('水润度', skinReport.radarData[0]),
    gloss: analyzeDimension('光泽度', skinReport.radarData[1]),
    elasticity: analyzeDimension('弹性', skinReport.radarData[2]),
    firmness: analyzeDimension('紧致度', skinReport.radarData[3]),
    smoothness: analyzeDimension('细腻度', skinReport.radarData[4]),
    uniformity: analyzeDimension('均匀度', skinReport.radarData[5])
  }

  // 3. 问题深度分析
  analysis.problemAnalysis = {
    identifiedProblems: skinReport.problems.map(problem => ({
      type: problem,
      severity: getProblemSeverity(problem, skinReport.radarData),
      description: getProblemDescription(problem),
      causes: getProblemCauses(problem),
      symptoms: getProblemSymptoms(problem),
      longTermEffects: getLongTermEffects(problem)
    })),
    priorityOrder: getPriorityOrder(skinReport.problems),
    interactions: getProblemInteractions(skinReport.problems)
  }

  // 4. 护理建议
  analysis.careRecommendations = {
    morningRoutine: getMorningRoutine(skinReport),
    eveningRoutine: getEveningRoutine(skinReport),
    weeklyCare: getWeeklyCare(skinReport),
    seasonalAdjustments: getSeasonalCareAdjustments(skinReport),
    lifestyleFactors: getLifestyleFactors(skinReport)
  }

  // 5. 产品推荐
  analysis.productRecommendations = {
    essentials: getEssentialProducts(skinReport),
    targeted: getTargetedProducts(skinReport.problems),
    seasonal: getSeasonalProducts(skinReport),
    budgetOptions: getBudgetOptions(skinReport),
    premiumOptions: getPremiumOptions(skinReport)
  }

  // 6. 改善计划
  analysis.improvementPlan = {
    shortTerm: getShortTermGoals(skinReport), // 1-4周
    mediumTerm: getMediumTermGoals(skinReport), // 1-3个月
    longTerm: getLongTermGoals(skinReport), // 3-6个月
    milestones: getImprovementMilestones(skinReport),
    monitoring: getMonitoringIndicators(skinReport)
  }

  return analysis
}

// 肤质特征分析
const getSkinTypeCharacteristics = (skinTypes) => {
  const characteristics = {
    '油性皮肤': ['皮脂分泌旺盛', 'T区油光明显', '毛孔粗大', '易长痘痘', '妆容不易脱落'],
    '干性皮肤': ['水分流失快', '角质层薄', '易起皮屑', '细纹明显', '对环境敏感'],
    '中性皮肤': ['皮脂平衡', '毛孔细小', '肤色均匀', '弹性良好', '耐受性强'],
    '混合性皮肤': ['T区出油', 'U区干燥', '毛孔不均匀', '局部敏感', '需要分区护理'],
    '敏感性皮肤': ['易红易痒', '屏障脆弱', '耐受性差', '易过敏', '需要温和护理'],
    '成熟肌': ['胶原蛋白减少', '弹性下降', '皱纹增多', '色斑出现', '需要抗衰护理']
  }

  return skinTypes.flatMap(type => characteristics[type] || [])
}

// 日常护理建议
const getDailyCareTips = (skinTypes) => {
  const tips = {
    '油性皮肤': ['早晚洁面', '使用控油产品', '定期去角质', '防晒不可少'],
    '干性皮肤': ['补水保湿', '避免碱性洁面', '使用温和产品', '室内湿度要够'],
    '中性皮肤': ['基础护理', '定期补水', '适当去角质', '均衡饮食'],
    '混合性皮肤': ['分区护理', 'T区控油', 'U区保湿', '选择温和产品'],
    '敏感性皮肤': ['成分简单', '避免刺激', '温和护理', '咨询专业人士'],
    '成熟肌': ['抗衰护理', '补充胶原', '防晒必备', '定期检查']
  }

  return skinTypes.flatMap(type => tips[type] || [])
}

// 季节性调整
const getSeasonalAdjustments = (skinTypes) => {
  return {
    spring: ['防过敏', '保湿补水', '温和护理', '防晒准备'],
    summer: ['强效防晒', '清凉补水', '控油保湿', '防晒霜必备'],
    autumn: ['深度保湿', '修复屏障', '防干燥', '温和护理'],
    winter: ['深度补水', '锁水保湿', '室内加湿', '温和护肤']
  }
}

// 维度分析
const analyzeDimension = (name, value) => {
  let level, description, advice

  if (value >= 80) {
    level = '优秀'
    description = `${name}表现优秀，处于健康状态`
    advice = '继续保持现有的护理习惯'
  } else if (value >= 70) {
    level = '良好'
    description = `${name}状况良好，但有改善空间`
    advice = '适当加强相关护理'
  } else if (value >= 60) {
    level = '一般'
    description = `${name}需要关注和改善`
    advice = '建议调整护理方案'
  } else {
    level = '需改善'
    description = `${name}状况不佳，需要重点关注`
    advice = '需要专业护理干预'
  }

  return { name, value, level, description, advice }
}

// 问题严重程度
const getProblemSeverity = (problem, radarData) => {
  const severityMap = {
    'pore': Math.max(0, 100 - radarData[4]), // 细腻度倒数
    'acne': Math.max(0, 100 - radarData[5]), // 均匀度倒数
    'spot': Math.max(0, 100 - radarData[5]), // 均匀度倒数
    'dry': Math.max(0, 100 - radarData[0]), // 水润度倒数
    'wrinkle': Math.max(0, 100 - radarData[2] - radarData[3]), // 弹性和紧致度倒数
    'sensitive': 60, // 敏感度固定中等
    'oil': Math.max(0, 100 - radarData[1]) // 光泽度倒数（油腻影响光泽）
  }

  const severity = severityMap[problem] || 50
  if (severity >= 70) return '严重'
  if (severity >= 50) return '中等'
  return '轻微'
}

// 问题描述
const getProblemDescription = (problem) => {
  const descriptions = {
    'pore': '毛孔扩张，影响皮肤质地',
    'acne': '炎性丘疹，影响皮肤健康',
    'spot': '色素沉着，影响肤色均匀',
    'dry': '水分不足，导致皮肤干燥',
    'wrinkle': '胶原流失，形成细纹皱纹',
    'sensitive': '屏障受损，容易过敏红肿',
    'oil': '油脂过多，影响妆容持久'
  }
  return descriptions[problem] || '需要进一步评估'
}

// 问题成因
const getProblemCauses = (problem) => {
  const causes = {
    'pore': ['皮脂分泌旺盛', '清洁不彻底', '荷尔蒙影响', '遗传因素'],
    'acne': ['皮脂堵塞毛孔', '细菌滋生', '压力过大', '饮食不当'],
    'spot': ['紫外线损伤', '激素变化', '炎症后色沉', '衰老氧化'],
    'dry': ['环境干燥', '清洁过度', '护肤不当', '季节变化'],
    'wrinkle': ['胶原减少', '自由基损伤', '表情习惯', '衰老过程'],
    'sensitive': ['屏障损伤', '过敏原接触', '清洁过度', '环境刺激'],
    'oil': ['皮脂腺活跃', '荷尔蒙波动', '压力影响', '遗传倾向']
  }
  return causes[problem] || []
}

// 问题症状
const getProblemSymptoms = (problem) => {
  const symptoms = {
    'pore': ['毛孔粗大', '皮肤粗糙', '油光明显', '粉刺增多'],
    'acne': ['红肿丘疹', '脓包形成', '疼痛不适', '色素沉着'],
    'spot': ['肤色不均', '斑点出现', '暗沉明显', '肤质粗糙'],
    'dry': ['皮肤干燥', '细纹增多', '脱皮现象', '紧绷不适'],
    'wrinkle': ['细纹出现', '皮肤松弛', '弹性下降', '皱纹加深'],
    'sensitive': ['红肿发热', '痒痛不适', '过敏反应', '屏障脆弱'],
    'oil': ['油腻光泽', '毛孔堵塞', '粉刺痘痘', '妆容浮粉']
  }
  return symptoms[problem] || []
}

// 长期影响
const getLongTermEffects = (problem) => {
  const effects = {
    'pore': ['皮肤老化加速', '毛孔难以恢复', '影响肤质', '自信心下降'],
    'acne': ['疤痕形成', '色素沉着', '皮肤凹凸', '心理压力'],
    'spot': ['肤色不均', '老化加速', '难于淡化', '影响美观'],
    'dry': ['细纹增多', '屏障受损', '敏感加重', '舒适度差'],
    'wrinkle': ['衰老加剧', '皮肤松弛', '皱纹加深', '自信缺失'],
    'sensitive': ['过敏频繁', '护理受限', '生活不便', '心理负担'],
    'oil': ['痘痘频发', '毛孔粗大', '肤质粗糙', '社交困扰']
  }
  return effects[problem] || []
}

// 优先级排序
const getPriorityOrder = (problems) => {
  const priorityMap = {
    'acne': 1,      // 炎症问题优先处理
    'sensitive': 1, // 敏感问题优先处理
    'dry': 2,       // 干燥问题中等优先
    'wrinkle': 2,   // 皱纹问题中等优先
    'pore': 3,      // 毛孔问题较低优先
    'spot': 3,      // 色斑问题较低优先
    'oil': 3        // 出油问题较低优先
  }

  return problems.sort((a, b) => (priorityMap[a] || 4) - (priorityMap[b] || 4))
}

// 问题相互作用
const getProblemInteractions = (problems) => {
  const interactions = []

  if (problems.includes('acne') && problems.includes('pore')) {
    interactions.push('痘痘和毛孔问题互为因果，痘痘易导致毛孔扩张')
  }
  if (problems.includes('dry') && problems.includes('sensitive')) {
    interactions.push('干燥容易导致皮肤敏感，敏感肌肤更易干燥')
  }
  if (problems.includes('acne') && problems.includes('spot')) {
    interactions.push('痘痘炎症后容易形成色素沉着')
  }
  if (problems.includes('oil') && problems.includes('acne')) {
    interactions.push('油脂分泌过多易堵塞毛孔，导致痘痘形成')
  }

  return interactions
}

// 晨间护理
const getMorningRoutine = (skinReport) => {
  const baseSteps = [
    { step: '洁面', product: '温和洁面产品', time: '2分钟' },
    { step: '爽肤水', product: '保湿爽肤水', time: '1分钟' },
    { step: '精华液', product: '针对性精华', time: '2分钟' },
    { step: '防晒霜', product: 'SPF30+防晒霜', time: '3分钟' }
  ]

  // 根据肤质调整
  if (skinReport.skinTypes.includes('油性皮肤')) {
    baseSteps.splice(1, 0, { step: '控油爽肤', product: '控油爽肤水', time: '1分钟' })
  }

  return baseSteps
}

// 晚间护理
const getEveningRoutine = (skinReport) => {
  const baseSteps = [
    { step: '卸妆洁面', product: '温和卸妆产品', time: '3分钟' },
    { step: '二次清洁', product: '泡沫洁面', time: '2分钟' },
    { step: '爽肤水', product: '保湿爽肤水', time: '1分钟' },
    { step: '眼霜', product: '眼部护理霜', time: '1分钟' },
    { step: '精华液', product: '营养精华', time: '2分钟' },
    { step: '面霜', product: '保湿面霜', time: '2分钟' }
  ]

  return baseSteps
}

// 每周护理
const getWeeklyCare = (skinReport) => {
  return [
    { frequency: '2-3次/周', care: '去角质', method: '使用温和的化学去角质产品' },
    { frequency: '1-2次/周', care: '面膜', method: '根据肤质选择相应面膜' },
    { frequency: '1次/周', care: '深层清洁', method: '使用清洁面膜或去黑头产品' }
  ]
}

// 季节性护理调整
const getSeasonalCareAdjustments = (skinReport) => {
  return {
    spring: '增加保湿，准备防晒',
    summer: '强化防晒，补充水分',
    autumn: '深度补水，修复屏障',
    winter: '加强保湿，温和护理'
  }
}

// 生活方式因素
const getLifestyleFactors = (skinReport) => {
  return [
    '保证7-8小时睡眠',
    '规律作息，避免熬夜',
    '均衡饮食，多喝水',
    '适量运动，保持心情愉悦',
    '减少化妆品使用频率',
    '定期更换床品和毛巾'
  ]
}

// 基础护理产品
const getEssentialProducts = (skinReport) => {
  return [
    { category: '洁面', essential: true, recommendation: '氨基酸洁面产品' },
    { category: '保湿', essential: true, recommendation: '含有透明质酸的面霜' },
    { category: '防晒', essential: true, recommendation: 'SPF30+物理防晒霜' },
    { category: '眼部', essential: false, recommendation: '维生素C眼霜' }
  ]
}

// 针对性产品
const getTargetedProducts = (problems) => {
  const products = {}

  if (problems.includes('pore')) {
    products.poreCare = [
      { name: '收缩水', purpose: '收缩毛孔' },
      { name: '泥膜', purpose: '深层清洁' },
      { name: '维A酸', purpose: '改善毛孔' }
    ]
  }

  if (problems.includes('acne')) {
    products.acneCare = [
      { name: '水杨酸', purpose: '去角质消炎' },
      { name: '烟酰胺', purpose: '改善肤质' },
      { name: '茶树精油', purpose: '抗菌消炎' }
    ]
  }

  if (problems.includes('spot')) {
    products.spotCare = [
      { name: '维生素C', purpose: '美白淡斑' },
      { name: '熊果苷', purpose: '抑制黑色素' },
      { name: '传明酸', purpose: '改善色斑' }
    ]
  }

  return products
}

// 季节性产品
const getSeasonalProducts = (skinReport) => {
  return {
    spring: ['防敏产品', '保湿霜', '防晒霜'],
    summer: ['防晒霜', '控油产品', '补水面膜'],
    autumn: ['保湿霜', '修复霜', '温和洁面'],
    winter: ['滋润霜', '唇部护理', '护手霜']
  }
}

// 预算选项
const getBudgetOptions = (skinReport) => {
  return [
    { range: '¥0-200', suitable: '基础护理，适合学生党' },
    { range: '¥200-500', suitable: '进阶护理，性价比高' },
    { range: '¥500-1000', suitable: '专业护理，效果更好' },
    { range: '¥1000+', suitable: '高端护理，综合改善' }
  ]
}

// 高级选项
const getPremiumOptions = (skinReport) => {
  return [
    { brand: 'La Mer', focus: '深度修复' },
    { brand: 'SK-II', focus: '美白抗衰' },
    { brand: 'Estee Lauder', focus: '抗衰老化' },
    { brand: 'Clinique', focus: '温和护理' }
  ]
}

// 短期目标 (1-4周)
const getShortTermGoals = (skinReport) => {
  return [
    '建立规律的护肤习惯',
    '改善皮肤清洁度',
    '减少明显炎症反应',
    '提高皮肤舒适度'
  ]
}

// 中期目标 (1-3个月)
const getMediumTermGoals = (skinReport) => {
  return [
    '改善主要皮肤问题',
    '提升皮肤整体状态',
    '建立适合的护理体系',
    '培养良好生活习惯'
  ]
}

// 长期目标 (3-6个月)
const getLongTermGoals = (skinReport) => {
  return [
    '实现皮肤问题根本改善',
    '维持健康的皮肤状态',
    '建立完善的保养体系',
    '培养持续的健康生活方式'
  ]
}

// 改善里程碑
const getImprovementMilestones = (skinReport) => {
  return [
    { week: 2, milestone: '皮肤适应新产品，无不适反应' },
    { week: 4, milestone: '主要问题开始缓解' },
    { month: 2, milestone: '皮肤状态明显改善' },
    { month: 3, milestone: '建立稳定的护理习惯' },
    { month: 6, milestone: '达到理想的皮肤状态' }
  ]
}

// 监测指标
const getMonitoringIndicators = (skinReport) => {
  return [
    '皮肤水润度变化',
    '毛孔粗细变化',
    '痘痘数量变化',
    '肤色均匀度变化',
    '皮肤舒适度变化',
    '产品耐受性变化'
  ]
}

// 是否正在转人工
const isTransferringToHuman = ref(false)

// 当前显示的气泡
const currentBubbles = ref([])

// 图片查看器
const imageViewer = ref({
  visible: false,
  imageUrl: ''
})

// 快捷入口
const quickActions = ref([
  { label: '预约面诊', value: 'book_appointment', icon: 'calendar' },
  { label: '查看价目表', value: 'price_list', icon: 'list' },
  { label: '联系人工', value: 'contact_human', icon: 'user' }
])

const showQuickActions = ref(true)

// 顶部栏胶囊
const headerCapsules = ref([
  { label: '历史', value: 'history' },
  { label: '设置', value: 'settings' }
])

// 输入框上方快捷胶囊
const inputCapsules = ref([
  '好的，谢谢',
  '明白了',
  '还有其他建议吗？',
  '推荐产品'
])
const showInputCapsules = ref(true)

// 输入相关
const inputText = ref('')
const isVoiceInput = ref(false)
const messagesContainer = ref(null)

// 计算是否可以发送
const canSend = computed(() => {
  return inputText.value.trim().length > 0
})

// 切换报告摘要
const toggleReport = () => {
  reportExpanded.value = !reportExpanded.value
}

// 返回
const handleBack = () => {
  router.back()
}

// 处理输入
const handleInput = (e) => {
  const textarea = e.target
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px'
}

// 发送消息
const handleSend = async () => {
  if (!canSend.value) return

  const userMessage = {
    type: 'user',
    text: inputText.value.trim(),
    time: new Date(),
    id: 'msg_' + Date.now()
  }

  messages.value.push(userMessage)
  inputText.value = ''
  showQuickActions.value = false
  showInputCapsules.value = false

  // 清除当前气泡
  currentBubbles.value = []

  // 滚动到底部
  await nextTick()
  scrollToBottom()

  // 模拟AI回复
  setTimeout(async () => {
    const aiResponse = await generateAIResponse(userMessage.text)
    const aiMessage = {
      type: 'ai',
      text: aiResponse,
      time: new Date(),
      id: 'msg_' + Date.now()
    }
    messages.value.push(aiMessage)

    // AI回复后自动生成3个气泡
    setTimeout(() => {
      currentBubbles.value = generateAutoBubbles(userMessage.text)
    }, 500)

    nextTick(() => {
      scrollToBottom()
    })
  }, 1000)
}

// 生成AI回复（模拟）- 实现上下文感知
const generateAIResponse = async (userText) => {
  // 检查是否有传递的皮肤报告数据
  const skinReportParam = route.query.skinReport
  let skinReport = null
  let detailedAnalysis = null

  if (skinReportParam) {
    try {
      skinReport = JSON.parse(skinReportParam)
      detailedAnalysis = generateReportAnalysis(skinReport)
    } catch (error) {
      console.error('解析皮肤报告数据失败:', error)
    }
  }

  // 检查是否刚刚测完肤（2小时内）
  const isRecentTest = skinReport && (Date.now() - new Date(skinReport.lastTestTime).getTime()) < 2 * 60 * 60 * 1000

  let contextAwareResponse = ''

  // 如果有详细分析数据，使用专业回复
  if (detailedAnalysis) {
    contextAwareResponse = `根据您的测肤报告分析，我来为您详细解读：\n\n`

    // 检查是否需要转人工
    if (userText.includes('复杂') || userText.includes('严重') || userText.includes('紧急')) {
      setTimeout(() => {
        handleTransferToHuman('检测到您的问题可能需要专业医生指导')
      }, 2000)
    }
  }

  const lowerText = userText.toLowerCase()

  // 基于详细分析数据的智能回复
  if (detailedAnalysis) {
    if (lowerText.includes('肤质') || lowerText.includes('类型')) {
      return `${contextAwareResponse}您的肤质为${detailedAnalysis.skinTypeAnalysis.primaryType}${detailedAnalysis.skinTypeAnalysis.secondaryType ? `（${detailedAnalysis.skinTypeAnalysis.secondaryType}）` : ''}。\n\n主要特征：${detailedAnalysis.skinTypeAnalysis.characteristics.join('、')}。\n\n日常护理建议：${detailedAnalysis.skinTypeAnalysis.dailyCareTips.join('、')}。`
    }

    if (lowerText.includes('问题') || lowerText.includes('分析')) {
      const problems = detailedAnalysis.problemAnalysis.identifiedProblems
      let response = `${contextAwareResponse}检测到以下主要问题：\n\n`
      problems.forEach((problem, index) => {
        response += `${index + 1}. ${problem.description}（${problem.severity}程度）\n`
        response += `   主要成因：${problem.causes.join('、')}\n`
        response += `   建议处理：${problem.symptoms.join('、')}\n\n`
      })
      return response + '建议优先处理严重程度较高的问题。'
    }

    if (lowerText.includes('护理') || lowerText.includes('建议')) {
      const morning = detailedAnalysis.careRecommendations.morningRoutine
      const evening = detailedAnalysis.careRecommendations.eveningRoutine

      let response = `${contextAwareResponse}为您推荐的护理方案：\n\n🌅 晨间护理（${morning.length}步）：\n`
      morning.forEach((step, index) => {
        response += `${index + 1}. ${step.step} - ${step.product}（${step.time}）\n`
      })

      response += `\n🌙 晚间护理（${evening.length}步）：\n`
      evening.forEach((step, index) => {
        response += `${index + 1}. ${step.step} - ${step.product}（${step.time}）\n`
      })

      return response + `\n\n每周还建议进行${detailedAnalysis.careRecommendations.weeklyCare.map(c => c.care).join('、')}等深度护理。`
    }

    if (lowerText.includes('产品') || lowerText.includes('推荐')) {
      const essentials = detailedAnalysis.productRecommendations.essentials.filter(p => p.essential)
      let response = `${contextAwareResponse}根据您的肤质和问题，推荐以下产品：\n\n💫 基础必备：\n`
      essentials.forEach(product => {
        response += `• ${product.category}：${product.recommendation}\n`
      })

      const targeted = detailedAnalysis.productRecommendations.targeted
      if (Object.keys(targeted).length > 0) {
        response += `\n🎯 针对性产品：\n`
        Object.entries(targeted).forEach(([category, products]) => {
          response += `${category}：${products.map(p => p.name).join('、')}\n`
        })
      }

      return response
    }

    if (lowerText.includes('改善') || lowerText.includes('计划')) {
      const plan = detailedAnalysis.improvementPlan
      let response = `${contextAwareResponse}改善计划：\n\n📅 短期目标（1-4周）：\n${plan.shortTerm.map(g => `• ${g}`).join('\n')}\n\n`

      response += `🎯 中期目标（1-3个月）：\n${plan.mediumTerm.map(g => `• ${g}`).join('\n')}\n\n`

      response += `🏆 长期目标（3-6个月）：\n${plan.longTerm.map(g => `• ${g}`).join('\n')}\n\n`

      response += `📊 监测指标：\n${plan.monitoring.map(m => `• ${m}`).join('\n')}`

      return response
    }

    // 默认回复
    return `${contextAwareResponse}我已经基于您的测肤报告进行了详细分析。您可以询问关于肤质类型、问题分析、护理建议、产品推荐或改善计划等方面的问题，我会为您提供专业的解答。`
  }

  // 后备回复逻辑（无详细数据时）
  if (lowerText.includes('出油') || lowerText.includes('油')) {
    return `根据您的测肤报告，T区出油主要是因为皮脂分泌旺盛。建议您：
1. 使用温和的控油洁面产品
2. 选择含有水杨酸或烟酰amide成分的护肤品
3. 定期使用清洁面膜
4. 保持充足睡眠，避免熬夜`
  } else if (lowerText.includes('毛孔')) {
    return `针对毛孔粗大的问题，建议您：
1. 定期深层清洁，每周1-2次使用清洁面膜
2. 使用含有AHA/BHA成分的产品
3. 做好防晒，避免紫外线伤害
4. 保持肌肤水油平衡，避免过度清洁`
  } else if (lowerText.includes('痘痘') || lowerText.includes('痘')) {
    return `关于痘痘问题，根据您的肌肤类型，建议：
1. 使用温和的祛痘产品，避免过度刺激
2. 保持面部清洁，但不要过度清洁
3. 使用含有水杨酸或茶树精油的护肤品
4. 避免用手挤压，注意饮食和作息`
  } else if (lowerText.includes('色斑') || lowerText.includes('斑')) {
    return `针对色斑问题，建议您：
1. 做好防晒，这是最重要的
2. 使用含有维生素C、烟酰amide等美白成分的产品
3. 定期使用美白精华
4. 避免熬夜，保持良好作息`
  } else {
    return '感谢您的提问。我可以基于您的测肤报告为您提供专业的护肤建议。请问您想了解哪个方面的问题呢？比如肤质分析、问题诊断、护理建议或产品推荐等。'
  }
}

// 根据皮肤问题生成针对性气泡
const generateProblemBasedBubbles = (problems) => {
  const bubbles = []

  if (problems.some(p => p.includes('出油') || p.includes('油'))) {
    bubbles.push(
      { text: '如何控油', action: 'oil_control' },
      { text: '推荐控油产品', action: 'oil_products' }
    )
  }

  if (problems.some(p => p.includes('毛孔'))) {
    bubbles.push(
      { text: '毛孔收缩方法', action: 'pore_care' },
      { text: '毛孔清洁产品', action: 'pore_products' }
    )
  }

  if (problems.some(p => p.includes('痘') || p.includes('痘痘'))) {
    bubbles.push(
      { text: '祛痘护理', action: 'acne_care' },
      { text: '祛痘产品推荐', action: 'acne_products' }
    )
  }

  if (problems.some(p => p.includes('斑') || p.includes('色素'))) {
    bubbles.push(
      { text: '美白祛斑', action: 'whitening_care' },
      { text: '美白产品推荐', action: 'whitening_products' }
    )
  }

  if (problems.some(p => p.includes('皱纹') || p.includes('细纹'))) {
    bubbles.push(
      { text: '抗衰老护理', action: 'anti_aging' },
      { text: '抗皱产品推荐', action: 'anti_aging_products' }
    )
  }

  if (problems.some(p => p.includes('干燥'))) {
    bubbles.push(
      { text: '保湿护理', action: 'hydration_care' },
      { text: '保湿产品推荐', action: 'hydration_products' }
    )
  }

  // 如果没有匹配到特定问题，添加通用气泡
  if (bubbles.length === 0) {
    bubbles.push(
      { text: '日常护理建议', action: 'daily_care' },
      { text: '产品推荐', action: 'general_products' }
    )
  }

  return bubbles.slice(0, 4) // 最多显示4个气泡
}

// 生成自动气泡
const generateAutoBubbles = (userText) => {
  const lowerText = userText.toLowerCase()
  const bubbles = []

  if (lowerText.includes('出油') || lowerText.includes('油')) {
    bubbles.push(
      { text: '推荐控油产品', action: 'recommend_products' },
      { text: '如何正确清洁', action: 'cleaning_guide' },
      { text: '日常饮食建议', action: 'diet_tips' }
    )
  } else if (lowerText.includes('毛孔')) {
    bubbles.push(
      { text: '毛孔收缩方法', action: 'pore_tightening' },
      { text: '推荐收缩水', action: 'recommend_toner' },
      { text: '防晒很重要', action: 'sunscreen_reminder' }
    )
  } else if (lowerText.includes('痘痘') || lowerText.includes('痘')) {
    bubbles.push(
      { text: '祛痘产品推荐', action: 'acne_products' },
      { text: '日常护理步骤', action: 'acne_routine' },
      { text: '饮食注意事项', action: 'acne_diet' }
    )
  } else if (lowerText.includes('色斑') || lowerText.includes('斑')) {
    bubbles.push(
      { text: '美白产品推荐', action: 'whitening_products' },
      { text: '色斑淡化方法', action: 'spot_removal' },
      { text: '防晒必备', action: 'sunscreen_must' }
    )
  } else {
    bubbles.push(
      { text: '预约专业咨询', action: 'book_consultation' },
      { text: '查看热门产品', action: 'hot_products' },
      { text: '护肤小技巧', action: 'skin_tips' }
    )
  }

  return bubbles
}

// 快捷问题点击
const handleQuickQuestion = (question) => {
  inputText.value = question
  handleSend()
}

// 快捷入口点击
const handleQuickAction = (action) => {
  if (action.value === 'book_appointment') {
    handleBookAppointment()
  } else if (action.value === 'price_list') {
    handlePriceList()
  } else if (action.value === 'contact_human') {
    handleTransferToHuman('用户主动请求人工客服')
  } else {
    // 处理气泡点击
    handleBubbleAction(action.action)
  }
}

// 处理气泡点击
const handleBubbleAction = (action) => {
  const actionTexts = {
    // 控油相关
    oil_control: '如何有效控油？',
    oil_products: '推荐控油产品',
    // 毛孔相关
    pore_care: '毛孔收缩方法',
    pore_products: '毛孔清洁产品',
    // 痘痘相关
    acne_care: '祛痘护理方法',
    acne_products: '祛痘产品推荐',
    acne_routine: '日常护理步骤',
    acne_diet: '饮食注意事项',
    // 美白相关
    whitening_care: '美白祛斑方法',
    whitening_products: '美白产品推荐',
    // 抗衰相关
    anti_aging: '抗衰老护理',
    anti_aging_products: '抗皱产品推荐',
    // 保湿相关
    hydration_care: '保湿护理方法',
    hydration_products: '保湿产品推荐',
    // 通用
    daily_care: '日常护理建议',
    general_products: '产品推荐',
    // 旧的气泡动作（兼容性）
    recommend_products: '推荐控油产品',
    cleaning_guide: '如何正确清洁',
    diet_tips: '日常饮食建议',
    pore_tightening: '毛孔收缩方法',
    recommend_toner: '推荐收缩水',
    sunscreen_reminder: '防晒很重要',
    spot_removal: '色斑淡化方法',
    sunscreen_must: '防晒必备',
    book_consultation: '预约专业咨询',
    hot_products: '查看热门产品',
    skin_tips: '护肤小技巧'
  }

  if (actionTexts[action]) {
    inputText.value = actionTexts[action]
    handleSend()
  }
}

// 预约面诊
const handleBookAppointment = () => {
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({
      title: '跳转到预约页面',
      icon: 'none',
      duration: 2000
    })
  } else {
    alert('跳转到预约页面')
  }
  router.push('/my-appointments')
}

// 查看价目表
const handlePriceList = () => {
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({
      title: '跳转到价目表页面',
      icon: 'none',
      duration: 2000
    })
  } else {
    alert('跳转到价目表页面')
  }
  // 这里可以跳转到价目表页面
}

// 转人工客服
const handleTransferToHuman = (reason) => {
  if (isTransferringToHuman.value) return

  isTransferringToHuman.value = true

  // 添加转人工消息
  messages.value.push({
    type: 'system',
    text: `正在为您转接人工客服...\n原因：${reason}`,
    time: new Date(),
    id: 'msg_' + Date.now()
  })

  // 模拟转人工过程
  setTimeout(() => {
    messages.value.push({
      type: 'ai',
      text: '您好，我是人工客服小王，很高兴为您服务。请问有什么可以帮助您的吗？',
      time: new Date(),
      id: 'msg_' + Date.now(),
      isHuman: true
    })

    isTransferringToHuman.value = false

    nextTick(() => {
      scrollToBottom()
    })
  }, 2000)

  nextTick(() => {
    scrollToBottom()
  })
}

// 打开图片查看器
const openImageViewer = (imageUrl) => {
  imageViewer.value.visible = true
  imageViewer.value.imageUrl = imageUrl
}

// 关闭图片查看器
const closeImageViewer = () => {
  imageViewer.value.visible = false
  imageViewer.value.imageUrl = ''
}

// 输入框胶囊点击
const handleCapsuleClick = (capsule) => {
  inputText.value = capsule
  handleSend()
}

// 顶部栏胶囊点击
const handleHeaderCapsule = (capsule) => {
  if (capsule.value === 'history') {
    // TODO: 打开历史记录
    console.log('打开历史记录')
  } else if (capsule.value === 'settings') {
    // TODO: 打开设置
    console.log('打开设置')
  }
}

// 图片上传
const handleImageUpload = () => {
  // 创建文件输入
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageMessage = {
          type: 'user',
          image: event.target.result,
          time: new Date(),
          id: 'msg_' + Date.now()
        }
        messages.value.push(imageMessage)

        // 清除气泡
        currentBubbles.value = []

        nextTick(() => {
          scrollToBottom()
        })
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

// 语音识别状态
const isRecording = ref(false)
const recordingText = ref('')

// 切换语音输入
const toggleVoiceInput = () => {
  isVoiceInput.value = !isVoiceInput.value
  if (isVoiceInput.value) {
    startVoiceRecording()
  } else {
    stopVoiceRecording()
  }
}

// 开始语音录音
const startVoiceRecording = () => {
  isRecording.value = true
  recordingText.value = '正在录音...'

  // 模拟录音过程
  let dots = 0
  const recordingInterval = setInterval(() => {
    dots = (dots + 1) % 4
    recordingText.value = '正在录音' + '.'.repeat(dots)
  }, 500)

  // 3秒后自动停止并模拟识别结果
  setTimeout(() => {
    clearInterval(recordingInterval)
    stopVoiceRecording()
    simulateVoiceRecognition()
  }, 3000)
}

// 停止语音录音
const stopVoiceRecording = () => {
  isRecording.value = false
  isVoiceInput.value = false
}

// 模拟语音识别
const simulateVoiceRecognition = () => {
  const voiceTexts = [
    '为什么我额头总是出油？',
    '有什么好的祛痘产品推荐？',
    '毛孔粗大怎么改善？',
    '色斑怎么淡化？',
    '有什么适合敏感肌肤的产品？'
  ]

  const randomText = voiceTexts[Math.floor(Math.random() * voiceTexts.length)]
  inputText.value = randomText

  // 显示语音识别结果提示
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({
      title: '语音识别完成',
      icon: 'success',
      duration: 1500
    })
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 格式化时间
const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  // 检查是否有传递的皮肤报告数据
  const skinReportParam = route.query.skinReport
  
  if (skinReportParam) {
    try {
      const skinReportData = JSON.parse(skinReportParam)
      currentSkinReport.value = {
        ...skinReportData,
        lastTestTime: new Date(skinReportData.lastTestTime)
      }

      // 创建用户发送的皮肤报告卡片消息
      const userReportMessage = {
        type: 'user-report',
        skinReport: skinReportData,
        time: new Date(),
        id: 'msg_user_report'
      }

      // 创建AI欢迎消息
      const skinTypes = Array.isArray(skinReportData.skinTypes) ? skinReportData.skinTypes.join('、') : '混合性肌肤'
      const mainProblems = Array.isArray(skinReportData.mainProblems) ? skinReportData.mainProblems.join('、') : '皮肤问题'
      const score = skinReportData.score || '70'

      const welcomeMessage = {
        type: 'ai',
        text: `您好！我是AI护肤顾问。我已经收到并解读了您的测肤报告数据。您的肤质为${skinTypes}，主要问题包括${mainProblems}，综合评分为${score}分。

我可以为您提供：
• 📊 详细的肤质分析和维度解读
• 🔍 问题成因分析和改善建议
• 💆 个性化的护理方案和产品推荐
• 📈 长期改善计划和效果监测

请问您想先了解哪个方面的内容呢？`,
        time: new Date(Date.now() + 1000), // 1秒后
        id: 'msg_welcome'
      }

      // 设置消息列表
      messages.value = [userReportMessage, welcomeMessage]

      // 生成针对性的快捷气泡
      setTimeout(() => {
        const bubbles = generateProblemBasedBubbles(skinReportData.mainProblems)
        currentBubbles.value = bubbles
      }, 2000)

    } catch (error) {
      console.error('解析皮肤报告数据失败:', error)
    }
  }

  scrollToBottom()
})
</script>

<style scoped>
.customer-service-container {
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  overflow: hidden;
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

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333;
  padding: 0;
  flex-shrink: 0;
}

.back-btn:active {
  opacity: 0.7;
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

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* 微信小程序胶囊按钮 */
.capsule-container {
  display: flex;
  align-items: center;
  height: 32px;
  min-width: 87px;
  width: 87px;
  background: rgba(0, 0, 0, 0.1);
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
  color: rgba(0,0,0,.6);
  padding: 0;
  min-width: 0;
  transition: none;
}

.capsule-btn:hover {
  opacity: 1;
}

.capsule-btn:active {
  opacity: 1;
}

.capsule-divider {
  width: 2px;
  height: 16px;
  background: rgba(0,0,0, 0.3);
  margin: 0 2px;
  flex-shrink: 0;
}

/* 报告摘要 */
.report-summary {
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
  transition: all 0.3s;
  border-radius: 5px;
  padding:6px;
  color:#454242;
  font-size:12px;
}

.report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  cursor: pointer;
}

.report-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1AD299;
}

.report-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.expand-icon {
  color: #999;
  transition: transform 0.3s;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.report-content {
  padding: 0 24px 16px;
  border-top: 1px solid #f5f5f5;
  margin-top: 8px;
  padding-top: 16px;
}

.report-item {
  display: flex;
  margin-bottom: 8px;
  font-size: 13px;
}

.report-item:last-child {
  margin-bottom: 0;
}

.report-label {
  color: #666;
  margin-right: 8px;
}

.report-value {
  color: #333;
  flex: 1;
}

/* 消息列表 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.message-wrapper.user-message {
  justify-content: flex-end;
}

.message-wrapper.ai-message {
  justify-content: flex-start;
}

.message-wrapper.user-report {
  justify-content: flex-start;
}

.message {
  display: flex;
  gap: 8px;
  max-width: 85%;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message .message {
  flex-direction: row-reverse;
}

.ai-message .message {
  flex-direction: row;
}

.message.user .message-content {
  background: linear-gradient(135deg, #1AD299 0%, #17C088 100%);
  color: white;
  border-radius: 12px 12px 4px 12px;
  padding: 12px 16px;
}

.message.ai .message-content {
  background: white;
  color: #333;
  border-radius: 12px 12px 12px 4px;
  padding: 12px 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-content p {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}
.image-content{
  border-radius: 10px;
  overflow: hidden;
}

.message-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  margin-top: 8px;
}

/* 用户消息中的图片特殊样式 */
.user-message .message-image {
  margin-top: 0;
  border-radius: 0;
  box-shadow: none;
  border: none;
  background: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.user-message .message-image:hover {
  opacity: 0.8;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  padding: 0 4px;
  flex-shrink:0;
}

.user-message .message-time {
  text-align: right;
}

.ai-message .message-time {
  text-align: left;
}

/* 皮肤报告卡片 */
.user-report {
  align-items: flex-start;
}

.user-report .message {
  flex-direction: row-reverse;
  margin-left: auto;
}

.skin-report-card {
  background: linear-gradient(135deg, #1AD299 0%, #17C088 100%);
  color: white;
  border-radius: 12px 12px 4px 12px;
  padding: 16px;
  max-width: 280px;
  box-shadow: 0 2px 12px rgba(26, 211, 153, 0.3);
  animation: fadeIn 0.3s;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.card-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 2px 0;
}

.card-time {
  font-size: 11px;
  opacity: 0.8;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-summary {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-item {
  display: flex;
  justify-content: start;
  align-items: center;
  font-size: 12px;
}

.summary-item .label {
  opacity: 0.9;
}

.summary-item .value {
  font-weight: 500;
}

.summary-item .value.score {
  color: #FFD700;
  font-weight: 700;
}

.radar-preview {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
}

.radar-title {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
}

.radar-indicators {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.indicator-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.indicator-name {
  min-width: 40px;
  opacity: 0.9;
}

.indicator-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.indicator-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  transition: width 0.8s ease;
}

.indicator-value {
  min-width: 30px;
  text-align: right;
  font-weight: 500;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1AD299 0%, #17C088 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.user-avatar {
  background: linear-gradient(135deg, #6C9EFF 0%, #5A87E6 100%);
}

/* 系统消息（快捷问题） */
.system-message {
  width: 100%;
}

.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-question-item {
  background: linear-gradient(135deg, #1AD299 0%, #17C088 100%);
  border: none;
  border-radius: 20px;
  padding: 10px 18px;
  font-size: 14px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(26, 211, 153, 0.3);
  font-weight: 500;
}

.quick-question-item:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(26, 211, 153, 0.4);
}

/* 快捷入口 */
.quick-actions {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #e8e8e8;
  flex-shrink: 0;
  overflow-x: auto;
}

.quick-action-item {
  background: linear-gradient(135deg, #1AD299 0%, #17C088 100%);
  border-radius: 20px;
  padding: 10px 18px;
  font-size: 14px;
  color: white;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(26, 211, 153, 0.3);
  font-weight: 500;
}

.quick-action-item:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(26, 211, 153, 0.4);
}

/* 输入框上方快捷胶囊 */
.input-capsules {
  display: flex;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border-top: 1px solid #e8e8e8;
  flex-shrink: 0;
  overflow-x: auto;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.capsule-item {
  background: linear-gradient(135deg, #1AD299 0%, #17C088 100%);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 13px;
  color: white;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(26, 211, 153, 0.25);
  font-weight: 500;
}

.capsule-item:active {
  transform: scale(0.95);
  box-shadow: 0 1px 3px rgba(26, 211, 153, 0.35);
}

/* 底部输入区 */
.input-area {
  background: white;
  border-top: 1px solid #e8e8e8;
  flex-shrink: 0;
  padding: 12px 16px;
}

.input-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0;
  border-radius: 4px;
}

.toolbar-btn:active {
  background: #f5f5f5;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 8px 12px;
}

.input-text {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #333;
  resize: none;
  outline: none;
  max-height: 100px;
  line-height: 1.5;
  font-family: inherit;
}

.input-text::placeholder {
  color: #999;
}

.send-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1AD299 0%, #17C088 100%);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: white;
  padding: 0;
  flex-shrink: 0;
  transition: opacity 0.2s;
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.send-btn:not(:disabled):active {
  opacity: 0.8;
}

/* 语音输入遮罩 */
.voice-input-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.voice-input-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
}

.voice-icon {
  color: #1AD299;
  margin-bottom: 16px;
}

.voice-text {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px 0;
}

.voice-hint {
  font-size: 13px;
  color: #999;
  margin: 0;
}

/* 自动气泡 */
.auto-bubbles-container {
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.auto-bubbles {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.auto-bubbles::-webkit-scrollbar {
  display: none;
}

.bubble-item {
  flex-shrink: 0;
  background: linear-gradient(135deg, #1AD299 0%, #17C088 100%);
  color: white;
  border-radius: 16px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(26, 211, 153, 0.3);
  white-space: nowrap;
}

.bubble-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 211, 153, 0.4);
}

.bubble-item:active {
  transform: scale(0.95);
}

/* 语音消息 */
.voice-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.voice-message svg {
  flex-shrink: 0;
}

/* 录音状态 */
.voice-icon.recording {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 图片查看器 */
.image-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s;
}

.image-viewer-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.image-viewer-close {
  position: absolute;
  top: -40px;
  right: 0;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.image-viewer-close:hover {
  background: rgba(0, 0, 0, 0.7);
}

.image-viewer-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

/* 微信小程序375px适配 */
@media screen and (max-width: 375px) {
  .customer-service-container {
    width: 100vw;
    max-width: 100vw;
  }
}
</style>

