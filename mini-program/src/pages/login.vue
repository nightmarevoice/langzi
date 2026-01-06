<template>
  <div class="login-container">
    <!-- 顶部导航 -->
    <div class="header">
      <button @click="handleBack" class="back-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="header-title">手机号登录</h1>
      <div class="header-right"></div>
    </div>

    <!-- 主体内容 -->
    <div class="content">
      <!-- Logo区域 -->
      <div class="logo-section">
        
        <h2 class="app-name">朗姿医美</h2>
        <p class="welcome-text">欢迎来到朗姿医美</p>
      </div>

      <!-- 登录表单 -->
      <div class="login-form">
        <div class="form-section">
         
          <!-- 手机号授权按钮 -->
          <button
            class="phone-auth-btn"
            open-type="getPhoneNumber"
            @getphonenumber="handlePhoneAuth"
            :disabled="!agreeProtocol"
          >
            <div class="btn-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>微信手机号快捷登录</span>
            </div>
          </button>

          <!-- 协议勾选 -->
          <div class="protocol-section">
            <label class="checkbox-container">
              <input
                type="checkbox"
                v-model="agreeProtocol"
                class="checkbox"
              />
              <span class="checkmark"></span>
            </label>
            <div class="protocol-text">
              <span>我已阅读并同意</span>
              <button @click="showPrivacyPolicy" class="protocol-link">《隐私政策》</button>
              <span>和</span>
              <button @click="showServiceTerms" class="protocol-link">《服务条款》</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 协议勾选状态
const agreeProtocol = ref(false)

// 返回上一页
const handleBack = () => {
  router.back()
}

// 手机号授权
const handlePhoneAuth = (e) => {
  console.log('手机号授权事件:', e)

  if (e.detail.errMsg === 'getPhoneNumber:ok') {
    // 用户同意授权
    const { code, encryptedData, iv } = e.detail
    console.log('授权成功:', { code, encryptedData, iv })

    // 模拟登录成功
    if (typeof wx !== 'undefined' && wx.showToast) {
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 2000
      })
    } else {
      // 浏览器环境下的处理
      alert('登录成功')
    }

    // 延迟跳转到个人中心
    setTimeout(() => {
      router.push('/my')
    }, typeof wx !== 'undefined' ? 2000 : 500)

    // TODO: 将code、encryptedData、iv发送到后端进行手机号解密和登录
    // 这里可以调用后端API
  } else {
    // 用户拒绝授权
    console.log('用户拒绝授权')
    if (typeof wx !== 'undefined' && wx.showToast) {
      wx.showToast({
        title: '需要授权手机号才能登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      // 浏览器环境下的处理
      alert('需要授权手机号才能登录')
    }
  }
}

// 微信登录
const handleWechatLogin = () => {
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({
      title: '微信登录功能开发中',
      icon: 'none',
      duration: 2000
    })
  } else {
    // 浏览器环境下的处理
    alert('微信登录功能开发中')
  }
}

// 显示隐私政策
const showPrivacyPolicy = () => {
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({
      title: '隐私政策页面开发中',
      icon: 'none',
      duration: 2000
    })
  } else {
    // 浏览器环境下的处理
    alert('隐私政策页面开发中')
  }
}

// 显示服务条款
const showServiceTerms = () => {
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({
      title: '服务条款页面开发中',
      icon: 'none',
      duration: 2000
    })
  } else {
    // 浏览器环境下的处理
    alert('服务条款页面开发中')
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.back-btn {
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

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-right {
  width: 32px;
}

/* 主体内容 */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 40px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Logo区域 */
.logo-section {
  text-align: center;
  padding: 20px 0;
}

.logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(26, 210, 153, 0.1);
}

.app-name {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.welcome-text {
  font-size: 14px;
  color: #999;
  margin: 0;
}

/* 登录表单 */
.login-form {
  border-radius: 16px;
  padding: 32px 24px;
}

.form-section {
  text-align: center;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.section-desc {
  font-size: 14px;
  color: #999;
  margin: 0 0 32px 0;
}

/* 手机号授权按钮 */
.phone-auth-btn {
  width: 100%;
  padding: 16px 24px;
  background-color: #1AD299;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;
}

.phone-auth-btn:not(:disabled):active {
  transform: scale(0.98);
  opacity: 0.9;
}

.phone-auth-btn:disabled {
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 协议勾选 */
.protocol-section {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
}

.checkbox-container {
  position: relative;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  height: 18px;
  width: 18px;
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox:checked ~ .checkmark {
  background-color: #1AD299;
  border-color: #1AD299;
}

.checkbox:checked ~ .checkmark::after {
  content: '';
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.protocol-text {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  flex: 1;
}

.protocol-link {
  color: #1AD299;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  font-size: 12px;
  cursor: pointer;
}

/* 其他登录方式 */
.other-login {
  background-color: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: #e8e8e8;
}

.divider-text {
  padding: 0 16px;
  font-size: 12px;
  color: #999;
}

.other-options {
  display: flex;
  justify-content: center;
}

.other-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.other-btn:active {
  transform: scale(0.98);
  opacity: 0.8;
}

.wechat-btn {
  border-color: #07c160;
  color: #07c160;
}

/* 微信小程序适配 */
@media screen and (max-width: 375px) {
  .login-container {
    width: 100vw;
    max-width: 100vw;
    min-width: 100vw;
  }
}
</style>
