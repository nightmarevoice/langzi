<template>
  <div class="my-container">
    <!-- 顶部栏 -->
    <div class="header">
      <!-- 左侧占位，保持标题居中 -->
      <div class="header-left"></div>
      <!-- 标题居中 -->
      <h1 class="header-title">朗姿医美</h1>
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
            <!-- 外圆环：直径10px，半径5px -->
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
            <!-- 内圆：直径3px，半径1.5px -->
            <circle cx="9" cy="9" r="2" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="content">
      <!-- 个人信息区域 -->
      <div class="profile-section">
        <div class="profile-card">
          <div class="avatar-wrapper">
            <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="头像" class="avatar" />
            <div v-else class="avatar-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          <div class="profile-info">
            <h2 class="nickname">{{ userInfo.nickname || '未设置昵称' }}</h2>
            <div class="profile-tags">
              <span v-if="userInfo.ageRange" class="tag">{{ userInfo.ageRange }}</span>
              <span v-if="userInfo.skinType" class="tag">{{ userInfo.skinType }}</span>
            </div>
          </div>
          <button @click="handleEditProfile" class="edit-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 隐私与授权区域 -->
      <div class="section">
        <h3 class="section-title">隐私与授权</h3>
        <div class="menu-list">
          <div class="menu-item" @click="handlePhotoAuth">
            <div class="menu-item-left">
              <div class="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="menu-text">照片使用授权记录</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="menu-item" @click="handleDataDelete">
            <div class="menu-item-left">
              <div class="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="menu-text">数据删除申请</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 客服咨询入口 -->
      <div class="section">
        <div class="menu-list">
          <div class="menu-item" @click="handleCustomerService">
            <div class="menu-item-left">
              <div class="menu-icon customer-service-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
                  <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z" fill="currentColor"/>
                </svg>
              </div>
              <span class="menu-text">客服咨询</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 消息通知开关区域 -->
      <div class="section">
        <h3 class="section-title">推送设置</h3>
        <div class="menu-list">
          <div class="menu-item">
            <div class="menu-item-left">
              <div class="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="menu-text">测肤结果通知</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="notifications.skinResult" @change="handleNotificationChange('skinResult', $event.target.checked)">
              <span class="slider"></span>
            </label>
          </div>
          <div class="menu-item">
            <div class="menu-item-left">
              <div class="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2V6M12 18V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="menu-text">复查提醒</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="notifications.recheck" @change="handleNotificationChange('recheck', $event.target.checked)">
              <span class="slider"></span>
            </label>
          </div>
          <div class="menu-item">
            <div class="menu-item-left">
              <div class="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8A6 6 0 0 0 6 8C6 11.3137 9 13 12 13M18 8C18 8 20 8 22 10M18 8V6M6 8C6 8 4 8 2 10M6 8V6M12 13V16M12 13C12 13 10.5 13 9 15M12 16C12 16 13.5 16 15 18M12 16C12 16 10.5 16 9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="menu-text">活动推送</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="notifications.activity" @change="handleNotificationChange('activity', $event.target.checked)">
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <TabBar />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '../components/TabBar.vue'

const router = useRouter()

// 用户信息
const userInfo = reactive({
  avatar: '',
  nickname: '用户昵称',
  ageRange: '25-30岁',
  skinType: '混合性肌肤'
})

// 通知设置
const notifications = reactive({
  skinResult: true,
  recheck: true,
  activity: false
})

// 更多操作
const handleMore = () => {
  // TODO: 显示更多操作菜单
  console.log('更多操作')
}

// 编辑个人信息
const handleEditProfile = () => {
  // TODO: 跳转到编辑个人信息页面
  console.log('编辑个人信息')
}

// 照片使用授权记录
const handlePhotoAuth = () => {
  // TODO: 跳转到照片授权记录页面
  console.log('照片使用授权记录')
}

// 数据删除申请
const handleDataDelete = () => {
  // TODO: 跳转到数据删除申请页面
  console.log('数据删除申请')
}

// 客服咨询
const handleCustomerService = () => {
  router.push('/customer-service')
}

// 通知开关变化
const handleNotificationChange = (type, value) => {
  console.log(`通知设置 ${type}: ${value}`)
  // TODO: 保存通知设置到后端
}
</script>

<style scoped>
/* 微信小程序375px适配基础样式 */
.my-container {
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
  cursor: pointer;
  color: #333;
  padding: 0;
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
  background: rgba(0, 0, 0, 0.2);
  margin: 0 2px;
  flex-shrink: 0;
}

/* 主体内容 */
.content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

/* 个人信息区域 */
.profile-section {
  padding: 24px;
  background-color: #fff;
  margin-bottom: 12px;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f5f5f5;
  flex-shrink: 0;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.nickname {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.profile-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  background-color: #f0f9ff;
  color: #1AD299;
  font-size: 12px;
  border-radius: 12px;
  border: 1px solid #e0f2fe;
}

.edit-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0;
  transition: color 0.2s;
  flex-shrink: 0;
}

.edit-btn:active {
  color: #1AD299;
}

/* 区域标题 */
.section {
  background-color: #fff;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  padding: 16px 24px 12px;
  margin: 0;
}

/* 菜单列表 */
.menu-list {
  padding: 0 24px 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background-color: #f9fafb;
}

.menu-item-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.menu-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  flex-shrink: 0;
}

.customer-service-icon {
  color: #1AD299;
}

.menu-text {
  font-size: 15px;
  color: #333;
}

.arrow-icon {
  color: #ccc;
  flex-shrink: 0;
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #1AD299;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

/* 微信小程序375px适配 */
@media screen and (max-width: 375px) {
  .my-container {
    width: 100vw;
    max-width: 100vw;
    min-width: 100vw;
  }
  
  .my-container > * {
    max-width: 100vw;
  }
}
</style>

