<template>
  <div class="skin-test-container">
    <!-- 顶部标题栏（可选，如果需要的话） -->
    <div class="header">
      <button @click="handleBack" class="back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <!-- 微信小程序胶囊按钮 -->
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
            <!-- 外圆环：直径10px，半径5px -->
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
            <!-- 内圆：直径3px，半径1.5px -->
            <circle cx="9" cy="9" r="2" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 顶部三个图文示例 -->
    <div class="instruction-panels">
      <div class="instruction-panel">
        <div class="panel-image">
          <!-- 示例图片占位 - 实际使用时替换为真实图片 -->
          <div class="image-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3" stroke="#666" stroke-width="1.5"/>
              <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="#666" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        <p class="panel-text">摘除眼镜,露额头<br>平视相机摄像头</p>
      </div>
      
      <div class="instruction-panel">
        <div class="panel-image">
          <div class="image-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="#666" stroke-width="1.5"/>
              <circle cx="12" cy="12" r="2" fill="#666"/>
            </svg>
          </div>
        </div>
        <p class="panel-text">前后移动手机<br>脸部在识别区域内</p>
      </div>
      
      <div class="instruction-panel">
        <div class="panel-image">
          <div class="image-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="#666" stroke-width="1.5"/>
              <path d="M12 6V12L16 14" stroke="#666" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        <p class="panel-text">保持当前姿势<br>点击拍照按钮</p>
      </div>
    </div>

    <!-- 中间相机预览区域 - 全屏显示 -->
    <div class="camera-area fullscreen">
      <div class="camera-preview" :class="{ 'has-image': selectedImage }">
        <!-- 如果已选择图片，显示图片 -->
        <img v-if="selectedImage" :src="selectedImage" alt="已选照片" class="preview-image" />

        <!-- 实时相机画面 - 总是渲染，但只在有流时显示 -->
        <video
          ref="cameraVideo"
          autoplay
          playsinline
          muted
          class="camera-video"
          :class="{ 'hidden': !cameraStream }"
        ></video>

        <!-- 相机预览占位（当没有相机权限时显示） -->
        <div v-if="!cameraStream" class="camera-placeholder">
          <div class="placeholder-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 4H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="placeholder-text">
              <p class="main-text">正在初始化摄像头...</p>
              <p class="sub-text">首次使用需要允许摄像头权限</p>
            </div>
          </div>
        </div>

        <!-- 人脸定位遮罩（仅在相机模式时显示） -->
        <div  class="face-mask-overlay">
          <div class="face-mask">
            <div class="face-oval">
              <!-- 扫描线动画 -->
              <div class="scan-line horizontal-scan"></div>

              <!-- 精细识别网格 -->
              <div class="recognition-grid">
                <div class="grid-line horizontal top"></div>
                <div class="grid-line horizontal upper-middle"></div>
                <div class="grid-line horizontal middle"></div>
                <div class="grid-line horizontal lower-middle"></div>
                <div class="grid-line horizontal bottom"></div>
                <div class="grid-line vertical left"></div>
                <div class="grid-line vertical left-center"></div>
                <div class="grid-line vertical center"></div>
                <div class="grid-line vertical right-center"></div>
                <div class="grid-line vertical right"></div>
              </div>

              <!-- 皮肤问题识别指引线 -->
              <div class="skin-issue-indicators">
                <!-- 皱纹检测区域 -->
                <div class="skin-indicator wrinkle forehead">
                  <div class="indicator-line"></div>
                  <div class="indicator-label">皱纹</div>
                </div>
                <div class="skin-indicator wrinkle eyes">
                  <div class="indicator-line"></div>
                  <div class="indicator-label">眼角纹</div>
                </div>

                <!-- 斑点检测区域 -->
                <div class="skin-indicator spots cheek-left">
                  <div class="indicator-dot"></div>
                  <div class="indicator-label">色斑</div>
                </div>
                <div class="skin-indicator spots cheek-right">
                  <div class="indicator-dot"></div>
                  <div class="indicator-label">斑点</div>
                </div>

                <!-- 毛孔检测区域 -->
                <div class="skin-indicator pores nose">
                  <div class="indicator-circle"></div>
                  <div class="indicator-label">毛孔</div>
                </div>

                <!-- 黑头检测区域 -->
                <div class="skin-indicator blackheads chin">
                  <div class="indicator-square"></div>
                  <div class="indicator-label">黑头</div>
                </div>
              </div>

              <!-- 增强识别点 -->
              <div class="recognition-dots">
                <div class="recognition-dot dot-1"></div>
                <div class="recognition-dot dot-2"></div>
                <div class="recognition-dot dot-3"></div>
                <div class="recognition-dot dot-4"></div>
                <div class="recognition-dot dot-5"></div>
                <div class="recognition-dot dot-6"></div>
                <div class="recognition-dot dot-7"></div>
                <div class="recognition-dot dot-8"></div>
                <div class="recognition-dot dot-9"></div>
                <div class="recognition-dot dot-10"></div>
              </div>

              <!-- 分析进度指示器 -->
              <div v-if="cameraStream && !selectedImage" class="analysis-progress">
                <div class="progress-ring">
                  <div class="progress-fill"></div>
                </div>
                <div class="analysis-text">分析中...</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 删除按钮（仅在已选图片时显示） -->
        <button v-if="selectedImage" @click="handleDeletePhoto" class="delete-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 底部三个按钮 -->
    <div class="camera-controls">
      <!-- 左侧按钮组 -->
      <div class="left-controls">
        <!-- 相册按钮（仅在未拍照时显示） -->
        <button v-if="!photoTaken" @click="handleUploadPhoto" class="control-btn album-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" stroke-width="2"/>
            <path d="M3 9L9 3H15L21 9V21H3V9Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="8" cy="8" r="2" fill="white"/>
          </svg>
        </button>

        <!-- 重拍按钮（仅在已拍照时显示） -->
        <button v-if="photoTaken" @click="handleRetakePhoto" class="control-btn retake-btn">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C9.3345 21 6.93739 19.9357 5.29168 18.2082" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 9L12 5L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 15L12 19L8 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 12H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- 中间：拍照/确认按钮 -->
      <button @click="handleTakePhoto" class="control-btn capture-btn" :class="{ 'confirm-mode': photoTaken }">
        <div v-if="!photoTaken" class="capture-btn-inner"></div>
        <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- 确认选项菜单 -->
      <div v-if="showConfirmMenu" class="confirm-menu">
        <div class="menu-overlay" @click="showConfirmMenu = false"></div>
        <div class="menu-content">
          <button @click="handleDirectGenerate" class="menu-option">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>直接生成报告</span>
          </button>
          <button @click="handleQuestionnaire" class="menu-option">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>完善问卷信息</span>
          </button>
        </div>
      </div>

      <!-- 右侧：摄像头切换按钮（仅在未拍照时显示） -->
      <button v-if="!photoTaken" @click="handleSwitchCamera" class="control-btn switch-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 4H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17 8L20 5L17 2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 8L4 5L7 2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- 确认菜单 -->
    <div v-if="showConfirmMenu" class="confirm-menu-overlay" @click="hideConfirmMenu">
      <div class="confirm-menu" @click.stop>
        <div class="menu-header">
          <h3>选择操作</h3>
          <button @click="hideConfirmMenu" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="menu-options">
          <button @click="handleDirectGenerate" class="menu-option">
            <div class="option-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="option-content">
              <div class="option-title">直接生成报告</div>
              <div class="option-description">立即分析照片并生成肤质报告</div>
            </div>
          </button>
          <button @click="handleQuestionnaire" class="menu-option">
            <div class="option-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M9 16H15M17 8H7C5.89543 8 5 8.89543 5 10V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V10C19 8.89543 18.1046 8 17 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 6V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="option-content">
              <div class="option-title">完善问卷信息</div>
              <div class="option-description">填写更多信息以获得更准确的分析报告</div>
            </div>
          </button>
        </div>
      </div>
    </div>


    <!-- 隐藏的文件输入 -->
    <input 
      ref="fileInput"
      type="file" 
      accept="image/*"
      capture="user"
      class="hidden-input"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 状态管理
