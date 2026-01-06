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

    <!-- 报告摘要卡片（可展开） -->
    <div class="report-summary" :class="{ expanded: reportExpanded }">
      <div class="report-header" @click="toggleReport">
        <div class="report-header-left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="report-title">当前报告摘要</span>
        </div>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          class="expand-icon"
          :class="{ rotated: reportExpanded }"
        >
          <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="report-content" v-if="reportExpanded">
        <div class="report-item">
          <span class="report-label">肌肤类型：</span>
          <span class="report-value">混合性肌肤</span>
        </div>
        <div class="report-item">
          <span class="report-label">主要问题：</span>
          <span class="report-value">T区出油、毛孔粗大</span>
        </div>
        <div class="report-item">
          <span class="report-label">建议：</span>
          <span class="report-value">控油保湿、定期清洁</span>
        </div>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="messages-container" ref="messagesContainer">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        class="message-wrapper"
        :class="{ 'user-message': message.type === 'user', 'ai-message': message.type === 'ai', 'system-message': message.type === 'system' }"
      >
        <!-- 用户消息 -->
        <div v-if="message.type === 'user'" class="message user">
          <div class="avatar user-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="message-content">
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
import { useRouter } from 'vue-router'

const router = useRouter()

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
  // 这里应该调用实际的AI API，使用RAG + 话术库
  // 现在只是模拟回复

  // 检查是否刚刚测完肤（2小时内）
  const timeSinceLastTest = Date.now() - currentSkinReport.value.lastTestTime.getTime()
  const isRecentTest = timeSinceLastTest < 2 * 60 * 60 * 1000 // 2小时内

  let contextAwareResponse = ''

  // 如果是近期测肤，添加上下文感知
  if (isRecentTest) {
    const hoursAgo = Math.floor(timeSinceLastTest / (60 * 60 * 1000))
    contextAwareResponse = `看到您${hoursAgo > 0 ? hoursAgo + '小时前' : '刚刚'}测出了${currentSkinReport.value.skinType}，主要问题是${currentSkinReport.value.mainProblems.join('、')}。`

    // 检查是否需要转人工
    if (userText.includes('复杂') || userText.includes('严重') || userText.includes('紧急')) {
      setTimeout(() => {
        handleTransferToHuman('检测到您的问题可能需要专业医生指导')
      }, 2000)
    }
  }

  const lowerText = userText.toLowerCase()

  if (lowerText.includes('出油') || lowerText.includes('油')) {
    return `${contextAwareResponse}根据您的测肤报告，T区出油主要是因为皮脂分泌旺盛。建议您：\n1. 使用温和的控油洁面产品\n2. 选择含有水杨酸或烟酰amide成分的护肤品\n3. 定期使用清洁面膜\n4. 保持充足睡眠，避免熬夜`
  } else if (lowerText.includes('毛孔')) {
    return `${contextAwareResponse}针对毛孔粗大的问题，建议您：\n1. 定期深层清洁，每周1-2次使用清洁面膜\n2. 使用含有AHA/BHA成分的产品\n3. 做好防晒，避免紫外线伤害\n4. 保持肌肤水油平衡，避免过度清洁`
  } else if (lowerText.includes('痘痘') || lowerText.includes('痘')) {
    return `${contextAwareResponse}关于痘痘问题，根据您的肌肤类型，建议：\n1. 使用温和的祛痘产品，避免过度刺激\n2. 保持面部清洁，但不要过度清洁\n3. 使用含有水杨酸或茶树精油的护肤品\n4. 避免用手挤压，注意饮食和作息`
  } else if (lowerText.includes('色斑') || lowerText.includes('斑')) {
    return `${contextAwareResponse}针对色斑问题，建议您：\n1. 做好防晒，这是最重要的\n2. 使用含有维生素C、烟酰amide等美白成分的产品\n3. 定期使用美白精华\n4. 避免熬夜，保持良好作息`
  } else {
    const baseResponse = '感谢您的提问。'
    if (isRecentTest) {
      return `${contextAwareResponse}${baseResponse}我已经结合您的最新测肤报告给出了建议。如果您有其他具体问题，可以继续问我。`
    } else {
      return `${baseResponse}根据您的测肤报告，我建议您关注肌肤的控油和保湿平衡。如果您有具体的问题，比如关于痘痘、色斑、毛孔等，可以随时问我，我会结合您的报告数据给出更详细的建议。`
    }
  }
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
    recommend_products: '推荐控油产品',
    cleaning_guide: '如何正确清洁',
    diet_tips: '日常饮食建议',
    pore_tightening: '毛孔收缩方法',
    recommend_toner: '推荐收缩水',
    sunscreen_reminder: '防晒很重要',
    acne_products: '祛痘产品推荐',
    acne_routine: '日常护理步骤',
    acne_diet: '饮食注意事项',
    whitening_products: '美白产品推荐',
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
  gap: 16px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
}

.message {
  display: flex;
  gap: 8px;
  max-width: 95%;
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

.user-message {
  align-items: flex-end;
}

.user-message .message {
  flex-direction: row-reverse;
  margin-left: auto;
}

.ai-message {
  align-items: flex-start;
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

