<template>
  <transition name="fade">
    <div v-if="shouldShow" class="customer-service-float" @click="handleClick">
      <div class="float-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
          <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z" fill="currentColor"/>
        </svg>
      </div>
      <button class="close-btn" @click.stop="handleClose">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: true
    }
  },
  computed: {
    shouldShow() {
      return this.visible && this.$route.path !== '/customer-service'
    }
  },
  mounted() {
    // 从 uni.getStorageSync 读取显示状态
    const savedState = uni.getStorageSync('customerServiceFloatVisible')
    if (savedState !== null && savedState !== undefined) {
      this.visible = savedState === 'true'
    }
  },
  methods: {
    // 点击跳转到客服咨询页面
    handleClick() {
      uni.navigateTo({
        url: '/pages/customer-service'
      })
    },
    // 关闭悬浮按钮
    handleClose() {
      this.visible = false
      uni.setStorageSync('customerServiceFloatVisible', 'false')
    }
  }
}
</script>

<style scoped>
.customer-service-float {
  position: fixed;
  right: 20px;
  bottom: 100px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #1AD299 0%, #17C088 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(26, 211, 153, 0.4);
  cursor: pointer;
  z-index: 999;
  transition: transform 0.2s, box-shadow 0.2s;
}

.customer-service-float:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(26, 211, 153, 0.3);
}

.float-icon {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 24px;
  height: 24px;
  background: #fff;
  border-radius: 50%;
  border: 2px solid #1AD299;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1AD299;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.close-btn:active {
  transform: scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>