const selectedImage = ref(null)
const agreed = ref(false)
const fileInput = ref(null)
const isFrontCamera = ref(true)
const isSelectingImage = ref(false) // 标记是否正在选择图片
const photoTaken = ref(false) // 标记是否已经拍照但还未确认
const showConfirmMenu = ref(false) // 标记是否显示确认菜单

// 相机相关状态
const cameraStream = ref(null)
const cameraVideo = ref(null)
const currentFacingMode = ref('user') // 'user' for front, 'environment' for back

// 相机功能
const startCamera = async () => {
  try {
    console.log('开始初始化相机...')

    // 检查浏览器是否支持摄像头API
    if (!navigator.mediaDevices) {
      throw new Error('您的浏览器不支持 MediaDevices API')
    }

    if (!navigator.mediaDevices.getUserMedia) {
      throw new Error('您的浏览器不支持 getUserMedia API')
    }

    // 检查是否在安全上下文中
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      throw new Error('摄像头功能需要 HTTPS 安全连接或 localhost 环境')
    }

    // 停止现有的相机流
    if (cameraStream.value) {
      console.log('停止现有相机流...')
      stopCamera()
    }

    const constraints = {
      video: {
        facingMode: currentFacingMode.value,
        width: { ideal: 1280, min: 640 },
        height: { ideal: 720, min: 480 }
      },
      audio: false // 不需要音频
    }

    console.log('请求摄像头权限...', constraints)

    // 检查现有的权限状态
    if (navigator.permissions) {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' })
      console.log('摄像头权限状态:', permissionStatus.state)

      if (permissionStatus.state === 'denied') {
        throw new Error('摄像头权限已被永久拒绝，请在浏览器设置中手动允许')
      }
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    console.log('摄像头权限已获得，流信息:', {
      tracks: stream.getTracks().length,
      videoTracks: stream.getVideoTracks().length,
      audioTracks: stream.getAudioTracks().length
    })

    cameraStream.value = stream

    // 等待DOM更新后设置视频元素
    await nextTick()

    if (cameraVideo.value) {
      cameraVideo.value.srcObject = stream

      // 监听视频加载事件
      cameraVideo.value.onloadedmetadata = () => {
        console.log('视频元数据已加载:', {
          videoWidth: cameraVideo.value.videoWidth,
          videoHeight: cameraVideo.value.videoHeight
        })
      }

      cameraVideo.value.oncanplay = () => {
        console.log('视频可以开始播放')
      }

      console.log('相机画面已设置到视频元素')
    } else {
      console.error('cameraVideo 元素未找到')
      throw new Error('视频元素未正确初始化')
    }

  } catch (error) {
    console.error('无法访问摄像头:', error)

    let errorMessage = '无法访问摄像头'
    let suggestions = []

    if (error.name === 'NotAllowedError') {
      errorMessage = '摄像头权限被拒绝'
      suggestions = [
        '1. 点击浏览器地址栏左侧的摄像头图标',
        '2. 选择"允许"选项',
        '3. 刷新页面重新尝试'
      ]
    } else if (error.name === 'NotFoundError') {
      errorMessage = '未找到摄像头设备'
      suggestions = [
        '1. 确保您的设备有摄像头',
        '2. 检查摄像头是否被其他应用占用',
        '3. 尝试连接外部摄像头'
      ]
    } else if (error.name === 'NotReadableError') {
      errorMessage = '摄像头正在被其他应用使用'
      suggestions = [
        '1. 关闭其他使用摄像头的应用',
        '2. 刷新页面重新尝试'
      ]
    } else if (error.name === 'OverconstrainedError') {
      errorMessage = '摄像头不支持请求的配置'
      suggestions = [
        '1. 尝试切换到其他摄像头',
        '2. 使用较低的分辨率设置'
      ]
    } else if (error.name === 'SecurityError') {
      errorMessage = '安全错误，无法访问摄像头'
      suggestions = [
        '1. 确保使用 HTTPS 协议',
        '2. 或在 localhost 环境下测试',
        '3. 检查浏览器安全设置'
      ]
    } else if (error.message.includes('HTTPS') || error.message.includes('localhost')) {
      errorMessage = error.message
      suggestions = [
        '1. 如果在本地开发，使用: npm run dev',
        '2. 如果部署到服务器，确保使用 HTTPS',
        '3. 检查浏览器控制台以获取更多信息'
      ]
    } else if (error.message.includes('MediaDevices')) {
      errorMessage = '您的浏览器不支持摄像头功能'
      suggestions = [
        '1. 请使用现代浏览器（Chrome, Firefox, Safari, Edge）',
        '2. 更新浏览器到最新版本'
      ]
    } else {
      errorMessage = `摄像头错误: ${error.message}`
      suggestions = [
        '1. 检查浏览器控制台以获取详细错误信息',
        '2. 尝试刷新页面',
        '3. 联系技术支持'
      ]
    }

    const fullMessage = `${errorMessage}\n\n解决建议:\n${suggestions.join('\n')}`
    alert(fullMessage)

    // 在控制台提供更多调试信息
    console.error('摄像头错误详情:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      protocol: location.protocol,
      hostname: location.hostname
    })
  }
}

const stopCamera = () => {
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach(track => track.stop())
    cameraStream.value = null
  }
  if (cameraVideo.value) {
    cameraVideo.value.srcObject = null
  }
}

const switchCamera = async () => {
  currentFacingMode.value = currentFacingMode.value === 'user' ? 'environment' : 'user'
  await startCamera()
}

// 返回上一页
const handleBack = () => {
  router.back()
}

// 返回首页
const handleHome = () => {
  // 在实际小程序中，这里可以调用 wx.reLaunch({ url: '/pages/index/index' }) 或类似API
  // 在H5中，跳转到首页
  router.push('/')
}

// 更多选项
const handleMore = () => {
  // 在实际小程序中，这里可以显示更多选项菜单
  // 在H5中，可以显示一个下拉菜单或弹窗
  console.log('更多选项')
  // 可以在这里添加更多选项的逻辑，比如分享、设置等
}

// 拍照
const handleTakePhoto = () => {
  if (!cameraVideo.value) {
    alert('相机未就绪，请稍后再试')
    return
  }

  if (!photoTaken.value) {
    // 第一次点击：拍照
    try {
      const canvas = document.createElement('canvas')
      const video = cameraVideo.value

      // 设置canvas尺寸
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // 绘制视频帧到canvas
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // 转换为图片URL
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9)
      selectedImage.value = imageUrl

      // 标记已拍照，显示确认按钮
      photoTaken.value = true

      // 关闭相机
      stopCamera()
    } catch (error) {
      console.error('拍照失败:', error)
      alert('拍照失败，请重试')
    }
  } else {
    // 第二次点击：显示确认菜单
    showConfirmMenu.value = true
  }
}

// 跳转到分析页面
const goToAnalysis = (imageUrl) => {
  router.push({
    name: 'PhotoAnalysis',
    query: {
      photo: imageUrl
    }
  })
}

// 上传相册照片
const handleUploadPhoto = () => {
  if (fileInput.value) {
    isSelectingImage.value = true // 开始选择图片，隐藏遮罩
    fileInput.value.removeAttribute('capture')
    fileInput.value.click()

    // 如果用户取消选择，延迟重置状态
    setTimeout(() => {
      isSelectingImage.value = false
    }, 1000)
  }
}

// 重拍照片
const handleRetakePhoto = () => {
  selectedImage.value = null
  photoTaken.value = false
  showConfirmMenu.value = false

  // 重新开启相机
  startCamera()
}

// 隐藏确认菜单
const hideConfirmMenu = () => {
  showConfirmMenu.value = false
}

// 直接生成报告
const handleDirectGenerate = () => {
  if (selectedImage.value) {
    hideConfirmMenu()
    goToAnalysis(selectedImage.value)
  }
}

// 完善问卷信息
const handleQuestionnaire = () => {
  hideConfirmMenu()
  // 跳转到问卷页面，完成后会自动生成报告
  router.push({
    name: 'SkinQuestionnaire',
    query: {
      photo: selectedImage.value
    }
  })
}



// 切换摄像头
const handleSwitchCamera = () => {
  switchCamera()
}

// 生命周期钩子
onMounted(async () => {
  // 页面加载时启动相机
  await startCamera()
})

onBeforeUnmount(() => {
  // 页面卸载时停止相机
  stopCamera()
})

// 文件选择处理
const handleFileChange = (event) => {
  isSelectingImage.value = false // 文件选择完成，重置状态
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target.result
      // 判断是拍照还是从相册选择
      const isCapture = fileInput.value?.getAttribute('capture')
      if (isCapture) {
        // 拍照后直接跳转到分析页面
        goToAnalysis(imageUrl)
      } else {
        // 从相册选择，显示图片并显示重拍/确认按钮
        selectedImage.value = imageUrl
        photoTaken.value = true // 设置为已拍照状态，显示重拍和确认按钮

        // 关闭相机
        stopCamera()
      }
    }
    reader.readAsDataURL(file)
  }
  event.target.value = ''
}

// 删除照片
const handleDeletePhoto = () => {
  selectedImage.value = null
}

// 提交测肤
const handleSubmit = () => {
  if (!selectedImage.value) {
    alert('请先拍摄或上传照片')
    return
  }
  
  if (!agreed.value) {
    alert('请先同意相关协议')
    return
  }
  
  // 跳转到问卷页面，携带图片数据
  router.push({
    name: 'SkinQuestionnaire',
    query: {
      image: selectedImage.value
    }
  })
}
</script>

<style scoped>
.skin-test-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  background-color: #000;
}

/* 顶部标题栏 */
.header {
  position: fixed;
  top: 5px;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
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

.capsule-btn:hover {
  opacity: 1;
}

.capsule-btn:active {
  opacity: 1;
}

.capsule-divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 2px;
  flex-shrink: 0;
}

/* 顶部三个图文示例 */
.instruction-panels {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 999;
  box-sizing: border-box;
  border-radius: 8px;
  margin: 0 16px;
}

.instruction-panel {
  
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.panel-image {
  width: 100px;
  height: 75px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.05);
}

.panel-text {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 1.4;
  margin: 0;
  word-break: break-all;
}

/* 中间相机预览区域 */
.camera-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  min-height: 0;
  width: 100%;
  box-sizing: border-box;
}

.camera-area.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.camera-preview {
  width: 100vw;
  height: 100vh;
  position: relative;
  box-sizing: border-box;
}

.camera-preview.has-image {
  background-color: #000;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.camera-video.hidden {
  display: none;
}

.camera-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-color: #1a1a1a;
  border-radius: 12px;
}

.placeholder-content {
  text-align: center;
  color: #666;
}

.placeholder-text {
  margin-top: 16px;
}

.placeholder-text .main-text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}
.placeholder-text .sub-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.tips {
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tips small {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

/* 全屏半透明脸部轮廓引导框 */
.face-guide-overlay {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 375px;
  max-width: 100vw;
  height: 100vh;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.face-guide-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.face-guide {
  position: relative;
  width: 280px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 6;
}

.face-guide-outer {
  width: 280px;
  height: 420px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  position: relative;
  box-sizing: border-box;
}



/* 人脸定位遮罩 */
.face-mask-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none; /* 不阻止点击事件 */
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 使用径向渐变创建椭圆形镂空 */
.face-mask-overlay {
  background:
    radial-gradient(ellipse 160px 240px at center, transparent 100%, rgba(0, 0, 0, 0.6) 100%);
}

/* 椭圆形边框和识别动画容器 */
.face-oval {
  width: 320px;
  height: 480px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: pulse 2s infinite;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

/* 多重扫描线动画 */
.scan-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent);
  z-index: 2;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
}

.scan-line.horizontal-scan {
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  animation: horizontalScan 4s ease-in-out infinite;
}



@keyframes horizontalScan {
  0% {
    top: 0;
    opacity: 0;
    transform: scaleX(0);
  }
  10% {
    opacity: 1;
    transform: scaleX(1);
  }
  90% {
    opacity: 1;
    transform: scaleX(1);
  }
  100% {
    top: 100%;
    opacity: 0;
    transform: scaleX(0);
  }
}



/* 精细识别网格 */
.recognition-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.grid-line {
  position: absolute;
  background: rgba(0, 255, 255, 0.3);
  animation: gridPulse 2s ease-in-out infinite;
}

.grid-line.horizontal {
  left: 8%;
  right: 8%;
  height: 1px;
}

.grid-line.horizontal.top {
  top: 25%;
  animation-delay: 0s;
}

.grid-line.horizontal.upper-middle {
  top: 40%;
  animation-delay: 0.2s;
}

.grid-line.horizontal.middle {
  top: 50%;
  animation-delay: 0.4s;
}

.grid-line.horizontal.lower-middle {
  top: 60%;
  animation-delay: 0.6s;
}

.grid-line.horizontal.bottom {
  top: 75%;
  animation-delay: 0.8s;
}

.grid-line.vertical {
  top: 8%;
  bottom: 8%;
  width: 1px;
}

.grid-line.vertical.left {
  left: 25%;
  animation-delay: 1s;
}

.grid-line.vertical.left-center {
  left: 40%;
  animation-delay: 1.2s;
}

.grid-line.vertical.center {
  left: 50%;
  animation-delay: 1.4s;
}

.grid-line.vertical.right-center {
  left: 60%;
  animation-delay: 1.6s;
}

.grid-line.vertical.right {
  left: 75%;
  animation-delay: 1.8s;
}

@keyframes gridPulse {
  0%, 100% {
    opacity: 0.2;
    transform: scaleX(0.8);
  }
  50% {
    opacity: 0.7;
    transform: scaleX(1.2);
  }
}

/* 皮肤问题识别指引线 */
.skin-issue-indicators {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}

.skin-indicator {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 5px;
}

.skin-indicator .indicator-label {
  font-size: 10px;
  color: rgba(0, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 4px;
  border-radius: 3px;
  border: 1px solid rgba(0, 255, 255, 0.5);
  white-space: nowrap;
  opacity: 0;
  animation: labelFade 3s ease-in-out infinite;
  animation-delay: 1s;
}

/* 皱纹指示器 */
.skin-indicator.wrinkle .indicator-line {
  width: 30px;
  height: 2px;
  background: rgba(255, 165, 0, 0.8);
  border-radius: 1px;
  animation: wrinklePulse 2s ease-in-out infinite;
}

.skin-indicator.wrinkle.forehead {
  top: 20%;
  left: 45%;
}

.skin-indicator.wrinkle.eyes {
  top: 35%;
  left: 20%;
  transform: rotate(-15deg);
}

/* 斑点指示器 */
.skin-indicator.spots .indicator-dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 0, 255, 0.8);
  border-radius: 50%;
  animation: spotPulse 2.5s ease-in-out infinite;
}

.skin-indicator.spots.cheek-left {
  top: 45%;
  left: 20%;
}

.skin-indicator.spots.cheek-right {
  top: 45%;
  right: 20%;
}

/* 毛孔指示器 */
.skin-indicator.pores .indicator-circle {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 0, 0.8);
  border-radius: 50%;
  animation: porePulse 2s ease-in-out infinite;
}

.skin-indicator.pores.nose {
  top: 50%;
  left: 48%;
  transform: translateX(-50%);
}

/* 黑头指示器 */
.skin-indicator.blackheads .indicator-square {
  width: 12px;
  height: 12px;
  background: rgba(139, 69, 19, 0.8);
  animation: blackheadPulse 3s ease-in-out infinite;
}

.skin-indicator.blackheads.chin {
  top: 75%;
  left: 50%;
  transform: translateX(-50%);
}

@keyframes labelFade {
  0%, 100% {
    opacity: 0;
    transform: translateY(-5px);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes wrinklePulse {
  0%, 100% {
    opacity: 0.4;
    transform: scaleX(0.8);
  }
  50% {
    opacity: 1;
    transform: scaleX(1.2);
  }
}

@keyframes spotPulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
  }
}

@keyframes porePulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes blackheadPulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 增强识别点 */
.recognition-dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}

.recognition-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(0, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.8), 0 0 24px rgba(0, 255, 255, 0.4);
  animation: dotBlink 1.5s ease-in-out infinite;
}

.recognition-dot.dot-1 {
  top: 20%;
  left: 30%;
  animation-delay: 0s;
}

.recognition-dot.dot-2 {
  top: 20%;
  right: 30%;
  animation-delay: 0.2s;
}

.recognition-dot.dot-3 {
  top: 30%;
  left: 20%;
  animation-delay: 0.4s;
}

.recognition-dot.dot-4 {
  top: 30%;
  right: 20%;
  animation-delay: 0.6s;
}

.recognition-dot.dot-5 {
  top: 45%;
  left: 15%;
  animation-delay: 0.8s;
}

.recognition-dot.dot-6 {
  top: 45%;
  right: 15%;
  animation-delay: 1.0s;
}

.recognition-dot.dot-7 {
  top: 55%;
  left: 20%;
  animation-delay: 1.2s;
}

.recognition-dot.dot-8 {
  top: 55%;
  right: 20%;
  animation-delay: 1.4s;
}

.recognition-dot.dot-9 {
  top: 70%;
  left: 30%;
  animation-delay: 1.6s;
}

.recognition-dot.dot-10 {
  top: 70%;
  right: 30%;
  animation-delay: 1.8s;
}

@keyframes dotBlink {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.7);
  }
  50% {
    opacity: 1;
    transform: scale(1.4);
  }
}

/* 分析进度指示器 */
.analysis-progress {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.progress-ring {
  width: 50px;
  height: 50px;
  position: relative;
}

.progress-ring::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid rgba(0, 255, 255, 0.2);
  border-radius: 50%;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid rgba(0, 255, 255, 0.8);
  border-radius: 50%;
  animation: progressRotate 2s linear infinite;
}

.analysis-text {
  font-size: 12px;
  color: rgba(0, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.7);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 255, 0.5);
  animation: textPulse 1.5s ease-in-out infinite;
}

@keyframes progressRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes textPulse {
  0%, 100% {
    opacity: 0.7;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}




/* 确认菜单 */
.confirm-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

.confirm-menu {
  width: 100%;
  max-width: 375px;
  background: #fff;
  border-radius: 16px 16px 0 0;
  animation: slideUp 0.3s ease-out;
  overflow: hidden;
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
}

.menu-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.menu-options {
  padding: 8px 0;
}

.menu-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
}

.menu-option:hover {
  background: rgba(0, 0, 0, 0.02);
}

.menu-option:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.option-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-option:nth-child(1) .option-icon {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.menu-option:nth-child(2) .option-icon {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.option-content {
  flex: 1;
}

.option-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.option-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* 删除按钮 */
.delete-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  box-sizing: border-box;
  z-index: 20; /* 确保在遮罩之上 */
}

.delete-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

/* 底部三个按钮 */
.camera-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  width: 100%;
  position: fixed;
  bottom:0px;
  z-index:10;
}

.left-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  background: transparent;
  box-sizing: border-box;
}

.control-btn:active {
  transform: scale(0.9);
}

.capture-btn {
  width: 72px;
  height: 72px;
  background: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  position: relative;
  box-sizing: border-box;
}

.capture-btn-inner {
  width: 64px;
  height: 64px;
  background: white;
  border-radius: 50%;
  box-sizing: border-box;
}

/* 确认模式样式 */
.capture-btn.confirm-mode {
  background: rgba(76, 175, 80, 0.9);
  border-color: rgba(76, 175, 80, 0.9);
  animation: confirmPulse 0.6s ease-out;
}

/* 重拍按钮样式 */
.retake-btn {
  width: 72px;
  height: 72px;
  background: rgba(255, 59, 48, 0.9);
  border: 2px solid rgba(255, 59, 48, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
}

  .retake-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }

  /* 确认菜单 */
  .confirm-menu {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2000;
    animation: slideUp 0.3s ease-out;
  }

  .menu-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .menu-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-radius: 16px 16px 0 0;
    padding: 8px;
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.1);
  }

  .menu-option {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: transparent;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    color: #333;
    cursor: pointer;
    transition: background 0.2s;
    text-align: left;
  }

  .menu-option:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .menu-option svg {
    color: #1AD299;
    flex-shrink: 0;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

@keyframes confirmPulse {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 底部提交区域 */
.submit-area {
  padding: 16px;
  background-color: #2a2a2a;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 375px;
  box-sizing: border-box;
}

.agreement {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
}

.checkbox {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  cursor: pointer;
  flex-shrink: 0;
}

.agreement-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  flex: 1;
}

.link {
  color: #1AD299;
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #1AD299;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  box-sizing: border-box;
}

.submit-btn:active:not(.disabled) {
  transform: scale(0.98);
}

.submit-btn.disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.5;
}

.hidden-input {
  display: none;
}

/* 移动设备适配 */
@media screen and (max-width: 768px) {
  .skin-test-container {
    width: 100vw;
    height: 100vh;
  }

  .camera-area.fullscreen {
    width: 100vw;
    height: 100vh;
  }

  .camera-preview {
    width: 100vw;
    height: 100vh;
  }

  .instruction-panels {
    top: 50px;
    margin: 0 8px;
    padding: 8px;
    gap: 8px;
  }

  .instruction-panel {
    min-width: 80px;
  }

  .panel-image {
    width: 100px;
    height: 75px;
  }

  .camera-controls {
    padding: 16px 24px;
  }

  .control-btn {
    width: 40px;
    height: 40px;
  }

  .capture-btn {
    width: 60px;
    height: 60px;
  }

  .capture-btn-inner {
    width: 52px;
    height: 52px;
  }

  .retake-btn {
    width: 60px;
    height: 60px;
  }
}
</style>
